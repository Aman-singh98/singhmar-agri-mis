import ExcelJS from "exceljs";

function safe(v) { return v != null && v !== "" ? String(v) : "—"; }
function num2(v) { return v != null && !isNaN(Number(v)) ? Number(Number(v).toFixed(2)) : "—"; }
function today() { return new Date().toLocaleDateString("en-IN"); }

/**
 * @param {object} data - { title, records, financialYear?, dealerName?, appStatus?, recordType? }
 * @returns {Buffer} xlsx buffer
 */
export async function generateDealerMainFileExcel(data) {
  const {
    title         = "File Records",
    records       = [],
    financialYear,
    dealerName,
    appStatus,
    recordType,
  } = data;

  const wb = new ExcelJS.Workbook();
  wb.creator = "System";
  wb.created = new Date();
  const ws = wb.addWorksheet("File Records");

  // ── Columns ──────────────────────────────────────────────────────────────────
  ws.columns = [
    { key: "sn",                width: 7  },
    { key: "scanNo",            width: 14 },
    { key: "brandName",         width: 16 },
    { key: "name",              width: 24 },
    { key: "fatherName",        width: 20 },
    { key: "mobileNo",          width: 14 },
    { key: "address",           width: 24 },
    { key: "block",             width: 14 },
    { key: "district",          width: 14 },
    { key: "irrigationType",    width: 16 },
    { key: "areaInAcre",        width: 10 },
    { key: "familyId",          width: 14 },
    { key: "farmerCode",        width: 14 },
    { key: "miNumber",          width: 18 },
    { key: "applicationStatus", width: 22 },
    { key: "onlineStatus",      width: 14 },
  ];

  const LAST_COL = "P"; // 16 columns

  // ── Row 1: Title ──────────────────────────────────────────────────────────────
  ws.mergeCells(`A1:${LAST_COL}1`);
  const titleCell = ws.getCell("A1");
  titleCell.value     = title;
  titleCell.font      = { name: "Arial", bold: true, size: 14 };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleCell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F172A" } };
  titleCell.font      = { name: "Arial", bold: true, size: 13, color: { argb: "FFFFFFFF" } };
  ws.getRow(1).height = 28;

  // ── Row 2: Meta ───────────────────────────────────────────────────────────────
  ws.mergeCells(`A2:${LAST_COL}2`);
  // Resolve dealer code from first record
  const dealerCode = records[0]?.["Code"] ?? records[0]?.farmerDealerCode ?? null;

  const metaParts = [];
  if (financialYear)                      metaParts.push(`FY: ${financialYear}`);
  if (dealerName) {
    const dealerLabel = dealerCode ? `Dealer: ${dealerName} (${dealerCode})` : `Dealer: ${dealerName}`;
    metaParts.push(dealerLabel);
  }
  if (appStatus && appStatus !== "All Status") metaParts.push(`Status: ${appStatus}`);
  if (recordType && recordType !== "all") metaParts.push(`Type: ${recordType.toUpperCase()}`);
  metaParts.push(`Records: ${records.length}`);
  metaParts.push(`Generated: ${today()}`);

  const metaCell = ws.getCell("A2");
  metaCell.value     = metaParts.join("   |   ");
  metaCell.font      = { name: "Arial", size: 9, italic: true, color: { argb: "FF334155" } };
  metaCell.alignment = { horizontal: "center", vertical: "middle" };
  metaCell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } };
  ws.getRow(2).height = 16;

  // ── Row 3: Column Headers ─────────────────────────────────────────────────────
  const HEADERS = [
    "S.No", "Scan No", "Brand Name", "Name", "Father Name", "Mobile",
    "Address", "Block", "District", "Irrig. Type",
    "Acre", "Family ID", "Farmer Code", "MI No", "App Status", "Online",
  ];
  const hr = ws.addRow(HEADERS);
  hr.eachCell(cell => {
    cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
    cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDDDDD" } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border    = {
      top:    { style: "thin" },
      bottom: { style: "thin" },
      left:   { style: "thin" },
      right:  { style: "thin" },
    };
  });
  ws.getRow(3).height = 20;

  // ── Data rows ─────────────────────────────────────────────────────────────────
  let totalAcre = 0;

  records.forEach((r, i) => {
    const acre = Number(r["Area (Acre)"] ?? r.areaInAcre) || 0;
    totalAcre += acre;

    const row = ws.addRow([
      r["Sr No"]            ?? i + 1,
      safe(r["Scan No"]     ?? r.scanNo),
      safe(r["Brand"]       ?? r.brandName),
      safe(r["Farmer Name"] ?? r.name),
      safe(r["Father Name"] ?? r.fatherName),
      safe(r["Mobile"]      ?? r.mobileNo),
      safe(r["Address"]     ?? r.address),
      safe(r["Block"]       ?? r.block),
      safe(r["District"]    ?? r.district),
      safe(r["Irrigation Type"] ?? r.irrigationType),
      num2(r["Area (Acre)"] ?? r.areaInAcre),
      safe(r["Family ID"]   ?? r.familyId),
      safe(r["Farmer Code"] ?? r.farmerCode),
      safe(r["MI Number"]   ?? r.miNumber),
      safe(r["Application Status"] ?? r.applicationStatus),
      safe(r["Online Status"]      ?? r.onlineStatus),
    ]);

    const isEven = i % 2 === 0;
    row.eachCell((cell, col) => {
      cell.font      = { name: "Arial", size: 9 };
      cell.alignment = {
        horizontal: col === 1 ? "center" : col === 11 ? "right" : "left",
        vertical: "middle",
      };
      cell.border = {
        top:    { style: "hair", color: { argb: "FFCCCCCC" } },
        bottom: { style: "hair", color: { argb: "FFCCCCCC" } },
        left:   { style: "hair", color: { argb: "FFCCCCCC" } },
        right:  { style: "hair", color: { argb: "FFCCCCCC" } },
      };
      cell.fill = {
        type: "pattern", pattern: "solid",
        fgColor: { argb: isEven ? "FFFFFFFF" : "FFF8F8F8" },
      };
    });
    row.getCell(11).numFmt = "0.00";
    row.height = 16;
  });

  // ── Total row ─────────────────────────────────────────────────────────────────
  const tr = ws.addRow([
    `TOTAL   ${records.length} Record${records.length !== 1 ? "s" : ""}`,
    "", "", "", "", "", "", "", "", "",
    Number(totalAcre.toFixed(2)),
    "", "", "", "", "",
  ]);
  ws.mergeCells(`A${tr.number}:J${tr.number}`);
  ws.mergeCells(`L${tr.number}:${LAST_COL}${tr.number}`);
  tr.eachCell((cell, col) => {
    cell.font      = { name: "Arial", bold: true, size: 9 };
    cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFACD" } };
    cell.alignment = { horizontal: col === 1 ? "left" : "right", vertical: "middle" };
    cell.border    = {
      top:    { style: "medium" },
      bottom: { style: "medium" },
      left:   { style: "thin"   },
      right:  { style: "thin"   },
    };
  });
  tr.getCell(11).numFmt = "0.00";
  tr.height = 18;

  // ── Sheet settings ────────────────────────────────────────────────────────────
  ws.views     = [{ state: "frozen", xSplit: 1, ySplit: 3 }];
  ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };

  return wb.xlsx.writeBuffer();
}