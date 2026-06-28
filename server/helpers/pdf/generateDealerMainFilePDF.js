import PDFDocument from "pdfkit";

// ── Page constants ─────────────────────────────────────────────────────────────
const PAGE_W   = 841.89;   // A4 landscape
const PAGE_H   = 595.28;
const MARGIN   = 24;
const CW       = PAGE_W - 2 * MARGIN;
const FOOTER_H = 18;
const ROW_H    = 11;
const HEAD_H   = 11;
const HEADER_H = 60;
const FONT_SIZE = 5.0;

// ── Columns ────────────────────────────────────────────────────────────────────
const BASE_COLS = [
  { label: "S.No",          w: 22,  align: "center" },
  { label: "Scan No",       w: 40,  align: "left"   },
  { label: "Brand Name",    w: 44,  align: "left"   },
  { label: "Name",          w: 84,  align: "left"   },
  { label: "Father",        w: 56,  align: "left"   },
  { label: "Mobile",        w: 50,  align: "left"   },
  { label: "Dealer",        w: 55,  align: "left"   },
  { label: "Code",          w: 30,  align: "left"   },
  { label: "Address",       w: 97,  align: "left"   },
  { label: "Block",         w: 44,  align: "left"   },
  { label: "District",      w: 50,  align: "left"   },
  { label: "Irrig. Type",   w: 44,  align: "left"   },
  { label: "Acre",          w: 30,  align: "right"  },
  { label: "Family ID",     w: 40,  align: "left"   },
  { label: "Farmer Code",   w: 40,  align: "left"   },
  { label: "MI No",         w: 44,  align: "left"   },
  { label: "App Status",    w: 50,  align: "left"   },
  { label: "Online",        w: 32,  align: "left"   },
];

function buildCols() {
  const cols = BASE_COLS.map(c => ({ ...c, fontSize: FONT_SIZE }));
  const used = cols.reduce((s, c) => s + c.w, 0);
  const leftover = Math.round(CW - used);
  // Distribute leftover to Name (ci=3) and Address (ci=8)
  cols[3].w += Math.floor(leftover / 2);
  cols[8].w += leftover - Math.floor(leftover / 2);
  return cols;
}

function computeColX(cols) {
  const xs = [];
  let x = MARGIN;
  for (const c of cols) { xs.push(x); x += c.w; }
  return xs;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function safe(v)   { return v != null && v !== "" ? String(v) : "—"; }
function num2(v)   { return v != null && !isNaN(v) ? Number(v).toFixed(2) : "—"; }
function today()   { return new Date().toLocaleDateString("en-IN"); }
function fileDate(){ return new Date().toISOString().split("T")[0]; }

function truncate(doc, text, font, size, maxW) {
  doc.font(font).fontSize(size);
  if (doc.widthOfString(text) <= maxW) return text;
  let t = text;
  while (t.length > 0 && doc.widthOfString(t + "…") > maxW) t = t.slice(0, -1);
  return t + "…";
}

// ── Header ─────────────────────────────────────────────────────────────────────
function drawHeader(doc, opts) {
  const { title, financialYear, dealerName, dealerCode, appStatus, recordType } = opts;

  doc.moveTo(MARGIN, HEADER_H - 4).lineTo(MARGIN + CW, HEADER_H - 4)
    .strokeColor("#000000").lineWidth(0.8).stroke();

  // Title
  doc.font("Helvetica-Bold").fontSize(13).fillColor("#000000")
    .text(title || "Main File Report", MARGIN, 8, { lineBreak: false });

  // FY top-right
  if (financialYear) {
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000")
      .text(`FY: ${financialYear}`, 0, 10,
        { align: "right", width: PAGE_W - MARGIN, lineBreak: false });
  }

  // Dealer / Code / Status / Type — line 2
  const parts = [];
  if (dealerName && dealerName !== "—") {
    parts.push(`Dealer: ${dealerName}${dealerCode && dealerCode !== "—" ? `  (${dealerCode})` : ""}`);
  }
  if (appStatus && appStatus !== "All Status") parts.push(`Status: ${appStatus}`);
  if (recordType && recordType !== "all")       parts.push(`Type: ${recordType.toUpperCase()}`);

  if (parts.length > 0) {
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000")
      .text(parts.join("   |   "), MARGIN, 28, { lineBreak: false });
  }

  // Generated date top-right line 2
  doc.font("Helvetica").fontSize(7).fillColor("#000000")
    .text(`Generated: ${today()}`, 0, 30,
      { align: "right", width: PAGE_W - MARGIN, lineBreak: false });

  // Record count line 3
  doc.font("Helvetica").fontSize(7).fillColor("#555555")
    .text(`Total Records: ${opts.totalCount}`, MARGIN, 44, { lineBreak: false });
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function drawFooter(doc, pageNum) {
  const fy = PAGE_H - FOOTER_H;
  doc.moveTo(MARGIN, fy).lineTo(MARGIN + CW, fy)
    .strokeColor("#000000").lineWidth(0.4).stroke();
  doc.font("Helvetica").fontSize(7).fillColor("#000000")
    .text(`Page ${pageNum}`, MARGIN, fy + 4,
      { width: CW, align: "center", lineBreak: false });
}

// ── Column headers ─────────────────────────────────────────────────────────────
function drawColumnHeaders(doc, cols, y) {
  doc.save().rect(MARGIN, y, CW, HEAD_H).fillColor("#DDDDDD").fill().restore();
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

// ── Data row ───────────────────────────────────────────────────────────────────
function drawRow(doc, cols, y, rowIdx, vals) {
  const bg = rowIdx % 2 === 0 ? "#FFFFFF" : "#F8F8F8";
  doc.save().rect(MARGIN, y, CW, ROW_H).fillColor(bg).fill().restore();

  let x = MARGIN;
  for (let ci = 0; ci < cols.length; ci++) {
    const col  = cols[ci];
    const text = truncate(doc, vals[ci] ?? "—", "Helvetica", col.fontSize, col.w - 4);

    doc.rect(x, y, col.w, ROW_H).strokeColor("#CCCCCC").lineWidth(0.3).stroke();

    doc.font("Helvetica").fontSize(col.fontSize).fillColor("#000000")
      .text(text, x + 2, y + (ROW_H - col.fontSize) / 2,
        { width: col.w - 4, align: col.align, lineBreak: false });

    x += col.w;
  }
}

// ── Total row ──────────────────────────────────────────────────────────────────
function drawTotalRow(doc, cols, colX, y, totals) {
  const GT_H = ROW_H + 2;
  const gtY  = y + 4;

  doc.save().rect(MARGIN, gtY, CW, GT_H).fillColor("#EEEEEE").fill().restore();
  doc.rect(MARGIN, gtY, CW, GT_H).strokeColor("#000000").lineWidth(0.5).stroke();

  // Label spans ci 0–11
  const labelW = cols.slice(0, 12).reduce((s, c) => s + c.w, 0) - 8;
  doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#000000")
    .text(`TOTAL   ${totals.count} Record${totals.count !== 1 ? "s" : ""}`,
      colX[0] + 4, gtY + (GT_H - 6.5) / 2, { width: labelW, lineBreak: false });

  // Acre total at ci=12
  doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#000000")
    .text(Number(totals.areaInAcre).toFixed(2), colX[12] + 2, gtY + (GT_H - 6.5) / 2,
      { width: cols[12].w - 4, align: "right", lineBreak: false });
}

// ── Main export ────────────────────────────────────────────────────────────────
/**
 * @param {object} data  - { title, records, financialYear?, dealerName?, appStatus?, recordType? }
 * @param {object} res   - Express response
 */
export async function generateDealerMainFilePDF(data, res) {
  try {
    const {
      title        = "Main File Report",
      records      = [],
      financialYear,
      dealerName,
      appStatus,
      recordType,
    } = data;

    if (!records.length) {
      return res.status(400).json({ message: "No records to export", success: false });
    }

    // Resolve dealer code from first record if not explicitly given
    const dealerCode = records[0]?.["Code"] ?? records[0]?.["Dealer Code"] ?? "—";

    const doc = new PDFDocument({
      size: "A4", layout: "landscape", margin: 0, autoFirstPage: false,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition",
      `attachment; filename="file-records-${fileDate()}.pdf"`);
    doc.pipe(res);

    const cols = buildCols();
    const colX = computeColX(cols);

    let pageNum = 1;
    let y = 0;

    const headerOpts = {
      title,
      financialYear,
      dealerName,
      dealerCode,
      appStatus,
      recordType,
      totalCount: records.length,
    };

    function startPage() {
      doc.addPage({ size: "A4", layout: "landscape", margin: 0 });
      drawHeader(doc, headerOpts);
      y = HEADER_H + 6;
      drawColumnHeaders(doc, cols, y);
      y += HEAD_H;
    }

    startPage();

    const totals = { count: records.length, areaInAcre: 0 };

    for (let rowIdx = 0; rowIdx < records.length; rowIdx++) {
      if (y + ROW_H > PAGE_H - FOOTER_H - 22) {
        drawFooter(doc, pageNum++);
        startPage();
      }

      const r = records[rowIdx];
      totals.areaInAcre += Number(r["Area (Acre)"] ?? r.areaInAcre) || 0;

      drawRow(doc, cols, y, rowIdx, [
        safe(r["Sr No"]          ?? rowIdx + 1),  // ci=0  S.No
        safe(r["Scan No"]        ?? r.scanNo),     // ci=1  Scan No
        safe(r["Brand"]          ?? r.brandName),  // ci=2  Brand Name
        safe(r["Farmer Name"]    ?? r.name),       // ci=3  Name
        safe(r["Father Name"]    ?? r.fatherName), // ci=4  Father
        safe(r["Mobile"]         ?? r.mobileNo),   // ci=5  Mobile
        safe(r["Dealer"]         ?? r.dealerName), // ci=6  Dealer
        safe(r["Code"]           ?? r.farmerDealerCode), // ci=7  Code
        safe(r["Address"]        ?? r.address),    // ci=8  Address
        safe(r["Block"]          ?? r.block),      // ci=9  Block
        safe(r["District"]       ?? r.district),   // ci=10 District
        safe(r["Irrigation Type"]?? r.irrigationType), // ci=11 Irrig.
        num2(r["Area (Acre)"]    ?? r.areaInAcre), // ci=12 Acre
        safe(r["Family ID"]      ?? r.familyId),   // ci=13 Family ID
        safe(r["Farmer Code"]    ?? r.farmerCode), // ci=14 Farmer Code
        safe(r["MI Number"]      ?? r.miNumber),   // ci=15 MI No
        safe(r["Application Status"] ?? r.applicationStatus), // ci=16 App Status
        safe(r["Online Status"]  ?? r.onlineStatus), // ci=17 Online
      ]);
      y += ROW_H;
    }

    // Total row
    if (y + ROW_H + 6 > PAGE_H - FOOTER_H - 12) {
      drawFooter(doc, pageNum++);
      startPage();
    }
    drawTotalRow(doc, cols, colX, y, totals);
    drawFooter(doc, pageNum);
    doc.end();

  } catch (err) {
    console.error("generateDealerMainFilePDF error:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate PDF", success: false });
    }
  }
}