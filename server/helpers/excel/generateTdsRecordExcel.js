
// import ExcelJS from "exceljs";

// function safe(v) { return v != null && v !== "" ? v : "—"; }
// function today() { return new Date().toLocaleDateString("en-IN"); }

// export async function generateTdsRecordExcel(records, financialYear, dealerName) {
//    // ✅ srNo se sort karo
//    const sorted = [...records].sort((a, b) => (a.srNo ?? 0) - (b.srNo ?? 0));

//    // ✅ dealerName sirf tab use karo jab explicitly pass ho
//    const resolvedDealerName = dealerName && dealerName !== "—" ? dealerName : null;

//    const wb = new ExcelJS.Workbook();
//    wb.creator = "System";
//    wb.created = new Date();

//    const ws = wb.addWorksheet("TDS Record");

//    ws.columns = [
//       { key: "srNo",       width: 8  },
//       { key: "company",    width: 12 },
//       { key: "farmerName", width: 26 },
//       { key: "fatherName", width: 24 },
//       { key: "address",    width: 32 },
//       { key: "panNo",      width: 16 },
//       { key: "tds",        width: 16 },
//    ];

//    // ── Row 1: Title ─────────────────────────────────────────────────────────
//    ws.mergeCells("A1:G1");
//    const titleCell = ws.getCell("A1");
//    titleCell.value = "TDS Record Report";
//    titleCell.font  = { name: "Arial", bold: true, size: 14 };
//    titleCell.alignment = { horizontal: "center", vertical: "middle" };
//    ws.getRow(1).height = 28;

//    // ── Row 2: Meta ──────────────────────────────────────────────────────────
//    ws.mergeCells("A2:G2");
//    const metaParts = [];
//    if (financialYear)      metaParts.push(`FY: ${financialYear}`);
//    if (resolvedDealerName) metaParts.push(`Dealer: ${resolvedDealerName}`); // ✅ only when filtered
//    metaParts.push(`Generated: ${today()}`);
//    const metaCell = ws.getCell("A2");
//    metaCell.value = metaParts.join("   |   ");
//    metaCell.font  = { name: "Arial", size: 10, italic: true };
//    metaCell.alignment = { horizontal: "center", vertical: "middle" };
//    ws.getRow(2).height = 18;

//    // ── Row 3: Column Headers ────────────────────────────────────────────────
//    const headerRow = ws.addRow(["S.No", "Company", "Farmer Name", "Father Name", "Address", "PAN No", "TDS (₹)"]);
//    headerRow.eachCell(cell => {
//       cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
//       cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDDDDD" } };
//       cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
//       cell.border    = {
//          top:    { style: "thin" }, bottom: { style: "thin" },
//          left:   { style: "thin" }, right:  { style: "thin" },
//       };
//    });
//    ws.getRow(3).height = 20;

//    // ── Data Rows ────────────────────────────────────────────────────────────
//    let totalTds = 0;

//    sorted.forEach((rec, i) => {
//       const tds = Number(rec.tds) || 0;
//       totalTds += tds;

//       const row = ws.addRow([
//          rec.srNo ?? i + 1,
//          safe(rec.company),
//          safe(rec.farmerName),
//          safe(rec.fatherName),
//          safe(rec.address),
//          safe(rec.panNo),
//          Math.round(tds),
//       ]);

//       row.eachCell((cell, colNumber) => {
//          cell.font      = { name: "Arial", size: 9 };
//          cell.alignment = {
//             horizontal: colNumber === 1 || colNumber === 2
//                ? "center"
//                : colNumber === 7
//                   ? "right"
//                   : "left",
//             vertical: "middle",
//          };
//          cell.border = {
//             top:    { style: "hair", color: { argb: "FFCCCCCC" } },
//             bottom: { style: "hair", color: { argb: "FFCCCCCC" } },
//             left:   { style: "hair", color: { argb: "FFCCCCCC" } },
//             right:  { style: "hair", color: { argb: "FFCCCCCC" } },
//          };
//          cell.fill = {
//             type: "pattern", pattern: "solid",
//             fgColor: { argb: i % 2 === 0 ? "FFFFFFFF" : "FFF9F9F9" },
//          };
//       });

//       row.getCell(7).numFmt = '#,##0';
//       row.height = 16;
//    });

//    // ── Total Row ────────────────────────────────────────────────────────────
//    const totalRow = ws.addRow([
//       `TOTAL   ${sorted.length} Record${sorted.length !== 1 ? "s" : ""}`,
//       "", "", "", "", "",
//       Math.round(totalTds),
//    ]);
//    ws.mergeCells(`A${totalRow.number}:F${totalRow.number}`);
//    totalRow.eachCell((cell, colNumber) => {
//       cell.font = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
//       cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFACD" } };
//       cell.alignment = {
//          horizontal: colNumber === 1 ? "left" : "right",
//          vertical: "middle",
//       };
//       cell.border = {
//          top:   { style: "medium" }, bottom: { style: "medium" },
//          left:  { style: "thin" },  right:  { style: "thin" },
//       };
//    });
//    totalRow.getCell(7).numFmt = '#,##0';
//    totalRow.height = 18;

//    ws.views = [{ state: "frozen", xSplit: 2, ySplit: 3 }];
//    ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };

//    return wb.xlsx.writeBuffer();
// }






import ExcelJS from "exceljs";

function safe(v) { return v != null && v !== "" ? v : "—"; }
function today() { return new Date().toLocaleDateString("en-IN"); }

export async function generateTdsRecordExcel(records, financialYear, dealerName) {
   const sorted = [...records].sort((a, b) => (a.srNo ?? 0) - (b.srNo ?? 0));

   const resolvedDealerName = dealerName && dealerName !== "—" ? dealerName : null;

   // ✅ dealer filter laga hai toh dealer column nahi, warna hoga
   const withDealer = !resolvedDealerName;

   const wb = new ExcelJS.Workbook();
   wb.creator = "System";
   wb.created = new Date();

   const ws = wb.addWorksheet("TDS Record");

   // ✅ columns — withDealer ke hisaab se
   if (withDealer) {
      ws.columns = [
         { key: "srNo",        width: 8  },
         { key: "dealerName",  width: 24 },
         { key: "company",     width: 10 },
         { key: "farmerName",  width: 24 },
         { key: "fatherName",  width: 22 },
         { key: "address",     width: 32 },
         { key: "panNo",       width: 14 },
         { key: "tds",         width: 14 },
      ];
   } else {
      ws.columns = [
         { key: "srNo",        width: 8  },
         { key: "company",     width: 12 },
         { key: "farmerName",  width: 26 },
         { key: "fatherName",  width: 24 },
         { key: "address",     width: 32 },
         { key: "panNo",       width: 16 },
         { key: "tds",         width: 14 },
      ];
   }

   const totalCols  = ws.columns.length;
   const lastColLet = String.fromCharCode(64 + totalCols); // A=65, so col8='H', col7='G'

   // ── Row 1: Title ─────────────────────────────────────────────────────────
   ws.mergeCells(`A1:${lastColLet}1`);
   const titleCell = ws.getCell("A1");
   titleCell.value = "TDS Record Report";
   titleCell.font  = { name: "Arial", bold: true, size: 14 };
   titleCell.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(1).height = 28;

   // ── Row 2: Meta ──────────────────────────────────────────────────────────
   ws.mergeCells(`A2:${lastColLet}2`);
   const metaParts = [];
   if (financialYear)      metaParts.push(`FY: ${financialYear}`);
   if (resolvedDealerName) metaParts.push(`Dealer: ${resolvedDealerName}`);
   metaParts.push(`Generated: ${today()}`);
   const metaCell = ws.getCell("A2");
   metaCell.value = metaParts.join("   |   ");
   metaCell.font  = { name: "Arial", size: 10, italic: true };
   metaCell.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(2).height = 18;

   // ── Row 3: Column Headers ────────────────────────────────────────────────
   const headerValues = withDealer
      ? ["S.No", "Dealer Name", "Company", "Farmer Name", "Father Name", "Address", "PAN No", "TDS (₹)"]
      : ["S.No", "Company", "Farmer Name", "Father Name", "Address", "PAN No", "TDS (₹)"];

   const headerRow = ws.addRow(headerValues);
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

   // ── Data Rows ────────────────────────────────────────────────────────────
   let totalTds = 0;

   sorted.forEach((rec, i) => {
      const tds = Number(rec.tds) || 0;
      totalTds += tds;

      const rowValues = withDealer
         ? [
            rec.srNo ?? i + 1,
            safe(rec.dealerName),
            safe(rec.company),
            safe(rec.farmerName),
            safe(rec.fatherName),
            safe(rec.address),
            safe(rec.panNo),
            Math.round(tds),
         ]
         : [
            rec.srNo ?? i + 1,
            safe(rec.company),
            safe(rec.farmerName),
            safe(rec.fatherName),
            safe(rec.address),
            safe(rec.panNo),
            Math.round(tds),
         ];

      const row = ws.addRow(rowValues);

      row.eachCell((cell, colNumber) => {
         cell.font = { name: "Arial", size: 9 };

         // alignment: S.No + Company center, TDS right, baki left
         const isCenter = colNumber === 1 || (withDealer ? colNumber === 3 : colNumber === 2);
         const isRight  = colNumber === totalCols;
         cell.alignment = {
            horizontal: isRight ? "right" : isCenter ? "center" : "left",
            vertical: "middle",
            wrapText: true,
         };
         cell.border = {
            top:    { style: "hair", color: { argb: "FFCCCCCC" } },
            bottom: { style: "hair", color: { argb: "FFCCCCCC" } },
            left:   { style: "hair", color: { argb: "FFCCCCCC" } },
            right:  { style: "hair", color: { argb: "FFCCCCCC" } },
         };
         cell.fill = {
            type: "pattern", pattern: "solid",
            fgColor: { argb: i % 2 === 0 ? "FFFFFFFF" : "FFF9F9F9" },
         };
      });

      row.getCell(totalCols).numFmt = '#,##0';
      row.height = 16;
   });

   // ── Total Row ────────────────────────────────────────────────────────────
   const totalRowValues = [
      `TOTAL   ${sorted.length} Record${sorted.length !== 1 ? "s" : ""}`,
      ...Array(totalCols - 2).fill(""),
      Math.round(totalTds),
   ];
   const totalRow = ws.addRow(totalRowValues);
   ws.mergeCells(`A${totalRow.number}:${String.fromCharCode(64 + totalCols - 1)}${totalRow.number}`);

   totalRow.eachCell((cell, colNumber) => {
      cell.font = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFACD" } };
      cell.alignment = {
         horizontal: colNumber === 1 ? "left" : "right",
         vertical: "middle",
      };
      cell.border = {
         top:   { style: "medium" }, bottom: { style: "medium" },
         left:  { style: "thin" },  right:  { style: "thin" },
      };
   });
   totalRow.getCell(totalCols).numFmt = '#,##0';
   totalRow.height = 18;

   ws.views = [{ state: "frozen", xSplit: withDealer ? 2 : 1, ySplit: 3 }];
   ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };

   return wb.xlsx.writeBuffer();
}