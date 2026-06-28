
import PDFDocument from "pdfkit";

const PAGE_W   = 595.28;
const PAGE_H   = 841.89;
const MARGIN   = 24;
const CW       = PAGE_W - 2 * MARGIN;
const FOOTER_H = 18;
const ROW_H    = 11;
const HEAD_H   = 11;
const HEADER_H = 60;

const FONT_SIZE = 5.0;

// Columns WITH Dealer Name (all dealers view)
const BASE_COLS_ALL = [
   { label: "S.No",        w: 28,  align: "center" },
   { label: "Dealer Name", w: 120, align: "left"   },
   { label: "Amount",      w: 28,  align: "right"  },
];

// Columns WITHOUT Dealer Name (single dealer filter)
const BASE_COLS_DEALER = [
   { label: "S.No",   w: 65, align: "center" },
   { label: "Amount", w: 28, align: "right"  },
];

function buildCols(withDealer) {
   const base = withDealer ? BASE_COLS_ALL : BASE_COLS_DEALER;
   const cols = base.map(c => ({ ...c, fontSize: FONT_SIZE }));
   const used = cols.reduce((s, c) => s + c.w, 0);
   const leftover = Math.round(CW - used);
   // Give all leftover to Amount (last col)
   cols[cols.length - 1].w += leftover;
   return cols;
}

function computeColX(cols) {
   const xs = [];
   let x = MARGIN;
   for (const c of cols) { xs.push(x); x += c.w; }
   return xs;
}

function safe(v) { return v != null && v !== "" ? String(v) : "—"; }

function numIN(v) {
   if (v == null || isNaN(v)) return "—";
   return Math.round(Number(v)).toLocaleString("en-IN");
}

function today()    { return new Date().toLocaleDateString("en-IN"); }
function fileDate() { return new Date().toISOString().split("T")[0]; }

function truncate(doc, text, font, size, maxW) {
   doc.font(font).fontSize(size);
   if (doc.widthOfString(text) <= maxW) return text;
   let t = text;
   while (t.length > 0 && doc.widthOfString(t + "…") > maxW) t = t.slice(0, -1);
   return t + "…";
}

// ── Header ────────────────────────────────────────────────────────────────────
function drawHeader(doc, financialYear, dealerName, dealerCode) {
   doc.moveTo(MARGIN, HEADER_H - 4).lineTo(MARGIN + CW, HEADER_H - 4)
      .strokeColor("#000000").lineWidth(0.8).stroke();

   doc.font("Helvetica-Bold").fontSize(15).fillColor("#000000")
      .text("Adjusted Sheet Report", MARGIN, 10, { lineBreak: false });

   if (financialYear) {
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#000000")
         .text(`FY: ${financialYear}`, 0, 12,
            { align: "right", width: PAGE_W - MARGIN, lineBreak: false });
   }

   const parts = [];
   if (dealerName && dealerName !== "—") parts.push(`Dealer: ${dealerName}`);
   if (dealerCode && dealerCode !== "—") parts.push(`Code: ${dealerCode}`);
   if (parts.length > 0) {
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#000000")
         .text(parts.join("   |   "), MARGIN, 30, { lineBreak: false });
   }

   doc.font("Helvetica").fontSize(7).fillColor("#000000")
      .text(`Generated: ${today()}`, 0, 32,
         { align: "right", width: PAGE_W - MARGIN, lineBreak: false });
}

// ── Footer ────────────────────────────────────────────────────────────────────
function drawFooter(doc, pageNum) {
   const fy = PAGE_H - FOOTER_H;
   doc.moveTo(MARGIN, fy).lineTo(MARGIN + CW, fy)
      .strokeColor("#000000").lineWidth(0.4).stroke();
   doc.font("Helvetica").fontSize(7).fillColor("#000000")
      .text(`Page ${pageNum}`, MARGIN, fy + 4,
         { width: CW, align: "center", lineBreak: false });
}

// ── Column headers ────────────────────────────────────────────────────────────
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

// ── Data row ──────────────────────────────────────────────────────────────────
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

// ── Overall Summary Box — 2 cards: Total Records | Total Amount ───────────────
function drawOverallSummaryBox(doc, y, totals) {
   const BOX_TOP   = y + 14;
   const BOX_H     = 52;
   const CARD_W    = CW / 2;
   const LABEL_FS  = 7;
   const VALUE_FS  = 13;
   const SUBVAL_FS = 7.5;

   if (BOX_TOP + BOX_H + 10 > PAGE_H - FOOTER_H - 4) return false;

   const cards = [
      { label: "Total Records", value: String(totals.count),                          sub: "Records", bg: "#F2F3F4", fs_color: "#2c3e50" },
      { label: "Total Amount",  value: Math.round(totals.amount).toLocaleString("en-IN"), sub: "₹",       bg: "#EBF5FB", fs_color: "#1a5276" },
   ];

   // Fill cards
   for (let i = 0; i < cards.length; i++) {
      const cx = MARGIN + i * CARD_W;
      doc.save().rect(cx, BOX_TOP, CARD_W, BOX_H).fillColor(cards[i].bg).fill().restore();
   }

   // Outer border
   doc.rect(MARGIN, BOX_TOP, CW, BOX_H).strokeColor("#000000").lineWidth(0.6).stroke();

   // Section title (above box)
   doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000")
      .text("Overall Summary", MARGIN, BOX_TOP - 11, { lineBreak: false });

   // Divider between cards
   const midX = MARGIN + CARD_W;
   doc.moveTo(midX, BOX_TOP).lineTo(midX, BOX_TOP + BOX_H)
      .strokeColor("#CCCCCC").lineWidth(0.4).stroke();

   for (let i = 0; i < cards.length; i++) {
      const cx = MARGIN + i * CARD_W;
      const card = cards[i];

      doc.font("Helvetica-Bold").fontSize(LABEL_FS).fillColor("#555555")
         .text(card.label, cx + 4, BOX_TOP + 7,
            { width: CARD_W - 8, align: "center", lineBreak: false });

      doc.font("Helvetica-Bold").fontSize(VALUE_FS).fillColor(card.fs_color)
         .text(card.value, cx + 4, BOX_TOP + 20,
            { width: CARD_W - 8, align: "center", lineBreak: false });

      doc.font("Helvetica").fontSize(SUBVAL_FS).fillColor("#888888")
         .text(card.sub, cx + 4, BOX_TOP + 38,
            { width: CARD_W - 8, align: "center", lineBreak: false });
   }

   // Re-draw border on top
   doc.rect(MARGIN, BOX_TOP, CW, BOX_H).strokeColor("#000000").lineWidth(0.6).stroke();

   return true;
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function generateAdjustedSheetPDF(records, res, { financialYear, dealerName, dealerCode } = {}) {
   try {
      const doc = new PDFDocument({
         size: "A4", layout: "portrait", margin: 0, autoFirstPage: false,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition",
         `attachment; filename="adjusted-sheet-${fileDate()}.pdf"`);
      doc.pipe(res);

      const firstRec = records[0] ?? {};
      const resolvedDealerName = dealerName ?? safe(firstRec.dealerName);
      const resolvedDealerCode = dealerCode ?? safe(firstRec.farmerDealerCode);

      const withDealer = !dealerName;

      const cols = buildCols(withDealer);
      const colX = computeColX(cols);

      let pageNum = 1;
      let y = 0;

      function startPage() {
         doc.addPage({ size: "A4", layout: "portrait", margin: 0 });
         drawHeader(doc, financialYear, resolvedDealerName, resolvedDealerCode);
         y = HEADER_H + 6;
         drawColumnHeaders(doc, cols, y);
         y += HEAD_H;
      }

      startPage();

      const totals = { count: records.length, amount: 0 };

      for (let rowIdx = 0; rowIdx < records.length; rowIdx++) {
         if (y + ROW_H > PAGE_H - FOOTER_H - 22) {
            drawFooter(doc, pageNum++);
            startPage();
         }

         const rec = records[rowIdx];
         totals.amount += Number(rec.amount) || 0;

         const vals = withDealer
            ? [
               String(rowIdx + 1),
               safe(rec.dealerName),
               numIN(rec.amount),
            ]
            : [
               String(rec.sn ?? rowIdx + 1),
               numIN(rec.amount),
            ];
         drawRow(doc, cols, y, rowIdx, vals);
         y += ROW_H;
      }

      // Summary box needs ~80px
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
      console.error("AdjustedSheet PDF error:", err);
      if (!res.headersSent) {
         res.status(500).json({ message: "Failed to generate Adjusted Sheet PDF" });
      }
   }
}