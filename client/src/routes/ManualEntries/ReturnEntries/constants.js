// ─────────────────────────────────────────────────────────────────────────────
// ReturnEntry — constants & pure helpers
// Mirrors ShiftingEntry/constants.js — same categories, return-specific copy
// ─────────────────────────────────────────────────────────────────────────────

import { ALUMINIUM_ITEMS, FILTER_ITEMS, FITTINGS_ITEMS, HDPE_ITEMS, INLINE_LATERAL_ITEMS, LATERAL32_ITEMS, MISC_ITEMS, PVC_PIPE_ITEMS, SPRINKLER_ITEMS } from "../ShiftingEntries/constants";

// Re-export all item arrays from ShiftingEntry constants
// (single source of truth for item keys/labels)
// export {
//    HDPE_ITEMS,
//    LATERAL32_ITEMS,
//    FITTINGS_ITEMS,
//    SPRINKLER_ITEMS,
//    ALUMINIUM_ITEMS,
//    PVC_PIPE_ITEMS,
//    INLINE_LATERAL_ITEMS,
//    FILTER_ITEMS,
//    MISC_ITEMS,
// } from "../ShiftingEntries/constants";

// import {
//    HDPE_ITEMS,
//    LATERAL32_ITEMS,
//    FITTINGS_ITEMS,
//    SPRINKLER_ITEMS,
//    ALUMINIUM_ITEMS,
//    PVC_PIPE_ITEMS,
//    INLINE_LATERAL_ITEMS,
//    FILTER_ITEMS,
//    MISC_ITEMS,
// } from "../ShiftingEntries/constants";

// ── Category registry — same structure, return-specific subtitles ─────────────
export const CATEGORY_CONFIG = [
   {
      key: "hdpe",
      label: "HDPE pipe items",
      subtitle: "6 Mtr pipes — enter returned quantity",
      items: HDPE_ITEMS,
      accent: {
         title: "text-blue-700", border: "border-blue-100",
         header: "bg-blue-50/60", chevron: "text-blue-400",
         text: "text-blue-700", badge: "text-blue-500", value: "text-blue-600",
         summary: "text-blue-600", summaryBg: "bg-blue-50 border-blue-100",
      },
   },
   {
      key: "lateral32",
      label: "32 MM lateral items",
      subtitle: "CL-II laterals — enter returned quantity",
      items: LATERAL32_ITEMS,
      accent: {
         title: "text-amber-700", border: "border-amber-100",
         header: "bg-amber-50/60", chevron: "text-amber-400",
         text: "text-amber-700", badge: "text-amber-500", value: "text-amber-600",
         summary: "text-amber-600", summaryBg: "bg-amber-50 border-amber-100",
      },
   },
   {
      key: "fittings",
      label: "Fittings",
      subtitle: "Valves, tees, joiners, elbows, saddles",
      items: FITTINGS_ITEMS,
      accent: {
         title: "text-violet-700", border: "border-violet-100",
         header: "bg-violet-50/60", chevron: "text-violet-400",
         text: "text-violet-700", badge: "text-violet-500", value: "text-violet-600",
         summary: "text-violet-600", summaryBg: "bg-violet-50 border-violet-100",
      },
   },
   {
      key: "sprinklerParts",
      label: "Sprinkler parts",
      subtitle: "Bends, tees, PCNs, end caps, rubber rings",
      items: SPRINKLER_ITEMS,
      accent: {
         title: "text-cyan-700", border: "border-cyan-100",
         header: "bg-cyan-50/60", chevron: "text-cyan-400",
         text: "text-cyan-700", badge: "text-cyan-500", value: "text-cyan-600",
         summary: "text-cyan-600", summaryBg: "bg-cyan-50 border-cyan-100",
      },
   },
   {
      key: "aluminiumParts",
      label: "Aluminium parts",
      subtitle: "Pipes, bends, clamps, battens",
      items: ALUMINIUM_ITEMS,
      accent: {
         title: "text-slate-700", border: "border-slate-200",
         header: "bg-slate-50/60", chevron: "text-slate-400",
         text: "text-slate-700", badge: "text-slate-500", value: "text-slate-600",
         summary: "text-slate-600", summaryBg: "bg-slate-50 border-slate-200",
      },
   },
   {
      key: "pvcPipes",
      label: "PVC pipes",
      subtitle: "63 x 4 Kg and 75 x 4 Kg PVC pipes",
      items: PVC_PIPE_ITEMS,
      accent: {
         title: "text-orange-700", border: "border-orange-100",
         header: "bg-orange-50/60", chevron: "text-orange-400",
         text: "text-orange-700", badge: "text-orange-500", value: "text-orange-600",
         summary: "text-orange-600", summaryBg: "bg-orange-50 border-orange-100",
      },
   },
   {
      key: "inlineLaterals",
      label: "Inline laterals",
      subtitle: "12 MM & 16 MM drip inline laterals",
      items: INLINE_LATERAL_ITEMS,
      accent: {
         title: "text-lime-700", border: "border-lime-100",
         header: "bg-lime-50/60", chevron: "text-lime-500",
         text: "text-lime-700", badge: "text-lime-500", value: "text-lime-600",
         summary: "text-lime-600", summaryBg: "bg-lime-50 border-lime-100",
      },
   },
   {
      key: "filters",
      label: "Filters",
      subtitle: "Sand, screen and hydro cyclone filters",
      items: FILTER_ITEMS,
      accent: {
         title: "text-teal-700", border: "border-teal-100",
         header: "bg-teal-50/60", chevron: "text-teal-400",
         text: "text-teal-700", badge: "text-teal-500", value: "text-teal-600",
         summary: "text-teal-600", summaryBg: "bg-teal-50 border-teal-100",
      },
   },
   {
      key: "misc",
      label: "Miscellaneous",
      subtitle: "Drippers, manifolds, valves, mini sprinklers",
      items: MISC_ITEMS,
      accent: {
         title: "text-rose-700", border: "border-rose-100",
         header: "bg-rose-50/60", chevron: "text-rose-400",
         text: "text-rose-700", badge: "text-rose-500", value: "text-rose-600",
         summary: "text-rose-600", summaryBg: "bg-rose-50 border-rose-100",
      },
   },
];

// ── Pagination & timing ───────────────────────────────────────────────────────
export const PAGE_SIZE      = 8;
export const FLASH_SUCCESS_MS = 3500;
export const FLASH_ERROR_MS   = 4000;

// ── Pure helpers ──────────────────────────────────────────────────────────────

export function buildEmptyForm() {
   const categoryFields = Object.fromEntries(
      CATEGORY_CONFIG.map(cat => [
         cat.key,
         Object.fromEntries(cat.items.map(i => [i.key, ""]))
      ])
   );
   return { dealerName: "", dealerCode: "", financialYear: "", returnDate: "", ...categoryFields, remarks: "" };
}

export function toNumbers(obj) {
   return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, Number(v) || 0]));
}

export function sumObj(obj) {
   return Object.values(obj).reduce((s, v) => s + (Number(v) || 0), 0);
}

export function entryGrandTotal(entry) {
   return CATEGORY_CONFIG.reduce((total, cat) => total + sumObj(entry?.[cat.key] || {}), 0);
}
