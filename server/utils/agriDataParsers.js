/**
 * This file used for following::
 * 1. TDS.xlsx
 * 2. Subsidy.xlsx
 * 3. Material_Dispatched_Detail.xlsx
 */
import XLSX from 'xlsx';
import { extractFYFromMINumber } from "./helpers.js";
// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------
function parseDate(value) {
   if (!value) return null;
   if (value instanceof Date) return isNaN(value) ? null : value;

   if (typeof value === 'number') {
      const date = XLSX.SSF.parse_date_code(value);
      if (date) return new Date(date.y, date.m - 1, date.d);
      return null;
   }

   const str = String(value).trim();

   if (str.includes('.')) {
      const parts = str.split('.');
      if (parts.length === 3) {
         let [d, m, y] = parts;
         if (y.length === 2) y = '20' + y;
         const date = new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
         return isNaN(date) ? null : date;
      }
   }

   if (str.includes('/')) {
      const parts = str.split('/');
      if (parts.length === 3) {
         let [d, m, y] = parts;
         if (y.length === 2) y = '20' + y;
         const date = new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
         return isNaN(date) ? null : date;
      }
   }

   return null;
}

function toNum(val) {
   const n = parseFloat(val);
   return isNaN(n) ? null : n;
}

function toStr(val) {
   if (val === null || val === undefined) return null;
   const s = String(val).trim();
   return s === '' || s === 'NaN' ? null : s;
}

// ---------------------------------------------------------------------------
// Read a sheet as raw rows
// ---------------------------------------------------------------------------
function readSheet(workbook, sheetName) {
   const sheet = workbook.Sheets[sheetName];
   if (!sheet) return [];
   return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
}

// ---------------------------------------------------------------------------
// FILE 1: TDS_Paid_FY_2022-23.xlsx  →  TDS
// row0: company title
// row1: report title
// row2: empty
// row3: headers:
//   r[0]  Sr.No
//   r[1]  DEALERS        → dealerName       (required)
//   r[2]  farmerDealerCode                  (required)
//   r[3]  company abbrev (e.g. "MIC")       (no schema field, ignored)
//   r[4]  NAME           → name
//   r[5]  FATHER NAME    → fatherName
//   r[6]  ADDRESS        → address
//   r[7]  PAN NO.        → panNo
//   r[8]  TRUNOVER       → turnover
//   r[9]  COMMISION AMT  → commissionAmount
//   r[10] TDS AMOUNT     → tdsAmount   
//   r[11] PAYBALE AMOUNT → payableAmount
//   r[12] TDS            → TDS
// row4+: data
// ---------------------------------------------------------------------------
export function parseTdsSheet(buffer, financialYear) {
   const wb = XLSX.read(buffer, { type: 'buffer' });

   // Sheet is named "TDS" in the actual file
   const sheetName = wb.SheetNames.find(n => n.trim() === 'TDS') || wb.SheetNames[0];
   const rows = readSheet(wb, sheetName);

   const errors = [];
   const data = [];

// i=3 se shuru karo (row 4 = headers, row 5 = i=4 nahi, i=3 se data shuru)
for (let i = 3; i < rows.length; i++) {
   const r = rows[i];
   if (String(r[0]).trim().toUpperCase() === 'SR NO') continue; // header skip
   if (!r[0] || isNaN(parseFloat(r[0]))) continue;

      const rowNum = i + 1; // 1-based for human-readable error messages
      const rowErrors = [];

      const dealerName = toStr(r[1]);
      const farmerDealerCode = toStr(r[2]);
      const tds = toNum(r[12]);

      // Validate all required fields
      if (!dealerName) rowErrors.push('dealerName (col B) is empty');
      if (!farmerDealerCode) rowErrors.push('farmerDealerCode (col C) is empty');
      if (tds === null) rowErrors.push('TDS (col M) is empty');

      if (rowErrors.length > 0) {
         errors.push({ row: rowNum, srNo: toNum(r[0]), issues: rowErrors });
         continue; // skip invalid rows, collect all errors before throwing
      }

      data.push({
         financialYear,
         srNo: toNum(r[0]),
         dealerName,
         farmerDealerCode,
         company: toStr(r[3]),
         farmerName: toStr(r[4]),
         fatherName: toStr(r[5]),
         address: toStr(r[6]),
         panNo: toStr(r[7]),
         turnover: toNum(r[8]),
         commissionAmount: toNum(r[9]),
         tdsAmount:toNum(r[10]),
         payableAmount: toNum(r[11]),
         tds:  toNum(r[12]),
      });
   }

if (errors.length > 0) {
   const summary = errors
      .map(e => `  Row ${e.row} (Sr.No ${e.srNo ?? '?'}): ${e.issues.join('; ')}`)
      .join('\n');
   // ✅ warn hata ke throw wapas karo
   throw new Error(`TDS sheet validation failed — ${errors.length} row(s) have errors:\n${summary}`);
}

   return data;
}

// ---------------------------------------------------------------------------
// FILE 2: SUBSIDY_FILE.xlsx  →  SUBSIDEY
// row0: headers:
//   r[0]  Sn.                          → sn
//   r[1]  LOT No.                      → lotNo
//   r[2]  District                     → district
//   r[3]  Block                        → block
//   r[4]  Village                      → village
//   r[5]  Application ID               → applicationId
//   r[6]  NAME                         → name
//   r[7]  Father Name                  → fatherName
//   r[8]  VendorName                   → vendorName
//   r[9]  TYPE                         → type
//   r[10] AREA IN ACER                 → areaInAcre
//   r[11] Assistance to be Paid        → assistanceToBePaid  (required)
//   r[12] DEALER NAME                  → dealerName
//   r[13] DEALER CODE                  → farmerDealerCode    (required)
//   r[14] Bill value                   → billValue
//   r[15] GST                          (no schema field, ignored)
// row1+: data
// ---------------------------------------------------------------------------


/**
 * @param {Buffer} buffer
 */
export function parseSubsidySheet(buffer) {
   const wb = XLSX.read(buffer, { type: 'buffer', cellDates: true });
   const sheetName = wb.SheetNames.find(n => n.trim().toUpperCase() === 'SUBSIDEY') || wb.SheetNames[0];
   const rows = readSheet(wb, sheetName);
   const errors = [];
   const data = [];
 
   for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.every(c => c === null || c === undefined || c === '')) continue;
 
      const rowNum = i + 1;
      const rowErrors = [];
      const appId = toStr(r[5]);
 
      if (!appId)
         rowErrors.push('Missing Application ID / MI Number (col F)');
 
      const financialYear = appId ? extractFYFromMINumber(appId) : null;
 
      if (appId && !financialYear)
         rowErrors.push(`Cannot extract FY from MI number: ${appId}`);

      const assistanceToBePaid = toNum(r[11]);
      if (assistanceToBePaid === null)
         rowErrors.push('assistanceToBePaid (col L) is empty');
 
      // ✅ farmerDealerCode validation HATAI — empty ho toh bhi chalta hai
 
      if (rowErrors.length > 0) {
         errors.push({ row: rowNum, sn: toNum(r[0]), issues: rowErrors });
         continue;
      }
 
      data.push({
         financialYear,
         sn: toNum(r[0]),
         lotNo: toNum(r[1]),
         district: toStr(r[2]),
         block: toStr(r[3]),
         village: toStr(r[4]),
         applicationId: appId,
         name: toStr(r[6]),
         fatherName: toStr(r[7]),
         vendorName: toStr(r[8]),
         type: toStr(r[9]),
         areaInAcre: toNum(r[10]),
         assistanceToBePaid,
         dealerName: toStr(r[12]),
         farmerDealerCode: toStr(r[13]),  // null bhi aa sakta hai — OK
         billValue: toNum(r[14])
      });
   }
 
   if (errors.length > 0) {
      const summary = errors
         .map(e => ` Row ${e.row} (Sn. ${e.sn ?? '?'}): ${e.issues.join('; ')}`)
         .join('\n');
      throw new Error(`Subsidy sheet validation failed — ${errors.length} row(s) have errors:\n${summary}`);
   }
 
   return data;
}

// ---------------------------------------------------------------------------
// FILE 3a: MATERIAL_DISPATCH_DETAILS.xlsx  →  ACRE DETAILS
// row0: title
// row1: headers:
//   r[0]  Sr. No.              → srNo
//   r[1]  Dealer code          → farmerDealerCode
//   r[2]  Name of Dealer/Farmer → dealerName
//   r[3]  Name of Farmer       → farmerName
//   r[4]  Address              → address
//   r[5]  Brand Name           → brandName
//   r[6]  Date                 → date
//   r[7]  Challan No.          → challanNo
//   r[8]  Vehicle No.          → vehicleNo
//   r[9]  Destination          → destination
//   r[10] Mini                 → miniAcres
//   r[11] Farmer Share (Mini)  → miniFarmerShare
//   r[12] Drip                 → dripAcres
//   r[13] Farmer Share (Drip)  → dripFarmerShare
//   r[14] HDPE                 → hdpeAcres
//   r[15] Farmer Share (HDPE)  → hdpeFarmerShare
//   r[16] Referance            → reference
// row2: sub-headers (skip)
// row3+: data
// NOTE: farmerDealerCode / dealerName are intentionally NOT required here —
// rows like a direct dispatch to a non-dealer party (empty dealer code +
// empty dealer name, only "Name of Farmer" filled) must still be saved.
// ---------------------------------------------------------------------------
export function parseMaterialDispatchedSheet(buffer, financialYear) {
   const wb = XLSX.read(buffer, { type: 'buffer' });

   // Sheet is named "ACRE DETAILS" in the actual file
   const sheetName = wb.SheetNames.find(n => n.trim() === 'ACRE DETAILS') || wb.SheetNames[0];
   const rows = readSheet(wb, sheetName);

   const data = [];
   for (let i = 3; i < rows.length; i++) {
      const r = rows[i];

      // Normal rows have a numeric Sr. No. in r[0].
      // SHIFTING ENTRY rows have no Sr. No. but carry r[3] === 'SHIFTING ENTRY'
      // and a valid dealer code in r[1]. Both must be parsed — skipping them
      // causes acres and farmer-share adjustments to be silently dropped.
      const hasSerialNo = r[0] && !isNaN(parseFloat(r[0]));
      const isShiftingEntry = !r[0] && toStr(r[3])?.toUpperCase() === 'SHIFTING ENTRY' && toStr(r[1]);

      if (!hasSerialNo && !isShiftingEntry) continue;

      data.push({
         financialYear,
         srNo: toNum(r[0]),                          // null for SHIFTING ENTRY rows
         farmerDealerCode: toStr(r[1]),               // null if empty — not required
         dealerName: toStr(r[2]),                     // null if empty — not required
         farmerName: toStr(r[3]),                    // 'SHIFTING ENTRY' for adjustment rows
         address: toStr(r[4]),
         brandName: toStr(r[5]),
         date: parseDate(r[6]),
         challanNo: toStr(r[7]),
         vehicleNo: toStr(r[8]),
         destination: toStr(r[9]),
         miniAcres: toNum(r[10]),
         miniFarmerShare: toNum(r[11]),
         dripAcres: toNum(r[12]),
         dripFarmerShare: toNum(r[13]),
         hdpeAcres: toNum(r[14]),
         hdpeFarmerShare: toNum(r[15]),
         reference: toStr(r[16]),
         isAdjustment: isShiftingEntry || false,     // flag so downstream code can identify these
      });
   }
   return data;
}

// ---------------------------------------------------------------------------
// FILE 3b: MATERIAL_DISPATCH_DETAILS.xlsx  →  RECIEPTS
// row0: headers:
//   r[0]  Sr. No.      → srNo
//   r[1]  Date         → date
//   r[2]  Dealer Name  → dealerName
//   r[3]  Dealer Code  → farmerDealerCode
//   r[4]  Amount       → amount
//   r[5]  Remarks      → remarks
// row1+: data
// NOTE: farmerDealerCode / dealerName are intentionally NOT required here
// anymore (same relaxation as ACRE DETAILS) — a receipt row should still be
// saved even if the dealer name/code wasn't filled in the sheet.
// ---------------------------------------------------------------------------
export function parseReceiptsSheet(buffer, financialYear) {
   const wb = XLSX.read(buffer, { type: 'buffer' });

   // Sheet is named "RECIEPTS" in the actual file
   const sheetName = wb.SheetNames.find(n => n.trim() === 'RECIEPTS') || wb.SheetNames[1];
   const rows = readSheet(wb, sheetName);

   const data = [];

   for (let i = 1; i < rows.length; i++) {
      const r = rows[i];

      // Normal rows have a numeric Sr. No. in r[0].
      // FS-reversal/adjustment rows (e.g. "FS Shifted to 21-22") have no Sr. No.
      // but carry a dealer code in r[3] and a non-zero amount in r[4].
      // They must be included so the negative amount offsets farmer-share receipts.
      const hasSerialNo = r[0] && !isNaN(parseFloat(r[0]));
      const isAdjustmentReceipt = !r[0] && toStr(r[3]) && toNum(r[4]) !== null;

      if (!hasSerialNo && !isAdjustmentReceipt) continue;

      data.push({
         financialYear,
         srNo: toNum(r[0]),                    // null for adjustment rows
         date: parseDate(r[1]),
         dealerName: toStr(r[2]),               // null if empty — not required
         farmerDealerCode: toStr(r[3]),         // null if empty — not required
         amount: toNum(r[4]),
         remark1: toStr(r[5]),
         remark2: toStr(r[6]),

         isAdjustment: isAdjustmentReceipt || false,  // flag for downstream
      });
   }

   return data;
}

// ---------------------------------------------------------------------------
// FILE 3c: MATERIAL_DISPATCH_DETAILS.xlsx  →  AGJUSTED SHEET
// row0: headers:
//   r[0]  S. No.       → sn
//   r[1]  Dealer Code  → farmerDealerCode
//   r[2]  Dealer Name  → dealerName
//   r[3]  Amount       → amount
// row1+: data
// ---------------------------------------------------------------------------
export function parseAdjustedSheet(buffer, financialYear) {
   const wb = XLSX.read(buffer, { type: 'buffer' });

   // Sheet is named "AGJUSTED SHEET" in the actual file
   const sheetName = wb.SheetNames.find(n => n.trim() === 'AGJUSTED SHEET') || wb.SheetNames[2];
   const rows = readSheet(wb, sheetName);

   const data = [];
   for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r[0] || isNaN(parseFloat(r[0]))) continue;

      data.push({
         financialYear,
         sn: toNum(r[0]),
         farmerDealerCode: toStr(r[1]),
         dealerName: toStr(r[2]),
         amount: toNum(r[3]),
      });
   }
   return data;
}