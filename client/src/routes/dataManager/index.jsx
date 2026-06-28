
// DataManager.jsx (Redesigned)
import { useState } from "react";
import api from "../../api/axios";
import { HiTrash, HiChevronDown, HiChevronUp, HiDatabase, HiSearch, HiRefresh, HiExclamation, HiInbox } from "react-icons/hi";
import { EmptyPlaceholder, ConfirmDialog, FinancialYearSelect } from "../../components/app";
import {
   MainFilePanel, TallyBillPanel, TdsRecordPanel,
   SubsidyPanel, MaterialDispatchPanel, MicadaPanel,
   MainFYSheetPanel, FarmerShareDetailPanel,
} from "./components";

const SIDEBAR_ITEMS = [
   { key: "mainFile",          label: "Main File",           collections: "mainFile" },
   { key: "tallyBill",         label: "Tally Bills",         collections: "tallyBill" },
   { key: "tdsRecord",         label: "TDS Record",          collections: "tdsRecord" },
   { key: "subsidy",           label: "Subsidy",             collections: "subsidy" },
   { key: "materialDispatch",  label: "Material Dispatch",   collections: "materialDispatch" },
   { key: "micada",            label: "MICADA",              collections: "micada" },
   { key: "mainFYSheet",       label: "Main FY Sheet",       collections: "mainFYSheet" },
   { key: "farmerShareDetail", label: "Farmer Share Detail", collections: "farmerShareDetail" },
];

function ActivePanel({ activeKey, result, financialYear }) {
   if (!result) return null;
   switch (activeKey) {
      case "mainFile":          return <MainFilePanel          data={result.mainFile}          financialYear={financialYear} />;
      case "tallyBill":         return <TallyBillPanel         data={result.tallyBill}         financialYear={financialYear} />;
      case "tdsRecord":         return <TdsRecordPanel         data={result.tdsRecord}         financialYear={financialYear} />;
      case "subsidy":           return <SubsidyPanel           data={result.subsidy}           financialYear={financialYear} />;
      case "materialDispatch":  return <MaterialDispatchPanel  data={result.materialDispatch}  financialYear={financialYear} />;
      case "micada":            return <MicadaPanel            data={result.micada}            financialYear={financialYear} />;
      case "mainFYSheet":       return <MainFYSheetPanel       data={result.mainFYSheet}       financialYear={financialYear} />;
      case "farmerShareDetail": return <FarmerShareDetailPanel data={result.farmerShareDetail} financialYear={financialYear} />;
      default:                  return null;
   }
}

function DataManager() {
   const [selectedYear,  setSelectedYear]  = useState("26-27");
   const [result,        setResult]        = useState(null);
   const [loading,       setLoading]       = useState(false);
   const [error,         setError]         = useState(null);
   const [fetched,       setFetched]       = useState(false);
   const [activeSidebar, setActiveSidebar] = useState("mainFile");
   const [deleteLoading, setDeleteLoading] = useState(false);
   const [showConfirm,   setShowConfirm]   = useState(false);
   const [deleteTarget,  setDeleteTarget]  = useState(null);
   const [sidebarOpen,   setSidebarOpen]   = useState(false);

   async function handleSearch() {
      if (!selectedYear) return;
      setLoading(true); setError(null); setFetched(true); setResult(null);
      setActiveSidebar("mainFile"); setSidebarOpen(false);
      try {
         const res = await api.get("/data/summary", { params: { financialYear: selectedYear } });
         if (res.data?.success) setResult(res.data);
         else setError(res.data?.message || "Failed to fetch data");
      } catch (err) {
         setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
         setLoading(false);
      }
   }

   function handleReset() {
      setResult(null); setFetched(false); setError(null);
      setActiveSidebar("mainFile"); setSidebarOpen(false);
   }

   function handleYearChange(e) {
      setSelectedYear(e.target.value); handleReset();
   }

   function handleDeleteClick(item)  { setDeleteTarget(item); setShowConfirm(true); }
   function handleDeleteCancel()     { setShowConfirm(false); setDeleteTarget(null); }
   function handleSidebarSelect(key) { setActiveSidebar(key); setSidebarOpen(false); }

   async function handleDeleteConfirm() {
      setShowConfirm(false); setDeleteLoading(true);
      try {
         await api.delete("/data", { params: { financialYear: selectedYear, collections: deleteTarget.collections } });
         handleReset();
      } catch (err) {
         setError(err.response?.data?.message || "Failed to delete data");
      } finally {
         setDeleteLoading(false); setDeleteTarget(null);
      }
   }

   const activeLabel = SIDEBAR_ITEMS.find(i => i.key === activeSidebar)?.label ?? "";

   return (
      <>
         <div className="flex flex-col h-full overflow-hidden bg-slate-50">

            {/* ── Page Header ─────────────────────────────── */}
            <div className="flex-none bg-white border-b border-slate-300 px-4 sm:px-6 py-4">
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                     <div className="p-2 bg-green-600 text-white">
                        <HiDatabase className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[10px] uppercase tracking-widest text-green-700 font-bold mb-0.5">
                           Data Management
                        </p>
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                           Data Manager
                        </h1>
                     </div>
                  </div>
                  
                  <div className="flex flex-wrap items-end gap-3">
                     <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Financial Year</label>
                        <FinancialYearSelect value={selectedYear} onChange={handleYearChange} disabled={loading} />
                     </div>
                     <div className="flex items-end gap-2">
                        <button
                           onClick={handleSearch}
                           disabled={!selectedYear || loading}
                           className="h-9 px-5 bg-green-700 text-white text-xs font-bold uppercase tracking-wider
                              hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                           <HiSearch className="w-4 h-4" />
                           {loading ? "Loading..." : "Search"}
                        </button>
                        {fetched && (
                           <button
                              onClick={handleReset}
                              className="h-9 px-4 bg-white text-slate-600 text-xs font-bold uppercase tracking-wider
                                 border border-slate-300 hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center gap-1.5"
                           >
                              <HiRefresh className="w-3.5 h-3.5" />
                              Reset
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            {/* ── Body ──────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 min-h-0">

               {error && (
                  <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-300 text-red-700 text-sm mb-4">
                     <HiExclamation className="shrink-0 w-5 h-5 text-red-500 mt-0.5" />
                     <span className="font-medium">{error}</span>
                  </div>
               )}

               {!fetched && !loading && (
                  <EmptyPlaceholder
                     icon={<HiInbox className="w-10 h-10 text-slate-300" />}
                     title="Select a financial year"
                     description="Choose a financial year and click Search to load data."
                  />
               )}
               
               {fetched && !loading && !error && !result && (
                  <EmptyPlaceholder
                     icon={<HiSearch className="w-10 h-10 text-slate-300" />}
                     title="No records found"
                     description="No data available for the selected financial year."
                     action={{ label: "Reset", onClick: handleReset }}
                  />
               )}

               {result && (
                  <div className="flex flex-col md:flex-row gap-4 items-start">

                     {/* ── Mobile Sidebar ─────────────────────── */}
                     <div className="w-full md:hidden border border-slate-300 bg-white">
                        <button
                           onClick={() => setSidebarOpen(v => !v)}
                           className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold
                              text-green-700 bg-green-50 border-b border-slate-200"
                        >
                           <span className="uppercase tracking-wider text-xs">{activeLabel}</span>
                           {sidebarOpen
                              ? <HiChevronUp className="w-4 h-4 shrink-0" />
                              : <HiChevronDown className="w-4 h-4 shrink-0" />
                           }
                        </button>
                        {sidebarOpen && (
                           <div className="divide-y divide-slate-100">
                              {SIDEBAR_ITEMS.map(item => (
                                 <div
                                    key={item.key}
                                    className={`flex items-center justify-between transition-colors
                                       ${activeSidebar === item.key ? "bg-green-50" : "hover:bg-slate-50"}`}
                                 >
                                    <button
                                       onClick={() => handleSidebarSelect(item.key)}
                                       className={`flex-1 text-left px-4 py-2.5 text-sm font-semibold transition-colors
                                          ${activeSidebar === item.key ? "text-green-700" : "text-slate-600"}`}
                                    >
                                       {item.label}
                                    </button>
                                    <button
                                       onClick={() => handleDeleteClick(item)}
                                       disabled={deleteLoading}
                                       className="p-2 mr-2 text-slate-300 hover:text-red-600 disabled:opacity-30
                                          disabled:cursor-not-allowed transition-colors"
                                    >
                                       <HiTrash className="w-4 h-4" />
                                    </button>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>

                     {/* ── Desktop Sidebar ────────────────────── */}
                     <div className="hidden md:block w-48 lg:w-52 shrink-0 border border-slate-300 bg-white self-start">
                        <div className="px-3 py-2 bg-slate-100 border-b border-slate-200">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Collections</p>
                        </div>
                        {SIDEBAR_ITEMS.map(item => {
                           const isActive = activeSidebar === item.key;
                           return (
                              <div
                                 key={item.key}
                                 className={`
                                    flex items-center justify-between border-b border-slate-100 last:border-b-0 transition-colors
                                    ${isActive
                                       ? "bg-green-50 border-l-2 border-l-green-600"
                                       : "hover:bg-slate-50 border-l-2 border-l-transparent"
                                    }
                                 `}
                              >
                                 <button
                                    onClick={() => setActiveSidebar(item.key)}
                                    className={`
                                       flex-1 text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors
                                       ${isActive ? "text-green-700" : "text-slate-600"}
                                    `}
                                 >
                                    {item.label}
                                 </button>
                                 <button
                                    onClick={() => handleDeleteClick(item)}
                                    disabled={deleteLoading}
                                    className="p-1.5 mr-1.5 text-slate-300 hover:text-red-600 disabled:opacity-30
                                       disabled:cursor-not-allowed transition-colors"
                                 >
                                    <HiTrash className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                           );
                        })}
                     </div>

                     {/* ── Panel ──────────────────────────────── */}
                     <div className="flex-1 border border-slate-300 bg-white p-4 sm:p-6 min-w-0 w-full overflow-hidden">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                           <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                              {activeLabel}
                           </h2>
                           <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-1">
                              FY {selectedYear}
                           </span>
                        </div>
                        <ActivePanel
                           activeKey={activeSidebar}
                           result={result}
                           financialYear={selectedYear}
                        />
                     </div>

                  </div>
               )}
            </div>
         </div>

         <ConfirmDialog
            isOpen={showConfirm}
            title={`Delete ${deleteTarget?.label} Data`}
            description={`This will permanently delete all ${deleteTarget?.label} data for FY ${selectedYear}. This action cannot be undone.`}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
         />
      </>
   );
}

export default DataManager;