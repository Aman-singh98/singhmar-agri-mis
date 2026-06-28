/**
 * FarmersTab.jsx — fully self-contained standalone component
 * Fully responsive: card layout on mobile, full table on desktop.
 * Table body scrolls only — filter bar + table header always fixed.
 * Tailwind CSS only — zero inline styles.
 */

import { useState, useEffect, useCallback } from "react";
import api from "../../../api/axios";

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

// ─── Icons ────────────────────────────────────────────────────────────────────
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
const WarnIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const CalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 shrink-0">
    <rect x="3" y="4" width="18" height="18" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 opacity-30">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

function Spinner() {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
      <div className="w-5 h-5 border-[3px] border-slate-200 border-t-green-600 rounded-full animate-spin" />
      <span className="text-sm">Loading…</span>
    </div>
  );
}

function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-800 text-sm">
      <WarnIcon /> <span>{msg}</span>
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
      className={`px-3 py-3 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap
        cursor-pointer select-none bg-slate-50 border-b-2 border-slate-200
        ${alignClass} ${active ? "text-green-700" : "text-slate-400"}`}
    >
      {label}{active ? (sort.dir === "asc" ? " ↑" : " ↓") : ""}
    </th>
  );
}

// ─── Mobile card for a single farmer ─────────────────────────────────────────
function FarmerCard({ f, i }) {
  const diff = f.difference || 0;
  const diffClass = diff < 0
    ? "text-red-500 font-bold"
    : diff > 0 ? "text-amber-500 font-bold" : "text-slate-400";

  const sl = f.onlineFarmerShareStatus?.toLowerCase() || "";
  const statusClass = sl.includes("done")
    ? "bg-green-100 text-green-700 border-green-200"
    : sl.includes("pending")
    ? "bg-amber-100 text-amber-700 border-amber-200"
    : "bg-slate-100 text-slate-500 border-slate-200";

  const typeClass = f.type === "Mini Sprinkler"
    ? "bg-blue-50 text-blue-700 border-blue-200"
    : "bg-orange-50 text-orange-700 border-orange-200";

  return (
    <div className={`mx-3 my-2 border border-slate-200 rounded-lg overflow-hidden shadow-sm ${
      i % 2 === 0 ? "bg-white" : "bg-slate-50/80"
    }`}>

      {/* ── Header strip ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-slate-400 text-[10px] font-bold font-mono shrink-0">S.No {f.srNo ?? i + 1}</span>
          <div className="min-w-0">
            <p className="font-bold text-slate-800 text-sm leading-tight truncate">{f.name || "—"}</p>
            <p className="font-mono text-green-700 text-[11px] font-semibold">{f.miNumber || "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 flex-wrap justify-end">
          {f.type && (
            <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-full whitespace-nowrap ${typeClass}`}>
              {f.type}
            </span>
          )}
          {f.onlineFarmerShareStatus && (
            <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-full whitespace-nowrap ${statusClass}`}>
              {f.onlineFarmerShareStatus}
            </span>
          )}
        </div>
      </div>

      {/* ── Data grid — 3 columns, compact ───────────────────────────── */}
      <div className="grid grid-cols-3 divide-x divide-slate-100">

        <div className="px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Area</p>
          <p className="font-mono text-slate-700 text-xs font-semibold">{f.areaInAcre ?? "—"} <span className="text-slate-400 font-normal">ac</span></p>
        </div>

        <div className="px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Farmer Share</p>
          <p className="font-mono text-slate-700 text-xs font-semibold">{fmtINR(f.farmerShare)}</p>
        </div>

        <div className="px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">FS Deposit</p>
          <p className="font-mono text-slate-700 text-xs font-semibold">{fmtINR(f.farmerShareDeposit)}</p>
        </div>

        <div className="px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Return FS</p>
          <p className="font-mono text-slate-700 text-xs font-semibold">{fmtINR(f.returnFarmerShare)}</p>
        </div>

        <div className="px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Difference</p>
          <p className={`font-mono text-xs font-semibold ${diffClass}`}>{fmtINR(f.difference)}</p>
        </div>

        <div className="px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Deposit Date</p>
          <p className="font-mono text-slate-500 text-xs">
            {f.depositDate ? new Date(f.depositDate).toLocaleDateString("en-IN") : "—"}
          </p>
        </div>

      </div>
    </div>
  );
}

// ─── Mobile totals summary card ───────────────────────────────────────────────
function TotalsSummaryCard({ totals }) {
  return (
    <div className="mx-3 my-2 mb-4 border-2 border-violet-300 rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-3 py-2 bg-violet-600">
        <p className="text-[10px] font-bold uppercase tracking-widest text-violet-100">Totals</p>
      </div>
      {/* Grid */}
      <div className="grid grid-cols-3 divide-x divide-violet-100 bg-violet-50">
        <div className="px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-violet-400 mb-0.5">Area</p>
          <p className="font-mono text-violet-800 text-xs font-bold">{totals.area.toFixed(2)} <span className="font-normal text-violet-400">ac</span></p>
        </div>
        <div className="px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-violet-400 mb-0.5">Farmer Share</p>
          <p className="font-mono text-violet-800 text-xs font-bold">{fmtINR(totals.farmerShare)}</p>
        </div>
        <div className="px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-violet-400 mb-0.5">FS Deposit</p>
          <p className="font-mono text-violet-800 text-xs font-bold">{fmtINR(totals.deposit)}</p>
        </div>
        <div className="px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-violet-400 mb-0.5">Return FS</p>
          <p className="font-mono text-violet-800 text-xs font-bold">{fmtINR(totals.returnFs)}</p>
        </div>
        <div className="px-3 py-2 col-span-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-violet-400 mb-0.5">Difference</p>
          <p className={`font-mono text-sm font-bold ${totals.diff < 0 ? "text-red-600" : "text-green-700"}`}>
            {fmtINR(totals.diff)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function FarmersTab({
  financialYear: propYear,
  dealers: propDealers,
}) {
  const isControlled      = !!propYear;
  const [internalYears,    setInternalYears]    = useState([]);
  const [internalYear,     setInternalYear]     = useState("");
  const [internalDealers,  setInternalDealers]  = useState([]);
  const [bootstrapLoading, setBootstrapLoading] = useState(false);
  const [bootstrapError,   setBootstrapError]   = useState(null);

  const activeYear    = propYear    || internalYear;
  const activeDealers = propDealers || internalDealers;

  const [dealerCode, setDealerCode] = useState("");
  const [farmers,    setFarmers]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [search,     setSearch]     = useState("");
  const [sort,       setSort]       = useState({ col: null, dir: "asc" });

  useEffect(() => {
    if (isControlled) return;
    setBootstrapLoading(true);
    Promise.all([
      fetchJson("/hisab/financial-years"),
      fetchJson("/hisab/dealers"),
    ])
      .then(([years, dlrs]) => {
        const ys = Array.isArray(years) ? years : [];
        setInternalYears(ys);
        setInternalDealers(Array.isArray(dlrs) ? dlrs : []);
        if (ys.length) {
          const last = ys[ys.length - 1];
          setInternalYear(last?.label || last?.year || last);
        }
      })
      .catch((e) => setBootstrapError(e.message))
      .finally(() => setBootstrapLoading(false));
  }, [isControlled]);

  const loadFarmers = useCallback(async (code, fy) => {
    if (!code || !fy) { setFarmers([]); return; }
    setLoading(true); setError(null);
    try {
      const data = await fetchJson(
        `/hisab/dealer/${encodeURIComponent(code)}/farmers?financialYear=${fy}`
      );
      setFarmers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message); setFarmers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFarmers(dealerCode, activeYear); }, [dealerCode, activeYear]);
  useEffect(() => { setDealerCode(""); setFarmers([]); }, [activeYear]);

  const toggleSort = (col) =>
    setSort((s) => ({ col, dir: s.col === col && s.dir === "asc" ? "desc" : "asc" }));

  const filtered = farmers.filter(
    (f) =>
      !search ||
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.miNumber?.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = useSortedData(filtered, sort);

  const totals = sorted.reduce(
    (acc, f) => ({
      area:        acc.area        + (f.areaInAcre         || 0),
      farmerShare: acc.farmerShare + (f.farmerShare        || 0),
      deposit:     acc.deposit     + (f.farmerShareDeposit || 0),
      returnFs:    acc.returnFs    + (f.returnFarmerShare  || 0),
      diff:        acc.diff        + (f.difference         || 0),
    }),
    { area: 0, farmerShare: 0, deposit: 0, returnFs: 0, diff: 0 }
  );

  if (bootstrapLoading) return <Spinner />;

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ══ FIXED HEADER SECTION ════════════════════════════════════════════ */}
      <div className="flex-none bg-white border-b-2 border-slate-200 shadow-sm z-10">

        {/* Financial Year row — standalone only */}
        {!isControlled && (
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 border-b border-slate-100 bg-slate-50 flex-wrap">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
              <CalIcon /> Financial Year
            </span>
            <select
              value={internalYear}
              onChange={(e) => setInternalYear(e.target.value)}
              className="flex-1 sm:flex-none min-w-0 px-3 py-1.5 border border-slate-200 bg-white text-slate-800 text-sm font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 cursor-pointer rounded-sm"
            >
              {internalYears.length === 0 && <option>Loading…</option>}
              {internalYears.map((y) => {
                const val = y?.label || y?.year || y;
                return <option key={y?._id || val} value={val}>{val}</option>;
              })}
            </select>
          </div>
        )}

        {/* Dealer + Search + controls */}
        <div className="flex gap-2 sm:gap-3 flex-wrap items-center px-3 sm:px-5 py-2.5 sm:py-3">
          {isControlled && (
            <span className="flex items-center gap-1.5 px-3 py-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold whitespace-nowrap">
              <CalIcon /> {activeYear}
            </span>
          )}

          {/* Dealer select — full width on mobile */}
          <select
            value={dealerCode}
            onChange={(e) => setDealerCode(e.target.value)}
            className="w-full sm:w-auto sm:min-w-[220px] px-3 py-2 border-2 border-slate-200 bg-white text-slate-700 text-sm font-medium outline-none focus:border-green-500 cursor-pointer rounded-sm"
          >
            <option value="">— Select Dealer —</option>
            {activeDealers.map((d) => (
              <option key={d._id || d.farmerDealerCode} value={d.farmerDealerCode}>
                {d.dealerName || d.name} ({d.farmerDealerCode})
              </option>
            ))}
          </select>

          {/* Search + refresh row */}
          <div className="flex gap-2 w-full sm:flex-1 sm:min-w-[200px] items-center">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <SearchIcon />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or MI number…"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-white text-slate-800 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 placeholder-slate-400 rounded-sm"
              />
            </div>

            {/* Record count — hidden on very small screens */}
            <span className="hidden sm:block text-sm text-slate-400 whitespace-nowrap font-medium shrink-0">
              {sorted.length} records
            </span>

            <button
              onClick={() => loadFarmers(dealerCode, activeYear)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-slate-200 bg-white text-slate-500
                hover:bg-slate-50 hover:text-slate-700 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 rounded-sm"
            >
              <RefreshIcon />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Record count on mobile — full width row */}
          {sorted.length > 0 && (
            <span className="sm:hidden text-xs text-slate-400 font-medium w-full">
              {sorted.length} records found
            </span>
          )}
        </div>

        <ErrorBanner msg={bootstrapError || error} />
      </div>

      {/* ══ SCROLLABLE BODY ═════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">

        {/* Empty / loading states */}
        {!dealerCode && !loading && (
          <div className="flex flex-col items-center justify-center h-full py-20 gap-3 text-slate-400">
            <UsersIcon />
            <p className="text-sm text-center px-6">Select a dealer above to view their farmers</p>
          </div>
        )}

        {loading && <Spinner />}

        {!loading && dealerCode && (
          <>
            {/* ── MOBILE: Card layout (< md) ─────────────────────────────── */}
            <div className="md:hidden">
              {sorted.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  No farmer records found
                </div>
              ) : (
                <>
                  {sorted.map((f, i) => (
                    <FarmerCard key={i} f={f} i={i} />
                  ))}
                  {sorted.length > 0 && <TotalsSummaryCard totals={totals} />}
                </>
              )}
            </div>

            {/* ── DESKTOP: Table layout (≥ md) ───────────────────────────── */}
            <table className="hidden md:table w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200 sticky top-0 z-10">
                  <Th col="srNo"                    label="Sr."          sort={sort} onSort={toggleSort} align="center" />
                  <Th col="miNumber"                label="MI Number"    sort={sort} onSort={toggleSort} />
                  <Th col="name"                    label="Farmer Name"  sort={sort} onSort={toggleSort} />
                  <Th col="type"                    label="Type"         sort={sort} onSort={toggleSort} />
                  <Th col="areaInAcre"              label="Area (Ac)"    sort={sort} onSort={toggleSort} align="right" />
                  <Th col="farmerShare"             label="Farmer Share" sort={sort} onSort={toggleSort} align="right" />
                  <Th col="farmerShareDeposit"      label="FS Deposit"   sort={sort} onSort={toggleSort} align="right" />
                  <Th col="returnFarmerShare"       label="Return FS"    sort={sort} onSort={toggleSort} align="right" />
                  <Th col="difference"              label="Difference"   sort={sort} onSort={toggleSort} align="right" />
                  <Th col="onlineFarmerShareStatus" label="Status"       sort={sort} onSort={toggleSort} align="center" />
                  <Th col="depositDate"             label="Deposit Date" sort={sort} onSort={toggleSort} align="center" />
                </tr>
              </thead>

              <tbody>
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-12 text-center text-slate-400">
                      No farmer records found
                    </td>
                  </tr>
                ) : sorted.map((f, i) => {
                  const diff = f.difference || 0;
                  const diffClass = diff < 0
                    ? "text-red-500 font-bold"
                    : diff > 0 ? "text-amber-500 font-bold" : "text-slate-500";

                  const sl = f.onlineFarmerShareStatus?.toLowerCase() || "";
                  const statusClass = sl.includes("done")
                    ? "bg-green-100 text-green-700"
                    : sl.includes("pending")
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-500";

                  const typeClass = f.type === "Mini Sprinkler"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-800";

                  return (
                    <tr
                      key={i}
                      className={`border-b border-slate-100 hover:bg-green-50/60 transition-colors ${
                        i % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      }`}
                    >
                      <td className="px-3 py-2.5 text-center font-mono text-slate-400">{f.srNo ?? i + 1}</td>
                      <td className="px-3 py-2.5 font-mono font-semibold text-green-700">{f.miNumber || "—"}</td>
                      <td className="px-3 py-2.5 font-semibold text-slate-700">{f.name || "—"}</td>
                      <td className="px-3 py-2.5">
                        {f.type
                          ? <span className={`px-2 py-0.5 text-[10px] font-bold whitespace-nowrap ${typeClass}`}>{f.type}</span>
                          : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono">{f.areaInAcre ?? "—"}</td>
                      <td className="px-3 py-2.5 text-right font-mono">{fmtINR(f.farmerShare)}</td>
                      <td className="px-3 py-2.5 text-right font-mono">{fmtINR(f.farmerShareDeposit)}</td>
                      <td className="px-3 py-2.5 text-right font-mono">{fmtINR(f.returnFarmerShare)}</td>
                      <td className={`px-3 py-2.5 text-right font-mono ${diffClass}`}>{fmtINR(f.difference)}</td>
                      <td className="px-3 py-2.5 text-center">
                        {f.onlineFarmerShareStatus
                          ? <span className={`px-2 py-0.5 text-[10px] font-bold whitespace-nowrap ${statusClass}`}>{f.onlineFarmerShareStatus}</span>
                          : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono text-slate-400">
                        {f.depositDate ? new Date(f.depositDate).toLocaleDateString("en-IN") : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {sorted.length > 0 && (
                <tfoot>
                  <tr className="bg-violet-50 border-t-2 border-violet-400">
                    <td className="px-3 py-3 font-bold text-violet-700" colSpan={4}>TOTAL</td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-violet-700">{totals.area.toFixed(2)} ac</td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-violet-700">{fmtINR(totals.farmerShare)}</td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-violet-700">{fmtINR(totals.deposit)}</td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-violet-700">{fmtINR(totals.returnFs)}</td>
                    <td className={`px-3 py-3 text-right font-mono font-bold ${totals.diff < 0 ? "text-red-600" : "text-green-700"}`}>
                      {fmtINR(totals.diff)}
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              )}
            </table>
          </>
        )}
      </div>
    </div>
  );
}