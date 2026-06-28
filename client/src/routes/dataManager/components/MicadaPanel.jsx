import { useState, useMemo } from "react";
import SummaryCards from "./SummaryCards";
import DataTable from "./DataTable";
import PanelTabs from "./PanelTabs";
import DealerFilter from "./DealerFilter";

const TABS = [
   { key: "summary", label: "Summary" },
   { key: "records", label: "Records" },
];

const SUMMARY_CARDS = [
   { key: "totalRecords",  label: "Total Records" ,format: true},
   { key: "totalAreaAcre", label: "Total Area (Acre)", format: true },
];

const COLUMNS = [
   { key: "appId",             label: "App ID" },
   { key: "programmeName",     label: "Programme" },
   { key: "farmerName",        label: "Farmer Name" },
   { key: "village",           label: "Village" },
   { key: "block",             label: "Block" },
   { key: "district",          label: "District" },
   { key: "mobile",            label: "Mobile" },
   { key: "address",           label: "Address" },
   { key: "dateOfApplication", label: "Date of Application", date: true },
   { key: "totalArea",         label: "Total Area",          format: true },
   { key: "currentStatus",     label: "Current Status" },
   { key: "remarks",           label: "Remarks" },
   { key: "status",            label: "Status" },
];

function MicadaPanel({ data,financialYear }) {
   const [activeTab,      setActiveTab]      = useState("summary");
   const [selectedDealer, setSelectedDealer] = useState(null);

   const allRecords = data?.records ?? [];

   const filteredRecords = useMemo(() => {
      if (!selectedDealer) return allRecords;
      return allRecords.filter(r =>
         r.farmerDealerCode === selectedDealer.farmerDealerCode
      );
   }, [allRecords, selectedDealer]);

   const filteredSummary = useMemo(() => {
      if (!selectedDealer) return data?.summary;
      return {
         totalRecords:  filteredRecords.length,
         totalAreaAcre: filteredRecords.reduce((s, r) => s + (Number(r.totalArea) || 0), 0),
      };
   }, [filteredRecords, selectedDealer, data]);

   return (
      <div>
         <DealerFilter
            records={allRecords}
            onFilter={setSelectedDealer}
         />
         <PanelTabs
            tabs={TABS}
            activeTab={activeTab}
            onChange={setActiveTab}
            model="micada"
            fileName="micada-report"
               financialYear={financialYear}

            dealerName={selectedDealer?.dealerName || ""}
         />
         {activeTab === "summary" && (
            <SummaryCards summaryCards={SUMMARY_CARDS} summary={filteredSummary} />
         )}
         {activeTab === "records" && (
            <DataTable columns={COLUMNS} rows={filteredRecords} />
         )}
      </div>
   );
}

export default MicadaPanel;