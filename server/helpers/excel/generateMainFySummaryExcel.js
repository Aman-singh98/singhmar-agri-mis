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

const DAILY_COLS = [
   { key: "dpVerified",      label: "Verified"                   },
   { key: "dpPending",       label: "Pending"                    },
   { key: "dpInComplete",    label: "In-Complete"                },
   { key: "dpEstApproved",   label: "Estimate Approved"          },
   { key: "dpNewFile",       label: "New File"                   },
   { key: "dpEstSubmitted",  label: "Estimate Submitted"         },
   { key: "dpChallanGen",    label: "Farmer Challan Generated"   },
   { key: "dpTallyBill",     label: "Tally Bill"                 },
   { key: "dpBillUploaded",  label: "Bill Uploaded"              },
   { key: "dpSiteVerified",  label: "Site Verified"              },
   { key: "dpMiSurvey",      label: "MI Survey"                  },
];

function styleHeader(cell, argb) {
   cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
   cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: argb || "FFDDDDDD" } };
   cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
   cell.border    = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
}

function styleData(cell, colIdx, rowIdx) {
   cell.font      = { name: "Arial", size: 9 };
   cell.alignment = { horizontal: colIdx === 0 ? "left" : "center", vertical: "middle" };
   cell.border    = { top: { style: "hair", color: { argb: "FFCCCCCC" } }, bottom: { style: "hair", color: { argb: "FFCCCCCC" } }, left: { style: "hair", color: { argb: "FFCCCCCC" } }, right: { style: "hair", color: { argb: "FFCCCCCC" } } };
   cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: rowIdx % 2 === 0 ? "FFFFFFFF" : "FFF9F9F9" } };
}

function styleTotal(cell, colIdx) {
   cell.font      = { name: "Arial", bold: true, size: 9 };
   cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFACD" } };
   cell.alignment = { horizontal: colIdx === 0 ? "left" : "center", vertical: "middle" };
   cell.border    = { top: { style: "medium" }, bottom: { style: "medium" }, left: { style: "thin" }, right: { style: "thin" } };
}

function addTitleBlock(ws, totalCols, title, metaLine) {
   // Convert totalCols count to Excel column letter
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

// ── Sheet 1: In Nos ───────────────────────────────────────────────────────────
function buildNosSheet(wb, brandRows, date) {
   const ws = wb.addWorksheet("In Nos");

   // Set widths via getColumn (avoids key-mapping issues)
   ws.getColumn(1).width = 18;
   NOS_COLS.forEach((_, i) => { ws.getColumn(i + 2).width = 14; });

   const totalCols = 1 + NOS_COLS.length;
   addTitleBlock(ws, totalCols, "Today Summary — In Nos",
      "Date: " + (date ?? "—") + "   |   Generated: " + today());

   // Header row
   const headerRow = ws.addRow(["Brand", ...NOS_COLS.map(c => c.label)]);
   headerRow.eachCell(cell => styleHeader(cell));
   ws.getRow(3).height = 28;

   // Data rows
   brandRows.forEach((row, i) => {
      const vals = [String(row.brand), ...NOS_COLS.map(c => Number(row[c.key]) || 0)];
      const r = ws.addRow(vals);
      r.eachCell((cell, col) => styleData(cell, col - 1, i));
      r.height = 16;
   });

   // Total row
   const totals = NOS_COLS.map(c => brandRows.reduce((s, r) => s + (Number(r[c.key]) || 0), 0));
   const tr = ws.addRow(["Total", ...totals]);
   tr.eachCell((cell, col) => styleTotal(cell, col - 1));
   tr.height = 18;

   ws.views = [{ state: "frozen", xSplit: 1, ySplit: 3 }];
   ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };
}

// ── Sheet 2: In Acre ──────────────────────────────────────────────────────────
function buildAcreSheet(wb, brandRows, date) {
   const ws = wb.addWorksheet("In Acre");

   ws.getColumn(1).width = 18;
   NOS_COLS.forEach((_, i) => { ws.getColumn(i + 2).width = 14; });

   const totalCols = 1 + NOS_COLS.length;
   addTitleBlock(ws, totalCols, "Today Summary — In Acre",
      "Date: " + (date ?? "—") + "   |   Generated: " + today());

   const headerRow = ws.addRow(["Brand", ...NOS_COLS.map(c => c.label)]);
   headerRow.eachCell(cell => styleHeader(cell));
   ws.getRow(3).height = 28;

   brandRows.forEach((row, i) => {
      const vals = [String(row.brand), ...NOS_COLS.map(c => num2(row[c.key + "Acre"]))];
      const r = ws.addRow(vals);
      r.eachCell((cell, col) => styleData(cell, col - 1, i));
      NOS_COLS.forEach((_, ci) => { r.getCell(ci + 2).numFmt = "0.00"; });
      r.height = 16;
   });

   const totals = NOS_COLS.map(c =>
      Number(brandRows.reduce((s, r) => s + (Number(r[c.key + "Acre"]) || 0), 0).toFixed(2))
   );
   const tr = ws.addRow(["Total", ...totals]);
   tr.eachCell((cell, col) => styleTotal(cell, col - 1));
   NOS_COLS.forEach((_, ci) => { tr.getCell(ci + 2).numFmt = "0.00"; });
   tr.height = 18;

   ws.views = [{ state: "frozen", xSplit: 1, ySplit: 3 }];
   ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };
}

// ── Sheet 3: Daily Progress ───────────────────────────────────────────────────
function buildDailySheet(wb, dailyBrands, date) {
   const ws = wb.addWorksheet("Daily Progress");

   ws.getColumn(1).width = 18;
   DAILY_COLS.forEach((_, i) => { ws.getColumn(i + 2).width = 16; });

   const totalCols = 1 + DAILY_COLS.length;
   addTitleBlock(ws, totalCols, "Today Summary — Daily Progress",
      "Date: " + (date ?? "—") + "   |   Generated: " + today());

   const headerRow = ws.addRow(["Brand", ...DAILY_COLS.map(c => c.label)]);
   headerRow.eachCell(cell => styleHeader(cell, "FFFFE0B2"));
   ws.getRow(3).height = 28;

   dailyBrands.forEach((row, i) => {
      const vals = [String(row.brand), ...DAILY_COLS.map(c => Number(row[c.key]) || 0)];
      const r = ws.addRow(vals);
      r.eachCell((cell, col) => styleData(cell, col - 1, i));
      r.height = 16;
   });

   const totals = DAILY_COLS.map(c => dailyBrands.reduce((s, r) => s + (Number(r[c.key]) || 0), 0));
   const tr = ws.addRow(["Total", ...totals]);
   tr.eachCell((cell, col) => styleTotal(cell, col - 1));
   tr.height = 18;

   ws.views = [{ state: "frozen", xSplit: 1, ySplit: 3 }];
   ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function generateMainFySummaryExcel(data) {
   const { date, brandRows = [], dailyBrands = [] } = data;

   const wb = new ExcelJS.Workbook();
   wb.creator = "System";
   wb.created = new Date();

   buildNosSheet(wb, brandRows, date);
   buildAcreSheet(wb, brandRows, date);
   buildDailySheet(wb, dailyBrands, date);

   return wb.xlsx.writeBuffer();
}