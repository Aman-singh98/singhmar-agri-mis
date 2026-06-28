import ExcelJS from "exceljs";

function safe(v) { return v != null && v !== "" ? v : "—"; }
function today() { return new Date().toLocaleDateString("en-IN"); }

export async function generateDealersExcel(records, financialYear) {
   const wb = new ExcelJS.Workbook();
   wb.creator = "System";
   wb.created = new Date();
   const ws = wb.addWorksheet("Dealers");

   ws.columns = [
      { key: "sn",         width: 8  },
      { key: "dealerName", width: 40 },
      { key: "dealerCode", width: 22 },
   ];

   const lastCol = "C";

   ws.mergeCells(`A1:${lastCol}1`);
   const t = ws.getCell("A1");
   t.value     = "Dealer Report";
   t.font      = { name: "Arial", bold: true, size: 14 };
   t.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(1).height = 28;

   ws.mergeCells(`A2:${lastCol}2`);
   const metaParts = [];
   if (financialYear) metaParts.push(`FY: ${financialYear}`);
   metaParts.push(`Generated: ${today()}`);
   const m = ws.getCell("A2");
   m.value     = metaParts.join("   |   ");
   m.font      = { name: "Arial", size: 10, italic: true };
   m.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(2).height = 18;

   const HEADERS = ["S.No", "Dealer Name", "Dealer Code"];
   const hr = ws.addRow(HEADERS);
   hr.eachCell(cell => {
      cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDDDDD" } };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border    = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
   });
   ws.getRow(3).height = 20;

   records.forEach((rec, i) => {
      const row = ws.addRow([
         i + 1,
         safe(rec.dealerName),
         safe(rec.farmerDealerCode),
      ]);

      row.eachCell((cell, col) => {
         cell.font      = { name: "Arial", size: 9, bold: col === 2 };
         cell.alignment = { horizontal: col === 1 ? "center" : "left", vertical: "middle" };
         cell.border    = { top: { style: "hair", color: { argb: "FFCCCCCC" } }, bottom: { style: "hair", color: { argb: "FFCCCCCC" } }, left: { style: "hair", color: { argb: "FFCCCCCC" } }, right: { style: "hair", color: { argb: "FFCCCCCC" } } };
         cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: i % 2 === 0 ? "FFFFFFFF" : "FFF9F9F9" } };
      });
      row.height = 16;
   });

   const tr = ws.addRow([
      `TOTAL  ${records.length} Dealer${records.length !== 1 ? "s" : ""}`,
      "", "",
   ]);
   ws.mergeCells(`A${tr.number}:${lastCol}${tr.number}`);
   tr.eachCell(cell => {
      cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFACD" } };
      cell.alignment = { horizontal: "left", vertical: "middle" };
      cell.border    = { top: { style: "medium" }, bottom: { style: "medium" }, left: { style: "thin" }, right: { style: "thin" } };
   });
   tr.height = 18;

   ws.views = [{ state: "frozen", xSplit: 1, ySplit: 3 }];
   ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };

   return wb.xlsx.writeBuffer();
}