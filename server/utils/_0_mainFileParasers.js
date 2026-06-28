
import XLSX from 'xlsx';
import { extractFYFromMINumber } from './helpers.js';

function toNum(val) {
  if (val === null || val === undefined || val === '') return null;
  const n = parseFloat(String(val).replace(/,/g, '').trim());
  return isNaN(n) ? null : n;
}

function toStr(val) {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  return s === '' || s === 'NaN' ? null : s;
}

function parseDate(value) {
  if (!value) return null;

  const str = String(value).trim();

  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 3) {
      let [d, m, y] = parts;
      if (y.length === 2) y = '20' + y;
      const date = new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
      return isNaN(date) ? null : date;
    }
  }

  if (str.includes('-')) {
    const date = new Date(str);
    return isNaN(date) ? null : date;
  }

  return null;
}

function readSheet(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
}

export function parseMainSheet(buffer) {
  const wb = XLSX.read(buffer, { type: 'buffer' });

  const sheetName =
    wb.SheetNames.find((n) => n.trim() === 'FY 22-23 Data') || wb.SheetNames[0];

  const rows = readSheet(wb, sheetName);

  const data = [];
  const errors = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];

    if (!r[0] || isNaN(parseFloat(r[0]))) continue;

    const rowNum = i + 1;
    const rowErrors = [];

    const miNumber = toStr(r[3]);
    const farmerDealerCode = toStr(r[8]);
    const financialYear = extractFYFromMINumber(miNumber);

    if (!miNumber) rowErrors.push('miNumber (col D) is empty');
    if (!financialYear && miNumber)
      rowErrors.push(`Cannot extract FY from MI number: ${miNumber}`);

    if (rowErrors.length > 0) {
      errors.push({ row: rowNum, srNo: toNum(r[0]), issues: rowErrors });
      continue;
    }

    data.push({
      financialYear,
      srNo: toNum(r[0]),
      brandName: toStr(r[1]),
      scanNo: toStr(r[2]),
      miNumber,
      name: toStr(r[4]),
      fatherName: toStr(r[5]),
      mobileNo: toStr(r[6]),
      dealerName: toStr(r[7]),
      farmerDealerCode,
      type: toStr(r[9]),
      areaInAcre: toNum(r[10]),
      village: toStr(r[11]),
      block: toStr(r[12]),
      district: toStr(r[13]),
      remarks: toStr(r[14]),
      billNo: toStr(r[15]),
      billValue: toNum(r[16]),
      gst: toNum(r[17]),
      verificationStatus: toStr(r[18]),
      estimateStatus: toStr(r[19]),
      onlineFarmerShareStatus: toStr(r[20]),
      challanStatus: toStr(r[21]),
      tallyBillStatus: toStr(r[22]),
      billUploadStatus: toStr(r[23]),
      verificationDone: toStr(r[24]),
      verificationDate: parseDate(r[25]),
      verification: toStr(r[26]),
      reason: toStr(r[27]),
      estimate: toNum(r[28]),
      tallyBill: toNum(r[29]),
      farmerShare: toNum(r[30]),
      billUploadPending: toNum(r[31]),
      miSurvey: toNum(r[32]),
      verificationFlag: toNum(r[33]),
      newVerified: toNum(r[34]),
      status: toStr(r[35]),
      applicationStatus: toStr(r[36]),
      delay: toStr(r[37]),
      result: toStr(r[38]),
      dateOfApplication: parseDate(r[39]),
    });
  }

  if (errors.length > 0) {
    const summary = errors
      .map((e) => ` Row ${e.row} (Sr.No ${e.srNo ?? '?'}): ${e.issues.join('; ')}`)
      .join('\n');

    throw new Error(
      `Main sheet validation failed — ${errors.length} row(s) have errors:\n${summary}`
    );
  }

  return data;
}