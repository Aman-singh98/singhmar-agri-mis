import ExcelJS from "exceljs";

function safe(v) { return v != null && v !== "" ? String(v) : "—"; }

// Decimal — only for irrigation columns
function num2(v) {
   if (v == null || v === "" || v === "—") return "—";
   const n = Number(v);
   return isNaN(n) ? "—" : Number(n.toFixed(2));
}

// Whole number — for all other numeric columns
function intVal(v) {
   if (v == null || v === "" || v === "—") return "—";
   const n = Number(v);
   return isNaN(n) ? "—" : Math.round(n);
}

function int0(v) { return v != null && !isNaN(Number(v)) ? Number(v) : 0; }
function today() { return new Date().toLocaleDateString("en-IN"); }

/* ── Colors (exact match with React table) ─────────────────────────────── */
const COLORS = {
   slate900:  'FF0f172a',
   slate700:  'FF334155',
   slate500:  'FF64748b',
   slate400:  'FF94a3b8',
   slate300:  'FFcbd5e1',
   slate200:  'FFe2e8f0',
   slate100:  'FFf1f5f9',
   slate50:   'FFf8fafc',
   white:     'FFFFFFFF',
   fuchsia700:'FFa21caf',
   fuchsia100:'FFfae8ff',
   rose700:   'FFbe123c',
   rose100:   'FFffe4e6',
   amber700:  'FFb45309',
   amber100:  'FFfef3c7',
   amberBand: 'FFfde68a',
   amberBand2:'FFfffbeb',
};

/* ── Column definitions ─────────────────────────────────────────────────── */
// irrigation: true  → show as decimal (0.00)
// irrigation: false → show as whole number (0)
const COLUMNS = [
   { key: "Sr No",              header: "Sr.",                width: 6,  numeric: true,  align: "center", irrigation: false },
   { key: "Dealer Name",        header: "Dealer Name",        width: 26, numeric: false, align: "left",   irrigation: false },
   { key: "Dealer Code",        header: "Dealer Code",        width: 14, numeric: false, align: "left",   irrigation: false },
   { key: "No. of File",        header: "No. of File",        width: 12, numeric: true,  align: "right",  irrigation: false },
   { key: "Mini Sprinkler",     header: "Mini Sprinkler",     width: 14, numeric: true,  align: "right",  irrigation: true  },
   { key: "Drip Irrigation",    header: "Drip Irrigation",    width: 14, numeric: true,  align: "right",  irrigation: true  },
   { key: "Portable Sprinkler", header: "Portable Sprinkler", width: 16, numeric: true,  align: "right",  irrigation: true  },
   { key: "MI Submit",          header: "MI Submit",          width: 12, numeric: true,  align: "right",  irrigation: false },
   { key: "%",                  header: "%",                  width: 9,  numeric: false, align: "center", irrigation: false },
   { key: "Cancel/Adjusted",    header: "Cancel/Adjusted",    width: 14, numeric: true,  align: "right",  irrigation: false },
   { key: "Online Pending",     header: "Online Pending",     width: 14, numeric: true,  align: "right",  irrigation: false },
   { key: "Total Acre",         header: "Total Acre",         width: 13, numeric: true,  align: "right",  irrigation: true },
];

const LAST_COL_LETTER = "L"; // 12 columns
const IRRIGATION_START_COL = 5; // "Mini Sprinkler" → column E
const IRRIGATION_END_COL   = 7; // "Portable Sprinkler" → column G

function thinBorder(color = COLORS.slate200) {
   return {
      top:    { style: "thin", color: { argb: color } },
      bottom: { style: "thin", color: { argb: color } },
      left:   { style: "thin", color: { argb: color } },
      right:  { style: "thin", color: { argb: color } },
   };
}

export async function generateMainFileDealerSummaryExcel(data) {
   const { title, records, search } = data;

   if (!Array.isArray(records) || records.length === 0) {
      throw new Error("No records to export");
   }

   const wb = new ExcelJS.Workbook();
   wb.creator = "System";
   wb.created = new Date();
   const ws = wb.addWorksheet("Dealer Summary");

   // ── Column widths ──────────────────────────────────────────────────────
   ws.columns = COLUMNS.map(c => ({ key: c.key, width: c.width }));

   // ── Title row ──────────────────────────────────────────────────────────
   ws.mergeCells(`A1:${LAST_COL_LETTER}1`);
   const t = ws.getCell("A1");
   t.value     = title || "Dealer Summary";
   t.font      = { name: "Arial", bold: true, size: 14, color: { argb: COLORS.slate900 } };
   t.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(1).height = 28;

   // ── Meta row ──────────────────────────────────────────────────────────
   ws.mergeCells(`A2:${LAST_COL_LETTER}2`);
   const m = ws.getCell("A2");
   m.value     = search
      ? `Generated: ${today()}   •   Filtered by: "${search}"`
      : `Generated: ${today()}`;
   m.font      = { name: "Arial", size: 10, italic: true, color: { argb: COLORS.slate400 } };
   m.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(2).height = 18;

   // ── Summary strip ──────────────────────────────────────────────────────
   const totals = records.reduce((acc, r) => ({
      files:     acc.files + int0(r["No. of File"]),
      miSubmit:  acc.miSubmit + int0(r["MI Submit"]),
      cancel:    acc.cancel + int0(r["Cancel/Adjusted"]),
      pending:   acc.pending + int0(r["Online Pending"]),
      acre:      acc.acre + (Number(r["Total Acre"]) || 0),
   }), { files: 0, miSubmit: 0, cancel: 0, pending: 0, acre: 0 });

   const summaryItems = [
      { label: "Dealers",         value: `${records.length}`,                   bg: COLORS.slate100,   text: COLORS.slate700,   cols: [1, 2]   },
      { label: "Total Files",     value: `${totals.files}`,                     bg: COLORS.slate100,   text: COLORS.slate700,   cols: [3, 4]   },
      { label: "MI Submit",       value: `${totals.miSubmit}`,                  bg: COLORS.fuchsia100, text: COLORS.fuchsia700, cols: [5, 6]   },
      { label: "Cancel/Adjusted", value: `${totals.cancel}`,                    bg: COLORS.rose100,    text: COLORS.rose700,    cols: [7, 8]   },
      { label: "Online Pending",  value: `${totals.pending}`,                   bg: COLORS.amber100,   text: COLORS.amber700,   cols: [9, 10]  },
      { label: "Total Acre",      value: `${Number(totals.acre.toFixed(2))}`,   bg: COLORS.slate100,   text: COLORS.slate700,   cols: [11, 12] },
   ];

   for (const item of summaryItems) {
      const valCell = ws.getCell(3, item.cols[0]);
      valCell.value     = item.value;
      valCell.font      = { name: "Arial", bold: true, size: 9, color: { argb: item.text } };
      valCell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: item.bg } };
      valCell.alignment = { horizontal: "center", vertical: "center" };
      valCell.border    = thinBorder();

      const lblCell = ws.getCell(3, item.cols[1]);
      lblCell.value     = item.label;
      lblCell.font      = { name: "Arial", size: 7, color: { argb: COLORS.slate400 } };
      lblCell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: item.bg } };
      lblCell.alignment = { horizontal: "center", vertical: "center" };
      lblCell.border    = thinBorder();
   }
   ws.getRow(3).height = 22;

   // ── Group header band ("Irrigation Type (Acre)") ───────────────────────
   ws.mergeCells(4, 1, 4, 4);
   ws.mergeCells(4, IRRIGATION_START_COL, 4, IRRIGATION_END_COL);
   ws.mergeCells(4, 8, 4, 12);

   for (let col = 1; col <= 12; col++) {
      const cell = ws.getCell(4, col);
      cell.fill   = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.amberBand } };
      cell.border = { bottom: { style: "thin", color: { argb: COLORS.amber700 } } };
   }
   const bandCell = ws.getCell(4, IRRIGATION_START_COL);
   bandCell.value     = "Irrigation Type (Acre)";
   bandCell.font      = { name: "Arial", bold: true, size: 9, color: { argb: COLORS.slate900 } };
   bandCell.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(4).height = 18;

   // ── Column headers ──────────────────────────────────────────────────────
   const hr = ws.addRow(COLUMNS.map(c => c.header));
   hr.eachCell((cell, col) => {
      const colDef = COLUMNS[col - 1];
      cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: COLORS.slate700 } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.amberBand2 } };
      cell.alignment = { horizontal: colDef.align, vertical: "middle", wrapText: true };
      cell.border    = thinBorder(COLORS.slate300);
   });
   ws.getRow(5).height = 22;

   // ── Data rows ──────────────────────────────────────────────────────────
   records.forEach((rec, i) => {
      const rowBg = i % 2 === 0 ? COLORS.white : COLORS.slate50;

      const row = ws.addRow(COLUMNS.map(c => {
         const val = rec[c.key];
         if (c.key === "Dealer Code") return val || "—";
         if (c.key === "%") return safe(val);
         if (c.numeric && c.irrigation) return num2(val);   // decimal for irrigation
         if (c.numeric)                 return intVal(val); // whole number for rest
         return safe(val);
      }));

      row.eachCell((cell, col) => {
         const colDef      = COLUMNS[col - 1];
         const isDealerCode = colDef.key === "Dealer Code";
         const isMiSubmit   = colDef.key === "MI Submit";
         const isCancel     = colDef.key === "Cancel/Adjusted";
         const isPending    = colDef.key === "Online Pending";
         const isTotalAcre  = colDef.key === "Total Acre";

         cell.alignment = { horizontal: colDef.align, vertical: "middle" };
         cell.border    = thinBorder();

         if (isDealerCode) {
            cell.font = { name: "Arial", size: 9, color: { argb: COLORS.rose700 } };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.rose100 } };
         } else if (isMiSubmit) {
            cell.font = { name: "Arial", bold: true, size: 9, color: { argb: COLORS.fuchsia700 } };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowBg } };
         } else if (isCancel) {
            cell.font = { name: "Arial", size: 9, color: { argb: COLORS.rose700 } };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowBg } };
         } else if (isPending) {
            cell.font = { name: "Arial", size: 9, color: { argb: COLORS.amber700 } };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowBg } };
         } else if (isTotalAcre) {
            cell.font = { name: "Arial", bold: true, size: 9, color: { argb: COLORS.slate700 } };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowBg } };
         } else {
            cell.font = { name: "Arial", size: 9, color: { argb: COLORS.slate700 } };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowBg } };
         }

         // Number format: decimal only for irrigation, whole number for all other numeric
         if (colDef.numeric && colDef.key !== "%" && typeof cell.value === "number") {
            cell.numFmt = colDef.irrigation ? "0.00" : "0";
         }
      });

      row.height = 20;
   });

   // ── Grand totals row ──────────────────────────────────────────────────
   const miniTotal        = records.reduce((s, r) => s + (Number(r["Mini Sprinkler"])     || 0), 0);
   const dripTotal        = records.reduce((s, r) => s + (Number(r["Drip Irrigation"])    || 0), 0);
   const portableTotal    = records.reduce((s, r) => s + (Number(r["Portable Sprinkler"]) || 0), 0);

   const totalRow = ws.addRow([
      "Total", "", "",
      totals.files,                                                        // No. of File   → whole
      num2(miniTotal),                                                     // Mini Sprinkler → decimal
      num2(dripTotal),                                                     // Drip Irrigation → decimal
      num2(portableTotal),                                                 // Portable Sprinkler → decimal
      totals.miSubmit,                                                     // MI Submit → whole
      totals.files > 0 ? `${Math.round((totals.miSubmit / totals.files) * 100)}%` : "0%",
      totals.cancel,                                                       // Cancel/Adjusted → whole
      totals.pending,                                                      // Online Pending → whole
      num2(totals.acre),                                                   // Total Acre → decimal
   ]);

   ws.mergeCells(totalRow.number, 1, totalRow.number, 2);

   totalRow.eachCell((cell, col) => {
      const colDef = COLUMNS[col - 1];
      cell.font      = { name: "Arial", bold: true, size: 9.5, color: { argb: COLORS.white } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.slate900 } };
      cell.alignment = { horizontal: col === 1 ? "left" : colDef?.align, vertical: "middle" };
      cell.border    = { top: { style: "medium", color: { argb: COLORS.slate900 } } };

      if (colDef?.numeric && colDef.key !== "%" && typeof cell.value === "number") {
         cell.numFmt = colDef.irrigation ? "0.00" : "0";
      }
   });
   totalRow.height = 22;

   // ── Freeze panes ──────────────────────────────────────────────────────
   ws.views = [{ state: "frozen", xSplit: 3, ySplit: 5 }];

   // ── Page setup ────────────────────────────────────────────────────────
   ws.pageSetup = {
      orientation: "landscape",
      paperSize: 9,
      fitToWidth: 1,
      fitToHeight: 0,
   };

   return wb.xlsx.writeBuffer();
}