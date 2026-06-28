import TdsRecord from '../../models/TdsRecord.js';
import Dealer from '../../models/Dealer.js';
import { parseTdsSheet } from '../../utils/agriDataParsers.js';

export async function uploadTds(req, res) {
   if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

   const { financialYear } = req.body;
   if (!financialYear) return res.status(400).json({ error: 'financialYear is required.' });

   try {
      const records = parseTdsSheet(req.file.buffer, financialYear);

      // ── 1. Empty dealerName ya farmerDealerCode ───────────────────────────
      const emptyDealer = records.filter(r => !r.dealerName || !r.farmerDealerCode);
      if (emptyDealer.length > 0) {
         return res.status(422).json({
            error: `${emptyDealer.length} record(s) have empty dealerName or farmerDealerCode: ` +
               emptyDealer.map(r => `Sr.No ${r.srNo ?? '?'}`).join(', '),
         });
      }

      // ── 2. DB se dealer codes fetch karo ─────────────────────────────────
      const codesInFile = [...new Set(records.map(r => r.farmerDealerCode))];
      const dbDealers = await Dealer.find({ farmerDealerCode: { $in: codesInFile } }).lean();
      const dbDealerMap = new Map(dbDealers.map(d => [d.farmerDealerCode, d.dealerName]));

      // ── 3. Code exist nahi karta ──────────────────────────────────────────
      const invalidCodes = codesInFile.filter(code => !dbDealerMap.has(code));
      if (invalidCodes.length > 0) {
         const details = invalidCodes.map(code => {
            const rec = records.find(r => r.farmerDealerCode === code);
            return `${code} (${rec?.dealerName ?? '?'})`;
         });
         return res.status(422).json({
            error: `These dealer codes do not exist in the system: ${details.join(', ')}`,
         });
      }

      // ── 4. ✅ Har record ke liye name mismatch check karo ─────────────────
      const nameMismatch = [];
      for (const rec of records) {
         const dbName    = dbDealerMap.get(rec.farmerDealerCode)?.trim().toLowerCase();
         const excelName = rec.dealerName?.trim().toLowerCase();

         if (dbName && excelName && dbName !== excelName) {
            nameMismatch.push(
               `Sr.No ${rec.srNo ?? '?'} — Code ${rec.farmerDealerCode}: ` +
               `Excel has "${rec.dealerName}" but system has "${dbDealerMap.get(rec.farmerDealerCode)}"`
            );
         }
      }
      if (nameMismatch.length > 0) {
         return res.status(422).json({
            error: `Dealer name mismatch found — ${nameMismatch.length} record(s):\n${nameMismatch.join('\n')}`,
         });
      }

      // ── 5. Sab valid — save karo ──────────────────────────────────────────
      await TdsRecord.deleteMany({ financialYear });
      await TdsRecord.insertMany(records);

      return res.json({
         message: 'TDS upload complete!',
         collection: 'tds_records',
         inserted: records.length,
      });

   } catch (err) {
      const isValidationError = err.message.startsWith('TDS sheet validation failed');
      return res.status(isValidationError ? 422 : 500).json({
         error: err.message,
      });
   }
}