import ExcelJS from "exceljs";

function safe(v) { return v != null && v !== "" ? String(v) : "—"; }
function num2(v) { return v != null && !isNaN(Number(v)) ? Number(Number(v).toFixed(2)) : "—"; }
function today() { return new Date().toLocaleDateString("en-IN"); }

/* ── Colors (exact match with React table) ─────────────────────────────── */
const COLORS = {
  slate900:  'FF0f172a',
  slate700:  'FF334155',
  slate500:  'FF64748b',
  slate400:  'FF94a3b8',
  slate300:  'FFcbd5e1',
  slate200:  'FFe2e8f0',
  slate100:  'FFf1f5f9',
  slate50:   'FFf8fafc',
  white:     'FFFFFFFF',
  green500:  'FF22c55e',
  green100:  'FFdcfce7',
  green700:  'FF15803d',
  red500:    'FFef4444',
  red100:    'FFfee2e2',
  red700:    'FFb91c1c',
  amber500:  'FFf59e0b',
  amber100:  'FFfef3c7',
  amber700:  'FFb45309',
  blue500:   'FF3b82f6',
  blue100:   'FFdbeafe',
  blue700:   'FF1d4ed8',
  yellow50:  'FFfefce8',
  yellow200: 'FFfef08a',
};

/* ── Status meta ─────────────────────────────────────────────────────── */
const STATUS_META = {
  'Matched':     { bg: COLORS.green100,  text: COLORS.green700,  label: 'MATCHED' },
  'Mismatch':    { bg: COLORS.red100,    text: COLORS.red700,    label: 'MISMATCH' },
  'Main Only':   { bg: COLORS.amber100,  text: COLORS.amber700,  label: 'MAIN ONLY' },
  'MICADA Only': { bg: COLORS.blue100,   text: COLORS.blue700,   label: 'MICADA ONLY' },
};

/* ── Row background by status ──────────────────────────────────────────── */
function getRowBg(status, index) {
  switch (status) {
    case 'Mismatch':    return COLORS.red100;
    case 'Main Only':   return COLORS.amber100;
    case 'MICADA Only': return COLORS.blue100;
    default:            return index % 2 === 0 ? COLORS.white : COLORS.slate50;
  }
}

/* ── Check if field has diff ─────────────────────────────────────────── */
function hasDiff(record, fieldLabel) {
  const mainKey = `${fieldLabel} (Main)`;
  const micadaKey = `${fieldLabel} (MICADA)`;
  const mainVal = String(record[mainKey] ?? '').trim().toLowerCase();
  const micadaVal = String(record[micadaKey] ?? '').trim().toLowerCase();
  return mainVal !== micadaVal;
}

export async function generateMainMicadaComparisionRecordsExcel(data) {
  const { title, records } = data;

  if (!Array.isArray(records) || records.length === 0) {
    throw new Error('No records to export');
  }

  const wb = new ExcelJS.Workbook();
  wb.creator = "System";
  wb.created = new Date();
  const ws = wb.addWorksheet("MICADA Comparison");

  // ── Column widths ──────────────────────────────────────────────────────
  ws.columns = [
    { key: "srNo",              width: 7  },
    { key: "miNumberAppId",     width: 16 },
    { key: "status",            width: 14 },
    { key: "farmerNameMain",    width: 22 },
    { key: "farmerNameMicada",  width: 22 },
    { key: "irrigationMain",    width: 18 },
    { key: "irrigationMicada",  width: 18 },
    { key: "areaMain",          width: 14 },
    { key: "areaMicada",        width: 14 },
    { key: "areaDiff",          width: 12 },
  ];

  const lastCol = "J"; // 10 columns

  // ── Title row ──────────────────────────────────────────────────────────
  ws.mergeCells(`A1:${lastCol}1`);
  const t = ws.getCell("A1");
  t.value     = title || "MICADA Comparison";
  t.font      = { name: "Arial", bold: true, size: 14, color: { argb: COLORS.slate900 } };
  t.alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(1).height = 28;

  // ── Meta row ─────────────────────────────────────────────────────────
  ws.mergeCells(`A2:${lastCol}2`);
  const m = ws.getCell("A2");
  m.value     = `Generated: ${today()}`;
  m.font      = { name: "Arial", size: 10, italic: true, color: { argb: COLORS.slate400 } };
  m.alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(2).height = 18;

  // ── Summary strip (NO MERGES - individual cells) ─────────────────────
  const summary = {
    all: records.length,
    match: records.filter(r => r.status === 'Matched').length,
    mismatch: records.filter(r => r.status === 'Mismatch').length,
    main_only: records.filter(r => r.status === 'Main Only').length,
    micada_only: records.filter(r => r.status === 'MICADA Only').length,
  };

  let netAcreDiff = 0;
  records.forEach(rec => {
    const diffVal = rec['Area (Acre) (Diff)'];
    if (diffVal !== undefined && diffVal !== "") {
      netAcreDiff += parseFloat(diffVal) || 0;
    }
  });

  // Summary items - each takes 2 columns, no merging
  const summaryItems = [
    { label: "Total",       value: summary.all,         bg: COLORS.slate100, text: COLORS.slate700, cols: [1, 2] },
    { label: "Matched",     value: summary.match,       bg: COLORS.green100, text: COLORS.green700, cols: [3, 4] },
    { label: "Mismatch",    value: summary.mismatch,    bg: COLORS.red100,   text: COLORS.red700,   cols: [5, 6] },
    { label: "Main Only",   value: summary.main_only,   bg: COLORS.amber100, text: COLORS.amber700, cols: [7, 8] },
    { label: "MICADA Only", value: summary.micada_only, bg: COLORS.blue100,  text: COLORS.blue700,  cols: [9, 10] },
  ];

  for (const item of summaryItems) {
    // Value in first col
    const valCell = ws.getCell(3, item.cols[0]);
    valCell.value = `${item.value}`;
    valCell.font = { name: "Arial", bold: true, size: 9, color: { argb: item.text } };
    valCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: item.bg } };
    valCell.alignment = { horizontal: "center", vertical: "center" };
    valCell.border = { top: { style: "thin", color: { argb: COLORS.slate200 } }, bottom: { style: "thin", color: { argb: COLORS.slate200 } }, left: { style: "thin", color: { argb: COLORS.slate200 } }, right: { style: "thin", color: { argb: COLORS.slate200 } } };

    // Label in second col
    const lblCell = ws.getCell(3, item.cols[1]);
    lblCell.value = item.label;
    lblCell.font = { name: "Arial", size: 7, color: { argb: COLORS.slate400 } };
    lblCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: item.bg } };
    lblCell.alignment = { horizontal: "center", vertical: "center" };
    lblCell.border = { top: { style: "thin", color: { argb: COLORS.slate200 } }, bottom: { style: "thin", color: { argb: COLORS.slate200 } }, left: { style: "thin", color: { argb: COLORS.slate200 } }, right: { style: "thin", color: { argb: COLORS.slate200 } } };
  }

  // Net Area - overwrite MICADA Only cells if netAcreDiff exists
  if (Math.abs(netAcreDiff) > 0.001) {
    const arrow = netAcreDiff > 0 ? "+" : "-";
    const arrowColor = netAcreDiff > 0 ? COLORS.green500 : COLORS.red500;

    // Clear previous content in cols 9-10
    ws.getCell(3, 9).value = null;
    ws.getCell(3, 10).value = null;

    // Net Area label
    const netLabelCell = ws.getCell(3, 9);
    netLabelCell.value = "Net Area";
    netLabelCell.font = { name: "Arial", bold: true, size: 8, color: { argb: COLORS.slate500 } };
    netLabelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.white } };
    netLabelCell.alignment = { horizontal: "right", vertical: "center" };
    netLabelCell.border = { top: { style: "thin", color: { argb: COLORS.slate200 } }, bottom: { style: "thin", color: { argb: COLORS.slate200 } }, left: { style: "thin", color: { argb: COLORS.slate200 } }, right: { style: "thin", color: { argb: COLORS.slate200 } } };

    // Net Area value
    const netValCell = ws.getCell(3, 10);
    netValCell.value = `${arrow} ${Math.abs(netAcreDiff).toFixed(2)} acre`;
    netValCell.font = { name: "Arial", bold: true, size: 9, color: { argb: arrowColor } };
    netValCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.white } };
    netValCell.alignment = { horizontal: "left", vertical: "center" };
    netValCell.border = { top: { style: "thin", color: { argb: COLORS.slate200 } }, bottom: { style: "thin", color: { argb: COLORS.slate200 } }, left: { style: "thin", color: { argb: COLORS.slate200 } }, right: { style: "thin", color: { argb: COLORS.slate200 } } };
  }

  ws.getRow(3).height = 22;

  // ── Column Headers ───────────────────────────────────────────────────
  const HEADERS = [
    "S.No", "MI No./App ID", "Status",
    "Farmer Name (Main)", "Farmer Name (MICADA)",
    "Irrigation Type (Main)", "Irrigation Type (MICADA)",
    "Area - Main", "Area - MICADA", "Diff"
  ];
  const hr = ws.addRow(HEADERS);
  hr.eachCell(cell => {
    cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: COLORS.white } };
    cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.slate900 } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border    = { top: { style: "thin", color: { argb: COLORS.slate700 } }, bottom: { style: "thin", color: { argb: COLORS.slate700 } }, left: { style: "thin", color: { argb: COLORS.slate700 } }, right: { style: "thin", color: { argb: COLORS.slate700 } } };
  });
  ws.getRow(4).height = 24;

  // ── Data rows ──────────────────────────────────────────────────────────
  records.forEach((rec, i) => {
    const status = rec.status || '';
    const rowBg = getRowBg(status, i);

    const row = ws.addRow([
      rec.srNo || (i + 1),
      safe(rec.miNumberAppId),
      status,
      safe(rec['Farmer Name (Main)']),
      safe(rec['Farmer Name (MICADA)']),
      safe(rec['Irrigation Type (Main)']),
      safe(rec['Irrigation Type (MICADA)']),
      num2(rec['Area (Acre) (Main)']),
      num2(rec['Area (Acre) (MICADA)']),
      num2(rec['Area (Acre) (Diff)']),
    ]);

    row.eachCell((cell, col) => {
      const isNumeric = [8, 9, 10].includes(col);
      const isStatus = col === 3;
      const isSrNo = col === 1;

      // Font
      if (isStatus) {
        const meta = STATUS_META[status] || STATUS_META['Matched'];
        cell.font = { name: "Arial", bold: true, size: 8, color: { argb: meta.text } };
      } else {
        cell.font = { name: "Arial", size: 9, color: { argb: COLORS.slate700 } };
      }

      // Alignment
      cell.alignment = {
        horizontal: isSrNo ? "center" : isNumeric ? "right" : "left",
        vertical: "middle",
        wrapText: false,
      };

      // Fill
      if (isStatus) {
        const meta = STATUS_META[status] || STATUS_META['Matched'];
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: meta.bg } };
      } else {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowBg } };
      }

      // Diff highlighting for compare columns
      const fieldMap = { 4: "Farmer Name", 5: "Farmer Name", 6: "Irrigation Type", 7: "Irrigation Type", 8: "Area (Acre)", 9: "Area (Acre)" };
      if (fieldMap[col] && hasDiff(rec, fieldMap[col])) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.yellow50 } };
        cell.font = { name: "Arial", size: 9, color: { argb: COLORS.slate700 }, bold: true };
      }

      // Borders
      cell.border = {
        top:    { style: "hair", color: { argb: COLORS.slate200 } },
        bottom: { style: "hair", color: { argb: COLORS.slate200 } },
        left:   { style: "hair", color: { argb: COLORS.slate200 } },
        right:  { style: "hair", color: { argb: COLORS.slate200 } },
      };

      // Number format
      if (isNumeric && cell.value !== "—") {
        cell.numFmt = "0.00";
      }
    });

    row.height = 22;
  });

  // ── Freeze panes ─────────────────────────────────────────────────────
  ws.views = [{ state: "frozen", xSplit: 2, ySplit: 4 }];

  // ── Page setup ───────────────────────────────────────────────────────
  ws.pageSetup = {
    orientation: "landscape",
    paperSize: 9,
    fitToWidth: 1,
    fitToHeight: 0,
  };

  return wb.xlsx.writeBuffer();
}