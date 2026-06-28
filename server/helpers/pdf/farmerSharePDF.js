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

// Column index reference:
// ci: 0=S.No 1=FarmerName 2=MINo 3=Village
//     4=Acre 5=FarmerShare 6=Share% 7=Deposited 8=Returned
//     9=Status 10=BrandName 11=Mobile 12=Type 13=ScanNo
const BASE_COLS = [
  { label: "S.No",          w: 22,  align: "center" },
  { label: "Farmer Name",   w: 66,  align: "left"   },
  { label: "MI No.",        w: 44,  align: "left"   },
  { label: "Village",       w: 50,  align: "left"   },
  { label: "Acre",          w: 32,  align: "right"  },
  { label: "Farmer Share",  w: 38,  align: "right"  },
  { label: "Share %",       w: 32,  align: "right"  },
  { label: "Deposited",     w: 38,  align: "right"  },
  { label: "Returned",      w: 38,  align: "right"  },
  { label: "Status",        w: 44,  align: "left"   },
  { label: "Brand",         w: 44,  align: "left"   },
  { label: "Mobile",        w: 44,  align: "left"   },
  { label: "Type",          w: 38,  align: "left"   },
  { label: "Scan No",       w: 44,  align: "left"   },
];

function buildCols() {
  const cols = BASE_COLS.map(c => ({
    ...c,
    fontSize: FONT_SIZE,
  }));

  // S.No fixed width
  cols[0].w = 22;

  // Remaining width
  const remainingWidth = CW - cols[0].w;

  // Equal width for all remaining columns
  const equalWidth = Math.floor(
    remainingWidth / (cols.length - 1)
  );

  for (let i = 1; i < cols.length; i++) {
    cols[i].w = equalWidth;
  }

  // Adjust last column to remove rounding difference
  const usedWidth = cols.reduce((sum, col) => sum + col.w, 0);
  cols[cols.length - 1].w += (CW - usedWidth);

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
function today()  { return new Date().toLocaleDateString("en-IN"); }
function fileDate(){ return new Date().toISOString().split("T")[0]; }

function fmtDate(val) {
  if (!val) return "—";
  const d = new Date(val);
  return isNaN(d.getTime()) ? "—"
    : `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
}

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
    .text("Farmer Share Detail Report", MARGIN, 10, { lineBreak: false });

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

  // Label spans cols 0–3
  const labelW = cols.slice(0, 4).reduce((s, c) => s + c.w, 0) - 8;
  doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#000000")
    .text(`TOTAL   ${totals.count} Record${totals.count !== 1 ? "s" : ""}`,
      colX[0] + 4, gtY, { width: labelW, lineBreak: false });

  // Numeric totals at ci=4..8
  const numCols = [
    { ci: 4,  val: totals.areaInAcre         },
    { ci: 5,  val: totals.farmerShare        },
    { ci: 6,  val: totals.farmerSharePercentage },
    { ci: 7,  val: totals.farmerShareDeposit },
    { ci: 8,  val: totals.returnFarmerShare  },
  ];
  for (const { ci, val } of numCols) {
    doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#000000")
      .text(Number(val).toFixed(2), colX[ci] + 2, gtY,
        { width: cols[ci].w - 4, align: "right", lineBreak: false });
  }
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function generateFarmerSharePDF(records, res, { financialYear, dealerName, dealerCode } = {}) {
  try {
    const doc = new PDFDocument({
      size: "A4", layout: "landscape", margin: 0, autoFirstPage: false,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition",
      `attachment; filename="farmer-share-${fileDate()}.pdf"`);
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
      count:                   records.length,
      areaInAcre:              0,
      farmerShare:             0,
      farmerSharePercentage:   0,
      farmerShareDeposit:      0,
      returnFarmerShare:       0,
    };

    for (let rowIdx = 0; rowIdx < records.length; rowIdx++) {
      if (y + ROW_H > PAGE_H - FOOTER_H - 22) {
        drawFooter(doc, pageNum++);
        startPage();
      }

      const rec = records[rowIdx];
      totals.areaInAcre         += Number(rec.areaInAcre)         || 0;
      totals.farmerShare        += Number(rec.farmerShare)        || 0;
      totals.farmerSharePercentage += Number(rec.farmerSharePercentage) || 0;
      totals.farmerShareDeposit += Number(rec.farmerShareDeposit) || 0;
      totals.returnFarmerShare  += Number(rec.returnFarmerShare)  || 0;

      drawRow(doc, cols, y, rowIdx, [
        String(rec.srNo ?? rowIdx + 1),      // ci=0  S.No
        safe(rec.name),                       // ci=1  Farmer Name
        safe(rec.miNumber),                   // ci=2  MI No.
        safe(rec.village),                    // ci=3  Village
        num2(rec.areaInAcre),                 // ci=4  Acre
        num2(rec.farmerShare),                // ci=5  Farmer Share
        rec.farmerSharePercentage != null ? `${rec.farmerSharePercentage}%` : "—",  // ci=6  Share %
        num2(rec.farmerShareDeposit),         // ci=7  Deposited
        num2(rec.returnFarmerShare),          // ci=8  Returned
        safe(rec.onlineFarmerShareStatus),    // ci=9  Status
        safe(rec.brandName),                  // ci=10 Brand
        safe(rec.mobileNo),                   // ci=11 Mobile
        safe(rec.type),                       // ci=12 Type
        safe(rec.scanNo),                     // ci=13 Scan No
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
    console.error("FarmerShare PDF error:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate Farmer Share PDF" });
    }
  }
}