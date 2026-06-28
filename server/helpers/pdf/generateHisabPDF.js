
import PDFDocument from "pdfkit";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 24;
const CW = PAGE_W - 2 * MARGIN;
const ROW_H = 22;
const SECTION_H = 26;

const C = {
	brandDark: "#000000",
	white: "#FFFFFF",
	textPri: "#000000",
	textMuted: "#000000",
	rowAlt: "#FFFFFF",
	border: "#000000",
	borderLt: "#000000",
	redDark: "#000000",
	redLight: "#FFFFFF",
	amberDark: "#000000",
	amberLight: "#FFFFFF",
	greenLight: "#FFFFFF",
};

const safe = (v) => (v != null && v !== "" ? String(v) : "—");

const fmtNum = (n) => {
	if (n == null) return "—";
	const num = Number(n);
	return isNaN(num) ? "—" : Math.abs(num).toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

const fmtRound = (n, negative = false) => {
	if (n == null) return "—";
	const num = Number(n);
	if (isNaN(num)) return "—";
	const str = Math.round(Math.abs(num)).toLocaleString("en-IN");
	return negative ? "(" + str + ")" : str;
};

const fmt = (n) => {
	if (n == null) return "—";
	const num = Number(n);
	return isNaN(num) ? "—" : num.toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

const todayLabel = () => new Date().toLocaleDateString("en-IN");
const filenameDate = () => new Date().toISOString().split("T")[0];

// ─── Full-width row card ─────────────────────────────────────────────────
function drawCard(doc, title, rows, x, y, w, titleBg, titleFg) {
	const totalH = SECTION_H + rows.length * ROW_H;
	doc.save().rect(x, y, w, totalH).strokeColor("#000000").lineWidth(0.5).stroke().restore();

	doc.save().rect(x, y, w, SECTION_H).fillColor("#FFFFFF").fill().restore();
	doc.save().rect(x, y, w, SECTION_H).strokeColor("#000000").lineWidth(0.5).stroke().restore();
	doc.font("Helvetica-Bold").fontSize(10).fillColor("#000000")
		.text(title.toUpperCase(), x + 8, y + (SECTION_H - 10) / 2, { width: w - 16, lineBreak: false });

	let cy = y + SECTION_H;
	for (let i = 0; i < rows.length; i++) {
		const [label, value, highlight] = rows[i];

		doc.save().rect(x, cy, w, ROW_H).fillColor("#FFFFFF").fill().restore();

		doc.moveTo(x, cy + ROW_H).lineTo(x + w, cy + ROW_H)
			.strokeColor("#000000").lineWidth(0.2).stroke();

		doc.font("Helvetica").fontSize(10).fillColor("#000000")
			.text(label, x + 8, cy + (ROW_H - 10) / 2, { width: w * 0.55, lineBreak: false });

		doc.font(highlight ? "Helvetica-Bold" : "Helvetica")
			.fontSize(10)
			.fillColor("#000000")
			.text(value, x + w * 0.55, cy + (ROW_H - 10) / 2,
				{ width: w * 0.42, align: "right", lineBreak: false });

		cy += ROW_H;
	}
	return cy;
}

// ─── Mini/Drip qty table (2-column, full-width) ──────────────────────────
function drawQtyTable(doc, tableData, x, y, w) {
	const rowHeight = 22;
	const col1W = w * 0.65;
	const col2W = w * 0.35;

	doc.save().rect(x, y, w, tableData.length * rowHeight)
		.strokeColor("#000000").lineWidth(0.5).stroke().restore();

	tableData.forEach((row, idx) => {
		const [col1, col2] = row;
		const cellY = y + idx * rowHeight;
		const isHeader = idx === 0;

		doc.rect(x, cellY, w, rowHeight).fillColor("#FFFFFF").fill();

		doc.moveTo(x, cellY + rowHeight).lineTo(x + w, cellY + rowHeight)
			.strokeColor("#000000").lineWidth(0.2).stroke();

		doc.font(isHeader ? "Helvetica-Bold" : "Helvetica")
			.fontSize(10).fillColor("#000000")
			.text(String(col1), x + 8, cellY + (rowHeight - 10) / 2,
				{ width: col1W - 16, lineBreak: false });

		doc.font(isHeader ? "Helvetica-Bold" : "Helvetica")
			.fontSize(10).fillColor("#000000")
			.text(String(col2), x + col1W, cellY + (rowHeight - 10) / 2,
				{ width: col2W - 8, align: "right", lineBreak: false });
	});

	return y + tableData.length * rowHeight;
}

// ─── Excess Breakdown Table (Landscape, Page 2) ───────────────────────────
function drawExcessTable(doc, items, y, financialYear, xOffset = 0) {
	const rh = 16;
	const pad = 3;
	const tableW = 841.89 - 2 * xOffset;

	const colWidths = [148, 66, 68, 66, 72, 76, 86, 58, 82, tableW - (148+66+68+66+72+76+86+58+82)];
	const headers = [
		"Particular", "Dispatch", "Billed Qty",
		"Difference", "Subsidy Rate", "Amount",
		"Cash for expense", "GST", "Extra subsidy", "1/3 share"
	];

	// ── Header row ───────────────────────────────────────────────────────
	let cx = xOffset;
	headers.forEach((h, i) => {
		const w = colWidths[i];
		doc.rect(cx, y, w, rh).fillColor("#FFFFFF").fill();
		doc.font("Helvetica-Bold")
			.fontSize(i === headers.length - 1 ? 7.5 : 8)
			.fillColor("#000000")
			.text(h, cx + pad, y + pad,
				{ width: w - 2 * pad, height: rh - 2 * pad, align: i > 0 ? "right" : "left" });
		doc.strokeColor("#000000").lineWidth(0.5).rect(cx, y, w, rh).stroke();
		cx += w;
	});
	y += rh;

	if (Array.isArray(items)) {
		items.forEach((item, ri) => {
			cx = xOffset;
			const roundQty  = ri <= 1;
			const roundRate = ri >= 2;

			const fmtBilled = (n) => roundQty  ? fmtRound(n || 0) : fmt(n || 0);
			const fmtDiff   = (n) => roundQty  ? fmtRound(n || 0) : fmt(n || 0);
			const fmtRate   = (n) => roundRate ? fmtRound(n || 0) : fmtNum(n || 0);

			const row = [
				item.label || "",
				fmt(item.dispatchQty || 0),
				fmtBilled(item.billedQty),
				fmtDiff(item.diff),
				fmtRate(item.rate),
				fmtRound(item.amount       || 0),
				fmtRound(item.cashForExp   || 0),
				fmtRound(item.gst          || 0),
				fmtRound(item.extraSubsidy || 0),
				fmtRound(item.oneThirdShare|| 0),
			];
			row.forEach((cell, ci) => {
				const w = colWidths[ci];
				doc.rect(cx, y, w, rh).fillColor("#FFFFFF").fill();
				doc.font("Helvetica").fontSize(8).fillColor("#000000")
					.text(String(cell), cx + pad, y + pad,
						{ width: w - 2 * pad, height: rh - 2 * pad, align: ci > 0 ? "right" : "left" });
				doc.strokeColor("#000000").lineWidth(0.5).rect(cx, y, w, rh).stroke();
				cx += w;
			});
			y += rh;
		});
	}

	if (Array.isArray(items) && items.length > 0) {
		const sum = (f) => items.reduce((s, r) => s + (r[f] || 0), 0);
		cx = xOffset;
		const totals = [
			"Total Extra Excess Expense", "", "", "", "",
			fmtRound(sum("amount")),
			fmtRound(sum("cashForExp")),
			fmtRound(sum("gst")),
			fmtRound(sum("extraSubsidy")),
			fmtRound(sum("oneThirdShare")),
		];
		totals.forEach((cell, ci) => {
			const w = colWidths[ci];
			doc.rect(cx, y, w, rh).fillColor("#FFFFFF").fill();
			doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000")
				.text(String(cell), cx + pad, y + pad,
					{ width: w - 2 * pad, height: rh - 2 * pad, align: ci > 0 ? "right" : "left" });
			doc.strokeColor("#000000").lineWidth(0.5).rect(cx, y, w, rh).stroke();
			cx += w;
		});
	}
}

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────
export async function generateHisabPDF(detail, res, { financialYear } = {}) {
	try {
		const dealerName = detail.dealerName || detail.farmerDealerCode || "Dealer";

		let miniDispatch = 0, dripDispatch = 0, billedMini = 0, billedDrip = 0;
		if (Array.isArray(detail.excessBreakdown)) {
			detail.excessBreakdown.forEach(item => {
				if (item.label?.includes("Extra Billing Mini")) {
					miniDispatch = item.dispatchQty || 0;
					billedMini   = item.billedQty   || 0;
				}
				if (item.label?.includes("Extra Billing Drip")) {
					dripDispatch = item.dispatchQty || 0;
					billedDrip   = item.billedQty   || 0;
				}
			});
		}

		const doc = new PDFDocument({ size: "A4", layout: "portrait", margin: 0, autoFirstPage: false });
		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition",
			`attachment; filename="hisab-${detail.farmerDealerCode}-${filenameDate()}.pdf"`);
		doc.pipe(res);

		// ══════════════════════════════════════════════════════════════════
		// PAGE 1 – PORTRAIT A4
		// ══════════════════════════════════════════════════════════════════
		doc.addPage({ size: "A4", layout: "portrait", margin: 0 });

		const today = todayLabel();
		let y = 0;

		// ── Header bar ───────────────────────────────────────────────────
		const headerH = 48;
		doc.rect(0, y, PAGE_W, headerH).fillColor("#FFFFFF").fill();
		doc.rect(0, y, PAGE_W, headerH).strokeColor("#000000").lineWidth(0.5).stroke();

		doc.font("Helvetica-Bold").fontSize(16).fillColor("#000000")
			.text("Dealer Hisab", 14, y + (headerH - 16) / 2, { lineBreak: false });

		doc.font("Helvetica-Bold").fontSize(14).fillColor("#000000")
			.text(dealerName, 130, y + (headerH - 14) / 2, { lineBreak: false });

		doc.font("Helvetica").fontSize(10).fillColor("#000000")
			.text(`FY: ${financialYear || detail.financialYear || "—"}   |   Date: ${today}`,
				0, y + (headerH - 10) / 2,
				{ width: PAGE_W - 14, align: "right", lineBreak: false });

		y += headerH;

		// ── Sub-info bar ──────────────────────────────────────────────────
		const subH = 28;
		doc.rect(0, y, PAGE_W, subH).fillColor("#FFFFFF").fill();
		doc.rect(0, y, PAGE_W, subH).strokeColor("#000000").lineWidth(0.5).stroke();

		doc.font("Helvetica-Bold").fontSize(11).fillColor("#000000")
			.text(dealerName, 14, y + (subH - 11) / 2, { lineBreak: false });

		const infoRight = `Code: ${safe(detail.farmerDealerCode)}   |   FY: ${safe(detail.financialYear || financialYear)}  `;
		doc.font("Helvetica").fontSize(10).fillColor("#000000")
			.text(infoRight, 0, y + (subH - 10) / 2,
				{ width: PAGE_W - 14, align: "right", lineBreak: false });

		y += subH + 8;

		// ── (Amount in Rs.) note ──────────────────────────────────────────
		doc.font("Helvetica-Oblique").fontSize(9).fillColor("#000000")
			.text("(Amount in Rs.)", MARGIN, y, { width: CW, align: "right", lineBreak: false });
		y += 14;

		// ── ROW 1: Dealer Info ────────────────────────────────────────────
		// drawCard(doc, "Dealer Info", [
		// 	["Name",           dealerName],
		// 	["Code",           safe(detail.farmerDealerCode)],
		// 	["Financial Year", safe(detail.financialYear || financialYear)],
		// ], MARGIN, y, CW, "#FFFFFF", "#000000");
		// y += SECTION_H + 3 * ROW_H + 6;

		// ── ROW 2: Mini / Drip Dispatch ───────────────────────────────────
		y = drawQtyTable(doc, [
			["Description",      "Amount"],
			["Mini Dispatch",   fmt(miniDispatch)],
			["Drip Dispatch",   fmt(dripDispatch)],
			["Billed Qty MINI", fmt(billedMini)],
			["Billed Qty DRIP", fmt(billedDrip)],
		], MARGIN, y, CW);
		y += 6;

		// ── Opening Balance card ──────────────────────────────────────────
		drawCard(doc, "Opening Balance", [
			["Previous Year Balance", fmtRound(detail.openingBalance), true],
		], MARGIN, y, CW, "#FFFFFF", "#000000");
		y += SECTION_H + 1 * ROW_H + 6;

		// ── ROW 3: B — Total Dues ─────────────────────────────────────────
		drawCard(doc, "A — Total Dues", [
			["Inventory Cost",    fmtRound(detail.sideA?.inventoryCost)],
			["GST on Billing",    fmtRound(detail.sideA?.gstOnBilling)],
			["Cash for Expenses", fmtRound(detail.sideA?.cashForExpenses)],
			["Excess Expense",    fmtRound(detail.sideA?.excessExpense)],
			["Total",             fmtRound(detail.sideA?.total), true],
		], MARGIN, y, CW, "#FFFFFF", "#000000");
		y += SECTION_H + 5 * ROW_H + 6;

		// ── ROW 4: C — Receipts ───────────────────────────────────────────
		drawCard(doc, "B — Receipts", [
			["Farmer Share Rcvd", fmtRound(detail.sideB?.farmerShareReceived)],
			["FS Adjusted",       fmtRound(detail.sideB?.fsAdjusted)],
			["Subsidy Received",  fmtRound(detail.sideB?.subsidyReceived)],
			["Incentives",        fmtRound(detail.sideB?.incentives)],
			["Total",             fmtRound(detail.sideB?.total), true],
		], MARGIN, y, CW, "#FFFFFF", "#000000");
		y += SECTION_H + 5 * ROW_H + 6;

		// ── ROW 5: Net Balance ────────────────────────────────────────────
		const rawBal  = (detail.sideA?.total ?? 0) - (detail.sideB?.total ?? 0);
		const netBal  = detail.netBalance ?? 0;
		const balDisp = fmtRound(rawBal, rawBal < 0);
		const netDisp = fmtRound(netBal, netBal < 0);

		drawCard(doc, "Net Balance", [
			["Balance (A-B)",    balDisp],
			["Outstanding FS",  fmtRound(detail.outstandingFs)],
			["TDS Paid",        fmtRound(detail.tdsPaid)],
			["Cash PAID",       fmtRound(detail.cashPaid)],
			["Net Balance",     netDisp, true],
		], MARGIN, y, CW, "#FFFFFF", "#000000");
		y += SECTION_H + 6 * ROW_H + 6;

		// ── Net Balance Big Box ───────────────────────────────────────────
		const boxH = 60;
		const boxY = y;

		doc.save().rect(MARGIN, boxY, CW, boxH).fillColor("#FFFFFF").fill().restore();
		doc.save().rect(MARGIN, boxY, CW, boxH).strokeColor("#000000").lineWidth(1.5).stroke().restore();
		doc.save().rect(MARGIN, boxY, 5, boxH).fillColor("#000000").fill().restore();

		doc.font("Helvetica").fontSize(12).fillColor("#000000")
			.text("Net Balance", MARGIN + 16, boxY + (boxH - 12) / 2 - 6, {
				width: CW * 0.5, lineBreak: false,
			});

		doc.font("Helvetica-Bold").fontSize(20)
			.fillColor("#000000")
			.text(netDisp, MARGIN + 16, boxY + (boxH - 20) / 2 + 6, {
				width: CW - 24, align: "right", lineBreak: false,
			});

		y += boxH + 6;

		// ── Footer ────────────────────────────────────────────────────────
		const footerY = PAGE_H - MARGIN - 10;
		doc.font("Helvetica").fontSize(8).fillColor("#000000")
			.text(`Generated on ${today}`, MARGIN, footerY, { width: CW, align: "center" });

		// ══════════════════════════════════════════════════════════════════
		// PAGE 2 – LANDSCAPE A4   Excess Breakdown
		// ══════════════════════════════════════════════════════════════════
		if (Array.isArray(detail.excessBreakdown) && detail.excessBreakdown.length > 0) {
			doc.addPage({ size: "A4", layout: "landscape", margin: 0 });

			const LPW = 841.89;
			let y2 = 0;

			const lhH = 44;
			doc.rect(0, y2, LPW, lhH).fillColor("#FFFFFF").fill();
			doc.rect(0, y2, LPW, lhH).strokeColor("#000000").lineWidth(0.5).stroke();

			doc.font("Helvetica-Bold").fontSize(15).fillColor("#000000")
				.text("Excess Expense Breakdown", 14, y2 + (lhH - 15) / 2, { lineBreak: false });

			const fyLabel = `FY: ${financialYear || "—"}`;
			const badgeX = 248; const badgeY = y2 + (lhH - 18) / 2;
			const badgeW = 60;  const badgeH = 18;
			doc.save()
				.roundedRect(badgeX, badgeY, badgeW, badgeH, 4)
				.strokeColor("#000000").lineWidth(0.5).stroke()
				.restore();
			doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000")
				.text(fyLabel, badgeX, badgeY + (badgeH - 9) / 2,
					{ width: badgeW, align: "center", lineBreak: false });

			doc.font("Helvetica").fontSize(10).fillColor("#000000")
				.text(`Date: ${today}`, 0, y2 + (lhH - 10) / 2,
					{ width: LPW - 14, align: "right", lineBreak: false });

			y2 += lhH + 8;

			doc.font("Helvetica-Oblique").fontSize(9).fillColor("#000000")
				.text("(Amount in Rs.)", MARGIN, y2,
					{ width: LPW - 2 * MARGIN, align: "right", lineBreak: false });
			y2 += 13;

			drawExcessTable(doc, detail.excessBreakdown, y2, financialYear, MARGIN);
		}

		doc.end();

	} catch (err) {
		console.error("Hisab PDF error:", err);
		if (!res.headersSent) res.status(500).json({ message: "Failed to generate PDF" });
	}
}