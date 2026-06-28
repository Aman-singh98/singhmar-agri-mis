import { useMemo, useState } from "react";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";
import { TbReportMoney } from "react-icons/tb";
import Pdf from "../../components/Pdf";
import Excel from "../../components/Excel";

// ─── MI classification (kept identical to FileRecord.jsx so counts always agree) ──
const VALID_MI_REGEX = /^MI\d+$/i;
function classifyMI(miNumber) {
  const val = String(miNumber ?? "").trim();
  if (!val)                     return "withoutMI";
  if (VALID_MI_REGEX.test(val)) return "withMI";
  return "other";
}

// Irrigation type buckets shown as their own columns.
// Matching is case-insensitive "contains", so "Drip Irrigation" still matches "Drip".
const IRRIGATION_BUCKETS = [
  { key: "miniSprinkler",    label: "Mini Sprinkler",    match: "mini"     },
  { key: "dripIrrigation",   label: "Drip Irrigation",   match: "drip"     },
  { key: "portableSprinkler",label: "Portable Sprinkler",match: "portable" },
];

function toNumber(v) {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

// ─── Build one summary row per dealer from raw file records ───────────────────
function buildDealerSummary(records) {
  const map = new Map(); // dealerName -> accumulator

  records.forEach(r => {
    const dealerName = String(r.dealerName ?? "").trim();
    if (!dealerName) return;

    if (!map.has(dealerName)) {
      map.set(dealerName, {
        dealerName,
        dealerCode: String(r.farmerDealerCode ?? "").trim(),
        totalFiles: 0,
        irrigationAcre: { miniSprinkler: 0, dripIrrigation: 0, portableSprinkler: 0 },
        miSubmit: 0,
        cancelAdjusted: 0,
        onlinePending: 0,
      });
    }

    const row = map.get(dealerName);

    // First non-empty code wins; keeps a stable code even if later rows are blank
    if (!row.dealerCode) {
      const code = String(r.farmerDealerCode ?? "").trim();
      if (code) row.dealerCode = code;
    }

    row.totalFiles += 1;

    const miClass = classifyMI(r.miNumber);
    if (miClass === "withMI")    row.miSubmit += 1;
    if (miClass === "other")     row.cancelAdjusted += 1;
    if (miClass === "withoutMI") row.onlinePending += 1;

    // ✅ Acre is only counted for files that actually have a valid MI number.
    // "Other" (junk/invalid MI text) and blank-MI files are excluded entirely
    // from the irrigation acre sums (and therefore from Total Acre too).
    if (miClass === "withMI") {
      const irrigation = String(r.irrigationType ?? "").toLowerCase();
      const acre = toNumber(r.areaInAcre);
      IRRIGATION_BUCKETS.forEach(bucket => {
        if (irrigation.includes(bucket.match)) {
          row.irrigationAcre[bucket.key] += acre;
        }
      });
    }
  });

  return [...map.values()]
    .map(row => {
      const totalAcre =
        row.irrigationAcre.miniSprinkler +
        row.irrigationAcre.dripIrrigation +
        row.irrigationAcre.portableSprinkler;
      const pct = row.totalFiles > 0 ? (row.miSubmit / row.totalFiles) * 100 : 0;
      return { ...row, totalAcre, pct };
    })
    .sort((a, b) => b.totalFiles - a.totalFiles);
}

function fmtAcre(n) {
  if (!n) return "0";
  // trim to at most 2 decimals, no trailing zeros
  return Number(n.toFixed(2)).toString();
}

// ─── Export helper — flattens summary rows into plain columns for Excel/PDF ──
function summaryRowsToExportRecords(rows) {
  return rows.map((r, i) => ({
    "Sr No":              i + 1,
    "Dealer Name":        r.dealerName,
    "Dealer Code":        r.dealerCode || "",
    "No. of File":        r.totalFiles,
    "Mini Sprinkler":     fmtAcre(r.irrigationAcre.miniSprinkler),
    "Drip Irrigation":    fmtAcre(r.irrigationAcre.dripIrrigation),
    "Portable Sprinkler": fmtAcre(r.irrigationAcre.portableSprinkler),
    "MI Submit":          r.miSubmit,
    "%":                  `${Math.round(r.pct)}%`,
    "Cancel/Adjusted":    r.cancelAdjusted,
    "Online Pending":     r.onlinePending,
    "Total Acre":         fmtAcre(r.totalAcre),
  }));
}

function PctBar({ pct }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <div className="flex-1 h-3.5 bg-slate-100 border border-slate-200 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-fuchsia-300 to-fuchsia-600"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-[11px] font-bold text-fuchsia-700 font-mono w-10 text-right">
        {Math.round(pct)}%
      </span>
    </div>
  );
}

function DealerMainSummary({ records = [], loading }) {
  const [search, setSearch] = useState("");

  const summaryRows = useMemo(() => buildDealerSummary(records), [records]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return summaryRows;
    return summaryRows.filter(
      r =>
        r.dealerName.toLowerCase().includes(q) ||
        r.dealerCode.toLowerCase().includes(q)
    );
  }, [summaryRows, search]);

  // ─── Grand totals row ─────────────────────────────────────────────────────
  const totals = useMemo(() => {
    return filteredRows.reduce(
      (acc, r) => ({
        totalFiles:     acc.totalFiles + r.totalFiles,
        miniSprinkler:  acc.miniSprinkler + r.irrigationAcre.miniSprinkler,
        dripIrrigation: acc.dripIrrigation + r.irrigationAcre.dripIrrigation,
        portableSprinkler: acc.portableSprinkler + r.irrigationAcre.portableSprinkler,
        miSubmit:       acc.miSubmit + r.miSubmit,
        cancelAdjusted: acc.cancelAdjusted + r.cancelAdjusted,
        onlinePending:  acc.onlinePending + r.onlinePending,
        totalAcre:      acc.totalAcre + r.totalAcre,
      }),
      {
        totalFiles: 0, miniSprinkler: 0, dripIrrigation: 0, portableSprinkler: 0,
        miSubmit: 0, cancelAdjusted: 0, onlinePending: 0, totalAcre: 0,
      }
    );
  }, [filteredRows]);

  const totalsPct = totals.totalFiles > 0 ? (totals.miSubmit / totals.totalFiles) * 100 : 0;

  // ─── Export ───────────────────────────────────────────────────────────────
  const exportTitle = ["Dealer_Summary", search ? `Search-${search.trim().replace(/\s+/g, "_")}` : ""]
    .filter(Boolean)
    .join("_");

  const exportRecords = useMemo(() => summaryRowsToExportRecords(filteredRows), [filteredRows]);
  const exportData = {
    title: exportTitle.replace(/_/g, " "),
    records: exportRecords,
    search: search || undefined,
  };

  if (loading) {
    return (
      <div className="w-full bg-white border border-slate-200">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200 bg-[#0f172a]">
          <TbReportMoney className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Dealer Summary</span>
        </div>
        <div className="py-16 text-center text-xs text-slate-400 tracking-wide uppercase">
          Loading records…
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col border border-slate-200 bg-white">

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-[#1e293b] gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <TbReportMoney className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Dealer Summary</span>
          <span className="text-[10px] font-mono text-slate-600 bg-[#1e293b] border border-[#334155] px-1.5 py-0.5">
            {summaryRows.length} dealers
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <HiOutlineSearch className="absolute left-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search dealer…"
              className="pl-8 pr-7 h-7 text-xs bg-[#1e293b] text-slate-200 border border-[#334155]
                placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 transition"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 text-slate-500 hover:text-slate-300">
                <HiOutlineX className="w-3 h-3" />
              </button>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-[#1e293b] border border-[#334155] px-2 py-1">
            {filteredRows.length} rows
          </span>

          {/* Export — Excel + PDF */}
          {!loading && filteredRows.length > 0 && (
            <div className="flex items-center gap-1 border-l border-[#334155] pl-2">
              <Excel
                model="dealer-mainfile-summary-records"
                fileName={exportTitle}
                label="Excel"
                data={exportData}
                variant="compact"
              />
              <Pdf
                model="dealer-mainfile-summary-records"
                fileName={exportTitle}
                label="PDF"
                data={exportData}
                variant="compact"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Empty state ── */}
      {filteredRows.length === 0 ? (
        <div className="py-20 text-center text-xs text-slate-400 uppercase tracking-widest">
          No dealers found
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-xs border-collapse" style={{ minWidth: "1280px" }}>
            <thead>
              {/* Group header row, mirrors the "Acer" merged-cell band in the spec image */}
              <tr className="bg-amber-200 border-b border-amber-300">
                <th colSpan={4} className="border-r border-amber-300" />
                <th colSpan={3} className="px-2.5 py-1.5 text-center text-[11px] font-bold uppercase tracking-wider text-slate-800 border-r border-amber-300">
                  Irrigation Type (Acre)
                </th>
                <th colSpan={5} className="border-r border-amber-300" />
              </tr>
              <tr className="bg-amber-50 border-b border-amber-200">
                <th className="px-2.5 py-2 text-left border-r border-amber-200 w-10 text-[10px] font-bold uppercase tracking-wider text-slate-600">Sr.</th>
                <th className="px-2.5 py-2 text-left border-r border-amber-200 text-[10px] font-bold uppercase tracking-wider text-slate-600">Dealer Name</th>
                <th className="px-2.5 py-2 text-left border-r border-amber-200 text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50">Dealer Code</th>
                <th className="px-2.5 py-2 text-right border-r border-amber-200 text-[10px] font-bold uppercase tracking-wider text-slate-600">No. of File</th>
                {IRRIGATION_BUCKETS.map(b => (
                  <th key={b.key} className="px-2.5 py-2 text-right border-r border-amber-200 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {b.label}
                  </th>
                ))}
                <th className="px-2.5 py-2 text-right border-r border-amber-200 text-[10px] font-bold uppercase tracking-wider text-slate-600">MI Submit</th>
                <th className="px-2.5 py-2 text-left border-r border-amber-200 text-[10px] font-bold uppercase tracking-wider text-slate-600 min-w-[130px]">%</th>
                <th className="px-2.5 py-2 text-right border-r border-amber-200 text-[10px] font-bold uppercase tracking-wider text-slate-600">Cancel/Adjusted</th>
                <th className="px-2.5 py-2 text-right border-r border-amber-200 text-[10px] font-bold uppercase tracking-wider text-slate-600">Online Pending</th>
                <th className="px-2.5 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-600">Total Acre</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, i) => (
                <tr
                  key={row.dealerName}
                  className={`border-b border-slate-100 hover:bg-emerald-50 transition-colors
                    ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}
                >
                  <td className="px-2.5 py-1.5 text-slate-500 border-r border-slate-100">{i + 1}</td>
                  <td className="px-2.5 py-1.5 font-semibold text-slate-700 border-r border-slate-100 whitespace-nowrap">{row.dealerName}</td>
                  <td className="px-2.5 py-1.5 text-rose-700 font-mono border-r border-slate-100 whitespace-nowrap">
                    {row.dealerCode || <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-2.5 py-1.5 text-right font-mono text-slate-700 border-r border-slate-100">{row.totalFiles}</td>
                  {IRRIGATION_BUCKETS.map(b => (
                    <td key={b.key} className="px-2.5 py-1.5 text-right font-mono text-slate-600 border-r border-slate-100">
                      {fmtAcre(row.irrigationAcre[b.key])}
                    </td>
                  ))}
                  <td className="px-2.5 py-1.5 text-right font-mono font-semibold text-fuchsia-700 border-r border-slate-100">
                    {row.miSubmit}
                  </td>
                  <td className="px-2.5 py-1.5 border-r border-slate-100">
                    <PctBar pct={row.pct} />
                  </td>
                  <td className="px-2.5 py-1.5 text-right font-mono text-rose-600 border-r border-slate-100">
                    {row.cancelAdjusted}
                  </td>
                  <td className="px-2.5 py-1.5 text-right font-mono text-amber-700 border-r border-slate-100">
                    {row.onlinePending}
                  </td>
                  <td className="px-2.5 py-1.5 text-right font-mono font-semibold text-slate-700">
                    {fmtAcre(row.totalAcre)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#0f172a] text-white font-bold border-t-2 border-[#0f172a]">
                <td className="px-2.5 py-2 border-r border-[#1e293b]" colSpan={2}>Total</td>
                <td className="px-2.5 py-2 border-r border-[#1e293b]"></td>
                <td className="px-2.5 py-2 text-right font-mono border-r border-[#1e293b]">{totals.totalFiles}</td>
                <td className="px-2.5 py-2 text-right font-mono border-r border-[#1e293b]">{fmtAcre(totals.miniSprinkler)}</td>
                <td className="px-2.5 py-2 text-right font-mono border-r border-[#1e293b]">{fmtAcre(totals.dripIrrigation)}</td>
                <td className="px-2.5 py-2 text-right font-mono border-r border-[#1e293b]">{fmtAcre(totals.portableSprinkler)}</td>
                <td className="px-2.5 py-2 text-right font-mono text-fuchsia-300 border-r border-[#1e293b]">{totals.miSubmit}</td>
                <td className="px-2.5 py-2 border-r border-[#1e293b]">
                  <span className="text-[11px] font-mono">{Math.round(totalsPct)}%</span>
                </td>
                <td className="px-2.5 py-2 text-right font-mono text-rose-300 border-r border-[#1e293b]">{totals.cancelAdjusted}</td>
                <td className="px-2.5 py-2 text-right font-mono text-amber-300 border-r border-[#1e293b]">{totals.onlinePending}</td>
                <td className="px-2.5 py-2 text-right font-mono">{fmtAcre(totals.totalAcre)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

export default DealerMainSummary;