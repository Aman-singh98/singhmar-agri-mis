import FarmerShareDetail from "../models/FarmerShareDetail.js";
import { parseExcelFile } from "../utils/_farmerShareParsers.js";

// POST /api/upload/farmer-share
export async function uploadFarmerShareFile(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const parsed = parseExcelFile(req.file.buffer, "farmer_share");
    const records = parsed.farmerChallanDetails ?? [];

    if (!records.length) {
      return res.status(422).json({ error: "No valid records found in Farmer Challan Details sheet." });
    }

    // Saare distinct financialYears jo parse hue
    const financialYears = [...new Set(records.map(r => r.financialYear).filter(Boolean))];

    // Har financialYear ka purana data replace karo
    if (financialYears.length) {
      await FarmerShareDetail.deleteMany({ financialYear: { $in: financialYears } });
    }

    await FarmerShareDetail.insertMany(records, { ordered: false });

    return res.status(201).json({
      message: "Farmer share details uploaded successfully.",
      collection: "farmer_share_details",
      inserted: records.length,
      financialYears,
    });
  } catch (err) {
    const isValidationError = err.message?.includes("Farmer Challan Details validation failed");
    return res.status(isValidationError ? 422 : 500).json({ error: err.message });
  }
}

// GET /api/farmer-share
export async function getFarmerShareDetails(req, res) {
  try {
    const { financialYear, farmerDealerCode } = req.query;

    const filter = {};
    if (financialYear) filter.financialYear = financialYear;
    if (farmerDealerCode) filter.farmerDealerCode = farmerDealerCode;

    const records = await FarmerShareDetail.find(filter).lean();

    if (!records.length) {
      return res.status(404).json({ success: false, message: "No records found." });
    }

    const uniqueDealers = new Set(records.map(r => r.farmerDealerCode).filter(Boolean));

    const summary = {
      totalRecords:       records.length,
      totalDealers:       uniqueDealers.size,
      totalAreaAcre:      records.reduce((s, r) => s + (Number(r.areaInAcre)         || 0), 0),
      totalFarmerShare:   records.reduce((s, r) => s + (Number(r.farmerShare)        || 0), 0),
      totalFarmerDeposit: records.reduce((s, r) => s + (Number(r.farmerShareDeposit) || 0), 0),
      totalReturnShare:   records.reduce((s, r) => s + (Number(r.returnFarmerShare)  || 0), 0),
    };

    return res.json({
      success: true,
      farmerShareDetails: {
        records,
        summary,
        financialYear: financialYear ?? null,
        farmerDealerCode: farmerDealerCode ?? null,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}