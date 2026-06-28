/**
 * FinancialYearManager.jsx
 * Add via modal popup, full color system, responsive.
 */
import { useState } from "react";
import { HiTrash, HiPlus, HiSearch, HiCalendar, HiX } from "react-icons/hi";
import { useFinancialYears } from "../../hooks/useFinancialYears";
import ConfirmDialog from "./ConfirmDialog";
import Pagination from "../Pagination";

const LIMIT = 8;
const FY_REGEX = /^\d{4}-\d{2}$/;
function isValidFY(val) {
  if (!FY_REGEX.test(val)) return false;
  const [startStr, endStr] = val.split("-");
  const expected = (parseInt(startStr, 10) + 1) % 100;
  return parseInt(endStr, 10) === expected;
}
function FinancialYearManager() {
   const { years, loading, error: fetchError, addYear, deleteYear } = useFinancialYears();

   const [input, setInput] = useState("");
   const [inputError, setInputError] = useState("");
   const [adding, setAdding] = useState(false);
   const [modalOpen, setModalOpen] = useState(false);

   const [search, setSearch] = useState("");
   const [page, setPage] = useState(1);

   const [confirmOpen, setConfirmOpen] = useState(false);
   const [pendingDelete, setPendingDelete] = useState(null);
   const [deleteError, setDeleteError] = useState("");
   const [deleting, setDeleting] = useState(false);

   // ── Modal ─────────────────────────────────────────────────────────────
   function openModal() { setInput(""); setInputError(""); setModalOpen(true); }
   function closeModal() { setModalOpen(false); setInput(""); setInputError(""); }

   // ── Add ──────────────────────────────────────────────────────────────
   async function handleAdd() {
  setInputError("");
  const val = input.trim();
  if (!isValidFY(val)) {
    const year = val.split("-")[0];
    const suffix = year ? String((parseInt(year, 10) + 1) % 100).padStart(2, "0") : "YY";
    setInputError(`Format must be YYYY-YY (e.g. ${year || "YYYY"}-${suffix})`);
    return;
  }
      setAdding(true);
      const { error } = await addYear(val);
      setAdding(false);
      if (error) { setInputError(error); return; }
      closeModal();
   }

   function handleKeyDown(e) { if (e.key === "Enter") handleAdd(); }

   // ── Delete ────────────────────────────────────────────────────────────
   function requestDelete(year) { setPendingDelete(year); setDeleteError(""); setConfirmOpen(true); }

   async function confirmDelete() {
      if (!pendingDelete) return;
      setDeleting(true); setDeleteError("");
      const { error } = await deleteYear(pendingDelete);
      setDeleting(false);
      if (error) { setDeleteError(error); return; }
      setConfirmOpen(false); setPendingDelete(null);
   }

   function cancelDelete() { setConfirmOpen(false); setPendingDelete(null); setDeleteError(""); }

   const filtered = years.filter(y => y.includes(search.trim()));
   const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT));
   const safePage = Math.min(page, totalPages);
   const pageItems = filtered.slice((safePage - 1) * LIMIT, safePage * LIMIT);

   function handleSearchChange(e) { setSearch(e.target.value); setPage(1); }

   return (
      <>
         <div className="flex flex-col gap-5">

            {/* ── Saved Years card ─────────────────────────────────── */}
            <div className="bg-white border border-slate-200 shadow-sm flex flex-col">

               {/* Card header */}
               <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                     <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Financial Years
                     </label>
                     {years.length > 0 && (
                        <span className="text-xs font-semibold text-green-800 bg-green-100 border border-green-300 px-2 py-0.5">
                           {years.length} total
                        </span>
                     )}
                  </div>
                  {/* Add Button */}
                  <button
                     onClick={openModal}
                     className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-700 text-white text-xs sm:text-sm font-semibold hover:bg-green-600 active:bg-green-800 transition shadow-sm"
                  >
                     <HiPlus className="w-4 h-4" />
                     <span className="hidden xs:inline">Add Year</span>
                     <span className="xs:hidden">Add</span>
                  </button>
               </div>

               <div className="p-4 sm:p-5 flex flex-col gap-3">

                  {/* Search */}
                  <div className="relative">
                     <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search years…"
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 text-sm bg-white text-slate-800
                           placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 transition"
                     />
                  </div>

                  {fetchError && (
                     <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">
                        {fetchError}
                     </p>
                  )}

                  {/* Table: sm+ */}
                  <div className="border border-slate-200 overflow-hidden">
                     <table className="hidden sm:table min-w-full text-sm">
                        <thead>
                           <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="px-4 md:px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wide w-12">S.No</th>
                              <th className="px-4 md:px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wide">Year</th>
                              <th className="px-4 md:px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                              <th className="px-4 md:px-5 py-3 text-center font-semibold text-slate-500 text-xs uppercase tracking-wide">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {loading ? (
                              Array.from({ length: 4 }).map((_, i) => (
                                 <tr key={i} className="bg-white">
                                    {Array.from({ length: 4 }).map((__, j) => (
                                       <td key={j} className="px-4 md:px-5 py-3">
                                          <div className="h-3 bg-slate-100 animate-pulse rounded" style={{ width: j === 1 ? "50%" : "30%" }} />
                                       </td>
                                    ))}
                                 </tr>
                              ))
                           ) : filtered.length === 0 ? (
                              <tr>
                                 <td colSpan={4} className="px-5 py-12 text-center">
                                    <p className="text-sm text-slate-400">No years found</p>
                                    {search && <p className="text-xs text-slate-300 mt-1">Try a different search term</p>}
                                 </td>
                              </tr>
                           ) : (
                              pageItems.map((y, i) => {
                                 const isLatest = (safePage - 1) * LIMIT + i === 0;
                                 return (
                                    <tr key={y} className="bg-white hover:bg-green-50 transition-colors">
                                       <td className="px-4 md:px-5 py-3 text-slate-400 text-xs font-mono">
                                          {(safePage - 1) * LIMIT + i + 1}
                                       </td>
                                       <td className="px-4 md:px-5 py-3">
                                          <span className="font-semibold text-slate-800 font-mono text-sm">{y}</span>
                                       </td>
                                       <td className="px-4 md:px-5 py-3">
                                          {isLatest && (
                                             <span className="inline-flex items-center text-xs px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-300 font-semibold">
                                                Latest
                                             </span>
                                          )}
                                       </td>
                                       <td className="px-4 md:px-5 py-3">
                                          <div className="flex items-center justify-center">
                                             <button
                                                disabled={years?.length === 1}
                                                onClick={() => requestDelete(y)}
                                                className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 hover:bg-red-100 hover:border-red-300 transition text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                                                title={`Delete ${y}`}
                                             >
                                                <HiTrash className="w-3.5 h-3.5" /> Delete
                                             </button>
                                          </div>
                                       </td>
                                    </tr>
                                 );
                              })
                           )}
                        </tbody>
                     </table>

                     {/* Mobile cards */}
                     <div className="sm:hidden divide-y divide-slate-100">
                        {loading ? (
                           Array.from({ length: 4 }).map((_, i) => (
                              <div key={i} className="px-4 py-3 flex items-center justify-between gap-3">
                                 <div className="h-3 bg-slate-100 animate-pulse rounded w-16" />
                                 <div className="h-3 bg-slate-100 animate-pulse rounded w-10" />
                              </div>
                           ))
                        ) : filtered.length === 0 ? (
                           <div className="px-4 py-12 text-center">
                              <p className="text-sm text-slate-400">No years found</p>
                              {search && <p className="text-xs text-slate-300 mt-1">Try a different search term</p>}
                           </div>
                        ) : (
                           pageItems.map((y, i) => {
                              const isLatest = (safePage - 1) * LIMIT + i === 0;
                              return (
                                 <div key={y} className="flex items-center justify-between gap-2 px-4 py-3 bg-white hover:bg-green-50 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                       <span className="text-slate-400 text-xs font-mono shrink-0 w-6 text-right">
                                          {(safePage - 1) * LIMIT + i + 1}
                                       </span>
                                       <span className="font-semibold text-slate-800 font-mono text-sm">{y}</span>
                                       {isLatest && (
                                          <span className="inline-flex items-center text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 border border-amber-300 font-semibold shrink-0">
                                             Latest
                                          </span>
                                       )}
                                    </div>
                                    <button
                                       disabled={years?.length === 1}
                                       onClick={() => requestDelete(y)}
                                       className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2.5 py-1.5 hover:bg-red-100 hover:border-red-300 transition text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                                    >
                                       <HiTrash className="w-3.5 h-3.5" />
                                       <span className="hidden xs:inline">Delete</span>
                                    </button>
                                 </div>
                              );
                           })
                        )}
                     </div>

                     {/* Footer */}
                     {!loading && pageItems.length > 0 && (
                        <div className="px-4 sm:px-5 py-3 border-t border-slate-100 bg-slate-50 flex flex-col xs:flex-row items-center justify-between gap-2">
                           <span className="text-xs text-slate-400">
                              Showing {(safePage - 1) * LIMIT + 1}–{Math.min(safePage * LIMIT, filtered.length)} of {filtered.length}
                           </span>
                           <Pagination
                              currentPage={safePage}
                              totalPages={totalPages}
                              onPageChange={setPage}
                           />
                        </div>
                     )}
                  </div>

               </div>
            </div>
         </div>

         {/* ── Add Year Modal ────────────────────────────────────────────────── */}
         {modalOpen && (
            <div
               className="fixed inset-0 z-50 flex items-center justify-center p-4"
               role="dialog"
               aria-modal="true"
               aria-labelledby="modal-title"
            >
               {/* Backdrop */}
               <div
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                  onClick={closeModal}
               />

               {/* Panel */}
               <div className="relative z-10 w-full max-w-sm bg-white border border-slate-200 shadow-xl flex flex-col">

                  {/* Modal header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
                     <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-green-700 shrink-0">
                           <HiCalendar className="w-4 h-4 text-white" />
                        </div>
                        <h2 id="modal-title" className="text-sm font-bold text-slate-800">
                           Add Financial Year
                        </h2>
                     </div>
                     <button
                        onClick={closeModal}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                        aria-label="Close"
                     >
                        <HiX className="w-4 h-4" />
                     </button>
                  </div>

                  {/* Modal body */}
                  <div className="px-5 py-5 flex flex-col gap-4">
                     <p className="text-xs text-slate-500 leading-relaxed">
                        Enter the financial year in <span className="font-semibold font-mono text-slate-700">YYYY-YY</span> format.
                        For example, <span className="font-mono text-green-700 font-semibold">2026-27</span> for the year 2026–2027.
                     </p>

                     <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-widest block mb-1.5">
                           Financial Year
                        </label>
                        <div className="relative">
                           <HiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                           <input
                              type="text"
                              value={input}
                              onChange={e => { setInput(e.target.value); setInputError(""); }}
                              onKeyDown={handleKeyDown}
                              placeholder="e.g. 2026-27"
                              maxLength={7}
                              autoFocus
                              className={`w-full pl-9 pr-3 py-2.5 border text-sm bg-white font-mono
                                 focus:outline-none focus:ring-2 transition placeholder:text-slate-300
                                 ${inputError
                                    ? "border-red-300 focus:ring-red-300 bg-red-50 text-red-700"
                                    : "border-slate-300 text-slate-800 focus:ring-green-400 focus:border-green-500"}`}
                           />
                        </div>
                        {inputError && (
                           <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                              <span>⚠</span> {inputError}
                           </p>
                        )}
                     </div>
                  </div>

                  {/* Modal footer */}
                  <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
                     <button
                        onClick={closeModal}
                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleAdd}
                        disabled={adding}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-700 text-white text-sm font-semibold hover:bg-green-600 active:bg-green-800 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                     >
                        {adding ? (
                           <>
                              <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                              </svg>
                              Adding…
                           </>
                        ) : (
                           <><HiPlus className="w-4 h-4" /> Add Year</>
                        )}
                     </button>
                  </div>
               </div>
            </div>
         )}

         <ConfirmDialog
            isOpen={confirmOpen}
            title={`Delete Financial Year ${pendingDelete}?`}
            description={`This will permanently delete the financial year "${pendingDelete}" and ALL uploaded files associated with it. This action cannot be undone.`}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            loading={deleting}
            error={deleteError}
         />
      </>
   );
}

export default FinancialYearManager;