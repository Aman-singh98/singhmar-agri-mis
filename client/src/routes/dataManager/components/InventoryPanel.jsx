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
   { key: "totalRecords", label: "Total Records", format: true },
   { key: "totalAcres",   label: "Total Acres",   format: true },
   { key: "totalItems",   label: "Total Items",   format: true },
   { key: "totalDealers", label: "Total Dealers", format: true },
];

const COLUMNS = [
   { key: "date",                                                    label: "Date",                   date: true },
   { key: "dealerName",                                              label: "Dealer" },
   { key: "farmerDealerCode",                                        label: "Dealer Code" },
   { key: "challanNo",                                               label: "Challan No" },
   { key: "acre",                                                    label: "Acre",                   format: true },
   { key: "totalItems",                                              label: "Total Items",            format: true },
   { key: "products.32mmLateralCl2MiniSprinklerMungipa",            label: "32mm Lateral (Mungipa)", format: true },
   { key: "products.miniSprinklerPlasticNozzleMungipa",             label: "Mini Sprinkler Nozzle",  format: true },
   { key: "products.stickStandRod",                                  label: "Stick Stand Rod",        format: true },
   { key: "products.tubeAssembly15Mtr",                              label: "Tube Assembly 15m",      format: true },
   { key: "products.32mmBallValveNeerShakti",                        label: "32mm Ball Valve",        format: true },
   { key: "products.32mmEndPlug",                                    label: "32mm End Plug",          format: true },
   { key: "products.32mmServiceSaddle75x32",                         label: "32mm Service Saddle",    format: true },
   { key: "products.32mmMtaFta",                                     label: "32mm MTA/FTA",           format: true },
   { key: "products.32mmJoiner",                                     label: "32mm Joiner",            format: true },
   { key: "products.75mmHdpePipe6MtrDulyCoupledMungipa",            label: "75mm HDPE Pipe 6m",      format: true },
   { key: "products.75mmSprinklerRubberRing",                        label: "75mm Rubber Ring",       format: true },
   { key: "products.16mmInLineLateral16x4x60NeerShakti",            label: "16mm Inline Lateral 60", format: true },
   { key: "products.16mmInLineLateral16x4x30NeerShakti",            label: "16mm Inline Lateral 30", format: true },
   { key: "products.16mmTakeOff",                                    label: "16mm Take Off",          format: true },
   { key: "products.16mmJoiner",                                     label: "16mm Joiner",            format: true },
   { key: "products.16mmEndCap",                                     label: "16mm End Cap",           format: true },
];

function flattenInventoryRows(rows) {
   if (!rows) return [];
   return rows.map(row => {
      const flat = { ...row };
      if (row.products && typeof row.products === "object") {
         Object.entries(row.products).forEach(([k, v]) => {
            flat["products." + k] = v;
         });
      }
      return flat;
   });
}

function InventoryPanel({ data,financialYear }) {
   const [activeTab, setActiveTab] = useState("summary");
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
      const flat = flattenInventoryRows(filteredRecords);
      return {
         totalRecords: filteredRecords.length,
         totalDealers: 1,
         totalAcres: filteredRecords.reduce((s, r) => s + (Number(r.acre) || 0), 0),
         totalItems: filteredRecords.reduce((s, r) => s + (Number(r.totalItems) || 0), 0),
      };
   }, [filteredRecords, selectedDealer, data]);

   const flatRows = flattenInventoryRows(filteredRecords);

   return (
      <div>
         <DealerFilter records={allRecords} onFilter={setSelectedDealer} />
         <PanelTabs
            tabs={TABS}
            activeTab={activeTab}
            onChange={setActiveTab}
            model="inventory"
            fileName="inventory-report"  
            financialYear={financialYear}
            dealerName={selectedDealer?.dealerName || ""}
         />
         {activeTab === "summary" && <SummaryCards summaryCards={SUMMARY_CARDS} summary={filteredSummary} />}
         {activeTab === "records" && <DataTable columns={COLUMNS} rows={flatRows} />}
      </div>
   );
}

export default InventoryPanel;
