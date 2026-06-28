// import { useState } from "react";
// import { TbReportMoney, TbUsers } from "react-icons/tb";
// import DealerMainSummary from "./DealerMainSummary";

// const SUMMARY_TABS = [
//   { key: "dealer", label: "Dealer Summary", icon: TbReportMoney },
//   { key: "farmer", label: "Farmer Summary", icon: TbUsers },
// ];

// // records: pass the full, unfiltered list of file records (FY-filtered if you want
// // the summary to respect the FY dropdown — see usage note in FileRecord.jsx)
// function SummarySection({ records = [], loading }) {
//   const [activeTab, setActiveTab] = useState("dealer");

//   return (
//     <div className="w-full">
//       {/* Section header — mirrors the FILE RECORDS bar, sits right after Demo Records */}
//       <div className="w-full bg-[#0f172a] px-5 py-0 flex items-center gap-0 border-b border-[#1e293b]">
//         <div className="flex items-center gap-2.5 py-3 border-r border-[#1e293b] pr-5 mr-5 shrink-0">
//           <TbReportMoney className="w-4 h-4 text-emerald-400" />
//           <span className="text-[13px] font-bold text-white tracking-widest uppercase">Summary</span>
//         </div>
//         <span className="text-[11px] text-slate-500 shrink-0">Dealer and farmer wise aggregated totals</span>
//         <div className="ml-auto flex items-stretch self-stretch">
//           {SUMMARY_TABS.map(tab => {
//             const Icon = tab.icon;
//             const active = activeTab === tab.key;
//             return (
//               <button
//                 key={tab.key}
//                 onClick={() => setActiveTab(tab.key)}
//                 className={`px-5 text-[11px] font-bold uppercase tracking-wider border-b-2 transition self-stretch
//                   flex items-center gap-1.5
//                   ${active
//                     ? "text-emerald-400 border-emerald-400 bg-[#1e293b]"
//                     : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-[#1e293b]/50"}`}
//               >
//                 <Icon className="w-3.5 h-3.5" />
//                 {tab.label}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       <div className="w-full p-4">
//         {activeTab === "dealer" && (
//           <DealerMainSummary records={records} loading={loading} />
//         )}
//         {activeTab === "farmer" && (
//           <div className="w-full bg-white border border-slate-200 py-20 text-center">
//             <span className="text-xs text-slate-400 uppercase tracking-widest">
//               Farmer Summary — coming soon
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SummarySection;










import DealerMainSummary from "./DealerMainSummary";
import { TbReportMoney } from "react-icons/tb";

// records: pass the full, unfiltered list of file records (FY-filtered if you want
// the summary to respect the FY dropdown — see usage note in FileRecord.jsx)
// summaryType: "dealer" | "farmer" — controlled from the SUMMARY tab dropdown in FileRecord.jsx
function SummarySection({ records = [], loading, summaryType = "dealer" }) {
  return (
    <div className="w-full">
     

      <div className="w-full p-4">
        {summaryType === "dealer" && (
          <DealerMainSummary records={records} loading={loading} />
        )}
        {summaryType === "farmer" && (
          <div className="w-full bg-white border border-slate-200 py-20 text-center">
            <span className="text-xs text-slate-400 uppercase tracking-widest">
              Farmer Summary — coming soon
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SummarySection;