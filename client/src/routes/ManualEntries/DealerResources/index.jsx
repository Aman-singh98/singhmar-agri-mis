
import { useState } from "react";
import RecordsTable from "./components/RecordsTable";
import ManualEntry from "../../UploadPage/components/ManualEntry";

const TABS = [
   { key: "entry",      label: "Manual Entry" },
   { key: "paidCash",   label: "Paid Cash" },
   { key: "incentives", label: "Incentives" },
   // { key: "inventory",  label: "Inventory" },
];

function DealerResources() {
   const [refreshKey, setRefreshKey] = useState(0);
   const [activeTab, setActiveTab]   = useState("entry");

   return (
      <div className="flex flex-col h-full overflow-hidden bg-slate-50 font-sans">

         {/* ── Page Header ───────────────────────────────────────────────── */}
         <div className="flex-none bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-7 py-3 sm:py-4">
            <div className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
               📋 Dealer Resources
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
               Manage entries, payments and inventory
            </div>
         </div>

         {/* ── Body ──────────────────────────────────────────────────────── */}
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

                  {activeTab === "entry" && (
                     <ManualEntry
   allowedTabs={["paidCash", "incentives"]}
   onInventoryUploaded={() => setRefreshKey(k => k + 1)}
   onEntryAdded={() => setRefreshKey(k => k + 1)}
/>
                  )}

                  {activeTab === "paidCash" && (
                     <RecordsTable type="paidCash" refreshKey={refreshKey} />
                  )}

                  {activeTab === "incentives" && (
                     <RecordsTable type="incentives" refreshKey={refreshKey} />
                  )}

                  {/* {activeTab === "inventory" && (
                     <RecordsTable type="inventory" refreshKey={refreshKey} />
                  )} */}

               </div>
            </div>
         </div>
      </div>
   );
}

export default DealerResources;