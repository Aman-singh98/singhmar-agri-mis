
import { useState, useEffect } from "react";
import { CATEGORY_CONFIG, entryGrandTotal } from "../constants";
import { fetchReturnEntryWithRates } from "./returnEntryRateService";

// ─────────────────────────────────────────────────────────────────────────────
// ViewReturnModal — read-only detail popup for a return entry
// Tab 1: Item quantities (original)
// Tab 2: Value breakdown — qty × rate = total
//
// Rules:
//   - No inline CSS (style={{...}})
//   - No rounded-* Tailwind classes
//   - Toggle active tab system (one active at a time)
// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
   {
      key: "items",
      label: "Items",
      iconPath: "M4 6h16M4 10h16M4 14h16M4 18h7",
   },
   {
      key: "value",
      label: "Value Breakdown",
      iconPath:
         "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
   },
];

// ── Item accordion ────────────────────────────────────────────────────────────
function ItemAccordion({ cat, entryData }) {
   const [open, setOpen] = useState(true);
   const { accent, label, items } = cat;
   const total = items.reduce((s, i) => s + (Number(entryData?.[i.key]) || 0), 0);
   const hasAnyData = items.some((i) => (Number(entryData?.[i.key]) || 0) > 0);
   if (!hasAnyData) return null;

   return (
      <div className={`border ${accent.border} overflow-hidden`}>
         <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={`w-full flex items-center justify-between px-4 py-2.5 ${accent.header} hover:brightness-95 transition-all focus:outline-none`}
         >
            <div className="flex items-center gap-2">
               <span className={`text-xs font-semibold ${accent.text}`}>{label}</span>
               <span
                  className={`text-[10px] font-bold ${accent.badge} bg-white/80 border ${accent.border} px-1.5 py-0.5 tabular-nums`}
               >
                  {total}
               </span>
            </div>
            <svg
               className={`w-3.5 h-3.5 ${accent.badge} transition-transform duration-200 ${open ? "rotate-180" : ""}`}
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               viewBox="0 0 24 24"
            >
               <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
         </button>

         <div
            className={`divide-y divide-gray-50 overflow-hidden transition-all duration-200 ${
               open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
         >
            {items.map((item) => {
               const qty = Number(entryData?.[item.key]) || 0;
               if (!qty) return null;
               return (
                  <div key={item.key} className="flex items-center justify-between px-4 py-2 bg-white">
                     <span className="text-xs text-gray-600 leading-snug flex-1 pr-3">{item.label}</span>
                     <span className={`font-mono text-xs font-semibold tabular-nums ${accent.value}`}>{qty}</span>
                  </div>
               );
            })}
         </div>
      </div>
   );
}

// ── Rate badge ────────────────────────────────────────────────────────────────
function RateBadge({ source }) {
   if (source === "dealer")
      return (
         <span className="inline-flex items-center bg-green-50 border border-green-200 px-2 py-0.5 text-[10px] font-medium text-green-700">
            Dealer
         </span>
      );
   if (source === "global")
      return (
         <span className="inline-flex items-center bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-medium text-blue-700">
            Global
         </span>
      );
   return (
      <span className="inline-flex items-center bg-gray-100 border border-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-500">
         No Rate
      </span>
   );
}

// ── Value breakdown tab ───────────────────────────────────────────────────────
function ValueBreakdown({ entry }) {
   const [state, setState] = useState({ status: "idle", rows: [], grandTotal: 0, error: "" });

   useEffect(() => {
      const dealerId = entry.dealer?._id || entry.dealer;
      const fy = entry.financialYear;
      if (!dealerId || !fy) {
         setState({ status: "error", rows: [], grandTotal: 0, error: "Missing dealer or financial year." });
         return;
      }
      setState((s) => ({ ...s, status: "loading" }));
      fetchReturnEntryWithRates(dealerId, fy)
         .then((result) =>
            setState({ status: "done", rows: result.rows, grandTotal: result.grandTotal, error: "" })
         )
         .catch(() =>
            setState({ status: "error", rows: [], grandTotal: 0, error: "Failed to load rates. Please try again." })
         );
   }, []);

   if (state.status === "idle" || state.status === "loading") {
      return (
         <div className="flex justify-center py-12">
            <div className="h-7 w-7 animate-spin border-4 border-green-600 border-t-transparent" />
         </div>
      );
   }

   if (state.status === "error") {
      return <p className="py-8 text-center text-xs text-red-500">{state.error}</p>;
   }

   if (!state.rows.length) {
      return (
         <p className="py-8 text-center text-xs text-gray-400">
            No items with quantity &gt; 0 found in this entry.
         </p>
      );
   }

   const noRateCount = state.rows.filter((r) => r.rateSource === "none").length;

   return (
      <div className="space-y-3">
         {noRateCount > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-2">
               <span className="text-amber-600 text-xs">⚠</span>
               <span className="text-xs text-amber-700">
                  {noRateCount} item{noRateCount !== 1 ? "s" : ""} have no rate — shown as ₹ 0
               </span>
            </div>
         )}

      <div className="flex flex-wrap items-center gap-3">
   <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
      <RateBadge source="dealer" />
      <span className="text-xs text-gray-600">Dealer Override</span>
   </div>

   <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
      <RateBadge source="global" />
      <span className="text-xs text-gray-600">Global Rate</span>
   </div>
</div>

         {/* Grand total chip */}
         <div className="flex items-center justify-between border border-green-100 bg-green-50 px-4 py-2.5">
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Grand Total</span>
            <span className="text-xl font-bold text-green-700 tabular-nums">₹ {state.grandTotal.toFixed(2)}</span>
         </div>

         {/* Item rows table */}
         <div className="border border-gray-200 overflow-hidden">
            <div className="overflow-y-auto max-h-[340px]">
               <table className="w-full text-xs border-collapse">
                  <thead>
                     <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wide w-full">Item</th>
                        <th className="text-right px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Qty</th>
                        <th className="text-right px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Rate</th>
                        <th className="text-center px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Src</th>
                        <th className="text-right px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Total</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {state.rows.map((row) => (
                        <tr
                           key={row.key}
                           className={row.rateSource === "none" ? "bg-amber-50/40" : "bg-white"}
                        >
                           <td className="px-4 py-2 text-xs text-gray-700 leading-snug">{row.itemName}</td>
                           <td className="px-4 py-2 text-xs font-semibold tabular-nums text-gray-600 text-right whitespace-nowrap">{row.qty}</td>
                           <td className="px-4 py-2 text-right whitespace-nowrap">
                              <span
                                 className="text-xs tabular-nums text-gray-600 cursor-help border-b border-dashed border-gray-300"
                                 title={`Upto Sep 13 2022: ₹${row.rateUpto.toFixed(2)}\nAfter Sep 13 2022: ₹${row.rateFrom.toFixed(2)}`}
                              >
                                 ₹{row.rate.toFixed(2)}
                              </span>
                           </td>
                           <td className="px-4 py-2 text-center whitespace-nowrap">
                              <RateBadge source={row.rateSource} />
                           </td>
                           <td className="px-4 py-2 text-xs font-bold tabular-nums text-green-700 text-right whitespace-nowrap">
                              ₹{row.total.toFixed(2)}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* Footer total */}
            <div className="flex items-center justify-between bg-gray-50 border-t-2 border-gray-200 px-4 py-2.5">
               <span className="text-xs font-semibold text-gray-600">Total</span>
               <span className="text-sm font-bold text-green-700 tabular-nums">₹ {state.grandTotal.toFixed(2)}</span>
            </div>
         </div>
      </div>
   );
}

// ── Main modal ────────────────────────────────────────────────────────────────
function ViewReturnModal({ entry, onClose }) {
   const [activeTab, setActiveTab] = useState("items");

   const grandTotal = entryGrandTotal(entry);
   const dealerName = entry.dealer?.dealerName || "—";
   const dealerCode = entry.dealer?.farmerDealerCode || "—";

   const catTotals = CATEGORY_CONFIG.map((cat) => ({
      ...cat,
      total: cat.items.reduce((s, i) => s + (Number(entry[cat.key]?.[i.key]) || 0), 0),
   })).filter((c) => c.total > 0);

   return (
      <div
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
         onClick={onClose}
      >
         <div
            className="bg-white shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
         >
            {/* ── Sticky header ── */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shrink-0">
               <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-green-100 flex items-center justify-center shrink-0">
                     <span className="text-[10px] font-bold text-green-700 select-none">
                        {dealerName.slice(0, 2).toUpperCase()}
                     </span>
                  </div>
                  <div>
                     <p className="text-sm font-semibold text-gray-800 leading-tight">{dealerName}</p>
                     <p className="text-[11px] text-gray-400">
                        <span className="font-mono">{dealerCode}</span>
                        <span className="mx-1.5 text-gray-300">·</span>
                        FY {entry.financialYear}
                        {entry.returnDate && (
                           <>
                              <span className="mx-1.5 text-gray-300">·</span>
                              Return:{" "}
                              {new Date(entry.returnDate).toLocaleDateString("en-IN", {
                                 day: "2-digit",
                                 month: "short",
                                 year: "numeric",
                              })}
                           </>
                        )}
                     </p>
                  </div>
               </div>
               <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
               >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </div>

            {/* ── Tab switcher (toggle active system) ── */}
            <div className="flex items-center border-b border-gray-200 shrink-0">
               {TABS.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                     <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={[
                           "flex items-center gap-1.5 px-5 py-3 text-xs font-medium border-b-2 transition-all",
                           isActive
                              ? "border-green-600 text-green-700 bg-green-50"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50",
                        ].join(" ")}
                     >
                        <svg
                           className="w-3 h-3"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                           viewBox="0 0 24 24"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d={tab.iconPath} />
                        </svg>
                        {tab.label}
                     </button>
                  );
               })}
            </div>

            {/* ── Scrollable body ── */}
            <div className="overflow-y-auto flex-1 p-4 space-y-3">

               {/* ── Tab: Items ── */}
               {activeTab === "items" && (
                  <>
                     {/* Grand total chip */}
                     <div className="flex items-center justify-between border border-green-100 bg-green-50 px-4 py-2.5">
                        <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                           Total returned
                        </span>
                        <span className="text-xl font-bold text-green-700 tabular-nums">{grandTotal}</span>
                     </div>

                     {/* Per-category summary chips */}
                     {catTotals.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                           {catTotals.map((cat) => (
                              <div
                                 key={cat.key}
                                 className={`flex items-center gap-1 border px-2.5 py-1 ${cat.accent.summaryBg}`}
                              >
                                 <span className={`text-[10px] font-semibold ${cat.accent.summary}`}>
                                    {cat.label}
                                 </span>
                                 <span className={`text-xs font-bold tabular-nums ${cat.accent.summary}`}>
                                    {cat.total}
                                 </span>
                              </div>
                           ))}
                        </div>
                     )}

                     {/* Category accordions */}
                     {CATEGORY_CONFIG.map((cat) => (
                        <ItemAccordion key={cat.key} cat={cat} entryData={entry[cat.key]} />
                     ))}

                     {/* Remarks */}
                     {entry.remarks && (
                        <div className="border border-gray-100 bg-gray-50/60 px-4 py-2.5">
                           <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                              Remarks
                           </p>
                           <p className="text-xs text-gray-600 italic">{entry.remarks}</p>
                        </div>
                     )}
                  </>
               )}

               {/* ── Tab: Value breakdown ── */}
               {activeTab === "value" && <ValueBreakdown entry={entry} />}
            </div>
         </div>
      </div>
   );
}

export default ViewReturnModal;