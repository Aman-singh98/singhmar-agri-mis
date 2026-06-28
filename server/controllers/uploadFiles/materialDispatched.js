import MaterialDispatched from '../../models/materialDispatchDetails/MaterialDispatched.js';
import Receipt from '../../models/materialDispatchDetails/Receipt.js';
import AdjustedSheet from '../../models/materialDispatchDetails/AdjustedSheet.js';
import { parseMaterialDispatchedSheet, parseReceiptsSheet, parseAdjustedSheet } from '../../utils/agriDataParsers.js';

// POST /api/upload/material_dispatch_details — fills 3 collections from one file
// Sheets: ACRE DETAILS → material_dispatched_acre_details
//         RECIEPTS     → material_dispatched_receipts
//         AGJUSTED SHEET → material_dispatched_adjusted
export async function uploadMaterial(req, res) {
   if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

   const { financialYear } = req.body;
   if (!financialYear) return res.status(400).json({ error: 'financialYear is required.' });

   try {
      // Parse all 3 sheets first — if any throws a validation error, nothing is written to DB
      const dispatched = parseMaterialDispatchedSheet(req.file.buffer, financialYear);
      const receipts = parseReceiptsSheet(req.file.buffer, financialYear);
      const adjusted = parseAdjustedSheet(req.file.buffer, financialYear);

      // All parsed successfully — now delete old data and insert new
      await MaterialDispatched.deleteMany({ financialYear });
      await MaterialDispatched.insertMany(dispatched);

      await Receipt.deleteMany({ financialYear });
      await Receipt.insertMany(receipts);

      await AdjustedSheet.deleteMany({ financialYear });
      await AdjustedSheet.insertMany(adjusted);

      return res.json({
         message: 'Material Dispatched upload complete!',
         results: [
            { collection: 'material_dispatched_acre_details', inserted: dispatched.length },
            { collection: 'material_dispatched_receipts', inserted: receipts.length },
            { collection: 'material_dispatched_adjusted', inserted: adjusted.length },
         ],
      });
   } catch (err) {
      return res.status(500).json({ error: err.message });
   }
}
