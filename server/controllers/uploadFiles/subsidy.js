// import SubsidyRecord from '../../models/Subsidy.js';
// import { parseSubsidySheet } from '../../utils/agriDataParsers.js';

// // POST /api/upload/subsidy — Subsidy
// export async function uploadSubsidy(req, res) {
//    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

//    const { financialYear } = req.body;
//    if (!financialYear) return res.status(400).json({ error: 'financialYear is required.' });

//    try {
//       const records = parseSubsidySheet(req.file.buffer, financialYear);
//       await SubsidyRecord.deleteMany({ financialYear });
//       await SubsidyRecord.insertMany(records);
//       return res.json({
//          message: 'Subsidy record upload complete!',
//          collection: 'subsidy_records',
//          inserted: records.length,
//       });
//    } catch (err) {
//       // parseSubsidySheet throws with a structured message listing every bad row.
//       // Return 422 so the client knows it's a data problem, not a server crash.
//       const isValidationError = err.message.startsWith('Subsidy sheet validation failed');
//       return res.status(isValidationError ? 422 : 500).json({ error: err.message });
//    }
// }











import SubsidyRecord from "../../models/Subsidy.js";
import { parseSubsidySheet } from "../../utils/agriDataParsers.js";

// POST /api/upload/subsidy
export async function uploadSubsidy(req, res) {
  if (!req.file) {
    return res.status(400).json({
      error: "No file uploaded.",
    });
  }

  try {
    // FY is extracted from Application ID / MI Number
    const records = parseSubsidySheet(req.file.buffer);

    if (!records.length) {
      return res.status(400).json({
        error: "No valid subsidy records found.",
      });
    }

    // Delete old records by financial year before inserting new ones
    const years = [...new Set(records.map((r) => r.financialYear))];

    await SubsidyRecord.deleteMany({ financialYear: { $in: years } });
    await SubsidyRecord.insertMany(records);

    return res.json({
      message: "Subsidy record upload complete!",
      collection: "subsidy_records",
      inserted: records.length,
      financialYears: years,
    });
  } catch (err) {
    const isValidationError = err.message.startsWith("Subsidy sheet validation failed");

    return res.status(isValidationError ? 422 : 500).json({
      error: err.message,
    });
  }
}