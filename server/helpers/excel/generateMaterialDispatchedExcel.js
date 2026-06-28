
// import ExcelJS from "exceljs";

// function safe(v)  { return v != null && v !== "" ? v : "—"; }
// function num2(v)  { return v != null && !isNaN(Number(v)) ? Number(Number(v).toFixed(2)) : "—"; }
// function numIN(v) { return v != null && !isNaN(Number(v)) ? Math.round(Number(v)) : "—"; }
// function today()  { return new Date().toLocaleDateString("en-IN"); }
// function fmtDate(val) {
//    if (!val) return "—";
//    const d = new Date(val);
//    return isNaN(d.getTime()) ? "—"
//       : `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
// }

// export async function generateMaterialDispatchedExcel(records, financialYear, dealerName) {
//    const resolvedDealerName = dealerName && dealerName !== "—" ? dealerName : null;
//    const withDealer = !resolvedDealerName;

//    const wb = new ExcelJS.Workbook();
//    wb.creator = "System";
//    wb.created = new Date();
//    const ws  = wb.addWorksheet("Material Dispatched");

//    if (withDealer) {
//       ws.columns = [
//          { key: "sn",              width: 7  },
//          { key: "dealerName",      width: 20 },
//          { key: "farmerName",      width: 20 },
//          { key: "address",         width: 20 },
//          { key: "brandName",       width: 16 },
//          { key: "date",            width: 13 },
//          { key: "challanNo",       width: 14 },
//          { key: "vehicleNo",       width: 14 },
//          { key: "destination",     width: 18 },
//          { key: "miniAcres",       width: 10 },
//          { key: "miniFarmerShare", width: 14 },
//          { key: "dripAcres",       width: 10 },
//          { key: "dripFarmerShare", width: 14 },
//          { key: "hdpeAcres",       width: 10 },
//          { key: "hdpeFarmerShare", width: 14 },
//          { key: "reference",       width: 30 },
//       ];
//    } else {
//       ws.columns = [
//          { key: "sn",              width: 7  },
//          { key: "farmerName",      width: 22 },
//          { key: "address",         width: 22 },
//          { key: "brandName",       width: 18 },
//          { key: "date",            width: 14 },
//          { key: "challanNo",       width: 15 },
//          { key: "vehicleNo",       width: 15 },
//          { key: "destination",     width: 20 },
//          { key: "miniAcres",       width: 11 },
//          { key: "miniFarmerShare", width: 15 },
//          { key: "dripAcres",       width: 11 },
//          { key: "dripFarmerShare", width: 15 },
//          { key: "hdpeAcres",       width: 11 },
//          { key: "hdpeFarmerShare", width: 15 },
//          { key: "reference",       width: 35 },
//       ];
//    }

//    const totalCols  = ws.columns.length;
//    const lastColLet = String.fromCharCode(64 + totalCols);

//    // ── Row 1: Title ──────────────────────────────────────────────────────────
//    ws.mergeCells(`A1:${lastColLet}1`);
//    const t = ws.getCell("A1");
//    t.value     = "Material Dispatched Report";
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
//       ? [
//          "S.No", "Dealer Name", "Farmer Name", "Address", "Brand Name", "Date",
//          "Challan No", "Vehicle No", "Destination",
//          "Mini Ac.", "Mini FS", "Drip Ac.", "Drip FS", "HDPE Ac.", "HDPE FS",
//          "Reference",
//       ]
//       : [
//          "S.No", "Farmer Name", "Address", "Brand Name", "Date",
//          "Challan No", "Vehicle No", "Destination",
//          "Mini Ac.", "Mini FS", "Drip Ac.", "Drip FS", "HDPE Ac.", "HDPE FS",
//          "Reference",
//       ];

//    const hr = ws.addRow(HEADERS);
//    hr.eachCell(cell => {
//       cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
//       cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDDDDD" } };
//       cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
//       cell.border    = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
//    });
//    ws.getRow(3).height = 20;

//    // ── Data Rows ─────────────────────────────────────────────────────────────
//    const totals = {
//       miniAcres: 0, miniFarmerShare: 0,
//       dripAcres: 0, dripFarmerShare: 0,
//       hdpeAcres: 0, hdpeFarmerShare: 0,
//    };

//    const miniAcCol = withDealer ? 10 : 9;
//    const miniFSCol = withDealer ? 11 : 10;
//    const dripAcCol = withDealer ? 12 : 11;
//    const dripFSCol = withDealer ? 13 : 12;
//    const hdpeAcCol = withDealer ? 14 : 13;
//    const hdpeFSCol = withDealer ? 15 : 14;
//    const rightCols = [miniAcCol, miniFSCol, dripAcCol, dripFSCol, hdpeAcCol, hdpeFSCol];
//    const dateCol   = withDealer ? 6 : 5;

//    records.forEach((rec, i) => {
//       totals.miniAcres       += Number(rec.miniAcres)       || 0;
//       totals.miniFarmerShare += Number(rec.miniFarmerShare) || 0;
//       totals.dripAcres       += Number(rec.dripAcres)       || 0;
//       totals.dripFarmerShare += Number(rec.dripFarmerShare) || 0;
//       totals.hdpeAcres       += Number(rec.hdpeAcres)       || 0;
//       totals.hdpeFarmerShare += Number(rec.hdpeFarmerShare) || 0;

//       // ✅ srNo ko sort order mein rakho — fallback sirf agar missing ho
//       const srNo = i + 1;

//       const rowData = withDealer
//          ? [
//             srNo,
//             safe(rec.dealerName),
//             safe(rec.farmerName),
//             safe(rec.address),
//             safe(rec.brandName),
//             fmtDate(rec.date),
//             safe(rec.challanNo),
//             safe(rec.vehicleNo),
//             safe(rec.destination),
//             num2(rec.miniAcres),
//             numIN(rec.miniFarmerShare),
//             num2(rec.dripAcres),
//             numIN(rec.dripFarmerShare),
//             num2(rec.hdpeAcres),
//             numIN(rec.hdpeFarmerShare),
//             safe(rec.reference),
//          ]
//          : [
//             srNo,
//             safe(rec.farmerName),
//             safe(rec.address),
//             safe(rec.brandName),
//             fmtDate(rec.date),
//             safe(rec.challanNo),
//             safe(rec.vehicleNo),
//             safe(rec.destination),
//             num2(rec.miniAcres),
//             numIN(rec.miniFarmerShare),
//             num2(rec.dripAcres),
//             numIN(rec.dripFarmerShare),
//             num2(rec.hdpeAcres),
//             numIN(rec.hdpeFarmerShare),
//             safe(rec.reference),
//          ];

//       const row = ws.addRow(rowData);

//       row.eachCell((cell, col) => {
//          cell.font      = { name: "Arial", size: 9 };
//          cell.alignment = {
//             horizontal: col === 1 ? "center" : col === dateCol ? "center" : rightCols.includes(col) ? "right" : "left",
//             vertical: "middle",
//          };
//          cell.border = { top: { style: "hair", color: { argb: "FFCCCCCC" } }, bottom: { style: "hair", color: { argb: "FFCCCCCC" } }, left: { style: "hair", color: { argb: "FFCCCCCC" } }, right: { style: "hair", color: { argb: "FFCCCCCC" } } };
//          cell.fill   = { type: "pattern", pattern: "solid", fgColor: { argb: i % 2 === 0 ? "FFFFFFFF" : "FFF9F9F9" } };
//       });
//       [miniAcCol, dripAcCol, hdpeAcCol].forEach(c => { row.getCell(c).numFmt = "0.00"; });
//       [miniFSCol, dripFSCol, hdpeFSCol].forEach(c => { row.getCell(c).numFmt = "#,##0"; });
//       row.height = 16;
//    });

//    // ── Total Row ─────────────────────────────────────────────────────────────
//    const mergeEndCol     = String.fromCharCode(64 + (withDealer ? 9 : 8));
//    const emptyCellsCount = (withDealer ? 9 : 8) - 1;

//    const totalRowValues = [
//       `TOTAL   ${records.length} Record${records.length !== 1 ? "s" : ""}`,
//       ...Array(emptyCellsCount).fill(""),
//       Number(totals.miniAcres.toFixed(2)),
//       Math.round(totals.miniFarmerShare),
//       Number(totals.dripAcres.toFixed(2)),
//       Math.round(totals.dripFarmerShare),
//       Number(totals.hdpeAcres.toFixed(2)),
//       Math.round(totals.hdpeFarmerShare),
//       "",
//    ];
//    const tr = ws.addRow(totalRowValues);
//    ws.mergeCells(`A${tr.number}:${mergeEndCol}${tr.number}`);

//    tr.eachCell((cell, col) => {
//       cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
//       cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFACD" } };
//       cell.alignment = { horizontal: col === 1 ? "left" : "right", vertical: "middle" };
//       cell.border    = { top: { style: "medium" }, bottom: { style: "medium" }, left: { style: "thin" }, right: { style: "thin" } };
//    });
//    [miniAcCol, dripAcCol, hdpeAcCol].forEach(c => { tr.getCell(c).numFmt = "0.00"; });
//    [miniFSCol, dripFSCol, hdpeFSCol].forEach(c => { tr.getCell(c).numFmt = "#,##0"; });
//    tr.height = 18;

//    ws.views = [{ state: "frozen", xSplit: withDealer ? 2 : 1, ySplit: 3 }];
//    ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };

//    return wb.xlsx.writeBuffer();
// }











import ExcelJS from "exceljs";

function safe(v)  { return v != null && v !== "" ? v : "—"; }
function num2(v)  { return v != null && !isNaN(Number(v)) ? Number(Number(v).toFixed(2)) : "—"; }
function numIN(v) { return v != null && !isNaN(Number(v)) ? Math.round(Number(v)) : "—"; }
function today()  { return new Date().toLocaleDateString("en-IN"); }
function fmtDate(val) {
   if (!val) return "—";
   const d = new Date(val);
   return isNaN(d.getTime()) ? "—"
      : `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
}

// ✅ Date sort helper — ascending order (oldest first)
function sortByDate(records) {
   return [...records].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB; // ascending
   });
}

export async function generateMaterialDispatchedExcel(records, financialYear, dealerName, dealerCode) {
   // ✅ Sort records by date before processing
   const sortedRecords = sortByDate(records);

   const resolvedDealerName = dealerName && dealerName !== "—" ? dealerName : null;
   const resolvedDealerCode = dealerCode && String(dealerCode).trim() && String(dealerCode).trim() !== "—" 
      ? String(dealerCode).trim() 
      : null;
   const withDealer = !resolvedDealerName;

   const wb = new ExcelJS.Workbook();
   wb.creator = "System";
   wb.created = new Date();
   const ws  = wb.addWorksheet("Material Dispatched");

   // ── Columns (PDF jaisa) ───────────────────────────────────────────────────
   if (withDealer) {
      ws.columns = [
         { key: "sn",              width: 6  },
         { key: "dealerName",      width: 16 },
         { key: "farmerName",      width: 18 },
         { key: "address",         width: 20 },
         { key: "brandName",       width: 14 },
         { key: "date",            width: 14 },
         { key: "challanNo",       width: 14 },
         { key: "vehicleNo",       width: 14 },
         { key: "destination",     width: 16 },
         { key: "miniAcres",       width: 10 },
         { key: "miniFarmerShare", width: 12 },
         { key: "dripAcres",       width: 10 },
         { key: "dripFarmerShare", width: 12 },
         { key: "hdpeAcres",       width: 10 },
         { key: "hdpeFarmerShare", width: 12 },
         { key: "reference",       width: 30 },
      ];
   } else {
      ws.columns = [
         { key: "sn",              width: 6  },
         { key: "farmerName",      width: 20 },
         { key: "address",         width: 22 },
         { key: "brandName",       width: 16 },
         { key: "date",            width: 14 },
         { key: "challanNo",       width: 14 },
         { key: "vehicleNo",       width: 14 },
         { key: "destination",     width: 18 },
         { key: "miniAcres",       width: 11 },
         { key: "miniFarmerShare", width: 13 },
         { key: "dripAcres",       width: 11 },
         { key: "dripFarmerShare", width: 13 },
         { key: "hdpeAcres",       width: 11 },
         { key: "hdpeFarmerShare", width: 13 },
         { key: "reference",       width: 35 },
      ];
   }

   const totalCols  = ws.columns.length;
   const lastColLet = String.fromCharCode(64 + totalCols);

   // ── Row 1: Title ──────────────────────────────────────────────────────────
   ws.mergeCells(`A1:${lastColLet}1`);
   const t = ws.getCell("A1");
   t.value     = "Material Dispatched Report";
   t.font      = { name: "Arial", bold: true, size: 14 };
   t.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(1).height = 28;

   // ── Row 2: Meta ───────────────────────────────────────────────────────────
   ws.mergeCells(`A2:${lastColLet}2`);
   const metaParts = [];
   if (financialYear)      metaParts.push(`FY: ${financialYear}`);
   if (resolvedDealerName) metaParts.push(`Dealer: ${resolvedDealerName}`);
   if (resolvedDealerCode) metaParts.push(`Code: ${resolvedDealerCode}`);
   metaParts.push(`Generated: ${today()}`);
   const m = ws.getCell("A2");
   m.value     = metaParts.join("   |   ");
   m.font      = { name: "Arial", size: 10, italic: true };
   m.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(2).height = 18;

   // ── Row 3: Column Headers ─────────────────────────────────────────────────
   const HEADERS = withDealer
      ? [
         "S.No", "Dealer Name", "Farmer Name", "Address", "Brand Name", "Date",
         "Challan No", "Vehicle No", "Destination",
         "Mini Ac.", "Mini FS", "Drip Ac.", "Drip FS", "HDPE Ac.", "HDPE FS",
         "Reference",
      ]
      : [
         "S.No", "Farmer Name", "Address", "Brand Name", "Date",
         "Challan No", "Vehicle No", "Destination",
         "Mini Ac.", "Mini FS", "Drip Ac.", "Drip FS", "HDPE Ac.", "HDPE FS",
         "Reference",
      ];

   const hr = ws.addRow(HEADERS);
   hr.eachCell(cell => {
      cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDDDDD" } };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border    = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
   });
   ws.getRow(3).height = 20;

   // ── Data Rows ─────────────────────────────────────────────────────────────
   const totals = {
      count:           0,
      miniAcres:       0,
      miniFarmerShare: 0,
      dripAcres:       0,
      dripFarmerShare: 0,
      hdpeAcres:       0,
      hdpeFarmerShare: 0,
   };

   const miniAcCol = withDealer ? 10 : 9;
   const miniFSCol = withDealer ? 11 : 10;
   const dripAcCol = withDealer ? 12 : 11;
   const dripFSCol = withDealer ? 13 : 12;
   const hdpeAcCol = withDealer ? 14 : 13;
   const hdpeFSCol = withDealer ? 15 : 14;
   const rightCols = [miniAcCol, miniFSCol, dripAcCol, dripFSCol, hdpeAcCol, hdpeFSCol];
   const dateCol   = withDealer ? 6 : 5;

   // ✅ Use sortedRecords instead of records
   sortedRecords.forEach((rec, i) => {
      totals.count++;
      totals.miniAcres       += Number(rec.miniAcres)       || 0;
      totals.miniFarmerShare += Number(rec.miniFarmerShare) || 0;
      totals.dripAcres       += Number(rec.dripAcres)       || 0;
      totals.dripFarmerShare += Number(rec.dripFarmerShare) || 0;
      totals.hdpeAcres       += Number(rec.hdpeAcres)       || 0;
      totals.hdpeFarmerShare += Number(rec.hdpeFarmerShare) || 0;

      // ✅ S.No = serial number (1, 2, 3...) — PDF jaisa
      const srNo = i + 1;

      const rowData = withDealer
         ? [
            srNo,
            safe(rec.dealerName),
            safe(rec.farmerName),
            safe(rec.address),
            safe(rec.brandName),
            fmtDate(rec.date),
            safe(rec.challanNo),
            safe(rec.vehicleNo),
            safe(rec.destination),
            num2(rec.miniAcres),
            numIN(rec.miniFarmerShare),
            num2(rec.dripAcres),
            numIN(rec.dripFarmerShare),
            num2(rec.hdpeAcres),
            numIN(rec.hdpeFarmerShare),
            safe(rec.reference),
         ]
         : [
            srNo,
            safe(rec.farmerName),
            safe(rec.address),
            safe(rec.brandName),
            fmtDate(rec.date),
            safe(rec.challanNo),
            safe(rec.vehicleNo),
            safe(rec.destination),
            num2(rec.miniAcres),
            numIN(rec.miniFarmerShare),
            num2(rec.dripAcres),
            numIN(rec.dripFarmerShare),
            num2(rec.hdpeAcres),
            numIN(rec.hdpeFarmerShare),
            safe(rec.reference),
         ];

      const row = ws.addRow(rowData);

      row.eachCell((cell, col) => {
         cell.font      = { name: "Arial", size: 9 };
         cell.alignment = {
            horizontal: col === 1 ? "center" : col === dateCol ? "center" : rightCols.includes(col) ? "right" : "left",
            vertical: "middle",
         };
         cell.border = { top: { style: "hair", color: { argb: "FFCCCCCC" } }, bottom: { style: "hair", color: { argb: "FFCCCCCC" } }, left: { style: "hair", color: { argb: "FFCCCCCC" } }, right: { style: "hair", color: { argb: "FFCCCCCC" } } };
         cell.fill   = { type: "pattern", pattern: "solid", fgColor: { argb: i % 2 === 0 ? "FFFFFFFF" : "FFF9F9F9" } };
      });
      [miniAcCol, dripAcCol, hdpeAcCol].forEach(c => { row.getCell(c).numFmt = "0.00"; });
      [miniFSCol, dripFSCol, hdpeFSCol].forEach(c => { row.getCell(c).numFmt = "#,##0"; });
      row.height = 16;
   });

   // ── Overall Summary Box (PDF jaisa) ───────────────────────────────────────
   const summaryStartRow = ws.rowCount + 2;
   const boxRows = 3;

   ws.mergeCells(`A${summaryStartRow}:${lastColLet}${summaryStartRow}`);
   const summaryTitle = ws.getCell(`A${summaryStartRow}`);
   summaryTitle.value = "Overall Summary";
   summaryTitle.font = { name: "Arial", bold: true, size: 10, color: { argb: "FF000000" } };
   summaryTitle.alignment = { horizontal: "left", vertical: "middle" };
   ws.getRow(summaryStartRow).height = 18;

   const cards = [
      { label: "Total Records",     value: String(totals.count),                sub: "Records" },
      { label: "Mini Irrigated",    value: Number(totals.miniAcres).toFixed(2), sub: "Acres" },
      { label: "Mini Farmer Share", value: numIN(totals.miniFarmerShare),        sub: "Rs" },
      { label: "Drip Irrigated",    value: Number(totals.dripAcres).toFixed(2),  sub: "Acres" },
      { label: "Drip Farmer Share", value: numIN(totals.dripFarmerShare),        sub: "Rs" },
      { label: "HDPE",              value: Number(totals.hdpeAcres).toFixed(2),  sub: "Acres" },
      { label: "HDPE Farmer Share", value: numIN(totals.hdpeFarmerShare),        sub: "Rs" },
   ];

   const cardWidth = totalCols / 7;
   const valueRow = summaryStartRow + 1;
   const subRow = summaryStartRow + 2;

   const bgColors = ["FFF2F3F4", "FFEBF5FB", "FFEBF5FB", "FFEAFAF1", "FFEAFAF1", "FFFDF3E7", "FFFDF3E7"];

   for (let i = 0; i < 7; i++) {
      const startCol = Math.round(1 + i * cardWidth);
      const endCol = Math.round((i + 1) * cardWidth);
      const startColLet = String.fromCharCode(64 + startCol);
      const endColLet = String.fromCharCode(64 + endCol);

      ws.mergeCells(`${startColLet}${valueRow}:${endColLet}${subRow}`);

      const labelCell = ws.getCell(`${startColLet}${valueRow}`);
      labelCell.value = cards[i].label;
      labelCell.font = { name: "Arial", bold: true, size: 7, color: { argb: "FF555555" } };
      labelCell.alignment = { horizontal: "center", vertical: "top" };

      const valueCell = ws.getCell(`${startColLet}${valueRow + 1}`);
      valueCell.value = cards[i].value;
      valueCell.font = { name: "Arial", bold: true, size: 11, color: { argb: "FF000000" } };
      valueCell.alignment = { horizontal: "center", vertical: "center" };

      const subCell = ws.getCell(`${startColLet}${subRow}`);
      subCell.value = cards[i].sub;
      subCell.font = { name: "Arial", size: 7.5, color: { argb: "FF888888" } };
      subCell.alignment = { horizontal: "center", vertical: "bottom" };

      for (let r = valueRow; r <= subRow; r++) {
         for (let c = startCol; c <= endCol; c++) {
            const cell = ws.getCell(`${String.fromCharCode(64 + c)}${r}`);
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColors[i] } };
            cell.border = { 
               top: { style: "thin", color: { argb: "FFCCCCCC" } }, 
               bottom: { style: "thin", color: { argb: "FFCCCCCC" } }, 
               left: { style: "thin", color: { argb: "FFCCCCCC" } }, 
               right: { style: "thin", color: { argb: "FFCCCCCC" } } 
            };
         }
      }
   }

   ws.getRow(valueRow).height = 22;
   ws.getRow(subRow).height = 16;

   const boxTop = valueRow;
   const boxBottom = subRow;
   for (let c = 1; c <= totalCols; c++) {
      const colLet = String.fromCharCode(64 + c);
      const topCell = ws.getCell(`${colLet}${boxTop}`);
      const bottomCell = ws.getCell(`${colLet}${boxBottom}`);
      topCell.border = { ...topCell.border, top: { style: "medium", color: { argb: "FF000000" } } };
      bottomCell.border = { ...bottomCell.border, bottom: { style: "medium", color: { argb: "FF000000" } } };
   }

   ws.views = [{ state: "frozen", xSplit: withDealer ? 2 : 1, ySplit: 3 }];
   ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };

   return wb.xlsx.writeBuffer();
}