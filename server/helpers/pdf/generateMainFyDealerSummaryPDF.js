import PDFDocument from "pdfkit";

const PAGE_W  = 841.89;  // A4 landscape
const PAGE_H  = 595.28;
const MARGIN  = 20;
const CW      = PAGE_W - 2 * MARGIN;
const FOOTER_H = 18;

const GROUPS = [
   { label: "Files",        cols: 4 },
   { label: "Estimate",     cols: 5 },
   { label: "Farmer Share", cols: 4 },
   { label: "Bill Status",  cols: 3 },
   { label: "PV Status",    cols: 3 },
];

const DATA_COLS = [
   { label: "Total\nFiles",         key: "totalFiles",       w: 28 },
   { label: "Verified",             key: "verified",         w: 28 },
   { label: "Pending",              key: "pending",          w: 28, red: true },
   { label: "Objection",            key: "objection",        w: 28, red: true },
   { label: "Est.\nSubmitted",      key: "estSubmitted",     w: 28 },
   { label: "Est.\nApproved",       key: "estApproved",      w: 28 },
   { label: "Dept\nPending",        key: "estDeptPending",   w: 28, red: true },
   { label: "Yet to\nSubmit",       key: "estYetToSubmit",   w: 28, red: true },
   { label: "MI Survey\nPending",   key: "miSurveyPending",  w: 30 },
   { label: "Challan\nGen.",        key: "challanGen",       w: 28 },
   { label: "FS\nReceived",         key: "fsReceived",       w: 28 },
   { label: "Payment\nPend.",       key: "fsPaymentPending", w: 28, red: true },
   { label: "Share\nGen.Pend.",     key: "fsGenPending",     w: 30, red: true },
   { label: "Tally\nBill",         key: "tallyBill",        w: 28 },
   { label: "Bill\nUploaded",      key: "billUploaded",     w: 28 },
   { label: "Tally\nPending",      key: "tallyPending",     w: 28, red: true },
   { label: "PV\nDone",            key: "pvDone",           w: 28 },
   { label: "PV\nPending",         key: "pvPending",        w: 28, red: true },
   { label: "XEN\nPending",        key: "xenPending",       w: 28, red: true },
];

const GROUP_COLORS = ["#DDEEFF", "#FFEEDD", "#DDEECC", "#EEEEFF", "#FFEEEE"];
const GROUP_TEXT   = ["#003366", "#663300", "#224400", "#333388", "#661100"];

const DEALER_NAME_W = 72;
const DEALER_CODE_W = 36;
const IDENTITY_W    = DEALER_NAME_W + DEALER_CODE_W;

const ROW_H   = 14;
const HEAD1_H = 14;
const HEAD2_H = 22;
const HEADER_H = 52;

const FONT_SIZE_NAME = 5.5;
const NAME_INNER_W   = DEALER_NAME_W - 6;
const LINE_H = FONT_SIZE_NAME * 1.4;
const V_PAD  = 4;

function today()    { return new Date().toLocaleDateString("en-IN"); }
function fileDate() { return new Date().toISOString().split("T")[0]; }
function fmt(val) {
   if (val === null || val === undefined) return "0";
   return Number(val).toLocaleString("en-IN");
}

function buildColPositions() {
   const available = CW - IDENTITY_W;
   const rawTotal  = DATA_COLS.reduce((s, c) => s + c.w, 0);
   const scale     = available / rawTotal;
   const cols      = DATA_COLS.map(c => ({ ...c, w: Math.round(c.w * scale) }));
   const used      = cols.reduce((s, c) => s + c.w, 0);
   cols[cols.length - 1].w += available - used;
   return cols;
}

function drawHeader(doc, date, mode) {
   const modeLabel = mode === "acre" ? "In Acre" : "In Nos";
   doc.font("Helvetica-Bold").fontSize(13).fillColor("#000000")
      .text(`Dealer Summary — ${modeLabel}`, MARGIN, 10, { lineBreak: false });
   doc.font("Helvetica").fontSize(8).fillColor("#444444")
      .text(`Date: ${date}`, MARGIN, 28, { lineBreak: false });
   doc.font("Helvetica").fontSize(7).fillColor("#444444")
      .text(`Generated: ${today()}`, 0, 28,
         { align: "right", width: PAGE_W - MARGIN, lineBreak: false });
   doc.moveTo(MARGIN, HEADER_H - 4)
      .lineTo(MARGIN + CW, HEADER_H - 4)
      .strokeColor("#000000").lineWidth(0.6).stroke();
}

function drawFooter(doc, pageNum) {
   const fy = PAGE_H - FOOTER_H;
   doc.moveTo(MARGIN, fy).lineTo(MARGIN + CW, fy)
      .strokeColor("#AAAAAA").lineWidth(0.3).stroke();
   doc.font("Helvetica").fontSize(7).fillColor("#666666")
      .text(`Page ${pageNum}`, MARGIN, fy + 4,
         { width: CW, align: "center", lineBreak: false });
}

// ── Estimate row height for a dealer name ─────────────────────────────────────
function estimateRowH(doc, name) {
   doc.font("Helvetica-Bold").fontSize(FONT_SIZE_NAME);
   const totalWidth = doc.widthOfString(String(name ?? ""));
   const lines = Math.ceil(totalWidth / NAME_INNER_W);
   return Math.max(ROW_H, lines * LINE_H + V_PAD);
}

// ── Draw group + column headers ───────────────────────────────────────────────
function drawTableHeaders(doc, cols, y, title) {
   // Section title bar
   doc.save().rect(MARGIN, y, CW, 12).fillColor("#1565C0").fill().restore();
   doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#FFFFFF")
      .text(title, MARGIN + 4, y + 2.5, { lineBreak: false });
   y += 12;

   // Row 1: Group headers
   doc.save().rect(MARGIN, y, DEALER_NAME_W, HEAD1_H).fillColor("#EEEEEE").fill().restore();
   doc.rect(MARGIN, y, DEALER_NAME_W, HEAD1_H).strokeColor("#AAAAAA").lineWidth(0.3).stroke();
   doc.font("Helvetica-Bold").fontSize(5.5).fillColor("#333333")
      .text("DEALER NAME", MARGIN + 2, y + (HEAD1_H - 5.5) / 2,
         { width: DEALER_NAME_W - 4, align: "left", lineBreak: false });

   doc.save().rect(MARGIN + DEALER_NAME_W, y, DEALER_CODE_W, HEAD1_H).fillColor("#EEEEEE").fill().restore();
   doc.rect(MARGIN + DEALER_NAME_W, y, DEALER_CODE_W, HEAD1_H).strokeColor("#AAAAAA").lineWidth(0.3).stroke();
   doc.font("Helvetica-Bold").fontSize(5.5).fillColor("#333333")
      .text("CODE", MARGIN + DEALER_NAME_W + 2, y + (HEAD1_H - 5.5) / 2,
         { width: DEALER_CODE_W - 4, align: "center", lineBreak: false });

   let gx = MARGIN + IDENTITY_W;
   let ci = 0;
   GROUPS.forEach((g, gi) => {
      const gw = cols.slice(ci, ci + g.cols).reduce((s, c) => s + c.w, 0);
      doc.save().rect(gx, y, gw, HEAD1_H).fillColor(GROUP_COLORS[gi]).fill().restore();
      doc.rect(gx, y, gw, HEAD1_H).strokeColor("#AAAAAA").lineWidth(0.3).stroke();
      doc.font("Helvetica-Bold").fontSize(6.5).fillColor(GROUP_TEXT[gi])
         .text(g.label, gx + 2, y + (HEAD1_H - 6.5) / 2,
            { width: gw - 4, align: "center", lineBreak: false });
      gx += gw;
      ci += g.cols;
   });
   y += HEAD1_H;

   // Row 2: Column headers
   doc.save().rect(MARGIN, y, DEALER_NAME_W, HEAD2_H).fillColor("#F5F5F5").fill().restore();
   doc.rect(MARGIN, y, DEALER_NAME_W, HEAD2_H).strokeColor("#AAAAAA").lineWidth(0.3).stroke();

   doc.save().rect(MARGIN + DEALER_NAME_W, y, DEALER_CODE_W, HEAD2_H).fillColor("#F5F5F5").fill().restore();
   doc.rect(MARGIN + DEALER_NAME_W, y, DEALER_CODE_W, HEAD2_H).strokeColor("#AAAAAA").lineWidth(0.3).stroke();

   let cx = MARGIN + IDENTITY_W;
   cols.forEach(col => {
      doc.save().rect(cx, y, col.w, HEAD2_H).fillColor("#F5F5F5").fill().restore();
      doc.rect(cx, y, col.w, HEAD2_H).strokeColor("#AAAAAA").lineWidth(0.3).stroke();
      doc.font("Helvetica-Bold").fontSize(5).fillColor(col.red ? "#CC0000" : "#444444")
         .text(col.label, cx + 1, y + 2,
            { width: col.w - 2, align: "center", lineBreak: true, height: HEAD2_H - 4 });
      cx += col.w;
   });
   y += HEAD2_H;
   return y;
}

// ── Draw a single data row ────────────────────────────────────────────────────
function drawDataRow(doc, cols, row, ri, y, isAcre) {
   const bg   = ri % 2 === 0 ? "#FFFFFF" : "#F9F9F9";
   const name = String(row.dealerName ?? "");
   const dynH = estimateRowH(doc, name);

   doc.save().rect(MARGIN, y, DEALER_NAME_W, dynH).fillColor(bg).fill().restore();
   doc.rect(MARGIN, y, DEALER_NAME_W, dynH).strokeColor("#CCCCCC").lineWidth(0.3).stroke();
   doc.font("Helvetica-Bold").fontSize(FONT_SIZE_NAME).fillColor("#222222")
      .text(name, MARGIN + 3, y + V_PAD / 2, { width: NAME_INNER_W, lineBreak: true });

   doc.save().rect(MARGIN + DEALER_NAME_W, y, DEALER_CODE_W, dynH).fillColor(bg).fill().restore();
   doc.rect(MARGIN + DEALER_NAME_W, y, DEALER_CODE_W, dynH).strokeColor("#CCCCCC").lineWidth(0.3).stroke();
   doc.font("Helvetica").fontSize(FONT_SIZE_NAME).fillColor("#555555")
      .text(String(row.farmerDealerCode ?? ""),
         MARGIN + DEALER_NAME_W + 2, y + (dynH - FONT_SIZE_NAME) / 2,
         { width: DEALER_CODE_W - 4, align: "center", lineBreak: false });

   let dx = MARGIN + IDENTITY_W;
   cols.forEach(col => {
      const k     = isAcre ? col.key + "Acre" : col.key;
      const val   = fmt(row[k]);
      const color = col.red ? "#CC0000" : "#111111";
      doc.save().rect(dx, y, col.w, dynH).fillColor(bg).fill().restore();
      doc.rect(dx, y, col.w, dynH).strokeColor("#CCCCCC").lineWidth(0.3).stroke();
      doc.font("Helvetica").fontSize(5.5).fillColor(color)
         .text(val, dx + 1, y + (dynH - 5.5) / 2,
            { width: col.w - 2, align: "center", lineBreak: false });
      dx += col.w;
   });
   return y + dynH;
}

// ── Draw total row ────────────────────────────────────────────────────────────
function drawTotalRow(doc, cols, dealerRows, y, isAcre) {
   const totals = {};
   cols.forEach(col => {
      const k = isAcre ? col.key + "Acre" : col.key;
      totals[k] = dealerRows.reduce((s, r) => s + (Number(r[k]) || 0), 0);
   });

   doc.save().rect(MARGIN, y, DEALER_NAME_W, ROW_H).fillColor("#DFF0D8").fill().restore();
   doc.rect(MARGIN, y, DEALER_NAME_W, ROW_H).strokeColor("#AAAAAA").lineWidth(0.4).stroke();
   doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#1A5C0A")
      .text("Total", MARGIN + 3, y + (ROW_H - 6.5) / 2,
         { width: DEALER_NAME_W - 6, lineBreak: false });

   doc.save().rect(MARGIN + DEALER_NAME_W, y, DEALER_CODE_W, ROW_H).fillColor("#DFF0D8").fill().restore();
   doc.rect(MARGIN + DEALER_NAME_W, y, DEALER_CODE_W, ROW_H).strokeColor("#AAAAAA").lineWidth(0.4).stroke();
   doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#1A5C0A")
      .text("—", MARGIN + DEALER_NAME_W + 2, y + (ROW_H - 6.5) / 2,
         { width: DEALER_CODE_W - 4, align: "center", lineBreak: false });

   let tx = MARGIN + IDENTITY_W;
   cols.forEach(col => {
      const k   = isAcre ? col.key + "Acre" : col.key;
      const val = fmt(totals[k]);
      doc.save().rect(tx, y, col.w, ROW_H).fillColor("#DFF0D8").fill().restore();
      doc.rect(tx, y, col.w, ROW_H).strokeColor("#AAAAAA").lineWidth(0.4).stroke();
      doc.font("Helvetica-Bold").fontSize(5.5).fillColor("#1A5C0A")
         .text(val, tx + 1, y + (ROW_H - 5.5) / 2,
            { width: col.w - 2, align: "center", lineBreak: false });
      tx += col.w;
   });
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function generateMainFyDealerSummaryPDF(data, res) {
   try {
      const { date, dealerRows = [], mode = "nos" } = data;
      const isAcre    = mode === "acre";
      const modeLabel = isAcre ? "In Acre" : "In Nos";
      const sectionTitle = `Dealer Summary — ${modeLabel}`;

      const doc = new PDFDocument({
         size: "A4", layout: "landscape", margin: 0, autoFirstPage: false,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition",
         `attachment; filename="dealer-summary-${date ?? fileDate()}.pdf"`);
      doc.pipe(res);

      const cols = buildColPositions();
      const BOTTOM_LIMIT = PAGE_H - FOOTER_H - ROW_H; // reserve space for total row

      let pageNum = 1;
      let y;

      function startPage() {
         doc.addPage({ size: "A4", layout: "landscape", margin: 0 });
         drawHeader(doc, date ?? today(), mode);
         y = HEADER_H + 6;
         // Draw table headers on every page
         y = drawTableHeaders(doc, cols, y, sectionTitle);
      }

      startPage();

      // ── Paginate rows — each row uses its actual dynH ─────────────────────
      for (let ri = 0; ri < dealerRows.length; ri++) {
         const row  = dealerRows[ri];
         const dynH = estimateRowH(doc, row.dealerName);
         const isLast = ri === dealerRows.length - 1;

         // Space needed: this row + (total row if last)
         const spaceNeeded = dynH + (isLast ? ROW_H : 0);

         if (y + spaceNeeded > BOTTOM_LIMIT) {
            // Not enough room — finish this page and start a new one
            drawFooter(doc, pageNum);
            pageNum++;
            startPage();
         }

         y = drawDataRow(doc, cols, row, ri, y, isAcre);
      }

      // Draw total row (always fits — we reserved space above)
      drawTotalRow(doc, cols, dealerRows, y, isAcre);

      drawFooter(doc, pageNum);
      doc.end();

   } catch (err) {
      console.error("Dealer Summary PDF error:", err);
      if (!res.headersSent) {
         res.status(500).json({ message: "Failed to generate Dealer Summary PDF" });
      }
   }
}