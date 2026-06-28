import XLSX from 'xlsx';
import { extractFYFromMINumber } from './helpers.js';

function toNum(val) {
   const n = parseFloat(val);
   return isNaN(n) ? null : n;
}

function toStr(val) {
   if (val === null || val === undefined) return null;
   const s = String(val).trim();
   return s === '' || s === 'NaN' ? null : s;
}

function parseDate(value) {
   if (!value) return null;
   if (value instanceof Date) return isNaN(value) ? null : value;

   if (typeof value === 'number') {
      const d = XLSX.SSF.parse_date_code(value);
      return d ? new Date(d.y, d.m - 1, d.d) : null;
   }

   const str = String(value).trim();

   if (str.includes('.') || str.includes('/')) {
      const sep = str.includes('.') ? '.' : '/';
      const parts = str.split(sep);

      if (parts.length === 3) {
         let [d, m, y] = parts;
         if (y.length === 2) y = '20' + y;
         const date = new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
         return isNaN(date) ? null : date;
      }
   }

   const d = new Date(str);
   return isNaN(d) ? null : d;
}

function readSheet(workbook, sheetName) {
   const sheet = workbook.Sheets[sheetName];
   if (!sheet) return [];
   return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
}

/**
 * @param {Buffer} buffer
 * @param {string} dealerName
 * @param {string} farmerDealerCode
 */
export function parseTallyBillSheet(buffer, dealerName, farmerDealerCode) {
   const wb = XLSX.read(buffer, { type: 'buffer', cellDates: true });
   const sheetName = wb.SheetNames.find(n => n.trim() === 'Tally Bill') ?? wb.SheetNames[0];
   const rows = readSheet(wb, sheetName);

   if (!rows.length)
      throw new Error(`Sheet "${sheetName}" is empty.`);

   const dataRows = rows.slice(1).filter(r => r[3]);
   const docs = [];
   const skipped = [];

   for (let i = 0; i < dataRows.length; i++) {
      const r = dataRows[i];
      const rowNum = i + 2;
      const billNo = toStr(r[3]);

      if (!billNo) continue;

      const miNumber = toStr(r[6]);
      const financialYear = extractFYFromMINumber(miNumber);

      if (!financialYear) {
         skipped.push({ row: rowNum, billNo, reason: `Cannot extract FY from MI number: ${miNumber}` });
         continue;
      }

      docs.push({
         financialYear,
         dealerName: toStr(r[13]) || dealerName || '—',
         farmerDealerCode: toStr(r[12]) || farmerDealerCode || '—',
         date: parseDate(r[0]),
         farmerName: toStr(r[1]),
         type: toStr(r[2]),
         billNo,
         billValue: toNum(r[4]),
         gstBarrierDate: parseDate(r[5]),
         miNumber,
         gst: toNum(r[7]),
         scanNo: toStr(r[8]),
         estimateAmount: toNum(r[9]),
         acre: toNum(r[10]),
         difference: toNum(r[11]),
         netAmount: toNum(r[14])
      });
   }

   return { docs, skipped };
}