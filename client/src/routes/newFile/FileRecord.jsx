
// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchDealers } from "../../store/dealerSlice";
// import api from "../../api/axios";
// import FileRecordTable from "./FileRecordTable";
// import EditFileModal from "./EditFileModal";
// import DeleteConfirm from "./DeleteConfirm";
// import Pdf from "../../components/Pdf";
// import Excel from "../../components/Excel";
// import { FinancialYearSelect } from "../../components/app";
// import {
//   HiOutlineSearch,
//   HiOutlineX,
//   HiOutlineCheckCircle,
//   HiOutlineXCircle,
//   HiOutlineRefresh,
//   HiOutlineExclamationCircle,
//   HiOutlineChevronDown,
//   HiOutlineFilter,
// } from "react-icons/hi";
// import { TbDatabaseSearch } from "react-icons/tb";

// // ─── MI classification ────────────────────────────────────────────────────────
// const VALID_MI_REGEX = /^MI\d+$/i;
// function classifyMI(miNumber) {
//   const val = String(miNumber ?? "").trim();
//   if (!val)                     return "withoutMI";
//   if (VALID_MI_REGEX.test(val)) return "withMI";
//   return "other";
// }

// // ─── Application status options derived dynamically from records ─────────────────

// // ─── Export helper ────────────────────────────────────────────────────────────
// function rowsToExportRecords(rows) {
//   return rows.map((r, i) => ({
//     "Sr No":              i + 1,
//     "Scan No":            r.scanNo            ?? "",
//     "Brand":              r.brandName         ?? "",
//     "Farmer Name":        r.name              ?? "",
//     "Father Name":        r.fatherName        ?? "",
//     "Mobile":             r.mobileNo          ?? "",
//     "Dealer":             r.dealerName        ?? "",
//     "Code":               r.farmerDealerCode  ?? "",
//     "Address":            r.address           ?? "",
//     "Block":              r.block             ?? "",
//     "District":           r.district          ?? "",
//     "Irrigation Type":    r.irrigationType    ?? "",
//     "Area (Acre)":        r.areaInAcre        ?? "",
//     "Family ID":          r.familyId          ?? "",
//     "Farmer Code":        r.farmerCode        ?? "",
//     "MI Number":          r.miNumber          ?? "",
//     "Application Status": r.applicationStatus ?? "",
//     "Online Status":      r.onlineStatus      ?? "",
//     "Error":              r.error             ?? "",
//     "Created By":         r.createdBy?.name   ?? "",
//   }));
// }

// // ─── Searchable List Dropdown (reusable) ─────────────────────────────────────
// function SearchableList({ items, value, onChange, placeholder = "Search…", renderItem, getKey, getValue }) {
//   const [query, setQuery] = useState("");
//   const inputRef = useRef(null);

//   useEffect(() => {
//     // auto-focus search when mounted
//     setTimeout(() => inputRef.current?.focus(), 50);
//   }, []);

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return items;
//     return items.filter(item => renderItem(item).toLowerCase().includes(q));
//   }, [items, query]);

//   return (
//     <div className="flex flex-col">
//       {/* Search input */}
//       <div className="relative mb-1.5">
//         <HiOutlineSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
//         <input
//           ref={inputRef}
//           value={query}
//           onChange={e => setQuery(e.target.value)}
//           placeholder={placeholder}
//           className="w-full h-7 pl-7 pr-6 text-[11px] border border-slate-300 bg-slate-50
//             text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
//         />
//         {query && (
//           <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
//             <HiOutlineX className="w-2.5 h-2.5" />
//           </button>
//         )}
//       </div>
//       {/* List */}
//       <div className="max-h-44 overflow-y-auto border border-slate-200 flex flex-col">
//         {filtered.length === 0 ? (
//           <div className="px-3 py-3 text-[10px] text-slate-400 text-center uppercase tracking-wider">No results</div>
//         ) : (
//           filtered.map(item => {
//             const key = getKey(item);
//             const val = getValue(item);
//             const active = value === val;
//             return (
//               <button
//                 key={key}
//                 onClick={() => onChange(active ? "" : val)}
//                 className={`w-full text-left px-2.5 py-1.5 text-[11px] font-semibold border-b border-slate-100 last:border-b-0 transition
//                   ${active
//                     ? "bg-[#0f172a] text-white"
//                     : "bg-white text-slate-600 hover:bg-slate-50"
//                   }`}
//               >
//                 {renderItem(item)}
//               </button>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── Combined Filter Popover ──────────────────────────────────────────────────
// function FilterPopover({ dealers, dealerFilter, setDealerFilter, statuses = [], appStatus, setAppStatus, loading }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     function handleClick(e) {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     }
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   const activeCount = [
//     dealerFilter ? 1 : 0,
//     appStatus !== "All Status" ? 1 : 0,
//   ].reduce((a, b) => a + b, 0);

//   // Status items derived from records dynamically
//   const statusItems = statuses;

//   return (
//     <div className="relative" ref={ref}>
//       <button
//         onClick={() => setOpen(o => !o)}
//         disabled={loading}
//         className={`h-8 px-3 flex items-center gap-1.5 border text-[11px] font-bold uppercase tracking-wider transition disabled:opacity-40
//           ${open
//             ? "bg-[#0f172a] text-white border-[#0f172a]"
//             : activeCount > 0
//               ? "bg-violet-50 text-violet-700 border-violet-300 hover:bg-violet-100"
//               : "bg-white text-slate-500 border-slate-300 hover:bg-slate-50"
//           }`}
//       >
//         <HiOutlineFilter className="w-3.5 h-3.5" />
//         Filters
//         {activeCount > 0 && (
//           <span className={`text-[10px] font-mono px-1.5 py-px leading-none rounded-full
//             ${open ? "bg-white/20 text-white" : "bg-violet-200 text-violet-800"}`}>
//             {activeCount}
//           </span>
//         )}
//         <HiOutlineChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
//       </button>

//       {open && (
//         <div className="absolute left-0 top-full mt-1.5 z-50 w-80 bg-white border border-slate-200 shadow-lg">
//           {/* Header */}
//           <div className="flex items-center justify-between px-3 py-2 bg-[#0f172a] border-b border-[#1e293b]">
//             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Filter Options</span>
//             <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-300 transition">
//               <HiOutlineX className="w-3.5 h-3.5" />
//             </button>
//           </div>

//           <div className="p-3 flex flex-col gap-4">

//             {/* ── Dealer ── */}
//             <div>
//               <div className="flex items-center justify-between mb-1.5">
//                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dealer</span>
//                 {dealerFilter && (
//                   <button
//                     onClick={() => setDealerFilter("")}
//                     className="text-[9px] font-semibold text-red-400 hover:text-red-600 flex items-center gap-0.5 transition"
//                   >
//                     <HiOutlineX className="w-2.5 h-2.5" /> Clear
//                   </button>
//                 )}
//               </div>
//               {dealerFilter && (
//                 <div className="mb-1.5 text-[10px] text-violet-700 font-bold bg-violet-50 border border-violet-200 px-2 py-1 truncate flex items-center gap-1">
//                   <span className="truncate">{dealerFilter}</span>
//                 </div>
//               )}
//               <SearchableList
//                 items={dealers}
//                 value={dealerFilter}
//                 onChange={setDealerFilter}
//                 placeholder="Search dealer…"
//                 getKey={d => `${d.name}__${d.code}`}
//                 getValue={d => d.name}
//                 renderItem={d =>
//                   d.code
//                     ? `${d.name} · ${d.code}`
//                     : d.name
//                 }
//               />
//             </div>

//             <div className="h-px bg-slate-100" />

//             {/* ── Application Status ── */}
//             <div>
//               <div className="flex items-center justify-between mb-1.5">
//                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Application Status</span>
//                 {appStatus !== "All Status" && (
//                   <button
//                     onClick={() => setAppStatus("All Status")}
//                     className="text-[9px] font-semibold text-red-400 hover:text-red-600 flex items-center gap-0.5 transition"
//                   >
//                     <HiOutlineX className="w-2.5 h-2.5" /> Clear
//                   </button>
//                 )}
//               </div>
//               {appStatus !== "All Status" && (
//                 <div className="mb-1.5 text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-1 truncate">
//                   {appStatus}
//                 </div>
//               )}
//               <SearchableList
//                 items={statusItems}
//                 value={appStatus === "All Status" ? "" : appStatus}
//                 onChange={v => setAppStatus(v || "All Status")}
//                 placeholder="Search status…"
//                 getKey={s => s}
//                 getValue={s => s}
//                 renderItem={s => s}
//               />
//             </div>
//           </div>

//           {/* Footer */}
//           {(dealerFilter || appStatus !== "All Status") && (
//             <div className="px-3 py-2 border-t border-slate-100 bg-slate-50">
//               <button
//                 onClick={() => { setDealerFilter(""); setAppStatus("All Status"); }}
//                 className="w-full h-7 text-[11px] font-bold uppercase tracking-wider text-red-500 border border-red-200
//                   bg-white hover:bg-red-50 transition flex items-center justify-center gap-1.5"
//               >
//                 <HiOutlineX className="w-3 h-3" /> Clear All Filters
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function FileRecord() {
//   const dispatch = useDispatch();

//   const [records,       setRecords]       = useState([]);
//   const [loading,       setLoading]       = useState(false);
//   const [error,         setError]         = useState(null);
//   const [selectedYear,  setSelectedYear]  = useState("");
//   const [filterType,    setFilterType]    = useState("all");
//   const [recordType,    setRecordType]    = useState("all");
//   const [dealerFilter,  setDealerFilter]  = useState("");
//   const [appStatus,     setAppStatus]     = useState("All Status");

//   const [editRecord,    setEditRecord]    = useState(null);
//   const [deleteRecord,  setDeleteRecord]  = useState(null);
//   const [editLoading,   setEditLoading]   = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [toast,         setToast]         = useState(null);

//   const showToast = (type, msg) => {
//     setToast({ type, msg });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const fetchRecords = useCallback(async () => {
//     setLoading(true); setError(null);
//     try {
//       const params = { limit: 0, page: 1 };
//       if (selectedYear) params.financialYear = selectedYear;
//       const res = await api.get("/mainfile", { params });
//       setRecords(res.data?.data ?? []);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch records");
//     } finally { setLoading(false); }
//   }, [selectedYear]);

//   useEffect(() => {
//     dispatch(fetchDealers());
//     fetchRecords();
//   }, [fetchRecords]);

//   // ─── Derive unique dealers (name + code) from records ───────────────────────
//   const uniqueDealers = useMemo(() => {
//     const map = new Map();
//     records.forEach(r => {
//       const name = String(r.dealerName ?? "").trim();
//       const code = String(r.farmerDealerCode ?? "").trim();
//       if (!name) return;
//       if (!map.has(name)) map.set(name, code);
//     });
//     return [...map.entries()]
//       .map(([name, code]) => ({ name, code }))
//       .sort((a, b) => a.name.localeCompare(b.name));
//   }, [records]);

//   // ─── Derive unique app statuses from records ──────────────────────────────────
//   const uniqueStatuses = useMemo(() => {
//     const set = new Set();
//     records.forEach(r => {
//       const s = String(r.applicationStatus ?? "").trim();
//       if (s) set.add(s);
//     });
//     return [...set].sort((a, b) => a.localeCompare(b));
//   }, [records]);

//   // ─── Chained filters ──────────────────────────────────────────────────────
//   const miFiltered = useMemo(() => {
//     if (filterType === "all") return records;
//     return records.filter(r => classifyMI(r.miNumber) === filterType);
//   }, [records, filterType]);

//   const dealerFiltered = useMemo(() => {
//     if (!dealerFilter) return miFiltered;
//     const q = dealerFilter.toLowerCase();
//     return miFiltered.filter(r => String(r.dealerName ?? "").toLowerCase().includes(q));
//   }, [miFiltered, dealerFilter]);

//   const statusFiltered = useMemo(() => {
//     if (!appStatus || appStatus === "All Status") return dealerFiltered;
//     return dealerFiltered.filter(r =>
//       String(r.applicationStatus ?? "").toLowerCase() === appStatus.toLowerCase()
//     );
//   }, [dealerFiltered, appStatus]);

//   const typeFilteredRecords = useMemo(() => {
//     if (recordType === "atal") return statusFiltered.filter(r => String(r.scanNo ?? "").toLowerCase().startsWith("atal"));
//     if (recordType === "demo") return statusFiltered.filter(r => String(r.scanNo ?? "").toLowerCase().startsWith("demo"));
//     return statusFiltered;
//   }, [statusFiltered, recordType]);

//   // ─── MI counts ────────────────────────────────────────────────────────────
//   const miCounts = useMemo(() => ({
//     all:       records.length,
//     withMI:    records.filter(r => classifyMI(r.miNumber) === "withMI").length,
//     withoutMI: records.filter(r => classifyMI(r.miNumber) === "withoutMI").length,
//     other:     records.filter(r => classifyMI(r.miNumber) === "other").length,
//   }), [records]);

//   // ─── Export ───────────────────────────────────────────────────────────────
//   const exportTitle = [
//     "File_Records",
//     selectedYear            ? `FY${selectedYear}`                        : "",
//     filterType !== "all"    ? filterType                                  : "",
//     dealerFilter            ? `Dealer-${dealerFilter.replace(/\s+/g,"_")}` : "",
//     appStatus !== "All Status" ? appStatus.replace(/\s+/g, "_")           : "",
//     recordType !== "all"    ? recordType                                  : "",
//   ].filter(Boolean).join("_");

//   const exportRecords = useMemo(() => rowsToExportRecords(typeFilteredRecords), [typeFilteredRecords]);
//   const exportData    = { title: exportTitle.replace(/_/g, " "), records: exportRecords, financialYear: selectedYear || undefined, dealerName: dealerFilter || undefined, appStatus: appStatus !== "All Status" ? appStatus : undefined, recordType: recordType !== "all" ? recordType : undefined };

//   // ─── Handlers ─────────────────────────────────────────────────────────────
//   async function handleSaveEdit(form) {
//     setEditLoading(true);
//     try {
//       const { _id, __v, createdAt, updatedAt, ...body } = form;
//       await api.put(`/mainfile/${_id}`, body);
//       showToast("success", "Record updated successfully");
//       setEditRecord(null); fetchRecords();
//     } catch (err) {
//       showToast("error", err.response?.data?.message || "Update failed");
//     } finally { setEditLoading(false); }
//   }

//   async function handleConfirmDelete() {
//     setDeleteLoading(true);
//     try {
//       await api.delete(`/mainfile/${deleteRecord._id}`);
//       showToast("success", "Record deleted");
//       setDeleteRecord(null);
//       setRecords(prev => prev.filter(r => r._id !== deleteRecord._id));
//     } catch (err) {
//       showToast("error", err.response?.data?.message || "Delete failed");
//     } finally { setDeleteLoading(false); }
//   }

//   function handleClearAll() {
//     setSelectedYear(""); setFilterType("all");
//     setDealerFilter(""); setAppStatus("All Status");
//   }

//   const hasActiveFilters = selectedYear || filterType !== "all" || dealerFilter || appStatus !== "All Status";

//   const MI_FILTERS = [
//     { key: "all",       label: "All",        dot: null             },
//     { key: "withMI",    label: "With MI",    dot: "bg-emerald-500" },
//     { key: "withoutMI", label: "Without MI", dot: "bg-amber-500"   },
//     { key: "other",     label: "Other",      dot: "bg-red-500"     },
//   ];

//   const RECORD_TABS = [
//     { key: "all",  label: "All Records"  },
//     { key: "atal", label: "Atal Records" },
//     { key: "demo", label: "Demo Records" },
//   ];

//   return (
//     <div className="w-full min-h-screen bg-[#f0f2f5]">

//       {/* Toast */}
//       {toast && (
//         <div className={`fixed top-0 left-0 right-0 z-50 flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b
//           ${toast.type === "success" ? "bg-emerald-700 text-white border-emerald-900" : "bg-red-700 text-white border-red-900"}`}>
//           {toast.type === "success"
//             ? <HiOutlineCheckCircle className="w-4 h-4 shrink-0" />
//             : <HiOutlineXCircle     className="w-4 h-4 shrink-0" />}
//           {toast.msg}
//         </div>
//       )}

//       {/* Top bar */}
//       <div className="w-full bg-[#0f172a] px-5 py-0 flex items-center gap-0 border-b border-[#1e293b]">
//         <div className="flex items-center gap-2.5 py-3 border-r border-[#1e293b] pr-5 mr-5 shrink-0">
//           <TbDatabaseSearch className="w-4 h-4 text-emerald-400" />
//           <span className="text-[13px] font-bold text-white tracking-widest uppercase">File Records</span>
//         </div>
//         <span className="text-[11px] text-slate-500 shrink-0">Manage and filter farmer file records</span>
//         <div className="ml-auto flex items-stretch self-stretch">
//           {RECORD_TABS.map(tab => (
//             <button key={tab.key} onClick={() => setRecordType(tab.key)}
//               className={`px-5 text-[11px] font-bold uppercase tracking-wider border-b-2 transition self-stretch
//                 ${recordType === tab.key
//                   ? "text-emerald-400 border-emerald-400 bg-[#1e293b]"
//                   : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-[#1e293b]/50"}`}>
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ── Filter strip ── */}
//       <div className="w-full bg-white border-b border-slate-100 px-5 py-2.5 flex items-center gap-3 flex-wrap">

//         {/* FY */}
//         <div className="flex items-center gap-2">
//           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">FY</span>
//           <FinancialYearSelect
//             value={selectedYear}
//             onChange={e => setSelectedYear(e.target.value)}
//             disabled={loading}
//             className="h-8 px-2 text-xs border border-slate-300 bg-white text-slate-700 focus:outline-none focus:border-emerald-600"
//           />
//         </div>

//         <div className="h-5 w-px bg-slate-200" />

//         {/* MI Filter */}
//         <div className="flex items-center gap-2">
//           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MI</span>
//           <div className="flex border border-slate-300 divide-x divide-slate-300">
//             {MI_FILTERS.map(opt => (
//               <button key={opt.key} onClick={() => setFilterType(opt.key)} disabled={loading}
//                 className={`h-8 px-3 text-[11px] font-semibold transition disabled:opacity-50 flex items-center gap-1.5
//                   ${filterType === opt.key ? "bg-[#0f172a] text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}>
//                 {opt.dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${opt.dot}`} />}
//                 {opt.label}
//                 <span className={`text-[10px] font-mono px-1 py-px leading-none
//                   ${filterType === opt.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
//                   {miCounts[opt.key]}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="h-5 w-px bg-slate-200" />

//         {/* ✅ Combined Dealer + Status Popover */}
//         <FilterPopover
//           dealers={uniqueDealers}
//           dealerFilter={dealerFilter}
//           setDealerFilter={setDealerFilter}
//           statuses={uniqueStatuses}
//           appStatus={appStatus}
//           setAppStatus={setAppStatus}
//           loading={loading}
//         />

//         <div className="h-5 w-px bg-slate-200" />

//         {/* Load + Refresh + Clear */}
//         <button onClick={fetchRecords} disabled={loading}
//           className="h-8 px-4 bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider
//             hover:bg-emerald-800 disabled:opacity-40 transition flex items-center gap-1.5">
//           <HiOutlineSearch className={`w-3.5 h-3.5 ${loading ? "animate-pulse" : ""}`} />
//           {loading ? "Loading…" : "Load"}
//         </button>

//         <button onClick={fetchRecords} disabled={loading} title="Refresh"
//           className="h-8 w-8 flex items-center justify-center border border-slate-300 bg-white text-slate-400
//             hover:text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition">
//           <HiOutlineRefresh className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
//         </button>

//         {hasActiveFilters && (
//           <button onClick={handleClearAll} disabled={loading}
//             className="h-8 px-3 text-[11px] font-semibold text-slate-400 border border-slate-300 bg-white
//               hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1">
//             <HiOutlineX className="w-3 h-3" /> Clear All
//           </button>
//         )}

//         {/* Right: count + active chips + export */}
//         <div className="ml-auto flex items-center gap-2 flex-wrap">
//           {!loading && (
//             <span className="text-[11px] text-slate-500">
//               <span className="font-bold text-slate-700">{typeFilteredRecords.length}</span> records
//             </span>
//           )}

//           {selectedYear && (
//             <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 uppercase tracking-wider">
//               FY {selectedYear}
//             </span>
//           )}
//           {filterType === "withMI" && (
//             <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 uppercase tracking-wider">Has MI</span>
//           )}
//           {filterType === "withoutMI" && (
//             <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 uppercase tracking-wider">No MI</span>
//           )}
//           {filterType === "other" && (
//             <span className="text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 uppercase tracking-wider">Other</span>
//           )}
//           {dealerFilter && (
//             <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 uppercase tracking-wider max-w-[130px] truncate flex items-center gap-1">
//               {dealerFilter}
//               <button onClick={() => setDealerFilter("")} className="hover:text-blue-900 transition shrink-0">
//                 <HiOutlineX className="w-2.5 h-2.5" />
//               </button>
//             </span>
//           )}
//           {appStatus !== "All Status" && (
//             <span className="text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 uppercase tracking-wider max-w-[170px] truncate flex items-center gap-1">
//               {appStatus}
//               <button onClick={() => setAppStatus("All Status")} className="hover:text-violet-900 transition shrink-0">
//                 <HiOutlineX className="w-2.5 h-2.5" />
//               </button>
//             </span>
//           )}
//           {recordType !== "all" && (
//             <span className={`text-[10px] font-bold border px-2 py-0.5 uppercase tracking-wider
//               ${recordType === "atal" ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-orange-50 text-orange-700 border-orange-200"}`}>
//               {recordType}
//             </span>
//           )}

//           {/* Export — Excel + PDF */}
//           {!loading && typeFilteredRecords.length > 0 && (
//             <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
//               <Excel
//                 model="dealer-mainfile-records"
//                 fileName={exportTitle}
//                 label="Excel"
//                 data={exportData}
//                 variant="compact"
//               />
//               <Pdf
//                 model="dealer-mainfile-records"
//                 fileName={exportTitle}
//                 label="PDF"
//                 data={exportData}
//                 variant="compact"
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="w-full px-5 py-2 bg-red-700 text-white text-xs font-medium flex items-center gap-2">
//           <HiOutlineExclamationCircle className="w-4 h-4 shrink-0" /> {error}
//         </div>
//       )}

//       {/* Table */}
//       <div className="w-full p-4">
//         <FileRecordTable
//           rows={typeFilteredRecords}
//           loading={loading}
//           onEdit={setEditRecord}
//           onDelete={setDeleteRecord}
//           recordType={recordType}
//         />
//       </div>

//       {/* Modals */}
//       <EditFileModal
//         isOpen={!!editRecord}
//         record={editRecord}
//         onClose={() => setEditRecord(null)}
//         onSave={handleSaveEdit}
//         loading={editLoading}
//       />
//       <DeleteConfirm
//         isOpen={!!deleteRecord}
//         record={deleteRecord}
//         onConfirm={handleConfirmDelete}
//         onCancel={() => setDeleteRecord(null)}
//         loading={deleteLoading}
//       />
//     </div>
//   );
// }

// export default FileRecord;














import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDealers } from "../../store/dealerSlice";
import api from "../../api/axios";
import FileRecordTable from "./FileRecordTable";
import EditFileModal from "./EditFileModal";
import DeleteConfirm from "./DeleteConfirm";
import SummarySection from "./SummarySection";
import Pdf from "../../components/Pdf";
import Excel from "../../components/Excel";
import { FinancialYearSelect } from "../../components/app";
import {
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineRefresh,
  HiOutlineExclamationCircle,
  HiOutlineChevronDown,
  HiOutlineFilter,
  HiOutlineCheck,
} from "react-icons/hi";
import { TbDatabaseSearch, TbReportMoney, TbUsers } from "react-icons/tb";

// ─── MI classification ────────────────────────────────────────────────────────
const VALID_MI_REGEX = /^MI\d+$/i;
function classifyMI(miNumber) {
  const val = String(miNumber ?? "").trim();
  if (!val)                     return "withoutMI";
  if (VALID_MI_REGEX.test(val)) return "withMI";
  return "other";
}

// ─── Application status options derived dynamically from records ─────────────────

// ─── Export helper ────────────────────────────────────────────────────────────
function rowsToExportRecords(rows) {
  return rows.map((r, i) => ({
    "Sr No":              i + 1,
    "Scan No":            r.scanNo            ?? "",
    "Brand":              r.brandName         ?? "",
    "Farmer Name":        r.name              ?? "",
    "Father Name":        r.fatherName        ?? "",
    "Mobile":             r.mobileNo          ?? "",
    "Dealer":             r.dealerName        ?? "",
    "Code":               r.farmerDealerCode  ?? "",
    "Address":            r.address           ?? "",
    "Block":              r.block             ?? "",
    "District":           r.district          ?? "",
    "Irrigation Type":    r.irrigationType    ?? "",
    "Area (Acre)":        r.areaInAcre        ?? "",
    "Family ID":          r.familyId          ?? "",
    "Farmer Code":        r.farmerCode        ?? "",
    "MI Number":          r.miNumber          ?? "",
    "Application Status": r.applicationStatus ?? "",
    "Online Status":      r.onlineStatus      ?? "",
    "Error":              r.error             ?? "",
    "Created By":         r.createdBy?.name   ?? "",
  }));
}

// ─── Searchable List Dropdown (reusable) ─────────────────────────────────────
function SearchableList({ items, value, onChange, placeholder = "Search…", renderItem, getKey, getValue }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    // auto-focus search when mounted
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(item => renderItem(item).toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div className="flex flex-col">
      {/* Search input */}
      <div className="relative mb-1.5">
        <HiOutlineSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-7 pl-7 pr-6 text-[11px] border border-slate-300 bg-slate-50
            text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <HiOutlineX className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
      {/* List */}
      <div className="max-h-44 overflow-y-auto border border-slate-200 flex flex-col">
        {filtered.length === 0 ? (
          <div className="px-3 py-3 text-[10px] text-slate-400 text-center uppercase tracking-wider">No results</div>
        ) : (
          filtered.map(item => {
            const key = getKey(item);
            const val = getValue(item);
            const active = value === val;
            return (
              <button
                key={key}
                onClick={() => onChange(active ? "" : val)}
                className={`w-full text-left px-2.5 py-1.5 text-[11px] font-semibold border-b border-slate-100 last:border-b-0 transition
                  ${active
                    ? "bg-[#0f172a] text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {renderItem(item)}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Combined Filter Popover ──────────────────────────────────────────────────
function FilterPopover({ dealers, dealerFilter, setDealerFilter, statuses = [], appStatus, setAppStatus, loading }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeCount = [
    dealerFilter ? 1 : 0,
    appStatus !== "All Status" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Status items derived from records dynamically
  const statusItems = statuses;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        disabled={loading}
        className={`h-8 px-3 flex items-center gap-1.5 border text-[11px] font-bold uppercase tracking-wider transition disabled:opacity-40
          ${open
            ? "bg-[#0f172a] text-white border-[#0f172a]"
            : activeCount > 0
              ? "bg-violet-50 text-violet-700 border-violet-300 hover:bg-violet-100"
              : "bg-white text-slate-500 border-slate-300 hover:bg-slate-50"
          }`}
      >
        <HiOutlineFilter className="w-3.5 h-3.5" />
        Filters
        {activeCount > 0 && (
          <span className={`text-[10px] font-mono px-1.5 py-px leading-none rounded-full
            ${open ? "bg-white/20 text-white" : "bg-violet-200 text-violet-800"}`}>
            {activeCount}
          </span>
        )}
        <HiOutlineChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-80 bg-white border border-slate-200 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#0f172a] border-b border-[#1e293b]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Filter Options</span>
            <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-300 transition">
              <HiOutlineX className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3 flex flex-col gap-4">

            {/* ── Dealer ── */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dealer</span>
                {dealerFilter && (
                  <button
                    onClick={() => setDealerFilter("")}
                    className="text-[9px] font-semibold text-red-400 hover:text-red-600 flex items-center gap-0.5 transition"
                  >
                    <HiOutlineX className="w-2.5 h-2.5" /> Clear
                  </button>
                )}
              </div>
              {dealerFilter && (
                <div className="mb-1.5 text-[10px] text-violet-700 font-bold bg-violet-50 border border-violet-200 px-2 py-1 truncate flex items-center gap-1">
                  <span className="truncate">{dealerFilter}</span>
                </div>
              )}
              <SearchableList
                items={dealers}
                value={dealerFilter}
                onChange={setDealerFilter}
                placeholder="Search dealer…"
                getKey={d => `${d.name}__${d.code}`}
                getValue={d => d.name}
                renderItem={d =>
                  d.code
                    ? `${d.name} · ${d.code}`
                    : d.name
                }
              />
            </div>

            <div className="h-px bg-slate-100" />

            {/* ── Application Status ── */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Application Status</span>
                {appStatus !== "All Status" && (
                  <button
                    onClick={() => setAppStatus("All Status")}
                    className="text-[9px] font-semibold text-red-400 hover:text-red-600 flex items-center gap-0.5 transition"
                  >
                    <HiOutlineX className="w-2.5 h-2.5" /> Clear
                  </button>
                )}
              </div>
              {appStatus !== "All Status" && (
                <div className="mb-1.5 text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-1 truncate">
                  {appStatus}
                </div>
              )}
              <SearchableList
                items={statusItems}
                value={appStatus === "All Status" ? "" : appStatus}
                onChange={v => setAppStatus(v || "All Status")}
                placeholder="Search status…"
                getKey={s => s}
                getValue={s => s}
                renderItem={s => s}
              />
            </div>
          </div>

          {/* Footer */}
          {(dealerFilter || appStatus !== "All Status") && (
            <div className="px-3 py-2 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => { setDealerFilter(""); setAppStatus("All Status"); }}
                className="w-full h-7 text-[11px] font-bold uppercase tracking-wider text-red-500 border border-red-200
                  bg-white hover:bg-red-50 transition flex items-center justify-center gap-1.5"
              >
                <HiOutlineX className="w-3 h-3" /> Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Summary nav dropdown — replaces the plain "Summary" tab button.
// Click opens a small menu (Dealer Summary / Farmer Summary); picking either
// switches to the Summary view AND selects that sub-view in one go. ──────────
function SummaryNavDropdown({ active, summaryType, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const OPTIONS = [
    { key: "dealer", label: "Dealer Summary", icon: TbReportMoney },
    { key: "farmer", label: "Farmer Summary", icon: TbUsers },
  ];

  return (
    <div className="relative self-stretch" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`h-full px-5 text-[11px] font-bold uppercase tracking-wider border-b-2 transition self-stretch
          flex items-center gap-1.5
          ${active
            ? "text-emerald-400 border-emerald-400 bg-[#1e293b]"
            : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-[#1e293b]/50"}`}
      >
        Summary
        <HiOutlineChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-0 z-50 w-52 bg-white border border-slate-200 shadow-lg">
          {OPTIONS.map(opt => {
            const Icon = opt.icon;
            const isActive = active && summaryType === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => { onSelect(opt.key); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100 last:border-b-0
                  flex items-center gap-2 transition
                  ${isActive
                    ? "bg-[#0f172a] text-emerald-400"
                    : "bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="flex-1">{opt.label}</span>
                {isActive && <HiOutlineCheck className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FileRecord() {
  const dispatch = useDispatch();

  const [records,       setRecords]       = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);
  const [selectedYear,  setSelectedYear]  = useState("");
  const [filterType,    setFilterType]    = useState("all");
  const [recordType,    setRecordType]    = useState("all");
  const [dealerFilter,  setDealerFilter]  = useState("");
  const [appStatus,     setAppStatus]     = useState("All Status");

  // ✅ NEW: top-level tab — "records" shows the existing filterable table view,
  // "summary" shows the Dealer/Farmer summary section. Kept separate from
  // `recordType` because Summary isn't a row-filter, it's a different view.
  const [mainTab,       setMainTab]       = useState("records");
  // Which summary view to show once mainTab === "summary". Selected via the
  // dropdown on the SUMMARY tab itself.
  const [summaryType,   setSummaryType]   = useState("dealer");

  const [editRecord,    setEditRecord]    = useState(null);
  const [deleteRecord,  setDeleteRecord]  = useState(null);
  const [editLoading,   setEditLoading]   = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast,         setToast]         = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRecords = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params = { limit: 0, page: 1 };
      if (selectedYear) params.financialYear = selectedYear;
      const res = await api.get("/mainfile", { params });
      setRecords(res.data?.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch records");
    } finally { setLoading(false); }
  }, [selectedYear]);

  useEffect(() => {
    dispatch(fetchDealers());
    fetchRecords();
  }, [fetchRecords]);

  // ─── Derive unique dealers (name + code) from records ───────────────────────
  const uniqueDealers = useMemo(() => {
    const map = new Map();
    records.forEach(r => {
      const name = String(r.dealerName ?? "").trim();
      const code = String(r.farmerDealerCode ?? "").trim();
      if (!name) return;
      if (!map.has(name)) map.set(name, code);
    });
    return [...map.entries()]
      .map(([name, code]) => ({ name, code }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [records]);

  // ─── Derive unique app statuses from records ──────────────────────────────────
  const uniqueStatuses = useMemo(() => {
    const set = new Set();
    records.forEach(r => {
      const s = String(r.applicationStatus ?? "").trim();
      if (s) set.add(s);
    });
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [records]);

  // ─── Chained filters ──────────────────────────────────────────────────────
  const miFiltered = useMemo(() => {
    if (filterType === "all") return records;
    return records.filter(r => classifyMI(r.miNumber) === filterType);
  }, [records, filterType]);

  const dealerFiltered = useMemo(() => {
    if (!dealerFilter) return miFiltered;
    const q = dealerFilter.toLowerCase();
    return miFiltered.filter(r => String(r.dealerName ?? "").toLowerCase().includes(q));
  }, [miFiltered, dealerFilter]);

  const statusFiltered = useMemo(() => {
    if (!appStatus || appStatus === "All Status") return dealerFiltered;
    return dealerFiltered.filter(r =>
      String(r.applicationStatus ?? "").toLowerCase() === appStatus.toLowerCase()
    );
  }, [dealerFiltered, appStatus]);

  const typeFilteredRecords = useMemo(() => {
    if (recordType === "atal") return statusFiltered.filter(r => String(r.scanNo ?? "").toLowerCase().startsWith("atal"));
    if (recordType === "demo") return statusFiltered.filter(r => String(r.scanNo ?? "").toLowerCase().startsWith("demo"));
    return statusFiltered;
  }, [statusFiltered, recordType]);

  // ─── MI counts ────────────────────────────────────────────────────────────
  const miCounts = useMemo(() => ({
    all:       records.length,
    withMI:    records.filter(r => classifyMI(r.miNumber) === "withMI").length,
    withoutMI: records.filter(r => classifyMI(r.miNumber) === "withoutMI").length,
    other:     records.filter(r => classifyMI(r.miNumber) === "other").length,
  }), [records]);

  // ─── Export ───────────────────────────────────────────────────────────────
  const exportTitle = [
    "File_Records",
    selectedYear            ? `FY${selectedYear}`                        : "",
    filterType !== "all"    ? filterType                                  : "",
    dealerFilter            ? `Dealer-${dealerFilter.replace(/\s+/g,"_")}` : "",
    appStatus !== "All Status" ? appStatus.replace(/\s+/g, "_")           : "",
    recordType !== "all"    ? recordType                                  : "",
  ].filter(Boolean).join("_");

  const exportRecords = useMemo(() => rowsToExportRecords(typeFilteredRecords), [typeFilteredRecords]);
  const exportData    = { title: exportTitle.replace(/_/g, " "), records: exportRecords, financialYear: selectedYear || undefined, dealerName: dealerFilter || undefined, appStatus: appStatus !== "All Status" ? appStatus : undefined, recordType: recordType !== "all" ? recordType : undefined };

  // ─── Handlers ─────────────────────────────────────────────────────────────
  async function handleSaveEdit(form) {
    setEditLoading(true);
    try {
      const { _id, __v, createdAt, updatedAt, ...body } = form;
      await api.put(`/mainfile/${_id}`, body);
      showToast("success", "Record updated successfully");
      setEditRecord(null); fetchRecords();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Update failed");
    } finally { setEditLoading(false); }
  }

  async function handleConfirmDelete() {
    setDeleteLoading(true);
    try {
      await api.delete(`/mainfile/${deleteRecord._id}`);
      showToast("success", "Record deleted");
      setDeleteRecord(null);
      setRecords(prev => prev.filter(r => r._id !== deleteRecord._id));
    } catch (err) {
      showToast("error", err.response?.data?.message || "Delete failed");
    } finally { setDeleteLoading(false); }
  }

  function handleClearAll() {
    setSelectedYear(""); setFilterType("all");
    setDealerFilter(""); setAppStatus("All Status");
  }

  const hasActiveFilters = selectedYear || filterType !== "all" || dealerFilter || appStatus !== "All Status";

  const MI_FILTERS = [
    { key: "all",       label: "All",        dot: null             },
    { key: "withMI",    label: "With MI",    dot: "bg-emerald-500" },
    { key: "withoutMI", label: "Without MI", dot: "bg-amber-500"   },
    { key: "other",     label: "Other",      dot: "bg-red-500"     },
  ];

  const RECORD_TABS = [
    { key: "all",  label: "All Records"  },
    { key: "atal", label: "Atal Records" },
    { key: "demo", label: "Demo Records" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#f0f2f5]">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-0 left-0 right-0 z-50 flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b
          ${toast.type === "success" ? "bg-emerald-700 text-white border-emerald-900" : "bg-red-700 text-white border-red-900"}`}>
          {toast.type === "success"
            ? <HiOutlineCheckCircle className="w-4 h-4 shrink-0" />
            : <HiOutlineXCircle     className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Top bar */}
      <div className="w-full bg-[#0f172a] px-5 py-0 flex items-center gap-0 border-b border-[#1e293b]">
        <div className="flex items-center gap-2.5 py-3 border-r border-[#1e293b] pr-5 mr-5 shrink-0">
          <TbDatabaseSearch className="w-4 h-4 text-emerald-400" />
          <span className="text-[13px] font-bold text-white tracking-widest uppercase">File Records</span>
        </div>
        <span className="text-[11px] text-slate-500 shrink-0">Manage and filter farmer file records</span>
        <div className="ml-auto flex items-stretch self-stretch">
          {RECORD_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setMainTab("records"); setRecordType(tab.key); }}
              className={`px-5 text-[11px] font-bold uppercase tracking-wider border-b-2 transition self-stretch
                ${mainTab === "records" && recordType === tab.key
                  ? "text-emerald-400 border-emerald-400 bg-[#1e293b]"
                  : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-[#1e293b]/50"}`}>
              {tab.label}
            </button>
          ))}

          {/* ✅ NEW: Summary tab — now a dropdown trigger (Dealer/Farmer Summary) */}
          <SummaryNavDropdown
            active={mainTab === "summary"}
            summaryType={summaryType}
            onSelect={key => { setMainTab("summary"); setSummaryType(key); }}
          />
        </div>
      </div>

      {mainTab === "records" ? (
        <>
          {/* ── Filter strip ── */}
          <div className="w-full bg-white border-b border-slate-100 px-5 py-2.5 flex items-center gap-3 flex-wrap">

            {/* FY */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">FY</span>
              <FinancialYearSelect
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                disabled={loading}
                className="h-8 px-2 text-xs border border-slate-300 bg-white text-slate-700 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="h-5 w-px bg-slate-200" />

            {/* MI Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MI</span>
              <div className="flex border border-slate-300 divide-x divide-slate-300">
                {MI_FILTERS.map(opt => (
                  <button key={opt.key} onClick={() => setFilterType(opt.key)} disabled={loading}
                    className={`h-8 px-3 text-[11px] font-semibold transition disabled:opacity-50 flex items-center gap-1.5
                      ${filterType === opt.key ? "bg-[#0f172a] text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}>
                    {opt.dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${opt.dot}`} />}
                    {opt.label}
                    <span className={`text-[10px] font-mono px-1 py-px leading-none
                      ${filterType === opt.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                      {miCounts[opt.key]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-5 w-px bg-slate-200" />

            {/* ✅ Combined Dealer + Status Popover */}
            <FilterPopover
              dealers={uniqueDealers}
              dealerFilter={dealerFilter}
              setDealerFilter={setDealerFilter}
              statuses={uniqueStatuses}
              appStatus={appStatus}
              setAppStatus={setAppStatus}
              loading={loading}
            />

            <div className="h-5 w-px bg-slate-200" />

            {/* Load + Refresh + Clear */}
            <button onClick={fetchRecords} disabled={loading}
              className="h-8 px-4 bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider
                hover:bg-emerald-800 disabled:opacity-40 transition flex items-center gap-1.5">
              <HiOutlineSearch className={`w-3.5 h-3.5 ${loading ? "animate-pulse" : ""}`} />
              {loading ? "Loading…" : "Load"}
            </button>

            <button onClick={fetchRecords} disabled={loading} title="Refresh"
              className="h-8 w-8 flex items-center justify-center border border-slate-300 bg-white text-slate-400
                hover:text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition">
              <HiOutlineRefresh className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>

            {hasActiveFilters && (
              <button onClick={handleClearAll} disabled={loading}
                className="h-8 px-3 text-[11px] font-semibold text-slate-400 border border-slate-300 bg-white
                  hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1">
                <HiOutlineX className="w-3 h-3" /> Clear All
              </button>
            )}

            {/* Right: count + active chips + export */}
            <div className="ml-auto flex items-center gap-2 flex-wrap">
              {!loading && (
                <span className="text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700">{typeFilteredRecords.length}</span> records
                </span>
              )}

              {selectedYear && (
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 uppercase tracking-wider">
                  FY {selectedYear}
                </span>
              )}
              {filterType === "withMI" && (
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 uppercase tracking-wider">Has MI</span>
              )}
              {filterType === "withoutMI" && (
                <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 uppercase tracking-wider">No MI</span>
              )}
              {filterType === "other" && (
                <span className="text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 uppercase tracking-wider">Other</span>
              )}
              {dealerFilter && (
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 uppercase tracking-wider max-w-[130px] truncate flex items-center gap-1">
                  {dealerFilter}
                  <button onClick={() => setDealerFilter("")} className="hover:text-blue-900 transition shrink-0">
                    <HiOutlineX className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              {appStatus !== "All Status" && (
                <span className="text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 uppercase tracking-wider max-w-[170px] truncate flex items-center gap-1">
                  {appStatus}
                  <button onClick={() => setAppStatus("All Status")} className="hover:text-violet-900 transition shrink-0">
                    <HiOutlineX className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              {recordType !== "all" && (
                <span className={`text-[10px] font-bold border px-2 py-0.5 uppercase tracking-wider
                  ${recordType === "atal" ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-orange-50 text-orange-700 border-orange-200"}`}>
                  {recordType}
                </span>
              )}

              {/* Export — Excel + PDF */}
              {!loading && typeFilteredRecords.length > 0 && (
                <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                  <Excel
                    model="dealer-mainfile-records"
                    fileName={exportTitle}
                    label="Excel"
                    data={exportData}
                    variant="compact"
                  />
                  <Pdf
                    model="dealer-mainfile-records"
                    fileName={exportTitle}
                    label="PDF"
                    data={exportData}
                    variant="compact"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="w-full px-5 py-2 bg-red-700 text-white text-xs font-medium flex items-center gap-2">
              <HiOutlineExclamationCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Table */}
          <div className="w-full p-4">
            <FileRecordTable
              rows={typeFilteredRecords}
              loading={loading}
              onEdit={setEditRecord}
              onDelete={setDeleteRecord}
              recordType={recordType}
            />
          </div>
        </>
      ) : (
        // ✅ NEW: Summary view — reads from the FY-scoped `records` (not
        // typeFilteredRecords), so every dealer's totals show regardless of
        // the MI/dealer/status/atal-demo filters used by the table view.
        <SummarySection records={records} loading={loading} summaryType={summaryType} />
      )}

      {/* Modals */}
      <EditFileModal
        isOpen={!!editRecord}
        record={editRecord}
        onClose={() => setEditRecord(null)}
        onSave={handleSaveEdit}
        loading={editLoading}
      />
      <DeleteConfirm
        isOpen={!!deleteRecord}
        record={deleteRecord}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteRecord(null)}
        loading={deleteLoading}
      />
    </div>
  );
}

export default FileRecord;