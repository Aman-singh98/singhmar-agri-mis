import XLSX from 'xlsx';

// ─── Helpers ─────────────────────────────────────────────────

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

function clean(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'string') return val.trim() || null;
  return val;
}

function col(row, ...keys) {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null) return row[k];
  }
  return null;
}

function readSheet(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
}

// ─── Sheet Parsers ───────────────────────────────────────────

function parseFarmerChallanDetails(workbook) {
  const rows = readSheet(workbook, 'Farmer Challan Details');
  const data = [];
  const errors = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];

    if (!r[0] || isNaN(parseFloat(r[0]))) continue;

    const rowNum = i + 1;
    const rowErrors = [];

    const miNumber = toStr(r[2]);
    const name = clean(r[1]);
    const farmerDealerCode = toStr(r[9]);

    if (!miNumber && !name) rowErrors.push('Both miNumber (col C) and name (col B) are empty');
    if (!farmerDealerCode) rowErrors.push('farmerDealerCode (col J) is empty');

    if (rowErrors.length > 0) {
      errors.push({ row: rowNum, srNo: toNum(r[0]), issues: rowErrors });
      continue;
    }

    data.push({
      srNo: toNum(r[0]),
      name,
      miNumber,
      brandName: clean(r[3]),
      mobileNo: toStr(r[4]),
      areaInAcre: toNum(r[5]),
      village: clean(r[6]),
      type: clean(r[7]),
      dealerName: clean(r[8]),
      farmerDealerCode,
      scanNo: toStr(r[10]),
      estimateAmount: toNum(r[13]),
      onlineFarmerShareStatus: clean(r[14]),
      challanSubmitted: clean(r[15]),
      cadaAccountNo: toStr(r[17]),
      farmerShare: toNum(r[18]),
      farmerSharePercentage: toNum(r[19]),
      perAcreCosting: toNum(r[21]),
      difference: toNum(r[22]),
      farmerShareDeposit: toNum(r[24]),
      depositDate: parseDate(r[25]),
      returnFarmerShare: toNum(r[26]),
      returnDate: parseDate(r[27]),
    });
  }

  if (errors.length > 0) {
    const summary = errors
      .map((e) => ` Row ${e.row} (Sr.No ${e.srNo ?? '?'}): ${e.issues.join('; ')}`)
      .join('\n');
    throw new Error(
      `Farmer Challan Details validation failed — ${errors.length} row(s) have errors:\n${summary}`
    );
  }

  return data;
}

function parseFarmerChallanPending(sheet) {
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null, raw: false });
  return rows.map(r => ({
    srNo: toNum(r['Sr. No.']),
    miNumber: toStr(col(r, 'MI Number', 'MI Number ')),
    brandName: clean(col(r, 'BRAND NAME', 'BRAND NAME ')),
    name: clean(col(r, 'NAME', 'NAME ')),
    fatherName: clean(r['Father NAME']),
    mobileNo: toStr(r['MOBILE NO.']),
    areaInAcre: toNum(col(r, 'AREA IN ACER ', 'AREA IN ACER')),
    type: clean(r['Type']),
    village: clean(r['village']),
    dealerName: clean(col(r, 'DEALER NAME ', 'DEALER NAME')),
    farmerDealerCode: toStr(col(r, 'DEALER CODE', 'DEALER CODE ')),  // ← added
    scanNo: toStr(r['Scan no.']),
    remarks: clean(r['Remarks']),
    date: parseDate(r['Date']),
  })).filter(r => r.srNo != null && (r.miNumber || r.name));
}

function parseMaterialSheet(sheet) {
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null, raw: false });
  return rows.map(r => ({
    srNo: toNum(r['Sr. No.']),
    miNumber: toStr(col(r, 'MI Number', 'MI Number ')),
    brandName: clean(col(r, 'BRAND NAME ', 'BRAND NAME')),
    name: clean(col(r, 'NAME ', 'NAME')),
    mobileNo: toStr(r['Mobile No.']),
    areaInAcre: toNum(col(r, 'AREA IN ACER ', 'AREA IN ACER')),
    irrigationType: clean(col(r, 'IRRIGATION TYPE ', 'IRRIGATION TYPE')),
    dealerName: clean(col(r, 'DEALER NAME ', 'DEALER NAME')),
    farmerDealerCode: toStr(col(r, 'DEALER CODE', 'DEALER CODE ')),  // ← added
    scanNo: toStr(r['Scan no.']),
    materialStatus: clean(r['Material Status']) ?? null,
    remark: clean(r['Remark']),
    date: parseDate(r['Date']),
  })).filter(r => r.srNo != null && (r.miNumber || r.name));
}

// ─── Main Export ─────────────────────────────────────────────

export function parseExcelFile(buffer, fileKey) {
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: false });
  const result = {};

  if (fileKey === 'farmer_share') {
    if (workbook.SheetNames.includes('Farmer Challan Details'))
      result.farmerChallanDetails = parseFarmerChallanDetails(workbook);
    if (workbook.SheetNames.includes('farmer challan pending'))
      result.farmerChallanPending = parseFarmerChallanPending(workbook.Sheets['farmer challan pending']);
    if (workbook.SheetNames.includes('material sheet'))
      result.materialSheet = parseMaterialSheet(workbook.Sheets['material sheet']);
  }

  return result;
}