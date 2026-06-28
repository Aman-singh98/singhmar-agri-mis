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
   { key: "totalRecords",  label: "Total Records",       format: true },
   { key: "totalAreaAcre", label: "Total Area (Acre)",   format: true },
   { key: "totalDealers",  label: "Total Dealers",       format: true },
];

const COLUMNS = [
   { key: "srNo",              label: "Sr No" },
   { key: "scanNo",            label: "Scan No" },
   { key: "brandName",         label: "Brand" },
   { key: "name",              label: "Name" },
   { key: "fatherName",        label: "Father Name" },
   { key: "mobileNo",          label: "Mobile No" },
   { key: "dealerName",        label: "Dealer" },
   { key: "farmerDealerCode",  label: "Dealer Code" },
   { key: "address",           label: "Address" },
   { key: "block",             label: "Block" },
   { key: "district",          label: "District" },
   { key: "irrigationType",    label: "Irrigation Type" },
   { key: "areaInAcre",        label: "Area (Acre)",  format: true },
   { key: "familyId",          label: "Family ID" },
   { key: "farmerCode",        label: "Farmer Code" },
   { key: "miNumber",          label: "MI Number" },
   { key: "applicationStatus", label: "App Status" },
   { key: "onlineStatus",      label: "Online Status" },
   { key: "error",             label: "Error" },
   { key: "createdBy",         label: "Created By",   render: (val) => val?.name ?? "—" },
];

function MainFilePanel({ data, financialYear }) {
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
         totalDealers:  1,
         totalAreaAcre: filteredRecords.reduce((s, r) => s + (Number(r.areaInAcre) || 0), 0),
      };
   }, [filteredRecords, selectedDealer, data]);

   return (
      <div>
         <DealerFilter records={allRecords} onFilter={setSelectedDealer} />
         <PanelTabs
            tabs={TABS}
            activeTab={activeTab}
            onChange={setActiveTab}
            model="main-file"
            fileName="main-file-report"
            financialYear={financialYear}
            dealerName={selectedDealer?.dealerName || ""}
         />
         {activeTab === "summary" && <SummaryCards summaryCards={SUMMARY_CARDS} summary={filteredSummary} />}
         {activeTab === "records" && <DataTable columns={COLUMNS} rows={filteredRecords} />}
      </div>
   );
}

export default MainFilePanel;