
import PDFDocument from "pdfkit";

const PAGE_W   = 595.28;
const PAGE_H   = 841.89;
const MARGIN   = 24;
const CW       = PAGE_W - 2 * MARGIN;
const FOOTER_H = 18;
const ROW_H    = 11;   // reduced from 13
const HEAD_H   = 11;   // reduced from 13
const HEADER_H = 60;

const FONT_SIZE = 5.0;  // unified smaller font size for all columns

// Columns: S.No | Application Id | Farmer Name | Father Name | Village | Type | Acre | Bill No | Bill Value | GST
const BASE_COLS = [
   { label: "S.No",        w: 20,  align: "center" },
   { label: "App. ID",     w: 65,  align: "left"   },
   { label: "Farmer Name", w: 80,  align: "left"   },
   { label: "Father Name", w: 72,  align: "left"   },
   { label: "Village",     w: 54,  align: "left"   },
   { label: "Type",        w: 50,  align: "left"   },
   { label: "Acre",        w: 38,  align: "right"  },
   { label: "Bill No",     w: 60,  align: "left"   },
   { label: "Bill Val.",   w: 60,  align: "right"  },
   { label: "GST",         w: 60,  align: "right"  },
];

function buildCols() {
   const cols = BASE_COLS.map(c => ({ ...c, fontSize: FONT_SIZE }));
   const used = cols.reduce((s, c) => s + c.w, 0);
   // Distribute leftover to Farmer Name (ci=2) to keep Bill Val & GST equal width
   cols[2].w += Math.round(CW - used);
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

function numAcre(v) {
   if (v == null || isNaN(v)) return "—";
   return Number(v).toFixed(2);
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
      .text("Tally Bill Report", MARGIN, 10, { lineBreak: false });

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
      let text  = vals[ci];

      doc.rect(x, y, col.w, ROW_H).strokeColor("#000000").lineWidth(0.3).stroke();

      // Truncate text columns to fit in single row
      text = truncate(doc, text, "Helvetica", col.fontSize, col.w - 4);

      doc.font("Helvetica").fontSize(col.fontSize).fillColor("#000000")
         .text(text, x + 2, y + (ROW_H - col.fontSize) / 2,
            { width: col.w - 4, align: col.align, lineBreak: false });

      x += col.w;
   }
}

// ── Total row ─────────────────────────────────────────────────────────────────
function drawTotalRow(doc, cols, colX, y, totals) {
   const GT_H = ROW_H + 2;
   const gtY  = y + 4 + (GT_H - 7) / 2;

   doc.save().rect(MARGIN, y + 4, CW, GT_H).fillColor("#EEEEEE").fill().restore();
   doc.rect(MARGIN, y + 4, CW, GT_H).strokeColor("#000000").lineWidth(0.5).stroke();

   const labelW = cols.slice(0, 6).reduce((s, c) => s + c.w, 0) - 8;
   doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#000000")
      .text(`TOTAL   ${totals.count} Record${totals.count !== 1 ? "s" : ""}`,
         colX[0] + 4, gtY, { width: labelW, lineBreak: false });

   doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#000000")
      .text(totals.acre.toFixed(2), colX[6] + 2, gtY,
         { width: cols[6].w - 4, align: "right", lineBreak: false });

   for (const ci of [8, 9]) {
      const val = ci === 8 ? totals.billValue : totals.gst;
      doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#000000")
         .text(Math.round(val).toLocaleString("en-IN"), colX[ci] + 2, gtY,
            { width: cols[ci].w - 4, align: "right", lineBreak: false });
   }
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function generateTallyBillPDF(records, res, { financialYear, dealerName, dealerCode } = {}) {
   try {
      const doc = new PDFDocument({
         size: "A4", layout: "portrait", margin: 0, autoFirstPage: false,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition",
         `attachment; filename="tally-bill-${fileDate()}.pdf"`);
      doc.pipe(res);

      const cols = buildCols();
      const colX = computeColX(cols);

      const firstRec = records[0] ?? {};
      const resolvedDealerName = dealerName ?? safe(firstRec.dealerName);
      const resolvedDealerCode = dealerCode ?? safe(firstRec.farmerDealerCode);

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

      const totals = { count: records.length, acre: 0, billValue: 0, gst: 0 };

      for (let rowIdx = 0; rowIdx < records.length; rowIdx++) {
         if (y + ROW_H > PAGE_H - FOOTER_H - 22) {
            drawFooter(doc, pageNum++);
            startPage();
         }

         const rec = records[rowIdx];
         totals.acre      += Number(rec.acre)      || 0;
         totals.billValue += Number(rec.billValue) || 0;
         totals.gst       += Number(rec.gst)       || 0;

         drawRow(doc, cols, y, rowIdx, [
            String(rec.sn ?? rowIdx + 1),
            safe(rec.miNumber),
            safe(rec.farmerName),
            safe(rec.fatherName),
            safe(rec.village),
            safe(rec.type),
            numAcre(rec.acre),
            safe(rec.billNo),
            numIN(rec.billValue),
            numIN(rec.gst),
         ]);
         y += ROW_H;
      }

      if (y + ROW_H + 6 > PAGE_H - FOOTER_H - 12) {
         drawFooter(doc, pageNum++);
         startPage();
      }

      drawTotalRow(doc, cols, colX, y, totals);
      drawFooter(doc, pageNum);
      doc.end();

   } catch (err) {
      console.error("Tally Bill PDF error:", err);
      if (!res.headersSent) {
         res.status(500).json({ message: "Failed to generate Tally Bill PDF" });
      }
   }
}