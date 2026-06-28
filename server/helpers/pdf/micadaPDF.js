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
// ci: 0=S.No  1=AppID  2=ProgrammeName  3=FarmerName  4=Village
//     5=Block  6=District  7=Mobile  8=Date  9=Area(Acre)
//     10=CurrentStatus  11=Remarks  12=Status
const BASE_COLS = [
  { label: "S.No",           w: 22,  align: "center" },
  { label: "App ID",         w: 44,  align: "center" },
  { label: "Programme",      w: 56,  align: "left"   },
  { label: "Farmer Name",    w: 60,  align: "left"   },
  { label: "Village",        w: 52,  align: "left"   },
  { label: "Block",          w: 46,  align: "left"   },
  { label: "District",       w: 52,  align: "left"   },
  { label: "Mobile",         w: 52,  align: "center" },
  { label: "Date",           w: 40,  align: "center" },
  { label: "Area (Ac.)",     w: 36,  align: "right"  },
  { label: "Current Status", w: 64,  align: "left"   },
  { label: "Remarks",        w: 110, align: "left"   },
  { label: "Status",         w: 80,  align: "left"   },
];

function buildCols() {
  const cols = BASE_COLS.map(c => ({ ...c, fontSize: FONT_SIZE }));
  const usedW = cols.reduce((s, c) => s + c.w, 0);
  cols[cols.length - 1].w += Math.round(CW - usedW);
  return cols;
}

function computeColX(cols) {
  const xs = [];
  let x = MARGIN;
  for (const c of cols) { xs.push(x); x += c.w; }
  return xs;
}

function safe(v) {
  return v != null && v !== "" ? String(v) : "—";
}

function num2(v) {
  return v != null && !isNaN(Number(v)) ? Number(v).toFixed(2) : "—";
}

function today() {
  return new Date().toLocaleDateString("en-IN");
}

function fileDate() {
  return new Date().toISOString().split("T")[0];
}

function truncate(doc, text, font, size, maxW) {
  doc.font(font).fontSize(size);
  if (doc.widthOfString(text) <= maxW) return text;
  let t = text;
  while (t.length > 0 && doc.widthOfString(t + "…") > maxW) t = t.slice(0, -1);
  return t + "…";
}

function drawHeader(doc, financialYear) {
  doc.moveTo(MARGIN, HEADER_H - 4)
    .lineTo(MARGIN + CW, HEADER_H - 4)
    .strokeColor("#000000").lineWidth(0.8).stroke();

  doc.font("Helvetica-Bold").fontSize(15).fillColor("#000000")
    .text("MICADA Report", MARGIN, 10, { lineBreak: false });

  if (financialYear) {
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#000000")
      .text(`FY: ${financialYear}`, 0, 12, {
        align: "right",
        width: PAGE_W - MARGIN,
        lineBreak: false,
      });
  }

  doc.font("Helvetica").fontSize(7).fillColor("#000000")
    .text(`Generated: ${today()}`, 0, 32, {
      align: "right",
      width: PAGE_W - MARGIN,
      lineBreak: false,
    });
}

function drawFooter(doc, pageNum) {
  const fy = PAGE_H - FOOTER_H;
  doc.moveTo(MARGIN, fy).lineTo(MARGIN + CW, fy)
    .strokeColor("#000000").lineWidth(0.4).stroke();
  doc.font("Helvetica").fontSize(7).fillColor("#000000")
    .text(`Page ${pageNum}`, MARGIN, fy + 4, {
      width: CW,
      align: "center",
      lineBreak: false,
    });
}

function drawColumnHeaders(doc, cols, y) {
  doc.save().rect(MARGIN, y, CW, HEAD_H).fillColor("#EEEEEE").fill().restore();
  doc.rect(MARGIN, y, CW, HEAD_H).strokeColor("#000000").lineWidth(0.5).stroke();

  let x = MARGIN;
  for (const col of cols) {
    doc.font("Helvetica-Bold").fontSize(col.fontSize).fillColor("#000000")
      .text(col.label, x + 2, y + (HEAD_H - col.fontSize) / 2, {
        width: col.w - 4,
        align: col.align,
        lineBreak: false,
      });
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
      .text(text, x + 2, y + (ROW_H - col.fontSize) / 2, {
        width: col.w - 4,
        align: col.align,
        lineBreak: false,
      });
    x += col.w;
  }
}

function drawTotalRow(doc, cols, colX, y, totals) {
  const GT_H = ROW_H + 2;
  const gtY  = y + 4 + (GT_H - 7) / 2;

  doc.save().rect(MARGIN, y + 4, CW, GT_H).fillColor("#EEEEEE").fill().restore();
  doc.rect(MARGIN, y + 4, CW, GT_H).strokeColor("#000000").lineWidth(0.5).stroke();

  const labelW = cols.slice(0, 10).reduce((s, c) => s + c.w, 0) - 8;
  doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#000000")
    .text(
      `TOTAL   ${totals.count} Record${totals.count !== 1 ? "s" : ""}`,
      colX[0] + 4,
      gtY,
      { width: labelW, lineBreak: false },
    );

  doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#000000")
    .text(Number(totals.totalArea).toFixed(2), colX[9] + 2, gtY, {
      width: cols[9].w - 4,
      align: "right",
      lineBreak: false,
    });
}

export async function generateMicadaPDF(records, res, { financialYear } = {}) {
  try {
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 0,
      autoFirstPage: false,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="micada-${fileDate()}.pdf"`,
    );
    doc.pipe(res);

    const cols = buildCols();
    const colX = computeColX(cols);

    let pageNum = 1;
    let y = 0;

    function startPage() {
      doc.addPage({ size: "A4", layout: "landscape", margin: 0 });
      drawHeader(doc, financialYear);
      y = HEADER_H + 6;
      drawColumnHeaders(doc, cols, y);
      y += HEAD_H;
    }

    startPage();

    const totals = {
      count:     records.length,
      totalArea: 0,
    };

    for (let rowIdx = 0; rowIdx < records.length; rowIdx++) {
      if (y + ROW_H > PAGE_H - FOOTER_H - 22) {
        drawFooter(doc, pageNum++);
        startPage();
      }

      const rec = records[rowIdx];
      totals.totalArea += Number(rec.totalArea) || 0;

      drawRow(doc, cols, y, rowIdx, [
        String(rowIdx + 1),          // ci=0  S.No
        safe(rec.appId),             // ci=1  App ID
        safe(rec.programmeName),     // ci=2  Programme Name
        safe(rec.farmerName),        // ci=3  Farmer Name
        safe(rec.village),           // ci=4  Village
        safe(rec.block),             // ci=5  Block
        safe(rec.district),          // ci=6  District
        safe(rec.mobile),            // ci=7  Mobile
        safe(rec.dateOfApplication), // ci=8  Date
        num2(rec.totalArea),         // ci=9  Area (Acre)
        safe(rec.currentStatus),     // ci=10 Current Status
        safe(rec.remarks),           // ci=11 Remarks  (wider col)
        safe(rec.status),            // ci=12 Status   (wider col)
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
    console.error("Micada PDF error:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate Micada PDF" });
    }
  }
}
