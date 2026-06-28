const XEN_STATUSES = [
   "MI - Approval by 'XEN' at 'MI Field Survay Verification'",
   "MI - Approval by 'XEN' at 'MIS Field Physical Re-Verification(5%) and recommendation'",
];

/**
 * Ek dealer ke liye NOS + ACRE dono calculate karta hai.
 * TodaySummary ke calcBrandRow jaisa hi logic — sirf brand ki jagah dealer filter hai.
 */
export function calcDealerRow(dealer, records) {
   // dealer = { dealerName, farmerDealerCode }
   const dr = records.filter(r => r.farmerDealerCode === dealer.farmerDealerCode);

   const count = (fn) => dr.filter(fn).length;
   const acre  = (fn) => Math.round(dr.filter(fn).reduce((s, r) => s + (Number(r.areaInAcre) || 0), 0));

   // ── Files (Nos) ───────────────────────────────────────
   const verified   = count(r => r.verificationStatus === "Verified");
   const pending    = count(r => r.verificationStatus === "Pending");
   const objection  = count(r => r.verificationStatus === "In-complete");
   const totalFiles = verified + pending + objection;

   // ── Files (Acre) ──────────────────────────────────────
   const verifiedAcre   = acre(r => r.verificationStatus === "Verified");
   const pendingAcre    = acre(r => r.verificationStatus === "Pending");
   const objectionAcre  = acre(r => r.verificationStatus === "In-complete");
   const totalFilesAcre = verifiedAcre + pendingAcre + objectionAcre;

   // ── Estimate (Nos) ────────────────────────────────────
   const estApproved      = count(r => r.estimateStatus === "Approved");
   const estDeptPending   = count(r => r.estimateStatus === "Submitted");
   const miSurveyPending  = count(r => r.estimateStatus === "In-Process");
   const estSubmitted     = estApproved + estDeptPending;
   const estYetToSubmit   = verified - estSubmitted - miSurveyPending;

   // ── Estimate (Acre) ───────────────────────────────────
   const estApprovedAcre      = acre(r => r.estimateStatus === "Approved");
   const estDeptPendingAcre   = acre(r => r.estimateStatus === "Submitted");
   const miSurveyPendingAcre  = acre(r => r.estimateStatus === "In-Process");
   const estSubmittedAcre     = estApprovedAcre + estDeptPendingAcre;
   const estYetToSubmitAcre   = verifiedAcre - estSubmittedAcre - miSurveyPendingAcre;

   // ── Farmer Share (Nos) ────────────────────────────────
   const challanGen       = count(r =>
      r.onlineFarmerShareStatus === "Bank Received" ||
      r.onlineFarmerShareStatus === "Payment Pending"
   );
   const fsReceived       = count(r => r.onlineFarmerShareStatus === "Bank Received");
   const fsPaymentPending = challanGen - fsReceived;
   const fsGenPending     = estApproved - fsReceived - fsPaymentPending;

   // ── Farmer Share (Acre) ───────────────────────────────
   const challanGenAcre       = acre(r =>
      r.onlineFarmerShareStatus === "Bank Received" ||
      r.onlineFarmerShareStatus === "Payment Pending"
   );
   const fsReceivedAcre       = acre(r => r.onlineFarmerShareStatus === "Bank Received");
   const fsPaymentPendingAcre = challanGenAcre - fsReceivedAcre;
   const fsGenPendingAcre     = estApprovedAcre - fsReceivedAcre - fsPaymentPendingAcre;

   // ── Bill Status (Nos) ─────────────────────────────────
   const tallyBill    = count(r => r.tallyBillStatus === "Done");
   const billUploaded = count(r => r.billUploadStatus === "Done");
   const tallyPending = fsReceived - tallyBill;

   // ── Bill Status (Acre) ────────────────────────────────
   const tallyBillAcre    = acre(r => r.tallyBillStatus === "Done");
   const billUploadedAcre = acre(r => r.billUploadStatus === "Done");
   const tallyPendingAcre = fsReceivedAcre - tallyBillAcre;

   // ── PV Status (Nos) ───────────────────────────────────
   const pvDone     = count(r => r.verificationDone === "Done");
   const pvPending  = count(r => r.verificationDone === "Pending");
   const xenPending = count(r => XEN_STATUSES.includes(r.status));

   // ── PV Status (Acre) ──────────────────────────────────
   const pvDoneAcre     = acre(r => r.verificationDone === "Done");
   const pvPendingAcre  = acre(r => r.verificationDone === "Pending");
   const xenPendingAcre = acre(r => XEN_STATUSES.includes(r.status));

   return {
      // Identity
      dealerName:       dealer.dealerName,
      farmerDealerCode: dealer.farmerDealerCode,

      // ── Nos
      totalFiles, verified, pending, objection,
      estSubmitted, estApproved, estDeptPending, miSurveyPending, estYetToSubmit,
      challanGen, fsReceived, fsPaymentPending, fsGenPending,
      tallyBill, billUploaded, tallyPending,
      pvDone, pvPending, xenPending,

      // ── Acre
      totalFilesAcre, verifiedAcre, pendingAcre, objectionAcre,
      estSubmittedAcre, estApprovedAcre, estDeptPendingAcre, miSurveyPendingAcre, estYetToSubmitAcre,
      challanGenAcre, fsReceivedAcre, fsPaymentPendingAcre, fsGenPendingAcre,
      tallyBillAcre, billUploadedAcre, tallyPendingAcre,
      pvDoneAcre, pvPendingAcre, xenPendingAcre,
   };
}

/**
 * Saare unique dealers nikaal ke unke rows calculate karta hai.
 * Returns: sorted array by dealerName
 */
export function calcAllDealerRows(records) {
   // Unique dealers map: farmerDealerCode → { dealerName, farmerDealerCode }
   const dealerMap = new Map();
   records.forEach(r => {
      if (r.farmerDealerCode && !dealerMap.has(r.farmerDealerCode)) {
         dealerMap.set(r.farmerDealerCode, {
            dealerName:       r.dealerName ?? r.farmerDealerCode,
            farmerDealerCode: r.farmerDealerCode,
         });
      }
   });

   const dealers = Array.from(dealerMap.values())
      .sort((a, b) => (a.dealerName ?? "").localeCompare(b.dealerName ?? ""));

   return dealers.map(dealer => calcDealerRow(dealer, records));
}