import ExcelJS from "exceljs";

function safe(v) { return v != null && v !== "" ? v : "—"; }
function numIN(v) { if (v == null || isNaN(v)) return "—"; return Math.round(Number(v)); }
function numAcre(v) { if (v == null || isNaN(v)) return "—"; return Number(Number(v).toFixed(2)); }
function today() { return new Date().toLocaleDateString("en-IN"); }

export async function generateSubsidyExcel(records, financialYear, dealerName) {
   const wb = new ExcelJS.Workbook();
   wb.creator = "System";
   wb.created = new Date();
   const ws = wb.addWorksheet("Subsidy");

   ws.columns = [
      { key: "sn",                width: 8  },
      { key: "village",           width: 18 },
      { key: "applicationId",     width: 22 },
      { key: "name",              width: 25 },
      { key: "fatherName",        width: 25 },
      { key: "type",              width: 18 },
      { key: "areaInAcre",        width: 10 },
      { key: "assistanceToBePaid",width: 18 },
      { key: "billValue",         width: 18 },
   ];

   ws.mergeCells("A1:I1");
   const t = ws.getCell("A1");
   t.value = "Subsidy Record Report";
   t.font  = { name: "Arial", bold: true, size: 14 };
   t.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(1).height = 28;

   ws.mergeCells("A2:I2");
   const metaParts = [];
   if (financialYear) metaParts.push(`FY: ${financialYear}`);
   if (dealerName)    metaParts.push(`Dealer: ${dealerName}`);
   metaParts.push(`Generated: ${today()}`);
   const m = ws.getCell("A2");
   m.value = metaParts.join("   |   ");
   m.font  = { name: "Arial", size: 10, italic: true };
   m.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(2).height = 18;

   const HEADERS = ["S.No", "Village", "Application ID", "Farmer Name", "Father Name", "Type", "Acre", "Assistance (₹)", "Bill Value (₹)"];
   const hr = ws.addRow(HEADERS);
   hr.eachCell(cell => {
      cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDDDDD" } };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border    = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
   });
   ws.getRow(3).height = 20;

   const totals = { acre: 0, assistance: 0, billValue: 0 };

   records.forEach((rec, i) => {
      totals.acre       += Number(rec.areaInAcre)         || 0;
      totals.assistance += Number(rec.assistanceToBePaid) || 0;
      totals.billValue  += Number(rec.billValue)          || 0;

      const row = ws.addRow([
         rec.sn ?? i + 1,
         safe(rec.village),
         safe(rec.applicationId),
         safe(rec.name),
         safe(rec.fatherName),
         safe(rec.type),
         numAcre(rec.areaInAcre),
         numIN(rec.assistanceToBePaid),
         numIN(rec.billValue),
      ]);

      row.eachCell((cell, col) => {
         cell.font      = { name: "Arial", size: 9 };
         cell.alignment = { horizontal: col === 1 ? "center" : [7, 8, 9].includes(col) ? "right" : "left", vertical: "middle" };
         cell.border    = { top: { style: "hair", color: { argb: "FFCCCCCC" } }, bottom: { style: "hair", color: { argb: "FFCCCCCC" } }, left: { style: "hair", color: { argb: "FFCCCCCC" } }, right: { style: "hair", color: { argb: "FFCCCCCC" } } };
         cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: i % 2 === 0 ? "FFFFFFFF" : "FFF9F9F9" } };
      });
      row.getCell(7).numFmt = "0.00";
      row.getCell(8).numFmt = "#,##0";
      row.getCell(9).numFmt = "#,##0";
      row.height = 16;
   });

   const tr = ws.addRow([`TOTAL   ${records.length} Record${records.length !== 1 ? "s" : ""}`, "", "", "", "", "", Number(totals.acre.toFixed(2)), Math.round(totals.assistance), Math.round(totals.billValue)]);
   ws.mergeCells(`A${tr.number}:F${tr.number}`);
   tr.eachCell((cell, col) => {
      cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFACD" } };
      cell.alignment = { horizontal: col === 1 ? "left" : "right", vertical: "middle" };
      cell.border    = { top: { style: "medium" }, bottom: { style: "medium" }, left: { style: "thin" }, right: { style: "thin" } };
   });
   tr.getCell(7).numFmt = "0.00";
   tr.getCell(8).numFmt = "#,##0";
   tr.getCell(9).numFmt = "#,##0";
   tr.height = 18;

   ws.views = [{ state: "frozen", xSplit: 1, ySplit: 3 }];
   ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };

   return wb.xlsx.writeBuffer();
}