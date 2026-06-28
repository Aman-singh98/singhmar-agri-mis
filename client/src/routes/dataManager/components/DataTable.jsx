
// // DataTable.jsx (Redesigned)
// import { useState, useMemo } from "react";
// import { HiSearch, HiX, HiChevronLeft, HiChevronRight, HiChevronDoubleLeft, HiChevronDoubleRight, HiSortAscending, HiSortDescending, HiDocumentText } from "react-icons/hi";
// import Pagination from "../../../components/Pagination";

// const ROWS_PER_PAGE = 10;

// function formatValue(val) {
//    const num = Number(val);
//    if (isNaN(num) || val === "" || val === null || val === undefined) return null;
//    return num % 1 === 0
//       ? num.toLocaleString("en-IN")
//       : num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// }

// function formatDate(val) {
//    if (!val) return null;
//    const d = new Date(val);
//    if (isNaN(d)) return String(val);
//    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
// }

// function DataTable({ columns, rows, srNoKey = "srNo", sortable = true }) {
//    const [currentPage, setCurrentPage] = useState(1);
//    const [search, setSearch] = useState("");
//    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

//    const displayColumns = columns.filter(col => col.key !== srNoKey);

//    const filteredRows = useMemo(() => {
//       if (!rows) return [];
//       const q = search.trim().toLowerCase();
//       let filtered = !q
//          ? [...rows]
//          : rows.filter(row =>
//               columns.some(col => {
//                  const val = row[col.key];
//                  return val !== undefined && val !== null &&
//                     String(val).toLowerCase().includes(q);
//               })
//            );

//       // Sort
//       if (sortConfig.key && sortable) {
//          filtered.sort((a, b) => {
//             const aVal = a[sortConfig.key];
//             const bVal = b[sortConfig.key];
            
//             if (aVal === null || aVal === undefined) return 1;
//             if (bVal === null || bVal === undefined) return -1;
            
//             const aNum = Number(aVal);
//             const bNum = Number(bVal);
            
//             if (!isNaN(aNum) && !isNaN(bNum)) {
//                return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
//             }
            
//             const comparison = String(aVal).localeCompare(String(bVal));
//             return sortConfig.direction === "asc" ? comparison : -comparison;
//          });
//       } else {
//          // Default srNo sort
//          filtered.sort((a, b) => {
//             const aVal = Number(a[srNoKey]) || 0;
//             const bVal = Number(b[srNoKey]) || 0;
//             return aVal - bVal;
//          });
//       }
      
//       return filtered;
//    }, [rows, columns, search, srNoKey, sortConfig, sortable]);

//    function handleSort(key) {
//       if (!sortable) return;
//       setSortConfig(current => ({
//          key,
//          direction: current.key === key && current.direction === "asc" ? "desc" : "asc"
//       }));
//    }

//    function handleSearch(e) {
//       setSearch(e.target.value);
//       setCurrentPage(1);
//    }

//    function clearSearch() {
//       setSearch("");
//       setCurrentPage(1);
//    }

//    if (!rows || rows.length === 0) {
//       return (
//          <div className="border border-slate-200 bg-slate-50 py-12 text-center">
//             <HiDocumentText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
//             <p className="text-sm font-medium text-slate-400">No records available</p>
//          </div>
//       );
//    }

//    const totalPages = Math.ceil(filteredRows.length / ROWS_PER_PAGE);
//    const start = (currentPage - 1) * ROWS_PER_PAGE;
//    const pageRows = filteredRows.slice(start, start + ROWS_PER_PAGE);
//    const globalIndex = (i) => start + i + 1;

//    // Pagination numbers
//    const getPageNumbers = () => {
//       const pages = [];
//       const maxVisible = 5;
//       let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
//       let endPage = Math.min(totalPages, startPage + maxVisible - 1);
      
//       if (endPage - startPage + 1 < maxVisible) {
//          startPage = Math.max(1, endPage - maxVisible + 1);
//       }
      
//       for (let i = startPage; i <= endPage; i++) {
//          pages.push(i);
//       }
//       return pages;
//    };

//    return (
//       <div className="flex flex-col gap-3">

//          {/* ── Toolbar ─────────────────────────────────────── */}
//          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//             <div className="relative max-w-xs">
//                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                <input
//                   type="text"
//                   value={search}
//                   onChange={handleSearch}
//                   placeholder="Search records..."
//                   className="w-full pl-9 pr-8 py-2 text-sm border border-slate-300 bg-white
//                      focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600
//                      placeholder:text-slate-400 text-slate-700"
//                />
//                {search && (
//                   <button
//                      onClick={clearSearch}
//                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1
//                         text-slate-400 hover:text-slate-600 transition-colors"
//                      aria-label="Clear search"
//                   >
//                      <HiX className="w-4 h-4" />
//                   </button>
//                )}
//             </div>
            
//             <div className="flex items-center gap-2 text-xs text-slate-500">
//                <span className="font-mono">{filteredRows.length}</span>
//                <span>records</span>
//                {search && (
//                   <span className="text-slate-400">
//                      matching <span className="font-semibold text-slate-600">"{search}"</span>
//                   </span>
//                )}
//             </div>
//          </div>

//          {/* ── Empty after filter ──────────────────────────── */}
//          {filteredRows.length === 0 && (
//             <div className="border border-slate-200 bg-slate-50 py-12 text-center">
//                <HiSearch className="w-8 h-8 text-slate-300 mx-auto mb-2" />
//                <p className="text-sm font-medium text-slate-400">No matching records found</p>
//                <button 
//                   onClick={clearSearch}
//                   className="mt-2 text-xs font-semibold text-green-700 hover:text-green-800 uppercase tracking-wider"
//                >
//                   Clear Search
//                </button>
//             </div>
//          )}

//          {filteredRows.length > 0 && (
//             <>
//                {/* ── Desktop Table ─────────────────────────── */}
//               {/* ── Desktop Table ─────────────────────────── */}
// <div className="hidden md:block overflow-x-auto">
//    <table className="w-full text-sm border-collapse min-w-max">
//       <thead>
//          <tr className="bg-slate-100 border-b border-slate-300">
//             <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500 w-10 border-r border-slate-200 sticky left-0 bg-slate-100 z-10">
//                #
//             </th>
//             {displayColumns.map(col => (
//                <th
//                   key={col.key}
//                   onClick={() => col.sortable !== false && handleSort(col.key)}
//                   className={`
//                      px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500
//                      ${col.sortable !== false ? "cursor-pointer hover:bg-slate-200 transition-colors" : ""}
//                      ${sortConfig.key === col.key ? "bg-slate-200 text-green-700" : ""}
//                      ${col.width ? col.width : ""}
//                      whitespace-nowrap
//                   `}
//                >
//                   <div className="flex items-center gap-1">
//                      {col.label}
//                      {sortable && col.sortable !== false && sortConfig.key === col.key && (
//                         sortConfig.direction === "asc" 
//                            ? <HiSortAscending className="w-3 h-3" />
//                            : <HiSortDescending className="w-3 h-3" />
//                      )}
//                   </div>
//                </th>
//             ))}
//          </tr>
//       </thead>
//       <tbody className="divide-y divide-slate-100">
//          {pageRows.map((row, i) => (
//             <tr
//                key={row._id ?? globalIndex(i)}
//                className={`
//                   hover:bg-green-50/50 transition-colors
//                   ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
//                `}
//             >
//                <td className="px-3 py-2.5 text-xs text-slate-400 font-mono text-center border-r border-slate-100 sticky left-0 bg-inherit z-10">
//                   {globalIndex(i)}
//                </td>
//                {displayColumns.map(col => {
//                   const val = row[col.key];
//                   const display = col.date
//                      ? (formatDate(val) ?? null)
//                      : col.format
//                         ? (formatValue(val) ?? null)
//                         : (val !== undefined && val !== null && val !== "" ? String(val) : null);
                  
//                   const isNumeric = col.format || col.align === "right";
                  
//                   return (
//                      <td 
//                         key={col.key} 
//                         className={`
//                            px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap
//                            ${isNumeric ? "text-right font-mono tabular-nums" : ""}
//                            ${col.bold ? "font-semibold" : ""}
//                         `}
//                      >
//                         {display ?? <span className="text-slate-300">—</span>}
//                      </td>
//                   );
//                })}
//             </tr>
//          ))}
//       </tbody>
//    </table>
// </div>

//                {/* ── Mobile Cards ──────────────────────────── */}
//                <div className="flex flex-col gap-2 md:hidden">
//                   {pageRows.map((row, i) => (
//                      <div
//                         key={row._id ?? globalIndex(i)}
//                         className="bg-white border border-slate-200 overflow-hidden"
//                      >
//                         <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
//                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
//                               Record #{globalIndex(i)}
//                            </span>
//                            {row[srNoKey] && (
//                               <span className="text-xs font-mono text-slate-400">
//                                  SR: {row[srNoKey]}
//                               </span>
//                            )}
//                         </div>

//                         <dl className="divide-y divide-slate-100">
//                            {displayColumns.map(col => {
//                               const val = row[col.key];
//                               const display = col.date
//                                  ? (formatDate(val) ?? null)
//                                  : col.format
//                                     ? (formatValue(val) ?? null)
//                                     : (val !== undefined && val !== null && val !== "" ? String(val) : null);
//                               return (
//                                  <div key={col.key} className="flex items-start gap-3 px-3 py-2">
//                                     <dt className="w-1/3 shrink-0 text-[10px] font-bold uppercase tracking-widest text-slate-400 pt-0.5">
//                                        {col.label}
//                                     </dt>
//                                     <dd className={`
//                                        flex-1 text-sm text-slate-700 break-words min-w-0
//                                        ${col.format ? "font-mono text-right" : ""}
//                                     `}>
//                                        {display ?? <span className="text-slate-300">—</span>}
//                                     </dd>
//                                  </div>
//                               );
//                            })}
//                         </dl>
//                      </div>
//                   ))}
//                </div>

//                {/* ── Pagination ────────────────────────────── */}
//                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
//                   <div className="text-xs text-slate-500">
//                      Showing <span className="font-mono font-semibold">{start + 1}</span> to <span className="font-mono font-semibold">{Math.min(start + ROWS_PER_PAGE, filteredRows.length)}</span> of <span className="font-mono font-semibold">{filteredRows.length}</span>
//                   </div>
                  
//                   <div className="flex items-center gap-0.5">
//                      <button
//                         onClick={() => setCurrentPage(1)}
//                         disabled={currentPage === 1}
//                         className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                      >
//                         <HiChevronDoubleLeft className="w-4 h-4" />
//                      </button>
//                      <button
//                         onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                         disabled={currentPage === 1}
//                         className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                      >
//                         <HiChevronLeft className="w-4 h-4" />
//                      </button>
                     
//                      {getPageNumbers().map(page => (
//                         <button
//                            key={page}
//                            onClick={() => setCurrentPage(page)}
//                            className={`
//                               min-w-[28px] h-7 px-1.5 text-xs font-semibold font-mono
//                               transition-colors
//                               ${currentPage === page
//                                  ? "bg-green-600 text-white"
//                                  : "text-slate-600 hover:bg-slate-100"
//                               }
//                            `}
//                         >
//                            {page}
//                         </button>
//                      ))}
                     
//                      <button
//                         onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                         disabled={currentPage === totalPages}
//                         className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                      >
//                         <HiChevronRight className="w-4 h-4" />
//                      </button>
//                      <button
//                         onClick={() => setCurrentPage(totalPages)}
//                         disabled={currentPage === totalPages}
//                         className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                      >
//                         <HiChevronDoubleRight className="w-4 h-4" />
//                      </button>
//                   </div>
//                </div>
//             </>
//          )}
//       </div>
//    );
// }

// export default DataTable;







import { useState, useMemo } from "react";
import { HiSearch, HiX, HiChevronLeft, HiChevronRight, HiChevronDoubleLeft, HiChevronDoubleRight, HiSortAscending, HiSortDescending, HiDocumentText } from "react-icons/hi";
import Pagination from "../../../components/Pagination";
import SortableHeader from "../../../components/SortableHeader";

const ROWS_PER_PAGE = 10;

function formatValue(val) {
   const num = Number(val);
   if (isNaN(num) || val === "" || val === null || val === undefined) return null;
   return num % 1 === 0
      ? num.toLocaleString("en-IN")
      : num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(val) {
   if (!val) return null;
   const d = new Date(val);
   if (isNaN(d)) return String(val);
   return d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// ── Resolve display value for a cell ─────────────────────────────────────────
// Priority: col.render → col.date → col.format → plain string
function resolveDisplay(col, val, row) {
   if (col.render) return col.render(val, row);  // ← custom renderer (e.g. createdBy.name)
   if (col.date)   return formatDate(val) ?? null;
   if (col.format) return formatValue(val) ?? null;
   return (val !== undefined && val !== null && val !== "") ? String(val) : null;
}

function DataTable({ columns, rows, srNoKey = "srNo", sortable = true }) {
   const [currentPage, setCurrentPage] = useState(1);
   const [search, setSearch] = useState("");
   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

   const displayColumns = columns.filter(col => col.key !== srNoKey);

   const filteredRows = useMemo(() => {
      if (!rows) return [];
      const q = search.trim().toLowerCase();
      let filtered = !q
         ? [...rows]
         : rows.filter(row =>
              columns.some(col => {
                 const val = row[col.key];
                 // For object values (e.g. createdBy), search inside .name
                 const searchVal = val && typeof val === "object" ? val.name ?? "" : val;
                 return searchVal !== undefined && searchVal !== null &&
                    String(searchVal).toLowerCase().includes(q);
              })
           );

      // Sort
      if (sortConfig.key && sortable) {
         filtered.sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];

            if (aVal === null || aVal === undefined) return 1;
            if (bVal === null || bVal === undefined) return -1;

            const aNum = Number(aVal);
            const bNum = Number(bVal);

            if (!isNaN(aNum) && !isNaN(bNum)) {
               return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
            }

            const comparison = String(aVal).localeCompare(String(bVal));
            return sortConfig.direction === "asc" ? comparison : -comparison;
         });
      } else {
         // Default srNo sort
         filtered.sort((a, b) => {
            const aVal = Number(a[srNoKey]) || 0;
            const bVal = Number(b[srNoKey]) || 0;
            return aVal - bVal;
         });
      }

      return filtered;
   }, [rows, columns, search, srNoKey, sortConfig, sortable]);

   function handleSort(key) {
      if (!sortable) return;
      setSortConfig(current => ({
         key,
         direction: current.key === key && current.direction === "asc" ? "desc" : "asc"
      }));
   }

   function handleSearch(e) {
      setSearch(e.target.value);
      setCurrentPage(1);
   }

   function clearSearch() {
      setSearch("");
      setCurrentPage(1);
   }

   if (!rows || rows.length === 0) {
      return (
         <div className="border border-slate-200 bg-slate-50 py-12 text-center">
            <HiDocumentText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-400">No records available</p>
         </div>
      );
   }

   const totalPages = Math.ceil(filteredRows.length / ROWS_PER_PAGE);
   const start = (currentPage - 1) * ROWS_PER_PAGE;
   const pageRows = filteredRows.slice(start, start + ROWS_PER_PAGE);
   const globalIndex = (i) => start + i + 1;

   const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);
      if (endPage - startPage + 1 < maxVisible) {
         startPage = Math.max(1, endPage - maxVisible + 1);
      }
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      return pages;
   };

   return (
      <div className="flex flex-col gap-3">

         {/* ── Toolbar ─────────────────────────────────────── */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-xs">
               <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
               <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search records..."
                  className="w-full pl-9 pr-8 py-2 text-sm border border-slate-300 bg-white
                     focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600
                     placeholder:text-slate-400 text-slate-700"
               />
               {search && (
                  <button
                     onClick={clearSearch}
                     className="absolute right-2 top-1/2 -translate-y-1/2 p-1
                        text-slate-400 hover:text-slate-600 transition-colors"
                     aria-label="Clear search"
                  >
                     <HiX className="w-4 h-4" />
                  </button>
               )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
               <span className="font-mono">{filteredRows.length}</span>
               <span>records</span>
               {search && (
                  <span className="text-slate-400">
                     matching <span className="font-semibold text-slate-600">"{search}"</span>
                  </span>
               )}
            </div>
         </div>

         {/* ── Empty after filter ──────────────────────────── */}
         {filteredRows.length === 0 && (
            <div className="border border-slate-200 bg-slate-50 py-12 text-center">
               <HiSearch className="w-8 h-8 text-slate-300 mx-auto mb-2" />
               <p className="text-sm font-medium text-slate-400">No matching records found</p>
               <button
                  onClick={clearSearch}
                  className="mt-2 text-xs font-semibold text-green-700 hover:text-green-800 uppercase tracking-wider"
               >
                  Clear Search
               </button>
            </div>
         )}

         {filteredRows.length > 0 && (
            <>
               {/* ── Desktop Table ─────────────────────────── */}
               <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm border-collapse min-w-max">
                     <thead>
   <tr className="bg-slate-100 border-b border-slate-300">
      <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500 w-10 border-r border-slate-200 sticky left-0 bg-slate-100 z-10">
         #
      </th>
      {displayColumns.map(col => (
         <th
            key={col.key}
            className={`
               px-3 py-2.5 text-left whitespace-nowrap
               ${col.sortable !== false ? "cursor-pointer hover:bg-slate-200 transition-colors" : ""}
               ${sortConfig.key === col.key ? "bg-slate-200" : ""}
               ${col.width ?? ""}
            `}
         >
            <SortableHeader
               label={col.label}
               colKey={col.key}
               sortConfig={sortConfig}
               onSort={handleSort}
               sortable={sortable && col.sortable !== false}
            />
         </th>
      ))}
   </tr>
</thead>
                     <tbody className="divide-y divide-slate-100">
                        {pageRows.map((row, i) => (
                           <tr
                              key={row._id ?? globalIndex(i)}
                              className={`
                                 hover:bg-green-50/50 transition-colors
                                 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                              `}
                           >
                              <td className="px-3 py-2.5 text-xs text-slate-400 font-mono text-center border-r border-slate-100 sticky left-0 bg-inherit z-10">
                                 {globalIndex(i)}
                              </td>
                              {displayColumns.map(col => {
                                 const val = row[col.key];
                                 const display = resolveDisplay(col, val, row);
                                 const isNumeric = col.format || col.align === "right";

                                 return (
                                    <td
                                       key={col.key}
                                       className={`
                                          px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap
                                          ${isNumeric ? "text-right font-mono tabular-nums" : ""}
                                          ${col.bold ? "font-semibold" : ""}
                                       `}
                                    >
                                       {display ?? <span className="text-slate-300">—</span>}
                                    </td>
                                 );
                              })}
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {/* ── Mobile Cards ──────────────────────────── */}
               <div className="flex flex-col gap-2 md:hidden">
                  {pageRows.map((row, i) => (
                     <div
                        key={row._id ?? globalIndex(i)}
                        className="bg-white border border-slate-200 overflow-hidden"
                     >
                        <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                              Record #{globalIndex(i)}
                           </span>
                           {row[srNoKey] && (
                              <span className="text-xs font-mono text-slate-400">
                                 SR: {row[srNoKey]}
                              </span>
                           )}
                        </div>

                        <dl className="divide-y divide-slate-100">
                           {displayColumns.map(col => {
                              const val = row[col.key];
                              const display = resolveDisplay(col, val, row);
                              return (
                                 <div key={col.key} className="flex items-start gap-3 px-3 py-2">
                                    <dt className="w-1/3 shrink-0 text-[10px] font-bold uppercase tracking-widest text-slate-400 pt-0.5">
                                       {col.label}
                                    </dt>
                                    <dd className={`
                                       flex-1 text-sm text-slate-700 break-words min-w-0
                                       ${col.format ? "font-mono text-right" : ""}
                                    `}>
                                       {display ?? <span className="text-slate-300">—</span>}
                                    </dd>
                                 </div>
                              );
                           })}
                        </dl>
                     </div>
                  ))}
               </div>

               {/* ── Pagination ────────────────────────────── */}
               <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <div className="text-xs text-slate-500">
                     Showing <span className="font-mono font-semibold">{start + 1}</span> to <span className="font-mono font-semibold">{Math.min(start + ROWS_PER_PAGE, filteredRows.length)}</span> of <span className="font-mono font-semibold">{filteredRows.length}</span>
                  </div>

                  <div className="flex items-center gap-0.5">
                     <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                     >
                        <HiChevronDoubleLeft className="w-4 h-4" />
                     </button>
                     <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                     >
                        <HiChevronLeft className="w-4 h-4" />
                     </button>

                     {getPageNumbers().map(page => (
                        <button
                           key={page}
                           onClick={() => setCurrentPage(page)}
                           className={`
                              min-w-[28px] h-7 px-1.5 text-xs font-semibold font-mono
                              transition-colors
                              ${currentPage === page
                                 ? "bg-green-600 text-white"
                                 : "text-slate-600 hover:bg-slate-100"
                              }
                           `}
                        >
                           {page}
                        </button>
                     ))}

                     <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                     >
                        <HiChevronRight className="w-4 h-4" />
                     </button>
                     <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                     >
                        <HiChevronDoubleRight className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </>
         )}
      </div>
   );
}

export default DataTable;