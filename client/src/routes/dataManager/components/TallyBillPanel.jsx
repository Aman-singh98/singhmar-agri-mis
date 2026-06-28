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
   { key: "totalRecords",        label: "Total Records",        format: true },
   { key: "totalBillValue",      label: "Total Bill Value",     currency: true },
   // { key: "totalEstimateAmount", label: "Total Estimate Amt",   currency: true },
   // { key: "totalDifference",     label: "Total Difference",     currency: true },
   { key: "totalGst",            label: "Total GST",            currency: true },
   // { key: "totalNetAmount",      label: "Total Net Amount",     currency: true },
];

const COLUMNS = [
{ key: "date", label: "Date", date: true },
   { key: "dealerName",       label: "Dealer" },
   { key: "farmerDealerCode", label: "Dealer Code" },
   { key: "farmerName",       label: "Farmer Name" },
   { key: "type",             label: "Type" },
   { key: "billNo",           label: "Bill No" },
   { key: "billValue",        label: "Bill Value",     format: true },
   { key: "miNumber",         label: "MI Number" },
   { key: "scanNo",           label: "Scan No" },
   { key: "estimateAmount",   label: "Estimate Amt",  format: true },
   { key: "acre",             label: "Acre",           format: true },
   { key: "gst",              label: "GST",            format: true },
   { key: "difference",       label: "Difference",     format: true },
   { key: "netAmount",        label: "Net Amount",     format: true },
   { key: "farmerCode",       label: "Farmer Code" },
];

function TallyBillPanel({ data,financialYear }) {
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
         totalRecords:        filteredRecords.length,
         totalBillValue:      filteredRecords.reduce((s, r) => s + (Number(r.billValue)        || 0), 0),
         totalEstimateAmount: filteredRecords.reduce((s, r) => s + (Number(r.estimateAmount)   || 0), 0),
         totalDifference:     filteredRecords.reduce((s, r) => s + (Number(r.difference)       || 0), 0),
         totalGst:            filteredRecords.reduce((s, r) => s + (Number(r.gst)              || 0), 0),
         totalNetAmount:      filteredRecords.reduce((s, r) => s + (Number(r.netAmount)        || 0), 0),
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
            model="tally-bill"
            fileName="tally-bill-report"
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

export default TallyBillPanel;