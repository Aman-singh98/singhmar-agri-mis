import ExcelJS from "exceljs";

function safe(v) { return v != null && v !== "" ? v : "—"; }
function numIN(v) {
   if (v == null || isNaN(v)) return "—";
   return Math.round(Number(v));
}
function numAcre(v) {
   if (v == null || isNaN(v)) return "—";
   return Number(Number(v).toFixed(2));
}
function today() { return new Date().toLocaleDateString("en-IN"); }

export async function generateTallyBillExcel(records, financialYear, dealerName) {
   const wb = new ExcelJS.Workbook();
   wb.creator = "System";
   wb.created = new Date();

   const ws = wb.addWorksheet("Tally Bills");

   ws.columns = [
      { key: "sn",          width: 8  },
      { key: "miNumber",    width: 20 },
      { key: "farmerName",  width: 25 },
      { key: "fatherName",  width: 22 },
      { key: "village",     width: 18 },
      { key: "type",        width: 16 },
      { key: "acre",        width: 10 },
      { key: "billNo",      width: 16 },
      { key: "billValue",   width: 16 },
      { key: "gst",         width: 16 },
   ];

   ws.mergeCells("A1:J1");
   const titleCell = ws.getCell("A1");
   titleCell.value = "Tally Bill Report";
   titleCell.font  = { name: "Arial", bold: true, size: 14 };
   titleCell.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(1).height = 28;

   ws.mergeCells("A2:J2");
   const metaParts = [];
   if (financialYear) metaParts.push(`FY: ${financialYear}`);
   if (dealerName)    metaParts.push(`Dealer: ${dealerName}`);
   metaParts.push(`Generated: ${today()}`);
   const metaCell = ws.getCell("A2");
   metaCell.value = metaParts.join("   |   ");
   metaCell.font  = { name: "Arial", size: 10, italic: true };
   metaCell.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(2).height = 18;

   const HEADERS = [
      "S.No", "App. ID", "Farmer Name", "Father Name",
      "Village", "Type", "Acre", "Bill No", "Bill Value (₹)", "GST (₹)",
   ];
   const headerRow = ws.addRow(HEADERS);
   headerRow.eachCell(cell => {
      cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDDDDD" } };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border    = {
         top:    { style: "thin" }, bottom: { style: "thin" },
         left:   { style: "thin" }, right:  { style: "thin" },
      };
   });
   ws.getRow(3).height = 20;

   const totals = { acre: 0, billValue: 0, gst: 0 };

   records.forEach((rec, i) => {
      totals.acre      += Number(rec.acre)      || 0;
      totals.billValue += Number(rec.billValue) || 0;
      totals.gst       += Number(rec.gst)       || 0;

      const row = ws.addRow([
         rec.sn ?? i + 1,
         safe(rec.miNumber),
         safe(rec.farmerName),
         safe(rec.fatherName),
         safe(rec.village),
         safe(rec.type),
         numAcre(rec.acre),
         safe(rec.billNo),
         numIN(rec.billValue),
         numIN(rec.gst),
      ]);

      const RIGHT_COLS  = new Set([1, 7, 9, 10]);
      const CENTER_COLS = new Set([1]);

      row.eachCell((cell, colNumber) => {
         cell.font      = { name: "Arial", size: 9 };
         cell.alignment = {
            horizontal: CENTER_COLS.has(colNumber) ? "center"
               : RIGHT_COLS.has(colNumber) ? "right" : "left",
            vertical: "middle",
         };
         cell.border = {
            top:    { style: "hair", color: { argb: "FFCCCCCC" } }, bottom: { style: "hair", color: { argb: "FFCCCCCC" } },
            left:   { style: "hair", color: { argb: "FFCCCCCC" } }, right:  { style: "hair", color: { argb: "FFCCCCCC" } },
         };
         cell.fill = {
            type: "pattern", pattern: "solid",
            fgColor: { argb: i % 2 === 0 ? "FFFFFFFF" : "FFF9F9F9" },
         };
      });

      row.getCell(7).numFmt  = '0.00';
      row.getCell(9).numFmt  = '#,##0';
      row.getCell(10).numFmt = '#,##0';
      row.height = 16;
   });

   const totalRow = ws.addRow([
      `TOTAL   ${records.length} Record${records.length !== 1 ? "s" : ""}`,
      "", "", "", "", "",
      Number(totals.acre.toFixed(2)),
      "",
      Math.round(totals.billValue),
      Math.round(totals.gst),
   ]);

   ws.mergeCells(`A${totalRow.number}:F${totalRow.number}`);

   totalRow.eachCell((cell, colNumber) => {
      cell.font = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFACD" } };
      cell.alignment = {
         horizontal: [1, 8].includes(colNumber) ? "left" : "right",
         vertical: "middle",
      };
      cell.border = {
         top:    { style: "medium" }, bottom: { style: "medium" },
         left:   { style: "thin" }, right:  { style: "thin" },
      };
   });

   totalRow.getCell(7).numFmt  = '0.00';
   totalRow.getCell(9).numFmt  = '#,##0';
   totalRow.getCell(10).numFmt = '#,##0';
   totalRow.height = 18;

   ws.views = [{ state: "frozen", xSplit: 1, ySplit: 3 }];
   ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };

   return wb.xlsx.writeBuffer();
}