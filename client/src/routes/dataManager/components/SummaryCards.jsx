

// SummaryCards.jsx
import { HiTrendingUp, HiCurrencyRupee, HiUsers, HiDocumentText, HiScale, HiCalculator } from "react-icons/hi";

function formatValue(val) {
   const num = Number(val);
   if (isNaN(num)) return val ?? 0;
   return num % 1 === 0
      ? num.toLocaleString("en-IN")
      : num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const iconMap = {
   amount: HiCurrencyRupee,
   total: HiTrendingUp,
   count: HiDocumentText,
   quantity: HiScale,
   farmers: HiUsers,
   default: HiCalculator,
};

function SummaryCards({ summaryCards = [], summary }) {
   return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
         {summaryCards.map(card => {
            const Icon = iconMap[card.iconType] || iconMap.default;
            const value = summary?.[card.key] ?? 0;
            
            return (
               <div
                  key={card.key}
                  className="group relative bg-white border border-slate-200 hover:border-green-400 transition-colors overflow-hidden"
               >
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600 group-hover:bg-green-500 transition-colors" />
                  
                  <div className="pl-4 pr-3 py-3">
                     <div className="flex items-start justify-between mb-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-tight">
                           {card.label}
                        </p>
                        <Icon className="w-4 h-4 text-slate-300 group-hover:text-green-500 transition-colors shrink-0 ml-2" />
                     </div>
                     
                     <div className="flex items-baseline gap-1">
                        {card.currency && (
                           <span className="text-sm font-bold text-green-700">₹</span>
                        )}
                        <span className="text-xl font-bold text-slate-800 font-mono tabular-nums tracking-tight">
                           {card.format || card.currency
                              ? formatValue(value)
                              : value
                           }
                        </span>
                        {card.currency && (
                           <span className="text-xs font-medium text-slate-400">/-</span>
                        )}
                     </div>
                     
                     {card.suffix && (
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">
                           {card.suffix}
                        </p>
                     )}
                  </div>
               </div>
            );
         })}
      </div>
   );
}

export default SummaryCards;