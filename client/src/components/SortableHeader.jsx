import { HiSelector, HiSortAscending, HiSortDescending } from "react-icons/hi";

function SortableHeader({ label, colKey, sortConfig, onSort, sortable = true }) {
   const isActive = sortConfig.key === colKey;
   const isAsc    = isActive && sortConfig.direction === "asc";
   const isDesc   = isActive && sortConfig.direction === "desc";

   if (!sortable) {
      return (
         <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {label}
         </span>
      );
   }

   return (
      <button
         onClick={() => onSort(colKey)}
         className={`
            flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest
            transition-colors group
            ${isActive ? "text-green-700" : "text-slate-500 hover:text-slate-700"}
         `}
      >
         {label}
         <span className="shrink-0">
            {isAsc  && <HiSortAscending  className="w-3.5 h-3.5 text-green-600" />}
            {isDesc && <HiSortDescending className="w-3.5 h-3.5 text-green-600" />}
            {!isActive && (
               <HiSelector className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 transition-colors" />
            )}
         </span>
      </button>
   );
}

export default SortableHeader;