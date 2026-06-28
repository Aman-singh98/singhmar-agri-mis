/**
 * hisabCalculator.js
 * Core calculation engine for Dealer Hisab.
 * All mongoose models are passed in — no direct imports — for testability.
 */

import {
   HDPE_ITEM_KEYS, LATERAL32_ITEM_KEYS, FITTINGS_ITEM_KEYS, SPRINKLER_ITEM_KEYS,
   ALUMINIUM_ITEM_KEYS, PVC_PIPE_ITEM_KEYS, INLINE_LATERAL_ITEM_KEYS,
   FILTER_ITEM_KEYS, MISC_ITEM_KEYS, KEY_TO_ITEM_NAME
} from "../constant/ItemRates.js";

// All shifting category keys mapped to their ShiftingEntry field name
const SHIFTING_CATEGORIES = [
   { field: "hdpe", keys: HDPE_ITEM_KEYS },
   { field: "lateral32", keys: LATERAL32_ITEM_KEYS },
   { field: "fittings", keys: FITTINGS_ITEM_KEYS },
   { field: "sprinklerParts", keys: SPRINKLER_ITEM_KEYS },
   { field: "aluminiumParts", keys: ALUMINIUM_ITEM_KEYS },
   { field: "pvcPipes", keys: PVC_PIPE_ITEM_KEYS },
   { field: "inlineLaterals", keys: INLINE_LATERAL_ITEM_KEYS },
   { field: "filters", keys: FILTER_ITEM_KEYS },
   { field: "misc", keys: MISC_ITEM_KEYS },
];

// ── Rate cutoff date: on/before this date use rateUpto, after use rateFrom ──
const RATE_CUTOFF_DATE = new Date("2022-09-13T23:59:59.999Z");

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — parse financial year string "22-23" → { start, end } Date objects
// ─────────────────────────────────────────────────────────────────────────────
function fyToDates(fy) {
   // fy format: "22-23" or "2022-23" or "2022-2023"
   const parts = fy.split("-");
   let startYear = parseInt(parts[0]);
   if (startYear < 100) startYear += 2000; // "22" → 2022
   const endYear = startYear + 1;
   return {
      start: new Date(`${startYear}-04-01T00:00:00.000Z`),
      end: new Date(`${endYear}-03-31T23:59:59.999Z`),
   };
}

function prevFy(fy) {
   const parts = fy.split("-");
   let startYear = parseInt(parts[0]);
   if (startYear < 100) startYear += 2000;
   const prevStart = startYear - 1;
   return `${String(prevStart).slice(-2)}-${String(startYear).slice(-2)}`;
}

function nextFy(fy) {
   const parts = fy.split("-");
   let startYear = parseInt(parts[0]);
   if (startYear < 100) startYear += 2000;
   const nextStart = startYear + 1;
   return `${String(nextStart).slice(-2)}-${String(nextStart + 1).slice(-2)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — build itemName → { rateUpto, rateFrom } lookup from DB (fetched once)
//
// Priority:
//   1. DealerItemRate  (dealer + financialYear match) ← wins
//   2. ItemRate        (global fallback)
// ─────────────────────────────────────────────────────────────────────────────
async function buildRateLookup(ItemRateModel, DealerItemRateModel, dealerObjectId, fy) {
   // ── 1. Global rates ───────────────────────────────────────────────────────
   const allRates = await ItemRateModel.find({}).lean();
   const lookup = {};
   for (const r of allRates) {
      lookup[r.itemName] = { rateUpto: r.rateUpto, rateFrom: r.rateFrom };
   }

   // ── 2. Dealer-specific overrides (only if dealer is known) ────────────────
   if (DealerItemRateModel && dealerObjectId && fy) {
      const dealerRates = await DealerItemRateModel.find({
         dealer: dealerObjectId,
         financialYear: fy,
      }).lean();

      for (const r of dealerRates) {
         // Override global rate — dealer rate wins
         lookup[r.itemName] = { rateUpto: r.rateUpto, rateFrom: r.rateFrom };
      }
   }

   return lookup;
}

// Pick the correct rate based on challan date vs cutoff
function pickRate(rateLookup, productKey, date) {
   const itemName = KEY_TO_ITEM_NAME[productKey];
   if (!itemName) return 0;
   const entry = rateLookup[itemName];
   if (!entry) return 0;
   return new Date(date) <= RATE_CUTOFF_DATE ? entry.rateUpto : entry.rateFrom;
}

async function calcInventoryCost(Models, dealerCode, fy) {
   // ── Look up dealer ObjectId for ShiftingEntry query ───────────────────────
   const dealerDoc = await Models.Dealer.findOne({ farmerDealerCode: dealerCode }).lean();
   const dealerObjectId = dealerDoc?._id ?? null;

   const [records, rateLookup, shiftingEntry, returnEntries] = await Promise.all([
      Models.Inventory.find({ farmerDealerCode: dealerCode, financialYear: fy }),
      buildRateLookup(Models.ItemRate, Models.DealerItemRate, dealerObjectId, fy),
      dealerObjectId
         ? Models.ShiftingEntry.findOne({ dealer: dealerObjectId, financialYear: fy }).lean()
         : Promise.resolve(null),
      dealerObjectId
         ? Models.ReturnEntry.find({ dealer: dealerObjectId, financialYear: fy }).lean()
         : Promise.resolve([]),
   ]);

   // ── Build shifted qty map + returnDate deduction ──────────────────────────
   // shiftedQty: flat productKey → total qty (used for fallback deduction)
   // shiftedReturnDeduction: shifted qty priced at returnDate rate (primary)
   const shiftedQty = {};
   let shiftedReturnDeduction = 0;
   if (shiftingEntry) {
      const returnDate = shiftingEntry.returnDate ?? null;
      for (const { field, keys } of SHIFTING_CATEGORIES) {
         const catData = shiftingEntry[field];
         if (!catData) continue;
         for (const key of keys) {
            const qty = catData[key] || 0;
            if (qty > 0) {
               shiftedQty[key] = (shiftedQty[key] || 0) + qty;
               if (returnDate) {
                  const rate = pickRate(rateLookup, key, returnDate);
                  shiftedReturnDeduction += qty * rate;
               }
            }
         }
      }
   }

   // ── Gross inventory cost — each challan record priced at its own date ─────
   // FIX: price per-record instead of aggregating qty first then using
   // latestDate, which was incorrectly applying the post-cutoff rate to
   // all units even when earlier challans were dispatched at the higher rate.
   let grossTotal = 0;
   const inventoryTotals = {}; // still needed for shifted fallback deduction

   for (const rec of records) {
      const date = rec.date;
      const products = rec.products instanceof Map
         ? rec.products
         : new Map(Object.entries(rec.products || {}));

      for (const [key, qty] of products.entries()) {
         if (!qty) continue;
         const rate = pickRate(rateLookup, key, date);
         grossTotal += (qty || 0) * rate;

         // Keep running totals for fallback shifted deduction (no returnDate case)
         if (!inventoryTotals[key]) inventoryTotals[key] = { totalQty: 0, date };
         inventoryTotals[key].totalQty += qty || 0;
         if (new Date(date) > new Date(inventoryTotals[key].date))
            inventoryTotals[key].date = date;
      }
   }

   // ── Deduct shifted stock ──────────────────────────────────────────────────
   // Primary: use returnDate rate (dealer credited at rate on the return date)
   // Fallback: if no returnDate, deduct at the original latest inventory rate
   let shiftedDeduction = shiftedReturnDeduction;
   if (!shiftedDeduction) {
      for (const [key, qty] of Object.entries(shiftedQty)) {
         const entry = inventoryTotals[key];
         if (!entry) continue;
         const rate = pickRate(rateLookup, key, entry.date);
         shiftedDeduction += qty * rate;
      }
   }

   // ── Deduct returned stock ─────────────────────────────────────────────────
   // Each ReturnEntry item is priced at the rate on its returnDate (same logic
   // as shiftedReturnDeduction). Summed across all return entries for this FY.
   let returnDeduction = 0;
   for (const returnEntry of returnEntries) {
      const returnDate = returnEntry.returnDate ?? null;
      if (!returnDate) continue;
      for (const { field, keys } of SHIFTING_CATEGORIES) {
         const catData = returnEntry[field];
         if (!catData) continue;
         for (const key of keys) {
            const qty = Number(catData[key]) || 0;
            if (qty > 0) {
               const rate = pickRate(rateLookup, key, returnDate);
               returnDeduction += qty * rate;
            }
         }
      }
   }

   const total = Math.max(0, grossTotal - (shiftedDeduction + returnDeduction));
   return {
      total: round2(total),
      shiftedDeduction: round2(shiftedDeduction),
      returnDeduction: round2(returnDeduction),
   };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. GST ON BILLING
// ─────────────────────────────────────────────────────────────────────────────
async function calcGstOnBilling(Models, dealerCode, fy) {
   const bills = await Models.TallyBill.find({
      farmerDealerCode: dealerCode,
      financialYear: fy
   });
   const total = bills.reduce((sum, b) => sum + (b.gst || 0), 0);
   return round2(total);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CASH FOR EXPENSES  = Σ assistanceToBePaid × 10%
// ─────────────────────────────────────────────────────────────────────────────
async function calcCashForExpenses(Models, dealerCode, fy) {
   const subsidies = await Models.SubsidyRecord.find({
      farmerDealerCode: dealerCode,
      financialYear: fy
   });
   const subsidyTotal = subsidies.reduce((sum, s) => sum + (s.assistanceToBePaid || 0), 0);
   return round2(subsidyTotal * 0.1);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXCESS EXPENSE
// ─────────────────────────────────────────────────────────────────────────────
async function calcExcessExpense(Models, dealerCode, fy) {
   const { start, end } = fyToDates(fy);

   // ── Look up dealer ObjectId from farmerDealerCode ─────────────
   const dealerDoc = await Models.Dealer.findOne({ farmerDealerCode: dealerCode }).lean();
   const dealerObjectId = dealerDoc?._id ?? null;

   // ── Fetch shared data ──────────────────────────────────────────
   const [inventories, dispatchedRecords, subsidies, mainRecords, shiftingEntry] = await Promise.all([
      Models.Inventory.find({
         farmerDealerCode: dealerCode,
         date: { $gte: start, $lte: end },
      }),
      Models.MaterialDispatched.find({
         farmerDealerCode: dealerCode,
         financialYear: fy,
      }),
      Models.SubsidyRecord.find({
         farmerDealerCode: dealerCode,
         financialYear: fy
      }),
      Models.MainRecord.find({
         farmerDealerCode: dealerCode,
         financialYear: fy,
         tallyBillStatus: "Done"
      }),
      // ShiftingEntry: one record per dealer per FY
      dealerObjectId
         ? Models.ShiftingEntry.findOne({ dealer: dealerObjectId, financialYear: fy }).lean()
         : Promise.resolve(null),
   ]);

   const hdpeAcres = dispatchedRecords.reduce((s, r) => s + (r.hdpeAcres || 0), 0);
   const miniAcres = dispatchedRecords.reduce((s, r) => s + (r.miniAcres || 0), 0);
   const dripAcres = dispatchedRecords.reduce((s, r) => s + (r.dripAcres || 0), 0);

   // ── Per-type subsidy rate (assistanceToBePaid / areaInAcre) ───
   const miniSubsidies = subsidies.filter((r) => r.type === "Mini Sprinkler");
   const miniSubsidyTotal = miniSubsidies.reduce((s, r) => s + (r.assistanceToBePaid || 0), 0);
   const miniAreaTotal = miniSubsidies.reduce((s, r) => s + (r.areaInAcre || 0), 0);
   const miniRatePerAcre = miniAreaTotal > 0 ? miniSubsidyTotal / miniAreaTotal : 0;

   const dripSubsidies = subsidies.filter((r) => r.type === "Drip Irrigation");
   const dripSubsidyTotal = dripSubsidies.reduce((s, r) => s + (r.assistanceToBePaid || 0), 0);
   const dripAreaTotal = dripSubsidies.reduce((s, r) => s + (r.areaInAcre || 0), 0);
   const dripRatePerAcre = dripAreaTotal > 0 ? dripSubsidyTotal / dripAreaTotal : 0;

   // ── ROW 1: Extra HDPE Pipe ─────────────────────────────────────
   // Step 1: sum HDPE items from Inventory (exclude challan HDPE/112)
   let hdpeDispatch = 0;
   for (const rec of inventories) {
      if (rec.challanNo === "HDPE/112") continue;
      const products = rec.products instanceof Map
         ? rec.products
         : new Map(Object.entries(rec.products || {}));
      for (const key of HDPE_ITEM_KEYS) {
         hdpeDispatch += products.get(key) || 0;
      }
   }
   // Step 2: subtract ShiftingEntry HDPE quantities
   if (shiftingEntry?.hdpe) {
      for (const key of HDPE_ITEM_KEYS) {
         hdpeDispatch -= shiftingEntry.hdpe[key] || 0;
      }
   }

   // Billed Qty: MaterialDispatched.miniAcres × 11
   const hdpeBilled = miniAcres * 11;
   const row1 = excessRow(hdpeBilled, hdpeDispatch, 497.25, "Extra HDPE Pipe");

   // ── ROW 2: Extra 32MM Billing ──────────────────────────────────
   // Step 1: sum 32MM lateral items from Inventory
   let lateral32Dispatch = 0;
   for (const rec of inventories) {
      const products = rec.products instanceof Map
         ? rec.products
         : new Map(Object.entries(rec.products || {}));
      for (const key of LATERAL32_ITEM_KEYS) {
         lateral32Dispatch += products.get(key) || 0;
      }
   }
   // Step 2: subtract ShiftingEntry lateral32 quantities
   if (shiftingEntry?.lateral32) {
      for (const key of LATERAL32_ITEM_KEYS) {
         lateral32Dispatch -= shiftingEntry.lateral32[key] || 0;
      }
   }

   // Billed Qty: miniAcres × 500
   const lateral32Billed = miniAcres * 500;
   const row2 = excessRow(lateral32Billed, lateral32Dispatch, 28.9, "Extra 32MM Lateral");

   // ── ROW 3: Extra Billing Mini ──────────────────────────────────
   const miniBilled = mainRecords
      .filter((r) => r.type === "Mini Sprinkler")
      .reduce((s, r) => s + (r.areaInAcre || 0), 0);
   const row3 = excessRow(miniBilled, miniAcres, miniRatePerAcre, "Extra Billing Mini");

   // ── ROW 4: Extra Billing Drip ──────────────────────────────────
   const dripBilled = mainRecords
      .filter((r) => r.type === "Drip Irrigation")
      .reduce((s, r) => s + (r.areaInAcre || 0), 0);
   const row4 = excessRow(dripBilled, dripAcres, dripRatePerAcre, "Extra Billing Drip");

   const rows = [row1, row2, row3, row4];
   const totalExcess = round2(rows.reduce((s, r) => s + r.oneThirdShare, 0));

   return { rows, totalExcess };
}

/**
 * Calculate one excess expense row
 */
function excessRow(billedQty, dispatchQty, rate, label) {
   const diff = billedQty - dispatchQty;
   const amount = diff * rate;
   const cashForExp = amount * 0.1;
   const gst = (amount / 85) * 12;
   const extraSubsidy = amount - (cashForExp + gst);
   const oneThirdShare = extraSubsidy / 3;

   return {
      label,
      billedQty: round2(billedQty),
      dispatchQty: round2(dispatchQty),
      diff: round2(diff),
      rate: round2(rate),
      amount: round2(amount),
      cashForExp: round2(cashForExp),
      gst: round2(gst),
      extraSubsidy: round2(extraSubsidy),
      oneThirdShare: round2(oneThirdShare),
   };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. FARMER SHARE RECEIVED
// ─────────────────────────────────────────────────────────────────────────────
async function calcFarmerShareReceived(Models, dealerCode, fy) {
   const receipts = await Models.Receipt.find({
      farmerDealerCode: dealerCode,
      financialYear: fy
   });
   return round2(receipts.reduce((s, r) => s + (r.amount || 0), 0));
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. FS ADJUSTED
// ─────────────────────────────────────────────────────────────────────────────
function getPreviousFinancialYear(fy) {
   const [start, end] = fy.split("-").map(Number);
   return `${String(start - 1).padStart(2, "0")}-${String(end - 1).padStart(2, "0")}`;
}

async function calcFsAdjusted(Models, dealerCode, fy) {
   const previousFy = getPreviousFinancialYear(fy);
   const records = await Models.AdjustedSheet.find({
      farmerDealerCode: dealerCode,
      financialYear: previousFy
   });
   return round2(records.reduce((s, r) => s + (r.amount || 0), 0));
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. SUBSIDY RECEIVED
// ─────────────────────────────────────────────────────────────────────────────
async function calcSubsidyReceived(Models, dealerCode, fy) {
   const records = await Models.SubsidyRecord.find({
      farmerDealerCode: dealerCode,
      financialYear: fy
   });
   return round2(records.reduce((s, r) => s + (r.assistanceToBePaid || 0), 0));
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. INCENTIVES
// ─────────────────────────────────────────────────────────────────────────────
async function calcIncentives(Models, dealerCode, fy) {
   const { start, end } = fyToDates(fy);
   const records = await Models.Incentive.find({
      farmerDealerCode: dealerCode,
      date: { $gte: start, $lte: end },
   });
   return round2(records.reduce((s, r) => s + (r.amount || 0), 0));
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. OUTSTANDING FS
// ─────────────────────────────────────────────────────────────────────────────
async function calcOutstandingFs(Models, dealerCode, fy) {
   const adjusted = await Models.AdjustedSheet.find({
      farmerDealerCode: dealerCode,
      financialYear: nextFy(fy),
   });

   return round2(adjusted.reduce((s, r) => s + (r.amount || 0), 0));
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. TDS PAID
// ─────────────────────────────────────────────────────────────────────────────
async function calcTdsPaid(Models, dealerCode, fy) {
   const records = await Models.TdsRecord.find({
      farmerDealerCode: dealerCode,
      financialYear: fy
   });
   return round2(records.reduce((s, r) => s + (r.tdsAmount || 0), 0));
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. CASH PAID
// ─────────────────────────────────────────────────────────────────────────────
async function calcCashPaid(Models, dealerCode, fy) {
   const { start, end } = fyToDates(fy);
   const records = await Models.PaidCash.find({
      farmerDealerCode: dealerCode,
      date: { $gte: start, $lte: end },
   });
   return round2(records.reduce((s, r) => s + (r.amount || 0), 0));
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. OPENING BALANCE  = previous FY's netBalance
//
// e.g. for FY "23-24", opening balance = netBalance of "22-23"
// If no inventory data exists for the previous FY, returns 0 (base case).
// Recursively chains: 24-25 opens from 23-24, which opens from 22-23, etc.
// ─────────────────────────────────────────────────────────────────────────────
async function calcOpeningBalance(Models, dealerCode, fy) {
   const prev = prevFy(fy);

   // Fast path — saved snapshot exists, no recomputation needed
   const snapshot = await Models.HisabSnapshot.findOne({
      farmerDealerCode: dealerCode,
      financialYear: prev,
   }).lean();
   if (snapshot) return round2(snapshot.closingBalance);

   // No snapshot — check if prev FY has inventory before recomputing
   const { start, end } = fyToDates(prev);
   const hasPrevData = await Models.Inventory.exists({
      farmerDealerCode: dealerCode,
      date: { $gte: start, $lte: end },
   });
   if (!hasPrevData) return 0;

   const prevHisab = await computeHisab(Models, dealerCode, prev);
   return round2(prevHisab.netBalance);
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTER FUNCTION — compute full hisab for one dealer
// ─────────────────────────────────────────────────────────────────────────────
async function computeHisab(Models, dealerCode, fy) {
   const [
      inventoryCost,
      gstOnBilling,
      cashForExpenses,
      excessData,
      farmerShareReceived,
      fsAdjusted,
      subsidyReceived,
      incentives,
      outstandingFs,
      tdsPaid,
      cashPaid,
      openingBalance,
   ] = await Promise.all([
      calcInventoryCost(Models, dealerCode, fy),
      calcGstOnBilling(Models, dealerCode, fy),
      calcCashForExpenses(Models, dealerCode, fy),
      calcExcessExpense(Models, dealerCode, fy),
      calcFarmerShareReceived(Models, dealerCode, fy),
      calcFsAdjusted(Models, dealerCode, fy),
      calcSubsidyReceived(Models, dealerCode, fy),
      calcIncentives(Models, dealerCode, fy),
      calcOutstandingFs(Models, dealerCode, fy),
      calcTdsPaid(Models, dealerCode, fy),
      calcCashPaid(Models, dealerCode, fy),
      calcOpeningBalance(Models, dealerCode, fy),
   ]);

   const { total: inventoryCostTotal, shiftedDeduction, returnDeduction } = inventoryCost;
   const excessExpense = excessData.totalExcess;

   // Side A — Total Dues
   const sideA = round2(inventoryCostTotal + gstOnBilling + cashForExpenses + excessExpense + openingBalance);

   // Side B — Total Credits
   const sideB = round2(farmerShareReceived + fsAdjusted + subsidyReceived + incentives);

   // Net Balance = A − B + outstandingFs + tdsPaid + cashPaid + openingBalance
   // Negative = dealer in credit; Positive = dealer owes company
   const balanceAB = round2(sideA - sideB);
   const netBalance = round2(balanceAB + outstandingFs + tdsPaid + cashPaid);

   return {
      financialYear: fy,
      farmerDealerCode: dealerCode,
      sideA: {
         inventoryCost: inventoryCostTotal,
         shiftedDeduction,
         returnDeduction,
         gstOnBilling,
         cashForExpenses,
         excessExpense,
         total: sideA,
      },
      sideB: {
         farmerShareReceived,
         fsAdjusted,
         subsidyReceived,
         incentives,
         total: sideB,
      },
      balanceAB,
      outstandingFs,
      tdsPaid,
      cashPaid,
      openingBalance,
      netBalance,
      excessBreakdown: excessData.rows,
   };
}

function round2(n) {
   return Math.round((n || 0) * 100) / 100;
}

export { computeHisab, fyToDates, prevFy };
