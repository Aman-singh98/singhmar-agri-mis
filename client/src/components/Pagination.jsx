function getPageNums(cur, total) {
   if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
   if (cur <= 4) return [1, 2, 3, 4, 5, "...", total];
   if (cur >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
   return [1, "...", cur - 1, cur, cur + 1, "...", total];
}

function Pagination({ currentPage, totalPages, onPageChange }) {
   if (totalPages <= 1) return null;

   const pages = getPageNums(currentPage, totalPages);

   return (
      <div className="flex items-center justify-between mt-3 px-1">
         <span className="text-[11px] text-slate-400 font-mono">
            Page {currentPage} of {totalPages}
         </span>
         <div className="flex items-center gap-1">

            {/* Prev */}
            <button
               onClick={() => onPageChange(currentPage - 1)}
               disabled={currentPage === 1}
               className="w-7 h-7 flex items-center justify-center border border-slate-200
                  text-slate-500 text-xs hover:bg-slate-50 hover:text-slate-700
                  disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
               ‹
            </button>

            {/* Page numbers */}
            {pages.map((p, i) =>
               p === "..." ? (
                  <span
                     key={`ellipsis-${i}`}
                     className="w-7 h-7 flex items-center justify-center text-xs text-slate-300"
                  >
                     …
                  </span>
               ) : (
                  <button
                     key={p}
                     onClick={() => onPageChange(p)}
                     className={
                        "w-7 h-7 flex items-center justify-center text-xs font-semibold transition-colors " +
                        (p === currentPage
                           ? "bg-green-700 text-white border border-green-700"
                           : "border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800")
                     }
                  >
                     {p}
                  </button>
               )
            )}

            {/* Next */}
            <button
               onClick={() => onPageChange(currentPage + 1)}
               disabled={currentPage === totalPages}
               className="w-7 h-7 flex items-center justify-center border border-slate-200
                  text-slate-500 text-xs hover:bg-slate-50 hover:text-slate-700
                  disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
               ›
            </button>

         </div>
      </div>
   );
}

export default Pagination;