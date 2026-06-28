import XLSX from 'xlsx';
import { extractFYFromMINumber } from './helpers.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

const toStr = (val) => {
   if (val === null || val === undefined) return null;
   const s = String(val).trim();
   return s === '' || s === 'NaN' ? null : s;
};

const toNum = (val) => {
   const n = parseFloat(val);
   return isNaN(n) ? null : n;
};

function readSheet(workbook, sheetName) {
   const sheet = workbook.Sheets[sheetName];
   if (!sheet) return [];
   return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
}

// ── MI Classification Helper ─────────────────────────────────────────────────
/**
 * MI Number ke basis pe onlineStatus auto-derive karta hai:
 *   - Empty/null     → "Offline"  (Without MI)
 *   - /^MI\d+$/i    → "Online"   (Valid MI format)
 *   - Kuch aur      → "Error"    (Invalid/unknown format)
 *
 * @param {string|null} miNumber
 * @returns {"Online"|"Offline"|"Error"}
 */
function classifyMIStatus(miNumber) {
   const val = String(miNumber ?? '').trim();
   if (!val)                   return 'Offline'; // Without MI
   if (/^MI\d+$/i.test(val))  return 'Online';  // Valid MI format
   return 'Error';                               // Invalid/other
}

// ── MICADA.xlsx → "MICADA" sheet ─────────────────────────────────────────────
/**
 * Parse MICADA Sheet
 *
 * Columns (0-indexed):
 *   0  APP ID / MI NUMBER
 *   1  Programme Name / IRRIGATION TYPE
 *   2  Farmer Name
 *   3  Village
 *   4  Block
 *   5  District
 *   6  Mobile
 *   7  Address
 *   8  Date of Registration / DATE OF APPLICATION
 *   9  Total Area / ACRA
 *   10 Current Status
 *   11 Remarks
 *   12 Status
 *
 * @param {Buffer} buffer - Excel file buffer
 * @returns {{ docs: Array, skipped: Array }}
 */
export const parseMicadaSheet = (buffer) => {
   const wb = XLSX.read(buffer, { type: "buffer", cellDates: true });

   const sheetName = wb.SheetNames.find(n =>
      n.trim().toUpperCase().includes("MICADA")
   );

   if (!sheetName) {
      throw new Error('Sheet "MICADA" not found in the uploaded file.');
   }

   const rows = XLSX.utils.sheet_to_json(
      wb.Sheets[sheetName],
      { header: 1, defval: null }
   );

   if (rows.length < 2) {
      return { docs: [], skipped: [] };
   }

   const docs = [];
   const skipped = [];

   for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      if (!row || row.every(c => c === null || c === undefined || c === "")) {
         continue;
      }

      const appId = toStr(row[0]);

      if (!appId) {
         skipped.push({ row: i + 1, reason: "Missing APP ID / MI NUMBER" });
         continue;
      }

      const financialYear = extractFYFromMINumber(appId);

      if (!financialYear) {
         skipped.push({ row: i + 1, reason: `Cannot extract FY from MI number: ${appId}` });
         continue;
      }

      docs.push({
         financialYear,
         appId,
         programmeName: toStr(row[1]),
         farmerName: toStr(row[2]),
         village: toStr(row[3]),
         block: toStr(row[4]),
         district: toStr(row[5]),
         mobile: toStr(row[6]),
         address: toStr(row[7]),
         dateOfApplication: toStr(row[8]),
         totalArea: toNum(row[9]),
         currentStatus: toStr(row[10]),
         remarks: toStr(row[11]),
         status: toStr(row[12]),
      });
   }

   return { docs, skipped };
};


// ── MAIN FILE.xlsx → "MAIN FILE LIST" sheet ───────────────────────────────────
/**
 * Parse Main File List Sheet
 *
 * Key columns (0-indexed):
 *   0   Sr. No.
 *   1   SCAN NO.
 *   2   BRAND NAME
 *   3   NAME
 *   4   Father Name
 *   5   Mobile No.
 *   6   DEALER NAME
 *   7   FARMER CODE / DEALER CODE
 *   8   ADDRESS
 *   9   Block
 *   10  District
 *   11  IRRIGATION TYPE
 *   12  AREA IN ACER
 *   13  Family Id
 *   14  Farmer Code
 *   15  MI NUMBER
 *   16  Application Status
 *
 * Note: onlineStatus aur error columns Excel se nahi padhte —
 *       onlineStatus MI NUMBER se auto-derive hota hai,
 *       error MICADA comparison ke baad controller/service mein set hota hai.
 *
 * @param {Buffer} buffer - Excel file buffer
 * @returns {{ docs: Array, skipped: Array }}
 */
export const parseMainFileSheet = (buffer) => {
  const wb = XLSX.read(buffer, { type: 'buffer', cellDates: true });

  const sheetName = wb.SheetNames.find((n) =>
    n.trim().toUpperCase().includes('MAIN')
  );

  if (!sheetName) {
    throw new Error('"MAIN FILE LIST" sheet not found in the uploaded file.');
  }

  const rows = readSheet(wb, sheetName);

  if (rows.length < 2) {
    return { docs: [], skipped: [] };
  }

  const docs = [];
  const skipped = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    if (!row || row.every((c) => c === null || c === undefined || c === '')) {
      continue;
    }

    const miNumber = toStr(row[15]);
    const scanNo   = toStr(row[1]);

    // ✅ Dono nahi hain tabhi skip karo
    if (!miNumber && !scanNo) {
      skipped.push({ row: i + 1, reason: 'No MI NUMBER or SCAN NO' });
      continue;
    }

    // ✅ FY extract karo — agar nahi mili to null rakhho, skip mat karo
    const financialYear = miNumber ? extractFYFromMINumber(miNumber) : null;

    // ✅ onlineStatus auto-derive: MI format ke basis pe classify karo
    const onlineStatus = classifyMIStatus(miNumber);

    docs.push({
      financialYear,         // null bhi ho sakta hai — koi problem nahi
      srNo: toNum(row[0]),
      scanNo,
      brandName: toStr(row[2]),
      name: toStr(row[3]),
      fatherName: toStr(row[4]),
      mobileNo: toStr(row[5]),
      dealerName: toStr(row[6]),
      farmerDealerCode: toStr(row[7]),
      address: toStr(row[8]),
      block: toStr(row[9]),
      district: toStr(row[10]),
      irrigationType: toStr(row[11]),
      areaInAcre: toNum(row[12]),
      familyId: toStr(row[13]),
      farmerCode: toStr(row[14]),
      miNumber,
      applicationStatus: toStr(row[16]),  // Excel ka actual Application Status column
      onlineStatus,   // ✅ auto-derived from miNumber — Excel se nahi
      error: null,    // ✅ default null — MICADA mismatch pe service/controller set karega
    });
  }

  return { docs, skipped };
};