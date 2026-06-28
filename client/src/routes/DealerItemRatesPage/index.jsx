import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectDealers } from "../../store/dealerSlice";
import DealerItemRateModal from "./components/DealerItemRateModal";
import { DealerSelect, FinancialYearSelect, EmptyPlaceholder, ConfirmDialog } from "../../components/app";
import {
   getDealerItemRates,
   createDealerItemRate,
   updateDealerItemRate,
   deleteDealerItemRate,
} from "./components/dealerItemRateService";

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
   return (
      <div className="py-14 text-center text-sm text-zinc-400">Loading…</div>
   );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DealerItemRatesPage() {
   const allDealers = useSelector(selectDealers);

   // ── Selector state ────────────────────────────────────────────────────────
   const [selectedDealerName, setSelectedDealerName] = useState("");
   const [selectedFy, setSelectedFy] = useState("");

   const selectedDealer = allDealers.find((d) => d.dealerName === selectedDealerName) ?? null;

   // ── Table state ───────────────────────────────────────────────────────────
   const [rates, setRates] = useState([]);
   const [loading, setLoading] = useState(false);
   const [tableError, setTableError] = useState("");
   const [search, setSearch] = useState("");

   // ── Modal state ───────────────────────────────────────────────────────────
   const [modalOpen, setModalOpen] = useState(false);
   const [editRecord, setEditRecord] = useState(null);

   // ── Delete state ──────────────────────────────────────────────────────────
   const [deleteTarget, setDeleteTarget] = useState(null);
   const [deleting, setDeleting] = useState(false);
   const [deleteError, setDeleteError] = useState("");

   // ── Toast ─────────────────────────────────────────────────────────────────
   const [toast, setToast] = useState(null);

   function showToast(message, type = "success") {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3500);
   }

   // ── Load overrides ────────────────────────────────────────────────────────
   const loadRates = useCallback(async () => {
      if (!selectedDealer?._id || !selectedFy) { setRates([]); return; }
      setLoading(true);
      setTableError("");
      try {
         const res = await getDealerItemRates(selectedDealer._id, selectedFy);
         setRates(res.data?.data || res.data || []);
      } catch {
         setTableError("Failed to load rate overrides. Please try again.");
      } finally {
         setLoading(false);
      }
   }, [selectedDealer?._id, selectedFy]);

   useEffect(() => { loadRates(); }, [loadRates]);

   // ── Save (create / update) ────────────────────────────────────────────────
   async function handleSave(formData) {
      if (editRecord) {
         await updateDealerItemRate(editRecord._id, formData);
         showToast("Rate override updated.");
      } else {
         await createDealerItemRate({
            dealer: selectedDealer._id,
            financialYear: selectedFy,
            ...formData,
         });
         showToast("Rate override added.");
      }
      loadRates();
   }

   // ── Delete ────────────────────────────────────────────────────────────────
   async function handleDelete() {
      if (!deleteTarget) return;
      setDeleting(true);
      setDeleteError("");
      try {
         await deleteDealerItemRate(deleteTarget._id);
         showToast("Rate override deleted.");
         setDeleteTarget(null);
         loadRates();
      } catch {
         setDeleteError("Failed to delete. Please try again.");
      } finally {
         setDeleting(false);
      }
   }

   // ── Filtered rows ─────────────────────────────────────────────────────────
   const filteredRates = rates.filter((r) =>
      r.itemName.toLowerCase().includes(search.toLowerCase())
   );

   const canAdd = !!selectedDealer && !!selectedFy;

   // ─────────────────────────────────────────────────────────────────────────
   return (
      <>
         <div className="space-y-4 p-3 sm:p-5 bg-zinc-50 min-h-screen">

            {/* ── Selector Card ─────────────────────────────────────────────── */}
            <div className="bg-white border border-zinc-200 shadow-sm p-4 sm:p-6">
               <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-5 bg-emerald-500"></div>
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                     Dealer Rate Overrides
                  </p>
               </div>
               <p className="text-xs text-zinc-400 mb-5 -mt-3">
                  Set custom item rates per dealer. Overrides take priority over global rates.
               </p>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">

                  {/* Dealer */}
                  <div className="sm:col-span-2 lg:col-span-5">
                     <label className="block text-xs font-semibold text-zinc-600 mb-1">
                        Dealer
                     </label>
                     <DealerSelect
                        value={selectedDealerName}
                        onChange={(name) => {
                           setSelectedDealerName(name || "");
                           setSearch("");
                        }}
                     />
                  </div>

                  {/* Financial Year */}
                  <div className="sm:col-span-1 lg:col-span-3">
                     <label className="block text-xs font-semibold text-zinc-600 mb-1">
                        Financial Year
                     </label>
                     <FinancialYearSelect
                        value={selectedFy}
                        onChange={(e) => { setSelectedFy(e.target.value); setSearch(""); }}
                     />
                  </div>

                  {/* Add Override button */}
                  <div className="sm:col-span-1 lg:col-span-2 flex lg:items-end">
                     <button
                        disabled={!canAdd}
                        onClick={() => { setEditRecord(null); setModalOpen(true); }}
                        className="w-full px-4 py-2 text-sm font-bold text-white bg-emerald-600 border border-emerald-700 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                     >
                        + Add Override
                     </button>
                  </div>
               </div>
            </div>

            {/* ── Table Card ────────────────────────────────────────────────── */}
            <div className="bg-white border border-zinc-200 shadow-sm p-4 sm:p-6">

               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2">
                     <div className="w-1 h-5 bg-emerald-500"></div>
                     <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                        Rate Overrides Table
                        {selectedDealer && selectedFy && !loading && filteredRates.length > 0 && (
                           <span className="ml-2 normal-case tracking-normal font-bold text-emerald-600">
                              ({filteredRates.length}{rates.length !== filteredRates.length ? ` of ${rates.length}` : ""} override{filteredRates.length !== 1 ? "s" : ""})
                           </span>
                        )}
                     </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                     {selectedDealer && selectedFy && (
                        <>
                           <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {selectedDealer.dealerName}
                           </span>
                           <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">
                              FY {selectedFy}
                           </span>
                        </>
                     )}
                     {rates.length > 0 && (
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
                     )}
                  </div>
               </div>

               {loading ? (
                  <Spinner />
               ) : tableError ? (
                  <div className="py-6 px-3 bg-red-50 border border-red-200 text-xs text-red-600 font-semibold text-center">
                     {tableError}
                  </div>
               ) : !selectedDealer || !selectedFy ? (
                  <EmptyPlaceholder
                     icon="📋"
                     title="No dealer or year selected"
                     description="Select a dealer and financial year above to view and manage rate overrides."
                  />
               ) : filteredRates.length === 0 ? (
                  <EmptyPlaceholder
                     icon="💸"
                     title="No overrides yet"
                     description="This dealer uses global rates. Add an override to set a custom rate for a specific item."
                     action={canAdd ? {
                        label: "+ Add Override",
                        onClick: () => { setEditRecord(null); setModalOpen(true); }
                     } : undefined}
                  />
               ) : (
                  <>
                     {/* Desktop Table */}
                     <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-sm">
                           <thead>
                              <tr className="bg-zinc-50 border-y border-zinc-200">
                                 <th className="text-left text-xs font-bold uppercase tracking-wider text-zinc-500 py-2.5 px-3 w-10">
                                    S.No
                                 </th>
                                 <th className="text-left text-xs font-bold uppercase tracking-wider text-zinc-500 py-2.5 px-3">
                                    Item Name
                                 </th>
                                 <th className="text-right text-xs font-bold uppercase tracking-wider text-zinc-500 py-2.5 px-3">
                                    Rate (Upto 13-09-2022)
                                 </th>
                                 <th className="text-right text-xs font-bold uppercase tracking-wider text-zinc-500 py-2.5 px-3">
                                    Rate (From 14-09-2022)
                                 </th>
                                 <th className="py-2.5 px-3 w-24" />
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-zinc-100">
                              {filteredRates.map((rate, idx) => (
                                 <tr key={rate._id} className="group hover:bg-emerald-50/50 transition-colors">
                                    <td className="py-3 px-3 text-xs text-zinc-400 font-medium">
                                       {idx + 1}
                                    </td>
                                    <td className="py-3 px-3 font-semibold text-zinc-800">
                                       {rate.itemName}
                                    </td>
                                    <td className="py-3 px-3 text-right text-zinc-700 tabular-nums font-medium">
                                       ₹{Number(rate.rateUpto).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-3 text-right text-zinc-700 tabular-nums font-medium">
                                       ₹{Number(rate.rateFrom).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-3 text-right">
                                       <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button
                                             onClick={() => { setEditRecord(rate); setModalOpen(true); }}
                                             className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold text-zinc-600 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-colors"
                                          >
                                             Edit
                                          </button>
                                          <button
                                             onClick={() => { setDeleteError(""); setDeleteTarget(rate); }}
                                             className="inline-flex items-center justify-center w-7 h-7 text-red-400 hover:bg-red-100 hover:text-red-600 border border-transparent hover:border-red-200 transition-all"
                                             title="Delete override"
                                          >
                                             <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                <path d="M10 11v6M14 11v6" />
                                                <path d="M9 6V4h6v2" />
                                             </svg>
                                          </button>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>

                     {/* Mobile Card List */}
                     <div className="sm:hidden space-y-2">
                        {filteredRates.map((rate, idx) => (
                           <div key={rate._id} className="border border-zinc-200 bg-zinc-50 p-3">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                 <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-zinc-400 bg-zinc-200 px-1.5 py-0.5">
                                       {idx + 1}
                                    </span>
                                    <span className="text-sm font-bold text-zinc-800">{rate.itemName}</span>
                                 </div>
                                 <div className="flex gap-1.5 flex-shrink-0">
                                    <button
                                       onClick={() => { setEditRecord(rate); setModalOpen(true); }}
                                       className="inline-flex items-center px-2 py-1 text-xs font-semibold text-zinc-600 border border-zinc-200 hover:bg-zinc-100 transition-colors"
                                    >
                                       Edit
                                    </button>
                                    <button
                                       onClick={() => { setDeleteError(""); setDeleteTarget(rate); }}
                                       className="inline-flex items-center justify-center w-7 h-7 text-red-400 hover:bg-red-100 hover:text-red-600 border border-transparent hover:border-red-200 transition-all"
                                       title="Delete override"
                                    >
                                       <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <polyline points="3 6 5 6 21 6" />
                                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                          <path d="M10 11v6M14 11v6" />
                                          <path d="M9 6V4h6v2" />
                                       </svg>
                                    </button>
                                 </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 border-t border-zinc-200 pt-2">
                                 <div>
                                    <p className="text-xs text-zinc-400 mb-0.5">Upto 13-09-2022</p>
                                    <p className="text-sm font-bold text-zinc-800 tabular-nums">
                                       ₹{Number(rate.rateUpto).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </p>
                                 </div>
                                 <div>
                                    <p className="text-xs text-zinc-400 mb-0.5">From 14-09-2022</p>
                                    <p className="text-sm font-bold text-zinc-800 tabular-nums">
                                       ₹{Number(rate.rateFrom).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </>
               )}
            </div>
         </div>

         {/* ── Add / Edit Modal ───────────────────────────────────────────────── */}
         <DealerItemRateModal
            isOpen={modalOpen}
            onClose={() => { setModalOpen(false); setEditRecord(null); }}
            onSave={handleSave}
            editRecord={editRecord}
         />

         {/* ── Delete Confirm Dialog ──────────────────────────────────────────── */}
         <ConfirmDialog
            isOpen={!!deleteTarget}
            title="Delete Rate Override?"
            description={
               deleteTarget
                  ? `"${deleteTarget.itemName}" override will be removed. The global rate will apply instead.`
                  : ""
            }
            onConfirm={handleDelete}
            onCancel={() => { setDeleteTarget(null); setDeleteError(""); }}
            loading={deleting}
            error={deleteError}
         />

         {/* ── Toast ─────────────────────────────────────────────────────────── */}
         {toast && (
            <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 text-sm font-semibold
               text-white shadow-lg transition-all
               ${toast.type === "error" ? "bg-red-500" : "bg-emerald-600"}`}>
               {toast.message}
            </div>
         )}
      </>
   );
}