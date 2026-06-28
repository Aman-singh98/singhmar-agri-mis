/**
 * returnEntryRateService.js
 *
 * Fetches a dealer's return entry + resolves item rates:
 *   Priority 1 → DealerItemRate  (dealer + FY specific)
 *   Priority 2 → ItemRate        (global fallback)
 *   Priority 3 → 0               (not found anywhere)
 *
 * Usage:
 *   const rows = await fetchReturnEntryWithRates(dealerId, fy, cutoffDate);
 */

import api from "../../../../api/axios";
import { KEY_TO_ITEM_NAME } from "../../../../constants/ItemRates";

// ── 1. Raw fetch helpers ──────────────────────────────────────────────────────

async function fetchReturnEntries(dealerId, fy) {
   const url = fy
      ? `/return-entry/dealer/${dealerId}?fy=${fy}`
      : `/return-entry/dealer/${dealerId}`;
   const { data } = await api.get(url);
   // API returns array directly
   return Array.isArray(data) ? data : [];
}

async function fetchDealerRates(dealerId, financialYear) {
   const { data } = await api.get(`/dealer-item-rates`, {
      params: { dealer: dealerId, financialYear },
   });
   // { success: true, data: [...] }
   return data?.data ?? [];
}

async function fetchGlobalRates() {
   const { data } = await api.get(`/item-rates`);
   // { data: [...] }
   return data?.data ?? [];
}

// ── 2. Rate resolver ──────────────────────────────────────────────────────────

/**
 * Builds a lookup: itemName → { rateUpto, rateFrom }
 * DealerItemRate wins over ItemRate for the same itemName.
 */
function buildRateMap(dealerRates, globalRates) {
   const map = {};

   // Load global rates first (lower priority)
   for (const r of globalRates) {
      map[r.itemName] = { rateUpto: r.rateUpto, rateFrom: r.rateFrom };
   }

   // Overwrite with dealer-specific rates (higher priority)
   for (const r of dealerRates) {
      map[r.itemName] = { rateUpto: r.rateUpto, rateFrom: r.rateFrom };
   }

   return map;
}

// ── 3. Flatten entry sections into item rows ──────────────────────────────────

/**
 * A ReturnEntry stores quantities nested by section:
 *   entry.hdpe.63MmHdpePipe = 5
 *   entry.fittings.32MmTee  = 2
 *   ...
 *
 * This flattens all sections into:
 *   [{ key, itemName, qty }, ...]   — only where qty > 0
 */
const SECTION_KEYS = [
   "hdpe",
   "lateral32",
   "fittings",
   "sprinklerParts",
   "aluminiumParts",
   "pvcPipes",
   "inlineLaterals",
   "filters",
   "misc",
];

function flattenEntryItems(entry) {
   const rows = [];

   for (const section of SECTION_KEYS) {
      const sectionData = entry[section];
      if (!sectionData || typeof sectionData !== "object") continue;

      for (const [key, qty] of Object.entries(sectionData)) {
         if (!qty || qty <= 0) continue; // skip zero quantities
         const itemName = KEY_TO_ITEM_NAME[key];
         if (!itemName) continue; // unknown key — skip
         rows.push({ key, itemName, qty, section });
      }
   }

   // Sort alphabetically by item name
   rows.sort((a, b) => a.itemName.localeCompare(b.itemName));
   return rows;
}

// ── 4. Main exported function ─────────────────────────────────────────────────

/**
 * @param {string}  dealerId      — Mongo _id of the dealer
 * @param {string}  fy            — e.g. "24-25"
 * @param {Date|string} cutoffDate — Sep 13 2022; rows before use rateUpto, after use rateFrom
 *                                   Pass null to always use rateFrom.
 *
 * @returns {Promise<{
 *   entry: object,           — raw entry document
 *   rows: Array<{
 *     key: string,
 *     section: string,
 *     itemName: string,
 *     qty: number,
 *     rate: number,          — resolved rate for the entry's returnDate
 *     total: number,         — qty × rate
 *     rateSource: "dealer"|"global"|"none",
 *     rateUpto: number,
 *     rateFrom: number,
 *   }>,
 *   grandTotal: number,
 * }>}
 */
export async function fetchReturnEntryWithRates(dealerId, fy, cutoffDate = new Date("2022-09-13")) {
   // Parallel fetch — return entries + both rate sources
   const [entries, dealerRates, globalRates] = await Promise.all([
      fetchReturnEntries(dealerId, fy),
      fetchDealerRates(dealerId, fy),
      fetchGlobalRates(),
   ]);

   if (!entries.length) {
      return { entry: null, rows: [], grandTotal: 0 };
   }

   // Use the most recent entry (sorted desc by returnDate from API)
   const entry = entries[0];

   const rateMap = buildRateMap(dealerRates, globalRates);
   const cutoff = cutoffDate ? new Date(cutoffDate) : null;
   const returnDate = entry.returnDate ? new Date(entry.returnDate) : null;

   // Determine which rate column to use based on returnDate vs cutoff
   const useRateUpto = cutoff && returnDate && returnDate <= cutoff;

   const itemRows = flattenEntryItems(entry);

   let grandTotal = 0;

   const rows = itemRows.map((item) => {
      const rateEntry = rateMap[item.itemName];

      let rate = 0;
      let rateSource = "none";

      if (rateEntry) {
         rate = useRateUpto ? rateEntry.rateUpto : rateEntry.rateFrom;

         // Determine source for display badge
         const isDealerOverride = dealerRates.some((r) => r.itemName === item.itemName);
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

   return { entry, rows, grandTotal };
}
