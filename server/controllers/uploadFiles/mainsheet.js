import { parseExcelFile } from '../../utils/excelParser.js';
import { MainData, BillUpload, TallyBill } from '../../models/mainsheet/index.js';

async function insertDocs(Model, rawDocs, financialYear, uploadedFile) {
   if (!rawDocs?.length) return { count: 0, error: null };

   const docs = rawDocs.map((d) => ({ ...d, financialYear, uploadedFile }));

   try {
      const result = await Model.insertMany(docs, { ordered: false });
      return { count: result.length, error: null };
   } catch (err) {
      const inserted = err.insertedDocs?.length ?? 0;
      return { count: inserted, error: err.message };
   }
}

export async function uploadMainSheet(req, res) {
   if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
   }

   const { buffer, originalname: originalName } = req.file;
   const { financialYear } = req.body;

   if (!financialYear) {
      return res.status(400).json({ success: false, message: 'financialYear is required.' });
   }

   try {
      const parsed = parseExcelFile(buffer, originalName);

      const [mainDataResult, billUploadResult, tallyBillResult] = await Promise.all([
         insertDocs(MainData, parsed.mainData, financialYear, originalName),
         insertDocs(BillUpload, parsed.billUpload, financialYear, originalName),
         insertDocs(TallyBill, parsed.tallyBill, financialYear, originalName),
      ]);

      const counts = {
         mainData: mainDataResult.count,
         billUpload: billUploadResult.count,
         tallyBill: tallyBillResult.count,
      };

      const errors = [
         ...parsed.errors,
         mainDataResult.error,
         billUploadResult.error,
         tallyBillResult.error,
      ].filter(Boolean);

      return res.json({
         success: true,
         counts,
         skipped: parsed.skipped ?? [],
         errors,
      });

   } catch (err) {
      console.error('UPLOAD ERROR:', err);
      return res.status(500).json({ success: false, message: err.message });
   }
}
