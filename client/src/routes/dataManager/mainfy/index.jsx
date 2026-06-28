import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { HiDatabase, HiRefresh, HiExclamation } from "react-icons/hi";
import { MainFYSheetPanel } from "../components";

function MainFY() {
   const [result,  setResult]  = useState(null);
   const [loading, setLoading] = useState(true);
   const [error,   setError]   = useState(null);

   async function fetchData() {
      setLoading(true); setError(null); setResult(null);
      try {
         const res = await api.get("/main-fy-sheet");
         if (res.data?.success) setResult(res.data);
         else setError(res.data?.message || "Failed to fetch data");
      } catch (err) {
         setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => { fetchData(); }, []);

   return (
      <div className="flex flex-col h-full overflow-hidden bg-slate-50">

         {/* ── Page Header ─────────────────────────────── */}
         <div className="flex-none bg-white border-b border-slate-300 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
               <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-green-600 text-white">
                     <HiDatabase className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-[10px] uppercase tracking-widest text-green-700 font-bold mb-0.5">
                        Data Management
                     </p>
                     <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                        Main FY Sheet
                     </h1>
                  </div>
               </div>

               <button
                  onClick={fetchData}
                  disabled={loading}
                  className="h-9 px-4 bg-white text-slate-600 text-xs font-bold uppercase tracking-wider
                     border border-slate-300 hover:bg-slate-50 hover:text-slate-800
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
               >
                  <HiRefresh className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  {loading ? "Loading..." : "Refresh"}
               </button>
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

            {loading && (
               <div className="flex items-center justify-center py-20 text-slate-400 text-sm gap-2">
                  <HiRefresh className="w-5 h-5 animate-spin" />
                  Loading data...
               </div>
            )}

            {!loading && !error && result && (
               <div className="bg-white border border-slate-300 p-4 sm:p-6">
                  <MainFYSheetPanel
                     data={result.mainFYSheet}
                     financialYear="All"
                  />
               </div>
            )}

            {!loading && !error && !result && (
               <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
                  No records found.
               </div>
            )}

         </div>
      </div>
   );
}

export default MainFY;