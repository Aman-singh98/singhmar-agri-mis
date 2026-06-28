
// HisabPage.jsx
import { useState, useEffect, useCallback } from "react";
import { useDealerMaster } from "../../hooks/useDealerMaster";
import api from "../../api/axios";
import { DealerSelect, FinancialYearSelect } from "../../components/app";
import { useSelector } from "react-redux";
import { selectDealers } from "../../store/dealerSlice";
import Pdf from "../../components/Pdf";

async function fetchJson(url) {
   const res = await api.get(url);
   const j = res.data;
   if (!j.success) throw new Error(j.message || "Unknown error");
   return j.data;
}

const fmtINR = (n) =>
   n == null
      ? "—"
      : "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });

// ─── Icons ───────────────────────────────────────────────────────────────────
const RefreshIcon = () => (
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0">
      <path d="M1 4v6h6M23 20v-6h-6" />
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
   </svg>
);
const SearchIcon = () => (
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
   </svg>
);
const BackIcon = () => (
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0">
      <polyline points="15 18 9 12 15 6" />
   </svg>
);
const WarnIcon = () => (
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
   </svg>
);

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Spinner() {
   return (
      <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
         <div className="w-5 h-5 border-[3px] border-slate-200 border-t-green-600 animate-spin" />
         <span className="text-sm">Loading…</span>
      </div>
   );
}
function ErrorBanner({ msg }) {
   if (!msg) return null;
   return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-800 text-sm">
         <WarnIcon />
         {msg}
      </div>
   );
}
function useSortedData(data, sort) {
   if (!sort.col) return data;
   return [...data].sort((a, b) => {
      const av = a[sort.col], bv = b[sort.col];
      const cmp =
         typeof av === "number"
            ? av - bv
            : String(av || "").localeCompare(String(bv || ""));
      return sort.dir === "asc" ? cmp : -cmp;
   });
}
function Th({ col, label, sort, onSort, align = "left" }) {
   const active = sort.col === col;
   const alignClass =
      align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
   return (
      <th
         onClick={() => onSort(col)}
         className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap
            cursor-pointer select-none bg-slate-50 border-b-2 border-slate-200
            ${alignClass} ${active ? "text-green-700" : "text-slate-400"}`}
      >
         {label}{active ? (sort.dir === "asc" ? " ↑" : " ↓") : ""}
      </th>
   );
}

// ── Closing Balance Modal ─────────────────────────────────────────────────────
function ClosingBalanceModal({ detail, financialYear, dealerName, onClose, onSaved }) {
   const [amount, setAmount] = useState(String(detail?.netBalance ?? ""));
   const [saving, setSaving] = useState(false);
   const [msg,    setMsg]    = useState(null);

   async function handleSave() {
      if (amount === "") return;
      setSaving(true); setMsg(null);
      try {
         await api.post("/hisab/save-closing", {
            farmerDealerCode: detail.farmerDealerCode,
            financialYear,
            closingBalance:   Number(amount),
         });
         setMsg({ type: "success", text: "Closing balance saved successfully." });
         onSaved?.();
      } catch (e) {
         setMsg({ type: "error", text: e.response?.data?.message || "Failed to save." });
      } finally {
         setSaving(false);
      }
   }

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
         <div className="bg-white w-full max-w-sm border border-slate-200 shadow-xl">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
               <div className="text-sm font-bold text-slate-800">Save Closing Balance</div>
               <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none cursor-pointer"
               >
                  ×
               </button>
            </div>

            {/* Body */}
            <div className="px-5 py-5 flex flex-col gap-4">

               {/* Read-only info */}
               <div className="bg-slate-50 border border-slate-200 px-4 py-3 flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                     <span className="text-slate-400 font-medium">Dealer</span>
                     <span className="font-semibold text-slate-700">{dealerName || detail.farmerDealerCode}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-slate-400 font-medium">Financial Year</span>
                     <span className="font-semibold text-slate-700">{financialYear}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-slate-400 font-medium">Net Balance</span>
                     <span className="font-semibold text-green-700">{fmtINR(detail?.netBalance ?? 0)}</span>
                  </div>
               </div>

               {/* Editable closing balance */}
               <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                     Closing Balance (₹)
                  </label>
                  <input
                     type="number"
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     className="px-3 py-2 border border-slate-200 text-slate-800 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                  <p className="text-[11px] text-slate-400">
                     Default is net balance — edit if needed before saving.
                  </p>
               </div>

               {msg && (
                  <div className={`text-xs px-3 py-2 border ${
                     msg.type === "success"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                  }`}>
                     {msg.text}
                  </div>
               )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100">
               <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
               >
                  Cancel
               </button>
               <button
                  onClick={handleSave}
                  disabled={amount === "" || saving}
                  className="px-5 py-2 text-sm font-bold text-white bg-green-700 hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
               >
                  {saving ? "Saving…" : "Save"}
               </button>
            </div>
         </div>
      </div>
   );
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 1 — Summary
// ════════════════════════════════════════════════════════════════════════════
function SummaryTab({ financialYear, onViewDealer }) {
   const { summary, loading, error, fetchSummary } = useDealerMaster();
   const [search, setSearch] = useState("");
   const [sort,   setSort]   = useState({ col: "dealerName", dir: "asc" });

   useEffect(() => {
      if (financialYear) fetchSummary({ financialYear });
   }, [financialYear]);

   const toggleSort = (col) =>
      setSort((s) => ({
         col,
         dir: s.col === col && s.dir === "asc" ? "desc" : "asc",
      }));

   const filtered = summary.filter(
      (d) =>
         !search ||
         d.dealerName?.toLowerCase().includes(search.toLowerCase()) ||
         d.farmerDealerCode?.toLowerCase().includes(search.toLowerCase())
   );
   const sorted = useSortedData(filtered, sort);

   return (
      <div className="flex flex-col h-full overflow-hidden">

         {/* ══ FIXED HEADER ══════════════════════════════════════════════════ */}
         <div className="flex-none bg-white border-b-2 border-slate-200 shadow-sm z-10">
            <div className="flex gap-3 items-center flex-wrap px-5 py-3">
               <div className="relative flex-1 min-w-48">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                     <SearchIcon />
                  </span>
                  <input
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     placeholder="Search dealer name or code…"
                     className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-white text-slate-800 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 placeholder-slate-400"
                  />
               </div>
               <span className="text-sm text-slate-400 whitespace-nowrap font-medium">
                  {sorted.length} dealers
               </span>
               <button
                  onClick={() => fetchSummary({ financialYear })}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-500
                     hover:bg-slate-50 hover:text-slate-700 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
               >
                  <RefreshIcon /> Refresh
               </button>
            </div>
            <ErrorBanner msg={error} />
         </div>

         {/* ══ SCROLLABLE BODY ═══════════════════════════════════════════════ */}
         <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
            {loading ? (
               <Spinner />
            ) : (
               <table className="w-full border-collapse text-sm">
                  <thead>
                     <tr>
                        <Th col="dealerName"      label="Dealer Name"  sort={sort} onSort={toggleSort} />
                        <Th col="farmerDealerCode" label="Dealer Code" sort={sort} onSort={toggleSort} />
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest bg-slate-50 border-b-2 border-slate-200 text-center text-slate-400">
                           Action
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {sorted.length === 0 ? (
                        <tr>
                           <td colSpan={3} className="px-4 py-12 text-center text-slate-400 text-sm">
                              No dealers found
                           </td>
                        </tr>
                     ) : (
                        sorted.map((d, i) => (
                           <tr
                              key={d.farmerDealerCode}
                              className={`border-b border-slate-100 hover:bg-green-50/60 transition-colors ${
                                 i % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                              }`}
                           >
                              <td className="px-4 py-3 font-semibold text-slate-800">{d.dealerName}</td>
                              <td className="px-4 py-3 font-mono text-slate-500 text-xs tracking-wider">{d.farmerDealerCode}</td>
                              <td className="px-4 py-3 text-center">
                                 <button
                                    onClick={() => onViewDealer(d)}
                                    className="px-4 py-1.5 border border-green-600 text-green-700 text-xs font-bold hover:bg-green-600 hover:text-white transition-colors cursor-pointer"
                                 >
                                    View →
                                 </button>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            )}
         </div>
      </div>
   );
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 2 — Dealer Detail
// ════════════════════════════════════════════════════════════════════════════
const fmt = (n) =>
   n == null ? "—" : Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });

function StatCard({ label, value, accentClass }) {
   return (
      <div className={`bg-white border border-slate-200 border-l-4 ${accentClass} px-5 py-4`}>
         <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</div>
         <div className="text-xl font-bold text-slate-800 font-mono">{value}</div>
      </div>
   );
}
function Row({ label, value, highlight }) {
   return (
      <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
         <span className="text-sm text-slate-500">{label}</span>
         <span className={`text-sm font-mono ${highlight ? "font-bold text-green-700" : "font-medium text-slate-700"}`}>
            {value}
         </span>
      </div>
   );
}

function DetailTab({ financialYear, initialDealer, onBack }) {
   const { fetchDealerDetail } = useDealerMaster();
   const [selectedCode,     setSelectedCode]     = useState(initialDealer?.farmerDealerCode || "");
   const [detail,           setDetail]           = useState(null);
   const [loading,          setLoading]          = useState(false);
   const [error,            setError]            = useState(null);
   const [showClosingModal, setShowClosingModal] = useState(false); // ← NEW
   const dealersStore = useSelector(selectDealers);

   const openingBalance           = Number(detail?.openingBalance || 0);
   const totalDues                = Number(detail?.sideA?.total   || 0);
   const receipts                 = Number(detail?.sideB?.total   || 0);
   const balanceBeforeAdjustments = openingBalance + totalDues - receipts;

   function getDealerNameByCode(farmerDealerCode) {
      const dealer = dealersStore?.find((item) => item.farmerDealerCode === farmerDealerCode);
      return dealer ? dealer.dealerName || dealer.name : null;
   }

   const load = useCallback(async (code) => {
      if (!code || !financialYear) return;
      setLoading(true); setError(null); setDetail(null);
      try {
         const data = await fetchDealerDetail({ farmerDealerCode: code, financialYear });
         setDetail(data);
      } catch (e) {
         setError(e.message);
      } finally {
         setLoading(false);
      }
   }, [financialYear]);

   useEffect(() => { load(selectedCode); }, [selectedCode, financialYear]);

   function handleDealerChange(dealerName, farmerDealerCode) {
      setSelectedCode(farmerDealerCode);
   }

   const pdfData = detail
      ? { ...detail, dealerName: getDealerNameByCode(detail.farmerDealerCode) || detail.farmerDealerCode }
      : null;

   return (
      <div className="flex flex-col h-full overflow-hidden">

         {/* ══ FIXED HEADER ══════════════════════════════════════════════════ */}
         <div className="flex-none bg-white border-b-2 border-slate-200 shadow-sm z-10">
            <div className="flex gap-3 items-center flex-wrap px-5 py-3">
               {onBack && (
                  <button
                     onClick={onBack}
                     className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white
                        text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors cursor-pointer shrink-0"
                  >
                     <BackIcon /> Back
                  </button>
               )}
               <div className="flex-1 min-w-0">
                  <DealerSelect value={selectedCode} onChange={handleDealerChange} placeholder="Select dealer" />
               </div>

               {/* ── Save Closing Balance button → opens modal ── */}
               {detail && !loading && (
                  <button
                     onClick={() => setShowClosingModal(true)}
                     className="flex items-center gap-2 px-4 py-2 border border-green-600 bg-green-600
                        text-white text-sm font-bold hover:bg-green-700
                        transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                     Save Closing Balance
                  </button>
               )}

               <Pdf
                  model="hisab-detail"
                  fileName={`hisab-${selectedCode || "dealer"}`}
                  label="PDF"
                  data={pdfData}
                  financialYear={financialYear}
                  disabled={!detail || loading}
               />
            </div>
            <ErrorBanner msg={error} />
         </div>

         {/* ══ SCROLLABLE BODY ═══════════════════════════════════════════════ */}
         <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0 px-5 py-6">

            {loading && <Spinner />}

            {!loading && !detail && !error && (
               <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400 py-24">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 opacity-30">
                     <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                     <circle cx="9" cy="7" r="4" />
                     <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <p className="text-sm">Select a dealer above to view their full hisab</p>
               </div>
            )}

            {!loading && detail && (
               <div className="flex flex-col gap-6 w-full">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">

                     {/* Dealer Info */}
                     <div className="bg-white border border-slate-200 p-5">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-green-700 mb-4">Dealer Info</h3>
                        <Row label="Name"           value={getDealerNameByCode(detail.farmerDealerCode) || "—"} />
                        <Row label="Code"           value={detail.farmerDealerCode || "—"} />
                        <Row label="Location"       value={detail.dealerLocation || "Mungipa Irrigech Pvt. Ltd"} />
                        <Row label="Financial Year" value={detail.financialYear || financialYear} />
                     </div>

                     {/* A - Opening Balance */}
                     <div className="bg-white border border-slate-200 p-5">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-violet-600 mb-4">A — Opening Balance</h3>
                        <Row label="Previous Year Balance" value={fmtINR(detail.openingBalance)} highlight />
                     </div>

                     {/* B - Total Dues */}
                     <div className="bg-white border border-slate-200 p-5">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-red-600 mb-4">B — Total Dues</h3>
                        <Row label="Inventory Cost"    value={fmtINR(detail.sideA?.inventoryCost)} />
                        <Row label="GST on Billing"    value={fmtINR(detail.sideA?.gstOnBilling)} />
                        <Row label="Cash for Expenses" value={fmtINR(detail.sideA?.cashForExpenses)} />
                        <Row label="Excess Expense"    value={fmtINR(detail.sideA?.excessExpense)} />
                        <Row label="Total"             value={fmtINR(detail.sideA?.total)} highlight />
                     </div>

                     {/* C - Receipts */}
                     <div className="bg-white border border-slate-200 p-5">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-4">C — Receipts</h3>
                        <Row label="Farmer Share Received" value={fmtINR(detail.sideB?.farmerShareReceived)} />
                        <Row label="FS Adjusted"           value={fmtINR(detail.sideB?.fsAdjusted)} />
                        <Row label="Subsidy Received"      value={fmtINR(detail.sideB?.subsidyReceived)} />
                        <Row label="Incentives"            value={fmtINR(detail.sideB?.incentives)} />
                        <Row label="Total"                 value={fmtINR(detail.sideB?.total)} highlight />
                     </div>

                     {/* D - Net Balance */}
                     <div className="bg-white border border-slate-200 p-5">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-4">Net Balance</h3>
                        <Row label="Balance [(A+B)-C]" value={fmtINR(balanceBeforeAdjustments)} />
                        <Row label="Outstanding FS"    value={fmtINR(detail?.outstandingFs)} />
                        <Row label="TDS Paid"          value={fmtINR(detail?.tdsPaid)} />
                        <Row label="Cash Paid"         value={fmtINR(detail?.cashPaid)} />
                        <Row label="Net Balance"       value={fmtINR(detail?.netBalance ?? 0)} highlight />
                     </div>
                  </div>

                  {/* Excess Breakdown */}
                  <div className="bg-white border-2 border-green-600 p-5 w-full">
                     <h3 className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-4">
                        Excess Expense Breakdown
                     </h3>
                     <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-xs">
                           <thead>
                              <tr className="bg-slate-50 border-b-2 border-slate-200 text-slate-400 uppercase tracking-widest font-bold">
                                 {[
                                    ["Material",      "left"],
                                    ["Dispatch",      "right"],
                                    ["Billed Qty",    "right"],
                                    ["Difference",    "right"],
                                    ["Rate",          "right"],
                                    ["Amount",        "right"],
                                    ["Cash for Exp.", "right"],
                                    ["GST",           "right"],
                                    ["Extra Subsidy", "right"],
                                    ["1/3 Share",     "right"],
                                 ].map(([label, align]) => (
                                    <th key={label} className={`px-3 py-2.5 text-${align} whitespace-nowrap`}>
                                       {label}
                                    </th>
                                 ))}
                              </tr>
                           </thead>
                           <tbody>
                              {detail.excessBreakdown?.map((item, idx) => (
                                 <tr
                                    key={idx}
                                    className={`border-b border-slate-100 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}
                                 >
                                    <td className="px-3 py-2 font-semibold text-slate-700">{item.label}</td>
                                    <td className="px-3 py-2 text-right font-mono">{fmt(item.dispatchQty)}</td>
                                    <td className="px-3 py-2 text-right font-mono">{fmt(item.billedQty)}</td>
                                    <td className={`px-3 py-2 text-right font-mono font-bold ${
                                       item.diff > 0 ? "text-green-600" : item.diff < 0 ? "text-red-500" : "text-slate-600"
                                    }`}>
                                       {fmt(item.diff)}
                                    </td>
                                    <td className="px-3 py-2 text-right font-mono">{fmtINR(item.rate)}</td>
                                    <td className="px-3 py-2 text-right font-mono">{fmtINR(item.amount)}</td>
                                    <td className="px-3 py-2 text-right font-mono">{fmtINR(item.cashForExp)}</td>
                                    <td className="px-3 py-2 text-right font-mono">{fmtINR(item.gst)}</td>
                                    <td className="px-3 py-2 text-right font-mono">{fmtINR(item.extraSubsidy)}</td>
                                    <td className={`px-3 py-2 text-right font-mono font-bold ${
                                       item.oneThirdShare > 0 ? "text-green-600" : "text-red-500"
                                    }`}>
                                       {fmtINR(item.oneThirdShare)}
                                    </td>
                                 </tr>
                              ))}
                              {detail.excessBreakdown?.length > 0 && (() => {
                                 const tAmount = detail.excessBreakdown.reduce((s, r) => s + (r.amount        || 0), 0);
                                 const tCash   = detail.excessBreakdown.reduce((s, r) => s + (r.cashForExp    || 0), 0);
                                 const tGst    = detail.excessBreakdown.reduce((s, r) => s + (r.gst           || 0), 0);
                                 const tExtra  = detail.excessBreakdown.reduce((s, r) => s + (r.extraSubsidy  || 0), 0);
                                 const tShare  = detail.excessBreakdown.reduce((s, r) => s + (r.oneThirdShare || 0), 0);
                                 return (
                                    <tr className="bg-green-50 border-t-2 border-green-600 font-bold">
                                       <td className="px-3 py-2.5 text-green-700 font-bold" colSpan={5}>TOTAL</td>
                                       <td className="px-3 py-2.5 text-right font-mono">{fmtINR(tAmount)}</td>
                                       <td className="px-3 py-2.5 text-right font-mono">{fmtINR(tCash)}</td>
                                       <td className="px-3 py-2.5 text-right font-mono">{fmtINR(tGst)}</td>
                                       <td className="px-3 py-2.5 text-right font-mono">{fmtINR(tExtra)}</td>
                                       <td className={`px-3 py-2.5 text-right font-mono font-bold ${
                                          tShare > 0 ? "text-green-700" : "text-red-600"
                                       }`}>
                                          {fmtINR(tShare)}
                                       </td>
                                    </tr>
                                 );
                              })()}
                           </tbody>
                        </table>
                     </div>
                  </div>

                  {/* Final Balance */}
                  <div className="bg-white border-2 border-green-600 p-5 w-full">
                     <h3 className="text-xs font-bold uppercase tracking-widest text-green-700 mb-4">Final Balance</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                        {detail.sideB?.incentives != null && (
                           <StatCard label="Incentive"   value={fmtINR(detail.sideB?.incentives)} accentClass="border-l-violet-500" />
                        )}
                        {detail.cashPaid != null && (
                           <StatCard label="Cash Paid"   value={fmtINR(detail.cashPaid)}          accentClass="border-l-violet-500" />
                        )}
                        <StatCard label="Net Balance"    value={fmtINR(detail?.netBalance ?? 0)}  accentClass="border-l-green-600" />
                     </div>
                  </div>

               </div>
            )}
         </div>

         {/* ── Closing Balance Modal ── */}
         {showClosingModal && detail && (
            <ClosingBalanceModal
               detail={detail}
               financialYear={financialYear}
               dealerName={getDealerNameByCode(detail.farmerDealerCode)}
               onClose={() => setShowClosingModal(false)}
               onSaved={() => setShowClosingModal(false)}
            />
         )}
      </div>
   );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════════════════════
export default function HisabPage() {
   const [financialYears, setFinancialYears] = useState([]);
   const [selectedYear,   setSelectedYear]   = useState("");
   const [activeTab,      setActiveTab]      = useState(0);
   const [detailDealer,   setDetailDealer]   = useState(null);
   const [initLoading,    setInitLoading]    = useState(true);
   const [initError,      setInitError]      = useState(null);

   const pageTabs = ["Summary", "Detail"];

   useEffect(() => {
      (async () => {
         try {
            const years = await fetchJson("/hisab/financial-years");
            setFinancialYears(Array.isArray(years) ? years : []);
            if (years?.length) {
               const last = years[years.length - 1];
               setSelectedYear(last?.label || last?.year || last);
            }
         } catch (e) {
            setInitError(e.message);
         } finally {
            setInitLoading(false);
         }
      })();
   }, []);

   const handleViewDealer = (dealer) => {
      setDetailDealer(dealer);
      setActiveTab(1);
   };

   return (
      <div className="flex flex-col h-full overflow-hidden font-sans bg-slate-50">
         <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
            body { font-family: 'Sora', sans-serif; }
         `}</style>

         {/* ── Page Header ─────────────────────────────────────────────────── */}
         <div className="flex-none bg-white border-b border-slate-200 px-7 py-4 flex items-center justify-between flex-wrap gap-3">
            <div>
               <div className="text-xl font-bold text-slate-800 tracking-tight">🌿 HisabDesk</div>
               <div className="text-xs text-slate-400 mt-0.5">Dealer Hisab Management</div>
            </div>
            <div className="flex items-center gap-3">
               <label className="text-sm text-slate-500 font-medium">Financial Year</label>
               <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 border border-slate-200 bg-white text-slate-700 text-sm font-semibold outline-none focus:border-green-500 cursor-pointer"
               >
                  {financialYears.length === 0 && <option>Loading…</option>}
                  {financialYears.map((y) => {
                     const val = y?.label || y?.year || y;
                     return <option key={y?._id || val} value={val}>{val}</option>;
                  })}
               </select>
            </div>
         </div>

         {/* ── Body ────────────────────────────────────────────────────────── */}
         <div className="flex-1 flex flex-col overflow-hidden px-6 pt-5 min-h-0">
            {initLoading && <Spinner />}
            {initError   && <ErrorBanner msg={initError} />}

            {!initLoading && !initError && (
               <div className="flex flex-col flex-1 overflow-hidden min-h-0">

                  {/* Tabs */}
                  <div className="flex-none flex gap-1 border-b-2 border-slate-200 mb-0">
                     {pageTabs.map((t, i) => (
                        <button
                           key={t}
                           onClick={() => setActiveTab(i)}
                           className={`px-6 py-2.5 text-sm font-semibold border-b-2 -mb-0.5 transition-colors cursor-pointer ${
                              activeTab === i
                                 ? "text-green-700 border-green-600"
                                 : "text-slate-400 border-transparent hover:text-slate-600"
                           }`}
                        >
                           {t}
                        </button>
                     ))}
                  </div>

                  {/* Tab content */}
                  <div className="flex-1 overflow-hidden min-h-0 pt-4">
                     {activeTab === 0 && (
                        <SummaryTab financialYear={selectedYear} onViewDealer={handleViewDealer} />
                     )}
                     {activeTab === 1 && (
                        <DetailTab
                           financialYear={selectedYear}
                           initialDealer={detailDealer}
                           onBack={() => { setActiveTab(0); setDetailDealer(null); }}
                        />
                     )}
                  </div>

               </div>
            )}
         </div>
      </div>
   );
}