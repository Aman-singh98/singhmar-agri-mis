import { HiArrowRight } from "react-icons/hi";

const ACCENTS = {
  emerald: "group-hover:bg-emerald-100 group-hover:ring-emerald-200 group-hover:text-emerald-700",
  blue:    "group-hover:bg-blue-100    group-hover:ring-blue-200    group-hover:text-blue-700",
  amber:   "group-hover:bg-amber-100   group-hover:ring-amber-200   group-hover:text-amber-700",
  rose:    "group-hover:bg-rose-100    group-hover:ring-rose-200    group-hover:text-rose-700",
  violet:  "group-hover:bg-violet-100  group-hover:ring-violet-200  group-hover:text-violet-700",
};

export default function QuickActionBtn({ label, description, icon: Icon, onClick, delay = 0, badge, accent = "emerald" }) {
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className="group w-full text-left flex items-center gap-3 p-3.5
        bg-white border border-gray-100 hover:border-gray-200
        hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 animate-fadeUp"
    >
      <div className={`w-9 h-9 bg-gray-50 flex items-center justify-center flex-shrink-0
        transition-all ring-1 ring-gray-100 ${ACCENTS[accent] ?? ACCENTS.emerald}`}>
        <Icon className="w-4 h-4 text-gray-400 group-hover:text-inherit transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{label}</p>
          {badge && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 font-bold">{badge}</span>}
        </div>
        <p className="text-xs text-gray-400 truncate mt-0.5">{description}</p>
      </div>
      <HiArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
    </button>
  );
}