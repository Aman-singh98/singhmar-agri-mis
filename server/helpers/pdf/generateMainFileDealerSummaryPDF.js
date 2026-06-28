// import PDFDocument from "pdfkit";

// const PAGE_W   = 841.89;  // A4 Landscape
// const PAGE_H   = 595.28;
// const MARGIN   = 20;
// const CW       = PAGE_W - 2 * MARGIN;
// const FOOTER_H = 18;
// const ROW_H    = 20;
// const HEAD_H   = 14;
// const GROUP_HEAD_H = 12;
// const HEADER_H = 55;

// /* ── Colors (exact match with React table) ─────────────────────────────── */
// const COLORS = {
//    slate900:  '#0f172a',
//    slate700:  '#334155',
//    slate500:  '#64748b',
//    slate400:  '#94a3b8',
//    slate300:  '#cbd5e1',
//    slate200:  '#e2e8f0',
//    slate100:  '#f1f5f9',
//    slate50:   '#f8fafc',
//    white:     '#ffffff',
//    fuchsia700:'#a21caf',
//    fuchsia100:'#fae8ff',
//    rose700:   '#be123c',
//    rose100:   '#ffe4e6',
//    amber700:  '#b45309',
//    amber100:  '#fef3c7',
//    amberBand: '#fde68a',
//    amberBand2:'#fffbeb',
// };

// /* ── Columns ─────────────────────────────────────────────────────────── */
// // irrigation: true  → decimal (0.00)
// // decimal: true     → decimal (0.00)  [used for Total Acre]
// // numeric: true     → whole number by default
// const BASE_COLS = [
//    { key: "Sr No",              label: "Sr.",                w: 26,  align: "center" },
//    { key: "Dealer Name",        label: "Dealer Name",        w: 130, align: "left"   },
//    { key: "Dealer Code",        label: "Dealer Code",        w: 70,  align: "left"   },
//    { key: "No. of File",        label: "No. of File",        w: 60,  align: "right", numeric: true },
//    { key: "Mini Sprinkler",     label: "Mini Sprinkler",     w: 68,  align: "right", numeric: true, group: "irrigation", irrigation: true },
//    { key: "Drip Irrigation",    label: "Drip Irrigation",    w: 68,  align: "right", numeric: true, group: "irrigation", irrigation: true },
//    { key: "Portable Sprinkler", label: "Portable Sprinkler", w: 70,  align: "right", numeric: true, group: "irrigation", irrigation: true },
//    { key: "MI Submit",          label: "MI Submit",          w: 58,  align: "right", numeric: true },
//    { key: "%",                  label: "%",                  w: 42,  align: "center" },
//    { key: "Cancel/Adjusted",    label: "Cancel/Adj.",        w: 62,  align: "right", numeric: true },
//    { key: "Online Pending",     label: "Online Pend.",       w: 62,  align: "right", numeric: true },
//    { key: "Total Acre",         label: "Total Acre",         w: 64,  align: "right", numeric: true, decimal: true },
// ];

// function buildCols() {
//    const cols = [...BASE_COLS];
//    const used = cols.reduce((s, c) => s + c.w, 0);
//    const leftover = CW - used;
//    if (leftover > 0) {
//       cols[1] = { ...cols[1], w: cols[1].w + leftover };
//    }
//    return cols;
// }

// function computeColX(cols) {
//    const xs = [];
//    let x = MARGIN;
//    for (const c of cols) { xs.push(x); x += c.w; }
//    return xs;
// }

// function safe(v) { return v != null && v !== "" ? String(v) : "—"; }

// // Decimal display — for irrigation cols & Total Acre
// function num2(v) {
//    if (v == null || v === "" || v === "—") return "—";
//    const n = Number(v);
//    return isNaN(n) ? safe(v) : n.toFixed(2);
// }

// // Whole number display — for all other numeric cols
// function intVal(v) {
//    if (v == null || v === "" || v === "—") return "—";
//    const n = Number(v);
//    return isNaN(n) ? safe(v) : String(Math.round(n));
// }

// function int0(v) { return v != null && !isNaN(Number(v)) ? Number(v) : 0; }
// function today() { return new Date().toLocaleDateString("en-IN"); }
// function fileDate() { return new Date().toISOString().split("T")[0]; }

// function truncate(doc, text, font, size, maxW) {
//    doc.font(font).fontSize(size);
//    if (doc.widthOfString(text) <= maxW) return text;
//    let t = text;
//    while (t.length > 0 && doc.widthOfString(t + "…") > maxW) t = t.slice(0, -1);
//    return t + "…";
// }

// /* ── Header ──────────────────────────────────────────────────────────── */
// function drawHeader(doc, title) {
//    doc.moveTo(MARGIN, HEADER_H - 4).lineTo(MARGIN + CW, HEADER_H - 4)
//       .strokeColor("#000000").lineWidth(0.8).stroke();

//    doc.font("Helvetica-Bold").fontSize(14).fillColor(COLORS.slate900)
//       .text(title || "Dealer Summary", MARGIN, 10, { lineBreak: false });

//    doc.font("Helvetica").fontSize(7).fillColor(COLORS.slate400)
//       .text(`Generated: ${today()}`, 0, 14,
//          { align: "right", width: PAGE_W - MARGIN, lineBreak: false });
// }

// /* ── Footer ──────────────────────────────────────────────────────────── */
// function drawFooter(doc, pageNum, totalPages) {
//    const fy = PAGE_H - FOOTER_H;
//    doc.moveTo(MARGIN, fy).lineTo(MARGIN + CW, fy)
//       .strokeColor("#000000").lineWidth(0.4).stroke();
//    doc.font("Helvetica").fontSize(7).fillColor(COLORS.slate500)
//       .text(`Page ${pageNum} of ${totalPages}`, MARGIN, fy + 4,
//          { width: CW, align: "center", lineBreak: false });
// }

// /* ── Summary strip ───────────────────────────────────────────────────── */
// function drawSummaryStrip(doc, summary) {
//    const stripY = HEADER_H + 2;
//    const stripH = 18;
//    const items = [
//       { label: "Dealers",        value: `${summary.dealers}`,         bg: COLORS.slate100,   text: COLORS.slate700   },
//       { label: "Total Files",    value: `${summary.files}`,           bg: COLORS.slate100,   text: COLORS.slate700   },
//       { label: "MI Submit",      value: `${summary.miSubmit}`,        bg: COLORS.fuchsia100, text: COLORS.fuchsia700 },
//       { label: "Cancel/Adj.",    value: `${summary.cancel}`,          bg: COLORS.rose100,    text: COLORS.rose700    },
//       { label: "Online Pending", value: `${summary.pending}`,         bg: COLORS.amber100,   text: COLORS.amber700   },
//       { label: "Total Acre",     value: `${summary.acre.toFixed(2)}`, bg: COLORS.slate100,   text: COLORS.slate700   },
//    ];

//    const itemW = CW / items.length;
//    let x = MARGIN;

//    for (const item of items) {
//       doc.save().rect(x, stripY, itemW, stripH).fillColor(item.bg).fill().restore();
//       doc.rect(x, stripY, itemW, stripH).strokeColor(COLORS.slate200).lineWidth(0.3).stroke();
//       doc.font("Helvetica-Bold").fontSize(7).fillColor(item.text)
//          .text(item.value, x, stripY + 2, { width: itemW, align: "center", lineBreak: false });
//       doc.font("Helvetica").fontSize(5.5).fillColor(COLORS.slate400)
//          .text(item.label, x, stripY + 10, { width: itemW, align: "center", lineBreak: false });
//       x += itemW;
//    }

//    return stripY + stripH + 4;
// }

// /* ── Group header band ("Irrigation Type (Acre)") ────────────────────── */
// function drawGroupHeader(doc, cols, colX, y) {
//    doc.save().rect(MARGIN, y, CW, GROUP_HEAD_H).fillColor(COLORS.amberBand).fill().restore();
//    doc.rect(MARGIN, y, CW, GROUP_HEAD_H).strokeColor(COLORS.amber700).lineWidth(0.4).stroke();

//    const groupStart = cols.findIndex(c => c.group === "irrigation");
//    const groupEnd   = cols.map(c => c.group === "irrigation").lastIndexOf(true);
//    const groupX = colX[groupStart];
//    const groupW = (colX[groupEnd] + cols[groupEnd].w) - groupX;

//    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(COLORS.slate900)
//       .text("Irrigation Type (Acre)", groupX, y + 2.5,
//          { width: groupW, align: "center", lineBreak: false });

//    return y + GROUP_HEAD_H;
// }

// /* ── Column headers ──────────────────────────────────────────────────── */
// function drawColumnHeaders(doc, cols, colX, y) {
//    doc.save().rect(MARGIN, y, CW, HEAD_H).fillColor(COLORS.amberBand2).fill().restore();
//    doc.rect(MARGIN, y, CW, HEAD_H).strokeColor(COLORS.slate300).lineWidth(0.5).stroke();

//    for (let ci = 0; ci < cols.length; ci++) {
//       const col = cols[ci];
//       doc.font("Helvetica-Bold").fontSize(6.5).fillColor(COLORS.slate700)
//          .text(col.label, colX[ci] + 3, y + (HEAD_H - 6.5) / 2,
//             { width: col.w - 6, align: col.align, lineBreak: false });

//       if (ci > 0) {
//          doc.moveTo(colX[ci], y).lineTo(colX[ci], y + HEAD_H)
//             .strokeColor(COLORS.slate300).lineWidth(0.3).stroke();
//       }
//    }
// }

// /* ── Data row ──────────────────────────────────────────────────────────── */
// function drawRow(doc, cols, colX, y, rowIdx, record) {
//    const rowBg = rowIdx % 2 === 0 ? COLORS.white : COLORS.slate50;

//    doc.save().rect(MARGIN, y, CW, ROW_H).fillColor(rowBg).fill().restore();

//    for (let ci = 1; ci < cols.length; ci++) {
//       doc.moveTo(colX[ci], y).lineTo(colX[ci], y + ROW_H)
//          .strokeColor(COLORS.slate200).lineWidth(0.3).stroke();
//    }

//    for (let ci = 0; ci < cols.length; ci++) {
//       const col = cols[ci];
//       const x   = colX[ci];
//       const raw = record[col.key];

//       // Dealer Code — rose highlighted
//       if (col.key === "Dealer Code") {
//          const codeW = col.w - 6;
//          doc.save().rect(x, y, col.w, ROW_H).fillColor(COLORS.rose100).fill().restore();
//          doc.font("Helvetica").fontSize(7).fillColor(COLORS.rose700)
//             .text(safe(raw), x + 3, y + (ROW_H - 7) / 2, { width: codeW, align: col.align, lineBreak: false });
//          continue;
//       }

//       let text  = safe(raw);
//       let color = COLORS.slate700;
//       let bold  = false;

//       if (col.numeric && col.key !== "%") {
//          // Decimal: irrigation columns + Total Acre
//          // Whole number: everything else
//          text = (col.irrigation || col.decimal) ? num2(raw) : intVal(raw);
//       }

//       if (col.key === "MI Submit")       { color = COLORS.fuchsia700; bold = true; }
//       if (col.key === "Cancel/Adjusted") { color = COLORS.rose700; }
//       if (col.key === "Online Pending")  { color = COLORS.amber700; }
//       if (col.key === "Total Acre")      { bold = true; }
//       if (col.key === "Dealer Name") {
//          text = truncate(doc, text, "Helvetica-Bold", 7, col.w - 6);
//          bold = true;
//       }

//       doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(7).fillColor(color)
//          .text(text, x + 3, y + (ROW_H - 7) / 2, { width: col.w - 6, align: col.align, lineBreak: false });
//    }

//    doc.moveTo(MARGIN, y + ROW_H).lineTo(MARGIN + CW, y + ROW_H)
//       .strokeColor(COLORS.slate200).lineWidth(0.3).stroke();
// }

// /* ── Grand totals row ─────────────────────────────────────────────────── */
// function drawTotalsRow(doc, cols, colX, y, totals) {
//    doc.save().rect(MARGIN, y, CW, ROW_H).fillColor(COLORS.slate900).fill().restore();

//    const values = {
//       "Sr No":              "",
//       "Dealer Name":        "Total",
//       "Dealer Code":        "",
//       "No. of File":        String(totals.files),                    // whole number
//       "Mini Sprinkler":     totals.mini.toFixed(2),                  // decimal
//       "Drip Irrigation":    totals.drip.toFixed(2),                  // decimal
//       "Portable Sprinkler": totals.portable.toFixed(2),              // decimal
//       "MI Submit":          String(totals.miSubmit),                 // whole number
//       "%":                  totals.files > 0
//                               ? `${Math.round((totals.miSubmit / totals.files) * 100)}%`
//                               : "0%",
//       "Cancel/Adjusted":    String(totals.cancel),                   // whole number
//       "Online Pending":     String(totals.pending),                  // whole number
//       "Total Acre":         totals.acre.toFixed(2),                  // decimal
//    };

//    for (let ci = 0; ci < cols.length; ci++) {
//       const col  = cols[ci];
//       const x    = colX[ci];
//       const text = String(values[col.key] ?? "");
//       doc.font("Helvetica-Bold").fontSize(7.5).fillColor(COLORS.white)
//          .text(text, x + 3, y + (ROW_H - 7.5) / 2,
//             { width: col.w - 6, align: col.key === "Dealer Name" ? "left" : col.align, lineBreak: false });
//    }
// }

// /* ── Main export ─────────────────────────────────────────────────────── */
// export async function generateMainFileDealerSummaryPDF(data, res) {
//    try {
//       const { title, records } = data;

//       if (!Array.isArray(records) || records.length === 0) {
//          return res.status(400).json({ message: "No records to export", success: false });
//       }

//       const doc = new PDFDocument({
//          size: "A4", layout: "landscape", margin: 0, autoFirstPage: false,
//       });

//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader("Content-Disposition",
//          `attachment; filename="${(title || "Dealer_Summary").replace(/\s+/g, "_")}-${fileDate()}.pdf"`);
//       doc.pipe(res);

//       const cols = buildCols();
//       const colX = computeColX(cols);

//       const summary = {
//          dealers:  records.length,
//          files:    records.reduce((s, r) => s + int0(r["No. of File"]), 0),
//          miSubmit: records.reduce((s, r) => s + int0(r["MI Submit"]), 0),
//          cancel:   records.reduce((s, r) => s + int0(r["Cancel/Adjusted"]), 0),
//          pending:  records.reduce((s, r) => s + int0(r["Online Pending"]), 0),
//          acre:     records.reduce((s, r) => s + (Number(r["Total Acre"]) || 0), 0),
//       };
//       const totals = {
//          files:    summary.files,
//          miSubmit: summary.miSubmit,
//          cancel:   summary.cancel,
//          pending:  summary.pending,
//          acre:     summary.acre,
//          mini:     records.reduce((s, r) => s + (Number(r["Mini Sprinkler"])     || 0), 0),
//          drip:     records.reduce((s, r) => s + (Number(r["Drip Irrigation"])    || 0), 0),
//          portable: records.reduce((s, r) => s + (Number(r["Portable Sprinkler"]) || 0), 0),
//       };

//       const usableH  = PAGE_H - HEADER_H - FOOTER_H - 40;
//       const estPages = Math.ceil((records.length * ROW_H) / usableH) || 1;

//       let pageNum = 1;
//       let y = 0;

//       function startPage() {
//          doc.addPage({ size: "A4", layout: "landscape", margin: 0 });
//          drawHeader(doc, title);
//          y = drawSummaryStrip(doc, summary);
//          y = drawGroupHeader(doc, cols, colX, y);
//          drawColumnHeaders(doc, cols, colX, y);
//          y += HEAD_H;
//       }

//       startPage();

//       for (let rowIdx = 0; rowIdx < records.length; rowIdx++) {
//          if (y + ROW_H > PAGE_H - FOOTER_H - 10) {
//             drawFooter(doc, pageNum, estPages);
//             pageNum++;
//             startPage();
//          }
//          drawRow(doc, cols, colX, y, rowIdx, records[rowIdx]);
//          y += ROW_H;
//       }

//       // Totals row — push to new page if needed
//       if (y + ROW_H > PAGE_H - FOOTER_H - 10) {
//          drawFooter(doc, pageNum, estPages);
//          pageNum++;
//          startPage();
//       }
//       drawTotalsRow(doc, cols, colX, y, totals);

//       drawFooter(doc, pageNum, estPages);
//       doc.end();

//    } catch (err) {
//       console.error("Dealer Summary PDF error:", err);
//       if (!res.headersSent) {
//          res.status(500).json({ message: "Failed to generate Dealer Summary PDF", success: false });
//       }
//    }
// }












import PDFDocument from "pdfkit";

const PAGE_W   = 595.28;  // A4 Portrait
const PAGE_H   = 841.89;
const MARGIN   = 14;
const CW       = PAGE_W - 2 * MARGIN;
const FOOTER_H = 16;
const ROW_H    = 16;
const HEAD_H   = 13;
const GROUP_HEAD_H = 11;
const HEADER_H = 48;

/* ── Colors ─────────────────────────────────────────────────────────── */
const COLORS = {
   slate900:  '#0f172a',
   slate700:  '#334155',
   slate500:  '#64748b',
   slate400:  '#94a3b8',
   slate300:  '#cbd5e1',
   slate200:  '#e2e8f0',
   slate100:  '#f1f5f9',
   slate50:   '#f8fafc',
   white:     '#ffffff',
   fuchsia700:'#a21caf',
   fuchsia100:'#fae8ff',
   rose700:   '#be123c',
   rose100:   '#ffe4e6',
   amber700:  '#b45309',
   amber100:  '#fef3c7',
   amberBand: '#fde68a',
   amberBand2:'#fffbeb',
};

/* ── Columns — widths tuned for A4 Portrait (CW ≈ 567) ─────────────── */
const BASE_COLS = [
   { key: "Sr No",              label: "Sr.",          w: 20,  align: "center" },
   { key: "Dealer Name",        label: "Dealer Name",  w: 105, align: "left"   },
   { key: "Dealer Code",        label: "Code",         w: 38,  align: "left"   },
   { key: "No. of File",        label: "Files",        w: 30,  align: "right",  numeric: true },
   { key: "Mini Sprinkler",     label: "Mini Spr.",    w: 46,  align: "right",  numeric: true, group: "irrigation", irrigation: true },
   { key: "Drip Irrigation",    label: "Drip Irr.",    w: 46,  align: "right",  numeric: true, group: "irrigation", irrigation: true },
   { key: "Portable Sprinkler", label: "Portable",     w: 44,  align: "right",  numeric: true, group: "irrigation", irrigation: true },
   { key: "MI Submit",          label: "MI Sub.",      w: 36,  align: "right",  numeric: true },
   { key: "%",                  label: "%",            w: 26,  align: "center" },
   { key: "Cancel/Adjusted",    label: "Cancel",       w: 36,  align: "right",  numeric: true },
   { key: "Online Pending",     label: "Pending",      w: 36,  align: "right",  numeric: true },
   { key: "Total Acre",         label: "Total Acre",   w: 44,  align: "right",  numeric: true, decimal: true },
];

function buildCols() {
   const cols = [...BASE_COLS];
   const used = cols.reduce((s, c) => s + c.w, 0);
   const leftover = CW - used;
   if (leftover > 0) {
      cols[1] = { ...cols[1], w: cols[1].w + leftover };
   }
   return cols;
}

function computeColX(cols) {
   const xs = [];
   let x = MARGIN;
   for (const c of cols) { xs.push(x); x += c.w; }
   return xs;
}

function safe(v) { return v != null && v !== "" ? String(v) : "—"; }

function num2(v) {
   if (v == null || v === "" || v === "—") return "—";
   const n = Number(v);
   return isNaN(n) ? safe(v) : n.toFixed(2);
}

function intVal(v) {
   if (v == null || v === "" || v === "—") return "—";
   const n = Number(v);
   return isNaN(n) ? safe(v) : String(Math.round(n));
}

function int0(v) { return v != null && !isNaN(Number(v)) ? Number(v) : 0; }
function today() { return new Date().toLocaleDateString("en-IN"); }
function fileDate() { return new Date().toISOString().split("T")[0]; }

function truncate(doc, text, font, size, maxW) {
   doc.font(font).fontSize(size);
   if (doc.widthOfString(text) <= maxW) return text;
   let t = text;
   while (t.length > 0 && doc.widthOfString(t + "…") > maxW) t = t.slice(0, -1);
   return t + "…";
}

/* ── Header ──────────────────────────────────────────────────────────── */
function drawHeader(doc, title) {
   doc.moveTo(MARGIN, HEADER_H - 4).lineTo(MARGIN + CW, HEADER_H - 4)
      .strokeColor("#000000").lineWidth(0.7).stroke();

   doc.font("Helvetica-Bold").fontSize(13).fillColor(COLORS.slate900)
      .text(title || "Dealer Summary", MARGIN, 9, { lineBreak: false });

   doc.font("Helvetica").fontSize(6.5).fillColor(COLORS.slate400)
      .text(`Generated: ${today()}`, 0, 12,
         { align: "right", width: PAGE_W - MARGIN, lineBreak: false });
}

/* ── Footer ──────────────────────────────────────────────────────────── */
function drawFooter(doc, pageNum, totalPages) {
   const fy = PAGE_H - FOOTER_H;
   doc.moveTo(MARGIN, fy).lineTo(MARGIN + CW, fy)
      .strokeColor("#000000").lineWidth(0.4).stroke();
   doc.font("Helvetica").fontSize(6.5).fillColor(COLORS.slate500)
      .text(`Page ${pageNum} of ${totalPages}`, MARGIN, fy + 4,
         { width: CW, align: "center", lineBreak: false });
}

/* ── Summary strip ───────────────────────────────────────────────────── */
function drawSummaryStrip(doc, summary) {
   const stripY = HEADER_H + 2;
   const stripH = 16;
   const items = [
      { label: "Dealers",        value: `${summary.dealers}`,         bg: COLORS.slate100,   text: COLORS.slate700   },
      { label: "Total Files",    value: `${summary.files}`,           bg: COLORS.slate100,   text: COLORS.slate700   },
      { label: "MI Submit",      value: `${summary.miSubmit}`,        bg: COLORS.fuchsia100, text: COLORS.fuchsia700 },
      { label: "Cancel/Adj.",    value: `${summary.cancel}`,          bg: COLORS.rose100,    text: COLORS.rose700    },
      { label: "Online Pending", value: `${summary.pending}`,         bg: COLORS.amber100,   text: COLORS.amber700   },
      { label: "Total Acre",     value: `${summary.acre.toFixed(2)}`, bg: COLORS.slate100,   text: COLORS.slate700   },
   ];

   const itemW = CW / items.length;
   let x = MARGIN;

   for (const item of items) {
      doc.save().rect(x, stripY, itemW, stripH).fillColor(item.bg).fill().restore();
      doc.rect(x, stripY, itemW, stripH).strokeColor(COLORS.slate200).lineWidth(0.3).stroke();
      doc.font("Helvetica-Bold").fontSize(6.5).fillColor(item.text)
         .text(item.value, x, stripY + 2, { width: itemW, align: "center", lineBreak: false });
      doc.font("Helvetica").fontSize(5).fillColor(COLORS.slate400)
         .text(item.label, x, stripY + 9, { width: itemW, align: "center", lineBreak: false });
      x += itemW;
   }

   return stripY + stripH + 3;
}

/* ── Group header band ───────────────────────────────────────────────── */
function drawGroupHeader(doc, cols, colX, y) {
   doc.save().rect(MARGIN, y, CW, GROUP_HEAD_H).fillColor(COLORS.amberBand).fill().restore();
   doc.rect(MARGIN, y, CW, GROUP_HEAD_H).strokeColor(COLORS.amber700).lineWidth(0.4).stroke();

   const groupStart = cols.findIndex(c => c.group === "irrigation");
   const groupEnd   = cols.map(c => c.group === "irrigation").lastIndexOf(true);
   const groupX = colX[groupStart];
   const groupW = (colX[groupEnd] + cols[groupEnd].w) - groupX;

   doc.font("Helvetica-Bold").fontSize(7).fillColor(COLORS.slate900)
      .text("Irrigation Type (Acre)", groupX, y + 2,
         { width: groupW, align: "center", lineBreak: false });

   return y + GROUP_HEAD_H;
}

/* ── Column headers ──────────────────────────────────────────────────── */
function drawColumnHeaders(doc, cols, colX, y) {
   doc.save().rect(MARGIN, y, CW, HEAD_H).fillColor(COLORS.amberBand2).fill().restore();
   doc.rect(MARGIN, y, CW, HEAD_H).strokeColor(COLORS.slate300).lineWidth(0.5).stroke();

   for (let ci = 0; ci < cols.length; ci++) {
      const col = cols[ci];
      doc.font("Helvetica-Bold").fontSize(6).fillColor(COLORS.slate700)
         .text(col.label, colX[ci] + 2, y + (HEAD_H - 6) / 2,
            { width: col.w - 4, align: col.align, lineBreak: false });

      if (ci > 0) {
         doc.moveTo(colX[ci], y).lineTo(colX[ci], y + HEAD_H)
            .strokeColor(COLORS.slate300).lineWidth(0.3).stroke();
      }
   }
}

/* ── Data row ────────────────────────────────────────────────────────── */
function drawRow(doc, cols, colX, y, rowIdx, record) {
   const rowBg = rowIdx % 2 === 0 ? COLORS.white : COLORS.slate50;

   doc.save().rect(MARGIN, y, CW, ROW_H).fillColor(rowBg).fill().restore();

   for (let ci = 1; ci < cols.length; ci++) {
      doc.moveTo(colX[ci], y).lineTo(colX[ci], y + ROW_H)
         .strokeColor(COLORS.slate200).lineWidth(0.3).stroke();
   }

   for (let ci = 0; ci < cols.length; ci++) {
      const col = cols[ci];
      const x   = colX[ci];
      const raw = record[col.key];

      if (col.key === "Dealer Code") {
         doc.save().rect(x, y, col.w, ROW_H).fillColor(COLORS.rose100).fill().restore();
         doc.font("Helvetica").fontSize(6).fillColor(COLORS.rose700)
            .text(safe(raw), x + 2, y + (ROW_H - 6) / 2,
               { width: col.w - 4, align: col.align, lineBreak: false });
         continue;
      }

      let text  = safe(raw);
      let color = COLORS.slate700;
      let bold  = false;

      if (col.numeric && col.key !== "%") {
         text = (col.irrigation || col.decimal) ? num2(raw) : intVal(raw);
      }

      if (col.key === "MI Submit")       { color = COLORS.fuchsia700; bold = true; }
      if (col.key === "Cancel/Adjusted") { color = COLORS.rose700; }
      if (col.key === "Online Pending")  { color = COLORS.amber700; }
      if (col.key === "Total Acre")      { bold = true; }
      if (col.key === "Dealer Name") {
         text = truncate(doc, text, "Helvetica-Bold", 6, col.w - 4);
         bold = true;
      }

      doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(6).fillColor(color)
         .text(text, x + 2, y + (ROW_H - 6) / 2,
            { width: col.w - 4, align: col.align, lineBreak: false });
   }

   doc.moveTo(MARGIN, y + ROW_H).lineTo(MARGIN + CW, y + ROW_H)
      .strokeColor(COLORS.slate200).lineWidth(0.3).stroke();
}

/* ── Grand totals row ────────────────────────────────────────────────── */
function drawTotalsRow(doc, cols, colX, y, totals) {
   doc.save().rect(MARGIN, y, CW, ROW_H).fillColor(COLORS.slate900).fill().restore();

   const values = {
      "Sr No":              "",
      "Dealer Name":        "Total",
      "Dealer Code":        "",
      "No. of File":        String(totals.files),
      "Mini Sprinkler":     totals.mini.toFixed(2),
      "Drip Irrigation":    totals.drip.toFixed(2),
      "Portable Sprinkler": totals.portable.toFixed(2),
      "MI Submit":          String(totals.miSubmit),
      "%":                  totals.files > 0
                              ? `${Math.round((totals.miSubmit / totals.files) * 100)}%`
                              : "0%",
      "Cancel/Adjusted":    String(totals.cancel),
      "Online Pending":     String(totals.pending),
      "Total Acre":         totals.acre.toFixed(2),
   };

   for (let ci = 0; ci < cols.length; ci++) {
      const col  = cols[ci];
      const x    = colX[ci];
      const text = String(values[col.key] ?? "");
      doc.font("Helvetica-Bold").fontSize(7).fillColor(COLORS.white)
         .text(text, x + 2, y + (ROW_H - 7) / 2,
            { width: col.w - 4, align: col.key === "Dealer Name" ? "left" : col.align, lineBreak: false });
   }
}

/* ── Main export ─────────────────────────────────────────────────────── */
export async function generateMainFileDealerSummaryPDF(data, res) {
   try {
      const { title, records } = data;

      if (!Array.isArray(records) || records.length === 0) {
         return res.status(400).json({ message: "No records to export", success: false });
      }

      const doc = new PDFDocument({
         size: "A4", layout: "portrait", margin: 0, autoFirstPage: false,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition",
         `attachment; filename="${(title || "Dealer_Summary").replace(/\s+/g, "_")}-${fileDate()}.pdf"`);
      doc.pipe(res);

      const cols = buildCols();
      const colX = computeColX(cols);

      const summary = {
         dealers:  records.length,
         files:    records.reduce((s, r) => s + int0(r["No. of File"]), 0),
         miSubmit: records.reduce((s, r) => s + int0(r["MI Submit"]), 0),
         cancel:   records.reduce((s, r) => s + int0(r["Cancel/Adjusted"]), 0),
         pending:  records.reduce((s, r) => s + int0(r["Online Pending"]), 0),
         acre:     records.reduce((s, r) => s + (Number(r["Total Acre"]) || 0), 0),
      };
      const totals = {
         files:    summary.files,
         miSubmit: summary.miSubmit,
         cancel:   summary.cancel,
         pending:  summary.pending,
         acre:     summary.acre,
         mini:     records.reduce((s, r) => s + (Number(r["Mini Sprinkler"])     || 0), 0),
         drip:     records.reduce((s, r) => s + (Number(r["Drip Irrigation"])    || 0), 0),
         portable: records.reduce((s, r) => s + (Number(r["Portable Sprinkler"]) || 0), 0),
      };

      // Calculate accurate page count
      const fixedH      = HEADER_H + 16 + 3 + GROUP_HEAD_H + HEAD_H;
      const usableH     = PAGE_H - fixedH - FOOTER_H - 10;
      const rowsPerPage = Math.floor(usableH / ROW_H);
      const totalPages  = Math.ceil((records.length + 1) / rowsPerPage) || 1;

      let pageNum = 1;
      let y = 0;

      function startPage() {
         doc.addPage({ size: "A4", layout: "portrait", margin: 0 });
         drawHeader(doc, title);
         y = drawSummaryStrip(doc, summary);
         y = drawGroupHeader(doc, cols, colX, y);
         drawColumnHeaders(doc, cols, colX, y);
         y += HEAD_H;
      }

      startPage();

      for (let rowIdx = 0; rowIdx < records.length; rowIdx++) {
         if (y + ROW_H > PAGE_H - FOOTER_H - 8) {
            drawFooter(doc, pageNum, totalPages);
            pageNum++;
            startPage();
         }
         drawRow(doc, cols, colX, y, rowIdx, records[rowIdx]);
         y += ROW_H;
      }

      // Totals row
      if (y + ROW_H > PAGE_H - FOOTER_H - 8) {
         drawFooter(doc, pageNum, totalPages);
         pageNum++;
         startPage();
      }
      drawTotalsRow(doc, cols, colX, y, totals);

      drawFooter(doc, pageNum, totalPages);
      doc.end();

   } catch (err) {
      console.error("Dealer Summary PDF error:", err);
      if (!res.headersSent) {
         res.status(500).json({ message: "Failed to generate Dealer Summary PDF", success: false });
      }
   }
}