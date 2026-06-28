import ExcelJS from "exceljs";

function safe(v) { return v != null && v !== "" ? v : "—"; }
function num2(v) { return v != null && !isNaN(Number(v)) ? Number(Number(v).toFixed(2)) : "—"; }
function today() { return new Date().toLocaleDateString("en-IN"); }

export async function generateFarmerShareExcel(records, financialYear, dealerName) {
   const wb = new ExcelJS.Workbook();
   wb.creator = "System";
   wb.created = new Date();
   const ws = wb.addWorksheet("Farmer Share");

   ws.columns = [
      { key: "srNo",                  width: 8  },
      { key: "name",                  width: 25 },
      { key: "miNumber",              width: 18 },
      { key: "village",               width: 18 },
      { key: "areaInAcre",            width: 10 },
      { key: "farmerShare",           width: 16 },
      { key: "farmerSharePercentage", width: 12 },
      { key: "farmerShareDeposit",    width: 16 },
      { key: "returnFarmerShare",     width: 16 },
      { key: "onlineFarmerShareStatus",width: 18 },
      { key: "brandName",             width: 16 },
      { key: "mobileNo",              width: 16 },
      { key: "type",                  width: 14 },
      { key: "scanNo",                width: 16 },
   ];

   ws.mergeCells("A1:N1");
   const t = ws.getCell("A1");
   t.value = "Farmer Share Detail Report";
   t.font  = { name: "Arial", bold: true, size: 14 };
   t.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(1).height = 28;

   ws.mergeCells("A2:N2");
   const metaParts = [];
   if (financialYear) metaParts.push(`FY: ${financialYear}`);
   if (dealerName)    metaParts.push(`Dealer: ${dealerName}`);
   metaParts.push(`Generated: ${today()}`);
   const m = ws.getCell("A2");
   m.value = metaParts.join("   |   ");
   m.font  = { name: "Arial", size: 10, italic: true };
   m.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(2).height = 18;

   const HEADERS = ["S.No", "Farmer Name", "MI No.", "Village", "Acre", "Farmer Share", "Share %", "Deposited", "Returned", "Status", "Brand", "Mobile", "Type", "Scan No"];
   const hr = ws.addRow(HEADERS);
   hr.eachCell(cell => {
      cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDDDDD" } };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border    = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
   });
   ws.getRow(3).height = 20;

   const totals = { areaInAcre: 0, farmerShare: 0, farmerSharePercentage: 0, farmerShareDeposit: 0, returnFarmerShare: 0 };
   const RIGHT_COLS = new Set([5, 6, 7, 8, 9]);

   records.forEach((rec, i) => {
      totals.areaInAcre            += Number(rec.areaInAcre)            || 0;
      totals.farmerShare           += Number(rec.farmerShare)           || 0;
      totals.farmerSharePercentage += Number(rec.farmerSharePercentage) || 0;
      totals.farmerShareDeposit    += Number(rec.farmerShareDeposit)    || 0;
      totals.returnFarmerShare     += Number(rec.returnFarmerShare)     || 0;

      const row = ws.addRow([
         rec.srNo ?? i + 1,
         safe(rec.name),
         safe(rec.miNumber),
         safe(rec.village),
         num2(rec.areaInAcre),
         num2(rec.farmerShare),
         rec.farmerSharePercentage != null ? `${rec.farmerSharePercentage}%` : "—",
         num2(rec.farmerShareDeposit),
         num2(rec.returnFarmerShare),
         safe(rec.onlineFarmerShareStatus),
         safe(rec.brandName),
         safe(rec.mobileNo),
         safe(rec.type),
         safe(rec.scanNo),
      ]);

      row.eachCell((cell, col) => {
         cell.font      = { name: "Arial", size: 9 };
         cell.alignment = { horizontal: col === 1 ? "center" : RIGHT_COLS.has(col) ? "right" : "left", vertical: "middle" };
         cell.border    = { top: { style: "hair", color: { argb: "FFCCCCCC" } }, bottom: { style: "hair", color: { argb: "FFCCCCCC" } }, left: { style: "hair", color: { argb: "FFCCCCCC" } }, right: { style: "hair", color: { argb: "FFCCCCCC" } } };
         cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: i % 2 === 0 ? "FFFFFFFF" : "FFF9F9F9" } };
      });
      [5, 6, 7, 8, 9].forEach(c => { row.getCell(c).numFmt = "0.00"; });
      row.height = 16;
   });

   const tr = ws.addRow([
      `TOTAL   ${records.length} Record${records.length !== 1 ? "s" : ""}`,
      "", "",
      Number(totals.areaInAcre.toFixed(2)),
      Number(totals.farmerShare.toFixed(2)),
      Number(totals.farmerSharePercentage.toFixed(2)),
      Number(totals.farmerShareDeposit.toFixed(2)),
      Number(totals.returnFarmerShare.toFixed(2)),
      "", "", "", "", "",
   ]);
   ws.mergeCells(`A${tr.number}:C${tr.number}`);
   ws.mergeCells(`J${tr.number}:N${tr.number}`);
   tr.eachCell((cell, col) => {
      cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFACD" } };
      cell.alignment = { horizontal: col === 1 ? "left" : "right", vertical: "middle" };
      cell.border    = { top: { style: "medium" }, bottom: { style: "medium" }, left: { style: "thin" }, right: { style: "thin" } };
   });
   [4, 5, 6, 7, 8].forEach(c => { tr.getCell(c).numFmt = "0.00"; });
   tr.height = 18;

   ws.views = [{ state: "frozen", xSplit: 1, ySplit: 3 }];
   ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };

   return wb.xlsx.writeBuffer();
}