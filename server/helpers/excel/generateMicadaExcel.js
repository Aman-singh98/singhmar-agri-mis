import ExcelJS from "exceljs";

function safe(v) { return v != null && v !== "" ? v : "—"; }
function num2(v) { return v != null && !isNaN(Number(v)) ? Number(Number(v).toFixed(2)) : "—"; }
function today() { return new Date().toLocaleDateString("en-IN"); }
function fmtDate(val) {
   if (!val) return "—";
   const d = new Date(val);
   return isNaN(d.getTime()) ? "—"
      : `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
}

export async function generateMicadaExcel(records, financialYear) {
   const wb = new ExcelJS.Workbook();
   wb.creator = "System";
   wb.created = new Date();
   const ws = wb.addWorksheet("MICADA");

   ws.columns = [
      { key: "sn",               width: 8  },
      { key: "appId",            width: 16 },
      { key: "programmeName",    width: 22 },
      { key: "farmerName",       width: 22 },
      { key: "village",          width: 18 },
      { key: "block",            width: 16 },
      { key: "district",         width: 16 },
      { key: "mobile",           width: 16 },
      { key: "dateOfApplication",width: 14 },
      { key: "totalArea",        width: 12 },
      { key: "currentStatus",    width: 22 },
      { key: "remarks",          width: 30 },
      { key: "status",           width: 20 },
   ];

   ws.mergeCells("A1:M1");
   const t = ws.getCell("A1");
   t.value = "MICADA Report";
   t.font  = { name: "Arial", bold: true, size: 14 };
   t.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(1).height = 28;

   ws.mergeCells("A2:M2");
   const metaParts = [];
   if (financialYear) metaParts.push(`FY: ${financialYear}`);
   metaParts.push(`Generated: ${today()}`);
   const m = ws.getCell("A2");
   m.value = metaParts.join("   |   ");
   m.font  = { name: "Arial", size: 10, italic: true };
   m.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(2).height = 18;

   const HEADERS = ["S.No", "App ID", "Programme", "Farmer Name", "Village", "Block", "District", "Mobile", "Date", "Area (Acre)", "Current Status", "Remarks", "Status"];
   const hr = ws.addRow(HEADERS);
   hr.eachCell(cell => {
      cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDDDDD" } };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border    = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
   });
   ws.getRow(3).height = 20;

   let totalArea = 0;

   records.forEach((rec, i) => {
      totalArea += Number(rec.totalArea) || 0;

      const row = ws.addRow([
         i + 1,
         safe(rec.appId),
         safe(rec.programmeName),
         safe(rec.farmerName),
         safe(rec.village),
         safe(rec.block),
         safe(rec.district),
         safe(rec.mobile),
         fmtDate(rec.dateOfApplication),
         num2(rec.totalArea),
         safe(rec.currentStatus),
         safe(rec.remarks),
         safe(rec.status),
      ]);

      row.eachCell((cell, col) => {
         cell.font      = { name: "Arial", size: 9 };
         cell.alignment = { horizontal: col === 1 ? "center" : col === 10 ? "right" : "left", vertical: "middle" };
         cell.border    = { top: { style: "hair", color: { argb: "FFCCCCCC" } }, bottom: { style: "hair", color: { argb: "FFCCCCCC" } }, left: { style: "hair", color: { argb: "FFCCCCCC" } }, right: { style: "hair", color: { argb: "FFCCCCCC" } } };
         cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: i % 2 === 0 ? "FFFFFFFF" : "FFF9F9F9" } };
      });
      row.getCell(10).numFmt = "0.00";
      row.height = 16;
   });

   const tr = ws.addRow([`TOTAL   ${records.length} Record${records.length !== 1 ? "s" : ""}`, "", "", "", "", "", "", "", "", Number(totalArea.toFixed(2)), "", "", ""]);
   ws.mergeCells(`A${tr.number}:I${tr.number}`);
   ws.mergeCells(`K${tr.number}:M${tr.number}`);
   tr.eachCell((cell, col) => {
      cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFACD" } };
      cell.alignment = { horizontal: col === 1 ? "left" : "right", vertical: "middle" };
      cell.border    = { top: { style: "medium" }, bottom: { style: "medium" }, left: { style: "thin" }, right: { style: "thin" } };
   });
   tr.getCell(10).numFmt = "0.00";
   tr.height = 18;

   ws.views = [{ state: "frozen", xSplit: 1, ySplit: 3 }];
   ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };

   return wb.xlsx.writeBuffer();
}