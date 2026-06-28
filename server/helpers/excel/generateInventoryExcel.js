
import XLSX from 'xlsx';

// ─── Same MATRIX_COLS as PDF ─────────────────────────────────────────────────
const MATRIX_COLS = [
   { label: "32MM\nLateral",      itemName: "32 MM LATERAL CLASS-2 FOR MINI SPRINKLER (MUNGIPA)",       keys: ["32MmLateralClass2ForMiniSprinklerMungipa","32MmLateralClIiAOneKissan","32MmLateralClIiForMiniNeerShakti","32MmLateralClIiForMiniSprinklerAds"] },
   { label: "Mini\nSprinkler",    itemName: "Mini Sprinkler (Plastic Nozzle) ADS",                      keys: ["miniSprinklerPlasticNozzleAds","miniSprinklerPlasticNozzleMungipa","miniSprinklerPlasticNozzleNeerShakti"] },
   { label: "Tube\nAssembly",     itemName: "Tube Assembly (1.5 Mtr)",                                  keys: ["tubeAssembly15Mtr"] },
   { label: "Stick\nStand",       itemName: "Stick Stand (Rod)",                                        keys: ["stickStandRod"] },
   { label: "63MM\nHDPE Pipe",    itemName: "63 MM HDPE Pipe",                                          keys: ["63MmHdpePipe","63MmHdpe6MtrPipeDulyCoupledMungipa","63MmHdpePipe6MtrNeerShakti","63MmHdpePipeDulyCoupled6MtrNeerShakti"] },
   { label: "63MM\nR.Ring",       itemName: "63 MM Sprinkler Rubber Ring",                              keys: ["63MmSprinklerRubberRing"] },
   { label: "75MM\nHDPE Pipe",    itemName: "75 MM HDPE Pipe",                                          keys: ["75MmHdpePipe","75MmHdpePipe6MtrNeerShakti","75MmHdpePipe6MtrDulyCoupledAds","75MmHdpePipe6MtrDulyCoupledMungipa","75MmHdpePipe6MtrDulyCoupledNeerShakti"] },
   { label: "75MM\nHDPE 3Mtr",   itemName: "75 MM HDPE Pipe 3 Mtr (ADS)",                             keys: ["75MmHdpePipe3MtrAds","75MmHdpePipe3MtrMungipa","75MmHdpePipe3MtrNeerShakti"] },
   { label: "75MM\nR.Ring",       itemName: "75 MM Sprinkler Rubber Ring",                              keys: ["75MmSprinklerRubberRing"] },
   { label: "75MM\nEnd Cap",      itemName: "75 MM Sprinkler End Cap (ADS)",                            keys: ["75MmSprinklerEndCapAds","75MmSprinklerEndCapMungipa","75MmSprinklerEndCapNeerShakti"] },
   { label: "63MM\nEnd Cap",      itemName: "63 MM Sprinkler End Cap (MUNGIPA)",                        keys: ["63MmSprinklerEndCapMungipa"] },
   { label: "63MM\nSvc Saddle",   itemName: "63 MM Service Saddle 63x32",                               keys: ["63MmServiceSaddle63x32"] },
   { label: "32MM\nSvc Saddle",   itemName: "32 MM Service Saddle (75x32)",                             keys: ["32MmServiceSaddle75x32"] },
   { label: "32MM\nBall Valve",   itemName: "32 MM Ball Valve (ADS)",                                   keys: ["32MmBallValveAds","32MmBallValveAsmiPlain","32MmBallValveMungipa","32MmBallValveNeerShakti"] },
   { label: "32MM\nJoiner",       itemName: "32 MM Joiner",                                             keys: ["32MmJoiner"] },
   { label: "32MM\nBend/Elbow",   itemName: "32 MM Bend PP/ Elbow",                                     keys: ["32MmBendPpElbow"] },
   { label: "32MM\nEnd Cap",      itemName: "32 MM End Cap",                                            keys: ["32MmEndCap","32MmEndPlug"] },
   { label: "32MM\nFTA MTA",      itemName: "32 MM MTA/FTA",                                            keys: ["32MmMtafta"] },
   { label: "Hydro\nCyclone",     itemName: "Hydro Cyclone Filter MUNGIPA",                             keys: ["hydroCycloneFilterMungipa","hydroCycloneFilterNeerShakti"] },
   { label: "Screen\nFilter",     itemName: "Screen Filter NEER SHAKTI",                                keys: ["screenFilterNeerShakti"] },
   { label: "Ventury\n0.75\"",    itemName: "Ventury 0.75 inches",                                      keys: ["ventury075Inches"] },
   { label: "Manifold\n2.5\"",    itemName: "Manifold 2.5''",                                           keys: ["manifold25"] },
   { label: "75MM\nSpr Bend",     itemName: "75 MM Sprinkler Bend (ADS)",                               keys: ["75MmSprinklerBendAds","75MmSprinklerBendMungipa","75MmSprinklerBendNeerShakti","75MmSprinklerBendPlainWithoutClamp"] },
   { label: "75MM\nConn Tail",    itemName: "75 MM Connector TAIL",                                     keys: ["75MmConnectorTail"] },
   { label: "75MM\nConn Coupler", itemName: "75 MM Connector Coupler",                                  keys: ["75MmConnectorCoupler"] },
   { label: "75MM\nSpr Tee",      itemName: "75 MM Sprinkler TEE (ADS)",                                keys: ["75MmSprinklerTeeAds","75MmSprinklerTeeMungipa","75MmSprinklerTeeNeerShakti"] },
   { label: "16MM\nIL Lateral",   itemName: "16 MM IN LINE LATERAL",                                    keys: ["16MmInLineLateral","16MmInLineLateral16x2x30NeerShakti","16MmInLineLateral16x4x60Mungipa","16MmInLineLateral16x4x60NeerShakti","16MmInLineLateral16x4x30NeerShakti"] },
   { label: "16MM\nPlain Lat",    itemName: "16 MM Lateral Class 2 ISI (Plain)",                        keys: ["16MmLateralPlain","16MmLateralClass2IsiPlain","16MmLateral16x4x40NeerShakti"] },
   { label: "75MM\nPVC Pipe",     itemName: "75 x 4 Kg PVC Pipe",                                       keys: ["75X4KgPvcPipe"] },
   { label: "63MM\nPVC Pipe",     itemName: "63 x 4 Kg PVC Pipe",                                       keys: ["63X4KgPvcPipe"] },
   { label: "16MM\nTake Off",     itemName: "16 MM Take Off",                                           keys: ["16MmTakeOff"] },
   { label: "16MM\nEnd Cap",      itemName: "16 MM End Cap",                                            keys: ["16MmEndCap"] },
   { label: "16MM\nJoiner",       itemName: "16 MM Joiner",                                             keys: ["16MmJoiner"] },
   { label: "16MM\nGrommet",      itemName: "16 MM Gromet Neta",                                        keys: ["16MmGrometNeta"] },
   { label: "Flash\nValve",       itemName: "Flash Valve (63 MM & 75 MM)",                              keys: ["flashValve63Mm75Mm"] },
   { label: "63MM\nPVC Elbow",    itemName: "63 MM PVC Elbow",                                          keys: ["63MmPvcElbow"] },
   { label: "75MM\nPVC Elbow",    itemName: "75 MM PVC Elbow",                                          keys: ["75MmPvcElbow"] },
   { label: "75MM\nPVC MTA",      itemName: "75 MM PVC FTA/MTA",                                        keys: ["75MmPvcFtamta"] },
   { label: "63MM\nPVC MTA",      itemName: "63 MM PVC FTA/MTA",                                        keys: ["63MmPvcFtamta"] },
   { label: "63MM\nPVC Tee",      itemName: "63 MM PVC TEE",                                            keys: ["63MmPvcTee"] },
   { label: "75MM\nPVC Tee",      itemName: "75 MM PVC Tee",                                            keys: ["75MmPvcTee","75x63MmPvcTee"] },
   { label: "63MM\nBall Valve",   itemName: "63 MM Ball Valve MS",                                      keys: ["63MmBallValveMs"] },
   { label: "75MM\nBall Valve",   itemName: "75 MM Ball Valve MS",                                      keys: ["75MmBallValveMs"] },
   { label: "PVC\nSolvent",       itemName: "PVC Solvent (100 ML)",                                     keys: ["pvcSolvent100Ml"] },
];

const TOTAL_PROD_COLS = MATRIX_COLS.length;
const RATE_CUTOFF = new Date("2022-09-14");

// ─── Styles (matching PDF colors) ────────────────────────────────────────────

const STYLE = {
   // Title
   title: {
      font: { name: 'Arial', bold: true, sz: 14 },
      alignment: { horizontal: 'center', vertical: 'center' },
   },
   subTitle: {
      font: { name: 'Arial', sz: 10, italic: true },
      alignment: { horizontal: 'center', vertical: 'center' },
   },
   // Column header — grey background (matching PDF #DDDDDD)
   header: {
      font: { name: 'Arial', bold: true, sz: 9, color: { rgb: '000000' } },
      fill: { fgColor: { rgb: 'DDDDDD' }, patternType: 'solid' },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: {
         top:    { style: 'thin', color: { rgb: '000000' } },
         bottom: { style: 'thin', color: { rgb: '000000' } },
         left:   { style: 'thin', color: { rgb: '000000' } },
         right:  { style: 'thin', color: { rgb: '000000' } },
      },
   },
   // Rate row — light blue (matching PDF #E8F4FD)
   rateRow: {
      font: { name: 'Arial', bold: true, sz: 8, color: { rgb: '1a5276' } },
      fill: { fgColor: { rgb: 'E8F4FD' }, patternType: 'solid' },
      alignment: { horizontal: 'right', vertical: 'center' },
      border: {
         top:    { style: 'thin', color: { rgb: '000000' } },
         bottom: { style: 'thin', color: { rgb: '000000' } },
         left:   { style: 'thin', color: { rgb: '000000' } },
         right:  { style: 'thin', color: { rgb: '000000' } },
      },
   },
   rateRowLabel: {
      font: { name: 'Arial', bold: true, sz: 8, color: { rgb: '000000' } },
      fill: { fgColor: { rgb: 'E8F4FD' }, patternType: 'solid' },
      alignment: { horizontal: 'left', vertical: 'center' },
      border: {
         top:    { style: 'thin', color: { rgb: '000000' } },
         bottom: { style: 'thin', color: { rgb: '000000' } },
         left:   { style: 'thin', color: { rgb: '000000' } },
         right:  { style: 'thin', color: { rgb: '000000' } },
      },
   },
   // Total row — yellow (matching PDF #FFFACD)
   totalRow: {
      font: { name: 'Arial', bold: true, sz: 8, color: { rgb: '000000' } },
      fill: { fgColor: { rgb: 'FFFACD' }, patternType: 'solid' },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
         top:    { style: 'medium', color: { rgb: '000000' } },
         bottom: { style: 'medium', color: { rgb: '000000' } },
         left:   { style: 'thin',   color: { rgb: '000000' } },
         right:  { style: 'thin',   color: { rgb: '000000' } },
      },
   },
   // Qty Total column — green (matching PDF #C8E6C9 / #A5D6A7)
   qtyTotalHeader: {
      font: { name: 'Arial', bold: true, sz: 9, color: { rgb: '000000' } },
      fill: { fgColor: { rgb: 'C8E6C9' }, patternType: 'solid' },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: {
         top:    { style: 'thin', color: { rgb: '000000' } },
         bottom: { style: 'thin', color: { rgb: '000000' } },
         left:   { style: 'thin', color: { rgb: '000000' } },
         right:  { style: 'thin', color: { rgb: '000000' } },
      },
   },
   qtyTotalCell: {
      font: { name: 'Arial', bold: true, sz: 8, color: { rgb: '000000' } },
      fill: { fgColor: { rgb: 'C8E6C9' }, patternType: 'solid' },
      alignment: { horizontal: 'right', vertical: 'center' },
      border: {
         top:    { style: 'thin', color: { rgb: '000000' } },
         bottom: { style: 'thin', color: { rgb: '000000' } },
         left:   { style: 'thin', color: { rgb: '000000' } },
         right:  { style: 'thin', color: { rgb: '000000' } },
      },
   },
   qtyTotalGrand: {
      font: { name: 'Arial', bold: true, sz: 8, color: { rgb: '000000' } },
      fill: { fgColor: { rgb: 'A5D6A7' }, patternType: 'solid' },
      alignment: { horizontal: 'right', vertical: 'center' },
      border: {
         top:    { style: 'medium', color: { rgb: '000000' } },
         bottom: { style: 'medium', color: { rgb: '000000' } },
         left:   { style: 'thin',   color: { rgb: '000000' } },
         right:  { style: 'thin',   color: { rgb: '000000' } },
      },
   },
   // Amt Total column — yellow (matching PDF #FFF9C4 / #FFEE58)
   amtTotalHeader: {
      font: { name: 'Arial', bold: true, sz: 9, color: { rgb: '000000' } },
      fill: { fgColor: { rgb: 'FFF9C4' }, patternType: 'solid' },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: {
         top:    { style: 'thin', color: { rgb: '000000' } },
         bottom: { style: 'thin', color: { rgb: '000000' } },
         left:   { style: 'thin', color: { rgb: '000000' } },
         right:  { style: 'thin', color: { rgb: '000000' } },
      },
   },
   amtTotalCell: {
      font: { name: 'Arial', bold: true, sz: 8, color: { rgb: '000000' } },
      fill: { fgColor: { rgb: 'FFF9C4' }, patternType: 'solid' },
      alignment: { horizontal: 'right', vertical: 'center' },
      border: {
         top:    { style: 'thin', color: { rgb: '000000' } },
         bottom: { style: 'thin', color: { rgb: '000000' } },
         left:   { style: 'thin', color: { rgb: '000000' } },
         right:  { style: 'thin', color: { rgb: '000000' } },
      },
   },
   amtTotalGrand: {
      font: { name: 'Arial', bold: true, sz: 8, color: { rgb: '000000' } },
      fill: { fgColor: { rgb: 'FFEE58' }, patternType: 'solid' },
      alignment: { horizontal: 'right', vertical: 'center' },
      border: {
         top:    { style: 'medium', color: { rgb: '000000' } },
         bottom: { style: 'medium', color: { rgb: '000000' } },
         left:   { style: 'thin',   color: { rgb: '000000' } },
         right:  { style: 'thin',   color: { rgb: '000000' } },
      },
   },
   // Data cell — number
   dataNum: {
      font: { name: 'Arial', sz: 8 },
      alignment: { horizontal: 'right', vertical: 'center' },
      border: {
         top:    { style: 'hair', color: { rgb: 'CCCCCC' } },
         bottom: { style: 'hair', color: { rgb: 'CCCCCC' } },
         left:   { style: 'hair', color: { rgb: 'CCCCCC' } },
         right:  { style: 'hair', color: { rgb: 'CCCCCC' } },
      },
   },
   // Data cell — text (date, challan)
   dataText: {
      font: { name: 'Arial', sz: 8 },
      alignment: { horizontal: 'left', vertical: 'center' },
      border: {
         top:    { style: 'hair', color: { rgb: 'CCCCCC' } },
         bottom: { style: 'hair', color: { rgb: 'CCCCCC' } },
         left:   { style: 'hair', color: { rgb: 'CCCCCC' } },
         right:  { style: 'hair', color: { rgb: 'CCCCCC' } },
      },
   },
   // Data cell — center aligned (acres)
   dataCenter: {
      font: { name: 'Arial', sz: 8 },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
         top:    { style: 'hair', color: { rgb: 'CCCCCC' } },
         bottom: { style: 'hair', color: { rgb: 'CCCCCC' } },
         left:   { style: 'hair', color: { rgb: 'CCCCCC' } },
         right:  { style: 'hair', color: { rgb: 'CCCCCC' } },
      },
   },
   // Alternating row backgrounds
   dataRowEven: {
      font: { name: 'Arial', sz: 8 },
      fill: { fgColor: { rgb: 'FFFFFF' }, patternType: 'solid' },
      alignment: { horizontal: 'right', vertical: 'center' },
      border: {
         top:    { style: 'hair', color: { rgb: 'CCCCCC' } },
         bottom: { style: 'hair', color: { rgb: 'CCCCCC' } },
         left:   { style: 'hair', color: { rgb: 'CCCCCC' } },
         right:  { style: 'hair', color: { rgb: 'CCCCCC' } },
      },
   },
   dataRowOdd: {
      font: { name: 'Arial', sz: 8 },
      fill: { fgColor: { rgb: 'F5F5F5' }, patternType: 'solid' },
      alignment: { horizontal: 'right', vertical: 'center' },
      border: {
         top:    { style: 'hair', color: { rgb: 'CCCCCC' } },
         bottom: { style: 'hair', color: { rgb: 'CCCCCC' } },
         left:   { style: 'hair', color: { rgb: 'CCCCCC' } },
         right:  { style: 'hair', color: { rgb: 'CCCCCC' } },
      },
   },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function col(n) {
   let s = '';
   n += 1;
   while (n > 0) {
      const rem = (n - 1) % 26;
      s = String.fromCharCode(65 + rem) + s;
      n = Math.floor((n - 1) / 26);
   }
   return s;
}

function cell(c, r) {
   return `${col(c)}${r}`;
}

function fmt(date) {
   if (!date) return '';
   const d = new Date(date);
   if (isNaN(d)) return '';
   return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

function writeCell(ws, c, r, value, style, type) {
   const addr = cell(c, r);
   const t = type ?? (typeof value === 'number' ? 'n' : 's');
   ws[addr] = { t, v: value ?? '', s: style };
   return addr;
}

function writeFormula(ws, c, r, formula, style) {
   const addr = cell(c, r);
   ws[addr] = { t: 'n', f: formula, s: style };
   return addr;
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * @param {Array}  inventoryDocs  — array of Mongoose inventory documents
 * @param {string} financialYear  — e.g. "22-23"
 * @param {string} dealerName     — display name for the report header
 * @param {Array}  rates          — global item rates (same as PDF)
 * @param {Array}  dealerRates    — dealer-specific item rates (same as PDF)
 * @returns {Buffer}              — Excel file as a Node.js Buffer
 */
export function generateInventoryExcel(inventoryDocs, financialYear, dealerName, rates = [], dealerRates = []) {
   const wb = XLSX.utils.book_new();
   const ws = {};

   // Sort docs by date ascending
   const docs = [...inventoryDocs].sort((a, b) => new Date(a.date) - new Date(b.date));

   // ── Rate lookup maps (dealer rate wins over global) ─────────────────────
   const globalRateMap = new Map(rates.map(r => [r.itemName, r]));
   const dealerRateMap = new Map(dealerRates.map(r => [r.itemName, r]));

   const rateUptoVals = MATRIX_COLS.map(col => {
      const r = dealerRateMap.get(col.itemName) ?? globalRateMap.get(col.itemName);
      return r ? r.rateUpto : null;
   });
   const rateFromVals = MATRIX_COLS.map(col => {
      const r = dealerRateMap.get(col.itemName) ?? globalRateMap.get(col.itemName);
      return r ? r.rateFrom : null;
   });

   // ── Pre-compute values (same logic as PDF) ────────────────────────────────
   const prodValsPerRow = docs.map(rec => {
      const p = rec.products || {};
      return MATRIX_COLS.map(col =>
         col.keys.reduce((sum, k) => sum + (Number(p[k]) || 0), 0)
      );
   });

   const rowQtyTotals = prodValsPerRow.map(vals =>
      vals.reduce((s, v) => s + v, 0)
   );

   const rowAmtTotals = prodValsPerRow.map((vals, ri) => {
      const recDate = new Date(docs[ri].date);
      const useUpto = !isNaN(recDate.getTime()) && recDate < RATE_CUTOFF;
      return vals.reduce((sum, qty, ci) => {
         const rate = useUpto ? (rateUptoVals[ci] ?? 0) : (rateFromVals[ci] ?? 0);
         return sum + qty * rate;
      }, 0);
   });

   const grandColTotals = MATRIX_COLS.map((_, ci) =>
      docs.reduce((sum, _, ri) => sum + prodValsPerRow[ri][ci], 0)
   );
   const grandAcre = docs.reduce((s, r) => s + (Number(r.acre) || 0), 0);
   const grandQtyTotal = rowQtyTotals.reduce((s, v) => s + v, 0);
   const grandAmtTotal = rowAmtTotals.reduce((s, v) => s + v, 0);

   // ── Layout constants ───────────────────────────────────────────────────────
   const TITLE_ROW      = 1;
   const FY_ROW         = 2;
   const INFO_ROW       = 3;
   const HEADER_ROW     = 4;
   const RATE_UPTO_ROW  = 5;   // "Rates WEF 01.04.2022"
   const RATE_FROM_ROW  = 6;   // "Rates WEF 14.09.2022"
   const TOTAL_ROW_TOP  = 7;   // Grand total row at top
   const DATA_START     = 8;   // First data row
   const DATA_END       = DATA_START + docs.length - 1;
   const TOTAL_ROW_BOTTOM = DATA_END + 1;  // Grand total row at bottom

   // Column layout:
   //  0 = Date | 1 = Challan No | 2 = Acres | 3..(3+N-1) = products | N+3 = Qty Total | N+4 = Amt Total
   const FIRST_PROD_COL = 3;
   const LAST_PROD_COL  = FIRST_PROD_COL + TOTAL_PROD_COLS - 1;
   const QTY_TOTAL_COL = LAST_PROD_COL + 1;
   const AMT_TOTAL_COL = QTY_TOTAL_COL + 1;
   const LAST_COL       = AMT_TOTAL_COL;

   // ── Title rows (rows 1–3) ─────────────────────────────────────────────────
   ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: LAST_COL } },  // row 1: title
      { s: { r: 1, c: 0 }, e: { r: 1, c: LAST_COL } },  // row 2: FY
      { s: { r: 2, c: 0 }, e: { r: 2, c: LAST_COL } },  // row 3: dealer info
   ];

   ws['A1'] = { t: 's', v: 'Inventory Matrix', s: STYLE.title };
   ws['A2'] = { t: 's', v: `Financial Year: ${financialYear || ''}`, s: STYLE.subTitle };

   const infoParts = [];
   if (dealerName) infoParts.push(`Dealer: ${dealerName}`);
   const firstDoc = docs[0] || {};
   if (firstDoc.farmerDealerCode) infoParts.push(`Code: ${firstDoc.farmerDealerCode}`);
   ws['A3'] = { t: 's', v: infoParts.join('   |   ') || 'Inventory Report', s: STYLE.subTitle };

   // ── Column headers (row 4) ─────────────────────────────────────────────────
   writeCell(ws, 0, HEADER_ROW, 'Date',        STYLE.header, 's');
   writeCell(ws, 1, HEADER_ROW, 'Challan No',  STYLE.header, 's');
   writeCell(ws, 2, HEADER_ROW, 'Acres',       STYLE.header, 's');

   MATRIX_COLS.forEach((col, i) => {
      writeCell(ws, FIRST_PROD_COL + i, HEADER_ROW, col.label.replace('\n', ' '), STYLE.header, 's');
   });

   writeCell(ws, QTY_TOTAL_COL, HEADER_ROW, 'Total\n(Qty)', STYLE.qtyTotalHeader, 's');
   writeCell(ws, AMT_TOTAL_COL, HEADER_ROW, 'Total\n(Rs)',  STYLE.amtTotalHeader, 's');

   // ── Rate rows (rows 5-6) ─────────────────────────────────────────────────
   // Rate Upto row
   writeCell(ws, 0, RATE_UPTO_ROW, 'Rates WEF 01.04.2022', STYLE.rateRowLabel, 's');
   writeCell(ws, 1, RATE_UPTO_ROW, '', STYLE.rateRow, 's');
   writeCell(ws, 2, RATE_UPTO_ROW, '', STYLE.rateRow, 's');

   rateUptoVals.forEach((val, i) => {
      writeCell(ws, FIRST_PROD_COL + i, RATE_UPTO_ROW, val ?? '', STYLE.rateRow, 'n');
   });
   writeCell(ws, QTY_TOTAL_COL, RATE_UPTO_ROW, '', STYLE.rateRow, 's');
   writeCell(ws, AMT_TOTAL_COL, RATE_UPTO_ROW, '', STYLE.rateRow, 's');

   // Rate From row
   writeCell(ws, 0, RATE_FROM_ROW, 'Rates WEF 14.09.2022', STYLE.rateRowLabel, 's');
   writeCell(ws, 1, RATE_FROM_ROW, '', STYLE.rateRow, 's');
   writeCell(ws, 2, RATE_FROM_ROW, '', STYLE.rateRow, 's');

   rateFromVals.forEach((val, i) => {
      writeCell(ws, FIRST_PROD_COL + i, RATE_FROM_ROW, val ?? '', STYLE.rateRow, 'n');
   });
   writeCell(ws, QTY_TOTAL_COL, RATE_FROM_ROW, '', STYLE.rateRow, 's');
   writeCell(ws, AMT_TOTAL_COL, RATE_FROM_ROW, '', STYLE.rateRow, 's');

   // ── Top Total row (row 7) — yellow background ────────────────────────────
   writeCell(ws, 0, TOTAL_ROW_TOP, 'TOTAL', STYLE.totalRow, 's');
   writeCell(ws, 1, TOTAL_ROW_TOP, '', STYLE.totalRow, 's');
   writeCell(ws, 2, TOTAL_ROW_TOP, grandAcre > 0 ? grandAcre.toFixed(1) : '', STYLE.totalRow, 'n');

   MATRIX_COLS.forEach((_, i) => {
      if (grandColTotals[i] > 0) {
         writeCell(ws, FIRST_PROD_COL + i, TOTAL_ROW_TOP, grandColTotals[i], STYLE.totalRow, 'n');
      } else {
         writeCell(ws, FIRST_PROD_COL + i, TOTAL_ROW_TOP, '', STYLE.totalRow, 's');
      }
   });

   writeCell(ws, QTY_TOTAL_COL, TOTAL_ROW_TOP, grandQtyTotal, STYLE.qtyTotalGrand, 'n');
   writeCell(ws, AMT_TOTAL_COL, TOTAL_ROW_TOP, grandAmtTotal, STYLE.amtTotalGrand, 'n');

   // ── Data rows ─────────────────────────────────────────────────────────────
   docs.forEach((doc, i) => {
      const row = DATA_START + i;
      const rowStyle = i % 2 === 0 ? STYLE.dataRowEven : STYLE.dataRowOdd;
      const textStyle = i % 2 === 0 ? STYLE.dataText : { ...STYLE.dataText, fill: { fgColor: { rgb: 'F5F5F5' }, patternType: 'solid' } };
      const centerStyle = i % 2 === 0 ? STYLE.dataCenter : { ...STYLE.dataCenter, fill: { fgColor: { rgb: 'F5F5F5' }, patternType: 'solid' } };

      writeCell(ws, 0, row, fmt(doc.date), textStyle, 's');
      writeCell(ws, 1, row, doc.challanNo || '', textStyle, 's');
      writeCell(ws, 2, row, doc.acre != null ? doc.acre : '', centerStyle, doc.acre != null ? 'n' : 's');

      // Product columns
      prodValsPerRow[i].forEach((val, ci) => {
         writeCell(ws, FIRST_PROD_COL + ci, row, val > 0 ? val : '', rowStyle, 'n');
      });

      // Qty Total — green
      writeCell(ws, QTY_TOTAL_COL, row, rowQtyTotals[i] > 0 ? rowQtyTotals[i] : '', STYLE.qtyTotalCell, 'n');

      // Amt Total — yellow
      writeCell(ws, AMT_TOTAL_COL, row, rowAmtTotals[i] > 0 ? rowAmtTotals[i] : '', STYLE.amtTotalCell, 'n');
   });

   // ── Bottom Total row ──────────────────────────────────────────────────────
   if (docs.length > 0) {
      const botRow = TOTAL_ROW_BOTTOM;
      writeCell(ws, 0, botRow, 'TOTAL', STYLE.totalRow, 's');
      writeCell(ws, 1, botRow, '', STYLE.totalRow, 's');
      writeCell(ws, 2, botRow, grandAcre > 0 ? grandAcre.toFixed(1) : '', STYLE.totalRow, 'n');

      MATRIX_COLS.forEach((_, i) => {
         if (grandColTotals[i] > 0) {
            writeCell(ws, FIRST_PROD_COL + i, botRow, grandColTotals[i], STYLE.totalRow, 'n');
         } else {
            writeCell(ws, FIRST_PROD_COL + i, botRow, '', STYLE.totalRow, 's');
         }
      });

      writeCell(ws, QTY_TOTAL_COL, botRow, grandQtyTotal, STYLE.qtyTotalGrand, 'n');
      writeCell(ws, AMT_TOTAL_COL, botRow, grandAmtTotal, STYLE.amtTotalGrand, 'n');
   }

   // ── Sheet dimensions ─────────────────────────────────────────────────────
   const lastDataRow = docs.length > 0 ? TOTAL_ROW_BOTTOM : TOTAL_ROW_TOP;
   ws['!ref'] = `A1:${col(LAST_COL)}${lastDataRow}`;

   // ── Column widths ──────────────────────────────────────────────────────────
   ws['!cols'] = [
      { wch: 12 },   // Date
      { wch: 18 },   // Challan No
      { wch: 7  },   // Acres
      ...MATRIX_COLS.map(() => ({ wch: 10 })),  // Product columns (narrow like PDF)
      { wch: 10 },   // Qty Total
      { wch: 12 },   // Amt Total
   ];

   // ── Row heights ───────────────────────────────────────────────────────────
   ws['!rows'] = [
      { hpt: 28 },   // row 1: title
      { hpt: 18 },   // row 2: FY
      { hpt: 18 },   // row 3: info
      { hpt: 48 },   // row 4: column headers (wrapped text)
      { hpt: 16 },   // row 5: rate upto
      { hpt: 16 },   // row 6: rate from
      { hpt: 18 },   // row 7: top total
      ...docs.map(() => ({ hpt: 14 })),  // data rows
      { hpt: 18 },   // bottom total
   ];

   // ── Freeze panes: lock title + header + rate rows + total row, and first 3 cols ─
   ws['!freeze'] = { xSplit: 3, ySplit: TOTAL_ROW_TOP, topLeftCell: cell(3, DATA_START) };

   // ── Page setup for landscape ──────────────────────────────────────────────
   ws['!pageSetup'] = {
      orientation: 'landscape',
      paperSize: 9,  // A4
      fitToWidth: 1,
      fitToHeight: 0,
   };

   XLSX.utils.book_append_sheet(wb, ws, 'Inventory Matrix');

   return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx', cellStyles: true });
}