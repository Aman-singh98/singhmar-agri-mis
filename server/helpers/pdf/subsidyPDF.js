

import PDFDocument from "pdfkit";

const PAGE_W   = 595.28;
const PAGE_H   = 841.89;
const MARGIN   = 24;
const CW       = PAGE_W - 2 * MARGIN;
const FOOTER_H = 18;
const ROW_H    = 16;
const HEAD_H   = 16;
const HEADER_H = 60;

// Columns: S.No | Village | Application Id | Farmer Name | Father Name | Type | Acre | Assistance | Bill Value
const BASE_COLS = [
   { label: "S.No",           w: 26,  align: "center", fontSize: 6.5 },
   { label: "Village",        w: 62,  align: "left",   fontSize: 6.5 },
   { label: "Application Id", w: 76,  align: "left",   fontSize: 6.5 },
   { label: "Farmer Name",    w: 84,  align: "left",   fontSize: 6.5 },
   { label: "Father Name",    w: 84,  align: "left",   fontSize: 6.5 },
   { label: "Type",           w: 58,  align: "left",   fontSize: 6.5 },
   { label: "Acre",           w: 32,  align: "right",  fontSize: 6.5 },
   { label: "Assistance",     w: 62,  align: "right",  fontSize: 6.5 },
   { label: "Bill Value",     w: 62,  align: "right",  fontSize: 6.5 },
];

function buildCols() {
   const cols = BASE_COLS.map(c => ({ ...c }));
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

// Indian comma format — rounded, no decimals (e.g. 1,04,47,685)
function numIN(v) {
   if (v == null || isNaN(v)) return "—";
   return Math.round(Number(v)).toLocaleString("en-IN");
}

// Acre — 2 decimal places
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
      .text("Subsidy Record Report", MARGIN, 10, { lineBreak: false });

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
         .text(col.label, x + 3, y + (HEAD_H - col.fontSize) / 2,
            { width: col.w - 6, align: col.align, lineBreak: false });
      if (x > MARGIN) {
         doc.moveTo(x, y).lineTo(x, y + HEAD_H)
            .strokeColor("#000000").lineWidth(0.3).stroke();
      }
      x += col.w;
   }
}

// ── Data row ──────────────────────────────────────────────────────────────────
function drawRow(doc, cols, y, rowIdx, vals) {
   // Fill background
   doc.save().rect(MARGIN, y, CW, ROW_H).fillColor("#FFFFFF").fill().restore();

   let x = MARGIN;
   for (let ci = 0; ci < cols.length; ci++) {
      const col = cols[ci];
      let text  = vals[ci];

      // Draw full cell border (all 4 sides) — black
      doc.rect(x, y, col.w, ROW_H).strokeColor("#000000").lineWidth(0.4).stroke();

      // Truncate long text columns: Village(1), Farmer Name(3), Father Name(4), Type(5)
      if (ci === 1 || ci === 3 || ci === 4 || ci === 5) {
         text = truncate(doc, text, "Helvetica", col.fontSize, col.w - 6);
      }

      doc.font("Helvetica").fontSize(col.fontSize).fillColor("#000000")
         .text(text, x + 3, y + (ROW_H - col.fontSize) / 2,
            { width: col.w - 6, align: col.align, lineBreak: false });

      x += col.w;
   }
}

// ── Total row ─────────────────────────────────────────────────────────────────
function drawTotalRow(doc, cols, colX, y, totals) {
   const GT_H = ROW_H + 2;
   const gtY  = y + 4 + (GT_H - 7) / 2;

   doc.save().rect(MARGIN, y + 4, CW, GT_H).fillColor("#EEEEEE").fill().restore();
   doc.rect(MARGIN, y + 4, CW, GT_H).strokeColor("#000000").lineWidth(0.5).stroke();

   // Label spans cols 0–5 (S.No through Type)
   const labelW = cols.slice(0, 6).reduce((s, c) => s + c.w, 0) - 8;
   doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000")
      .text(`TOTAL   ${totals.count} Record${totals.count !== 1 ? "s" : ""}`,
         colX[0] + 4, gtY, { width: labelW, lineBreak: false });

   // Acre total (ci=6)
   doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000")
      .text(totals.acre.toFixed(2), colX[6] + 4, gtY,
         { width: cols[6].w - 8, align: "right", lineBreak: false });

   // Assistance total (ci=7), Bill Value total (ci=8) — Indian comma format
   for (const ci of [7, 8]) {
      const val = ci === 7 ? totals.assistance : totals.billValue;
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000")
         .text(Math.round(val).toLocaleString("en-IN"), colX[ci] + 4, gtY,
            { width: cols[ci].w - 8, align: "right", lineBreak: false });
   }
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function generateSubsidyPDF(records, res, { financialYear, dealerName, dealerCode } = {}) {
   try {
      const doc = new PDFDocument({
         size: "A4", layout: "portrait", margin: 0, autoFirstPage: false,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition",
         `attachment; filename="subsidy-${fileDate()}.pdf"`);
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

      const totals = { count: records.length, acre: 0, assistance: 0, billValue: 0 };

      for (let rowIdx = 0; rowIdx < records.length; rowIdx++) {
         if (y + ROW_H > PAGE_H - FOOTER_H - 22) {
            drawFooter(doc, pageNum++);
            startPage();
         }

         const rec = records[rowIdx];
         totals.acre       += Number(rec.areaInAcre)        || 0;
         totals.assistance += Number(rec.assistanceToBePaid) || 0;
         totals.billValue  += Number(rec.billValue)          || 0;

         drawRow(doc, cols, y, rowIdx, [
            String(rec.sn ?? rowIdx + 1),       // ci=0 S.No
            safe(rec.village),                   // ci=1 Village
            safe(rec.applicationId),             // ci=2 Application Id
            safe(rec.name),                      // ci=3 Farmer Name
            safe(rec.fatherName),                // ci=4 Father Name
            safe(rec.type),                      // ci=5 Type
            numAcre(rec.areaInAcre),             // ci=6 Acre
            numIN(rec.assistanceToBePaid),       // ci=7 Assistance
            numIN(rec.billValue),                // ci=8 Bill Value
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
      console.error("Subsidy PDF error:", err);
      if (!res.headersSent) {
         res.status(500).json({ message: "Failed to generate Subsidy PDF" });
      }
   }
}