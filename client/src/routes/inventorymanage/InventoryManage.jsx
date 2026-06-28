
// InventoryManage.jsx
import { useState } from "react";
import ManualEntry from "../UploadPage/components/ManualEntry";
import RecordsTable from "../ManualEntries/DealerResources/components/RecordsTable";
import Pdf from "../../components/Pdf";
import Excel from "../../components/Excel";
import { DealerSelect, FinancialYearSelect } from "../../components/app";
import api from "../../api/axios";

const TABS = [
   { key: "upload",    label: "Upload Inventory" },
   { key: "inventory", label: "Inventory Records" },
];

function InventoryManage() {
   const [activeTab, setActiveTab]       = useState("upload");
   const [refreshKey, setRefreshKey]     = useState(0);
   const [filterDealer, setFilterDealer] = useState("");
   const [filterYear,   setFilterYear]   = useState("");

   // Delete all state
   const [deleteLoading, setDeleteLoading] = useState(false);
   const [showConfirm,   setShowConfirm]   = useState(false);
   const [deleteError,   setDeleteError]   = useState("");

   async function handleDeleteAll() {
      setDeleteLoading(true);
      setDeleteError("");
      try {
         await api.delete("/inventory", {
            params: { dealerName: filterDealer, financialYear: filterYear },
         });
         setShowConfirm(false);
         setRefreshKey(k => k + 1);
      } catch (err) {
         setDeleteError(err?.response?.data?.message ?? "Delete failed. Please try again.");
      } finally {
         setDeleteLoading(false);
      }
   }

   const canDelete = activeTab === "inventory" && filterDealer && filterYear;

   return (
      <div className="flex flex-col h-full overflow-hidden bg-slate-50 font-sans">

         {/* ── Page Header ─────────────────────────────────────────────── */}
         <div className="flex-none bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-7 py-3 sm:py-4">

            {/* Title + Buttons row */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
               <div>
                  <div className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                     📦 Inventory Manage
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                     Upload and manage inventory (Tally) records
                  </div>
               </div>

               {activeTab === "inventory" && filterDealer && filterYear && (
                  <div className="flex items-center gap-2 flex-wrap">
                     <Pdf
                        model="inventory"
                        fileName="inventory-report"
                        label="PDF"
                        financialYear={filterYear}
                        dealerName={filterDealer}
                     />
                     <Excel
                        model="inventory"
                        fileName="inventory-report"
                        label="Excel"
                        financialYear={filterYear}
                        dealerName={filterDealer}
                     />
                     {/* Delete All button */}
                     <button
                        type="button"
                        onClick={() => { setShowConfirm(true); setDeleteError(""); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                           text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition"
                     >
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete All
                     </button>
                  </div>
               )}
            </div>

            {/* Filters row */}
            {activeTab === "inventory" && (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
                  <div className="flex flex-col gap-1">
                     <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                        Filter by Dealer
                     </label>
                     <DealerSelect
                        value={filterDealer}
                        onChange={(dealerName) => setFilterDealer(dealerName ?? "")}
                        placeholder="All dealers"
                     />
                  </div>
                  <div className="flex flex-col gap-1">
                     <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                        Filter by Financial Year
                     </label>
                     <FinancialYearSelect
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                     />
                  </div>
               </div>
            )}
         </div>

         {/* ── Body ────────────────────────────────────────────────────── */}
         <div className="flex-1 flex flex-col overflow-hidden px-3 sm:px-5 lg:px-6 pt-4 sm:pt-5 min-h-0">
            <div className="flex flex-col flex-1 overflow-hidden min-h-0">

               {/* ── Tabs ── */}
               <div className="flex-none overflow-x-auto scrollbar-none">
                  <div className="flex gap-0 border-b-2 border-slate-200 min-w-max">
                     {TABS.map((tab) => (
                        <button
                           key={tab.key}
                           type="button"
                           onClick={() => setActiveTab(tab.key)}
                           className={`px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-0.5 transition-colors cursor-pointer whitespace-nowrap
                              ${activeTab === tab.key
                                 ? "text-green-700 border-green-600"
                                 : "text-slate-400 border-transparent hover:text-slate-600"
                              }`}
                        >
                           {tab.label}
                        </button>
                     ))}
                  </div>
               </div>

               {/* ── Tab Content ── */}
               <div className="flex-1 overflow-y-auto min-h-0 pt-4 sm:pt-5 pb-4">

                  {activeTab === "upload" && (
                     <ManualEntry
                        allowedTabs={["inventory"]}
                        onInventoryUploaded={() => setRefreshKey(k => k + 1)}
                        onEntryAdded={() => setRefreshKey(k => k + 1)}
                     />
                  )}

                  {activeTab === "inventory" && (
                     <RecordsTable
                        type="inventory"
                        refreshKey={refreshKey}
                        filterDealer={filterDealer}
                        filterYear={filterYear}
                        hideFilters
                     />
                  )}

               </div>
            </div>
         </div>

         {/* ── Delete All Confirm Dialog ───────────────────────────────── */}
         {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
               <div className="bg-white border border-gray-200 shadow-xl w-full sm:max-w-sm rounded-t-xl sm:rounded-none">
                  <div className="h-1 w-full bg-red-500 rounded-t-xl sm:rounded-none" />
                  <div className="flex justify-center pt-2 sm:hidden">
                     <div className="w-10 h-1 bg-gray-200 rounded-full" />
                  </div>
                  <div className="p-5 sm:p-6">
                     <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                           <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                           </svg>
                        </div>
                        <h2 className="text-base font-bold text-gray-800">Delete All Inventory</h2>
                     </div>

                     <p className="text-sm text-gray-600 mb-1">
                        Are you sure you want to delete <span className="font-semibold">all inventory records</span> for:
                     </p>
                     <div className="bg-red-50 border border-red-100 px-3 py-2 mb-4 text-sm">
                        <div className="font-semibold text-red-800">{filterDealer}</div>
                        <div className="text-red-600 text-xs mt-0.5">{filterYear}</div>
                     </div>
                     <p className="text-xs text-gray-400 mb-4">This action cannot be undone.</p>

                     {deleteError && (
                        <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 mb-4">
                           {deleteError}
                        </p>
                     )}

                     <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                        <button
                           onClick={() => { setShowConfirm(false); setDeleteError(""); }}
                           disabled={deleteLoading}
                           className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={handleDeleteAll}
                           disabled={deleteLoading}
                           className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 transition"
                        >
                           {deleteLoading && (
                              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                              </svg>
                           )}
                           {deleteLoading ? "Deleting…" : "Yes, Delete All"}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

      </div>
   );
}

export default InventoryManage;