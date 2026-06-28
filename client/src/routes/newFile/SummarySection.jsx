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