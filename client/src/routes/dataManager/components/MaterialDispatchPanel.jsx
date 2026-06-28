// // // // import { useState, useMemo } from "react";
// // // // import SummaryCards from "./SummaryCards";
// // // // import DataTable from "./DataTable";
// // // // import PanelTabs from "./PanelTabs";
// // // // import DealerFilter from "./DealerFilter";

// // // // const TABS = [
// // // //    { key: "summary",    label: "Summary" },
// // // //    { key: "dispatched", label: "Dispatched" },
// // // //    { key: "receipts",   label: "Receipts" },
// // // //    { key: "adjusted",   label: "Adjusted" },
// // // // ];
// // // // const SUMMARY_CARDS = [
// // // //    { key: "totalDispatched",      label: "Total Dispatched",      format: true },
// // // //    { key: "totalReceipts",        label: "Total Receipts",        format: true },
// // // //    { key: "totalAdjusted",        label: "Total Adjusted",        format: true },
// // // //    { key: "totalMiniAcres",       label: "Mini Acres",            format: true },
// // // //    { key: "totalDripAcres",       label: "Drip Acres",            format: true },
// // // //    { key: "totalHdpeAcres",       label: "HDPE Acres",            format: true },
// // // //    { key: "totalMiniFarmerShare", label: "Mini Farmer Share",     currency: true },
// // // //    { key: "totalDripFarmerShare", label: "Drip Farmer Share",     currency: true },
// // // //    { key: "totalHdpeFarmerShare", label: "HDPE Farmer Share",     currency: true },
// // // //    { key: "totalAmountReceived",  label: "Amount Received",       currency: true },
// // // // ];

// // // // const DISPATCHED_COLUMNS = [
// // // //    { key: "srNo",             label: "Sr No" },
// // // //    { key: "date",             label: "Date",                date: true },
// // // //    { key: "dealerName",       label: "Dealer Name" },
// // // //    { key: "farmerDealerCode", label: "Dealer Code" },
// // // //    { key: "farmerName",       label: "Farmer Name" },
// // // //    { key: "address",          label: "Address" },
// // // //    { key: "brandName",        label: "Brand" },
// // // //    { key: "challanNo",        label: "Challan No" },
// // // //    { key: "vehicleNo",        label: "Vehicle No" },
// // // //    { key: "destination",      label: "Destination" },
// // // //    { key: "miniAcres",        label: "Mini Acres",          format: true },
// // // //    { key: "miniFarmerShare",  label: "Mini Farmer Share",   format: true },
// // // //    { key: "dripAcres",        label: "Drip Acres",          format: true },
// // // //    { key: "dripFarmerShare",  label: "Drip Farmer Share",   format: true },
// // // //    { key: "hdpeAcres",        label: "HDPE Acres",          format: true },
// // // //    { key: "hdpeFarmerShare",  label: "HDPE Farmer Share",   format: true },
// // // //    { key: "reference",        label: "Reference" },
// // // // ];

// // // // const RECEIPTS_COLUMNS = [
// // // //    { key: "srNo",             label: "Sr No" },
// // // //    { key: "date",             label: "Date",                date: true },
// // // //    { key: "dealerName",       label: "Dealer Name" },
// // // //    { key: "farmerDealerCode", label: "Dealer Code" },
// // // //    { key: "amount",           label: "Amount",              format: true },
// // // //    { key: "remarks",          label: "Remarks" },
// // // // ];

// // // // const ADJUSTED_COLUMNS = [
// // // //    { key: "sn",               label: "S.No" },
// // // //    { key: "dealerName",       label: "Dealer Name" },
// // // //    { key: "farmerDealerCode", label: "Dealer Code" },
// // // //    { key: "amount",           label: "Amount",              format: true },
// // // // ];

// // // // function MaterialDispatchPanel({ data,financialYear }) {
// // // //    const [activeTab,      setActiveTab]      = useState("summary");
// // // //    const [selectedDealer, setSelectedDealer] = useState(null);

// // // //    const allDispatched = data?.dispatched ?? [];
// // // //    const allReceipts   = data?.receipts   ?? [];
// // // //    const allAdjusted   = data?.adjusted   ?? [];

// // // //    const filteredDispatched = useMemo(() => {
// // // //       if (!selectedDealer) return allDispatched;
// // // //       return allDispatched.filter(r =>
// // // //          r.farmerDealerCode === selectedDealer.farmerDealerCode
// // // //       );
// // // //    }, [allDispatched, selectedDealer]);

// // // //    const filteredReceipts = useMemo(() => {
// // // //       if (!selectedDealer) return allReceipts;
// // // //       return allReceipts.filter(r =>
// // // //          r.farmerDealerCode === selectedDealer.farmerDealerCode
// // // //       );
// // // //    }, [allReceipts, selectedDealer]);

// // // //    const filteredAdjusted = useMemo(() => {
// // // //       if (!selectedDealer) return allAdjusted;
// // // //       return allAdjusted.filter(r =>
// // // //          r.farmerDealerCode === selectedDealer.farmerDealerCode
// // // //       );
// // // //    }, [allAdjusted, selectedDealer]);

// // // //    const filteredSummary = useMemo(() => {
// // // //       if (!selectedDealer) return data?.summary;
// // // //       return {
// // // //          totalDispatched:      filteredDispatched.length,
// // // //          totalReceipts:        filteredReceipts.length,
// // // //          totalAdjusted:        filteredAdjusted.length,
// // // //          totalMiniAcres:       filteredDispatched.reduce((s, r) => s + (Number(r.miniAcres)       || 0), 0),
// // // //          totalDripAcres:       filteredDispatched.reduce((s, r) => s + (Number(r.dripAcres)       || 0), 0),
// // // //          totalHdpeAcres:       filteredDispatched.reduce((s, r) => s + (Number(r.hdpeAcres)       || 0), 0),
// // // //          totalMiniFarmerShare: filteredDispatched.reduce((s, r) => s + (Number(r.miniFarmerShare) || 0), 0),
// // // //          totalDripFarmerShare: filteredDispatched.reduce((s, r) => s + (Number(r.dripFarmerShare) || 0), 0),
// // // //          totalHdpeFarmerShare: filteredDispatched.reduce((s, r) => s + (Number(r.hdpeFarmerShare) || 0), 0),
// // // //          totalAmountReceived:  filteredReceipts.reduce((s,  r) => s + (Number(r.amount)           || 0), 0),
// // // //       };
// // // //    }, [filteredDispatched, filteredReceipts, filteredAdjusted, selectedDealer, data]);

// // // //    // DealerFilter ke liye combined records (dispatched se dealers nikalenge)
// // // //    const allRecords = allDispatched;

// // // //    return (
// // // //       <div>
// // // //          <DealerFilter records={allRecords} onFilter={setSelectedDealer} />
// // // //          <PanelTabs
// // // //             tabs={TABS}
// // // //             activeTab={activeTab}
// // // //             onChange={setActiveTab}
// // // //             model="material-dispatch"
// // // //             fileName="material-dispatch-report"
// // // //             pdfTab={activeTab}
// // // //                financialYear={financialYear}

// // // //             dealerName={selectedDealer?.dealerName || ""}
// // // //          />
// // // //          {activeTab === "summary"    && <SummaryCards summaryCards={SUMMARY_CARDS} summary={filteredSummary} />}
// // // //          {activeTab === "dispatched" && <DataTable columns={DISPATCHED_COLUMNS} rows={filteredDispatched} />}
// // // //          {activeTab === "receipts"   && <DataTable columns={RECEIPTS_COLUMNS}   rows={filteredReceipts} />}
// // // //          {activeTab === "adjusted"   && <DataTable columns={ADJUSTED_COLUMNS}   rows={filteredAdjusted} />}
// // // //       </div>
// // // //    );
// // // // }

// // // // export default MaterialDispatchPanel;










import { useState, useMemo, useEffect, useCallback } from "react";
import api from "../../../api/axios";
import SummaryCards from "./SummaryCards";
import DataTable from "./DataTable";
import PanelTabs from "./PanelTabs";
import DealerFilter from "./DealerFilter";
import DealerMaterialDispatchSummary from "../materialdispatched/DealerMaterialDispatchSummary";
import { calcDealerMaterialDispatchSummary } from "../materialdispatched/dealerMaterialDispatchSummaryCal";

const TABS = [
   { key: "summary",        label: "Summary" },
   { key: "dispatched",     label: "Dispatched" },
   { key: "receipts",       label: "Receipts" },
   { key: "adjusted",       label: "Adjusted" },
   { key: "dealerSummary",  label: "Dealer Summary" },   // ← new tab
];

const SUMMARY_CARDS = [
   { key: "totalDispatched",      label: "Total Dispatched",      format: true },
   { key: "totalReceipts",        label: "Total Receipts",        format: true },
   { key: "totalAdjusted",        label: "Total Adjusted",        format: true },
   { key: "totalMiniAcres",       label: "Mini Acres",            format: true },
   { key: "totalDripAcres",       label: "Drip Acres",            format: true },
   { key: "totalHdpeAcres",       label: "HDPE Acres",            format: true },
   { key: "totalMiniFarmerShare", label: "Mini Farmer Share",     currency: true },
   { key: "totalDripFarmerShare", label: "Drip Farmer Share",     currency: true },
   { key: "totalHdpeFarmerShare", label: "HDPE Farmer Share",     currency: true },
   { key: "totalAmountReceived",  label: "Amount Received",       currency: true },
];

const DISPATCHED_COLUMNS = [
   { key: "srNo",             label: "Sr No" },
   { key: "date",             label: "Date",                date: true },
   { key: "dealerName",       label: "Dealer Name" },
   { key: "farmerDealerCode", label: "Dealer Code" },
   { key: "farmerName",       label: "Farmer Name" },
   { key: "address",          label: "Address" },
   { key: "brandName",        label: "Brand" },
   { key: "challanNo",        label: "Challan No" },
   { key: "vehicleNo",        label: "Vehicle No" },
   { key: "destination",      label: "Destination" },
   { key: "miniAcres",        label: "Mini Acres",          format: true },
   { key: "miniFarmerShare",  label: "Mini Farmer Share",   format: true },
   { key: "dripAcres",        label: "Drip Acres",          format: true },
   { key: "dripFarmerShare",  label: "Drip Farmer Share",   format: true },
   { key: "hdpeAcres",        label: "HDPE Acres",          format: true },
   { key: "hdpeFarmerShare",  label: "HDPE Farmer Share",   format: true },
   { key: "reference",        label: "Reference" },
];

const RECEIPTS_COLUMNS = [
   { key: "srNo",             label: "Sr No" },
   { key: "date",             label: "Date",                date: true },
   { key: "dealerName",       label: "Dealer Name" },
   { key: "farmerDealerCode", label: "Dealer Code" },
   { key: "amount",           label: "Amount",              format: true },
   { key: "remarks",          label: "Remarks" },
];

const ADJUSTED_COLUMNS = [
   { key: "sn",               label: "S.No" },
   { key: "dealerName",       label: "Dealer Name" },
   { key: "farmerDealerCode", label: "Dealer Code" },
   { key: "amount",           label: "Amount",              format: true },
];

function MaterialDispatchPanel({ data, financialYear }) {
   const [activeTab,      setActiveTab]      = useState("summary");
   const [selectedDealer, setSelectedDealer] = useState(null);

   // ── Raw file records — fetched directly from /mainfile (same as FileRecord.jsx) ──
   // Used only to derive "Document Received in Acre" (Mini/Drip) for Dealer Summary,
   // via MI-validated irrigationType + areaInAcre, exactly like DealerMainSummary does.
   // NOTE: this is always the TOTAL across all financial years — NO financialYear
   // filter here, even though the table label shows a single FY for Material
   // Dispatched/Farmer Share. Document Received intentionally stays un-scoped.
   const [records,        setRecords]        = useState([]);
   const [recordsLoading,  setRecordsLoading] = useState(false);
   const [recordsError,    setRecordsError]   = useState(null);

   const fetchRecords = useCallback(async () => {
      setRecordsLoading(true); setRecordsError(null);
      try {
         // No financialYear param — Document Received must be the TOTAL across
         // all years, not scoped to the currently selected financial year.
         const params = { limit: 0, page: 1 };
         const res = await api.get("/mainfile", { params });
         setRecords(res.data?.data ?? []);
      } catch (err) {
         setRecordsError(err.response?.data?.message || "Failed to fetch records");
      } finally {
         setRecordsLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchRecords();
   }, [fetchRecords]);

   const allDispatched = data?.dispatched     ?? [];
   const allReceipts   = data?.receipts       ?? [];
   const allAdjusted   = data?.adjusted       ?? [];
   const allRecords    = records;   // ← /mainfile se fetched raw records (ALL years, total)

   // ── Dealer match helper — matches by farmerDealerCode primarily, but falls
   // back to dealerName when a row's farmerDealerCode is blank/missing/mismatched
   // (e.g. data-entry rows like "SHIFTING ENTRY" that share the same dealer but
   // weren't tagged with the code). This prevents such rows from silently
   // dropping out of a dealer's totals. ─────────────────────────────────────
   function matchesSelectedDealer(r, dealer) {
      if (!dealer) return true;
      const rowCode    = String(r.farmerDealerCode ?? "").trim();
      const dealerCode = String(dealer.farmerDealerCode ?? "").trim();
      if (rowCode && dealerCode && rowCode === dealerCode) return true;

      // Fallback: match by dealer name when code is missing on either side
      const rowName    = String(r.dealerName ?? "").trim().toLowerCase();
      const dealerName  = String(dealer.dealerName ?? "").trim().toLowerCase();
      if (!rowCode && rowName && dealerName && rowName === dealerName) return true;

      return false;
   }

   const filteredDispatched = useMemo(() => {
      if (!selectedDealer) return allDispatched;
      return allDispatched.filter(r => matchesSelectedDealer(r, selectedDealer));
   }, [allDispatched, selectedDealer]);

   const filteredReceipts = useMemo(() => {
      if (!selectedDealer) return allReceipts;
      return allReceipts.filter(r => matchesSelectedDealer(r, selectedDealer));
   }, [allReceipts, selectedDealer]);

   const filteredAdjusted = useMemo(() => {
      if (!selectedDealer) return allAdjusted;
      return allAdjusted.filter(r => matchesSelectedDealer(r, selectedDealer));
   }, [allAdjusted, selectedDealer]);

   const filteredRecords = useMemo(() => {
      if (!selectedDealer) return allRecords;
      return allRecords.filter(r => matchesSelectedDealer(r, selectedDealer));
   }, [allRecords, selectedDealer]);

   // ── Dealer Summary — ab backend se nahi, yahin frontend par calculate hota hai ──
   // Document Received (Mini/Drip Acre) records se (MI-validated) nikalta hai,
   // Material Dispatched dispatched array se.
   const dealerSummaryRows = useMemo(() => {
      return calcDealerMaterialDispatchSummary({
         dispatched: filteredDispatched,
         receipts:   filteredReceipts,
         adjusted:   filteredAdjusted,
         records:    filteredRecords,
      });
   }, [filteredDispatched, filteredReceipts, filteredAdjusted, filteredRecords]);

   const filteredSummary = useMemo(() => {
      if (!selectedDealer) return data?.summary;
      return {
         totalDispatched:      filteredDispatched.length,
         totalReceipts:        filteredReceipts.length,
         totalAdjusted:        filteredAdjusted.length,
         totalMiniAcres:       filteredDispatched.reduce((s, r) => s + (Number(r.miniAcres)       || 0), 0),
         totalDripAcres:       filteredDispatched.reduce((s, r) => s + (Number(r.dripAcres)       || 0), 0),
         totalHdpeAcres:       filteredDispatched.reduce((s, r) => s + (Number(r.hdpeAcres)       || 0), 0),
         totalMiniFarmerShare: filteredDispatched.reduce((s, r) => s + (Number(r.miniFarmerShare) || 0), 0),
         totalDripFarmerShare: filteredDispatched.reduce((s, r) => s + (Number(r.dripFarmerShare) || 0), 0),
         totalHdpeFarmerShare: filteredDispatched.reduce((s, r) => s + (Number(r.hdpeFarmerShare) || 0), 0),
         totalAmountReceived:  filteredReceipts.reduce((s,  r) => s + (Number(r.amount)           || 0), 0),
      };
   }, [filteredDispatched, filteredReceipts, filteredAdjusted, selectedDealer, data]);

   return (
      <div>
         <DealerFilter records={allDispatched} onFilter={setSelectedDealer} />

         {recordsError && (
            <div className="w-full px-4 py-2 mb-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
               {recordsError}
            </div>
         )}

         <PanelTabs
            tabs={TABS}
            activeTab={activeTab}
            onChange={setActiveTab}
            model="material-dispatch"
            fileName="material-dispatch-report"
            pdfTab={activeTab}
            financialYear={financialYear}
            dealerName={selectedDealer?.dealerName || ""}
         />

         {activeTab === "summary"      && <SummaryCards summaryCards={SUMMARY_CARDS} summary={filteredSummary} />}
         {activeTab === "dispatched"   && <DataTable columns={DISPATCHED_COLUMNS} rows={filteredDispatched} />}
         {activeTab === "receipts"     && <DataTable columns={RECEIPTS_COLUMNS}   rows={filteredReceipts} />}
         {activeTab === "adjusted"     && <DataTable columns={ADJUSTED_COLUMNS}   rows={filteredAdjusted} />}
         {activeTab === "dealerSummary" && (
            <DealerMaterialDispatchSummary
               rows={dealerSummaryRows}
               financialYear={financialYear}
            />
         )}
      </div>
   );
}

export default MaterialDispatchPanel;