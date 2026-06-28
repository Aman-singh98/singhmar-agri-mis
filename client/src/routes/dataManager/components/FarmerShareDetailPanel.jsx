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
   { key: "totalRecords",            label: "Total Records",          format: true },
   { key: "totalDealers",            label: "Total Dealers",          format: true },
   { key: "totalAreaAcre",           label: "Total Area (Acre)",      format: true },
   { key: "totalEstimateAmount",     label: "Total Estimate Amt",     currency: true },
   { key: "totalFarmerShare",        label: "Total Farmer Share",     currency: true },
   { key: "totalFarmerShareDeposit", label: "Total Deposited",        currency: true },
   { key: "totalReturnFarmerShare",  label: "Total Returned",         currency: true },
   { key: "totalDifference",         label: "Total Difference",       currency: true },
];

const COLUMNS = [
   { key: "srNo",                    label: "Sr No" },
   { key: "farmerDealerCode",        label: "Dealer Code" },
   { key: "dealerName",              label: "Dealer" },
   { key: "name",                    label: "Name" },
   { key: "miNumber",                label: "MI Number" },
   { key: "brandName",               label: "Brand" },
   { key: "mobileNo",                label: "Mobile No" },
   { key: "areaInAcre",              label: "Area (Acre)",        format: true },
   { key: "village",                 label: "Village" },
   { key: "type",                    label: "Type" },
   { key: "scanNo",                  label: "Scan No" },
   { key: "estimateAmount",          label: "Estimate Amt",       format: true },
   { key: "onlineFarmerShareStatus", label: "Online Status" },
   { key: "challanSubmitted",        label: "Challan Submitted" },
   { key: "cadaAccountNo",           label: "CADA Account No" },
   { key: "farmerShare",             label: "Farmer Share",       format: true },
   { key: "farmerSharePercentage",   label: "Share %",            format: true },
   { key: "perAcreCosting",          label: "Per Acre Cost",      format: true },
   { key: "difference",              label: "Difference",         format: true },
   { key: "farmerShareDeposit",      label: "Deposited",          format: true },
   { key: "depositDate",             label: "Deposit Date",       date: true },
   { key: "returnFarmerShare",       label: "Return Amount",      format: true },
   { key: "returnDate",              label: "Return Date",        date: true },
];

function FarmerShareDetailPanel({ data ,financialYear}) {
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
         totalRecords:            filteredRecords.length,
         totalDealers:            1,
         totalAreaAcre:           filteredRecords.reduce((s, r) => s + (Number(r.areaInAcre)            || 0), 0),
         totalEstimateAmount:     filteredRecords.reduce((s, r) => s + (Number(r.estimateAmount)        || 0), 0),
         totalFarmerShare:        filteredRecords.reduce((s, r) => s + (Number(r.farmerShare)           || 0), 0),
         totalFarmerShareDeposit: filteredRecords.reduce((s, r) => s + (Number(r.farmerShareDeposit)    || 0), 0),
         totalReturnFarmerShare:  filteredRecords.reduce((s, r) => s + (Number(r.returnFarmerShare)     || 0), 0),
         totalDifference:         filteredRecords.reduce((s, r) => s + (Number(r.difference)            || 0), 0),
      };
   }, [filteredRecords, selectedDealer, data]);

   return (
      <div>
         <DealerFilter records={allRecords} onFilter={setSelectedDealer} />
         <PanelTabs
            tabs={TABS}
            activeTab={activeTab}
            onChange={setActiveTab}
            model="farmer-share"
            fileName="farmer-share-report"
               financialYear={financialYear}

            dealerName={selectedDealer?.dealerName || ""}
         />
         {activeTab === "summary" && <SummaryCards summaryCards={SUMMARY_CARDS} summary={filteredSummary} />}
         {activeTab === "records" && <DataTable columns={COLUMNS} rows={filteredRecords} />}
      </div>
   );
}

export default FarmerShareDetailPanel;