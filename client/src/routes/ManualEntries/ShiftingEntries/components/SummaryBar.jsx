
import { CATEGORY_CONFIG } from "../constants";

function SummaryBar({ categorySums }) {
   const grandTotal = Object.values(categorySums).reduce((s, v) => s + (v || 0), 0);
   const activeCats = CATEGORY_CONFIG.filter(cat => (categorySums[cat.key] || 0) > 0);

   return (
      <div className="bg-slate-50 border border-slate-200 border-l-4 border-l-green-600 px-4 py-3 space-y-2.5">

         {/* Header */}
         <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
               Total Adjustments
            </span>
            <span className="text-base font-bold text-green-700 tabular-nums font-mono">
               {grandTotal}
            </span>
         </div>

         {/* Per-category chips */}
         {activeCats.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
               {activeCats.map(cat => (
                  <div
                     key={cat.key}
                     className={`flex items-center gap-1.5 border px-2.5 py-1 ${cat.accent.summaryBg}`}
                  >
                     <span className={`text-[10px] font-semibold ${cat.accent.summary}`}>{cat.label}</span>
                     <span className={`text-xs font-bold tabular-nums font-mono ${cat.accent.summary}`}>
                        {categorySums[cat.key]}
                     </span>
                  </div>
               ))}
            </div>
         ) : (
            <p className="text-[11px] text-slate-300 font-mono">No quantities entered yet.</p>
         )}
      </div>
   );
}

export default SummaryBar;