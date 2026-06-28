// import xlsx from "xlsx";
// import FarmerShareDetail from "../models/FarmerShareDetail.js";

// // ─── Helpers ────────────────────────────────────────────────────────────────

// /**
//  * Convert an Excel serial date number OR a date string like "23-12-2022"
//  * into a JS Date. Returns null if the value is empty / unparseable.
//  */
// const parseExcelDate = (value) => {
//    if (value === null || value === undefined || value === "") return null;

//    // Already a JS Date (xlsx sometimes parses dates automatically)
//    if (value instanceof Date) return value;

//    // Excel serial number
//    if (typeof value === "number") {
//       const date = xlsx.SSF.parse_date_code(value);
//       if (date) {
//          return new Date(date.y, date.m - 1, date.d);
//       }
//    }

//    // String like "23-12-2022" or "2022-12-23"
//    if (typeof value === "string") {
//       const parts = value.split("-");
//       if (parts.length === 3) {
//          // DD-MM-YYYY
//          if (parts[0].length <= 2) {
//             return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
//          }
//          // YYYY-MM-DD
//          return new Date(value);
//       }
//    }

//    return null;
// };

// const toNum = (v) => {
//    const n = parseFloat(v);
//    return isNaN(n) ? null : n;
// };

// const toStr = (v) =>
//    v !== null && v !== undefined && String(v).trim() !== ""
//       ? String(v).trim()
//       : null;

// /**
//  * Map one raw Excel row (object keyed by header) to a DB document.
//  * Header names come from the sheet as-is, so we match by expected label.
//  */
// const mapRow = (row, financialYear) => ({
//    financialYear,
//    farmerDealerCode: toStr(row["DEALER CODE"]) ?? "MP/08",
//    srNo: toNum(row["Sr. No."]),
//    name: toStr(row["NAME"]),
//    miNumber: toStr(row["MI Number"]),
//    brandName: toStr(row["BRAND NAME"]),
//    mobileNo: toStr(row["Mobile No."]),
//    areaInAcre: toNum(row["AREA IN ACER "]) ?? toNum(row["AREA IN ACER"]),
//    village: toStr(row["VILLAGE"]),
//    type: toStr(row["TYPE"]),
//    dealerName: toStr(row["DEALER NAME "]) ?? toStr(row["DEALER NAME"]),
//    scanNo: toStr(row["Scan no."]),
//    estimateAmount: toNum(row["Estimate Amount"]),
//    onlineFarmerShareStatus: toStr(row["Online Farmer Share Status"]),
//    challanSubmitted: toStr(row["Challan Submitted"]),
//    cadaAccountNo: toStr(row["CADA Account no."]),
//    farmerShare: toNum(row["Farmer Share"]),
//    farmerSharePercentage: toNum(row["%"]),
//    perAcreCosting: toNum(row["per acre costing"]),
//    difference: toNum(row["Difference"]),
//    farmerShareDeposit: toNum(row["Farmer Share Deposit"]),
//    depositDate: parseExcelDate(row["Date"]),
//    returnFarmerShare: toNum(row["Return Farmer Share"]),
//    returnDate: parseExcelDate(row["Return Date"]),
// });

// // ─── Controllers ────────────────────────────────────────────────────────────

// /**
//  * POST /api/farmer-share-details/upload
//  * Body (multipart/form-data):
//  *   - file            : Excel file (.xlsx)
//  *   - farmerDealerCode: string
//  *   - financialYear   : string  e.g. "2022-23"
//  *
//  * Behaviour: deletes existing records for the same dealer + year, then inserts fresh.
//  */
// export const uploadFarmerShareDetails = async (req, res) => {
//    try {
//       const { financialYear } = req.body;

//       if (!financialYear) {
//          return res.status(400).json({
//             message: "farmerDealerCode and financialYear are required",
//          });
//       }

//       if (!req.file) {
//          return res.status(400).json({ message: "Excel file is required" });
//       }

//       // Parse workbook from the buffer provided by multer (memoryStorage)
//       const workbook = xlsx.read(req.file.buffer, {
//          type: "buffer",
//          cellDates: true, // tell xlsx to auto-convert serial dates
//       });

//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];

//       // Convert to array of objects; skip empty rows
//       const rows = xlsx.utils
//          .sheet_to_json(sheet, { defval: null })
//          .filter((row) => row["Sr. No."] !== null && row["NAME"] !== null);

//       if (rows.length === 0) {
//          return res
//             .status(400)
//             .json({ message: "No valid data rows found in the Excel file" });
//       }

//       const documents = rows.map((row) =>
//          mapRow(row, financialYear)
//       );

//       // Replace existing data for this dealer + year
//       await FarmerShareDetail.deleteMany({ financialYear });
//       await FarmerShareDetail.insertMany(documents, { ordered: false });

//       return res.status(201).json({
//          message: "Farmer share details uploaded successfully",
//          totalRecords: documents.length,
//          financialYear
//       });
//    } catch (err) {
//       console.error("uploadFarmerShareDetails error:", err);
//       return res
//          .status(500)
//          .json({ message: err.message || "Internal server error" });
//    }
// };
















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