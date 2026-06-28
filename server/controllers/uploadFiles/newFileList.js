import { parseExcelFile } from '../../utils/excelParserLegacy.js';
import { NewFileList2223, DealerSummary } from '../../models/newFileList/index.js';

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

export async function uploadNewFileList(req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const { originalname: originalName, buffer } = req.file;
  const { financialYear } = req.body;

  if (!financialYear) {
    return res.status(400).json({ success: false, message: 'financialYear is required.' });
  }

  try {
    const parsed = parseExcelFile(buffer, 'new_file_list');

    const [newFileList2223Result, dealerSummaryResult] = await Promise.all([
      insertDocs(NewFileList2223, parsed.newFileList2223, financialYear, originalName),
      insertDocs(DealerSummary, parsed.dealerSummary, financialYear, originalName),
    ]);

    const counts = {
      newFileList2223: newFileList2223Result.count,
      dealerSummary: dealerSummaryResult.count,
    };

    const errors = [
      ...(parsed.errors ?? []),
      newFileList2223Result.error,
      dealerSummaryResult.error,
    ].filter(Boolean);

    return res.json({
      success: true,
      counts,
      skipped: parsed.skipped ?? [],
      errors,
    });

  } catch (err) {
    console.error('NEW FILE LIST UPLOAD ERROR:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
