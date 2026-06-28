/**
 * pdfGenerator.js
 * Generates a formatted Dealer Hisab PDF using pdfkit.
 * Install: npm install pdfkit
 */

import PDFDocument from "pdfkit";

const INR = (n) =>
   "₹" +
   Number(n || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
   });

/**
 * Generate dealer hisab PDF and pipe it to res (Express response)
 * @param {object} hisab  - output from computeHisab()
 * @param {object} dealer - dealer document from DB
 * @param {object} res    - Express response object
 */
function generateHisabPdf(hisab, dealer, res) {
   const doc = new PDFDocument({ margin: 40, size: "A4" });

   res.setHeader("Content-Type", "application/pdf");
   res.setHeader(
      "Content-Disposition",
      `attachment; filename=hisab_${dealer.farmerDealerCode}_${hisab.financialYear}.pdf`
   );
   doc.pipe(res);

   const pageWidth = doc.page.width - 80; // margins 40 each side

   // ── HEADER ─────────────────────────────────────────────────────
   doc.fontSize(16).font("Helvetica-Bold").text("DEALER HISAB SUMMARY", { align: "center" });
   doc.moveDown(0.3);
   doc
      .fontSize(11)
      .font("Helvetica")
      .text(`Dealer: ${dealer.name || dealer.farmerDealerCode}   |   Code: ${dealer.farmerDealerCode}`, {
         align: "center",
      });
   doc.text(`Financial Year: ${hisab.financialYear}`, { align: "center" });
   doc.moveDown(0.5);
   drawLine(doc, pageWidth);

   // ── SIDE A ─────────────────────────────────────────────────────
   doc.moveDown(0.4);
   sectionHeader(doc, "SIDE A — Total Dues / Payable");
   tableRow(doc, "1", "Inventory Cost Amount", INR(hisab.sideA.inventoryCost));
   tableRow(doc, "2", "GST on Billing", INR(hisab.sideA.gstOnBilling));
   tableRow(doc, "3", "Cash for Expenses", INR(hisab.sideA.cashForExpenses));
   tableRow(doc, "4", "Excess Expense", INR(hisab.sideA.excessExpense));
   drawLine(doc, pageWidth);
   tableRow(doc, "", "TOTAL A", INR(hisab.sideA.total), true);

   // ── SIDE B ─────────────────────────────────────────────────────
   doc.moveDown(0.5);
   sectionHeader(doc, "SIDE B — Total Received / Credits");
   tableRow(doc, "5", "Farmer Share Received", INR(hisab.sideB.farmerShareReceived));
   tableRow(doc, "6", "FS Adjusted", INR(hisab.sideB.fsAdjusted));
   tableRow(doc, "7", "Subsidy Received", INR(hisab.sideB.subsidyReceived));
   tableRow(doc, "8", "Incentives", INR(hisab.sideB.incentives));
   drawLine(doc, pageWidth);
   tableRow(doc, "", "TOTAL B", INR(hisab.sideB.total), true);

   // ── NET BALANCE ────────────────────────────────────────────────
   doc.moveDown(0.5);
   sectionHeader(doc, "NET BALANCE");
   tableRow(doc, "", "Balance (A − B)", INR(hisab.balanceAB));
   tableRow(doc, "", "Outstanding FS", INR(hisab.outstandingFs));
   tableRow(doc, "", "TDS Paid", INR(hisab.tdsPaid));
   tableRow(doc, "", "Cash Paid", INR(hisab.cashPaid));
   drawLine(doc, pageWidth);
   tableRow(doc, "", "NET BALANCE", INR(hisab.netBalance), true);

   const creditOrDebit =
      hisab.netBalance < 0
         ? `Dealer in CREDIT of ${INR(Math.abs(hisab.netBalance))}`
         : hisab.netBalance > 0
            ? `Dealer OWES ${INR(hisab.netBalance)}`
            : "SETTLED";
   doc.moveDown(0.3).fontSize(10).font("Helvetica-Oblique").text(creditOrDebit, { align: "right" });

   // ── EXCESS EXPENSE BREAKDOWN ───────────────────────────────────
   if (hisab.excessBreakdown && hisab.excessBreakdown.length > 0) {
      doc.addPage();
      doc.fontSize(14).font("Helvetica-Bold").text("EXCESS EXPENSE BREAKDOWN", { align: "center" });
      doc.moveDown(0.4);
      drawLine(doc, pageWidth);

      for (const row of hisab.excessBreakdown) {
         doc.moveDown(0.4);
         doc.fontSize(11).font("Helvetica-Bold").text(row.label);
         doc.fontSize(10).font("Helvetica");

         const fields = [
            ["Billed Qty", row.billedQty],
            ["Dispatch Qty", row.dispatchQty],
            ["Difference", row.diff],
            ["Rate", INR(row.rate)],
            ["Amount", INR(row.amount)],
            ["Cash for Expense (10%)", INR(row.cashForExp)],
            ["GST (12/85)", INR(row.gst)],
            ["Extra Subsidy", INR(row.extraSubsidy)],
            ["1/3 Share", INR(row.oneThirdShare)],
         ];

         for (const [label, value] of fields) {
            doc.text(`   ${label}:   ${value}`);
         }
         drawLine(doc, pageWidth);
      }

      doc.moveDown(0.4);
      doc
         .fontSize(12)
         .font("Helvetica-Bold")
         .text(`Total Excess Expense:  ${INR(hisab.sideA.excessExpense)}`, { align: "right" });
   }

   // ── FOOTER ─────────────────────────────────────────────────────
   doc
      .fontSize(8)
      .font("Helvetica")
      .text(`Generated on ${new Date().toLocaleString("en-IN")}`, 40, doc.page.height - 30, {
         align: "center",
         width: pageWidth,
      });

   doc.end();
}

// ── helpers ────────────────────────────────────────────────────────────────

function sectionHeader(doc, title) {
   doc.fontSize(12).font("Helvetica-Bold").fillColor("#1a1a1a").text(title);
   doc.moveDown(0.2);
   doc.font("Helvetica").fontSize(10).fillColor("#000000");
}

function tableRow(doc, num, label, value, bold = false) {
   const colLabel = 60;
   const colValue = doc.page.width - 80 - colLabel;
   const y = doc.y;
   doc
      .font(bold ? "Helvetica-Bold" : "Helvetica")
      .fontSize(10)
      .text(num ? `${num}.  ${label}` : `    ${label}`, 40, y, { width: colValue })
      .text(value, 40 + colValue, y, { width: colLabel, align: "right" });
   doc.moveDown(0.25);
}

function drawLine(doc, width) {
   const y = doc.y;
   doc.moveTo(40, y).lineTo(40 + width, y).strokeColor("#cccccc").lineWidth(0.5).stroke();
   doc.moveDown(0.2);
}

export { generateHisabPdf };
