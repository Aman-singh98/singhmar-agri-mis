
// ─── MI classification (DealerMainSummary.jsx jaisi hi — counts hamesha match karein) ──
const VALID_MI_REGEX = /^MI\d+$/i;
function classifyMI(miNumber) {
   const val = String(miNumber ?? "").trim();
   if (!val) return "withoutMI";
   if (VALID_MI_REGEX.test(val)) return "withMI";
   return "other";
}

function toNumber(v) {
   const n = Number(v);
   return isNaN(n) ? 0 : n;
}

export function calcDealerMaterialDispatchSummary({
   dispatched = [],
   receipts = [],
   adjusted = [],
   records = [],   // ← raw file records (DealerMainSummary ko jo milte hain) —
   //   isी se "Document Received in Acre" (Mini/Drip) nikalta hai.
}) {

   // ── Step 0: build a dealerName → farmerDealerCode lookup ──────────────────
   // Some rows (e.g. "SHIFTING ENTRY" adjustment rows) carry a dealerName but
   // have a blank/missing farmerDealerCode. Without resolving these to the
   // dealer's real code first, they'd form their own separate "Unknown Dealer"
   // group instead of being counted under the correct dealer — silently
   // dropping acres from that dealer's total. This pass builds the name→code
   // map from any row that DOES have both fields, so blank-code rows can be
   // resolved to the right dealer before grouping.
   const nameToCode = new Map();   // normalized dealerName → farmerDealerCode
   const registerNameCode = (r) => {
      const code = String(r.farmerDealerCode ?? "").trim();
      const name = String(r.dealerName ?? "").trim().toLowerCase();
      if (code && name && !nameToCode.has(name)) {
         nameToCode.set(name, r.farmerDealerCode);
      }
   };
   [...dispatched, ...records, ...receipts, ...adjusted].forEach(registerNameCode);

   // Resolve the effective grouping code for any row: use its own code if
   // present, otherwise fall back to the code looked up by dealerName.
   function resolveCode(r) {
      const ownCode = String(r.farmerDealerCode ?? "").trim();
      if (ownCode) return r.farmerDealerCode;
      const name = String(r.dealerName ?? "").trim().toLowerCase();
      if (name && nameToCode.has(name)) return nameToCode.get(name);
      return r.farmerDealerCode ?? "";   // stays blank/"Unknown" if truly unresolvable
   }

   // ── Step 1: collect unique dealers — dispatched + records + receipts + adjusted se ──
   const dealerMap = new Map();   // resolvedCode → { dealerName, farmerDealerCode }

   const registerDealer = (r) => {
      const code = resolveCode(r);
      if (!dealerMap.has(code)) {
         dealerMap.set(code, {
            dealerName: r.dealerName ?? "",
            farmerDealerCode: code,
         });
      } else if (!dealerMap.get(code).dealerName && r.dealerName) {
         // Fill in a missing name if a later row has one for the same code
         dealerMap.get(code).dealerName = r.dealerName;
      }
   };

   dispatched.forEach(registerDealer);
   records.forEach(registerDealer);
   [...receipts, ...adjusted].forEach(registerDealer);

   // ── Step 2: index Document Received (Mini/Drip Acre) by resolved code ─────
   // DealerMainSummary.jsx jaisi hi logic: sirf "withMI" (valid MI number waale) records
   // ka areaInAcre count hota hai, irrigationType ke hisaab se Mini/Drip mein bucket hota hai.
   const docMap = new Map();   // resolvedCode → { miniSprinklerAcres, dripIrrigationAcres }

   records.forEach(r => {
      if (classifyMI(r.miNumber) !== "withMI") return;   // sirf valid-MI records count honge

      const code = resolveCode(r);
      if (!docMap.has(code)) {
         docMap.set(code, { miniSprinklerAcres: 0, dripIrrigationAcres: 0 });
      }
      const bucket = docMap.get(code);

      const irrigation = String(r.irrigationType ?? r.type ?? "").toLowerCase();
      const acre = toNumber(r.areaInAcre);

      if (irrigation.includes("mini")) {
         bucket.miniSprinklerAcres += acre;
      } else if (irrigation.includes("drip")) {
         bucket.dripIrrigationAcres += acre;
      }
   });

   // ── Step 3: calculate per dealer ─────────────────────────────────────────
   const summary = [];

   for (const [code, dealer] of dealerMap) {

      // -- Material Dispatched In Acre — matched via resolveCode, not raw field --
      const dealerDispatched = dispatched.filter(r => resolveCode(r) === code);

      const miniAcresDispatched = dealerDispatched.reduce(
         (s, r) => s + (Number(r.miniAcres) || 0), 0
      );
      const dripAcresDispatched = dealerDispatched.reduce(
         (s, r) => s + (Number(r.dripAcres) || 0), 0
      );

      // -- Document Received in Acre (records se, MI-validated) --
      const doc = docMap.get(code) ?? { miniSprinklerAcres: 0, dripIrrigationAcres: 0 };
      const miniSprinklerDocAcres = doc.miniSprinklerAcres;
      const dripIrrigationDocAcres = doc.dripIrrigationAcres;

      // -- Difference --
      const diffMini = miniSprinklerDocAcres - miniAcresDispatched;
      const diffDrip = dripIrrigationDocAcres - dripAcresDispatched;

      // -- Total Doc Received --
      const totalDocReceived = miniSprinklerDocAcres + dripIrrigationDocAcres;

      // -- Pending Doc --
      const pendingDoc = totalDocReceived - (miniAcresDispatched + dripAcresDispatched);

      // -- Farmer Share --
      const farmerShareMini = dealerDispatched.reduce(
         (s, r) => s + (Number(r.miniFarmerShare) || 0), 0
      );
      const farmerShareDrip = dealerDispatched.reduce(
         (s, r) => s + (Number(r.dripFarmerShare) || 0), 0
      );
      const farmerShareHdpe = dealerDispatched.reduce(
         (s, r) => s + (Number(r.hdpeFarmerShare) || 0), 0
      );

      // -- Opening Balance (from Adjusted) --
      const dealerAdjusted = adjusted.filter(r => resolveCode(r) === code);
      const openingBalance = dealerAdjusted.reduce(
         (s, r) => s + (Number(r.amount) || 0), 0
      );

      // -- Receipts --
      const dealerReceipts = receipts.filter(r => resolveCode(r) === code);
      const totalReceipts = dealerReceipts.reduce(
         (s, r) => s + (Number(r.amount) || 0), 0
      );

      // -- TOTAL Outstanding --
      const totalOutstanding = farmerShareMini + farmerShareDrip + farmerShareHdpe
         + openingBalance - totalReceipts;

      // -- Outstanding (fy) --
      const outstanding = totalOutstanding - openingBalance;

      // -- Balance Outstanding (fy) --
      const balanceOutstanding = outstanding;

      summary.push({
         // Display labels — blank dealerName/code show as "Unknown Dealer" / "N/A"
         // so the row is never empty. farmerDealerCode here is the RESOLVED group
         // code (rows with blank own-code but matching dealerName are folded in).
         dealerName: dealer.dealerName?.trim() ? dealer.dealerName : "Unknown Dealer",
         farmerDealerCode: code?.trim() ? code : "N/A",
         farmerDealerCodeRaw: code,   // resolved grouping code (may be "" if truly unresolvable)

         // Material Dispatched
         miniAcresDispatched,
         dripAcresDispatched,

         // Document Received (records se, MI-validated)
         miniSprinklerDocAcres,
         dripIrrigationDocAcres,

         // Difference
         diffMini,
         diffDrip,

         // Doc totals
         totalDocReceived,
         pendingDoc,

         // Farmer Share
         farmerShareMini,
         farmerShareDrip,
         farmerShareHdpe,

         // Balance columns
         openingBalance,
         receipts: totalReceipts,
         totalOutstanding,
         outstanding,
         balanceOutstanding,
      });
   }

   return summary;
}