import PDFDocument from "pdfkit";

/* ── Page & Layout Constants ─────────────────────────────────────────────── */
const PAGE_W = 841.89;
const PAGE_H = 595.28;
const MARGIN = 24;
const CW = PAGE_W - 2 * MARGIN;
const FOOTER_H = 18;
const ROW_H = 18;
const HEAD_H = 20;
const HEADER_FULL_H = 38;

/* ── Color Palette ───────────────────────────────────────────────────────── */
const COLOR = {
	brandDark: "#14532D",
	brandLight: "#86EFAC",
	white: "#FFFFFF",
	textPrimary: "#374151",
	rowAlt: "#F8FAFC",
	border: "#E5E7EB",
	footerLine: "#D1D5DB",
	footerText: "#9CA3AF",
};

/* ── Column Definitions ──────────────────────────────────────────────────── */
const BASE_COLS = [
	{ label: "S.No", w: 60, align: "center", fontSize: 7 },
	{ label: "Dealer Name", w: 450, align: "left", fontSize: 7 },
	{ label: "Dealer Code", w: 283, align: "left", fontSize: 7 },
];

function buildCols() {
	const cols = BASE_COLS.map((c) => ({ ...c }));
	const totalColW = cols.reduce((sum, c) => sum + c.w, 0);
	cols[cols.length - 1].w += Math.round(CW - totalColW);
	return cols;
}

function computeColX(cols) {
	const colX = [];
	let x = MARGIN;
	for (const col of cols) {
		colX.push(x);
		x += col.w;
	}
	return colX;
}

/* ── Utility ─────────────────────────────────────────────────────────────── */
function safe(val) {
	return val != null && val !== "" ? String(val) : "—";
}

function todayLabel() {
	return new Date().toLocaleDateString("en-IN");
}

function filenameDate() {
	return new Date().toISOString().split("T")[0];
}

/* ── Drawing Helpers ─────────────────────────────────────────────────────── */
function drawHeader(doc) {
	doc.save()
		.rect(-10, -10, PAGE_W + 20, HEADER_FULL_H + 10)
		.fillColor(COLOR.brandDark).fill()
		.restore();

	doc.font("Helvetica-Bold").fontSize(14).fillColor(COLOR.white)
		.text("Dealer Report", MARGIN, 12, { lineBreak: false });

	doc.font("Helvetica").fontSize(7).fillColor(COLOR.brandLight)
		.text(`Generated: ${todayLabel()}`, PAGE_W - 160, 14, { lineBreak: false });
}

function drawFooter(doc, pageNum) {
	const fy = PAGE_H - FOOTER_H;
	doc.moveTo(MARGIN, fy).lineTo(MARGIN + CW, fy)
		.strokeColor(COLOR.footerLine).lineWidth(0.3).stroke();
	doc.font("Helvetica").fontSize(6).fillColor(COLOR.footerText)
		.text(`Page ${pageNum}`, MARGIN, fy + 4,
			{ width: CW, align: "center", lineBreak: false });
}

function drawColumnHeaders(doc, cols, y) {
	doc.save().rect(MARGIN, y, CW, HEAD_H).fillColor(COLOR.brandDark).fill().restore();

	let x = MARGIN;
	for (const col of cols) {
		doc.font("Helvetica-Bold").fontSize(col.fontSize).fillColor(COLOR.white)
			.text(col.label, x + 3, y + (HEAD_H - col.fontSize) / 2,
				{ width: col.w - 6, align: col.align, lineBreak: false });
		x += col.w;
	}
}

function drawRow(doc, cols, y, rowIdx, vals) {
	// Alternating background
	const bg = rowIdx % 2 === 0 ? COLOR.rowAlt : COLOR.white;
	doc.save().rect(MARGIN, y, CW, ROW_H).fillColor(bg).fill().restore();

	// Bottom border
	doc.moveTo(MARGIN, y + ROW_H).lineTo(MARGIN + CW, y + ROW_H)
		.strokeColor(COLOR.border).lineWidth(0.25).stroke();

	let x = MARGIN;
	for (let ci = 0; ci < cols.length; ci++) {
		const col = cols[ci];
		const val = vals[ci];
		const textY = y + (ROW_H - col.fontSize) / 2;
		const isName = ci === 1;
		const fillColor = isName ? COLOR.brandDark : COLOR.textPrimary;

		doc.font(isName ? "Helvetica-Bold" : "Helvetica")
			.fontSize(col.fontSize)
			.fillColor(fillColor)
			.text(val, x + 4, textY,
				{ width: col.w - 8, align: col.align, lineBreak: false });

		x += col.w;
	}
}

function drawTotalRow(doc, cols, colX, y, count) {
	const GT_H = ROW_H + 2;
	const gtY = y + 4 + (GT_H - 7) / 2;
	const labelW = cols.slice(0, 2).reduce((sum, c) => sum + c.w, 0) - 8;
	const label = `TOTAL  ${count} Dealer${count !== 1 ? "s" : ""}`;

	doc.save().rect(MARGIN, y + 4, CW, GT_H).fillColor(COLOR.brandDark).fill().restore();
	doc.font("Helvetica-Bold").fontSize(7).fillColor(COLOR.white)
		.text(label, colX[0] + 4, gtY, { width: labelW, lineBreak: false });
}

/* ── Main Export ─────────────────────────────────────────────────────────── */
export async function generateDealersPDF(records, res) {
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
			`attachment; filename="dealers-${filenameDate()}.pdf"`,
		);
		doc.pipe(res);

		const cols = buildCols();
		const colX = computeColX(cols);

		let pageNum = 1;
		let y = 0;

		function startPage() {
			doc.addPage({ size: "A4", layout: "landscape", margin: 0 });
			drawHeader(doc);
			y = HEADER_FULL_H + 8;
			drawColumnHeaders(doc, cols, y);
			y += HEAD_H;
		}

		startPage();

		// ── Rows ────────────────────────────────────────────────
		for (let rowIdx = 0; rowIdx < records.length; rowIdx++) {
			if (y + ROW_H > PAGE_H - FOOTER_H - 20) {
				drawFooter(doc, pageNum++);
				startPage();
			}

			const rec = records[rowIdx];
			const vals = [String(rowIdx + 1), safe(rec.dealerName), safe(rec.farmerDealerCode)];

			drawRow(doc, cols, y, rowIdx, vals);
			y += ROW_H;
		}

		// ── Grand Total row ──────────────────────────────────────
		if (y + ROW_H + 6 > PAGE_H - FOOTER_H - 10) {
			drawFooter(doc, pageNum++);
			startPage();
		}

		drawTotalRow(doc, cols, colX, y, records.length);
		drawFooter(doc, pageNum);
		doc.end();

	} catch (err) {
		console.error("Dealer PDF error:", err);
		if (!res.headersSent) {
			res.status(500).json({ message: "Failed to generate Dealer PDF" });
		}
	}
}
