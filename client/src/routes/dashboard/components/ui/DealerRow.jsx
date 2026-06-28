import { HiArrowRight } from "react-icons/hi";

const COLORS = [
  "bg-emerald-50 text-emerald-700 border-emerald-100",
  "bg-blue-50 text-blue-700 border-blue-100",
  "bg-amber-50 text-amber-700 border-amber-100",
  "bg-violet-50 text-violet-700 border-violet-100",
  "bg-rose-50 text-rose-700 border-rose-100",
];

export default function DealerRow({ dealer, index, onNavigate }) {
  const initials = dealer.dealerName?.slice(0, 2).toUpperCase() ?? "??";
  return (
    <div
      onClick={onNavigate}
      style={{ animationDelay: `${index * 35}ms` }}
      className="flex items-center gap-3 py-2.5 px-3 hover:bg-gray-50 transition-colors group cursor-pointer animate-fadeUp"
    >
      <div className={`w-8 h-8 border flex items-center justify-center flex-shrink-0 text-xs font-bold ${COLORS[index % COLORS.length]}`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{dealer.dealerName}</p>
        <p className="text-xs font-mono text-gray-400">{dealer.farmerDealerCode}</p>
      </div>
      <HiArrowRight className="w-3.5 h-3.5 text-gray-200 group-hover:text-emerald-500 transition-colors" />
    </div>
  );
}