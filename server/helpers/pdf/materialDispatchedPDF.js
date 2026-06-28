

// import PDFDocument from "pdfkit";

// const PAGE_W   = 841.89;  // A4 landscape
// const PAGE_H   = 595.28;
// const MARGIN   = 24;
// const CW       = PAGE_W - 2 * MARGIN;
// const FOOTER_H = 18;
// const ROW_H    = 11;
// const HEAD_H   = 11;
// const HEADER_H = 60;

// const FONT_SIZE = 5.0;

// const BASE_COLS_ALL = [
//   { label: "S.No",        w: 16,  align: "center" },
//   { label: "Dealer Name", w: 55,  align: "left"   },
//   { label: "Farmer Name", w: 62,  align: "left"   },
//   { label: "Address",     w: 67,  align: "left"   },
//   { label: "Brand Name",  w: 50,  align: "left"   },
//   { label: "Date",        w: 50,  align: "center" },
//   { label: "Challan No",  w: 50,  align: "left"   },
//   { label: "Vehicle No",  w: 50,  align: "left"   },
//   { label: "Destination", w: 58,  align: "left"   },
//   { label: "Mini Ac.",    w: 28,  align: "right"  },
//   { label: "Mini FS",     w: 38,  align: "right"  },
//   { label: "Drip Ac.",    w: 28,  align: "right"  },
//   { label: "Drip FS",     w: 38,  align: "right"  },
//   { label: "HDPE Ac",     w: 26,  align: "right"  },
//   { label: "HDPE FS",     w: 38,  align: "right"  },
//   { label: "Reference",   w: 140, align: "left"   },
// ];

// const BASE_COLS_DEALER = [
//   { label: "S.No",        w: 16,  align: "center" },
//   { label: "Farmer Name", w: 72,  align: "left"   },
//   { label: "Address",     w: 82,  align: "left"   },
//   { label: "Brand Name",  w: 55,  align: "left"   },
//   { label: "Date",        w: 55,  align: "center" },
//   { label: "Challan No",  w: 50,  align: "left"   },
//   { label: "Vehicle No",  w: 52,  align: "left"   },
//   { label: "Destination", w: 66,  align: "left"   },
//   { label: "Mini Ac.",    w: 28,  align: "right"  },
//   { label: "Mini FS",     w: 38,  align: "right"  },
//   { label: "Drip Ac.",    w: 28,  align: "right"  },
//   { label: "Drip FS",     w: 38,  align: "right"  },
//   { label: "HDPE Ac",     w: 26,  align: "right"  },
//   { label: "HDPE FS",     w: 38,  align: "right"  },
//   { label: "Reference",   w: 150, align: "left"   },
// ];

// function buildCols(withDealer) {
//   const base = withDealer ? BASE_COLS_ALL : BASE_COLS_DEALER;
//   return base.map(c => ({ ...c, fontSize: FONT_SIZE }));
// }

// function computeColX(cols) {
//   const xs = [];
//   let x = MARGIN;
//   for (const c of cols) { xs.push(x); x += c.w; }
//   return xs;
// }

// function safe(v)    { return v != null && v !== "" ? String(v) : "—"; }
// function num2(v)    { return v != null && !isNaN(v) ? Number(v).toFixed(2) : "—"; }
// function today()    { return new Date().toLocaleDateString("en-IN"); }
// function fileDate() { return new Date().toISOString().split("T")[0]; }

// function numIN(v) {
//   if (v == null || isNaN(v)) return "—";
//   const n = Math.round(Number(v));
//   const s = String(n);
//   if (s.length <= 3) return s;
//   const last3 = s.slice(-3);
//   const rest  = s.slice(0, -3);
//   return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3;
// }

// function fmtDate(val) {
//   if (!val) return "—";
//   const d = new Date(val);
//   return isNaN(d.getTime()) ? "—"
//     : `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
// }

// function truncate(doc, text, font, size, maxW) {
//   doc.font(font).fontSize(size);
//   if (doc.widthOfString(text) <= maxW) return text;
//   let t = text;
//   while (t.length > 0 && doc.widthOfString(t + "…") > maxW) t = t.slice(0, -1);
//   return t + "…";
// }

// function drawHeader(doc, financialYear, dealerName, dealerCode) {
//   doc.moveTo(MARGIN, HEADER_H - 4).lineTo(MARGIN + CW, HEADER_H - 4)
//     .strokeColor("#000000").lineWidth(0.8).stroke();
//   doc.font("Helvetica-Bold").fontSize(15).fillColor("#000000")
//     .text("Material Dispatched Report", MARGIN, 10, { lineBreak: false });
//   if (financialYear) {
//     doc.font("Helvetica-Bold").fontSize(10).fillColor("#000000")
//       .text(`FY: ${financialYear}`, 0, 12,
//         { align: "right", width: PAGE_W - MARGIN, lineBreak: false });
//   }
//   const parts = [];
//   if (dealerName && dealerName !== "—") parts.push(`Dealer: ${dealerName}`);
//   if (dealerCode && dealerCode.trim() && dealerCode !== "—") parts.push(`Code: ${dealerCode.trim()}`);
//   if (parts.length > 0) {
//     doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#000000")
//       .text(parts.join("   |   "), MARGIN, 30, { lineBreak: false });
//   }
//   doc.font("Helvetica").fontSize(7).fillColor("#000000")
//     .text(`Generated: ${today()}`, 0, 32,
//       { align: "right", width: PAGE_W - MARGIN, lineBreak: false });
// }

// function drawFooter(doc, pageNum) {
//   const fy = PAGE_H - FOOTER_H;
//   doc.moveTo(MARGIN, fy).lineTo(MARGIN + CW, fy)
//     .strokeColor("#000000").lineWidth(0.4).stroke();
//   doc.font("Helvetica").fontSize(7).fillColor("#000000")
//     .text(`Page ${pageNum}`, MARGIN, fy + 4,
//       { width: CW, align: "center", lineBreak: false });
// }

// function drawColumnHeaders(doc, cols, y) {
//   doc.save().rect(MARGIN, y, CW, HEAD_H).fillColor("#EEEEEE").fill().restore();
//   doc.rect(MARGIN, y, CW, HEAD_H).strokeColor("#000000").lineWidth(0.5).stroke();
//   let x = MARGIN;
//   for (const col of cols) {
//     doc.font("Helvetica-Bold").fontSize(col.fontSize).fillColor("#000000")
//       .text(col.label, x + 2, y + (HEAD_H - col.fontSize) / 2,
//         { width: col.w - 4, align: col.align, lineBreak: false });
//     if (x > MARGIN) {
//       doc.moveTo(x, y).lineTo(x, y + HEAD_H)
//         .strokeColor("#000000").lineWidth(0.3).stroke();
//     }
//     x += col.w;
//   }
// }

// function drawRow(doc, cols, y, rowIdx, vals) {
//   const bg = rowIdx % 2 === 0 ? "#FFFFFF" : "#F9F9F9";
//   doc.save().rect(MARGIN, y, CW, ROW_H).fillColor(bg).fill().restore();
//   let x = MARGIN;
//   for (let ci = 0; ci < cols.length; ci++) {
//     const col = cols[ci];
//     let text = vals[ci];
//     doc.rect(x, y, col.w, ROW_H).strokeColor("#000000").lineWidth(0.3).stroke();
//     text = truncate(doc, text, "Helvetica", col.fontSize, col.w - 4);
//     doc.font("Helvetica").fontSize(col.fontSize).fillColor("#000000")
//       .text(text, x + 2, y + (ROW_H - col.fontSize) / 2,
//         { width: col.w - 4, align: col.align, lineBreak: false });
//     x += col.w;
//   }
// }

// // ── Overall Summary Box — drawn at the very end ───────────────────────────────
// // 7 cards: Total Records + Mini Ac. | Mini FS | Drip Ac. | Drip FS | HDPE Ac. | HDPE FS
// function drawOverallSummaryBox(doc, y, totals) {
//   const BOX_TOP    = y + 14;      // gap below last data row
//   const BOX_H      = 52;
//   const CARD_W     = CW / 7;     // 7 equal cards
//   const LABEL_FS   = 7;
//   const VALUE_FS   = 11;
//   const SUBVAL_FS  = 7.5;

//   // Check space; if not enough, return false so caller adds new page
//   if (BOX_TOP + BOX_H + 10 > PAGE_H - FOOTER_H - 4) return false;

//   // Outer border
//   doc.rect(MARGIN, BOX_TOP, CW, BOX_H)
//     .strokeColor("#000000").lineWidth(0.6).stroke();

//   // Section title
//   doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000")
//     .text("Overall Summary", MARGIN, BOX_TOP - 11, { lineBreak: false });

//   const cards = [
//     { label: "Total Records",    value: String(totals.count),                  sub: "Records", fs_color: "#2c3e50" },
//     { label: "Mini Irrigated",   value: Number(totals.miniAcres).toFixed(2),   sub: "Acres",   fs_color: "#1a5276" },
//     { label: "Mini Farmer Share",value: numIN(totals.miniFarmerShare),          sub: "Rs",       fs_color: "#1a5276" },
//     { label: "Drip Irrigated",   value: Number(totals.dripAcres).toFixed(2),   sub: "Acres",   fs_color: "#145a32" },
//     { label: "Drip Farmer Share",value: numIN(totals.dripFarmerShare),          sub: "Rs",       fs_color: "#145a32" },
//     { label: "HDPE",             value: Number(totals.hdpeAcres).toFixed(2),   sub: "Acres",   fs_color: "#784212" },
//     { label: "HDPE Farmer Share",value: numIN(totals.hdpeFarmerShare),          sub: "Rs",       fs_color: "#784212" },
//   ];

//   for (let i = 0; i < cards.length; i++) {
//     const cx = MARGIN + i * CARD_W;
//     const card = cards[i];

//     // Card background — alternate slight tint per pair
//     const pairIdx = Math.floor(i / 2);
//     const bgColors = ["#F2F3F4", "#EBF5FB", "#EBF5FB", "#EAFAF1", "#EAFAF1", "#FDF3E7", "#FDF3E7"];
//     doc.save().rect(cx, BOX_TOP, CARD_W, BOX_H).fillColor(bgColors[i]).fill().restore();

//     // Divider between cards
//     if (i > 0) {
//       doc.moveTo(cx, BOX_TOP).lineTo(cx, BOX_TOP + BOX_H)
//         .strokeColor("#CCCCCC").lineWidth(0.4).stroke();
//     }

//     // Label
//     doc.font("Helvetica-Bold").fontSize(LABEL_FS).fillColor("#555555")
//       .text(card.label, cx + 4, BOX_TOP + 7,
//         { width: CARD_W - 8, align: "center", lineBreak: false });

//     // Value
//     doc.font("Helvetica-Bold").fontSize(VALUE_FS).fillColor(card.fs_color)
//       .text(card.value, cx + 4, BOX_TOP + 20,
//         { width: CARD_W - 8, align: "center", lineBreak: false });

//     // Sub label (Acres / ₹)
//     doc.font("Helvetica").fontSize(SUBVAL_FS).fillColor("#888888")
//       .text(card.sub, cx + 4, BOX_TOP + 36,
//         { width: CARD_W - 8, align: "center", lineBreak: false });
//   }

//   // Re-draw outer border on top of fills
//   doc.rect(MARGIN, BOX_TOP, CW, BOX_H)
//     .strokeColor("#000000").lineWidth(0.6).stroke();

//   return true;
// }

// // ── Main export ───────────────────────────────────────────────────────────────
// export async function generateMaterialDispatchedPDF(
//   records,
//   res,
//   { financialYear, dealerName, dealerCode, farmerDealerCode } = {}
// ) {
//   try {
//     const doc = new PDFDocument({
//       size: "A4", layout: "landscape", margin: 0, autoFirstPage: false,
//     });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition",
//       `attachment; filename="material-dispatched-${fileDate()}.pdf"`);
//     doc.pipe(res);

//     const resolvedDealerName = dealerName && dealerName !== "—" ? dealerName : null;
//     const rawCode = farmerDealerCode ?? dealerCode;
//     const resolvedDealerCode =
//       rawCode && String(rawCode).trim() && String(rawCode).trim() !== "—"
//         ? String(rawCode).trim()
//         : null;

//     const withDealer = !resolvedDealerName;
//     const cols = buildCols(withDealer);
//     const colX = computeColX(cols);

//     let pageNum = 1;
//     let y = 0;

//     function startPage() {
//       doc.addPage({ size: "A4", layout: "landscape", margin: 0 });
//       drawHeader(doc, financialYear, resolvedDealerName, resolvedDealerCode);
//       y = HEADER_H + 6;
//       drawColumnHeaders(doc, cols, y);
//       y += HEAD_H;
//     }

//     startPage();

//     const totals = {
//       count:           records.length,
//       miniAcres:       0,
//       miniFarmerShare: 0,
//       dripAcres:       0,
//       dripFarmerShare: 0,
//       hdpeAcres:       0,
//       hdpeFarmerShare: 0,
//     };

//     for (let rowIdx = 0; rowIdx < records.length; rowIdx++) {
//       if (y + ROW_H > PAGE_H - FOOTER_H - 22) {
//         drawFooter(doc, pageNum++);
//         startPage();
//       }

//       const rec = records[rowIdx];
//       totals.miniAcres       += Number(rec.miniAcres)       || 0;
//       totals.miniFarmerShare += Number(rec.miniFarmerShare) || 0;
//       totals.dripAcres       += Number(rec.dripAcres)       || 0;
//       totals.dripFarmerShare += Number(rec.dripFarmerShare) || 0;
//       totals.hdpeAcres       += Number(rec.hdpeAcres)       || 0;
//       totals.hdpeFarmerShare += Number(rec.hdpeFarmerShare) || 0;

//       const vals = withDealer
//         ? [
//             String(rowIdx + 1),
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
//           ]
//         : [
//             String(rowIdx + 1),
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
//           ];

//       drawRow(doc, cols, y, rowIdx, vals);
//       y += ROW_H;
//     }

//     // Summary box needs ~80px (14 gap + 52 height + title + margin)
//     if (y + 80 > PAGE_H - FOOTER_H - 4) {
//       drawFooter(doc, pageNum++);
//       startPage();
//     }

//     // Draw the summary box directly below last data row (no total row)
//     const drawn = drawOverallSummaryBox(doc, y, totals);
//     if (!drawn) {
//       drawFooter(doc, pageNum++);
//       startPage();
//       drawOverallSummaryBox(doc, y, totals);
//     }

//     drawFooter(doc, pageNum);
//     doc.end();

//   } catch (err) {
//     console.error("MaterialDispatched PDF error:", err);
//     if (!res.headersSent) {
//       res.status(500).json({ message: "Failed to generate Material Dispatched PDF" });
//     }
//   }
// }












import PDFDocument from "pdfkit";

const PAGE_W   = 841.89;  // A4 landscape
const PAGE_H   = 595.28;
const MARGIN   = 24;
const CW       = PAGE_W - 2 * MARGIN;
const FOOTER_H = 18;
const ROW_H    = 11;
const HEAD_H   = 11;
const HEADER_H = 60;

const FONT_SIZE = 5.0;

const BASE_COLS_ALL = [
  { label: "S.No",        w: 16,  align: "center" },
  { label: "Dealer Name", w: 55,  align: "left"   },
  { label: "Farmer Name", w: 62,  align: "left"   },
  { label: "Address",     w: 67,  align: "left"   },
  { label: "Brand Name",  w: 50,  align: "left"   },
  { label: "Date",        w: 50,  align: "center" },
  { label: "Challan No",  w: 50,  align: "left"   },
  { label: "Vehicle No",  w: 50,  align: "left"   },
  { label: "Destination", w: 58,  align: "left"   },
  { label: "Mini Ac.",    w: 28,  align: "right"  },
  { label: "Mini FS",     w: 38,  align: "right"  },
  { label: "Drip Ac.",    w: 28,  align: "right"  },
  { label: "Drip FS",     w: 38,  align: "right"  },
  { label: "HDPE Ac",     w: 26,  align: "right"  },
  { label: "HDPE FS",     w: 38,  align: "right"  },
  { label: "Reference",   w: 140, align: "left"   },
];

const BASE_COLS_DEALER = [
  { label: "S.No",        w: 16,  align: "center" },
  { label: "Farmer Name", w: 72,  align: "left"   },
  { label: "Address",     w: 82,  align: "left"   },
  { label: "Brand Name",  w: 55,  align: "left"   },
  { label: "Date",        w: 55,  align: "center" },
  { label: "Challan No",  w: 50,  align: "left"   },
  { label: "Vehicle No",  w: 52,  align: "left"   },
  { label: "Destination", w: 66,  align: "left"   },
  { label: "Mini Ac.",    w: 28,  align: "right"  },
  { label: "Mini FS",     w: 38,  align: "right"  },
  { label: "Drip Ac.",    w: 28,  align: "right"  },
  { label: "Drip FS",     w: 38,  align: "right"  },
  { label: "HDPE Ac",     w: 26,  align: "right"  },
  { label: "HDPE FS",     w: 38,  align: "right"  },
  { label: "Reference",   w: 150, align: "left"   },
];

function buildCols(withDealer) {
  const base = withDealer ? BASE_COLS_ALL : BASE_COLS_DEALER;
  return base.map(c => ({ ...c, fontSize: FONT_SIZE }));
}

function computeColX(cols) {
  const xs = [];
  let x = MARGIN;
  for (const c of cols) { xs.push(x); x += c.w; }
  return xs;
}

function safe(v)    { return v != null && v !== "" ? String(v) : "—"; }
function num2(v)    { return v != null && !isNaN(v) ? Number(v).toFixed(2) : "—"; }
function today()    { return new Date().toLocaleDateString("en-IN"); }
function fileDate() { return new Date().toISOString().split("T")[0]; }

function numIN(v) {
  if (v == null || isNaN(v)) return "—";
  const n = Math.round(Number(v));
  const s = String(n);
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest  = s.slice(0, -3);
  return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3;
}

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

function truncate(doc, text, font, size, maxW) {
  doc.font(font).fontSize(size);
  if (doc.widthOfString(text) <= maxW) return text;
  let t = text;
  while (t.length > 0 && doc.widthOfString(t + "…") > maxW) t = t.slice(0, -1);
  return t + "…";
}

function drawHeader(doc, financialYear, dealerName, dealerCode) {
  doc.moveTo(MARGIN, HEADER_H - 4).lineTo(MARGIN + CW, HEADER_H - 4)
    .strokeColor("#000000").lineWidth(0.8).stroke();
  doc.font("Helvetica-Bold").fontSize(15).fillColor("#000000")
    .text("Material Dispatched Report", MARGIN, 10, { lineBreak: false });
  if (financialYear) {
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#000000")
      .text(`FY: ${financialYear}`, 0, 12,
        { align: "right", width: PAGE_W - MARGIN, lineBreak: false });
  }
  const parts = [];
  if (dealerName && dealerName !== "—") parts.push(`Dealer: ${dealerName}`);
  if (dealerCode && dealerCode.trim() && dealerCode !== "—") parts.push(`Code: ${dealerCode.trim()}`);
  if (parts.length > 0) {
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#000000")
      .text(parts.join("   |   "), MARGIN, 30, { lineBreak: false });
  }
  doc.font("Helvetica").fontSize(7).fillColor("#000000")
    .text(`Generated: ${today()}`, 0, 32,
      { align: "right", width: PAGE_W - MARGIN, lineBreak: false });
}

function drawFooter(doc, pageNum) {
  const fy = PAGE_H - FOOTER_H;
  doc.moveTo(MARGIN, fy).lineTo(MARGIN + CW, fy)
    .strokeColor("#000000").lineWidth(0.4).stroke();
  doc.font("Helvetica").fontSize(7).fillColor("#000000")
    .text(`Page ${pageNum}`, MARGIN, fy + 4,
      { width: CW, align: "center", lineBreak: false });
}

function drawColumnHeaders(doc, cols, y) {
  doc.save().rect(MARGIN, y, CW, HEAD_H).fillColor("#EEEEEE").fill().restore();
  doc.rect(MARGIN, y, CW, HEAD_H).strokeColor("#000000").lineWidth(0.5).stroke();
  let x = MARGIN;
  for (const col of cols) {
    doc.font("Helvetica-Bold").fontSize(col.fontSize).fillColor("#000000")
      .text(col.label, x + 2, y + (HEAD_H - col.fontSize) / 2,
        { width: col.w - 4, align: col.align, lineBreak: false });
    if (x > MARGIN) {
      doc.moveTo(x, y).lineTo(x, y + HEAD_H)
        .strokeColor("#000000").lineWidth(0.3).stroke();
    }
    x += col.w;
  }
}

function drawRow(doc, cols, y, rowIdx, vals) {
  const bg = rowIdx % 2 === 0 ? "#FFFFFF" : "#F9F9F9";
  doc.save().rect(MARGIN, y, CW, ROW_H).fillColor(bg).fill().restore();
  let x = MARGIN;
  for (let ci = 0; ci < cols.length; ci++) {
    const col = cols[ci];
    let text = vals[ci];
    doc.rect(x, y, col.w, ROW_H).strokeColor("#000000").lineWidth(0.3).stroke();
    text = truncate(doc, text, "Helvetica", col.fontSize, col.w - 4);
    doc.font("Helvetica").fontSize(col.fontSize).fillColor("#000000")
      .text(text, x + 2, y + (ROW_H - col.fontSize) / 2,
        { width: col.w - 4, align: col.align, lineBreak: false });
    x += col.w;
  }
}

// ── Overall Summary Box — drawn at the very end ───────────────────────────────
function drawOverallSummaryBox(doc, y, totals) {
  const BOX_TOP    = y + 14;
  const BOX_H      = 52;
  const CARD_W     = CW / 7;
  const LABEL_FS   = 7;
  const VALUE_FS   = 11;
  const SUBVAL_FS  = 7.5;

  if (BOX_TOP + BOX_H + 10 > PAGE_H - FOOTER_H - 4) return false;

  doc.rect(MARGIN, BOX_TOP, CW, BOX_H)
    .strokeColor("#000000").lineWidth(0.6).stroke();

  doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000")
    .text("Overall Summary", MARGIN, BOX_TOP - 11, { lineBreak: false });

  const cards = [
    { label: "Total Records",    value: String(totals.count),                  sub: "Records", fs_color: "#2c3e50" },
    { label: "Mini Irrigated",   value: Number(totals.miniAcres).toFixed(2),   sub: "Acres",   fs_color: "#1a5276" },
    { label: "Mini Farmer Share",value: numIN(totals.miniFarmerShare),          sub: "Rs",       fs_color: "#1a5276" },
    { label: "Drip Irrigated",   value: Number(totals.dripAcres).toFixed(2),   sub: "Acres",   fs_color: "#145a32" },
    { label: "Drip Farmer Share",value: numIN(totals.dripFarmerShare),          sub: "Rs",       fs_color: "#145a32" },
    { label: "HDPE",             value: Number(totals.hdpeAcres).toFixed(2),   sub: "Acres",   fs_color: "#784212" },
    { label: "HDPE Farmer Share",value: numIN(totals.hdpeFarmerShare),          sub: "Rs",       fs_color: "#784212" },
  ];

  for (let i = 0; i < cards.length; i++) {
    const cx = MARGIN + i * CARD_W;
    const card = cards[i];

    const bgColors = ["#F2F3F4", "#EBF5FB", "#EBF5FB", "#EAFAF1", "#EAFAF1", "#FDF3E7", "#FDF3E7"];
    doc.save().rect(cx, BOX_TOP, CARD_W, BOX_H).fillColor(bgColors[i]).fill().restore();

    if (i > 0) {
      doc.moveTo(cx, BOX_TOP).lineTo(cx, BOX_TOP + BOX_H)
        .strokeColor("#CCCCCC").lineWidth(0.4).stroke();
    }

    doc.font("Helvetica-Bold").fontSize(LABEL_FS).fillColor("#555555")
      .text(card.label, cx + 4, BOX_TOP + 7,
        { width: CARD_W - 8, align: "center", lineBreak: false });

    doc.font("Helvetica-Bold").fontSize(VALUE_FS).fillColor(card.fs_color)
      .text(card.value, cx + 4, BOX_TOP + 20,
        { width: CARD_W - 8, align: "center", lineBreak: false });

    doc.font("Helvetica").fontSize(SUBVAL_FS).fillColor("#888888")
      .text(card.sub, cx + 4, BOX_TOP + 36,
        { width: CARD_W - 8, align: "center", lineBreak: false });
  }

  doc.rect(MARGIN, BOX_TOP, CW, BOX_H)
    .strokeColor("#000000").lineWidth(0.6).stroke();

  return true;
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function generateMaterialDispatchedPDF(
  records,
  res,
  { financialYear, dealerName, dealerCode, farmerDealerCode } = {}
) {
  try {
    const doc = new PDFDocument({
      size: "A4", layout: "landscape", margin: 0, autoFirstPage: false,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition",
      `attachment; filename="material-dispatched-${fileDate()}.pdf"`);
    doc.pipe(res);

    const resolvedDealerName = dealerName && dealerName !== "—" ? dealerName : null;
    const rawCode = farmerDealerCode ?? dealerCode;
    const resolvedDealerCode =
      rawCode && String(rawCode).trim() && String(rawCode).trim() !== "—"
        ? String(rawCode).trim()
        : null;

    const withDealer = !resolvedDealerName;
    const cols = buildCols(withDealer);
    const colX = computeColX(cols);

    let pageNum = 1;
    let y = 0;

    function startPage() {
      doc.addPage({ size: "A4", layout: "landscape", margin: 0 });
      drawHeader(doc, financialYear, resolvedDealerName, resolvedDealerCode);
      y = HEADER_H + 6;
      drawColumnHeaders(doc, cols, y);
      y += HEAD_H;
    }

    startPage();

    const totals = {
      count:           records.length,
      miniAcres:       0,
      miniFarmerShare: 0,
      dripAcres:       0,
      dripFarmerShare: 0,
      hdpeAcres:       0,
      hdpeFarmerShare: 0,
    };

    // ✅ Sort records by date before processing
    const sortedRecords = sortByDate(records);

    for (let rowIdx = 0; rowIdx < sortedRecords.length; rowIdx++) {
      if (y + ROW_H > PAGE_H - FOOTER_H - 22) {
        drawFooter(doc, pageNum++);
        startPage();
      }

      const rec = sortedRecords[rowIdx];
      totals.miniAcres       += Number(rec.miniAcres)       || 0;
      totals.miniFarmerShare += Number(rec.miniFarmerShare) || 0;
      totals.dripAcres       += Number(rec.dripAcres)       || 0;
      totals.dripFarmerShare += Number(rec.dripFarmerShare) || 0;
      totals.hdpeAcres       += Number(rec.hdpeAcres)       || 0;
      totals.hdpeFarmerShare += Number(rec.hdpeFarmerShare) || 0;

      const vals = withDealer
        ? [
            String(rowIdx + 1),
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
            String(rowIdx + 1),
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

      drawRow(doc, cols, y, rowIdx, vals);
      y += ROW_H;
    }

    if (y + 80 > PAGE_H - FOOTER_H - 4) {
      drawFooter(doc, pageNum++);
      startPage();
    }

    const drawn = drawOverallSummaryBox(doc, y, totals);
    if (!drawn) {
      drawFooter(doc, pageNum++);
      startPage();
      drawOverallSummaryBox(doc, y, totals);
    }

    drawFooter(doc, pageNum);
    doc.end();

  } catch (err) {
    console.error("MaterialDispatched PDF error:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate Material Dispatched PDF" });
    }
  }
}