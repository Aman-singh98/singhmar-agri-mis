
// import ExcelJS from "exceljs";

// function safe(v)  { return v != null && v !== "" ? v : "—"; }
// function numIN(v) { return v != null && !isNaN(Number(v)) ? Math.round(Number(v)) : "—"; }
// function today()  { return new Date().toLocaleDateString("en-IN"); }
// function fmtDate(val) {
//    if (!val) return "—";
//    const d = new Date(val);
//    if (isNaN(d.getTime())) return "—";
//    return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
// }

// export async function generateMaterialDispatchReceiptsExcel(records, financialYear, dealerName) {
//    const resolvedDealerName = dealerName && dealerName !== "—" ? dealerName : null;
//    const withDealer = !resolvedDealerName;

//    const wb = new ExcelJS.Workbook();
//    wb.creator = "System";
//    wb.created = new Date();
//    const ws  = wb.addWorksheet("Receipts");

//    if (withDealer) {
//       ws.columns = [
//          { key: "sn",         width: 8  },
//          { key: "dealerName", width: 28 },
//          { key: "date",       width: 14 },
//          { key: "amount",     width: 18 },
//          { key: "remark1",    width: 30 },
//          { key: "remark2",    width: 30 },
//       ];
//    } else {
//       ws.columns = [
//          { key: "sn",      width: 8  },
//          { key: "date",    width: 16 },
//          { key: "amount",  width: 18 },
//          { key: "remark1", width: 35 },
//          { key: "remark2", width: 35 },
//       ];
//    }

//    const totalCols  = ws.columns.length;
//    const lastColLet = String.fromCharCode(64 + totalCols);

//    // ── Row 1: Title ──────────────────────────────────────────────────────────
//    ws.mergeCells(`A1:${lastColLet}1`);
//    const t = ws.getCell("A1");
//    t.value     = "Material Dispatch — Receipts";
//    t.font      = { name: "Arial", bold: true, size: 14 };
//    t.alignment = { horizontal: "center", vertical: "middle" };
//    ws.getRow(1).height = 28;

//    // ── Row 2: Meta ───────────────────────────────────────────────────────────
//    ws.mergeCells(`A2:${lastColLet}2`);
//    const metaParts = [];
//    if (financialYear)      metaParts.push(`FY: ${financialYear}`);
//    if (resolvedDealerName) metaParts.push(`Dealer: ${resolvedDealerName}`);
//    metaParts.push(`Generated: ${today()}`);
//    const m = ws.getCell("A2");
//    m.value     = metaParts.join("   |   ");
//    m.font      = { name: "Arial", size: 10, italic: true };
//    m.alignment = { horizontal: "center", vertical: "middle" };
//    ws.getRow(2).height = 18;

//    // ── Row 3: Column Headers ─────────────────────────────────────────────────
//    const HEADERS = withDealer
//       ? ["S.No", "Dealer Name", "Date", "Amount", "Remark 1", "Remark 2"]
//       : ["S.No", "Date", "Amount", "Remark 1", "Remark 2"];

//    const hr = ws.addRow(HEADERS);
//    hr.eachCell(cell => {
//       cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
//       cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDDDDD" } };
//       cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
//       cell.border    = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
//    });
//    ws.getRow(3).height = 20;

//    // ── Data Rows ─────────────────────────────────────────────────────────────
//    let totalAmount = 0;
//    // Amount column index (1-based)
//    const amtCol = withDealer ? 4 : 3;

//    records.forEach((rec, i) => {
//       totalAmount += Number(rec.amount) || 0;

//       const rowData = withDealer
//          ? [i + 1, safe(rec.dealerName), fmtDate(rec.date), numIN(rec.amount), safe(rec.remark1), safe(rec.remark2)]
//          : [i + 1, fmtDate(rec.date), numIN(rec.amount), safe(rec.remark1), safe(rec.remark2)];

//       const row = ws.addRow(rowData);

//       row.eachCell((cell, col) => {
//          cell.font      = { name: "Arial", size: 9 };
//          const isCenter = col === 1 || col === (withDealer ? 3 : 2); // S.No + Date
//          const isRight  = col === amtCol;
//          cell.alignment = {
//             horizontal: isRight ? "right" : isCenter ? "center" : "left",
//             vertical: "middle",
//          };
//          cell.border = { top: { style: "hair", color: { argb: "FFCCCCCC" } }, bottom: { style: "hair", color: { argb: "FFCCCCCC" } }, left: { style: "hair", color: { argb: "FFCCCCCC" } }, right: { style: "hair", color: { argb: "FFCCCCCC" } } };
//          cell.fill   = { type: "pattern", pattern: "solid", fgColor: { argb: i % 2 === 0 ? "FFFFFFFF" : "FFF9F9F9" } };
//       });
//       row.getCell(amtCol).numFmt = "#,##0";
//       row.height = 16;
//    });

//    // ── Total Row ─────────────────────────────────────────────────────────────
//    const totalRowValues = [
//       `TOTAL   ${records.length} Record${records.length !== 1 ? "s" : ""}`,
//       ...Array(totalCols - 2).fill(""),
//       Math.round(totalAmount),
//    ];
//    const tr = ws.addRow(totalRowValues);
//    ws.mergeCells(`A${tr.number}:${String.fromCharCode(64 + totalCols - 1)}${tr.number}`);

//    tr.eachCell((cell, col) => {
//       cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
//       cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFACD" } };
//       cell.alignment = { horizontal: col === 1 ? "left" : "right", vertical: "middle" };
//       cell.border    = { top: { style: "medium" }, bottom: { style: "medium" }, left: { style: "thin" }, right: { style: "thin" } };
//    });
//    tr.getCell(amtCol).numFmt = "#,##0";
//    tr.height = 18;

//    ws.views = [{ state: "frozen", xSplit: withDealer ? 2 : 1, ySplit: 3 }];
//    ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };

//    return wb.xlsx.writeBuffer();
// }








import ExcelJS from "exceljs";

function safe(v)  { return v != null && v !== "" ? v : "—"; }
function numIN(v) { return v != null && !isNaN(Number(v)) ? Math.round(Number(v)) : "—"; }
function today()  { return new Date().toLocaleDateString("en-IN"); }
function fmtDate(val) {
   if (!val) return "—";
   const d = new Date(val);
   if (isNaN(d.getTime())) return "—";
   return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
}

// ✅ Date sort helper — ascending order (oldest first)
function sortByDate(records) {
   return [...records].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
   });
}

export async function generateMaterialDispatchReceiptsExcel(records, financialYear, dealerName) {
   // ✅ Sort records by date before processing
   const sortedRecords = sortByDate(records);

   const resolvedDealerName = dealerName && dealerName !== "—" ? dealerName : null;
   const withDealer = !resolvedDealerName;

   const wb = new ExcelJS.Workbook();
   wb.creator = "System";
   wb.created = new Date();
   const ws  = wb.addWorksheet("Receipts");

   if (withDealer) {
      ws.columns = [
         { key: "sn",         width: 8  },
         { key: "dealerName", width: 28 },
         { key: "date",       width: 14 },
         { key: "amount",     width: 18 },
         { key: "remark1",    width: 30 },
         { key: "remark2",    width: 30 },
      ];
   } else {
      ws.columns = [
         { key: "sn",      width: 8  },
         { key: "date",    width: 16 },
         { key: "amount",  width: 18 },
         { key: "remark1", width: 35 },
         { key: "remark2", width: 35 },
      ];
   }

   const totalCols  = ws.columns.length;
   const lastColLet = String.fromCharCode(64 + totalCols);

   // ── Row 1: Title ──────────────────────────────────────────────────────────
   ws.mergeCells(`A1:${lastColLet}1`);
   const t = ws.getCell("A1");
   t.value     = "Material Dispatch — Receipts";
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
   const HEADERS = withDealer
      ? ["S.No", "Dealer Name", "Date", "Amount", "Remark 1", "Remark 2"]
      : ["S.No", "Date", "Amount", "Remark 1", "Remark 2"];

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
   const amtCol = withDealer ? 4 : 3;

   // ✅ Use sortedRecords instead of records
   sortedRecords.forEach((rec, i) => {
      totalAmount += Number(rec.amount) || 0;

      const rowData = withDealer
         ? [i + 1, safe(rec.dealerName), fmtDate(rec.date), numIN(rec.amount), safe(rec.remark1), safe(rec.remark2)]
         : [i + 1, fmtDate(rec.date), numIN(rec.amount), safe(rec.remark1), safe(rec.remark2)];

      const row = ws.addRow(rowData);

      row.eachCell((cell, col) => {
         cell.font      = { name: "Arial", size: 9 };
         const isCenter = col === 1 || col === (withDealer ? 3 : 2);
         const isRight  = col === amtCol;
         cell.alignment = {
            horizontal: isRight ? "right" : isCenter ? "center" : "left",
            vertical: "middle",
         };
         cell.border = { top: { style: "hair", color: { argb: "FFCCCCCC" } }, bottom: { style: "hair", color: { argb: "FFCCCCCC" } }, left: { style: "hair", color: { argb: "FFCCCCCC" } }, right: { style: "hair", color: { argb: "FFCCCCCC" } } };
         cell.fill   = { type: "pattern", pattern: "solid", fgColor: { argb: i % 2 === 0 ? "FFFFFFFF" : "FFF9F9F9" } };
      });
      row.getCell(amtCol).numFmt = "#,##0";
      row.height = 16;
   });

   // ── Total Row ─────────────────────────────────────────────────────────────
   const totalRowValues = [
      `TOTAL   ${sortedRecords.length} Record${sortedRecords.length !== 1 ? "s" : ""}`,
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
   tr.getCell(amtCol).numFmt = "#,##0";
   tr.height = 18;

   ws.views = [{ state: "frozen", xSplit: withDealer ? 2 : 1, ySplit: 3 }];
   ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };

   return wb.xlsx.writeBuffer();
}