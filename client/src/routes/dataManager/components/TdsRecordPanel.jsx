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
   // { key: "totalTurnover",   label: "Total Turnover",     currency: true },
   // { key: "totalCommission", label: "Total Commission",   currency: true },
   { key: "totalTds",        label: "Total TDS",          currency: true },
   // { key: "totalPayable",    label: "Total Payable",      currency: true },
];

const COLUMNS = [
   { key: "srNo",             label: "Sr No" },
   { key: "dealerName",       label: "Dealer Name" },
   { key: "farmerDealerCode", label: "Dealer Code" },
   { key: "company",          label: "Company" },
   { key: "farmerName",       label: "Farmer Name" },
   { key: "fatherName",       label: "Father Name" },
   { key: "address",          label: "Address" },
   { key: "panNo",            label: "PAN No" },
   { key: "turnover",         label: "Turnover",         format: true },
   { key: "commissionAmount", label: "Commission",       format: true },
   { key: "tdsAmount",        label: "TDS Amount",              format: true },
   { key: "payableAmount",    label: "Payable",          format: true },
      { key: "tds",        label: "TDS",              format: true },

];

function TdsRecordPanel({ data, financialYear }) {
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
         totalTurnover:   filteredRecords.reduce((s, r) => s + (Number(r.turnover)         || 0), 0),
         totalCommission: filteredRecords.reduce((s, r) => s + (Number(r.commissionAmount)  || 0), 0),
         totalTds:        filteredRecords.reduce((s, r) => s + (Number(r.tds)         || 0), 0),
         totalPayable:    filteredRecords.reduce((s, r) => s + (Number(r.payableAmount)     || 0), 0),
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
   model="tds-record"
   fileName="tds-record-report"
   financialYear={financialYear}
   dealerName={selectedDealer?.dealerName || ""}
/>
         {activeTab === "summary" && (
            <SummaryCards summaryCards={SUMMARY_CARDS} summary={filteredSummary} />
         )}
         {activeTab === "records" && (
            <DataTable columns={COLUMNS} rows={filteredRecords} srNoKey="srNo" />
         )}
      </div>
   );
}

export default TdsRecordPanel;