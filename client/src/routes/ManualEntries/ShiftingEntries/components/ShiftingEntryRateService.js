/**
 * shiftingEntryRateService.js
 *
 * Resolves item rates for a shifting entry:
 *   Priority 1 → DealerItemRate  (dealer + FY specific)
 *   Priority 2 → ItemRate        (global fallback)
 *   Priority 3 → 0               (not found anywhere)
 *
 * Unlike returnEntryRateService, the entry is passed in directly
 * (no dealer-based fetch endpoint on shifting-entry routes).
 *
 * Usage:
 *   const { rows, grandTotal } = await resolveShiftingEntryRates(entry, cutoffDate);
 */

import api from "../../../../api/axios";
import { CATEGORY_CONFIG } from "../constants";
import { KEY_TO_ITEM_NAME } from "../../../../constants/ItemRates";

// ── Section keys (mirrors CATEGORY_CONFIG order) ─────────────────────────────

const SECTION_KEYS = CATEGORY_CONFIG.map(cat => cat.key);

// ── Raw fetch helpers ─────────────────────────────────────────────────────────

async function fetchDealerRates(dealerId, financialYear) {
   const { data } = await api.get("/dealer-item-rates", {
      params: { dealer: dealerId, financialYear },
   });
   return data?.data ?? [];
}

async function fetchGlobalRates() {
   const { data } = await api.get("/item-rates");
   return data?.data ?? [];
}

// ── Rate resolver ─────────────────────────────────────────────────────────────

function buildRateMap(dealerRates, globalRates) {
   const map = {};
   for (const r of globalRates) {
      map[r.itemName] = { rateUpto: r.rateUpto, rateFrom: r.rateFrom };
   }
   for (const r of dealerRates) {
      map[r.itemName] = { rateUpto: r.rateUpto, rateFrom: r.rateFrom };
   }
   return map;
}

// ── Flatten entry sections into item rows ─────────────────────────────────────

function flattenEntryItems(entry) {
   const rows = [];
   for (const section of SECTION_KEYS) {
      const sectionData = entry[section];
      if (!sectionData || typeof sectionData !== "object") continue;
      for (const [key, qty] of Object.entries(sectionData)) {
         if (!qty || qty <= 0) continue;
         const itemName = KEY_TO_ITEM_NAME[key];
         if (!itemName) continue;
         rows.push({ key, itemName, qty, section });
      }
   }
   rows.sort((a, b) => a.itemName.localeCompare(b.itemName));
   return rows;
}

// ── Main exported function ────────────────────────────────────────────────────

/**
 * @param {object}      entry       — full shifting entry document (from props)
 * @param {Date|string} cutoffDate  — Sep 13 2022; rows before use rateUpto, after use rateFrom.
 *                                    Pass null to always use rateFrom.
 *
 * @returns {Promise<{
 *   rows: Array<{
 *     key: string,
 *     section: string,
 *     itemName: string,
 *     qty: number,
 *     rate: number,
 *     total: number,
 *     rateSource: "dealer"|"global"|"none",
 *     rateUpto: number,
 *     rateFrom: number,
 *   }>,
 *   grandTotal: number,
 * }>}
 */
export async function resolveShiftingEntryRates(entry, cutoffDate = new Date("2022-09-13")) {
   const dealerId = entry.dealer?._id || entry.dealer;
   const fy = entry.financialYear;

   const [dealerRates, globalRates] = await Promise.all([
      fetchDealerRates(dealerId, fy),
      fetchGlobalRates(),
   ]);

   const rateMap = buildRateMap(dealerRates, globalRates);
   const cutoff = cutoffDate ? new Date(cutoffDate) : null;
   const entryDate = entry.returnDate ? new Date(entry.returnDate) : null;
   const useRateUpto = cutoff && entryDate && entryDate <= cutoff;

   const itemRows = flattenEntryItems(entry);
   let grandTotal = 0;

   const rows = itemRows.map((item) => {
      const rateEntry = rateMap[item.itemName];

      let rate = 0;
      let rateSource = "none";

      if (rateEntry) {
         rate = useRateUpto ? rateEntry.rateUpto : rateEntry.rateFrom;
         const isDealerOverride = dealerRates.some(r => r.itemName === item.itemName);
         rateSource = isDealerOverride ? "dealer" : "global";
      }

      const total = item.qty * rate;
      grandTotal += total;

      return {
         ...item,
         rate,
         total,
         rateSource,
         rateUpto: rateEntry?.rateUpto ?? 0,
         rateFrom: rateEntry?.rateFrom ?? 0,
      };
   });

   return { rows, grandTotal };
}