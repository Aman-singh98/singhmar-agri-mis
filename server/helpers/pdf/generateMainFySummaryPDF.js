
import PDFDocument from "pdfkit";

const PAGE_W  = 841.89;  // A4 landscape
const PAGE_H  = 595.28;
const MARGIN  = 20;
const CW      = PAGE_W - 2 * MARGIN;
const FOOTER_H = 18;

// ── Group definitions ─────────────────────────────────────────────────────────
const GROUPS = [
   { label: "Files",        cols: 4 },
   { label: "Estimate",     cols: 5 },
   { label: "Farmer Share", cols: 4 },
   { label: "Bill Status",  cols: 3 },
   { label: "PV Status",    cols: 3 },
];

const DATA_COLS = [
   // Files
   { label: "Total\nFiles",         key: "totalFiles",       w: 28 },
   { label: "Verified",             key: "verified",         w: 28 },
   { label: "Pending",              key: "pending",          w: 28,  red: true },
   { label: "Objection",            key: "objection",        w: 28,  red: true },
   // Estimate
   { label: "Est.\nSubmitted",      key: "estSubmitted",     w: 28 },
   { label: "Est.\nApproved",       key: "estApproved",      w: 28 },
   { label: "Dept\nPending",        key: "estDeptPending",   w: 28,  red: true },
   { label: "Yet to\nSubmit",       key: "estYetToSubmit",   w: 28,  red: true },
   { label: "MI Survey\nPending",   key: "miSurveyPending",  w: 30 },
   // Farmer Share
   { label: "Challan\nGen.",        key: "challanGen",       w: 28 },
   { label: "FS\nReceived",         key: "fsReceived",       w: 28 },
   { label: "Payment\nPend.",       key: "fsPaymentPending", w: 28,  red: true },
   { label: "Share\nGen.Pend.",     key: "fsGenPending",     w: 30,  red: true },
   // Bill Status
   { label: "Tally\nBill",         key: "tallyBill",        w: 28 },
   { label: "Bill\nUploaded",      key: "billUploaded",     w: 28 },
   { label: "Tally\nPending",      key: "tallyPending",     w: 28,  red: true },
   // PV Status
   { label: "PV\nDone",            key: "pvDone",           w: 28 },
   { label: "PV\nPending",         key: "pvPending",        w: 28,  red: true },
   { label: "XEN\nPending",        key: "xenPending",       w: 28,  red: true },
];

// ── Daily Progress Groups and Columns ──────────────────────────────────────────
const DP_GROUPS = [
   { label: "MICADA Progress",  cols: 4 },
   { label: "Staff Progress",   cols: 5 },
   { label: "Field Progress",   cols: 2 },
];

const DP_COLS = [
   // MICADA Progress
   { label: "Verified",          key: "dpVerified",      w: 28 },
   { label: "Pending",           key: "dpPending",       w: 28,  red: true },
   { label: "In-Complete",       key: "dpInComplete",    w: 28,  red: true },
   { label: "Est.\nApproved",    key: "dpEstApproved",   w: 28 },
   // Staff Progress
   { label: "New\nFile",         key: "dpNewFile",       w: 28 },
   { label: "Est.\nSubmitted",   key: "dpEstSubmitted",  w: 28 },
   { label: "Challan\nGen.",     key: "dpChallanGen",    w: 28 },
   { label: "Tally\nBill",       key: "dpTallyBill",     w: 28 },
   { label: "Bill\nUploaded",    key: "dpBillUploaded",  w: 28 },
   // Field Progress
   { label: "Site\nVerified",    key: "dpSiteVerified",  w: 30 },
   { label: "MI\nSurvey",        key: "dpMiSurvey",      w: 30 },
];

const BRANDS      = ["NEER SHAKTI", "MOONGIPA", "ADS"];
const BRAND_COL_W = 56;
const ROW_H       = 14;
const HEAD1_H     = 14;
const HEAD2_H     = 22;
const HEADER_H    = 52;

function today() { return new Date().toLocaleDateString("en-IN"); }
function fileDate() { return new Date().toISOString().split("T")[0]; }

function fmt(val) {
   if (val === null || val === undefined) return "0";
   return Number(val).toLocaleString("en-IN");
}

// ── Compute column X positions ─────────────────────────────────────────────────
function buildColPositions(colDefinitions = DATA_COLS) {
   // Scale colDefinitions to fit CW - BRAND_COL_W
   const available = CW - BRAND_COL_W;
   const rawTotal  = colDefinitions.reduce((s, c) => s + c.w, 0);
   const scale     = available / rawTotal;

   const cols = colDefinitions.map(c => ({ ...c, w: Math.round(c.w * scale) }));

   // Fix rounding drift
   const used = cols.reduce((s, c) => s + c.w, 0);
   cols[cols.length - 1].w += available - used;

   return cols;
}

// ── Group header colors (grayscale for B&W PDF) ───────────────────────────────
const GROUP_COLORS = ["#DDEEFF", "#FFEEDD", "#DDEECC", "#EEEEFF", "#FFEEEE"];
const GROUP_TEXT   = ["#003366", "#663300", "#224400", "#333388", "#661100"];

// ── Daily Progress colors ──────────────────────────────────────────────────────
const DP_GROUP_COLORS = ["#FFE6CC", "#FFD4B3", "#C8E6C9"];
const DP_GROUP_TEXT   = ["#CC6600", "#CC7722", "#2E7D32"];

// ── Header ────────────────────────────────────────────────────────────────────
function drawHeader(doc, date) {
   doc.font("Helvetica-Bold").fontSize(13).fillColor("#000000")
      .text("Main FY Sheet — Today Summary", MARGIN, 10, { lineBreak: false });

   doc.font("Helvetica").fontSize(8).fillColor("#444444")
      .text(`Date: ${date}`, MARGIN, 28, { lineBreak: false });

   doc.font("Helvetica").fontSize(7).fillColor("#444444")
      .text(`Generated: ${today()}`, 0, 28,
         { align: "right", width: PAGE_W - MARGIN, lineBreak: false });

   doc.moveTo(MARGIN, HEADER_H - 4)
      .lineTo(MARGIN + CW, HEADER_H - 4)
      .strokeColor("#000000").lineWidth(0.6).stroke();
}

// ── Footer ────────────────────────────────────────────────────────────────────
function drawFooter(doc, pageNum) {
   const fy = PAGE_H - FOOTER_H;
   doc.moveTo(MARGIN, fy).lineTo(MARGIN + CW, fy)
      .strokeColor("#AAAAAA").lineWidth(0.3).stroke();
   doc.font("Helvetica").fontSize(7).fillColor("#666666")
      .text(`Page ${pageNum}`, MARGIN, fy + 4,
         { width: CW, align: "center", lineBreak: false });
}

// ── Draw one summary section (In Nos / In Acre) ───────────────────────────────
function drawSection(doc, cols, brandRows, startY, mode, title) {
   const isAcre = mode === "acre";
   let y = startY;

   // Section title
   doc.save()
      .rect(MARGIN, y, CW, 12)
      .fillColor("#2D5A1B").fill().restore();
   doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#FFFFFF")
      .text(title, MARGIN + 4, y + 2.5, { lineBreak: false });
   y += 12;

   // ── Group header row ──────────────────────────────────────────────────────
   // Brand cell
   doc.save().rect(MARGIN, y, BRAND_COL_W, HEAD1_H)
      .fillColor("#EEEEEE").fill().restore();
   doc.rect(MARGIN, y, BRAND_COL_W, HEAD1_H)
      .strokeColor("#AAAAAA").lineWidth(0.3).stroke();
   doc.font("Helvetica-Bold").fontSize(6).fillColor("#333333")
      .text("BRAND", MARGIN + 2, y + (HEAD1_H - 6) / 2,
         { width: BRAND_COL_W - 4, align: "left", lineBreak: false });

   let gx = MARGIN + BRAND_COL_W;
   let ci = 0;
   GROUPS.forEach((g, gi) => {
      const gw = cols.slice(ci, ci + g.cols).reduce((s, c) => s + c.w, 0);
      doc.save().rect(gx, y, gw, HEAD1_H)
         .fillColor(GROUP_COLORS[gi]).fill().restore();
      doc.rect(gx, y, gw, HEAD1_H)
         .strokeColor("#AAAAAA").lineWidth(0.3).stroke();
      doc.font("Helvetica-Bold").fontSize(6.5).fillColor(GROUP_TEXT[gi])
         .text(g.label, gx + 2, y + (HEAD1_H - 6.5) / 2,
            { width: gw - 4, align: "center", lineBreak: false });
      gx += gw;
      ci += g.cols;
   });
   y += HEAD1_H;

   // ── Column header row ─────────────────────────────────────────────────────
   doc.save().rect(MARGIN, y, BRAND_COL_W, HEAD2_H)
      .fillColor("#F5F5F5").fill().restore();
   doc.rect(MARGIN, y, BRAND_COL_W, HEAD2_H)
      .strokeColor("#AAAAAA").lineWidth(0.3).stroke();

   let cx = MARGIN + BRAND_COL_W;
   cols.forEach((col, i) => {
      doc.save().rect(cx, y, col.w, HEAD2_H)
         .fillColor("#F5F5F5").fill().restore();
      doc.rect(cx, y, col.w, HEAD2_H)
         .strokeColor("#AAAAAA").lineWidth(0.3).stroke();
      doc.font("Helvetica-Bold").fontSize(5).fillColor(col.red ? "#CC0000" : "#444444")
         .text(col.label, cx + 1, y + 2,
            { width: col.w - 2, align: "center", lineBreak: true, height: HEAD2_H - 4 });
      cx += col.w;
   });
   y += HEAD2_H;

   // ── Compute totals ────────────────────────────────────────────────────────
   const totals = {};
   cols.forEach(col => {
      const k = isAcre ? col.key + "Acre" : col.key;
      totals[k] = brandRows.reduce((s, r) => s + (Number(r[k]) || 0), 0);
   });

   // ── Brand rows ────────────────────────────────────────────────────────────
   brandRows.forEach((row, ri) => {
      const bg = ri % 2 === 0 ? "#FFFFFF" : "#F9F9F9";

      // Brand cell
      doc.save().rect(MARGIN, y, BRAND_COL_W, ROW_H)
         .fillColor(bg).fill().restore();
      doc.rect(MARGIN, y, BRAND_COL_W, ROW_H)
         .strokeColor("#CCCCCC").lineWidth(0.3).stroke();
      doc.font("Helvetica-Bold").fontSize(6).fillColor("#222222")
         .text(row.brand, MARGIN + 3, y + (ROW_H - 6) / 2,
            { width: BRAND_COL_W - 6, lineBreak: false });

      // Data cells
      let dx = MARGIN + BRAND_COL_W;
      cols.forEach(col => {
         const k    = isAcre ? col.key + "Acre" : col.key;
         const val  = fmt(row[k]);
         const color = col.red ? "#CC0000" : "#111111";

         doc.save().rect(dx, y, col.w, ROW_H)
            .fillColor(bg).fill().restore();
         doc.rect(dx, y, col.w, ROW_H)
            .strokeColor("#CCCCCC").lineWidth(0.3).stroke();
         doc.font("Helvetica").fontSize(5.5).fillColor(color)
            .text(val, dx + 1, y + (ROW_H - 5.5) / 2,
               { width: col.w - 2, align: "center", lineBreak: false });
         dx += col.w;
      });
      y += ROW_H;
   });

   // ── Total row ─────────────────────────────────────────────────────────────
   doc.save().rect(MARGIN, y, BRAND_COL_W, ROW_H)
      .fillColor("#DFF0D8").fill().restore();
   doc.rect(MARGIN, y, BRAND_COL_W, ROW_H)
      .strokeColor("#AAAAAA").lineWidth(0.4).stroke();
   doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#1A5C0A")
      .text("Total", MARGIN + 3, y + (ROW_H - 6.5) / 2,
         { width: BRAND_COL_W - 6, lineBreak: false });

   let tx = MARGIN + BRAND_COL_W;
   cols.forEach(col => {
      const k   = isAcre ? col.key + "Acre" : col.key;
      const val = fmt(totals[k]);

      doc.save().rect(tx, y, col.w, ROW_H)
         .fillColor("#DFF0D8").fill().restore();
      doc.rect(tx, y, col.w, ROW_H)
         .strokeColor("#AAAAAA").lineWidth(0.4).stroke();
      doc.font("Helvetica-Bold").fontSize(5.5).fillColor("#1A5C0A")
         .text(val, tx + 1, y + (ROW_H - 5.5) / 2,
            { width: col.w - 2, align: "center", lineBreak: false });
      tx += col.w;
   });
   y += ROW_H;

   return y; // return next Y position
}

// ── Draw Daily Progress section ────────────────────────────────────────────────
function drawDailyProgressSection(doc, cols, dailyBrands, startY, title) {
   let y = startY;

   // Section title
   doc.save()
      .rect(MARGIN, y, CW, 12)
      .fillColor("#F4A460").fill().restore();
   doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#FFFFFF")
      .text(title, MARGIN + 4, y + 2.5, { lineBreak: false });
   y += 12;

   // ── Group header row ──────────────────────────────────────────────────────
   // Brand cell
   doc.save().rect(MARGIN, y, BRAND_COL_W, HEAD1_H)
      .fillColor("#EEEEEE").fill().restore();
   doc.rect(MARGIN, y, BRAND_COL_W, HEAD1_H)
      .strokeColor("#AAAAAA").lineWidth(0.3).stroke();
   doc.font("Helvetica-Bold").fontSize(6).fillColor("#333333")
      .text("BRAND", MARGIN + 2, y + (HEAD1_H - 6) / 2,
         { width: BRAND_COL_W - 4, align: "left", lineBreak: false });

   let gx = MARGIN + BRAND_COL_W;
   let ci = 0;
   DP_GROUPS.forEach((g, gi) => {
      const gw = cols.slice(ci, ci + g.cols).reduce((s, c) => s + c.w, 0);
      doc.save().rect(gx, y, gw, HEAD1_H)
         .fillColor(DP_GROUP_COLORS[gi]).fill().restore();
      doc.rect(gx, y, gw, HEAD1_H)
         .strokeColor("#AAAAAA").lineWidth(0.3).stroke();
      doc.font("Helvetica-Bold").fontSize(6.5).fillColor(DP_GROUP_TEXT[gi])
         .text(g.label, gx + 2, y + (HEAD1_H - 6.5) / 2,
            { width: gw - 4, align: "center", lineBreak: false });
      gx += gw;
      ci += g.cols;
   });
   y += HEAD1_H;

   // ── Column header row ─────────────────────────────────────────────────────
   doc.save().rect(MARGIN, y, BRAND_COL_W, HEAD2_H)
      .fillColor("#F5F5F5").fill().restore();
   doc.rect(MARGIN, y, BRAND_COL_W, HEAD2_H)
      .strokeColor("#AAAAAA").lineWidth(0.3).stroke();

   let cx = MARGIN + BRAND_COL_W;
   cols.forEach((col, i) => {
      doc.save().rect(cx, y, col.w, HEAD2_H)
         .fillColor("#F5F5F5").fill().restore();
      doc.rect(cx, y, col.w, HEAD2_H)
         .strokeColor("#AAAAAA").lineWidth(0.3).stroke();
      doc.font("Helvetica-Bold").fontSize(5).fillColor(col.red ? "#CC0000" : "#444444")
         .text(col.label, cx + 1, y + 2,
            { width: col.w - 2, align: "center", lineBreak: true, height: HEAD2_H - 4 });
      cx += col.w;
   });
   y += HEAD2_H;

   // ── Compute totals ────────────────────────────────────────────────────────
   const totals = {};
   cols.forEach(col => {
      totals[col.key] = dailyBrands.reduce((s, r) => s + (Number(r[col.key]) || 0), 0);
   });

   // ── Brand rows ────────────────────────────────────────────────────────────
   dailyBrands.forEach((row, ri) => {
      const bg = ri % 2 === 0 ? "#FFFFFF" : "#F9F9F9";

      // Brand cell
      doc.save().rect(MARGIN, y, BRAND_COL_W, ROW_H)
         .fillColor(bg).fill().restore();
      doc.rect(MARGIN, y, BRAND_COL_W, ROW_H)
         .strokeColor("#CCCCCC").lineWidth(0.3).stroke();
      doc.font("Helvetica-Bold").fontSize(6).fillColor("#222222")
         .text(row.brand, MARGIN + 3, y + (ROW_H - 6) / 2,
            { width: BRAND_COL_W - 6, lineBreak: false });

      // Data cells
      let dx = MARGIN + BRAND_COL_W;
      cols.forEach(col => {
         const val  = fmt(row[col.key]);
         const color = col.red ? "#CC0000" : "#111111";

         doc.save().rect(dx, y, col.w, ROW_H)
            .fillColor(bg).fill().restore();
         doc.rect(dx, y, col.w, ROW_H)
            .strokeColor("#CCCCCC").lineWidth(0.3).stroke();
         doc.font("Helvetica").fontSize(5.5).fillColor(color)
            .text(val, dx + 1, y + (ROW_H - 5.5) / 2,
               { width: col.w - 2, align: "center", lineBreak: false });
         dx += col.w;
      });
      y += ROW_H;
   });

   // ── Total row ─────────────────────────────────────────────────────────────
   doc.save().rect(MARGIN, y, BRAND_COL_W, ROW_H)
      .fillColor("#E8F5E9").fill().restore();
   doc.rect(MARGIN, y, BRAND_COL_W, ROW_H)
      .strokeColor("#AAAAAA").lineWidth(0.4).stroke();
   doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#1B5E20")
      .text("Total", MARGIN + 3, y + (ROW_H - 6.5) / 2,
         { width: BRAND_COL_W - 6, lineBreak: false });

   let tx = MARGIN + BRAND_COL_W;
   cols.forEach(col => {
      const val = fmt(totals[col.key]);

      doc.save().rect(tx, y, col.w, ROW_H)
         .fillColor("#E8F5E9").fill().restore();
      doc.rect(tx, y, col.w, ROW_H)
         .strokeColor("#AAAAAA").lineWidth(0.4).stroke();
      doc.font("Helvetica-Bold").fontSize(5.5).fillColor("#1B5E20")
         .text(val, tx + 1, y + (ROW_H - 5.5) / 2,
            { width: col.w - 2, align: "center", lineBreak: false });
      tx += col.w;
   });
   y += ROW_H;

   return y; // return next Y position
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function generateMainFySummaryPDF(data, res) {
   try {
      const { date, brandRows, dailyBrands = [] } = data;

      const doc = new PDFDocument({
         size: "A4", layout: "landscape", margin: 0, autoFirstPage: false,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition",
         `attachment; filename="today-summary-${date ?? fileDate()}.pdf"`);
      doc.pipe(res);

      const cols = buildColPositions(DATA_COLS);
      const dpCols = buildColPositions(DP_COLS);

      let pageNum = 1;

      function startPage() {
         doc.addPage({ size: "A4", layout: "landscape", margin: 0 });
         drawHeader(doc, date ?? today());
         return HEADER_H + 6;
      }

      let y = startPage();

      // ── In Nos section ────────────────────────────────────────────────────
      y = drawSection(doc, cols, brandRows, y, "nos", "In Nos");

      y += 10; // gap between sections

      // If not enough space for In Acre, new page
      const acreHeight = 12 + HEAD1_H + HEAD2_H + (brandRows.length + 1) * ROW_H;
      if (y + acreHeight > PAGE_H - FOOTER_H - 10) {
         drawFooter(doc, pageNum++);
         y = startPage();
      }

      // ── In Acre section ───────────────────────────────────────────────────
      y = drawSection(doc, cols, brandRows, y, "acre", "In Acre");

      y += 10; // gap between sections

      // If not enough space for Daily Progress, new page
      const dpHeight = 12 + HEAD1_H + HEAD2_H + (dailyBrands.length + 1) * ROW_H;
      if (y + dpHeight > PAGE_H - FOOTER_H - 10) {
         drawFooter(doc, pageNum++);
         y = startPage();
      }

      // ── Daily Progress section ─────────────────────────────────────────────
      if (dailyBrands.length > 0) {
         y = drawDailyProgressSection(doc, dpCols, dailyBrands, y, "Daily Progress");
      }

      drawFooter(doc, pageNum);
      doc.end();

   } catch (err) {
      console.error("MainFySummary PDF error:", err);
      if (!res.headersSent) {
         res.status(500).json({ message: "Failed to generate Today Summary PDF" });
      }
   }
}