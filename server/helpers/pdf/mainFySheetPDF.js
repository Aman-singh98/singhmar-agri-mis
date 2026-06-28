
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

// Columns mapped to schema fields
// ci: 0=S.No 1=ScanNo 2=BrandName 3=MINo 4=Name 5=Father 6=Mobile
//     7=Type 8=Acre 9=Village 10=BillNo 11=BillValue 12=GST
const BASE_COLS = [
   { label: "S.No",       w: 22,  align: "center" },
   { label: "Scan No",    w: 40,  align: "left"   },
   { label: "Brand Name", w: 44,  align: "left"   },
   { label: "MI No",      w: 44,  align: "left"   },
   { label: "Name",       w: 62,  align: "left"   },
   { label: "Father",     w: 56,  align: "left"   },
   { label: "Mobile",     w: 50,  align: "left"   },
   { label: "Type",       w: 34,  align: "left"   },
   { label: "Acre",       w: 28,  align: "right"  },
   { label: "Village",    w: 50,  align: "left"   },
   { label: "Bill No",    w: 42,  align: "left"   },
   { label: "Bill Value", w: 46,  align: "right"  },
   { label: "GST",        w: 32,  align: "right"  },
];

function buildCols() {
   const cols = BASE_COLS.map(c => ({ ...c, fontSize: FONT_SIZE }));
   const colW = Math.floor(CW / cols.length);
   const remainder = Math.round(CW - colW * cols.length);
   cols.forEach((c, i) => { c.w = colW + (i < remainder ? 1 : 0); });
   return cols;
}

function computeColX(cols) {
   const xs = [];
   let x = MARGIN;
   for (const c of cols) { xs.push(x); x += c.w; }
   return xs;
}

function safe(v)  { return v != null && v !== "" ? String(v) : "—"; }
function num2(v)  { return v != null && !isNaN(v) ? Number(v).toFixed(2) : "—"; }
function numIN(v) { return v != null && !isNaN(v) ? Math.round(Number(v)).toLocaleString("en-IN") : "—"; }

function formatDate(val) {
   if (!val) return "—";
   const d = new Date(val);
   if (isNaN(d.getTime())) return "—";
   return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
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
      .text("Main FY Sheet Report", MARGIN, 10, { lineBreak: false });

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

// ── Total row ─────────────────────────────────────────────────────────────────
function drawTotalRow(doc, cols, colX, y, totals) {
   const GT_H = ROW_H + 2;
   const gtY  = y + 4 + (GT_H - 7) / 2;

   doc.save().rect(MARGIN, y + 4, CW, GT_H).fillColor("#EEEEEE").fill().restore();
   doc.rect(MARGIN, y + 4, CW, GT_H).strokeColor("#000000").lineWidth(0.5).stroke();

   // Label spans cols 0–9
   const labelW = cols.slice(0, 10).reduce((s, c) => s + c.w, 0) - 8;
   doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#000000")
      .text(`TOTAL   ${totals.count} Record${totals.count !== 1 ? "s" : ""}`,
         colX[0] + 4, gtY, { width: labelW, lineBreak: false });

   // Numeric totals: Acre(ci=8), BillValue(ci=11), GST(ci=12)
   const numCols = [
      { ci: 8,  val: totals.areaInAcre, fmt: v => Number(v).toFixed(2)                        },
      { ci: 11, val: totals.billValue,  fmt: v => Math.round(Number(v)).toLocaleString("en-IN") },
      { ci: 12, val: totals.gst,        fmt: v => Math.round(Number(v)).toLocaleString("en-IN") },
   ];
   for (const { ci, val, fmt } of numCols) {
      doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#000000")
         .text(fmt(val), colX[ci] + 2, gtY,
            { width: cols[ci].w - 4, align: "right", lineBreak: false });
   }
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function generateMainFySheetPDF(records, res, { financialYear, dealerName, dealerCode } = {}) {
   try {
      const doc = new PDFDocument({
         size: "A4", layout: "landscape", margin: 0, autoFirstPage: false,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition",
         `attachment; filename="main-fysheet-${fileDate()}.pdf"`);
      doc.pipe(res);

      const cols = buildCols();
      const colX = computeColX(cols);

      const firstRec = records[0] ?? {};
      const resolvedDealerName = dealerName ?? safe(firstRec.dealerName);
      const resolvedDealerCode = dealerCode ?? safe(firstRec.farmerDealerCode);

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
         count:      records.length,
         areaInAcre: 0,
         billValue:  0,
         gst:        0,
      };

      for (let rowIdx = 0; rowIdx < records.length; rowIdx++) {
         if (y + ROW_H > PAGE_H - FOOTER_H - 22) {
            drawFooter(doc, pageNum++);
            startPage();
         }

         const rec = records[rowIdx];
         totals.areaInAcre += Number(rec.areaInAcre) || 0;
         totals.billValue  += Number(rec.billValue)  || 0;
         totals.gst        += Number(rec.gst)        || 0;

         drawRow(doc, cols, y, rowIdx, [
            String(rec.srNo ?? rowIdx + 1),    // ci=0  S.No
            safe(rec.scanNo),                  // ci=1  Scan No
            safe(rec.brandName),               // ci=2  Brand Name
            safe(rec.miNumber),                // ci=3  MI No
            safe(rec.name),                    // ci=4  Name
            safe(rec.fatherName),              // ci=5  Father
            safe(rec.mobileNo),                // ci=6  Mobile
            safe(rec.type),                    // ci=7  Type
            num2(rec.areaInAcre),              // ci=8  Acre
            safe(rec.village),                 // ci=9  Village
            safe(rec.billNo),                  // ci=10 Bill No
            numIN(rec.billValue),              // ci=11 Bill Value
            numIN(rec.gst),                    // ci=12 GST
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
      console.error("Main FY Sheet PDF error:", err);
      if (!res.headersSent) {
         res.status(500).json({ message: "Failed to generate Main FY Sheet PDF" });
      }
   }
}