import { HiCollection } from "react-icons/hi";
import { FinancialYearManager } from "../components/app";

function FinancialYearPage() {
   return (
      <div className="flex flex-col h-full overflow-hidden bg-slate-50">

         {/* ── Page Header ───────────────────────────────────────────────────── */}
         <div className="flex-none bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
               <div className="p-1.5 sm:p-2 bg-green-700 border border-green-600 shrink-0 shadow-sm">
                  <HiCollection className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
               </div>
               <h1 className="text-lg sm:text-xl font-bold text-slate-800">Financial Years</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 ml-9 sm:ml-11">
               Add or remove financial years used across the system.
            </p>
         </div>

         {/* ── Content ───────────────────────────────────────────────────────── */}
         <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
               <FinancialYearManager />
         </div>
      </div>
   );
}

export default FinancialYearPage;