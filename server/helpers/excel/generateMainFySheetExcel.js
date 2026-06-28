import ExcelJS from "exceljs";

function safe(v)  { return v != null && v !== "" ? v : "—"; }
function num2(v)  { return v != null && !isNaN(Number(v)) ? Number(Number(v).toFixed(2)) : "—"; }
function numIN(v) { return v != null && !isNaN(Number(v)) ? Math.round(Number(v)) : "—"; }
function today()  { return new Date().toLocaleDateString("en-IN"); }

export async function generateMainFySheetExcel(records, financialYear, dealerName) {
   const wb = new ExcelJS.Workbook();
   wb.creator = "System";
   wb.created = new Date();
   const ws = wb.addWorksheet("Main FY Sheet");

   ws.columns = [
      { key: "sn",         width: 7  },
      { key: "scanNo",     width: 14 },
      { key: "brandName",  width: 16 },
      { key: "miNumber",   width: 16 },
      { key: "name",       width: 22 },
      { key: "fatherName", width: 20 },
      { key: "mobileNo",   width: 14 },
      { key: "type",       width: 12 },
      { key: "areaInAcre", width: 10 },
      { key: "village",    width: 16 },
      { key: "billNo",     width: 14 },
      { key: "billValue",  width: 14 },
      { key: "gst",        width: 12 },
   ];

   const lastCol = "M"; // 13 columns

   ws.mergeCells(`A1:${lastCol}1`);
   const t = ws.getCell("A1");
   t.value     = "Main FY Sheet Report";
   t.font      = { name: "Arial", bold: true, size: 14 };
   t.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(1).height = 28;

   ws.mergeCells(`A2:${lastCol}2`);
   const metaParts = [];
   if (financialYear) metaParts.push(`FY: ${financialYear}`);
   if (dealerName)    metaParts.push(`Dealer: ${dealerName}`);
   metaParts.push(`Generated: ${today()}`);
   const m = ws.getCell("A2");
   m.value     = metaParts.join("   |   ");
   m.font      = { name: "Arial", size: 10, italic: true };
   m.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(2).height = 18;

   const HEADERS = ["S.No", "Scan No", "Brand Name", "MI No", "Name", "Father Name", "Mobile", "Type", "Acre", "Village", "Bill No", "Bill Value", "GST"];
   const hr = ws.addRow(HEADERS);
   hr.eachCell(cell => {
      cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDDDDD" } };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border    = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
   });
   ws.getRow(3).height = 20;

   const totals = { acre: 0, billValue: 0, gst: 0 };

   records.forEach((rec, i) => {
      totals.acre      += Number(rec.areaInAcre) || 0;
      totals.billValue += Number(rec.billValue)  || 0;
      totals.gst       += Number(rec.gst)        || 0;

      const row = ws.addRow([
         rec.srNo ?? i + 1,
         safe(rec.scanNo),
         safe(rec.brandName),
         safe(rec.miNumber),
         safe(rec.name),
         safe(rec.fatherName),
         safe(rec.mobileNo),
         safe(rec.type),
         num2(rec.areaInAcre),
         safe(rec.village),
         safe(rec.billNo),
         numIN(rec.billValue),
         numIN(rec.gst),
      ]);

      const rightCols = [9, 12, 13];
      row.eachCell((cell, col) => {
         cell.font      = { name: "Arial", size: 9 };
         cell.alignment = {
            horizontal: col === 1 ? "center" : rightCols.includes(col) ? "right" : "left",
            vertical: "middle",
         };
         cell.border = { top: { style: "hair", color: { argb: "FFCCCCCC" } }, bottom: { style: "hair", color: { argb: "FFCCCCCC" } }, left: { style: "hair", color: { argb: "FFCCCCCC" } }, right: { style: "hair", color: { argb: "FFCCCCCC" } } };
         cell.fill   = { type: "pattern", pattern: "solid", fgColor: { argb: i % 2 === 0 ? "FFFFFFFF" : "FFF9F9F9" } };
      });
      row.getCell(9).numFmt  = "0.00";
      row.getCell(12).numFmt = "#,##0";
      row.getCell(13).numFmt = "#,##0";
      row.height = 16;
   });

   const tr = ws.addRow([
      `TOTAL   ${records.length} Record${records.length !== 1 ? "s" : ""}`,
      "", "", "", "", "", "", "",
      Number(totals.acre.toFixed(2)),
      "",
      "",
      Math.round(totals.billValue),
      Math.round(totals.gst),
   ]);
   ws.mergeCells(`A${tr.number}:H${tr.number}`);
   ws.mergeCells(`J${tr.number}:K${tr.number}`);
   tr.eachCell((cell, col) => {
      cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFACD" } };
      cell.alignment = { horizontal: col === 1 ? "left" : "right", vertical: "middle" };
      cell.border    = { top: { style: "medium" }, bottom: { style: "medium" }, left: { style: "thin" }, right: { style: "thin" } };
   });
   tr.getCell(9).numFmt  = "0.00";
   tr.getCell(12).numFmt = "#,##0";
   tr.getCell(13).numFmt = "#,##0";
   tr.height = 18;

   ws.views = [{ state: "frozen", xSplit: 1, ySplit: 3 }];
   ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };

   return wb.xlsx.writeBuffer();
}