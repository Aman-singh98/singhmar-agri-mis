

import MainRecord from "../../models/MainRecord.js";
import { parseMainSheet } from "../../utils/_0_mainFileParasers.js";

// POST /api/upload/main
export async function uploadMainFile(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const records = parseMainSheet(req.file.buffer);

    if (!records.length) {
      return res.status(422).json({ error: "No valid records found." });
    }

    const today = new Date().toISOString().split("T")[0]; // "2025-06-22"

    // Sirf aaj ka data delete karo (same day dobara upload case)
    await MainRecord.deleteMany({ uploadDate: today });

    // Aaj ki date ke saath insert karo
    const recordsWithDate = records.map(r => ({ ...r, uploadDate: today }));
    await MainRecord.insertMany(recordsWithDate);

    // Sirf last 2 uploads rakho — baaki purana delete karo
    const distinctDates = await MainRecord.distinct("uploadDate");
    const sortedDates = distinctDates.sort().reverse(); // latest first
    if (sortedDates.length > 2) {
      const datesToDelete = sortedDates.slice(2);
      await MainRecord.deleteMany({ uploadDate: { $in: datesToDelete } });
    }

    const financialYears = [...new Set(records.map(r => r.financialYear))];

    return res.json({
      message: "Main file upload complete!",
      collection: "main_records",
      inserted: records.length,
      uploadDate: today,
      financialYears,
    });
  } catch (err) {
    const isValidationError = err.message.includes("Main sheet validation failed");
    return res.status(isValidationError ? 422 : 500).json({ error: err.message });
  }
}

// GET /api/main-fy-sheet
export async function getMainFYSheet(req, res) {
  try {
    // Saare distinct upload dates lo — sorted latest first
    const distinctDates = await MainRecord.distinct("uploadDate");
    const sortedDates = distinctDates.sort().reverse();

    if (!sortedDates.length) {
      return res.status(404).json({ success: false, message: "No records found." });
    }

    const latestDate = sortedDates[0];           // aaj ka upload
    const prevDate   = sortedDates[1] ?? null;   // last upload (chahe kab bhi ho)

    // Records fetch karo
    const records     = await MainRecord.find({ uploadDate: latestDate }).lean();
    const prevRecords = prevDate
      ? await MainRecord.find({ uploadDate: prevDate }).lean()
      : [];

    const uniqueDealers = new Set(records.map(r => r.farmerDealerCode).filter(Boolean));

    const summary = {
      totalRecords:     records.length,
      totalDealers:     uniqueDealers.size,
      totalAreaAcre:    records.reduce((s, r) => s + (Number(r.areaInAcre)  || 0), 0),
      totalBillValue:   records.reduce((s, r) => s + (Number(r.billValue)   || 0), 0),
      totalFarmerShare: records.reduce((s, r) => s + (Number(r.farmerShare) || 0), 0),
    };

    return res.json({
      success: true,
      mainFYSheet: {
        records,
        prevRecords,
        summary,
        uploadDate: latestDate,
        prevUploadDate: prevDate,
      },
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}


