import { useEffect, useState, useCallback } from "react";
import api from "../../../../api/axios";
import DataTable from "./DataTable";
import Pagination from "../../../../components/Pagination";
import { DealerSelect, FinancialYearSelect } from "../../../../components/app";
import { SHARED_COLUMNS, INVENTORY_COLUMNS, TABLE_CONFIGS } from "./tableConstants";

const LIMIT = 8;

const fmtDate = (val) =>
   val
      ? new Date(val).toLocaleDateString("en-IN", {
           day: "2-digit", month: "short", year: "numeric",
        })
      : "—";

const fmtCur = (val) =>
   val != null ? (
      <span className="font-medium text-gray-800">
         ₹ {Number(val).toLocaleString("en-IN")}
      </span>
   ) : (
      <span className="text-gray-300">—</span>
   );

function buildRenderer({ format, muted }) {
   switch (format) {
      case "date":
         return (val) => (
            <span className={muted ? "text-gray-400" : "text-gray-500"}>{fmtDate(val)}</span>
         );
      case "bold":
         return (val) => <span className="font-semibold text-gray-800">{val}</span>;
      case "badge":
         return (val) => (
            <span className="px-2 py-0.5 bg-green-50 text-green-700 font-mono text-[11px] border border-green-100">
               {val}
            </span>
         );
      case "currency":
         return (val) => fmtCur(val);
      case "mono":
         return (val) => (
            <span className="font-mono text-[11px] text-gray-600">{val ?? "—"}</span>
         );
      case "number":
         return (val) => (
            <span className="font-medium text-gray-700">
               {val != null ? Number(val).toLocaleString("en-IN") : "—"}
            </span>
         );
      case "totalQty":
         return (val) => {
            const total = Object.values(val ?? {}).reduce((sum, q) => sum + (Number(q) || 0), 0);
            return (
               <span className="font-medium text-gray-700">
                  {total > 0 ? total.toLocaleString("en-IN") : "—"}
               </span>
            );
         };
      case "plain":
      default:
         return (val) => <span className="text-gray-600">{val ?? "—"}</span>;
   }
}

const BUILT_COLUMNS = {
   shared:    SHARED_COLUMNS.map((col)    => ({ key: col.key, label: col.label, render: buildRenderer(col) })),
   inventory: INVENTORY_COLUMNS.map((col) => ({ key: col.key, label: col.label, render: buildRenderer(col) })),
};

const toInputDate = (val) => (val ? val.slice(0, 10) : "");

const SHARED_EDIT_FIELDS = [
   { key: "date",    label: "Date",       type: "date",   transform: toInputDate },
   { key: "amount",  label: "Amount (₹)", type: "number" },
   { key: "remarks", label: "Remarks",    type: "text"   },
];

function ChevronIcon({ open }) {
   return (
      <svg
         className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : "rotate-0"}`}
         fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
      >
         <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
   );
}

function RecordsTable({
   type,
   refreshKey,
   filterDealer: externalDealer,
   filterYear:   externalYear,
   hideFilters,
}) {
   const config = TABLE_CONFIGS[type];

   if (!config) {
      console.error(`RecordsTable: unknown type "${type}". Add it to TABLE_CONFIGS.`);
      return null;
   }

   const { endpoint, icon, label, emptyTitle, emptyDesc, deleteOnly, columns } = config;
   const tableColumns = columns === "inventory" ? BUILT_COLUMNS.inventory : BUILT_COLUMNS.shared;

   const hasFilters              = type === "paidCash" || type === "incentives" || type === "inventory";
   const requiresFilterSelection = type === "inventory";
   const isFlexFilter            = type === "paidCash" || type === "incentives";
   const showAmountTotal         = type === "paidCash" || type === "incentives";

   const [open,           setOpen]           = useState(true);
   const [rows,           setRows]           = useState([]);
   const [loading,        setLoading]        = useState(true);
   const [internalDealer, setInternalDealer] = useState("");
   const [internalYear,   setInternalYear]   = useState("");
   const [page,           setPage]           = useState(1);

   const filterDealer = hideFilters ? (externalDealer ?? "") : internalDealer;
   const filterYear   = hideFilters ? (externalYear   ?? "") : internalYear;

   const fetchRecords = useCallback(async () => {
      setLoading(true);
      try {
         const { data } = await api.get(endpoint);
         setRows(data.data ?? []);
      } catch {
         setRows([]);
      } finally {
         setLoading(false);
      }
   }, [endpoint]);

   useEffect(() => { fetchRecords(); }, [fetchRecords, refreshKey]);
   useEffect(() => { setPage(1); }, [filterDealer, filterYear]);

   const noFilterSelected = requiresFilterSelection && !(filterDealer && filterYear);

   const filtered = (() => {
      if (!hasFilters) return rows;
      if (requiresFilterSelection) {
         if (noFilterSelected) return [];
         return rows.filter(r =>
            r.dealerName === filterDealer && r.financialYear === filterYear
         );
      }
      if (isFlexFilter) {
         return rows.filter(r => {
            const matchDealer = filterDealer ? r.dealerName === filterDealer : true;
            const matchYear   = filterYear   ? r.financialYear === filterYear : true;
            return matchDealer && matchYear;
         });
      }
      return rows;
   })().sort((a, b) => new Date(a.date) - new Date(b.date));

   // Total amount of ALL filtered rows (not just current page)
   const totalAmount = showAmountTotal
      ? filtered.reduce((sum, r) => sum + (Number(r.amount) || 0), 0)
      : null;

   const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT));
   const safePage   = Math.min(page, totalPages);
   const pageRows   = filtered.slice((safePage - 1) * LIMIT, safePage * LIMIT);

   const handleDelete = useCallback(async (row) => {
      await api.delete(`${endpoint}/${row._id}`);
      setRows((prev) => prev.filter((r) => r._id !== row._id));
   }, [endpoint]);

   const handleEdit = useCallback(async (id, patch) => {
      const { data } = await api.put(`${endpoint}/${id}`, patch);
      setRows((prev) => prev.map((r) => (r._id === id ? { ...r, ...data.data } : r)));
   }, [endpoint]);

   return (
      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">

         {/* Accordion Header */}
         <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 hover:bg-gray-50 transition-colors"
         >
            <div className="flex items-center gap-2 flex-wrap min-w-0">
               <span className="text-base leading-none shrink-0">{icon}</span>
               <p className="text-[11px] uppercase tracking-widest font-semibold text-green-600 whitespace-nowrap">
                  {label}
               </p>
               <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                  {noFilterSelected ? (
                     <span>{rows.length} {rows.length === 1 ? "record" : "records"} total</span>
                  ) : (
                     <>
                        {filtered.length} {filtered.length === 1 ? "record" : "records"}
                        {filtered.length !== rows.length && (
                           <span className="ml-1 text-gray-300">of {rows.length}</span>
                        )}
                     </>
                  )}
               </span>
            </div>
            <ChevronIcon open={open} />
         </button>

         {/* Collapsible Body */}
         <div className={`transition-all duration-200 ease-in-out ${open ? "opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
            <div className="px-3 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100">

               {/* Filters */}
               {hasFilters && !hideFilters && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 mb-4 pb-4 border-b border-gray-100">
                     <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                           Filter by Dealer
                        </label>
                        <DealerSelect
                           value={internalDealer}
                           onChange={(dealerName) => setInternalDealer(dealerName ?? "")}
                           placeholder="All dealers"
                        />
                     </div>
                     <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                           Filter by Financial Year
                        </label>
                        <FinancialYearSelect
                           value={internalYear}
                           onChange={(e) => setInternalYear(e.target.value)}
                        />
                     </div>
                  </div>
               )}

               <div className={hasFilters && !hideFilters ? "" : "mt-4"}>
                  <DataTable
                     columns={tableColumns}
                     rows={pageRows}
                     loading={loading}
                     onDelete={type === "inventory" ? undefined : handleDelete}
                     onEdit={deleteOnly ? undefined : handleEdit}
                     editFields={deleteOnly ? [] : SHARED_EDIT_FIELDS}
                     emptyIcon={icon}
                     emptyTitle={noFilterSelected ? "Select a dealer and financial year" : emptyTitle}
                     emptyDesc={noFilterSelected ? "Choose filters above to view inventory records." : emptyDesc}
                     showItemsButton={type === "inventory"}
                  />
               </div>

               {/* Total Amount Row — paidCash & incentives only */}
               {showAmountTotal && !loading && filtered.length > 0 && (
                  <div className="mt-3 flex items-center justify-between px-3 py-2.5 bg-green-50 border border-green-100">
                     <span className="text-[11px] font-semibold uppercase tracking-widest text-green-700">
                        Total Amount
                        {filtered.length !== rows.length && (
                           <span className="ml-1 font-normal text-green-500 normal-case tracking-normal">
                              ({filtered.length} records)
                           </span>
                        )}
                     </span>
                     <span className="text-sm font-bold text-green-800">
                        ₹ {totalAmount.toLocaleString("en-IN")}
                     </span>
                  </div>
               )}

               {!noFilterSelected && (
                  <Pagination
                     currentPage={safePage}
                     totalPages={totalPages}
                     onPageChange={setPage}
                  />
               )}
            </div>
         </div>
      </div>
   );
}

export default RecordsTable;