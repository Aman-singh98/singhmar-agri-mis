import ExcelJS from "exceljs";

function num2(v) { return v != null && !isNaN(Number(v)) ? Number(Number(v).toFixed(2)) : 0; }
function today() { return new Date().toLocaleDateString("en-IN"); }

const NOS_COLS = [
   { key: "totalFiles",       label: "Total No. of Files"            },
   { key: "verified",         label: "Verified"                      },
   { key: "pending",          label: "Pending"                       },
   { key: "objection",        label: "Objection"                     },
   { key: "estSubmitted",     label: "Total Est. Submitted"          },
   { key: "estApproved",      label: "Estimate Approved"             },
   { key: "estDeptPending",   label: "Est. Pending from Dept"        },
   { key: "estYetToSubmit",   label: "Est. Yet to Submit"            },
   { key: "miSurveyPending",  label: "MI Survey Pending"             },
   { key: "challanGen",       label: "Farmer Challan Generated"      },
   { key: "fsReceived",       label: "Farmer Share Received"         },
   { key: "fsPaymentPending", label: "Farmer Payment Pending"        },
   { key: "fsGenPending",     label: "Farmer Share Generate Pending" },
   { key: "tallyBill",        label: "Tally Bill"                    },
   { key: "billUploaded",     label: "Bill Uploaded"                 },
   { key: "tallyPending",     label: "Tally Bill Pending"            },
   { key: "pvDone",           label: "PV Done"                       },
   { key: "pvPending",        label: "P.V Pending"                   },
   { key: "xenPending",       label: "XEN Pending"                   },
];

// ── Style helpers ─────────────────────────────────────────────────────────────
function styleHeader(cell, argb) {
   cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
   cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: argb || "FFDDDDDD" } };
   cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
   cell.border    = {
      top:    { style: "thin" }, bottom: { style: "thin" },
      left:   { style: "thin" }, right:  { style: "thin" },
   };
}

function styleData(cell, colIdx, rowIdx) {
   cell.font      = { name: "Arial", size: 9 };
   cell.alignment = { horizontal: colIdx <= 1 ? "left" : "center", vertical: "middle" };
   cell.border    = {
      top:    { style: "hair", color: { argb: "FFCCCCCC" } },
      bottom: { style: "hair", color: { argb: "FFCCCCCC" } },
      left:   { style: "hair", color: { argb: "FFCCCCCC" } },
      right:  { style: "hair", color: { argb: "FFCCCCCC" } },
   };
   cell.fill = {
      type: "pattern", pattern: "solid",
      fgColor: { argb: rowIdx % 2 === 0 ? "FFFFFFFF" : "FFF9F9F9" },
   };
}

function styleTotal(cell, colIdx) {
   cell.font      = { name: "Arial", bold: true, size: 9 };
   cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFACD" } };
   cell.alignment = { horizontal: colIdx <= 1 ? "left" : "center", vertical: "middle" };
   cell.border    = {
      top:    { style: "medium" }, bottom: { style: "medium" },
      left:   { style: "thin"  }, right:  { style: "thin"   },
   };
}

// ── Title block ───────────────────────────────────────────────────────────────
function addTitleBlock(ws, totalCols, title, metaLine) {
   function colLetter(idx) {
      let letter = "";
      let n = idx + 1;
      while (n > 0) {
         const rem = (n - 1) % 26;
         letter = String.fromCharCode(65 + rem) + letter;
         n = Math.floor((n - 1) / 26);
      }
      return letter;
   }
   const lastCol = colLetter(totalCols - 1);

   ws.mergeCells("A1:" + lastCol + "1");
   const t = ws.getCell("A1");
   t.value     = title;
   t.font      = { name: "Arial", bold: true, size: 13 };
   t.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(1).height = 26;

   ws.mergeCells("A2:" + lastCol + "2");
   const m = ws.getCell("A2");
   m.value     = metaLine;
   m.font      = { name: "Arial", size: 10, italic: true };
   m.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(2).height = 16;
}

// ── Build one sheet (Nos or Acre) ─────────────────────────────────────────────
function buildDealerSheet(wb, dealerRows, date, mode) {
   const isAcre  = mode === "acre";
   const wsTitle = isAcre ? "In Acre" : "In Nos";
   const ws      = wb.addWorksheet(wsTitle);

   // Column widths — Dealer Name (col 1) + Dealer Code (col 2) + data cols
   ws.getColumn(1).width = 24;   // Dealer Name
   ws.getColumn(2).width = 14;   // Dealer Code
   NOS_COLS.forEach((_, i) => { ws.getColumn(i + 3).width = 14; });

   const totalCols = 2 + NOS_COLS.length;
   addTitleBlock(
      ws, totalCols,
      `Dealer Summary — ${wsTitle}`,
      "Date: " + (date ?? "—") + "   |   Generated: " + today()
   );

   // Header row
   const headerRow = ws.addRow([
      "Dealer Name", "Dealer Code",
      ...NOS_COLS.map(c => c.label),
   ]);
   headerRow.eachCell(cell => styleHeader(cell));
   ws.getRow(3).height = 28;

   // Data rows
   dealerRows.forEach((row, i) => {
      const vals = [
         String(row.dealerName       ?? ""),
         String(row.farmerDealerCode ?? ""),
         ...NOS_COLS.map(c => {
            const k = isAcre ? c.key + "Acre" : c.key;
            return isAcre ? num2(row[k]) : (Number(row[k]) || 0);
         }),
      ];
      const r = ws.addRow(vals);
      r.eachCell((cell, col) => styleData(cell, col - 1, i));
      if (isAcre) {
         NOS_COLS.forEach((_, ci) => { r.getCell(ci + 3).numFmt = "0.00"; });
      }
      r.height = 16;
   });

   // Total row
   const totals = NOS_COLS.map(c => {
      const k = isAcre ? c.key + "Acre" : c.key;
      const sum = dealerRows.reduce((s, r) => s + (Number(r[k]) || 0), 0);
      return isAcre ? Number(sum.toFixed(2)) : sum;
   });

   const tr = ws.addRow(["Total", "—", ...totals]);
   tr.eachCell((cell, col) => styleTotal(cell, col - 1));
   if (isAcre) {
      NOS_COLS.forEach((_, ci) => { tr.getCell(ci + 3).numFmt = "0.00"; });
   }
   tr.height = 18;

   ws.views      = [{ state: "frozen", xSplit: 2, ySplit: 3 }];
   ws.pageSetup  = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function generateMainFyDealerSummaryExcel(data) {
   const { date, dealerRows = [], mode = "nos" } = data;

   const wb = new ExcelJS.Workbook();
   wb.creator = "System";
   wb.created = new Date();

   // Mode ke hisaab se sheet — agar dono chahiye to dono banao,
   // akela mode pass karo to sirf woh sheet
   if (mode === "nos" || mode === "both") buildDealerSheet(wb, dealerRows, date, "nos");
   if (mode === "acre" || mode === "both") buildDealerSheet(wb, dealerRows, date, "acre");

   // Default: dono sheets always export karo (Today Summary jaisa)
   if (mode !== "nos" && mode !== "acre" && mode !== "both") {
      buildDealerSheet(wb, dealerRows, date, "nos");
      buildDealerSheet(wb, dealerRows, date, "acre");
   }

   return wb.xlsx.writeBuffer();
}