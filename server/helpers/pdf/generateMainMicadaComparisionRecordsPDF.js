// import PDFDocument from "pdfkit";

// const PAGE_W   = 841.89;  // A4 Landscape
// const PAGE_H   = 595.28;
// const MARGIN   = 20;
// const CW       = PAGE_W - 2 * MARGIN;
// const FOOTER_H = 18;
// const ROW_H    = 22;   // Taller rows for pair display
// const HEAD_H   = 14;
// const HEADER_H = 55;

// const FONT_SIZE = 6.5;
// const STATUS_FONT_SIZE = 5.5;

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
//    green500:  '#22c55e',
//    green100:  '#dcfce7',
//    green700:  '#15803d',
//    red500:    '#ef4444',
//    red100:    '#fee2e2',
//    red700:    '#b91c1c',
//    amber500:  '#f59e0b',
//    amber100:  '#fef3c7',
//    amber700:  '#b45309',
//    blue500:   '#3b82f6',
//    blue100:   '#dbeafe',
//    blue700:   '#1d4ed8',
//    yellow50:  '#fefce8',
//    yellow200: '#fef08a',
// };

// /* ── Status meta ─────────────────────────────────────────────────────── */
// const STATUS_META = {
//    'Matched':     { bg: COLORS.green100,  text: COLORS.green700,  label: 'MATCHED' },
//    'Mismatch':    { bg: COLORS.red100,    text: COLORS.red700,    label: 'MISMATCH' },
//    'Main Only':   { bg: COLORS.amber100,  text: COLORS.amber700,  label: 'MAIN ONLY' },
//    'MICADA Only': { bg: COLORS.blue100,   text: COLORS.blue700,   label: 'MICADA ONLY' },
// };

// /* ── Columns ─────────────────────────────────────────────────────────── */
// // # | MI No./App ID | Status | Farmer Name | Irrigation Type | Area (Acre)
// const BASE_COLS = [
//    { label: "#",              w: 28,  align: "center" },
//    { label: "MI No./App ID",  w: 75,  align: "left"   },
//    { label: "Status",         w: 55,  align: "center" },
//    { label: "Farmer Name",    w: 140, align: "left",   pair: true },
//    { label: "Irrigation Type",w: 130, align: "left",   pair: true },
//    { label: "Area (Acre)",    w: 110, align: "right",  pair: true, numeric: true },
// ];

// function buildCols() {
//    const cols = BASE_COLS.map(c => ({ ...c, fontSize: FONT_SIZE }));
//    const used = cols.reduce((s, c) => s + c.w, 0);
//    // Distribute leftover
//    cols[3].w += Math.round((CW - used) / 3);
//    cols[4].w += Math.round((CW - used) / 3);
//    cols[5].w += Math.round((CW - used) / 3);
//    return cols;
// }

// function computeColX(cols) {
//    const xs = [];
//    let x = MARGIN;
//    for (const c of cols) { xs.push(x); x += c.w; }
//    return xs;
// }

// function safe(v) { return v != null && v !== "" ? String(v) : "—"; }

// function today() { return new Date().toLocaleDateString("en-IN"); }
// function fileDate() { return new Date().toISOString().split("T")[0]; }

// function truncate(doc, text, font, size, maxW) {
//    doc.font(font).fontSize(size);
//    if (doc.widthOfString(text) <= maxW) return text;
//    let t = text;
//    while (t.length > 0 && doc.widthOfString(t + "…") > maxW) t = t.slice(0, -1);
//    return t + "…";
// }

// function toNumber(val) {
//    const n = parseFloat(val);
//    return Number.isFinite(n) ? n : null;
// }

// /* ── Row background by status ──────────────────────────────────────────── */
// function getRowBg(status, index) {
//    switch (status) {
//       case 'Mismatch':    return COLORS.red100;
//       case 'Main Only':   return COLORS.amber100;
//       case 'MICADA Only': return COLORS.blue100;
//       default:            return index % 2 === 0 ? COLORS.white : COLORS.slate50;
//    }
// }

// /* ── Check if field has diff ─────────────────────────────────────────── */
// function hasDiff(record, fieldLabel) {
//    const mainKey = `${fieldLabel} (Main)`;
//    const micadaKey = `${fieldLabel} (MICADA)`;
//    const mainVal = String(record[mainKey] ?? '').trim().toLowerCase();
//    const micadaVal = String(record[micadaKey] ?? '').trim().toLowerCase();
//    return mainVal !== micadaVal;
// }

// /* ── Header ──────────────────────────────────────────────────────────── */
// function drawHeader(doc, title) {
//    doc.moveTo(MARGIN, HEADER_H - 4).lineTo(MARGIN + CW, HEADER_H - 4)
//       .strokeColor("#000000").lineWidth(0.8).stroke();

//    doc.font("Helvetica-Bold").fontSize(14).fillColor(COLORS.slate900)
//       .text(title || "MICADA Comparison", MARGIN, 10, { lineBreak: false });

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
// function drawSummaryStrip(doc, summary, netAcreDiff) {
//    const stripY = HEADER_H + 2;
//    const stripH = 18;
//    const items = [
//       { label: "Total",       value: summary.all,         bg: COLORS.slate100, text: COLORS.slate700 },
//       { label: "Matched",     value: summary.match,       bg: COLORS.green100, text: COLORS.green700 },
//       { label: "Mismatch",    value: summary.mismatch,    bg: COLORS.red100,   text: COLORS.red700 },
//       { label: "Main Only",   value: summary.main_only,   bg: COLORS.amber100, text: COLORS.amber700 },
//       { label: "MICADA Only", value: summary.micada_only, bg: COLORS.blue100,  text: COLORS.blue700 },
//    ];

//    // Reserve 110px on the right for Net Area to prevent overlap
//    const netAreaWidth = 110;
//    const summaryWidth = CW - netAreaWidth;
//    const itemW = summaryWidth / items.length;
//    let x = MARGIN;

//    for (const item of items) {
//       doc.save().rect(x, stripY, itemW, stripH).fillColor(item.bg).fill().restore();
//       doc.rect(x, stripY, itemW, stripH).strokeColor(COLORS.slate200).lineWidth(0.3).stroke();
//       doc.font("Helvetica-Bold").fontSize(7).fillColor(item.text)
//          .text(`${item.value}`, x, stripY + 2, { width: itemW, align: "center", lineBreak: false });
//       doc.font("Helvetica").fontSize(5.5).fillColor(COLORS.slate400)
//          .text(item.label, x, stripY + 10, { width: itemW, align: "center", lineBreak: false });
//       x += itemW;
//    }

//    // Net area diff — positioned on the far right, outside summary boxes
//    if (Math.abs(netAcreDiff) > 0.001) {
//       const arrow = netAcreDiff > 0 ? "+" : "-";
//       const arrowColor = netAcreDiff > 0 ? COLORS.green500 : COLORS.red500;
//       const netX = MARGIN + summaryWidth + 4;
      
//       doc.font("Helvetica-Bold").fontSize(7).fillColor(COLORS.slate500)
//          .text("Net Area", netX, stripY + 2, { lineBreak: false });
//       doc.font("Helvetica-Bold").fontSize(8).fillColor(arrowColor)
//          .text(`${arrow} ${Math.abs(netAcreDiff).toFixed(2)} acre`, netX, stripY + 10, { lineBreak: false });
//    }

//    return stripY + stripH + 4;
// }

// /* ── Column headers ────────────────────────────────────────────────────── */
// function drawColumnHeaders(doc, cols, colX, y) {
//    doc.save().rect(MARGIN, y, CW, HEAD_H).fillColor(COLORS.slate900).fill().restore();
//    doc.rect(MARGIN, y, CW, HEAD_H).strokeColor(COLORS.slate700).lineWidth(0.5).stroke();

//    for (let ci = 0; ci < cols.length; ci++) {
//       const col = cols[ci];
//       doc.font("Helvetica-Bold").fontSize(6.5).fillColor(COLORS.white)
//          .text(col.label, colX[ci] + 3, y + (HEAD_H - 6.5) / 2,
//             { width: col.w - 6, align: col.align, lineBreak: false });

//       if (ci > 0) {
//          doc.moveTo(colX[ci], y).lineTo(colX[ci], y + HEAD_H)
//             .strokeColor(COLORS.slate700).lineWidth(0.3).stroke();
//       }
//    }
// }

// /* ── Draw status badge ───────────────────────────────────────────────── */
// function drawStatusBadge(doc, status, x, y, w) {
//    const meta = STATUS_META[status] || STATUS_META['Matched'];
//    const badgeH = 10;
//    const badgeW = w - 6;
//    const badgeX = x + 3;
//    const badgeY = y + (ROW_H - badgeH) / 2;

//    doc.save().rect(badgeX, badgeY, badgeW, badgeH).fillColor(meta.bg).fill().restore();
//    doc.rect(badgeX, badgeY, badgeW, badgeH).strokeColor(meta.bg).lineWidth(0.3).stroke();
//    doc.font("Helvetica-Bold").fontSize(STATUS_FONT_SIZE).fillColor(meta.text)
//       .text(meta.label, badgeX, badgeY + 1.5,
//          { width: badgeW, align: "center", lineBreak: false });
// }

// /* ── Draw cell pair (Main + MICADA) ──────────────────────────────────── */
// function drawCellPair(doc, record, fieldLabel, x, y, w, isDiff, numeric) {
//    const mainKey = `${fieldLabel} (Main)`;
//    const micadaKey = `${fieldLabel} (MICADA)`;
//    const diffKey = `${fieldLabel} (Diff)`;

//    const mainVal = record[mainKey];
//    const micadaVal = record[micadaKey];
//    const diffVal = record[diffKey];

//    const cellBg = isDiff ? COLORS.yellow50 : null;
//    if (cellBg) {
//       doc.save().rect(x, y, w, ROW_H).fillColor(cellBg).fill().restore();
//    }

//    if (isDiff && mainVal != null && mainVal !== "" && micadaVal != null && micadaVal !== "") {
//       // Both exist, different → strikethrough old + bold new + delta
//       const oldText = safe(mainVal);
//       const newText = safe(micadaVal);

//       // Old value (strikethrough)
//       doc.font("Helvetica").fontSize(6).fillColor(COLORS.slate400)
//          .text(oldText, x + 3, y + 2,
//             { width: w - 6, align: "left", lineBreak: false, decoration: 'lineThrough' });

//       // New value (bold)
//       let newDisplay = newText;
//       if (numeric && diffVal !== undefined && diffVal !== "") {
//          const diffNum = parseFloat(diffVal);
//          const isIncrease = diffNum > 0;
//          const arrow = isIncrease ? "+" : "-";
//          const arrowColor = isIncrease ? COLORS.green500 : COLORS.red500;
//          const absDiff = Math.abs(diffNum).toFixed(2).replace(/\.00$/, "").replace(/^$/, "0");
//          newDisplay = `${newText}  ${arrow}${absDiff}`;
//       }

//       doc.font("Helvetica-Bold").fontSize(7).fillColor(COLORS.slate700)
//          .text(newDisplay, x + 3, y + 11,
//             { width: w - 6, align: "left", lineBreak: false });

//    } else if (isDiff && (!mainVal || mainVal === "") && micadaVal) {
//       // Only MICADA has value
//       doc.font("Helvetica-Bold").fontSize(7).fillColor(COLORS.slate700)
//          .text(safe(micadaVal), x + 3, y + (ROW_H - 7) / 2,
//             { width: w - 6, align: "left", lineBreak: false });

//    } else if (isDiff && mainVal && (!micadaVal || micadaVal === "")) {
//       // Only Main has value
//       doc.font("Helvetica").fontSize(7).fillColor(COLORS.slate400)
//          .text(safe(mainVal), x + 3, y + (ROW_H - 7) / 2,
//             { width: w - 6, align: "left", lineBreak: false });

//    } else {
//       // Match or single side → show available value
//       const val = mainVal ?? micadaVal;
//       doc.font("Helvetica").fontSize(7).fillColor(COLORS.slate700)
//          .text(safe(val), x + 3, y + (ROW_H - 7) / 2,
//             { width: w - 6, align: fieldLabel === "Area (Acre)" ? "right" : "left", lineBreak: false });
//    }
// }

// /* ── Data row ──────────────────────────────────────────────────────────── */
// function drawRow(doc, cols, colX, y, rowIdx, record) {
//    const status = record.status || '';
//    const rowBg = getRowBg(status, rowIdx);

//    // Row background
//    doc.save().rect(MARGIN, y, CW, ROW_H).fillColor(rowBg).fill().restore();

//    // Vertical borders
//    for (let ci = 1; ci < cols.length; ci++) {
//       doc.moveTo(colX[ci], y).lineTo(colX[ci], y + ROW_H)
//          .strokeColor(COLORS.slate200).lineWidth(0.3).stroke();
//    }

//    // #
//    doc.font("Helvetica").fontSize(7).fillColor(COLORS.slate400)
//       .text(String(record.srNo || rowIdx + 1), colX[0] + 3, y + (ROW_H - 7) / 2,
//          { width: cols[0].w - 6, align: "center", lineBreak: false });

//    // MI No. / App ID
//    const miText = truncate(doc, safe(record.miNumberAppId), "Helvetica-Bold", 7, cols[1].w - 6);
//    doc.font("Helvetica-Bold").fontSize(7).fillColor(COLORS.slate700)
//       .text(miText, colX[1] + 3, y + (ROW_H - 7) / 2,
//          { width: cols[1].w - 6, align: "left", lineBreak: false });

//    // Status badge
//    drawStatusBadge(doc, status, colX[2], y, cols[2].w);

//    // Compare fields
//    const compareFields = [
//       { label: "Farmer Name",     numeric: false },
//       { label: "Irrigation Type", numeric: false },
//       { label: "Area (Acre)",     numeric: true  },
//    ];

//    for (let ci = 0; ci < compareFields.length; ci++) {
//       const field = compareFields[ci];
//       const colIdx = ci + 3;
//       const isDiff = hasDiff(record, field.label);
//       drawCellPair(doc, record, field.label, colX[colIdx], y, cols[colIdx].w, isDiff, field.numeric);
//    }

//    // Bottom border
//    doc.moveTo(MARGIN, y + ROW_H).lineTo(MARGIN + CW, y + ROW_H)
//       .strokeColor(COLORS.slate200).lineWidth(0.3).stroke();
// }

// /* ── Main export ─────────────────────────────────────────────────────── */
// export async function generateMainMicadaComparisionRecordsPDF(data, res) {
//    try {
//       const { title, records } = data;

//       if (!Array.isArray(records) || records.length === 0) {
//          return res.status(400).json({ message: 'No records to export', success: false });
//       }

//       const doc = new PDFDocument({
//          size: "A4", layout: "landscape", margin: 0, autoFirstPage: false,
//       });

//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader("Content-Disposition",
//          `attachment; filename="${(title || 'MICADA_Comparison').replace(/\s+/g, '_')}-${fileDate()}.pdf"`);
//       doc.pipe(res);

//       const cols = buildCols();
//       const colX = computeColX(cols);

//       // Summary
//       const summary = {
//          all: records.length,
//          match: records.filter(r => r.status === 'Matched').length,
//          mismatch: records.filter(r => r.status === 'Mismatch').length,
//          main_only: records.filter(r => r.status === 'Main Only').length,
//          micada_only: records.filter(r => r.status === 'MICADA Only').length,
//       };

//       // Net acre diff
//       let netAcreDiff = 0;
//       records.forEach(rec => {
//          const diffVal = rec['Area (Acre) (Diff)'];
//          if (diffVal !== undefined && diffVal !== "") {
//             netAcreDiff += parseFloat(diffVal) || 0;
//          }
//       });

//       // Estimate total pages for footer
//       const usableH = PAGE_H - HEADER_H - FOOTER_H - 40;
//       const estPages = Math.ceil((records.length * ROW_H) / usableH) || 1;

//       let pageNum = 1;
//       let y = 0;

//       function startPage() {
//          doc.addPage({ size: "A4", layout: "landscape", margin: 0 });
//          drawHeader(doc, title);
//          y = drawSummaryStrip(doc, summary, netAcreDiff);
//          // REMOVED: y = drawLegend(doc, y);
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

//       drawFooter(doc, pageNum, estPages);
//       doc.end();

//    } catch (err) {
//       console.error("Main Micada Comparison PDF error:", err);
//       if (!res.headersSent) {
//          res.status(500).json({ message: "Failed to generate Main Micada Comparison PDF", success: false });
//       }
//    }
// }








import PDFDocument from "pdfkit";

const PAGE_W   = 841.89;  // A4 Landscape
const PAGE_H   = 595.28;
const MARGIN   = 20;
const CW       = PAGE_W - 2 * MARGIN;
const FOOTER_H = 18;
const ROW_H    = 22;
const HEAD_H   = 14;
const HEADER_H = 55;

const FONT_SIZE = 6.5;
const STATUS_FONT_SIZE = 5.5;

/* ── Colors (exact match with React table) ─────────────────────────────── */
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
   green500:  '#22c55e',
   green100:  '#dcfce7',
   green700:  '#15803d',
   red500:    '#ef4444',
   red100:    '#fee2e2',
   red700:    '#b91c1c',
   amber500:  '#f59e0b',
   amber100:  '#fef3c7',
   amber700:  '#b45309',
   blue500:   '#3b82f6',
   blue100:   '#dbeafe',
   blue700:   '#1d4ed8',
   yellow50:  '#fefce8',
   yellow200: '#fef08a',
};

/* ── Status meta ─────────────────────────────────────────────────────── */
const STATUS_META = {
   'Matched':     { bg: COLORS.green100,  text: COLORS.green700,  label: 'MATCHED' },
   'Mismatch':    { bg: COLORS.red100,    text: COLORS.red700,    label: 'MISMATCH' },
   'Main Only':   { bg: COLORS.amber100,  text: COLORS.amber700,  label: 'MAIN ONLY' },
   'MICADA Only': { bg: COLORS.blue100,   text: COLORS.blue700,   label: 'MICADA ONLY' },
};

/* ── Columns ─────────────────────────────────────────────────────────── */
// # | MI No./App ID | Status | Farmer Name (Main) | Farmer Name (MICADA) | Irrigation (Main) | Irrigation (MICADA) | Area - Main | Area - MICADA | Diff
const BASE_COLS = [
   { label: "#",                      w: 28,  align: "center" },
   { label: "MI No./App ID",          w: 75,  align: "left"   },
   { label: "Status",                 w: 55,  align: "center" },
   { label: "Farmer Name (Main)",     w: 100, align: "left"   },
   { label: "Farmer Name (MICADA)",   w: 100, align: "left"   },
   { label: "Irrigation Type (Main)", w: 85,  align: "left"   },
   { label: "Irrigation Type (MICADA)", w: 85, align: "left" },
   { label: "Area - Main",            w: 55,  align: "right", numeric: true },
   { label: "Area - MICADA",          w: 55,  align: "right", numeric: true },
   { label: "Diff",                   w: 45,  align: "right", numeric: true },
];

function buildCols() {
   const cols = BASE_COLS.map(c => ({ ...c, fontSize: FONT_SIZE }));
   const used = cols.reduce((s, c) => s + c.w, 0);
   // Distribute leftover equally among last 3 area columns
   const leftover = CW - used;
   if (leftover > 0) {
      cols[7].w += Math.round(leftover / 3);
      cols[8].w += Math.round(leftover / 3);
      cols[9].w += Math.round(leftover / 3);
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

function today() { return new Date().toLocaleDateString("en-IN"); }
function fileDate() { return new Date().toISOString().split("T")[0]; }

function truncate(doc, text, font, size, maxW) {
   doc.font(font).fontSize(size);
   if (doc.widthOfString(text) <= maxW) return text;
   let t = text;
   while (t.length > 0 && doc.widthOfString(t + "…") > maxW) t = t.slice(0, -1);
   return t + "…";
}

function toNumber(val) {
   const n = parseFloat(val);
   return Number.isFinite(n) ? n : null;
}

/* ── Row background by status ──────────────────────────────────────────── */
function getRowBg(status, index) {
   switch (status) {
      case 'Mismatch':    return COLORS.red100;
      case 'Main Only':   return COLORS.amber100;
      case 'MICADA Only': return COLORS.blue100;
      default:            return index % 2 === 0 ? COLORS.white : COLORS.slate50;
   }
}

/* ── Check if field has diff ─────────────────────────────────────────── */
function hasDiff(record, fieldLabel) {
   const mainKey = `${fieldLabel} (Main)`;
   const micadaKey = `${fieldLabel} (MICADA)`;
   const mainVal = String(record[mainKey] ?? '').trim().toLowerCase();
   const micadaVal = String(record[micadaKey] ?? '').trim().toLowerCase();
   return mainVal !== micadaVal;
}

/* ── Header ──────────────────────────────────────────────────────────── */
function drawHeader(doc, title) {
   doc.moveTo(MARGIN, HEADER_H - 4).lineTo(MARGIN + CW, HEADER_H - 4)
      .strokeColor("#000000").lineWidth(0.8).stroke();

   doc.font("Helvetica-Bold").fontSize(14).fillColor(COLORS.slate900)
      .text(title || "MICADA Comparison", MARGIN, 10, { lineBreak: false });

   doc.font("Helvetica").fontSize(7).fillColor(COLORS.slate400)
      .text(`Generated: ${today()}`, 0, 14,
         { align: "right", width: PAGE_W - MARGIN, lineBreak: false });
}

/* ── Footer ──────────────────────────────────────────────────────────── */
function drawFooter(doc, pageNum, totalPages) {
   const fy = PAGE_H - FOOTER_H;
   doc.moveTo(MARGIN, fy).lineTo(MARGIN + CW, fy)
      .strokeColor("#000000").lineWidth(0.4).stroke();
   doc.font("Helvetica").fontSize(7).fillColor(COLORS.slate500)
      .text(`Page ${pageNum} of ${totalPages}`, MARGIN, fy + 4,
         { width: CW, align: "center", lineBreak: false });
}

/* ── Summary strip ───────────────────────────────────────────────────── */
function drawSummaryStrip(doc, summary, netAcreDiff) {
   const stripY = HEADER_H + 2;
   const stripH = 18;
   const items = [
      { label: "Total",       value: summary.all,         bg: COLORS.slate100, text: COLORS.slate700 },
      { label: "Matched",     value: summary.match,       bg: COLORS.green100, text: COLORS.green700 },
      { label: "Mismatch",    value: summary.mismatch,    bg: COLORS.red100,   text: COLORS.red700 },
      { label: "Main Only",   value: summary.main_only,   bg: COLORS.amber100, text: COLORS.amber700 },
      { label: "MICADA Only", value: summary.micada_only, bg: COLORS.blue100,  text: COLORS.blue700 },
   ];

   // Reserve 110px on the right for Net Area to prevent overlap
   const netAreaWidth = 110;
   const summaryWidth = CW - netAreaWidth;
   const itemW = summaryWidth / items.length;
   let x = MARGIN;

   for (const item of items) {
      doc.save().rect(x, stripY, itemW, stripH).fillColor(item.bg).fill().restore();
      doc.rect(x, stripY, itemW, stripH).strokeColor(COLORS.slate200).lineWidth(0.3).stroke();
      doc.font("Helvetica-Bold").fontSize(7).fillColor(item.text)
         .text(`${item.value}`, x, stripY + 2, { width: itemW, align: "center", lineBreak: false });
      doc.font("Helvetica").fontSize(5.5).fillColor(COLORS.slate400)
         .text(item.label, x, stripY + 10, { width: itemW, align: "center", lineBreak: false });
      x += itemW;
   }

   // Net area diff — positioned on the far right, outside summary boxes
   if (Math.abs(netAcreDiff) > 0.001) {
      const arrow = netAcreDiff > 0 ? "+" : "-";
      const arrowColor = netAcreDiff > 0 ? COLORS.green500 : COLORS.red500;
      const netX = MARGIN + summaryWidth + 4;

      doc.font("Helvetica-Bold").fontSize(7).fillColor(COLORS.slate500)
         .text("Net Area", netX, stripY + 2, { lineBreak: false });
      doc.font("Helvetica-Bold").fontSize(8).fillColor(arrowColor)
         .text(`${arrow} ${Math.abs(netAcreDiff).toFixed(2)} acre`, netX, stripY + 10, { lineBreak: false });
   }

   return stripY + stripH + 4;
}

/* ── Column headers ────────────────────────────────────────────────────── */
function drawColumnHeaders(doc, cols, colX, y) {
   doc.save().rect(MARGIN, y, CW, HEAD_H).fillColor(COLORS.slate900).fill().restore();
   doc.rect(MARGIN, y, CW, HEAD_H).strokeColor(COLORS.slate700).lineWidth(0.5).stroke();

   for (let ci = 0; ci < cols.length; ci++) {
      const col = cols[ci];
      doc.font("Helvetica-Bold").fontSize(6.5).fillColor(COLORS.white)
         .text(col.label, colX[ci] + 3, y + (HEAD_H - 6.5) / 2,
            { width: col.w - 6, align: col.align, lineBreak: false });

      if (ci > 0) {
         doc.moveTo(colX[ci], y).lineTo(colX[ci], y + HEAD_H)
            .strokeColor(COLORS.slate700).lineWidth(0.3).stroke();
      }
   }
}

/* ── Draw status badge ───────────────────────────────────────────────── */
function drawStatusBadge(doc, status, x, y, w) {
   const meta = STATUS_META[status] || STATUS_META['Matched'];
   const badgeH = 10;
   const badgeW = w - 6;
   const badgeX = x + 3;
   const badgeY = y + (ROW_H - badgeH) / 2;

   doc.save().rect(badgeX, badgeY, badgeW, badgeH).fillColor(meta.bg).fill().restore();
   doc.rect(badgeX, badgeY, badgeW, badgeH).strokeColor(meta.bg).lineWidth(0.3).stroke();
   doc.font("Helvetica-Bold").fontSize(STATUS_FONT_SIZE).fillColor(meta.text)
      .text(meta.label, badgeX, badgeY + 1.5,
         { width: badgeW, align: "center", lineBreak: false });
}

/* ── Draw a single cell with optional diff highlighting ──────────────── */
function drawCell(doc, value, x, y, w, align, isDiff, numeric) {
   const cellBg = isDiff ? COLORS.yellow50 : null;
   if (cellBg) {
      doc.save().rect(x, y, w, ROW_H).fillColor(cellBg).fill().restore();
   }

   const text = safe(value);
   const fontSize = 7;
   const font = isDiff ? "Helvetica-Bold" : "Helvetica";
   const color = COLORS.slate700;

   doc.font(font).fontSize(fontSize).fillColor(color)
      .text(text, x + 3, y + (ROW_H - fontSize) / 2,
         { width: w - 6, align: align, lineBreak: false });
}

/* ── Data row ──────────────────────────────────────────────────────────── */
function drawRow(doc, cols, colX, y, rowIdx, record) {
   const status = record.status || '';
   const rowBg = getRowBg(status, rowIdx);

   // Row background
   doc.save().rect(MARGIN, y, CW, ROW_H).fillColor(rowBg).fill().restore();

   // Vertical borders
   for (let ci = 1; ci < cols.length; ci++) {
      doc.moveTo(colX[ci], y).lineTo(colX[ci], y + ROW_H)
         .strokeColor(COLORS.slate200).lineWidth(0.3).stroke();
   }

   // #
   doc.font("Helvetica").fontSize(7).fillColor(COLORS.slate400)
      .text(String(record.srNo || rowIdx + 1), colX[0] + 3, y + (ROW_H - 7) / 2,
         { width: cols[0].w - 6, align: "center", lineBreak: false });

   // MI No. / App ID
   const miText = truncate(doc, safe(record.miNumberAppId), "Helvetica-Bold", 7, cols[1].w - 6);
   doc.font("Helvetica-Bold").fontSize(7).fillColor(COLORS.slate700)
      .text(miText, colX[1] + 3, y + (ROW_H - 7) / 2,
         { width: cols[1].w - 6, align: "left", lineBreak: false });

   // Status badge
   drawStatusBadge(doc, status, colX[2], y, cols[2].w);

   // Farmer Name (Main) - col 3
   const farmerNameDiff = hasDiff(record, "Farmer Name");
   drawCell(doc, record['Farmer Name (Main)'], colX[3], y, cols[3].w, "left", farmerNameDiff, false);

   // Farmer Name (MICADA) - col 4
   drawCell(doc, record['Farmer Name (MICADA)'], colX[4], y, cols[4].w, "left", farmerNameDiff, false);

   // Irrigation Type (Main) - col 5
   const irrigationDiff = hasDiff(record, "Irrigation Type");
   drawCell(doc, record['Irrigation Type (Main)'], colX[5], y, cols[5].w, "left", irrigationDiff, false);

   // Irrigation Type (MICADA) - col 6
   drawCell(doc, record['Irrigation Type (MICADA)'], colX[6], y, cols[6].w, "left", irrigationDiff, false);

   // Area - Main - col 7
   const areaDiff = hasDiff(record, "Area (Acre)");
   drawCell(doc, record['Area (Acre) (Main)'], colX[7], y, cols[7].w, "right", areaDiff, true);

   // Area - MICADA - col 8
   drawCell(doc, record['Area (Acre) (MICADA)'], colX[8], y, cols[8].w, "right", areaDiff, true);

   // Diff - col 9
   const diffVal = record['Area (Acre) (Diff)'];
   const diffNum = parseFloat(diffVal);
   let diffText = "—";
   let diffColor = COLORS.slate700;
   if (diffVal !== undefined && diffVal !== "" && !isNaN(diffNum)) {
      const arrow = diffNum > 0 ? "+" : "";
      diffText = `${arrow}${diffNum.toFixed(2)}`;
      diffColor = diffNum > 0 ? COLORS.green500 : (diffNum < 0 ? COLORS.red500 : COLORS.slate700);
   }
   doc.font("Helvetica-Bold").fontSize(7).fillColor(diffColor)
      .text(diffText, colX[9] + 3, y + (ROW_H - 7) / 2,
         { width: cols[9].w - 6, align: "right", lineBreak: false });

   // Bottom border
   doc.moveTo(MARGIN, y + ROW_H).lineTo(MARGIN + CW, y + ROW_H)
      .strokeColor(COLORS.slate200).lineWidth(0.3).stroke();
}

/* ── Main export ─────────────────────────────────────────────────────── */
export async function generateMainMicadaComparisionRecordsPDF(data, res) {
   try {
      const { title, records } = data;

      if (!Array.isArray(records) || records.length === 0) {
         return res.status(400).json({ message: 'No records to export', success: false });
      }

      const doc = new PDFDocument({
         size: "A4", layout: "landscape", margin: 0, autoFirstPage: false,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition",
         `attachment; filename="${(title || 'MICADA_Comparison').replace(/\s+/g, '_')}-${fileDate()}.pdf"`);
      doc.pipe(res);

      const cols = buildCols();
      const colX = computeColX(cols);

      // Summary
      const summary = {
         all: records.length,
         match: records.filter(r => r.status === 'Matched').length,
         mismatch: records.filter(r => r.status === 'Mismatch').length,
         main_only: records.filter(r => r.status === 'Main Only').length,
         micada_only: records.filter(r => r.status === 'MICADA Only').length,
      };

      // Net acre diff
      let netAcreDiff = 0;
      records.forEach(rec => {
         const diffVal = rec['Area (Acre) (Diff)'];
         if (diffVal !== undefined && diffVal !== "") {
            netAcreDiff += parseFloat(diffVal) || 0;
         }
      });

      // Estimate total pages for footer
      const usableH = PAGE_H - HEADER_H - FOOTER_H - 40;
      const estPages = Math.ceil((records.length * ROW_H) / usableH) || 1;

      let pageNum = 1;
      let y = 0;

      function startPage() {
         doc.addPage({ size: "A4", layout: "landscape", margin: 0 });
         drawHeader(doc, title);
         y = drawSummaryStrip(doc, summary, netAcreDiff);
         drawColumnHeaders(doc, cols, colX, y);
         y += HEAD_H;
      }

      startPage();

      for (let rowIdx = 0; rowIdx < records.length; rowIdx++) {
         if (y + ROW_H > PAGE_H - FOOTER_H - 10) {
            drawFooter(doc, pageNum, estPages);
            pageNum++;
            startPage();
         }

         drawRow(doc, cols, colX, y, rowIdx, records[rowIdx]);
         y += ROW_H;
      }

      drawFooter(doc, pageNum, estPages);
      doc.end();

   } catch (err) {
      console.error("Main Micada Comparison PDF error:", err);
      if (!res.headersSent) {
         res.status(500).json({ message: "Failed to generate Main Micada Comparison PDF", success: false });
      }
   }
}