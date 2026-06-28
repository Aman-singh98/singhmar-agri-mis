
import { useState, useCallback } from "react";
import { ConfirmDialog, EmptyPlaceholder } from "../../../../components/app";
import { PRODUCT_NAMES } from "./tableConstants";

// ── Spinner ──────────────────────────────────────────────────────────────────
function Spinner({ className = "w-4 h-4" }) {
   return (
      <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none">
         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
   );
}

// ── Skeleton rows while loading ───────────────────────────────────────────────
function SkeletonRows({ cols }) {
   return Array.from({ length: 4 }).map((_, i) => (
      <tr key={i} className="border-b border-gray-50">
         {Array.from({ length: cols + 1 }).map((__, j) => (
            <td key={j} className="px-3 py-3">
               <div
                  className={`h-3 bg-gray-100 animate-pulse ${j === 0 ? "w-3/5" : "w-4/5"}`}
               />
            </td>
         ))}
      </tr>
   ));
}

// ── Edit Popup ────────────────────────────────────────────────────────────────
function EditPopup({ row, fields, onSave, onClose }) {
   const [form, setForm] = useState(() =>
      Object.fromEntries(
         fields.map(f => [f.key, f.transform ? f.transform(row[f.key]) : (row[f.key] ?? "")])
      )
   );
   const [saving, setSaving] = useState(false);
   const [error,  setError]  = useState("");

   function handleChange(key, value) {
      setForm(prev => ({ ...prev, [key]: value }));
      setError("");
   }

   async function handleSave() {
      setSaving(true);
      setError("");
      try {
         await onSave(form);
         onClose();
      } catch (err) {
         setError(err?.response?.data?.message ?? "Failed to save. Please try again.");
      } finally {
         setSaving(false);
      }
   }

   return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
         <div className="bg-white border border-gray-200 shadow-xl w-full sm:max-w-sm rounded-t-xl sm:rounded-none">
            <div className="h-1 w-full bg-green-500 rounded-t-xl sm:rounded-none" />
            {/* Drag handle on mobile */}
            <div className="flex justify-center pt-2 sm:hidden">
               <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>
            <div className="p-5 sm:p-6">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                     <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                     </svg>
                  </div>
                  <h2 className="text-base font-bold text-gray-800">Edit Record</h2>
               </div>

               <div className="flex flex-col gap-3 mb-4">
                  {fields.map(f => (
                     <div key={f.key} className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                           {f.label}
                        </label>
                        <input
                           type={f.type ?? "text"}
                           value={form[f.key]}
                           onChange={e => handleChange(f.key, e.target.value)}
                           disabled={saving || f.readOnly}
                           className="w-full px-3 py-2.5 sm:py-2 text-sm border border-gray-200 bg-white
                              focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500
                              disabled:opacity-50 disabled:cursor-not-allowed transition"
                        />
                     </div>
                  ))}
               </div>

               {error && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 mb-4">
                     {error}
                  </p>
               )}

               <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-2">
                  <button
                     onClick={onClose}
                     disabled={saving}
                     className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                     Cancel
                  </button>
                  <button
                     onClick={handleSave}
                     disabled={saving}
                     className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 transition"
                  >
                     {saving && <Spinner />}
                     {saving ? "Saving…" : "Save"}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}

// ── Items Popup ───────────────────────────────────────────────────────────────
function ItemsPopup({ row, onClose }) {
   const [search, setSearch] = useState("");

   const allItems = Object.entries(row.products ?? {})
      .filter(([, qty]) => qty > 0)
      .map(([key, qty]) => ({
         key,
         name: PRODUCT_NAMES[key] ?? key,
         qty,
      }));

   const items = search.trim()
      ? allItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
      : allItems;

   const totalQty = allItems.reduce((sum, i) => sum + i.qty, 0);

   return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
         <div className="bg-white border border-gray-200 shadow-xl w-full sm:max-w-lg flex flex-col rounded-t-xl sm:rounded-none"
              style={{ maxHeight: "85vh" }}>

            {/* Top accent */}
            <div className="h-1 w-full bg-green-500 shrink-0 rounded-t-xl sm:rounded-none" />

            {/* Drag handle on mobile */}
            <div className="flex justify-center pt-2 sm:hidden shrink-0">
               <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3 shrink-0">
               <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                     <div className="w-9 h-9 bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                     </div>
                     <div className="min-w-0">
                        <h2 className="text-sm font-bold text-gray-800">Challan Items</h2>
                        <p className="text-[11px] text-gray-400 mt-0.5 font-mono truncate">{row.challanNo}</p>
                     </div>
                  </div>
                  <button
                     onClick={onClose}
                     className="text-gray-400 hover:text-gray-600 transition mt-0.5 shrink-0 p-1 -mr-1"
                  >
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                     </svg>
                  </button>
               </div>

               {/* Meta row */}
               <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-[11px] bg-green-50 text-green-700 border border-green-100 px-2.5 py-0.5 font-semibold">
                     {allItems.length} item types
                  </span>
                  <span className="text-[11px] bg-gray-50 text-gray-600 border border-gray-100 px-2.5 py-0.5 font-semibold">
                     {totalQty.toLocaleString("en-IN")} total qty
                  </span>
                  <span className="text-[11px] text-gray-400 truncate max-w-full">{row.dealerName}</span>
               </div>

               {/* Search */}
               <div className="mt-3 relative">
                  <svg className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                     type="text"
                     placeholder="Search items…"
                     value={search}
                     onChange={e => setSearch(e.target.value)}
                     className="w-full pl-8 pr-3 py-2 sm:py-1.5 text-xs border border-gray-200 bg-gray-50
                        focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-400 transition"
                  />
               </div>
            </div>

            {/* Items list */}
            <div className="overflow-y-auto flex-1 px-4 sm:px-5 pb-5">
               {items.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs">
                     {allItems.length === 0 ? "No items in this challan." : "No items match your search."}
                  </div>
               ) : (
                  <div className="divide-y divide-gray-50">
                     {items.map(({ key, name, qty }) => (
                        <div key={key} className="flex items-center justify-between py-3 sm:py-2.5 gap-3">
                           <span className="text-xs text-gray-700 leading-snug">{name}</span>
                           <span className="text-xs font-semibold text-gray-800 tabular-nums shrink-0 bg-gray-50 border border-gray-100 px-2 py-0.5">
                              {qty.toLocaleString("en-IN")}
                           </span>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}

// ── Main DataTable ────────────────────────────────────────────────────────────
function DataTable({
   columns,
   rows,
   keyField = "_id",
   onDelete,
   onEdit,
   editFields = [],
   emptyIcon = "📭",
   emptyTitle = "No records found",
   emptyDesc,
   loading = false,
   showItemsButton = false,
}) {
   const [deleteTarget,  setDeleteTarget]  = useState(null);
   const [deleteLoading, setDeleteLoading] = useState(false);
   const [deleteError,   setDeleteError]   = useState("");
   const [editTarget,    setEditTarget]    = useState(null);
   const [itemsTarget,   setItemsTarget]   = useState(null);

   const handleDeleteConfirm = useCallback(async () => {
      setDeleteLoading(true);
      setDeleteError("");
      try {
         await onDelete(deleteTarget);
         setDeleteTarget(null);
      } catch (err) {
         setDeleteError(err?.response?.data?.message ?? "Failed to delete. Please try again.");
      } finally {
         setDeleteLoading(false);
      }
   }, [deleteTarget, onDelete]);

   const handleDeleteCancel = useCallback(() => {
      setDeleteTarget(null);
      setDeleteError("");
   }, []);

   const handleEditSave = useCallback(async (patch) => {
      await onEdit(editTarget[keyField], patch);
   }, [editTarget, keyField, onEdit]);

   return (
      <>
         <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
               <table className="w-full text-xs min-w-[480px]">
                  <thead>
                     <tr className="border-b border-gray-100 bg-gray-50">
                        {columns.map(col => (
                           <th
                              key={col.key}
                              className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 whitespace-nowrap"
                           >
                              {col.label}
                           </th>
                        ))}
                        <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-400 sticky right-0 bg-gray-50">
                           Actions
                        </th>
                     </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50">
                     {loading ? (
                        <SkeletonRows cols={columns.length} />
                     ) : rows.length === 0 ? (
                        <tr>
                           <td colSpan={columns.length + 1} className="py-2 px-4">
                              <EmptyPlaceholder
                                 icon={emptyIcon}
                                 title={emptyTitle}
                                 description={emptyDesc}
                              />
                           </td>
                        </tr>
                     ) : (
                        rows.map(row => (
                           <tr
                              key={row[keyField]}
                              className="hover:bg-gray-50 transition-colors"
                           >
                              {columns.map(col => (
                                 <td key={col.key} className="px-3 py-2.5 whitespace-nowrap">
                                    {col.render ? col.render(row[col.key], row) : (
                                       <span className="text-gray-700">{row[col.key] ?? "—"}</span>
                                    )}
                                 </td>
                              ))}

                              <td className="px-3 py-2.5 sticky right-0 bg-white">
                                 <div className="flex items-center justify-end gap-1 flex-wrap">

                                    {/* Items button — inventory only */}
                                    {showItemsButton && row.products && (
                                       <button
                                          onClick={() => setItemsTarget(row)}
                                          className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] font-semibold
                                             text-green-700 bg-green-50 border border-green-100
                                             hover:bg-green-100 transition whitespace-nowrap"
                                       >
                                          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                          </svg>
                                          <span className="hidden sm:inline">Items</span>
                                       </button>
                                    )}

                                    {/* Edit */}
                                    {onEdit && (
                                       <button
                                          onClick={() => setEditTarget(row)}
                                          className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] font-semibold
                                             text-blue-600 bg-blue-50 border border-blue-100
                                             hover:bg-blue-100 transition whitespace-nowrap"
                                       >
                                          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                             <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                          </svg>
                                          <span className="hidden sm:inline">Edit</span>
                                       </button>
                                    )}

                                    {/* Delete */}
                                    {onDelete && (
                                       <button
                                          onClick={() => setDeleteTarget(row)}
                                          className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] font-semibold
                                             text-red-600 bg-red-50 border border-red-100
                                             hover:bg-red-100 transition whitespace-nowrap"
                                       >
                                          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                             <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                          <span className="hidden sm:inline">Delete</span>
                                       </button>
                                    )}
                                 </div>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Delete confirm dialog */}
         <ConfirmDialog
            isOpen={Boolean(deleteTarget)}
            title="Delete Record"
            description={
               deleteTarget
                  ? `Are you sure you want to delete this record for "${deleteTarget.dealerName}"? This action cannot be undone.`
                  : ""
            }
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            loading={deleteLoading}
            error={deleteError}
         />

         {/* Edit popup */}
         {editTarget && (
            <EditPopup
               row={editTarget}
               fields={editFields}
               onSave={handleEditSave}
               onClose={() => setEditTarget(null)}
            />
         )}

         {/* Items popup */}
         {itemsTarget && (
            <ItemsPopup
               row={itemsTarget}
               onClose={() => setItemsTarget(null)}
            />
         )}
      </>
   );
}

export default DataTable;