
// import PDFDocument from "pdfkit";

// const MARGIN    = 15;
// const FOOTER_H  = 16;
// const HEADER_H  = 40;

// // ── Landscape A4 ──────────────────────────────────────────────────────────────
// const PAGE_W = 841.89;
// const PAGE_H = 595.28;
// const CW     = PAGE_W - 2 * MARGIN;

// // ── Layout constants ──────────────────────────────────────────────────────────
// const MX_DATE_W    = 44;
// const MX_CHALLAN_W = 62;
// const MX_ACRES_W   = 22;
// const MX_QTY_TOT_W = 24;   // "Row Total (Qty)" column width
// const MX_AMT_TOT_W = 30;   
// const MX_FIXED_W   = MX_DATE_W + MX_CHALLAN_W + MX_ACRES_W;

// const MX_ROW_H   = 9;
// const MX_HEAD_H  = 38;
// const MX_FS      = 3;
// const MX_HEAD_FS = 4.2;

// // ─── Product column definitions ───────────────────────────────────────────────
// const MATRIX_COLS = [
//    { label: "32MM\nLateral",      itemName: "32 MM LATERAL CLASS-2 FOR MINI SPRINKLER (MUNGIPA)",       keys: ["32MmLateralClass2ForMiniSprinklerMungipa","32MmLateralClIiAOneKissan","32MmLateralClIiForMiniNeerShakti","32MmLateralClIiForMiniSprinklerAds"] },
//    { label: "Mini\nSprinkler",    itemName: "Mini Sprinkler (Plastic Nozzle) ADS",                      keys: ["miniSprinklerPlasticNozzleAds","miniSprinklerPlasticNozzleMungipa","miniSprinklerPlasticNozzleNeerShakti"] },
//    { label: "Tube\nAssembly",     itemName: "Tube Assembly (1.5 Mtr)",                                  keys: ["tubeAssembly15Mtr"] },
//    { label: "Stick\nStand",       itemName: "Stick Stand (Rod)",                                        keys: ["stickStandRod"] },
//    { label: "63MM\nHDPE Pipe",    itemName: "63 MM HDPE Pipe",                                          keys: ["63MmHdpePipe","63MmHdpe6MtrPipeDulyCoupledMungipa","63MmHdpePipe6MtrNeerShakti","63MmHdpePipeDulyCoupled6MtrNeerShakti"] },
//    { label: "63MM\nR.Ring",       itemName: "63 MM Sprinkler Rubber Ring",                              keys: ["63MmSprinklerRubberRing"] },
//    { label: "75MM\nHDPE Pipe",    itemName: "75 MM HDPE Pipe",                                          keys: ["75MmHdpePipe","75MmHdpePipe6MtrNeerShakti","75MmHdpePipe6MtrDulyCoupledAds","75MmHdpePipe6MtrDulyCoupledMungipa","75MmHdpePipe6MtrDulyCoupledNeerShakti"] },
//    { label: "75MM\nHDPE 3Mtr",   itemName: "75 MM HDPE Pipe 3 Mtr (ADS)",                             keys: ["75MmHdpePipe3MtrAds","75MmHdpePipe3MtrMungipa","75MmHdpePipe3MtrNeerShakti"] },
//    { label: "75MM\nR.Ring",       itemName: "75 MM Sprinkler Rubber Ring",                              keys: ["75MmSprinklerRubberRing"] },
//    { label: "75MM\nEnd Cap",      itemName: "75 MM Sprinkler End Cap (ADS)",                            keys: ["75MmSprinklerEndCapAds","75MmSprinklerEndCapMungipa","75MmSprinklerEndCapNeerShakti"] },
//    { label: "63MM\nEnd Cap",      itemName: "63 MM Sprinkler End Cap (MUNGIPA)",                        keys: ["63MmSprinklerEndCapMungipa"] },
//    { label: "63MM\nSvc Saddle",   itemName: "63 MM Service Saddle 63x32",                               keys: ["63MmServiceSaddle63x32"] },
//    { label: "32MM\nSvc Saddle",   itemName: "32 MM Service Saddle (75x32)",                             keys: ["32MmServiceSaddle75x32"] },
//    { label: "32MM\nBall Valve",   itemName: "32 MM Ball Valve (ADS)",                                   keys: ["32MmBallValveAds","32MmBallValveAsmiPlain","32MmBallValveMungipa","32MmBallValveNeerShakti"] },
//    { label: "32MM\nJoiner",       itemName: "32 MM Joiner",                                             keys: ["32MmJoiner"] },
//    { label: "32MM\nBend/Elbow",   itemName: "32 MM Bend PP/ Elbow",                                     keys: ["32MmBendPpElbow"] },
//    { label: "32MM\nEnd Cap",      itemName: "32 MM End Cap",                                            keys: ["32MmEndCap","32MmEndPlug"] },
//    { label: "32MM\nFTA MTA",      itemName: "32 MM MTA/FTA",                                            keys: ["32MmMtafta"] },
//    { label: "Hydro\nCyclone",     itemName: "Hydro Cyclone Filter MUNGIPA",                             keys: ["hydroCycloneFilterMungipa","hydroCycloneFilterNeerShakti"] },
//    { label: "Screen\nFilter",     itemName: "Screen Filter NEER SHAKTI",                                keys: ["screenFilterNeerShakti"] },
//    { label: "Ventury\n0.75\"",    itemName: "Ventury 0.75 inches",                                      keys: ["ventury075Inches"] },
//    { label: "Manifold\n2.5\"",    itemName: "Manifold 2.5''",                                           keys: ["manifold25"] },
//    { label: "75MM\nSpr Bend",     itemName: "75 MM Sprinkler Bend (ADS)",                               keys: ["75MmSprinklerBendAds","75MmSprinklerBendMungipa","75MmSprinklerBendNeerShakti","75MmSprinklerBendPlainWithoutClamp"] },
//    { label: "75MM\nConn Tail",    itemName: "75 MM Connector TAIL",                                     keys: ["75MmConnectorTail"] },
//    { label: "75MM\nConn Coupler", itemName: "75 MM Connector Coupler",                                  keys: ["75MmConnectorCoupler"] },
//    { label: "75MM\nSpr Tee",      itemName: "75 MM Sprinkler TEE (ADS)",                                keys: ["75MmSprinklerTeeAds","75MmSprinklerTeeMungipa","75MmSprinklerTeeNeerShakti"] },
//    { label: "16MM\nIL Lateral",   itemName: "16 MM IN LINE LATERAL",                                    keys: ["16MmInLineLateral","16MmInLineLateral16x2x30NeerShakti","16MmInLineLateral16x4x60Mungipa","16MmInLineLateral16x4x60NeerShakti","16MmInLineLateral16x4x30NeerShakti"] },
//    { label: "16MM\nPlain Lat",    itemName: "16 MM Lateral Class 2 ISI (Plain)",                        keys: ["16MmLateralPlain","16MmLateralClass2IsiPlain","16MmLateral16x4x40NeerShakti"] },
//    { label: "75MM\nPVC Pipe",     itemName: "75 x 4 Kg PVC Pipe",                                       keys: ["75X4KgPvcPipe"] },
//    { label: "63MM\nPVC Pipe",     itemName: "63 x 4 Kg PVC Pipe",                                       keys: ["63X4KgPvcPipe"] },
//    { label: "16MM\nTake Off",     itemName: "16 MM Take Off",                                           keys: ["16MmTakeOff"] },
//    { label: "16MM\nEnd Cap",      itemName: "16 MM End Cap",                                            keys: ["16MmEndCap"] },
//    { label: "16MM\nJoiner",       itemName: "16 MM Joiner",                                             keys: ["16MmJoiner"] },
//    { label: "16MM\nGrommet",      itemName: "16 MM Gromet Neta",                                        keys: ["16MmGrometNeta"] },
//    { label: "Flash\nValve",       itemName: "Flash Valve (63 MM & 75 MM)",                              keys: ["flashValve63Mm75Mm"] },
//    { label: "63MM\nPVC Elbow",    itemName: "63 MM PVC Elbow",                                          keys: ["63MmPvcElbow"] },
//    { label: "75MM\nPVC Elbow",    itemName: "75 MM PVC Elbow",                                          keys: ["75MmPvcElbow"] },
//    { label: "75MM\nPVC MTA",      itemName: "75 MM PVC FTA/MTA",                                        keys: ["75MmPvcFtamta"] },
//    { label: "63MM\nPVC MTA",      itemName: "63 MM PVC FTA/MTA",                                        keys: ["63MmPvcFtamta"] },
//    { label: "63MM\nPVC Tee",      itemName: "63 MM PVC TEE",                                            keys: ["63MmPvcTee"] },
//    { label: "75MM\nPVC Tee",      itemName: "75 MM PVC Tee",                                            keys: ["75MmPvcTee","75x63MmPvcTee"] },
//    { label: "63MM\nBall Valve",   itemName: "63 MM Ball Valve MS",                                      keys: ["63MmBallValveMs"] },
//    { label: "75MM\nBall Valve",   itemName: "75 MM Ball Valve MS",                                      keys: ["75MmBallValveMs"] },
//    { label: "PVC\nSolvent",       itemName: "PVC Solvent (100 ML)",                                     keys: ["pvcSolvent100Ml"] },
// ];

// // ── TOTAL_PROD_COLS must be defined AFTER MATRIX_COLS ─────────────────────────
// const TOTAL_PROD_COLS = MATRIX_COLS.length;

// const MX_COL_W      = Math.floor((CW - MX_FIXED_W - MX_QTY_TOT_W - MX_AMT_TOT_W) / TOTAL_PROD_COLS);
// const TOTAL_TABLE_W = MX_FIXED_W + TOTAL_PROD_COLS * MX_COL_W + MX_QTY_TOT_W + MX_AMT_TOT_W;

// // ── Rate cutoff date ──────────────────────────────────────────────────────────
// const RATE_CUTOFF = new Date("2022-09-14");

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function safe(v) { return v != null && v !== "" ? String(v) : "—"; }
// function today() { return new Date().toLocaleDateString("en-IN"); }
// function fileDate() { return new Date().toISOString().split("T")[0]; }
// function fmtDate(val) {
//    if (!val) return "—";
//    const d = new Date(val);
//    if (isNaN(d.getTime())) return "—";
//    const dd = String(d.getDate()).padStart(2, "0");
//    const mm = String(d.getMonth() + 1).padStart(2, "0");
//    return `${dd}/${mm}/${d.getFullYear()}`;
// }
// function truncate(doc, text, font, size, maxW) {
//    doc.font(font).fontSize(size);
//    if (doc.widthOfString(text) <= maxW) return text;
//    let t = text;
//    while (t.length > 0 && doc.widthOfString(t + "…") > maxW) t = t.slice(0, -1);
//    return t + "…";
// }

// function buildColXs() {
//    const xs = [];
//    let x = MARGIN;
//    xs.push(x); x += MX_DATE_W;
//    xs.push(x); x += MX_CHALLAN_W;
//    xs.push(x); x += MX_ACRES_W;
//    for (let i = 0; i < TOTAL_PROD_COLS; i++) { xs.push(x); x += MX_COL_W; }
//    xs.push(x); x += MX_QTY_TOT_W;   // index: 3 + TOTAL_PROD_COLS       → Qty Total
//    xs.push(x);                        // index: 3 + TOTAL_PROD_COLS + 1   → Amt Total
//    return xs;
// }

// // Convenience: xs index for qty-total and amt-total columns
// const QTY_TOT_IDX = 3 + TOTAL_PROD_COLS;
// const AMT_TOT_IDX = 3 + TOTAL_PROD_COLS + 1;

// // ── Header ────────────────────────────────────────────────────────────────────
// function drawHeader(doc, title, dealerName, dealerCode, financialYear) {
//    doc.moveTo(MARGIN, HEADER_H - 4).lineTo(MARGIN + CW, HEADER_H - 4)
//       .strokeColor("#000000").lineWidth(0.8).stroke();
//    doc.font("Helvetica-Bold").fontSize(11).fillColor("#000000")
//       .text(title, MARGIN, 8, { lineBreak: false });
//    if (financialYear) {
//       doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000")
//          .text(`FY: ${financialYear}`, 0, 10,
//             { align: "right", width: PAGE_W - MARGIN, lineBreak: false });
//    }
//    const parts = [];
//    if (dealerName && dealerName !== "—") parts.push(`Dealer: ${dealerName}`);
//    if (dealerCode && dealerCode !== "—") parts.push(`Code: ${dealerCode}`);
//    if (parts.length > 0) {
//       doc.font("Helvetica-Bold").fontSize(7).fillColor("#000000")
//          .text(parts.join("   |   "), MARGIN, 24, { lineBreak: false });
//    }
//    doc.font("Helvetica").fontSize(6).fillColor("#000000")
//       .text(`Generated: ${today()}`, 0, 26,
//          { align: "right", width: PAGE_W - MARGIN, lineBreak: false });
// }

// // ── Footer ────────────────────────────────────────────────────────────────────
// function drawFooter(doc, pageNum) {
//    const fy = PAGE_H - FOOTER_H;
//    doc.moveTo(MARGIN, fy).lineTo(MARGIN + CW, fy)
//       .strokeColor("#000000").lineWidth(0.4).stroke();
//    doc.font("Helvetica").fontSize(6).fillColor("#000000")
//       .text(`Page ${pageNum}`, MARGIN, fy + 4,
//          { width: CW, align: "center", lineBreak: false });
// }

// // ── Column headers ────────────────────────────────────────────────────────────
// function drawHeaders(doc, colXs, y) {
//    const qtyTotalX = colXs[QTY_TOT_IDX];
//    const amtTotalX = colXs[AMT_TOT_IDX];

//    doc.save().rect(MARGIN, y, TOTAL_TABLE_W, MX_HEAD_H).fillColor("#DDDDDD").fill().restore();
//    doc.rect(MARGIN, y, TOTAL_TABLE_W, MX_HEAD_H).strokeColor("#000000").lineWidth(0.4).stroke();

//    // ── Fixed columns ─────────────────────────────────────────────────────────
//    const fixed = [
//       { label: "Date",       x: colXs[0], w: MX_DATE_W },
//       { label: "Challan No", x: colXs[1], w: MX_CHALLAN_W },
//       { label: "Acres",      x: colXs[2], w: MX_ACRES_W },
//    ];
//    for (const f of fixed) {
//       if (f.x > MARGIN) {
//          doc.moveTo(f.x, y).lineTo(f.x, y + MX_HEAD_H).strokeColor("#000000").lineWidth(0.3).stroke();
//       }
//       doc.font("Helvetica-Bold").fontSize(MX_HEAD_FS).fillColor("#000000")
//          .text(f.label, f.x + 1, y + (MX_HEAD_H - MX_HEAD_FS) / 2,
//             { width: f.w - 2, align: "center", lineBreak: false });
//    }

//    // ── Product columns (rotated) ─────────────────────────────────────────────
//    for (let i = 0; i < TOTAL_PROD_COLS; i++) {
//       const cx = colXs[3 + i];
//       doc.moveTo(cx, y).lineTo(cx, y + MX_HEAD_H).strokeColor("#000000").lineWidth(0.2).stroke();
//       doc.save();
//       doc.translate(cx + MX_COL_W / 2, y + MX_HEAD_H / 2);
//       doc.rotate(-90);
//       doc.font("Helvetica-Bold").fontSize(MX_HEAD_FS).fillColor("#000000")
//          .text(MATRIX_COLS[i].label.replace("\n", " "),
//             -(MX_HEAD_H / 2) + 2, -MX_HEAD_FS / 2,
//             { width: MX_HEAD_H - 4, align: "left", lineBreak: false });
//       doc.restore();
//    }

//    // ── Row Total (Qty) header — grey background ───────────────────────────────
//    doc.moveTo(qtyTotalX, y).lineTo(qtyTotalX, y + MX_HEAD_H).strokeColor("#000000").lineWidth(0.3).stroke();
//    doc.save().rect(qtyTotalX, y, MX_QTY_TOT_W, MX_HEAD_H).fillColor("#C8E6C9").fill().restore();
//    doc.save();
//    doc.translate(qtyTotalX + MX_QTY_TOT_W / 2, y + MX_HEAD_H / 2);
//    doc.rotate(-90);
//    doc.font("Helvetica-Bold").fontSize(MX_HEAD_FS).fillColor("#000000")
//       .text("Total (Qty)", -(MX_HEAD_H / 2) + 2, -MX_HEAD_FS / 2,
//          { width: MX_HEAD_H - 4, align: "left", lineBreak: false });
//    doc.restore();

//    // ── Row Total (₹) header — yellow background ──────────────────────────────
//    doc.moveTo(amtTotalX, y).lineTo(amtTotalX, y + MX_HEAD_H).strokeColor("#000000").lineWidth(0.3).stroke();
//    doc.save().rect(amtTotalX, y, MX_AMT_TOT_W, MX_HEAD_H).fillColor("#FFF9C4").fill().restore();
//    doc.save();
//    doc.translate(amtTotalX + MX_AMT_TOT_W / 2, y + MX_HEAD_H / 2);
//    doc.rotate(-90);
//    doc.font("Helvetica-Bold").fontSize(MX_HEAD_FS).fillColor("#000000")
//       .text("Total (Rs)", -(MX_HEAD_H / 2) + 2, -MX_HEAD_FS / 2,
//          { width: MX_HEAD_H - 4, align: "left", lineBreak: false });
//    doc.restore();

//    doc.moveTo(MARGIN + TOTAL_TABLE_W, y).lineTo(MARGIN + TOTAL_TABLE_W, y + MX_HEAD_H)
//       .strokeColor("#000000").lineWidth(0.4).stroke();
// }

// // ── Rate row (light blue) ─────────────────────────────────────────────────────
// function drawRateRow(doc, colXs, y, label, rateValues) {
//    const qtyTotalX = colXs[QTY_TOT_IDX];
//    const amtTotalX = colXs[AMT_TOT_IDX];
//    const rowH      = MX_ROW_H + 1;

//    doc.save().rect(MARGIN, y, TOTAL_TABLE_W, rowH).fillColor("#E8F4FD").fill().restore();
//    doc.rect(MARGIN, y, TOTAL_TABLE_W, rowH).strokeColor("#000000").lineWidth(0.3).stroke();
//    const midY = y + (rowH - MX_FS) / 2;

//    doc.font("Helvetica-Bold").fontSize(MX_FS - 0.3).fillColor("#000000")
//       .text(label, colXs[0] + 1, midY,
//          { width: MX_DATE_W + MX_CHALLAN_W - 2, align: "left", lineBreak: false });

//    doc.moveTo(colXs[1], y).lineTo(colXs[1], y + rowH).strokeColor("#000000").lineWidth(0.2).stroke();
//    doc.moveTo(colXs[2], y).lineTo(colXs[2], y + rowH).strokeColor("#000000").lineWidth(0.2).stroke();

//    for (let i = 0; i < TOTAL_PROD_COLS; i++) {
//       const cx  = colXs[3 + i];
//       const val = rateValues[i];
//       doc.moveTo(cx, y).lineTo(cx, y + rowH).strokeColor("#000000").lineWidth(0.2).stroke();
//       if (val != null && val > 0) {
//          doc.font("Helvetica").fontSize(MX_FS - 0.3).fillColor("#1a5276")
//             .text(String(val), cx + 1, midY,
//                { width: MX_COL_W - 2, align: "right", lineBreak: false });
//       }
//    }

//    // Qty-total and Amt-total cells — blank in rate rows
//    doc.moveTo(qtyTotalX, y).lineTo(qtyTotalX, y + rowH).strokeColor("#000000").lineWidth(0.3).stroke();
//    doc.moveTo(amtTotalX, y).lineTo(amtTotalX, y + rowH).strokeColor("#000000").lineWidth(0.3).stroke();
//    doc.moveTo(MARGIN + TOTAL_TABLE_W, y).lineTo(MARGIN + TOTAL_TABLE_W, y + rowH)
//       .strokeColor("#000000").lineWidth(0.4).stroke();
// }

// // ── TOTAL row (yellow) ────────────────────────────────────────────────────────
// function drawTotalRow(doc, colXs, y, grandColTotals, grandAcre, grandQtyTotal, grandAmtTotal) {
//    const qtyTotalX = colXs[QTY_TOT_IDX];
//    const amtTotalX = colXs[AMT_TOT_IDX];
//    const rowH      = MX_ROW_H + 2;

//    doc.save().rect(MARGIN, y, TOTAL_TABLE_W, rowH).fillColor("#FFFACD").fill().restore();
//    doc.rect(MARGIN, y, TOTAL_TABLE_W, rowH).strokeColor("#000000").lineWidth(0.5).stroke();
//    const midY = y + (rowH - MX_FS) / 2;

//    doc.font("Helvetica-Bold").fontSize(MX_FS).fillColor("#000000")
//       .text("TOTAL", colXs[0] + 1, midY,
//          { width: MX_DATE_W + MX_CHALLAN_W - 2, align: "center", lineBreak: false });
//    doc.moveTo(colXs[1], y).lineTo(colXs[1], y + rowH).strokeColor("#000000").lineWidth(0.2).stroke();
//    doc.moveTo(colXs[2], y).lineTo(colXs[2], y + rowH).strokeColor("#000000").lineWidth(0.2).stroke();

//    if (grandAcre > 0) {
//       doc.font("Helvetica-Bold").fontSize(MX_FS).fillColor("#000000")
//          .text(grandAcre.toFixed(1), colXs[2] + 1, midY,
//             { width: MX_ACRES_W - 2, align: "right", lineBreak: false });
//    }

//    for (let i = 0; i < TOTAL_PROD_COLS; i++) {
//       const cx = colXs[3 + i];
//       doc.moveTo(cx, y).lineTo(cx, y + rowH).strokeColor("#000000").lineWidth(0.2).stroke();
//       if (grandColTotals[i] > 0) {
//          doc.font("Helvetica-Bold").fontSize(MX_FS).fillColor("#000000")
//             .text(String(grandColTotals[i]), cx + 1, midY,
//                { width: MX_COL_W - 2, align: "right", lineBreak: false });
//       }
//    }

//    // ── Grand Qty Total ────────────────────────────────────────────────────────
//    doc.moveTo(qtyTotalX, y).lineTo(qtyTotalX, y + rowH).strokeColor("#000000").lineWidth(0.3).stroke();
//    doc.save().rect(qtyTotalX, y, MX_QTY_TOT_W, rowH).fillColor("#A5D6A7").fill().restore();
//    doc.font("Helvetica-Bold").fontSize(MX_FS).fillColor("#000000")
//       .text(String(grandQtyTotal), qtyTotalX + 1, midY,
//          { width: MX_QTY_TOT_W - 2, align: "right", lineBreak: false });

//    // ── Grand Amt Total ────────────────────────────────────────────────────────
//    doc.moveTo(amtTotalX, y).lineTo(amtTotalX, y + rowH).strokeColor("#000000").lineWidth(0.3).stroke();
//    doc.save().rect(amtTotalX, y, MX_AMT_TOT_W, rowH).fillColor("#FFEE58").fill().restore();
//    doc.font("Helvetica-Bold").fontSize(MX_FS).fillColor("#000000")
//       .text(grandAmtTotal.toLocaleString("en-IN"), amtTotalX + 1, midY,
//          { width: MX_AMT_TOT_W - 2, align: "right", lineBreak: false });

//    doc.moveTo(MARGIN + TOTAL_TABLE_W, y).lineTo(MARGIN + TOTAL_TABLE_W, y + rowH)
//       .strokeColor("#000000").lineWidth(0.4).stroke();
// }

// // ── One data row ──────────────────────────────────────────────────────────────
// function drawDataRow(doc, colXs, y, rec, rowIdx, prodVals, rowQtyTotal, rowAmtTotal) {
//    const qtyTotalX = colXs[QTY_TOT_IDX];
//    const amtTotalX = colXs[AMT_TOT_IDX];
//    const bg        = rowIdx % 2 === 0 ? "#FFFFFF" : "#F5F5F5";

//    doc.save().rect(MARGIN, y, TOTAL_TABLE_W, MX_ROW_H).fillColor(bg).fill().restore();
//    doc.rect(MARGIN, y, TOTAL_TABLE_W, MX_ROW_H).strokeColor("#000000").lineWidth(0.3).stroke();
//    const midY = y + (MX_ROW_H - MX_FS) / 2;

//    doc.font("Helvetica").fontSize(MX_FS).fillColor("#000000")
//       .text(fmtDate(rec.date), colXs[0] + 1, midY,
//          { width: MX_DATE_W - 2, align: "center", lineBreak: false });

//    doc.moveTo(colXs[1], y).lineTo(colXs[1], y + MX_ROW_H).strokeColor("#000000").lineWidth(0.2).stroke();
//    const ct = truncate(doc, safe(rec.challanNo), "Helvetica", MX_FS, MX_CHALLAN_W - 3);
//    doc.font("Helvetica").fontSize(MX_FS).fillColor("#000000")
//       .text(ct, colXs[1] + 2, midY, { width: MX_CHALLAN_W - 3, lineBreak: false });

//    doc.moveTo(colXs[2], y).lineTo(colXs[2], y + MX_ROW_H).strokeColor("#000000").lineWidth(0.2).stroke();
//    if (rec.acre != null) {
//       doc.font("Helvetica").fontSize(MX_FS).fillColor("#000000")
//          .text(String(rec.acre), colXs[2] + 1, midY,
//             { width: MX_ACRES_W - 2, align: "right", lineBreak: false });
//    }

//    for (let i = 0; i < TOTAL_PROD_COLS; i++) {
//       const cx = colXs[3 + i];
//       doc.moveTo(cx, y).lineTo(cx, y + MX_ROW_H).strokeColor("#000000").lineWidth(0.2).stroke();
//       if (prodVals[i] > 0) {
//          doc.font("Helvetica").fontSize(MX_FS).fillColor("#000000")
//             .text(String(prodVals[i]), cx + 1, midY,
//                { width: MX_COL_W - 2, align: "right", lineBreak: false });
//       }
//    }

//    // ── Row Total (Qty) — green highlight ─────────────────────────────────────
//    doc.moveTo(qtyTotalX, y).lineTo(qtyTotalX, y + MX_ROW_H).strokeColor("#000000").lineWidth(0.3).stroke();
//    if (rowQtyTotal > 0) {
//       doc.save().rect(qtyTotalX, y, MX_QTY_TOT_W, MX_ROW_H).fillColor("#C8E6C9").fill().restore();
//       doc.font("Helvetica-Bold").fontSize(MX_FS).fillColor("#000000")
//          .text(String(rowQtyTotal), qtyTotalX + 1, midY,
//             { width: MX_QTY_TOT_W - 2, align: "right", lineBreak: false });
//    }

//    // ── Row Total (₹) — yellow highlight ──────────────────────────────────────
//    doc.moveTo(amtTotalX, y).lineTo(amtTotalX, y + MX_ROW_H).strokeColor("#000000").lineWidth(0.3).stroke();
//    if (rowAmtTotal > 0) {
//       doc.save().rect(amtTotalX, y, MX_AMT_TOT_W, MX_ROW_H).fillColor("#FFFF99").fill().restore();
//       doc.font("Helvetica-Bold").fontSize(MX_FS).fillColor("#000000")
//          .text(rowAmtTotal.toLocaleString("en-IN"), amtTotalX + 1, midY,
//             { width: MX_AMT_TOT_W - 2, align: "right", lineBreak: false });
//    }

//    doc.moveTo(MARGIN + TOTAL_TABLE_W, y).lineTo(MARGIN + TOTAL_TABLE_W, y + MX_ROW_H)
//       .strokeColor("#000000").lineWidth(0.4).stroke();
// }

// // ── Draw headers + rate rows + total row block ────────────────────────────────
// function drawPageHeader(doc, colXs, y, title, dealerName, dealerCode, financialYear, grandColTotals, grandAcre, grandQtyTotal, grandAmtTotal, rateUptoVals, rateFromVals) {
//    drawHeader(doc, title, dealerName, dealerCode, financialYear);
//    drawHeaders(doc, colXs, y);
//    y += MX_HEAD_H;

//    if (rateUptoVals) {
//       drawRateRow(doc, colXs, y, "Rates WEF 01.04.2022", rateUptoVals);
//       y += MX_ROW_H + 1;
//    }
//    if (rateFromVals) {
//       drawRateRow(doc, colXs, y, "Rates WEF 14.09.2022", rateFromVals);
//       y += MX_ROW_H + 1;
//    }

//    drawTotalRow(doc, colXs, y, grandColTotals, grandAcre, grandQtyTotal, grandAmtTotal);
//    y += MX_ROW_H + 2 + 3;
//    return y;
// }

// // ─── Main export ──────────────────────────────────────────────────────────────
// export async function generateMatrixPDF(records, res, { financialYear, dealerName, dealerCode, rates = [], dealerRates = [] } = {}) {
//    try {
//       const doc = new PDFDocument({
//          size: "A4", layout: "landscape", margin: 0, autoFirstPage: false,
//       });

//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader("Content-Disposition",
//          `attachment; filename="inventory-matrix-${fileDate()}.pdf"`);
//       doc.pipe(res);

//       const firstRec       = records[0] ?? {};
//       const resolvedDealer = dealerName ?? safe(firstRec.dealerName);
//       const resolvedCode   = dealerCode ?? safe(firstRec.farmerDealerCode);
//       const resolvedFY     = financialYear ?? safe(firstRec.financialYear);

//       // ── Rate lookup maps (dealer rate wins over global) ────────────────────
//       const globalRateMap = new Map(rates.map(r => [r.itemName, r]));
//       const dealerRateMap = new Map(dealerRates.map(r => [r.itemName, r]));

//       const rateUptoVals = MATRIX_COLS.map(col => {
//          const r = dealerRateMap.get(col.itemName) ?? globalRateMap.get(col.itemName);
//          return r ? r.rateUpto : null;
//       });
//       const rateFromVals = MATRIX_COLS.map(col => {
//          const r = dealerRateMap.get(col.itemName) ?? globalRateMap.get(col.itemName);
//          return r ? r.rateFrom : null;
//       });

//       // ── Pre-compute values ─────────────────────────────────────────────────
//       const prodValsPerRow = records.map(rec => {
//          const p = rec.products || {};
//          return MATRIX_COLS.map(col =>
//             col.keys.reduce((sum, k) => sum + (Number(p[k]) || 0), 0)
//          );
//       });

//       // ── Row Qty totals (plain item sum) ────────────────────────────────────
//       const rowQtyTotals = prodValsPerRow.map(vals =>
//          vals.reduce((s, v) => s + v, 0)
//       );

//       // ── Row Amt totals (rate × qty, date-based rate) ───────────────────────
//       const rowAmtTotals = prodValsPerRow.map((vals, ri) => {
//          const recDate = new Date(records[ri].date);
//          const useUpto = !isNaN(recDate.getTime()) && recDate < RATE_CUTOFF;
//          return vals.reduce((sum, qty, ci) => {
//             const rate = useUpto ? (rateUptoVals[ci] ?? 0) : (rateFromVals[ci] ?? 0);
//             return sum + qty * rate;
//          }, 0);
//       });

//       const grandColTotals = MATRIX_COLS.map((_, ci) =>
//          records.reduce((sum, _, ri) => sum + prodValsPerRow[ri][ci], 0)
//       );
//       const grandAcre     = records.reduce((s, r) => s + (Number(r.acre) || 0), 0);
//       const grandQtyTotal = rowQtyTotals.reduce((s, v) => s + v, 0);
//       const grandAmtTotal = rowAmtTotals.reduce((s, v) => s + v, 0);

//       const colXs       = buildColXs();
//       const PAGE_BOTTOM = PAGE_H - FOOTER_H - 6;
//       let pageNum       = 1;

//       // ── First page ─────────────────────────────────────────────────────────
//       doc.addPage({ size: "A4", layout: "landscape", margin: 0 });
//       let y = HEADER_H + 4;
//       y = drawPageHeader(doc, colXs, y,
//          "Inventory Matrix", resolvedDealer, resolvedCode, resolvedFY,
//          grandColTotals, grandAcre, grandQtyTotal, grandAmtTotal,
//          rateUptoVals, rateFromVals
//       );

//       // ── Data rows ──────────────────────────────────────────────────────────
//       for (let ri = 0; ri < records.length; ri++) {
//          if (y + MX_ROW_H > PAGE_BOTTOM) {
//             drawFooter(doc, pageNum++);
//             doc.addPage({ size: "A4", layout: "landscape", margin: 0 });
//             y = HEADER_H + 4;
//             y = drawPageHeader(doc, colXs, y,
//                "Inventory Matrix (cont.)", resolvedDealer, resolvedCode, resolvedFY,
//                grandColTotals, grandAcre, grandQtyTotal, grandAmtTotal,
//                rateUptoVals, rateFromVals
//             );
//          }

//          drawDataRow(doc, colXs, y, records[ri], ri,
//             prodValsPerRow[ri], rowQtyTotals[ri], rowAmtTotals[ri]);
//          y += MX_ROW_H;
//       }

//       // ── Bottom TOTAL row ───────────────────────────────────────────────────
//       if (y + MX_ROW_H + 4 > PAGE_BOTTOM) {
//          drawFooter(doc, pageNum++);
//          doc.addPage({ size: "A4", layout: "landscape", margin: 0 });
//          drawHeader(doc, "Inventory Matrix (cont.)", resolvedDealer, resolvedCode, resolvedFY);
//          y = HEADER_H + 4;
//       }
//       drawTotalRow(doc, colXs, y + 2, grandColTotals, grandAcre, grandQtyTotal, grandAmtTotal);

//       drawFooter(doc, pageNum++);
//       doc.end();

//    } catch (err) {
//       console.error("Matrix PDF error:", err);
//       if (!res.headersSent) {
//          res.status(500).json({ message: "Failed to generate Matrix PDF" });
//       }
//    }
// }















import PDFDocument from "pdfkit";

const MARGIN    = 15;
const FOOTER_H  = 16;
const HEADER_H  = 40;

// ── Landscape A4 ──────────────────────────────────────────────────────────────
const PAGE_W = 841.89;
const PAGE_H = 595.28;
const CW     = PAGE_W - 2 * MARGIN;

// ── Layout constants ──────────────────────────────────────────────────────────
const MX_DATE_W    = 44;
const MX_CHALLAN_W = 62;
const MX_ACRES_W   = 22;
const MX_QTY_TOT_W = 28;
const MX_AMT_TOT_W = 45;
const MX_FIXED_W   = MX_DATE_W + MX_CHALLAN_W + MX_ACRES_W;

const MX_ROW_H   = 9;
const MX_HEAD_H  = 38;
const MX_FS      = 3;
const MX_HEAD_FS = 4.2;

// ─── Product column definitions ───────────────────────────────────────────────
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

const MX_COL_W      = Math.floor((CW - MX_FIXED_W - MX_QTY_TOT_W - MX_AMT_TOT_W) / TOTAL_PROD_COLS);
const TOTAL_TABLE_W = MX_FIXED_W + TOTAL_PROD_COLS * MX_COL_W + MX_QTY_TOT_W + MX_AMT_TOT_W;

const RATE_CUTOFF = new Date("2022-09-14");

// ─── Helpers ──────────────────────────────────────────────────────────────────
function safe(v) { return v != null && v !== "" ? String(v) : "—"; }
function today() { return new Date().toLocaleDateString("en-IN"); }
function fileDate() { return new Date().toISOString().split("T")[0]; }
function fmtDate(val) {
   if (!val) return "—";
   const d = new Date(val);
   if (isNaN(d.getTime())) return "—";
   const dd = String(d.getDate()).padStart(2, "0");
   const mm = String(d.getMonth() + 1).padStart(2, "0");
   return `${dd}/${mm}/${d.getFullYear()}`;
}

// ✅ Indian number format — rounds to integer, adds commas (e.g. 6,710 or 83,04,447)
function fmtNum(val) {
   return Math.round(val).toLocaleString("en-IN");
}

function truncate(doc, text, font, size, maxW) {
   doc.font(font).fontSize(size);
   if (doc.widthOfString(text) <= maxW) return text;
   let t = text;
   while (t.length > 0 && doc.widthOfString(t + "…") > maxW) t = t.slice(0, -1);
   return t + "…";
}

function buildColXs() {
   const xs = [];
   let x = MARGIN;
   xs.push(x); x += MX_DATE_W;
   xs.push(x); x += MX_CHALLAN_W;
   xs.push(x); x += MX_ACRES_W;
   for (let i = 0; i < TOTAL_PROD_COLS; i++) { xs.push(x); x += MX_COL_W; }
   xs.push(x); x += MX_QTY_TOT_W;
   xs.push(x);
   return xs;
}

const QTY_TOT_IDX = 3 + TOTAL_PROD_COLS;
const AMT_TOT_IDX = 3 + TOTAL_PROD_COLS + 1;

// ── Header ────────────────────────────────────────────────────────────────────
function drawHeader(doc, title, dealerName, dealerCode, financialYear) {
   doc.moveTo(MARGIN, HEADER_H - 4).lineTo(MARGIN + CW, HEADER_H - 4)
      .strokeColor("#000000").lineWidth(0.8).stroke();
   doc.font("Helvetica-Bold").fontSize(11).fillColor("#000000")
      .text(title, MARGIN, 8, { lineBreak: false });
   if (financialYear) {
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000")
         .text(`FY: ${financialYear}`, 0, 10,
            { align: "right", width: PAGE_W - MARGIN, lineBreak: false });
   }
   const parts = [];
   if (dealerName && dealerName !== "—") parts.push(`Dealer: ${dealerName}`);
   if (dealerCode && dealerCode !== "—") parts.push(`Code: ${dealerCode}`);
   if (parts.length > 0) {
      doc.font("Helvetica-Bold").fontSize(7).fillColor("#000000")
         .text(parts.join("   |   "), MARGIN, 24, { lineBreak: false });
   }
   doc.font("Helvetica").fontSize(6).fillColor("#000000")
      .text(`Generated: ${today()}`, 0, 26,
         { align: "right", width: PAGE_W - MARGIN, lineBreak: false });
}

// ── Footer ────────────────────────────────────────────────────────────────────
function drawFooter(doc, pageNum) {
   const fy = PAGE_H - FOOTER_H;
   doc.moveTo(MARGIN, fy).lineTo(MARGIN + CW, fy)
      .strokeColor("#000000").lineWidth(0.4).stroke();
   doc.font("Helvetica").fontSize(6).fillColor("#000000")
      .text(`Page ${pageNum}`, MARGIN, fy + 4,
         { width: CW, align: "center", lineBreak: false });
}

// ── Column headers ────────────────────────────────────────────────────────────
function drawHeaders(doc, colXs, y) {
   const qtyTotalX = colXs[QTY_TOT_IDX];
   const amtTotalX = colXs[AMT_TOT_IDX];

   doc.save().rect(MARGIN, y, TOTAL_TABLE_W, MX_HEAD_H).fillColor("#DDDDDD").fill().restore();
   doc.rect(MARGIN, y, TOTAL_TABLE_W, MX_HEAD_H).strokeColor("#000000").lineWidth(0.4).stroke();

   const fixed = [
      { label: "Date",       x: colXs[0], w: MX_DATE_W },
      { label: "Challan No", x: colXs[1], w: MX_CHALLAN_W },
      { label: "Acres",      x: colXs[2], w: MX_ACRES_W },
   ];
   for (const f of fixed) {
      if (f.x > MARGIN) {
         doc.moveTo(f.x, y).lineTo(f.x, y + MX_HEAD_H).strokeColor("#000000").lineWidth(0.3).stroke();
      }
      doc.font("Helvetica-Bold").fontSize(MX_HEAD_FS).fillColor("#000000")
         .text(f.label, f.x + 1, y + (MX_HEAD_H - MX_HEAD_FS) / 2,
            { width: f.w - 2, align: "center", lineBreak: false });
   }

   for (let i = 0; i < TOTAL_PROD_COLS; i++) {
      const cx = colXs[3 + i];
      doc.moveTo(cx, y).lineTo(cx, y + MX_HEAD_H).strokeColor("#000000").lineWidth(0.2).stroke();
      doc.save();
      doc.translate(cx + MX_COL_W / 2, y + MX_HEAD_H / 2);
      doc.rotate(-90);
      doc.font("Helvetica-Bold").fontSize(MX_HEAD_FS).fillColor("#000000")
         .text(MATRIX_COLS[i].label.replace("\n", " "),
            -(MX_HEAD_H / 2) + 2, -MX_HEAD_FS / 2,
            { width: MX_HEAD_H - 4, align: "left", lineBreak: false });
      doc.restore();
   }

   // Total (Qty) header
   doc.moveTo(qtyTotalX, y).lineTo(qtyTotalX, y + MX_HEAD_H).strokeColor("#000000").lineWidth(0.3).stroke();
   doc.save().rect(qtyTotalX, y, MX_QTY_TOT_W, MX_HEAD_H).fillColor("#C8E6C9").fill().restore();
   doc.save();
   doc.translate(qtyTotalX + MX_QTY_TOT_W / 2, y + MX_HEAD_H / 2);
   doc.rotate(-90);
   doc.font("Helvetica-Bold").fontSize(MX_HEAD_FS).fillColor("#000000")
      .text("Total (Qty)", -(MX_HEAD_H / 2) + 2, -MX_HEAD_FS / 2,
         { width: MX_HEAD_H - 4, align: "left", lineBreak: false });
   doc.restore();

   // Total (Rs) header
   doc.moveTo(amtTotalX, y).lineTo(amtTotalX, y + MX_HEAD_H).strokeColor("#000000").lineWidth(0.3).stroke();
   doc.save().rect(amtTotalX, y, MX_AMT_TOT_W, MX_HEAD_H).fillColor("#FFF9C4").fill().restore();
   doc.save();
   doc.translate(amtTotalX + MX_AMT_TOT_W / 2, y + MX_HEAD_H / 2);
   doc.rotate(-90);
   doc.font("Helvetica-Bold").fontSize(MX_HEAD_FS).fillColor("#000000")
      .text("Total (Rs)", -(MX_HEAD_H / 2) + 2, -MX_HEAD_FS / 2,
         { width: MX_HEAD_H - 4, align: "left", lineBreak: false });
   doc.restore();

   doc.moveTo(MARGIN + TOTAL_TABLE_W, y).lineTo(MARGIN + TOTAL_TABLE_W, y + MX_HEAD_H)
      .strokeColor("#000000").lineWidth(0.4).stroke();
}

// ── Rate row ──────────────────────────────────────────────────────────────────
function drawRateRow(doc, colXs, y, label, rateValues) {
   const qtyTotalX = colXs[QTY_TOT_IDX];
   const amtTotalX = colXs[AMT_TOT_IDX];
   const rowH      = MX_ROW_H + 1;

   doc.save().rect(MARGIN, y, TOTAL_TABLE_W, rowH).fillColor("#E8F4FD").fill().restore();
   doc.rect(MARGIN, y, TOTAL_TABLE_W, rowH).strokeColor("#000000").lineWidth(0.3).stroke();
   const midY = y + (rowH - MX_FS) / 2;

   doc.font("Helvetica-Bold").fontSize(MX_FS - 0.3).fillColor("#000000")
      .text(label, colXs[0] + 1, midY,
         { width: MX_DATE_W + MX_CHALLAN_W - 2, align: "left", lineBreak: false });

   doc.moveTo(colXs[1], y).lineTo(colXs[1], y + rowH).strokeColor("#000000").lineWidth(0.2).stroke();
   doc.moveTo(colXs[2], y).lineTo(colXs[2], y + rowH).strokeColor("#000000").lineWidth(0.2).stroke();

   for (let i = 0; i < TOTAL_PROD_COLS; i++) {
      const cx  = colXs[3 + i];
      const val = rateValues[i];
      doc.moveTo(cx, y).lineTo(cx, y + rowH).strokeColor("#000000").lineWidth(0.2).stroke();
      if (val != null && val > 0) {
         doc.font("Helvetica").fontSize(MX_FS - 0.3).fillColor("#1a5276")
            .text(String(val), cx + 1, midY,
               { width: MX_COL_W - 2, align: "right", lineBreak: false });
      }
   }

   doc.moveTo(qtyTotalX, y).lineTo(qtyTotalX, y + rowH).strokeColor("#000000").lineWidth(0.3).stroke();
   doc.moveTo(amtTotalX, y).lineTo(amtTotalX, y + rowH).strokeColor("#000000").lineWidth(0.3).stroke();
   doc.moveTo(MARGIN + TOTAL_TABLE_W, y).lineTo(MARGIN + TOTAL_TABLE_W, y + rowH)
      .strokeColor("#000000").lineWidth(0.4).stroke();
}

// ── TOTAL row ─────────────────────────────────────────────────────────────────
function drawTotalRow(doc, colXs, y, grandColTotals, grandAcre, grandQtyTotal, grandAmtTotal) {
   const qtyTotalX = colXs[QTY_TOT_IDX];
   const amtTotalX = colXs[AMT_TOT_IDX];
   const rowH      = MX_ROW_H + 2;

   doc.save().rect(MARGIN, y, TOTAL_TABLE_W, rowH).fillColor("#FFFACD").fill().restore();
   doc.rect(MARGIN, y, TOTAL_TABLE_W, rowH).strokeColor("#000000").lineWidth(0.5).stroke();
   const midY = y + (rowH - MX_FS) / 2;

   doc.font("Helvetica-Bold").fontSize(MX_FS).fillColor("#000000")
      .text("TOTAL", colXs[0] + 1, midY,
         { width: MX_DATE_W + MX_CHALLAN_W - 2, align: "center", lineBreak: false });
   doc.moveTo(colXs[1], y).lineTo(colXs[1], y + rowH).strokeColor("#000000").lineWidth(0.2).stroke();
   doc.moveTo(colXs[2], y).lineTo(colXs[2], y + rowH).strokeColor("#000000").lineWidth(0.2).stroke();

   if (grandAcre > 0) {
      doc.font("Helvetica-Bold").fontSize(MX_FS).fillColor("#000000")
         .text(grandAcre.toFixed(1), colXs[2] + 1, midY,
            { width: MX_ACRES_W - 2, align: "right", lineBreak: false });
   }

   for (let i = 0; i < TOTAL_PROD_COLS; i++) {
      const cx = colXs[3 + i];
      doc.moveTo(cx, y).lineTo(cx, y + rowH).strokeColor("#000000").lineWidth(0.2).stroke();
      if (grandColTotals[i] > 0) {
         // ✅ FIXED: Indian format for product column totals
         doc.font("Helvetica-Bold").fontSize(MX_FS).fillColor("#000000")
            .text(fmtNum(grandColTotals[i]), cx + 1, midY,
               { width: MX_COL_W - 2, align: "right", lineBreak: false });
      }
   }

   // ✅ FIXED: Indian format for Grand Qty Total
   doc.moveTo(qtyTotalX, y).lineTo(qtyTotalX, y + rowH).strokeColor("#000000").lineWidth(0.3).stroke();
   doc.save().rect(qtyTotalX, y, MX_QTY_TOT_W, rowH).fillColor("#A5D6A7").fill().restore();
   doc.font("Helvetica-Bold").fontSize(MX_FS - 0.5).fillColor("#000000")
      .text(fmtNum(grandQtyTotal), qtyTotalX + 1, midY,
         { width: MX_QTY_TOT_W - 2, align: "right", lineBreak: false });

   // ✅ FIXED: Indian format for Grand Amt Total
   doc.moveTo(amtTotalX, y).lineTo(amtTotalX, y + rowH).strokeColor("#000000").lineWidth(0.3).stroke();
   doc.save().rect(amtTotalX, y, MX_AMT_TOT_W, rowH).fillColor("#FFEE58").fill().restore();
   doc.font("Helvetica-Bold").fontSize(MX_FS - 0.5).fillColor("#000000")
      .text(fmtNum(grandAmtTotal), amtTotalX + 1, midY,
         { width: MX_AMT_TOT_W - 2, align: "right", lineBreak: false });

   doc.moveTo(MARGIN + TOTAL_TABLE_W, y).lineTo(MARGIN + TOTAL_TABLE_W, y + rowH)
      .strokeColor("#000000").lineWidth(0.4).stroke();
}

// ── One data row ──────────────────────────────────────────────────────────────
function drawDataRow(doc, colXs, y, rec, rowIdx, prodVals, rowQtyTotal, rowAmtTotal) {
   const qtyTotalX = colXs[QTY_TOT_IDX];
   const amtTotalX = colXs[AMT_TOT_IDX];
   const bg        = rowIdx % 2 === 0 ? "#FFFFFF" : "#F5F5F5";

   doc.save().rect(MARGIN, y, TOTAL_TABLE_W, MX_ROW_H).fillColor(bg).fill().restore();
   doc.rect(MARGIN, y, TOTAL_TABLE_W, MX_ROW_H).strokeColor("#000000").lineWidth(0.3).stroke();
   const midY = y + (MX_ROW_H - MX_FS) / 2;

   doc.font("Helvetica").fontSize(MX_FS).fillColor("#000000")
      .text(fmtDate(rec.date), colXs[0] + 1, midY,
         { width: MX_DATE_W - 2, align: "center", lineBreak: false });

   doc.moveTo(colXs[1], y).lineTo(colXs[1], y + MX_ROW_H).strokeColor("#000000").lineWidth(0.2).stroke();
   const ct = truncate(doc, safe(rec.challanNo), "Helvetica", MX_FS, MX_CHALLAN_W - 3);
   doc.font("Helvetica").fontSize(MX_FS).fillColor("#000000")
      .text(ct, colXs[1] + 2, midY, { width: MX_CHALLAN_W - 3, lineBreak: false });

   doc.moveTo(colXs[2], y).lineTo(colXs[2], y + MX_ROW_H).strokeColor("#000000").lineWidth(0.2).stroke();
   if (rec.acre != null) {
      doc.font("Helvetica").fontSize(MX_FS).fillColor("#000000")
         .text(String(rec.acre), colXs[2] + 1, midY,
            { width: MX_ACRES_W - 2, align: "right", lineBreak: false });
   }

   for (let i = 0; i < TOTAL_PROD_COLS; i++) {
      const cx = colXs[3 + i];
      doc.moveTo(cx, y).lineTo(cx, y + MX_ROW_H).strokeColor("#000000").lineWidth(0.2).stroke();
      if (prodVals[i] > 0) {
         // ✅ FIXED: Indian format for each product cell
         doc.font("Helvetica").fontSize(MX_FS).fillColor("#000000")
            .text(fmtNum(prodVals[i]), cx + 1, midY,
               { width: MX_COL_W - 2, align: "right", lineBreak: false });
      }
   }

   // ✅ FIXED: Indian format for Row Qty Total
   doc.moveTo(qtyTotalX, y).lineTo(qtyTotalX, y + MX_ROW_H).strokeColor("#000000").lineWidth(0.3).stroke();
   if (rowQtyTotal > 0) {
      doc.save().rect(qtyTotalX, y, MX_QTY_TOT_W, MX_ROW_H).fillColor("#C8E6C9").fill().restore();
      doc.font("Helvetica-Bold").fontSize(MX_FS - 0.5).fillColor("#000000")
         .text(fmtNum(rowQtyTotal), qtyTotalX + 1, midY,
            { width: MX_QTY_TOT_W - 2, align: "right", lineBreak: false });
   }

   // ✅ FIXED: Indian format for Row Amt Total
   doc.moveTo(amtTotalX, y).lineTo(amtTotalX, y + MX_ROW_H).strokeColor("#000000").lineWidth(0.3).stroke();
   if (rowAmtTotal > 0) {
      doc.save().rect(amtTotalX, y, MX_AMT_TOT_W, MX_ROW_H).fillColor("#FFFF99").fill().restore();
      doc.font("Helvetica-Bold").fontSize(MX_FS - 0.5).fillColor("#000000")
         .text(fmtNum(rowAmtTotal), amtTotalX + 1, midY,
            { width: MX_AMT_TOT_W - 2, align: "right", lineBreak: false });
   }

   doc.moveTo(MARGIN + TOTAL_TABLE_W, y).lineTo(MARGIN + TOTAL_TABLE_W, y + MX_ROW_H)
      .strokeColor("#000000").lineWidth(0.4).stroke();
}

// ── Page header block ─────────────────────────────────────────────────────────
function drawPageHeader(doc, colXs, y, title, dealerName, dealerCode, financialYear, grandColTotals, grandAcre, grandQtyTotal, grandAmtTotal, rateUptoVals, rateFromVals) {
   drawHeader(doc, title, dealerName, dealerCode, financialYear);
   drawHeaders(doc, colXs, y);
   y += MX_HEAD_H;

   if (rateUptoVals) {
      drawRateRow(doc, colXs, y, "Rates WEF 01.04.2022", rateUptoVals);
      y += MX_ROW_H + 1;
   }
   if (rateFromVals) {
      drawRateRow(doc, colXs, y, "Rates WEF 14.09.2022", rateFromVals);
      y += MX_ROW_H + 1;
   }

   drawTotalRow(doc, colXs, y, grandColTotals, grandAcre, grandQtyTotal, grandAmtTotal);
   y += MX_ROW_H + 2 + 3;
   return y;
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function generateMatrixPDF(records, res, { financialYear, dealerName, dealerCode, rates = [], dealerRates = [] } = {}) {
   try {
      const doc = new PDFDocument({
         size: "A4", layout: "landscape", margin: 0, autoFirstPage: false,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition",
         `attachment; filename="inventory-matrix-${fileDate()}.pdf"`);
      doc.pipe(res);

      const firstRec       = records[0] ?? {};
      const resolvedDealer = dealerName ?? safe(firstRec.dealerName);
      const resolvedCode   = dealerCode ?? safe(firstRec.farmerDealerCode);
      const resolvedFY     = financialYear ?? safe(firstRec.financialYear);

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

      const prodValsPerRow = records.map(rec => {
         const p = rec.products || {};
         return MATRIX_COLS.map(col =>
            col.keys.reduce((sum, k) => sum + (Number(p[k]) || 0), 0)
         );
      });

      const rowQtyTotals = prodValsPerRow.map(vals =>
         vals.reduce((s, v) => s + v, 0)
      );

      const rowAmtTotals = prodValsPerRow.map((vals, ri) => {
         const recDate = new Date(records[ri].date);
         const useUpto = !isNaN(recDate.getTime()) && recDate < RATE_CUTOFF;
         return vals.reduce((sum, qty, ci) => {
            const rate = useUpto ? (rateUptoVals[ci] ?? 0) : (rateFromVals[ci] ?? 0);
            return sum + qty * rate;
         }, 0);
      });

      const grandColTotals = MATRIX_COLS.map((_, ci) =>
         records.reduce((sum, _, ri) => sum + prodValsPerRow[ri][ci], 0)
      );
      const grandAcre     = records.reduce((s, r) => s + (Number(r.acre) || 0), 0);
      const grandQtyTotal = rowQtyTotals.reduce((s, v) => s + v, 0);
      const grandAmtTotal = rowAmtTotals.reduce((s, v) => s + v, 0);

      const colXs       = buildColXs();
      const PAGE_BOTTOM = PAGE_H - FOOTER_H - 6;
      let pageNum       = 1;

      doc.addPage({ size: "A4", layout: "landscape", margin: 0 });
      let y = HEADER_H + 4;
      y = drawPageHeader(doc, colXs, y,
         "Inventory Matrix", resolvedDealer, resolvedCode, resolvedFY,
         grandColTotals, grandAcre, grandQtyTotal, grandAmtTotal,
         rateUptoVals, rateFromVals
      );

      for (let ri = 0; ri < records.length; ri++) {
         if (y + MX_ROW_H > PAGE_BOTTOM) {
            drawFooter(doc, pageNum++);
            doc.addPage({ size: "A4", layout: "landscape", margin: 0 });
            y = HEADER_H + 4;
            y = drawPageHeader(doc, colXs, y,
               "Inventory Matrix (cont.)", resolvedDealer, resolvedCode, resolvedFY,
               grandColTotals, grandAcre, grandQtyTotal, grandAmtTotal,
               rateUptoVals, rateFromVals
            );
         }

         drawDataRow(doc, colXs, y, records[ri], ri,
            prodValsPerRow[ri], rowQtyTotals[ri], rowAmtTotals[ri]);
         y += MX_ROW_H;
      }

      if (y + MX_ROW_H + 4 > PAGE_BOTTOM) {
         drawFooter(doc, pageNum++);
         doc.addPage({ size: "A4", layout: "landscape", margin: 0 });
         drawHeader(doc, "Inventory Matrix (cont.)", resolvedDealer, resolvedCode, resolvedFY);
         y = HEADER_H + 4;
      }
      drawTotalRow(doc, colXs, y + 2, grandColTotals, grandAcre, grandQtyTotal, grandAmtTotal);

      drawFooter(doc, pageNum++);
      doc.end();

   } catch (err) {
      console.error("Matrix PDF error:", err);
      if (!res.headersSent) {
         res.status(500).json({ message: "Failed to generate Matrix PDF" });
      }
   }
}