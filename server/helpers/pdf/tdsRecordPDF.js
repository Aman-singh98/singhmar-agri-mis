
import PDFDocument from "pdfkit";

const PAGE_W   = 595.28;
const PAGE_H   = 841.89;
const MARGIN   = 30;
const CW       = PAGE_W - 2 * MARGIN;
const FOOTER_H = 20;
const ROW_H    = 22;   // ✅ 18 → 22 so wrapped text fits
const HEAD_H   = 18;
const HEADER_H = 60;

// ── Columns WITH dealer name (unfiltered) ────────────────────────────────────
const BASE_COLS_ALL = [
   { label: "S.No",        w: 25,  align: "center", fontSize: 7 },
   { label: "Dealer Name",      w: 90,  align: "left",   fontSize: 7 },
   { label: "Company",     w: 38,  align: "center", fontSize: 7 },
   { label: "Farmer Name", w: 90,  align: "left",   fontSize: 7 },
   { label: "Father Name", w: 80,  align: "left",   fontSize: 7 },
   { label: "Address",     w: 100, align: "left",   fontSize: 7 },
   { label: "PAN No",      w: 62,  align: "left",   fontSize: 7 },
   { label: "TDS",         w: 50,  align: "right",  fontSize: 7 },
];

// ── Columns WITHOUT dealer name (filtered by dealer) ─────────────────────────
const BASE_COLS_DEALER = [
   { label: "S.No",        w: 28,  align: "center", fontSize: 7 },
   { label: "Company",     w: 46,  align: "center", fontSize: 7 },
   { label: "Farmer Name", w: 106, align: "left",   fontSize: 7 },
   { label: "Father Name", w: 96,  align: "left",   fontSize: 7 },
   { label: "Address",     w: 128, align: "left",   fontSize: 7 },
   { label: "PAN No",      w: 64,  align: "left",   fontSize: 7 },
   { label: "TDS",         w: 60,  align: "right",  fontSize: 7 },
];

function buildCols(withDealer) {
   const base = withDealer ? BASE_COLS_ALL : BASE_COLS_DEALER;
   const cols = base.map(c => ({ ...c }));
   const used = cols.reduce((s, c) => s + c.w, 0);
   cols[cols.length - 1].w += Math.round(CW - used);
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

function drawHeader(doc, financialYear, dealerName, dealerCode) {
   const lineY = HEADER_H - 4;
   doc.moveTo(MARGIN, lineY).lineTo(MARGIN + CW, lineY)
      .strokeColor("#000000").lineWidth(0.8).stroke();

   doc.font("Helvetica-Bold").fontSize(15).fillColor("#000000")
      .text("TDS Record Report", MARGIN, 10, { lineBreak: false });

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

function drawFooter(doc, pageNum) {
   const fy = PAGE_H - FOOTER_H;
   doc.moveTo(MARGIN, fy).lineTo(MARGIN + CW, fy)
      .strokeColor("#000000").lineWidth(0.4).stroke();
   doc.font("Helvetica").fontSize(7).fillColor("#000000")
      .text(`Page ${pageNum}`, MARGIN, fy + 5,
         { width: CW, align: "center", lineBreak: false });
}

function drawColumnHeaders(doc, cols, y) {
   doc.save().rect(MARGIN, y, CW, HEAD_H).fillColor("#EEEEEE").fill().restore();
   doc.rect(MARGIN, y, CW, HEAD_H).strokeColor("#000000").lineWidth(0.5).stroke();

   let x = MARGIN;
   for (const col of cols) {
      doc.font("Helvetica-Bold").fontSize(col.fontSize).fillColor("#000000")
         .text(col.label, x + 3, y + (HEAD_H - col.fontSize) / 2,
            { width: col.w - 6, align: col.align, lineBreak: false });
      if (x > MARGIN) {
         doc.moveTo(x, y).lineTo(x, y + HEAD_H)
            .strokeColor("#000000").lineWidth(0.3).stroke();
      }
      x += col.w;
   }
}

function drawRow(doc, cols, y, vals, addressIdx) {
   doc.save().rect(MARGIN, y, CW, ROW_H).fillColor("#FFFFFF").fill().restore();

   let x = MARGIN;
   for (let ci = 0; ci < cols.length; ci++) {
      const col = cols[ci];
      let text  = vals[ci];

      doc.rect(x, y, col.w, ROW_H).strokeColor("#000000").lineWidth(0.4).stroke();

      // ✅ Address column truncate karo
      if (ci === addressIdx) {
         text = truncate(doc, text, "Helvetica", col.fontSize, col.w - 8);
      }

      doc.font("Helvetica").fontSize(col.fontSize).fillColor("#000000")
         .text(text, x + 4, y + (ROW_H - col.fontSize) / 2,
            { width: col.w - 8, align: col.align, lineBreak: false });

      x += col.w;
   }
}

function drawTotalRow(doc, cols, colX, y, totals) {
   const GT_H = ROW_H + 2;
   const gtY  = y + 4 + (GT_H - 7) / 2;
   const lastIdx = cols.length - 1;

   doc.save().rect(MARGIN, y + 4, CW, GT_H).fillColor("#EEEEEE").fill().restore();
   doc.rect(MARGIN, y + 4, CW, GT_H).strokeColor("#000000").lineWidth(0.5).stroke();

   const labelW = cols.slice(0, lastIdx).reduce((s, c) => s + c.w, 0) - 8;
   doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000")
      .text(`TOTAL   ${totals.count} Record${totals.count !== 1 ? "s" : ""}`,
         colX[0] + 4, gtY, { width: labelW, lineBreak: false });

   doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000")
      .text(Math.round(totals.tds).toLocaleString("en-IN"), colX[lastIdx] + 4, gtY,
         { width: cols[lastIdx].w - 8, align: "right", lineBreak: false });
}

export async function generateTdsRecordPDF(records, res, { financialYear, dealerName, dealerCode } = {}) {
   try {
      const sorted = [...records].sort((a, b) => (a.srNo ?? 0) - (b.srNo ?? 0));

      const resolvedDealerName = dealerName && dealerName !== "—" ? dealerName : null;
      const resolvedDealerCode = dealerCode && dealerCode !== "—" ? dealerCode : null;

      // ✅ dealer filter laga hai toh dealer column nahi, warna hoga
      const withDealer = !resolvedDealerName;

      const doc = new PDFDocument({
         size: "A4", layout: "portrait", margin: 0, autoFirstPage: false,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition",
         `attachment; filename="tds-record-${fileDate()}.pdf"`);
      doc.pipe(res);

      const cols = buildCols(withDealer);
      const colX = computeColX(cols);

      // Address column index — withDealer: 5, without: 4
      const addressIdx = withDealer ? 5 : 4;

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

      const totals = { count: sorted.length, tds: 0 };

      for (let rowIdx = 0; rowIdx < sorted.length; rowIdx++) {
         if (y + ROW_H > PAGE_H - FOOTER_H - 22) {
            drawFooter(doc, pageNum++);
            startPage();
         }

         const rec = sorted[rowIdx];
         totals.tds += Number(rec.tds) || 0;

         // ✅ withDealer: dealer column bhi include karo
         const vals = withDealer
            ? [
               String(rec.srNo ?? rowIdx + 1),
               safe(rec.dealerName),
               safe(rec.company),
               safe(rec.farmerName),
               safe(rec.fatherName),
               safe(rec.address),
               safe(rec.panNo),
               numIN(rec.tds),
            ]
            : [
               String(rec.srNo ?? rowIdx + 1),
               safe(rec.company),
               safe(rec.farmerName),
               safe(rec.fatherName),
               safe(rec.address),
               safe(rec.panNo),
               numIN(rec.tds),
            ];

         drawRow(doc, cols, y, vals, addressIdx);
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
      console.error("TDS Record PDF error:", err);
      if (!res.headersSent) {
         res.status(500).json({ message: "Failed to generate TDS Record PDF" });
      }
   }
}