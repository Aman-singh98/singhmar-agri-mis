import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import Pagination from "../components/Pagination";
import { ConfirmDialog, EmptyPlaceholder } from "../components/app";

const LIMIT = 8;
const initialForm = { itemName: "", rateUpto: "", rateFrom: "" };

function ItemRateManager() {
   const [allItems, setAllItems] = useState([]);
   const [search, setSearch] = useState("");
   const [page, setPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [deletingId, setDeletingId] = useState(null);
   const [form, setForm] = useState(initialForm);
   const [errors, setErrors] = useState({});
   const [apiError, setApiError] = useState("");
   const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, itemId: null, itemName: "" });
   const [deleteError, setDeleteError] = useState("");

   const fetchItems = useCallback(async () => {
      setLoading(true);
      setApiError("");
      try {
         const res = await api.get("/item-rates");
         setAllItems(res.data.data);
      } catch (err) {
         setApiError(err.response?.data?.message || "Failed to load items");
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => { fetchItems(); }, []);

   const filtered = allItems.filter((item) =>
      item.itemName.toLowerCase().includes(search.toLowerCase())
   );
   const total = filtered.length;
   const totalPages = Math.max(1, Math.ceil(total / LIMIT));
   const safePage = Math.min(page, totalPages);
   const pageItems = filtered.slice((safePage - 1) * LIMIT, safePage * LIMIT);

   useEffect(() => { setPage(1); }, [search]);

   const validate = () => {
      const e = {};
      if (!form.itemName.trim()) e.itemName = "Item name is required";
      if (form.rateUpto === "") e.rateUpto = "Rate (upto) is required";
      else if (Number(form.rateUpto) < 0) e.rateUpto = "Cannot be negative";
      if (form.rateFrom === "") e.rateFrom = "Rate (from) is required";
      else if (Number(form.rateFrom) < 0) e.rateFrom = "Cannot be negative";
      setErrors(e);
      return Object.keys(e).length === 0;
   };

   const handleAdd = async () => {
      if (!validate()) return;
      setSubmitting(true);
      setApiError("");
      try {
         await api.post("/item-rates", {
            itemName: form.itemName.trim(),
            rateUpto: Number(form.rateUpto),
            rateFrom: Number(form.rateFrom),
         });
         setForm(initialForm);
         setErrors({});
         setPage(1);
         fetchItems();
      } catch (err) {
         setApiError(err.response?.data?.message || "Failed to add item");
      } finally {
         setSubmitting(false);
      }
   };

   const openConfirmDelete = (item) => {
      setDeleteError("");
      setConfirmDialog({ isOpen: true, itemId: item._id, itemName: item.itemName });
   };

   const handleDelete = async () => {
      const id = confirmDialog.itemId;
      setDeletingId(id);
      setDeleteError("");
      try {
         await api.delete(`/item-rates/${id}`);
         setConfirmDialog({ isOpen: false, itemId: null, itemName: "" });
         fetchItems();
      } catch (err) {
         setDeleteError(err.response?.data?.message || "Failed to delete item");
      } finally {
         setDeletingId(null);
      }
   };

   return (
      <>
         <div className="space-y-4 p-3 sm:p-5 bg-zinc-50 min-h-screen">

            {/* Add Form Card */}
            <div className="bg-white border border-zinc-200 shadow-sm p-4 sm:p-6">
               <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-5 bg-emerald-500"></div>
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                     Add New Item Rate
                  </p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-start">

                  {/* Item Name */}
                  <div className="sm:col-span-2 lg:col-span-5">
                     <label className="block text-xs font-semibold text-zinc-600 mb-1">
                        Item Name
                     </label>
                     <input
                        type="text"
                        value={form.itemName}
                        onChange={(e) => {
                           setForm((f) => ({ ...f, itemName: e.target.value }));
                           if (errors.itemName) setErrors((er) => ({ ...er, itemName: "" }));
                        }}
                        placeholder="e.g. 32 MM Ball Valve"
                        className={`w-full text-sm px-3 py-2 border ${errors.itemName ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"} focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-zinc-900 placeholder-zinc-400`}
                     />
                     {errors.itemName && (
                        <p className="text-xs text-red-500 mt-1">{errors.itemName}</p>
                     )}
                  </div>

                  {/* Rate Upto */}
                  <div className="sm:col-span-1 lg:col-span-3">
                     <label className="block text-xs font-semibold text-zinc-600 mb-1">
                        Rate (Upto 13-09-2022)
                     </label>
                     <input
                        type="number"
                        min="0"
                        value={form.rateUpto}
                        onChange={(e) => {
                           setForm((f) => ({ ...f, rateUpto: e.target.value }));
                           if (errors.rateUpto) setErrors((er) => ({ ...er, rateUpto: "" }));
                        }}
                        placeholder="0.00"
                        className={`w-full text-sm px-3 py-2 border ${errors.rateUpto ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"} focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-zinc-900 placeholder-zinc-400`}
                     />
                     {errors.rateUpto && (
                        <p className="text-xs text-red-500 mt-1">{errors.rateUpto}</p>
                     )}
                  </div>

                  {/* Rate From */}
                  <div className="sm:col-span-1 lg:col-span-3">
                     <label className="block text-xs font-semibold text-zinc-600 mb-1">
                        Rate (From 14-09-2022)
                     </label>
                     <input
                        type="number"
                        min="0"
                        value={form.rateFrom}
                        onChange={(e) => {
                           setForm((f) => ({ ...f, rateFrom: e.target.value }));
                           if (errors.rateFrom) setErrors((er) => ({ ...er, rateFrom: "" }));
                        }}
                        placeholder="0.00"
                        className={`w-full text-sm px-3 py-2 border ${errors.rateFrom ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"} focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-zinc-900 placeholder-zinc-400`}
                     />
                     {errors.rateFrom && (
                        <p className="text-xs text-red-500 mt-1">{errors.rateFrom}</p>
                     )}
                  </div>

                  {/* Add Button */}
                 {/* Add Button */}
<div className="sm:col-span-2 lg:col-span-1 flex lg:items-end lg:pt-5">
   <button
      onClick={handleAdd}
      disabled={submitting}
      className="w-full lg:w-auto px-4 py-2 text-sm font-bold text-white bg-emerald-600 border border-emerald-700 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
   >
      {submitting ? "Adding…" : "+ Add"}
   </button>
</div>
               </div>

               {apiError && (
                  <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 text-xs text-red-600 font-semibold">
                     {apiError}
                  </div>
               )}
            </div>

            {/* Table Card */}
            <div className="bg-white border border-zinc-200 shadow-sm p-4 sm:p-6">

               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2">
                     <div className="w-1 h-5 bg-emerald-500"></div>
                     <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                        Item Rates Table
                        {total > 0 && (
                           <span className="ml-2 normal-case tracking-normal font-bold text-emerald-600">
                              ({total} items)
                           </span>
                        )}
                     </p>
                  </div>
                  <div className="relative w-full sm:w-56">
                     <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs pointer-events-none">🔍</span>
                     <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search items…"
                        className="w-full text-sm pl-7 pr-3 py-1.5 border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-zinc-900 placeholder-zinc-400"
                     />
                  </div>
               </div>

               {loading ? (
                  <div className="py-14 text-center text-sm text-zinc-400">Loading…</div>
               ) : filtered.length === 0 ? (
                  <EmptyPlaceholder
                     icon="📋"
                     title="No items found"
                     description={
                        search
                           ? `No results for "${search}". Try a different keyword.`
                           : "Add your first item rate using the form above."
                     }
                  />
               ) : (
                  <>
                     {/* Desktop Table */}
                     <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-sm">
                           <thead>
                              <tr className="bg-zinc-50 border-y border-zinc-200">
                                 <th className="text-left text-xs font-bold uppercase tracking-wider text-zinc-500 py-2.5 px-3 w-10">S.No</th>
                                 <th className="text-left text-xs font-bold uppercase tracking-wider text-zinc-500 py-2.5 px-3">Item Name</th>
                                 <th className="text-right text-xs font-bold uppercase tracking-wider text-zinc-500 py-2.5 px-3">Rate (Upto 13-09-2022)</th>
                                 <th className="text-right text-xs font-bold uppercase tracking-wider text-zinc-500 py-2.5 px-3">Rate (From 14-09-2022)</th>
                                 <th className="py-2.5 px-3 w-10" />
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-zinc-100">
                              {pageItems.map((item, idx) => (
                                 <tr key={item._id} className="group hover:bg-emerald-50/50 transition-colors">
                                    <td className="py-3 px-3 text-xs text-zinc-400 font-medium">
                                       {(safePage - 1) * LIMIT + idx + 1}
                                    </td>
                                    <td className="py-3 px-3 font-semibold text-zinc-800">
                                       {item.itemName}
                                    </td>
                                    <td className="py-3 px-3 text-right text-zinc-700 tabular-nums font-medium">
                                       ₹{Number(item.rateUpto).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-3 text-right text-zinc-700 tabular-nums font-medium">
                                       ₹{Number(item.rateFrom).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-3 text-right">
                                       <button
                                          onClick={() => openConfirmDelete(item)}
                                          disabled={deletingId === item._id}
                                          title="Delete item"
                                          className="opacity-0 group-hover:opacity-100 inline-flex items-center justify-center w-7 h-7 text-red-400 hover:bg-red-100 hover:text-red-600 border border-transparent hover:border-red-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                       >
                                          {deletingId === item._id ? (
                                             <span className="text-xs text-zinc-400">…</span>
                                          ) : (
                                             <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                <path d="M10 11v6M14 11v6" />
                                                <path d="M9 6V4h6v2" />
                                             </svg>
                                          )}
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>

                     {/* Mobile Card List */}
                     <div className="sm:hidden space-y-2">
                        {pageItems.map((item, idx) => (
                           <div key={item._id} className="border border-zinc-200 bg-zinc-50 p-3">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                 <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-zinc-400 bg-zinc-200 px-1.5 py-0.5">
                                       {(safePage - 1) * LIMIT + idx + 1}
                                    </span>
                                    <span className="text-sm font-bold text-zinc-800">{item.itemName}</span>
                                 </div>
                                 <button
                                    onClick={() => openConfirmDelete(item)}
                                    disabled={deletingId === item._id}
                                    title="Delete item"
                                    className="inline-flex items-center justify-center w-7 h-7 text-red-400 hover:bg-red-100 hover:text-red-600 border border-transparent hover:border-red-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
                                 >
                                    {deletingId === item._id ? (
                                       <span className="text-xs text-zinc-400">…</span>
                                    ) : (
                                       <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <polyline points="3 6 5 6 21 6" />
                                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                          <path d="M10 11v6M14 11v6" />
                                          <path d="M9 6V4h6v2" />
                                       </svg>
                                    )}
                                 </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2 border-t border-zinc-200 pt-2">
                                 <div>
                                    <p className="text-xs text-zinc-400 mb-0.5">Upto 13-09-2022</p>
                                    <p className="text-sm font-bold text-zinc-800 tabular-nums">
                                       ₹{Number(item.rateUpto).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </p>
                                 </div>
                                 <div>
                                    <p className="text-xs text-zinc-400 mb-0.5">From 14-09-2022</p>
                                    <p className="text-sm font-bold text-zinc-800 tabular-nums">
                                       ₹{Number(item.rateFrom).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>

                     <Pagination
                        currentPage={safePage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                     />
                  </>
               )}
            </div>
         </div>

         <ConfirmDialog
            isOpen={confirmDialog.isOpen}
            title="Delete Item Rate"
            description={`Are you sure you want to delete "${confirmDialog.itemName}"? This action cannot be undone.`}
            onConfirm={handleDelete}
            onCancel={() => setConfirmDialog({ isOpen: false, itemId: null, itemName: "" })}
            loading={deletingId !== null}
            error={deleteError}
         />
      </>
   );
}

export default ItemRateManager;