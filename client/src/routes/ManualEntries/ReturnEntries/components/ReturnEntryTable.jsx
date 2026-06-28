
import { useState } from "react";
import { DealerSelect, EmptyPlaceholder, ConfirmDialog } from "../../../../components/app";
import Pagination from "../../../../components/Pagination";
import StatusPill from "../../ShiftingEntries/components/StatusPill";
import ViewReturnModal from "./ViewReturnModal";
import { CATEGORY_CONFIG, PAGE_SIZE, entryGrandTotal } from "../constants";

// ─────────────────────────────────────────────────────────────────────────────
// ReturnEntryTable — searchable return entries list with view / edit / delete
//
// Rules:
//   - No inline CSS (style={{...}})
//   - No rounded-* Tailwind classes
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_KEYS = CATEGORY_CONFIG.map((cat) => ({
   key: cat.key,
   label: cat.label.split(" ")[0],
   color: cat.accent.summary,
}));

function catSum(entry, key) {
   const obj = entry?.[key] || {};
   return Object.values(obj).reduce((s, v) => s + (Number(v) || 0), 0);
}

function ActionBtn({ title, onClick, hoverClasses, children }) {
   return (
      <button
         onClick={onClick}
         title={title}
         className={`w-7 h-7 flex items-center justify-center border border-gray-200 text-gray-400 transition-all ${hoverClasses}`}
      >
         {children}
      </button>
   );
}

const ICONS = {
   eye: [
      "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
   ],
   pencil: [
      "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
   ],
   trash: [
      "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
   ],
};

function Icon({ paths }) {
   return (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
         {paths.map((d, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" d={d} />
         ))}
      </svg>
   );
}

function ReturnEntryTable({
   entries,
   loadingList,
   editingId,
   confirmOpen,
   deleteTarget,
   deleting,
   deleteError,
   onEdit,
   onDeleteClick,
   onDeleteConfirm,
   onDeleteCancel,
}) {
   const [currentPage, setCurrentPage] = useState(1);
   const [tableSearch, setTableSearch] = useState("");
   const [viewEntry, setViewEntry] = useState(null);

   const filteredEntries = tableSearch
      ? entries.filter((e) =>
           (e.dealer?.dealerName || "").toLowerCase().includes(tableSearch.toLowerCase())
        )
      : entries;

   const totalPages = Math.ceil(filteredEntries.length / PAGE_SIZE);
   const pagedEntries = filteredEntries.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

   function handleSearchChange(name) {
      setTableSearch(name || "");
      setCurrentPage(1);
   }

   return (
      <div className="border border-gray-200 bg-white shadow-sm overflow-hidden">

         {/* ── Table header ── */}
         <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 flex-wrap">
            <div className="flex items-center gap-2.5">
               <p className="text-sm font-semibold text-gray-800">Saved return entries</p>
               {entries.length > 0 && (
                  <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5">
                     {tableSearch
                        ? `${filteredEntries.length} of ${entries.length}`
                        : `${entries.length} total`}
                  </span>
               )}
            </div>
            {entries.length > 0 && (
               <div className="w-56">
                  <DealerSelect
                     value={tableSearch}
                     onChange={handleSearchChange}
                     placeholder="Filter by dealer…"
                  />
               </div>
            )}
         </div>

         {/* ── Body states ── */}
         {loadingList ? (
            <div className="p-5 space-y-3">
               {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 animate-pulse" />
               ))}
            </div>
         ) : entries.length === 0 ? (
            <div className="p-5">
               <EmptyPlaceholder
                  icon="↩️"
                  title="No return entries yet"
                  description="Record your first dealer return using the form."
               />
            </div>
         ) : filteredEntries.length === 0 ? (
            <div className="p-5">
               <EmptyPlaceholder
                  icon="🔍"
                  title="No entries found"
                  description={`No return entries match "${tableSearch}".`}
               />
            </div>
         ) : (
            <>
               <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[1200px]">
                     <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                           <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left px-5 py-3">
                              Dealer
                           </th>
                           <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left px-4 py-3">
                              Code
                           </th>
                           <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left px-4 py-3">
                              FY
                           </th>
                           <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left px-4 py-3">
                              Return Date
                           </th>
                           {CATEGORY_KEYS.map(({ key, label, color }) => (
                              <th
                                 key={key}
                                 className={`text-[11px] font-semibold uppercase tracking-wider text-right px-4 py-3 ${color}`}
                              >
                                 {label}
                              </th>
                           ))}
                           <th className="text-[11px] font-semibold text-green-600 uppercase tracking-wider text-right px-4 py-3">
                              Total
                           </th>
                           <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left px-4 py-3">
                              Remarks
                           </th>
                           <th className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center px-5 py-3">
                              Actions
                           </th>
                        </tr>
                     </thead>

                     <tbody className="divide-y divide-gray-50">
                        {pagedEntries.map((entry) => {
                           const grandTotal = entryGrandTotal(entry);
                           const isCurrentEdit = editingId === entry._id;
                           const dealerName = entry.dealer?.dealerName || "—";
                           const dealerCode = entry.dealer?.farmerDealerCode || "—";

                           return (
                              <tr
                                 key={entry._id}
                                 className={`group transition-colors ${
                                    isCurrentEdit ? "bg-amber-50/50" : "hover:bg-green-50/30"
                                 }`}
                              >
                                 {/* Dealer */}
                                 <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2.5">
                                       <div className="w-7 h-7 bg-green-100 flex items-center justify-center shrink-0">
                                          <span className="text-[10px] font-bold text-green-700 select-none">
                                             {dealerName.slice(0, 2).toUpperCase()}
                                          </span>
                                       </div>
                                       <div>
                                          <p className="text-[13px] font-semibold text-gray-800 leading-tight">
                                             {dealerName}
                                          </p>
                                          {isCurrentEdit && <StatusPill type="warning">editing</StatusPill>}
                                       </div>
                                    </div>
                                 </td>

                                 {/* Code */}
                                 <td className="px-4 py-3.5">
                                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5">
                                       {dealerCode}
                                    </span>
                                 </td>

                                 {/* FY */}
                                 <td className="px-4 py-3.5">
                                    <span className="text-xs text-gray-500">{entry.financialYear}</span>
                                 </td>

                                 {/* Return Date */}
                                 <td className="px-4 py-3.5">
                                    {entry.returnDate ? (
                                       <span className="text-xs text-gray-600 font-mono">
                                          {new Date(entry.returnDate).toLocaleDateString("en-IN", {
                                             day: "2-digit",
                                             month: "short",
                                             year: "numeric",
                                          })}
                                       </span>
                                    ) : (
                                       <span className="text-xs text-gray-300">—</span>
                                    )}
                                 </td>

                                 {/* Per-category totals */}
                                 {CATEGORY_KEYS.map(({ key, color }) => (
                                    <td key={key} className="px-4 py-3.5 text-right">
                                       <span className={`font-mono text-sm font-semibold tabular-nums ${color}`}>
                                          {catSum(entry, key)}
                                       </span>
                                    </td>
                                 ))}

                                 {/* Grand Total */}
                                 <td className="px-4 py-3.5 text-right">
                                    <span className="font-mono text-sm font-bold text-green-700 tabular-nums">
                                       {grandTotal}
                                    </span>
                                 </td>

                                 {/* Remarks */}
                                 <td className="px-4 py-3.5 max-w-[160px]">
                                    {entry.remarks ? (
                                       <span
                                          className="text-xs text-gray-500 italic truncate block"
                                          title={entry.remarks}
                                       >
                                          {entry.remarks}
                                       </span>
                                    ) : (
                                       <span className="text-xs text-gray-300">—</span>
                                    )}
                                 </td>

                                 {/* Actions */}
                                 <td className="px-5 py-3.5">
                                    <div className="flex items-center justify-center gap-1.5">
                                       <ActionBtn
                                          title="View details"
                                          onClick={() => setViewEntry(entry)}
                                          hoverClasses="hover:text-green-600 hover:border-green-300 hover:bg-green-50"
                                       >
                                          <Icon paths={ICONS.eye} />
                                       </ActionBtn>
                                       <ActionBtn
                                          title="Edit entry"
                                          onClick={() => onEdit(entry)}
                                          hoverClasses="hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50"
                                       >
                                          <Icon paths={ICONS.pencil} />
                                       </ActionBtn>
                                       <ActionBtn
                                          title="Delete entry"
                                          onClick={() => onDeleteClick(entry)}
                                          hoverClasses="hover:text-red-600 hover:border-red-300 hover:bg-red-50"
                                       >
                                          <Icon paths={ICONS.trash} />
                                       </ActionBtn>
                                    </div>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>

               {totalPages > 1 && (
                  <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                     <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                     />
                  </div>
               )}
            </>
         )}

         {viewEntry && <ViewReturnModal entry={viewEntry} onClose={() => setViewEntry(null)} />}

         <ConfirmDialog
            isOpen={confirmOpen}
            title="Delete return entry"
            description={
               deleteTarget
                  ? `This will permanently delete the return entry for "${
                       deleteTarget.dealer?.dealerName || "this dealer"
                    }". This action cannot be undone.`
                  : ""
            }
            onConfirm={onDeleteConfirm}
            onCancel={onDeleteCancel}
            loading={deleting}
            error={deleteError}
         />
      </div>
   );
}

export default ReturnEntryTable;