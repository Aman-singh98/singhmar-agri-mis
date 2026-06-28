
import { useMemo, useState, useEffect } from "react";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { TbTable } from "react-icons/tb";
import SortableHeader from "../../components/SortableHeader";

const ROWS_PER_PAGE = 15;

const COLUMNS = [
  { key: "srNo",              label: "#",              width: "w-8" },
  { key: "scanNo",            label: "Scan No",        width: "w-16" },
  { key: "brandName",         label: "Brand",          width: "w-28" },
  { key: "name",              label: "Farmer",         width: "w-32" },
  { key: "fatherName",        label: "Father",         width: "w-28" },
  { key: "mobileNo",          label: "Mobile",         width: "w-24" },
  { key: "dealerName",        label: "Dealer",         width: "w-40" },
  { key: "farmerDealerCode",  label: "Code",           width: "w-20" },
  { key: "address",           label: "Address",        width: "w-24" },
  { key: "block",             label: "Block",          width: "w-20" },
  { key: "district",          label: "District",       width: "w-20" },
  { key: "irrigationType",    label: "Irrigation",     width: "w-28" },
  { key: "areaInAcre",        label: "Acre",           width: "w-14", numeric: true },
  { key: "familyId",          label: "Family ID",      width: "w-20" },
  { key: "farmerCode",        label: "Farmer Code",    width: "w-24" },
  { key: "miNumber",          label: "MI No.",         width: "w-24" },
  { key: "applicationStatus", label: "App Status",     width: "w-24" },
  { key: "onlineStatus",      label: "Online",         width: "w-20" },
  { key: "error",             label: "Error",          width: "w-20" },
  { key: "createdBy",         label: "Created By",     width: "w-24",
    render: (v) => v?.name ?? "—" },
];

const STATUS_MAP = {
  Verified: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Pending:  "bg-amber-100  text-amber-800  border-amber-300",
  Rejected: "bg-red-100    text-red-800    border-red-300",
  Online:   "bg-blue-100   text-blue-800   border-blue-300",
  Offline:  "bg-slate-100  text-slate-500  border-slate-300",
};

const RECORD_TYPE_LABEL = {
  all:  { label: "All Records",  color: "text-slate-400" },
  atal: { label: "Atal Records", color: "text-violet-400" },
  demo: { label: "Demo Records", color: "text-orange-400" },
};

function StatusPill({ value }) {
  if (!value) return <span className="text-slate-300 text-xs">—</span>;
  return (
    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider border px-1.5 py-px
      ${STATUS_MAP[value] ?? "bg-slate-100 text-slate-600 border-slate-300"}`}>
      {value}
    </span>
  );
}

function pageRange(current, total) {
  const delta = 1;
  const range = [];
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }
  const result = [1];
  if (range[0] > 2) result.push("…");
  result.push(...range);
  if (range[range.length - 1] < total - 1) result.push("…");
  if (total > 1) result.push(total);
  return result;
}

// ✅ rows — parent se pehle se type-filtered aata hai
// ✅ recordType — sirf label/color ke liye use hota hai, filtering ke liye nahi
function FileRecordTable({ rows, onEdit, onDelete, loading, recordType = "all" }) {
  const [search,     setSearch]     = useState("");
  const [page,       setPage]       = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Tab change hone par search/sort/page reset karo
  useEffect(() => {
    setPage(1);
    setSearch("");
    setSortConfig({ key: null, direction: "asc" });
  }, [recordType]);

  function handleSort(key) {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  }

  // ✅ FIX: rows seedha use karo — parent already type filter kar chuka hai
  const sorted = useMemo(() => {
    if (!sortConfig.key) return rows;
    return [...rows].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const aNum = Number(aVal), bNum = Number(bVal);
      if (!isNaN(aNum) && !isNaN(bNum))
        return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [rows, sortConfig]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(r =>
      COLUMNS.some(col => {
        const val = r[col.key];
        const str = val && typeof val === "object" ? val.name ?? "" : String(val ?? "");
        return str.toLowerCase().includes(q);
      })
    );
  }, [sorted, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const start      = (safePage - 1) * ROWS_PER_PAGE;
  const pageRows   = filtered.slice(start, start + ROWS_PER_PAGE);

  const handleSearch = (val) => { setSearch(val); setPage(1); };

  const typeInfo = RECORD_TYPE_LABEL[recordType] ?? RECORD_TYPE_LABEL.all;

  if (loading) return (
    <div className="w-full bg-white border border-slate-200">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200 bg-[#0f172a]">
        <TbTable className="w-4 h-4 text-emerald-400" />
        <span className={`text-[11px] font-bold uppercase tracking-widest ${typeInfo.color}`}>
          {typeInfo.label}
        </span>
      </div>
      <div className="py-16 text-center text-xs text-slate-400 tracking-wide uppercase">
        Loading records…
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col border border-slate-200 bg-white">

      {/* ── Table toolbar ── */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-[#1e293b] gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <TbTable className="w-4 h-4 text-emerald-400" />
          <span className={`text-[11px] font-bold uppercase tracking-widest ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
          {/* ✅ rows.length — parent-filtered total count */}
          <span className="text-[10px] font-mono text-slate-600 bg-[#1e293b] border border-[#334155] px-1.5 py-0.5">
            {rows.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Sort clear */}
          {sortConfig.key && (
            <button
              onClick={() => setSortConfig({ key: null, direction: "asc" })}
              className="h-7 px-2 text-[10px] font-semibold text-slate-400 border border-[#334155]
                bg-[#1e293b] hover:text-red-400 transition flex items-center gap-1"
            >
              <HiOutlineX className="w-3 h-3" /> Sort
            </button>
          )}
          {/* Search */}
          <div className="relative flex items-center">
            <HiOutlineSearch className="absolute left-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            <input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search…"
              className="pl-8 pr-7 h-7 text-xs bg-[#1e293b] text-slate-200 border border-[#334155]
                placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44 transition"
            />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-2 text-slate-500 hover:text-slate-300"
              >
                <HiOutlineX className="w-3 h-3" />
              </button>
            )}
          </div>
          {/* Filtered count */}
          <span className="text-[10px] font-mono text-slate-500 bg-[#1e293b] border border-[#334155] px-2 py-1">
            {filtered.length} rows
          </span>
        </div>
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-xs text-slate-400 uppercase tracking-widest">
          No records found
        </div>
      ) : (
        <>
          {/* ── Table ── */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-xs border-collapse" style={{ minWidth: "1200px" }}>
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  {COLUMNS.map(col => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className={`px-2.5 py-2 text-left border-r border-slate-200 last:border-r-0
                        whitespace-nowrap cursor-pointer hover:bg-slate-200 transition-colors
                        ${col.width ?? ""}
                        ${sortConfig.key === col.key ? "bg-slate-200" : ""}`}
                    >
                      <SortableHeader
                        label={col.label}
                        colKey={col.key}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                      />
                    </th>
                  ))}
                  <th className="px-2.5 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 w-16">
                    Act.
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, i) => (
                  <tr
                    key={row._id}
                    className={`border-b border-slate-100 hover:bg-emerald-50 transition-colors
                      ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}
                  >
                    {COLUMNS.map(col => {
                      const val      = row[col.key];
                      const isStatus = col.key === "applicationStatus" || col.key === "onlineStatus";
                      const display  = col.render ? col.render(val, row) : val;

                      return (
                        <td
                          key={col.key}
                          className={`px-2.5 py-1.5 whitespace-nowrap text-slate-600
                            border-r border-slate-100 last:border-r-0
                            ${col.numeric ? "text-right font-mono text-slate-700" : ""}`}
                        >
                          {isStatus
                            ? <StatusPill value={val} />
                            : display != null && display !== ""
                              ? display
                              : <span className="text-slate-300">—</span>
                          }
                        </td>
                      );
                    })}
                    <td className="px-2.5 py-1.5 text-center border-r-0">
                      <div className="inline-flex items-center gap-0.5">
                        <button
                          onClick={() => onEdit(row)}
                          title="Edit"
                          className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50
                            border border-transparent hover:border-emerald-200 transition"
                        >
                          <HiOutlinePencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(row)}
                          title="Delete"
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50
                            border border-transparent hover:border-red-200 transition"
                        >
                          <HiOutlineTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 bg-slate-50 flex-wrap gap-2">
              <span className="text-[11px] text-slate-500">
                Rows{" "}
                <span className="font-semibold text-slate-700">{start + 1}–{Math.min(start + ROWS_PER_PAGE, filtered.length)}</span>
                {" "}/ <span className="font-semibold text-slate-700">{filtered.length}</span>
              </span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="h-6 w-6 flex items-center justify-center border border-slate-300
                    bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition"
                >
                  <HiOutlineChevronLeft className="w-3.5 h-3.5" />
                </button>

                {pageRange(safePage, totalPages).map((p, idx) =>
                  p === "…" ? (
                    <span key={`ellipsis-${idx}`} className="h-6 w-6 flex items-center justify-center text-[11px] text-slate-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-6 min-w-[24px] px-1 text-[11px] font-semibold border transition
                        ${safePage === p
                          ? "bg-[#0f172a] text-white border-[#0f172a]"
                          : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                        }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="h-6 w-6 flex items-center justify-center border border-slate-300
                    bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition"
                >
                  <HiOutlineChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FileRecordTable;