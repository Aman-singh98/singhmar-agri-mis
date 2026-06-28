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
   { key: "totalRecords",    label: "Total Records",      format: true },
   { key: "totalAreaAcre",   label: "Total Area (Acre)",  format: true },
   { key: "totalAssistance", label: "Total Assistance",   currency: true },
   { key: "totalBillValue",  label: "Total Bill Value",   currency: true },
];

const COLUMNS = [
   { key: "sn",                 label: "S.No" },
   { key: "lotNo",              label: "Lot No" },
   { key: "applicationId",      label: "App ID / MI No" },
   { key: "farmerDealerCode",   label: "Dealer Code" },
   { key: "dealerName",         label: "Dealer" },
   { key: "name",               label: "Name" },
   { key: "fatherName",         label: "Father Name" },
   { key: "vendorName",         label: "Vendor" },
   { key: "type",               label: "Type" },
   { key: "village",            label: "Village" },
   { key: "block",              label: "Block" },
   { key: "district",           label: "District" },
   { key: "areaInAcre",         label: "Acre",            format: true },
   { key: "billValue",          label: "Bill Value",      format: true },
   { key: "assistanceToBePaid", label: "Assistance",      format: true },
];

function SubsidyPanel({ data ,financialYear}) {
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
         totalRecords:    filteredRecords.length,
         totalAreaAcre:   filteredRecords.reduce((s, r) => s + (Number(r.areaInAcre)         || 0), 0),
         totalAssistance: filteredRecords.reduce((s, r) => s + (Number(r.assistanceToBePaid) || 0), 0),
         totalBillValue:  filteredRecords.reduce((s, r) => s + (Number(r.billValue)          || 0), 0),
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
            model="subsidy"
            fileName="subsidy-report"
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

export default SubsidyPanel;