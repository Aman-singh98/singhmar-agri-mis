
import { CATEGORY_CONFIG } from "../constants";

// ─────────────────────────────────────────────────────────────────────────────
// ReturnSummaryBar — per-category totals + grand total at bottom of return form
// No inline styles · standard Tailwind only
//
// Props:
//   categorySums  object — { [categoryKey]: number }
// ─────────────────────────────────────────────────────────────────────────────

function ReturnSummaryBar({ categorySums }) {
   const grandTotal = Object.values(categorySums).reduce((s, v) => s + (v || 0), 0);
   const activeCats = CATEGORY_CONFIG.filter(cat => (categorySums[cat.key] || 0) > 0);

   return (
      <div className=" bg-green-50 border border-green-100 px-4 py-3 space-y-2.5">

         {/* Grand total row */}
         <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
               Total returned
            </span>
            <span className="text-base font-bold text-green-700 tabular-nums">
               {grandTotal}
            </span>
         </div>

         {/* Per-category chips */}
         {activeCats.length > 0 && (
            <div className="flex flex-wrap gap-2">
               {activeCats.map(cat => (
                  <div
                     key={cat.key}
                     className={[
                        "flex items-center gap-1.5  border px-2.5 py-1",
                        cat.accent.summaryBg,
                     ].join(" ")}
                  >
                     <span className={["text-xs font-semibold", cat.accent.summary].join(" ")}>
                        {cat.label}
                     </span>
                     <span className={["text-xs font-bold tabular-nums", cat.accent.summary].join(" ")}>
                        {categorySums[cat.key]}
                     </span>
                  </div>
               ))}
            </div>
         )}

         {activeCats.length === 0 && (
            <p className="text-xs text-green-300">No quantities entered yet.</p>
         )}
      </div>
   );
}

export default ReturnSummaryBar;