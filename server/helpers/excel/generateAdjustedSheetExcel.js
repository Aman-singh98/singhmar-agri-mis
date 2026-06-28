
import ExcelJS from "exceljs";

function safe(v)  { return v != null && v !== "" ? v : "—"; }
function numIN(v) { return v != null && !isNaN(Number(v)) ? Math.round(Number(v)) : "—"; }
function today()  { return new Date().toLocaleDateString("en-IN"); }

export async function generateAdjustedSheetExcel(records, financialYear, dealerName) {
   const resolvedDealerName = dealerName && dealerName !== "—" ? dealerName : null;
   const withDealer = !resolvedDealerName;

   const wb = new ExcelJS.Workbook();
   wb.creator = "System";
   wb.created = new Date();
   const ws  = wb.addWorksheet("Adjusted Sheet");

   if (withDealer) {
      ws.columns = [
         { key: "sn",         width: 10 },
         { key: "dealerName", width: 30 },
         { key: "amount",     width: 22 },
      ];
   } else {
      ws.columns = [
         { key: "sn",     width: 10 },
         { key: "amount", width: 22 },
      ];
   }

   const totalCols  = ws.columns.length;
   const lastColLet = String.fromCharCode(64 + totalCols);

   // ── Row 1: Title ──────────────────────────────────────────────────────────
   ws.mergeCells(`A1:${lastColLet}1`);
   const t = ws.getCell("A1");
   t.value     = "Adjusted Sheet Report";
   t.font      = { name: "Arial", bold: true, size: 14 };
   t.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(1).height = 28;

   // ── Row 2: Meta ───────────────────────────────────────────────────────────
   ws.mergeCells(`A2:${lastColLet}2`);
   const metaParts = [];
   if (financialYear)      metaParts.push(`FY: ${financialYear}`);
   if (resolvedDealerName) metaParts.push(`Dealer: ${resolvedDealerName}`);
   metaParts.push(`Generated: ${today()}`);
   const m = ws.getCell("A2");
   m.value     = metaParts.join("   |   ");
   m.font      = { name: "Arial", size: 10, italic: true };
   m.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(2).height = 18;

   // ── Row 3: Column Headers ─────────────────────────────────────────────────
   const HEADERS = withDealer ? ["S.No", "Dealer Name", "Amount"] : ["S.No", "Amount"];
   const hr = ws.addRow(HEADERS);
   hr.eachCell(cell => {
      cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDDDDD" } };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border    = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
   });
   ws.getRow(3).height = 20;

   // ── Data Rows ─────────────────────────────────────────────────────────────
   let totalAmount = 0;

   records.forEach((rec, i) => {
      totalAmount += Number(rec.amount) || 0;

      const rowData = withDealer
         ? [i + 1, safe(rec.dealerName), numIN(rec.amount)]
         : [rec.sn ?? i + 1, numIN(rec.amount)];

      const row = ws.addRow(rowData);

      row.eachCell((cell, col) => {
         cell.font      = { name: "Arial", size: 9 };
         cell.alignment = {
            horizontal: col === 1 ? "center" : col === totalCols ? "right" : "left",
            vertical: "middle",
         };
         cell.border = { top: { style: "hair", color: { argb: "FFCCCCCC" } }, bottom: { style: "hair", color: { argb: "FFCCCCCC" } }, left: { style: "hair", color: { argb: "FFCCCCCC" } }, right: { style: "hair", color: { argb: "FFCCCCCC" } } };
         cell.fill   = { type: "pattern", pattern: "solid", fgColor: { argb: i % 2 === 0 ? "FFFFFFFF" : "FFF9F9F9" } };
      });
      row.getCell(totalCols).numFmt = "#,##0";
      row.height = 16;
   });

   // ── Total Row ─────────────────────────────────────────────────────────────
   const totalRowValues = [
      `TOTAL   ${records.length} Record${records.length !== 1 ? "s" : ""}`,
      ...Array(totalCols - 2).fill(""),
      Math.round(totalAmount),
   ];
   const tr = ws.addRow(totalRowValues);
   ws.mergeCells(`A${tr.number}:${String.fromCharCode(64 + totalCols - 1)}${tr.number}`);

   tr.eachCell((cell, col) => {
      cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFACD" } };
      cell.alignment = { horizontal: col === 1 ? "left" : "right", vertical: "middle" };
      cell.border    = { top: { style: "medium" }, bottom: { style: "medium" }, left: { style: "thin" }, right: { style: "thin" } };
   });
   tr.getCell(totalCols).numFmt = "#,##0";
   tr.height = 18;

   ws.views = [{ state: "frozen", xSplit: withDealer ? 2 : 1, ySplit: 3 }];
   ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };

   return wb.xlsx.writeBuffer();
}