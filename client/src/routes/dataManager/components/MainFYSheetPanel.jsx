import { useState, useMemo } from "react";
import SummaryCards from "./SummaryCards";
import DataTable from "./DataTable";
import PanelTabs from "./PanelTabs";
import DealerFilter from "./DealerFilter";
import { calcBrandRow, calcDailyProgress } from "../mainfy/todaySummaryCalc";
import { calcAllDealerRows } from "../mainfy/dealerSummaryCalc";
import Pdf from "../../../components/Pdf";
import Excel from "../../../components/Excel";
import RecordsPopup from "../mainfy/RecordsPopup";

// ── Tab config — "dealer" tab add kiya ───────────────────────────────────────
const TABS = [
   { key: "summary",        label: "Summary" },
   { key: "records",        label: "Records" },
   { key: "today",          label: "Today Summary" },
   { key: "dealerSummary",  label: "Dealer Summary" },   // ← NEW
];

const SUMMARY_CARDS = [
   { key: "totalRecords",   label: "Total Records",     format: true },
   { key: "totalAreaAcre",  label: "Total Area (Acre)", format: true },
   { key: "totalDealers",   label: "Total Dealers",     format: true },
   { key: "totalBillValue", label: "Total Bill Value",  currency: true },
];

const COLUMNS = [
   { key: "srNo",                    label: "Sr No" },
   { key: "scanNo",                  label: "Scan No" },
   { key: "brandName",               label: "Brand" },
   { key: "name",                    label: "Name" },
   { key: "fatherName",              label: "Father Name" },
   { key: "mobileNo",                label: "Mobile No" },
   { key: "dealerName",              label: "Dealer" },
   { key: "farmerDealerCode",        label: "Dealer Code" },
   { key: "village",                 label: "Village" },
   { key: "address",                 label: "Address" },
   { key: "block",                   label: "Block" },
   { key: "district",                label: "District" },
   { key: "type",                    label: "Irrigation Type" },
   { key: "areaInAcre",              label: "Area (Acre)",               format: true },
   { key: "miNumber",                label: "MI Number" },
   { key: "billNo",                  label: "Bill No" },
   { key: "billValue",               label: "Bill Value",                currency: true },
   { key: "gst",                     label: "GST",                       currency: true },
   { key: "farmerShare",             label: "Farmer Share",              currency: true },
   { key: "dateOfApplication",       label: "Date of Application",       date: true },
   { key: "verificationStatus",      label: "Verification Status" },
   { key: "estimateStatus",          label: "Estimate Status" },
   { key: "onlineFarmerShareStatus", label: "Online Farmer Share Status" },
   { key: "challanStatus",           label: "Challan Status" },
   { key: "tallyBillStatus",         label: "Tally Bill Status" },
   { key: "billUploadStatus",        label: "Bill Upload Status" },
   { key: "verificationDone",        label: "Verification Done" },
   { key: "applicationStatus",       label: "Application Status" },
   { key: "onlineStatus",            label: "Online Status" },
   { key: "status",                  label: "MI Status" },
   { key: "delay",                   label: "Delay" },
   { key: "remarks",                 label: "Remarks" },
   { key: "reason",                  label: "Reason" },
];

const BRANDS = ["NEER SHAKTI", "MOONGIPA", "ADS"];

const GROUPS = [
   { key: "files",    label: "Files",        span: 4, cls: "grp-files" },
   { key: "estimate", label: "Estimate",     span: 5, cls: "grp-estimate" },
   { key: "farmer",   label: "Farmer Share", span: 4, cls: "grp-farmer" },
   { key: "bill",     label: "Bill Status",  span: 3, cls: "grp-bill" },
   { key: "pv",       label: "PV Status",    span: 3, cls: "grp-pv" },
];

const NOS_COLS = [
   { key: "totalFiles",       label: "Total No. of Files",            group: "files" },
   { key: "verified",         label: "Verified",                      group: "files" },
   { key: "pending",          label: "Pending",                       group: "files",    red: true },
   { key: "objection",        label: "Objection",                     group: "files",    red: true },
   { key: "estSubmitted",     label: "Total Est. Submitted",          group: "estimate" },
   { key: "estApproved",      label: "Estimate Approved",             group: "estimate" },
   { key: "estDeptPending",   label: "Est. Pending from Dept",        group: "estimate", red: true },
   { key: "estYetToSubmit",   label: "Est. yet to submit",            group: "estimate", red: true },
   { key: "miSurveyPending",  label: "MI Survey Pending",             group: "estimate" },
   { key: "challanGen",       label: "Farmer challan Generated",      group: "farmer" },
   { key: "fsReceived",       label: "Farmer share received",         group: "farmer" },
   { key: "fsPaymentPending", label: "Farmer Payment pending",        group: "farmer",   red: true },
   { key: "fsGenPending",     label: "Farmer share Generate Pending", group: "farmer",   red: true },
   { key: "tallyBill",        label: "Tally Bill",                    group: "bill" },
   { key: "billUploaded",     label: "Bill Uploaded",                 group: "bill" },
   { key: "tallyPending",     label: "Tally Bill pending",            group: "bill",     red: true },
   { key: "pvDone",           label: "PV Done",                       group: "pv" },
   { key: "pvPending",        label: "P.V Pending",                   group: "pv",       red: true },
   { key: "xenPending",       label: "XEN Pending",                   group: "pv",       red: true },
];

const XEN_STATUSES = [
   "MI - Approval by 'XEN' at 'MI Field Survay Verification'",
   "MI - Approval by 'XEN' at 'MIS Field Physical Re-Verification(5%) and recommendation'",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getIrrigationType(r) {
   return r.type ?? r.irrigationType ?? "";
}

function fmt(val) {
   if (val === null || val === undefined || val === "") return "—";
   if (typeof val === "number") return val.toLocaleString("en-IN");
   return val;
}

function fmtDate(val) {
   if (!val) return "—";
   try {
      return new Date(val).toLocaleDateString("en-IN", {
         day: "2-digit", month: "short", year: "numeric",
      });
   } catch { return "—"; }
}

function calcTotal(rows, mode) {
   const total = { brand: "Total" };
   NOS_COLS.forEach(col => {
      const k = mode === "acre" ? col.key + "Acre" : col.key;
      total[k] = rows.reduce((s, r) => s + (Number(r[k]) || 0), 0);
   });
   return total;
}

// ── getFilteredRecords — Brand Summary ke liye (Today Summary) ────────────────
function getFilteredRecords(allRecords, brand, colKey) {
   const br = brand === "Total"
      ? allRecords
      : allRecords.filter(r => r.brandName === brand);

   switch (colKey) {
      case "totalFiles":       return br.filter(r => ["Verified","Pending","In-complete"].includes(r.verificationStatus));
      case "verified":         return br.filter(r => r.verificationStatus === "Verified");
      case "pending":          return br.filter(r => r.verificationStatus === "Pending");
      case "objection":        return br.filter(r => r.verificationStatus === "In-complete");
      case "estSubmitted":     return br.filter(r => ["Approved","Submitted"].includes(r.estimateStatus));
      case "estApproved":      return br.filter(r => r.estimateStatus === "Approved");
      case "estDeptPending":   return br.filter(r => r.estimateStatus === "Submitted");
      case "miSurveyPending":  return br.filter(r => r.estimateStatus === "In-Process");
      case "estYetToSubmit":   return br.filter(r =>
         r.verificationStatus === "Verified" &&
         !["Approved","Submitted","In-Process"].includes(r.estimateStatus)
      );
      case "challanGen":       return br.filter(r => ["Bank Received","Payment Pending"].includes(r.onlineFarmerShareStatus));
      case "fsReceived":       return br.filter(r => r.onlineFarmerShareStatus === "Bank Received");
      case "fsPaymentPending": return br.filter(r => r.onlineFarmerShareStatus === "Payment Pending");
      case "fsGenPending":     return br.filter(r =>
         r.estimateStatus === "Approved" &&
         !["Bank Received","Payment Pending"].includes(r.onlineFarmerShareStatus)
      );
      case "tallyBill":        return br.filter(r => r.tallyBillStatus === "Done");
      case "billUploaded":     return br.filter(r => r.billUploadStatus === "Done");
      case "tallyPending":     return br.filter(r =>
         r.onlineFarmerShareStatus === "Bank Received" && r.tallyBillStatus !== "Done"
      );
      case "pvDone":           return br.filter(r => r.verificationDone === "Done");
      case "pvPending":        return br.filter(r => r.verificationDone === "Pending");
      case "xenPending":       return br.filter(r => XEN_STATUSES.includes(r.status));
      default:                 return [];
   }
}

// ── getDealerFilteredRecords — Dealer Summary ke liye ─────────────────────────
function getDealerFilteredRecords(allRecords, farmerDealerCode, colKey) {
   const dr = farmerDealerCode === "Total"
      ? allRecords
      : allRecords.filter(r => r.farmerDealerCode === farmerDealerCode);

   switch (colKey) {
      case "totalFiles":       return dr.filter(r => ["Verified","Pending","In-complete"].includes(r.verificationStatus));
      case "verified":         return dr.filter(r => r.verificationStatus === "Verified");
      case "pending":          return dr.filter(r => r.verificationStatus === "Pending");
      case "objection":        return dr.filter(r => r.verificationStatus === "In-complete");
      case "estSubmitted":     return dr.filter(r => ["Approved","Submitted"].includes(r.estimateStatus));
      case "estApproved":      return dr.filter(r => r.estimateStatus === "Approved");
      case "estDeptPending":   return dr.filter(r => r.estimateStatus === "Submitted");
      case "miSurveyPending":  return dr.filter(r => r.estimateStatus === "In-Process");
      case "estYetToSubmit":   return dr.filter(r =>
         r.verificationStatus === "Verified" &&
         !["Approved","Submitted","In-Process"].includes(r.estimateStatus)
      );
      case "challanGen":       return dr.filter(r => ["Bank Received","Payment Pending"].includes(r.onlineFarmerShareStatus));
      case "fsReceived":       return dr.filter(r => r.onlineFarmerShareStatus === "Bank Received");
      case "fsPaymentPending": return dr.filter(r => r.onlineFarmerShareStatus === "Payment Pending");
      case "fsGenPending":     return dr.filter(r =>
         r.estimateStatus === "Approved" &&
         !["Bank Received","Payment Pending"].includes(r.onlineFarmerShareStatus)
      );
      case "tallyBill":        return dr.filter(r => r.tallyBillStatus === "Done");
      case "billUploaded":     return dr.filter(r => r.billUploadStatus === "Done");
      case "tallyPending":     return dr.filter(r =>
         r.onlineFarmerShareStatus === "Bank Received" && r.tallyBillStatus !== "Done"
      );
      case "pvDone":           return dr.filter(r => r.verificationDone === "Done");
      case "pvPending":        return dr.filter(r => r.verificationDone === "Pending");
      case "xenPending":       return dr.filter(r => XEN_STATUSES.includes(r.status));
      default:                 return [];
   }
}

// ── SummaryTable — Brand Summary (Today Summary tab) ─────────────────────────
function SummaryTable({ rows, mode, allRecords }) {
   const total  = calcTotal(rows, mode);
   const isAcre = mode === "acre";

   const [popup, setPopup] = useState({ open: false, records: [], title: "" });

   function handleCellClick(brand, colKey, val) {
      if (!val || Number(val) === 0) return;
      const filtered = getFilteredRecords(allRecords, brand, colKey);
      if (!filtered.length) return;
      const colLabel = NOS_COLS.find(c => c.key === colKey)?.label ?? colKey;
      setPopup({ open: true, records: filtered, title: `${brand} — ${colLabel}` });
   }

   return (
      <>
         <div className="overflow-x-auto mb-6">
            <table className="border-collapse text-xs" style={{ minWidth: "1100px", width: "100%" }}>
               <thead>
                  <tr>
                     <th rowSpan={2} className="px-3 py-2 text-left border border-slate-200 bg-slate-100
                        text-slate-500 font-bold uppercase tracking-wider text-[10px] min-w-[110px]">
                        Brand
                     </th>
                     {GROUPS.map(g => (
                        <th key={g.key} colSpan={g.span}
                           className={`px-2 py-2 text-center border border-slate-200 text-[10px]
                              font-bold uppercase tracking-wider ${g.cls}`}>
                           {g.label}
                        </th>
                     ))}
                  </tr>
                  <tr>
                     {NOS_COLS.map(col => (
                        <th key={col.key}
                           className={`px-2 py-2 text-center border border-slate-200 bg-slate-100
                              text-[10px] font-bold uppercase tracking-wider whitespace-nowrap
                              ${col.red ? "text-red-600" : "text-slate-500"}`}>
                           {col.label}
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody>
                  {rows.map((row, i) => (
                     <tr key={row.brand} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                        <td className="px-3 py-2 border border-slate-200 font-semibold text-slate-700 text-xs">
                           {row.brand}
                        </td>
                        {NOS_COLS.map(col => {
                           const k   = isAcre ? col.key + "Acre" : col.key;
                           const val = row[k];
                           const clickable = val && Number(val) > 0;
                           return (
                              <td key={col.key}
                                 onClick={() => handleCellClick(row.brand, col.key, val)}
                                 title={clickable ? "Click to view records" : undefined}
                                 className={`px-2 py-2 text-center border border-slate-200
                                    font-mono tabular-nums text-xs
                                    ${col.red ? "text-red-600 font-semibold" : "text-slate-700"}
                                    ${clickable
                                       ? "cursor-pointer hover:bg-green-50 hover:text-green-700 underline underline-offset-2 decoration-dotted"
                                       : ""
                                    }`}>
                                 {fmt(val)}
                              </td>
                           );
                        })}
                     </tr>
                  ))}
                  <tr className="bg-green-50">
                     <td className="px-3 py-2 border border-slate-200 font-bold text-green-800 text-xs">Total</td>
                     {NOS_COLS.map(col => {
                        const k   = isAcre ? col.key + "Acre" : col.key;
                        const val = total[k];
                        const clickable = val && Number(val) > 0;
                        return (
                           <td key={col.key}
                              onClick={() => handleCellClick("Total", col.key, val)}
                              title={clickable ? "Click to view records" : undefined}
                              className={`px-2 py-2 text-center border border-slate-200
                                 font-bold font-mono tabular-nums text-xs text-green-800
                                 ${clickable
                                    ? "cursor-pointer hover:bg-green-100 underline underline-offset-2 decoration-dotted"
                                    : ""
                                 }`}>
                              {fmt(val)}
                           </td>
                        );
                     })}
                  </tr>
               </tbody>
            </table>
         </div>

         <RecordsPopup
            open={popup.open}
            onClose={() => setPopup(p => ({ ...p, open: false }))}
            records={popup.records}
            title={popup.title}
            mode={mode}
         />
      </>
   );
}

// ── DealerSummaryTable — Dealer Summary ke liye alag table ───────────────────
function DealerSummaryTable({ rows, mode, allRecords }) {
   const isAcre = mode === "acre";
   const [popup, setPopup] = useState({ open: false, records: [], title: "" });

   // Total row calculate karo
   const total = useMemo(() => {
      const t = { dealerName: "Total", farmerDealerCode: "Total" };
      NOS_COLS.forEach(col => {
         const k = isAcre ? col.key + "Acre" : col.key;
         t[k] = rows.reduce((s, r) => s + (Number(r[k]) || 0), 0);
      });
      return t;
   }, [rows, isAcre]);

   function handleCellClick(farmerDealerCode, dealerName, colKey, val) {
      if (!val || Number(val) === 0) return;
      const filtered = getDealerFilteredRecords(allRecords, farmerDealerCode, colKey);
      if (!filtered.length) return;
      const colLabel = NOS_COLS.find(c => c.key === colKey)?.label ?? colKey;
      setPopup({
         open: true,
         records: filtered,
         title: `${dealerName} — ${colLabel}`,
      });
   }

   return (
      <>
         <div className="overflow-x-auto mb-6">
            <table className="border-collapse text-xs" style={{ minWidth: "1200px", width: "100%" }}>
               <thead>
                  <tr>
                     {/* Dealer Name + Code — 2 fixed columns */}
                     <th rowSpan={2} className="px-3 py-2 text-left border border-slate-200 bg-slate-100
                        text-slate-500 font-bold uppercase tracking-wider text-[10px] min-w-[160px]
                        sticky left-0 z-10">
                        Dealer Name
                     </th>
                     <th rowSpan={2} className="px-3 py-2 text-left border border-slate-200 bg-slate-100
                        text-slate-500 font-bold uppercase tracking-wider text-[10px] min-w-[100px]">
                        Dealer Code
                     </th>
                     {GROUPS.map(g => (
                        <th key={g.key} colSpan={g.span}
                           className={`px-2 py-2 text-center border border-slate-200 text-[10px]
                              font-bold uppercase tracking-wider ${g.cls}`}>
                           {g.label}
                        </th>
                     ))}
                  </tr>
                  <tr>
                     {NOS_COLS.map(col => (
                        <th key={col.key}
                           className={`px-2 py-2 text-center border border-slate-200 bg-slate-100
                              text-[10px] font-bold uppercase tracking-wider whitespace-nowrap
                              ${col.red ? "text-red-600" : "text-slate-500"}`}>
                           {col.label}
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody>
                  {rows.map((row, i) => (
                     <tr key={row.farmerDealerCode} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                        <td className="px-3 py-2 border border-slate-200 font-semibold text-slate-700 text-xs
                           sticky left-0 bg-inherit z-10 whitespace-nowrap">
                           {row.dealerName}
                        </td>
                        <td className="px-3 py-2 border border-slate-200 text-slate-500 text-xs font-mono">
                           {row.farmerDealerCode}
                        </td>
                        {NOS_COLS.map(col => {
                           const k   = isAcre ? col.key + "Acre" : col.key;
                           const val = row[k];
                           const clickable = val && Number(val) > 0;
                           return (
                              <td key={col.key}
                                 onClick={() => handleCellClick(row.farmerDealerCode, row.dealerName, col.key, val)}
                                 title={clickable ? "Click to view records" : undefined}
                                 className={`px-2 py-2 text-center border border-slate-200
                                    font-mono tabular-nums text-xs
                                    ${col.red ? "text-red-600 font-semibold" : "text-slate-700"}
                                    ${clickable
                                       ? "cursor-pointer hover:bg-blue-50 hover:text-blue-700 underline underline-offset-2 decoration-dotted"
                                       : ""
                                    }`}>
                                 {fmt(val)}
                              </td>
                           );
                        })}
                     </tr>
                  ))}
                  {/* Total row */}
                  <tr className="bg-green-50">
                     <td className="px-3 py-2 border border-slate-200 font-bold text-green-800 text-xs sticky left-0 bg-green-50 z-10">
                        Total
                     </td>
                     <td className="px-3 py-2 border border-slate-200 font-bold text-green-800 text-xs">
                        —
                     </td>
                     {NOS_COLS.map(col => {
                        const k   = isAcre ? col.key + "Acre" : col.key;
                        const val = total[k];
                        const clickable = val && Number(val) > 0;
                        return (
                           <td key={col.key}
                              onClick={() => handleCellClick("Total", "Total", col.key, val)}
                              title={clickable ? "Click to view records" : undefined}
                              className={`px-2 py-2 text-center border border-slate-200
                                 font-bold font-mono tabular-nums text-xs text-green-800
                                 ${clickable
                                    ? "cursor-pointer hover:bg-green-100 underline underline-offset-2 decoration-dotted"
                                    : ""
                                 }`}>
                              {fmt(val)}
                           </td>
                        );
                     })}
                  </tr>
               </tbody>
            </table>
         </div>

         <RecordsPopup
            open={popup.open}
            onClose={() => setPopup(p => ({ ...p, open: false }))}
            records={popup.records}
            title={popup.title}
            mode={mode}
         />
      </>
   );
}

// ── DealerSummary — toggle: In Nos / In Acre ─────────────────────────────────
function DealerSummary({ allRecords, uploadDate }) {
   const dealerRows = useMemo(() => calcAllDealerRows(allRecords), [allRecords]);

   const [search, setSearch] = useState("");
   const [mode,   setMode]   = useState("nos"); // "nos" | "acre"

   const filteredRows = useMemo(() => {
      if (!search.trim()) return dealerRows;
      const q = search.trim().toLowerCase();
      return dealerRows.filter(r =>
         (r.dealerName       ?? "").toLowerCase().includes(q) ||
         (r.farmerDealerCode ?? "").toLowerCase().includes(q)
      );
   }, [dealerRows, search]);

   // PDF / Excel ke liye data — Today Summary jaisa pattern
   const pdfData = useMemo(() => ({
      date:       uploadDate,
      dealerRows: filteredRows,
      mode,
   }), [uploadDate, filteredRows, mode]);

   return (
      <div>
         {/* Header bar */}
         <div className="flex flex-wrap items-center justify-between gap-3 mb-5 p-3 bg-slate-50 border border-slate-200">

            {/* Left: badges + toggle + PDF/Excel */}
            <div className="flex flex-wrap items-center gap-3">
               <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 font-semibold">
                  {dealerRows.length} Dealers
               </span>
               <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 font-semibold">
                  {allRecords.length.toLocaleString("en-IN")} Total Records
               </span>

               {/* ── Toggle: In Nos / In Acre ── */}
               <div className="flex items-center border border-slate-200 overflow-hidden">
                  <button
                     onClick={() => setMode("nos")}
                     className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors
                        ${mode === "nos"
                           ? "bg-blue-600 text-white"
                           : "bg-white text-slate-500 hover:bg-slate-50"
                        }`}
                  >
                     In Nos
                  </button>
                  <button
                     onClick={() => setMode("acre")}
                     className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors
                        border-l border-slate-200
                        ${mode === "acre"
                           ? "bg-blue-600 text-white"
                           : "bg-white text-slate-500 hover:bg-slate-50"
                        }`}
                  >
                     In Acre
                  </button>
               </div>


            </div>

            {/* Right: Search box + Excel/PDF */}
            <div className="flex items-center gap-2">
               <div className="relative">
                  <input
                     type="text"
                     placeholder="Search dealer name or code…"
                     value={search}
                     onChange={e => setSearch(e.target.value)}
                     className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 focus:outline-none
                        focus:border-blue-400 focus:ring-1 focus:ring-blue-300 w-56 bg-white"
                  />
                  <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  {search && (
                     <button onClick={() => setSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">
                        ✕
                     </button>
                  )}
               </div>
               <Excel
                  model="main-fySheet-dealer-summary"
                  fileName={`dealer-summary-${uploadDate ?? "export"}`}
                  label="Excel"
                  data={pdfData}
               />
               <Pdf
                  model="main-fySheet-dealer-summary"
                  fileName={`dealer-summary-${uploadDate ?? "export"}`}
                  label="PDF"
                  data={pdfData}
               />
            </div>
         </div>

         {/* Active mode label */}
         <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-1 bg-blue-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
               {mode === "nos" ? "In Nos" : "In Acre"}
            </p>
         </div>

         {filteredRows.length === 0 ? (
            <div className="text-sm text-slate-500 p-4 border border-slate-200 bg-slate-50">
               Koi dealer nahi mila "{search}" ke liye.
            </div>
         ) : (
            <DealerSummaryTable rows={filteredRows} mode={mode} allRecords={allRecords} />
         )}
      </div>
   );
}

// ── TodaySummary ──────────────────────────────────────────────────────────────
function TodaySummary({ allRecords, prevRecords, uploadDate, prevUploadDate }) {
   const brandRows = useMemo(() =>
      BRANDS.map(brand => calcBrandRow(brand, allRecords)),
      [allRecords]
   );

   const yesterdayBrandRows = useMemo(() =>
      BRANDS.map(brand => calcBrandRow(brand, prevRecords)),
      [prevRecords]
   );

   const dailyBrands = useMemo(() =>
      calcDailyProgress(brandRows, yesterdayBrandRows),
      [brandRows, yesterdayBrandRows]
   );

   const pdfData = useMemo(() => ({
      date: uploadDate,
      brandRows,
      dailyBrands,
   }), [uploadDate, brandRows, dailyBrands]);

   const dpTotal = (key) => dailyBrands.reduce((s, r) => s + (r[key] || 0), 0);

   return (
      <div>
         {/* Upload Info Banner */}
         <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 bg-slate-50 border border-slate-200">
            <div className="flex flex-wrap items-center gap-3">
               <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 font-semibold">
                  Latest Upload: {uploadDate ?? "—"}
               </span>
               <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 font-semibold">
                  Previous Upload: {prevUploadDate ?? "No previous upload"}
               </span>
               <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 font-semibold">
                  {allRecords.length.toLocaleString("en-IN")} records
               </span>
            </div>
            <div className="flex items-center gap-2">
               <Excel
                  model="main-fySheet-today-summary"
                  fileName={`today-summary-${uploadDate}`}
                  label="Excel"
                  data={pdfData}
               />
               <Pdf
                  model="main-fySheet-today-summary"
                  fileName={`today-summary-${uploadDate}`}
                  label="PDF"
                  data={pdfData}
               />
            </div>
         </div>

         {/* In Nos */}
         <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-1 bg-green-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600">In Nos</p>
         </div>
         <SummaryTable rows={brandRows} mode="nos" allRecords={allRecords} />

         {/* In Acre */}
         <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-1 bg-green-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600">In Acre</p>
         </div>
         <SummaryTable rows={brandRows} mode="acre" allRecords={allRecords} />

         {/* Daily Progress */}
         <div className="flex items-center gap-2 mb-3 mt-6">
            <div className="h-4 w-1 bg-yellow-500" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600">Daily Progress</p>
            {prevUploadDate && (
               <span className="text-[10px] text-slate-400 font-medium">
                  ({prevUploadDate} → {uploadDate})
               </span>
            )}
         </div>

         {!prevUploadDate || prevRecords.length === 0 ? (
            <div className="text-sm text-slate-500 mt-2 p-4 border border-slate-200 bg-slate-50">
               ⚠️ Sirf ek upload available hai — Daily Progress ke liye doosra upload karo.
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="border-collapse text-xs w-full" style={{ minWidth: "900px" }}>
                  <thead>
                     <tr>
                        <th rowSpan={2} className="px-3 py-2 text-left border border-slate-200 bg-slate-100
                           text-slate-500 font-bold uppercase tracking-wider text-[10px] min-w-[110px]">
                           Brand
                        </th>
                        <th colSpan={4} className="px-2 py-2 text-center border border-slate-200
                           text-[10px] font-bold uppercase tracking-wider"
                           style={{ background: "#F5A623", color: "#5C3B00" }}>
                           Today MICADA Progress
                        </th>
                        <th rowSpan={2} className="border border-slate-200 bg-white w-4" />
                        <th colSpan={5} className="px-2 py-2 text-center border border-slate-200
                           text-[10px] font-bold uppercase tracking-wider"
                           style={{ background: "#F4A460", color: "#5C2E00" }}>
                           Today Staff Progress
                        </th>
                        <th rowSpan={2} className="border border-slate-200 bg-white w-4" />
                        <th colSpan={2} className="px-2 py-2 text-center border border-slate-200
                           text-[10px] font-bold uppercase tracking-wider"
                           style={{ background: "#4CAF50", color: "#FFFFFF" }}>
                           Today Field Progress
                        </th>
                     </tr>
                     <tr>
                        <th className="px-2 py-2 text-center border border-slate-200 bg-yellow-50 text-[10px] font-bold text-yellow-800 whitespace-nowrap">Verified</th>
                        <th className="px-2 py-2 text-center border border-slate-200 bg-yellow-50 text-[10px] font-bold text-red-600 whitespace-nowrap">Pending</th>
                        <th className="px-2 py-2 text-center border border-slate-200 bg-yellow-50 text-[10px] font-bold text-red-600 whitespace-nowrap">In-Complete</th>
                        <th className="px-2 py-2 text-center border border-slate-200 bg-yellow-50 text-[10px] font-bold text-yellow-800 whitespace-nowrap">Estimate Approved</th>
                        <th className="px-2 py-2 text-center border border-slate-200 bg-orange-50 text-[10px] font-bold text-orange-800 whitespace-nowrap">New File</th>
                        <th className="px-2 py-2 text-center border border-slate-200 bg-orange-50 text-[10px] font-bold text-orange-800 whitespace-nowrap">Estimate Submitted</th>
                        <th className="px-2 py-2 text-center border border-slate-200 bg-orange-50 text-[10px] font-bold text-orange-800 whitespace-nowrap">Farmer Challan Generated</th>
                        <th className="px-2 py-2 text-center border border-slate-200 bg-orange-50 text-[10px] font-bold text-orange-800 whitespace-nowrap">Tally Bill</th>
                        <th className="px-2 py-2 text-center border border-slate-200 bg-orange-50 text-[10px] font-bold text-orange-800 whitespace-nowrap">Bill Uploaded</th>
                        <th className="px-2 py-2 text-center border border-slate-200 bg-green-50 text-[10px] font-bold text-green-800 whitespace-nowrap">Site Verified</th>
                        <th className="px-2 py-2 text-center border border-slate-200 bg-green-50 text-[10px] font-bold text-green-800 whitespace-nowrap">MI Survey</th>
                     </tr>
                  </thead>
                  <tbody>
                     {dailyBrands.map((row, i) => (
                        <tr key={row.brand} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                           <td className="px-3 py-2 border border-slate-200 font-semibold text-slate-700 text-xs">{row.brand}</td>
                           <td className="px-2 py-2 text-center border border-slate-200 font-mono text-xs text-slate-700">{row.dpVerified}</td>
                           <td className="px-2 py-2 text-center border border-slate-200 font-mono text-xs text-red-600 font-semibold">{row.dpPending}</td>
                           <td className="px-2 py-2 text-center border border-slate-200 font-mono text-xs text-red-600 font-semibold">{row.dpInComplete}</td>
                           <td className="px-2 py-2 text-center border border-slate-200 font-mono text-xs text-slate-700">{row.dpEstApproved}</td>
                           <td className="border border-slate-100 bg-slate-50" />
                           <td className="px-2 py-2 text-center border border-slate-200 font-mono text-xs text-slate-700">{row.dpNewFile}</td>
                           <td className="px-2 py-2 text-center border border-slate-200 font-mono text-xs text-slate-700">{row.dpEstSubmitted}</td>
                           <td className="px-2 py-2 text-center border border-slate-200 font-mono text-xs text-slate-700">{row.dpChallanGen}</td>
                           <td className="px-2 py-2 text-center border border-slate-200 font-mono text-xs text-slate-700">{row.dpTallyBill}</td>
                           <td className="px-2 py-2 text-center border border-slate-200 font-mono text-xs text-slate-700">{row.dpBillUploaded}</td>
                           <td className="border border-slate-100 bg-slate-50" />
                           <td className="px-2 py-2 text-center border border-slate-200 font-mono text-xs text-slate-700">{row.dpSiteVerified}</td>
                           <td className="px-2 py-2 text-center border border-slate-200 font-mono text-xs text-slate-700">{row.dpMiSurvey}</td>
                        </tr>
                     ))}
                     <tr className="bg-green-50">
                        <td className="px-3 py-2 border border-slate-200 font-bold text-green-800 text-xs">Total</td>
                        <td className="px-2 py-2 text-center border border-slate-200 font-bold font-mono text-xs text-green-800">{dpTotal("dpVerified")}</td>
                        <td className="px-2 py-2 text-center border border-slate-200 font-bold font-mono text-xs text-green-800">{dpTotal("dpPending")}</td>
                        <td className="px-2 py-2 text-center border border-slate-200 font-bold font-mono text-xs text-green-800">{dpTotal("dpInComplete")}</td>
                        <td className="px-2 py-2 text-center border border-slate-200 font-bold font-mono text-xs text-green-800">{dpTotal("dpEstApproved")}</td>
                        <td className="border border-slate-100 bg-green-50" />
                        <td className="px-2 py-2 text-center border border-slate-200 font-bold font-mono text-xs text-green-800">{dpTotal("dpNewFile")}</td>
                        <td className="px-2 py-2 text-center border border-slate-200 font-bold font-mono text-xs text-green-800">{dpTotal("dpEstSubmitted")}</td>
                        <td className="px-2 py-2 text-center border border-slate-200 font-bold font-mono text-xs text-green-800">{dpTotal("dpChallanGen")}</td>
                        <td className="px-2 py-2 text-center border border-slate-200 font-bold font-mono text-xs text-green-800">{dpTotal("dpTallyBill")}</td>
                        <td className="px-2 py-2 text-center border border-slate-200 font-bold font-mono text-xs text-green-800">{dpTotal("dpBillUploaded")}</td>
                        <td className="border border-slate-100 bg-green-50" />
                        <td className="px-2 py-2 text-center border border-slate-200 font-bold font-mono text-xs text-green-800">{dpTotal("dpSiteVerified")}</td>
                        <td className="px-2 py-2 text-center border border-slate-200 font-bold font-mono text-xs text-green-800">{dpTotal("dpMiSurvey")}</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         )}
      </div>
   );
}

// ── MainFYSheetPanel ──────────────────────────────────────────────────────────
function MainFYSheetPanel({ data, financialYear }) {
   const [activeTab,          setActiveTab]          = useState("summary");
   const [selectedDealer,     setSelectedDealer]     = useState(null);
   const [selectedIrrigation, setSelectedIrrigation] = useState("");

   function handleDealerFilter(dealer) {
      setSelectedDealer(dealer);
      setSelectedIrrigation("");
   }

   const allRecords  = data?.records     ?? [];
   const prevRecords = data?.prevRecords ?? [];

   const dealerFilteredRecords = useMemo(() => {
      if (!selectedDealer) return allRecords;
      return allRecords.filter(r =>
         r.farmerDealerCode === selectedDealer.farmerDealerCode
      );
   }, [allRecords, selectedDealer]);

   const irrigationTypes = useMemo(() => {
      const types = new Set(
         dealerFilteredRecords.map(getIrrigationType).filter(Boolean)
      );
      return Array.from(types).sort();
   }, [dealerFilteredRecords]);

   const filteredRecords = useMemo(() => {
      if (!selectedIrrigation) return dealerFilteredRecords;
      return dealerFilteredRecords.filter(r =>
         getIrrigationType(r) === selectedIrrigation
      );
   }, [dealerFilteredRecords, selectedIrrigation]);

   const filteredSummary = useMemo(() => {
      if (!selectedDealer && !selectedIrrigation) return data?.summary;
      const uniqueDealers = new Set(filteredRecords.map(r => r.farmerDealerCode).filter(Boolean));
      return {
         totalRecords:     filteredRecords.length,
         totalDealers:     uniqueDealers.size,
         totalAreaAcre:    filteredRecords.reduce((s, r) => s + (Number(r.areaInAcre)  || 0), 0),
         totalBillValue:   filteredRecords.reduce((s, r) => s + (Number(r.billValue)   || 0), 0),
         totalFarmerShare: filteredRecords.reduce((s, r) => s + (Number(r.farmerShare) || 0), 0),
      };
   }, [filteredRecords, selectedDealer, selectedIrrigation, data]);

   // Dealer Summary tab mein filter hide karo
   const showFilters = activeTab !== "today" && activeTab !== "dealerSummary";

   return (
      <div>
         {showFilters && (
            <div className="flex flex-wrap gap-4 items-start mb-4">
               <DealerFilter records={allRecords} onFilter={handleDealerFilter} />
               <div className="max-w-xs">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                     Filter by Irrigation Type
                  </label>
                  <div className="relative">
                     <select
                        value={selectedIrrigation}
                        onChange={e => setSelectedIrrigation(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 text-sm border border-gray-200
                           focus:outline-none focus:border-green-500 focus:ring-1
                           focus:ring-green-500 text-gray-700 appearance-none bg-white
                           disabled:opacity-50"
                        disabled={irrigationTypes.length === 0}
                     >
                        <option value="">All Types</option>
                        {irrigationTypes.map(type => (
                           <option key={type} value={type}>{type}</option>
                        ))}
                     </select>
                     <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                     </span>
                  </div>
                  {selectedIrrigation && (
                     <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="text-xs text-green-700 font-semibold bg-green-50
                           border border-green-200 px-2 py-0.5">
                           {selectedIrrigation}
                        </span>
                        <button
                           onClick={() => setSelectedIrrigation("")}
                           className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                           ✕
                        </button>
                     </div>
                  )}
               </div>
            </div>
         )}

         <PanelTabs
            tabs={TABS}
            activeTab={activeTab}
            onChange={setActiveTab}
            model={activeTab !== "today" && activeTab !== "dealerSummary" ? "main-fySheet" : null}
            fileName="main-fySheet-report"
            financialYear={financialYear}
            dealerName={selectedDealer?.dealerName || ""}
            data={filteredRecords}
         />

         {activeTab === "summary" && (
            <SummaryCards summaryCards={SUMMARY_CARDS} summary={filteredSummary} />
         )}
         {activeTab === "records" && (
            <DataTable columns={COLUMNS} rows={filteredRecords} />
         )}
         {activeTab === "today" && (
            <TodaySummary
               allRecords={allRecords}
               prevRecords={prevRecords}
               uploadDate={data?.uploadDate}
               prevUploadDate={data?.prevUploadDate}
            />
         )}
         {activeTab === "dealerSummary" && (
            <DealerSummary allRecords={allRecords} uploadDate={data?.uploadDate} />
         )}
      </div>
   );
}

export default MainFYSheetPanel;