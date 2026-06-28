
// import { useState, useMemo } from "react";
// import api from "../../api/axios";
// import { FinancialYearSelect } from "../../components/app";
// import Pdf from "../../components/Pdf";
// import Excel from "../../components/Excel";
// import {
//   HiOutlineRefresh,
//   HiOutlineSearch,
//   HiOutlineX,
//   HiOutlineChevronLeft,
//   HiOutlineChevronRight,
//   HiOutlineSwitchHorizontal,
//   HiOutlineExclamationCircle,
//   HiOutlineArrowUp,
//   HiOutlineArrowDown,
// } from "react-icons/hi";
// import { TbArrowsExchange } from "react-icons/tb";

// const COMPARE_FIELDS = [
//   { label: "Farmer Name",     mainKey: "name",           micadaKey: "farmerName"    },
//   { label: "Irrigation Type", mainKey: "irrigationType",  micadaKey: "programmeName" },
//   { label: "Area (Acre)",     mainKey: "areaInAcre",     micadaKey: "totalArea",  numeric: true },
// ];

// const ROWS_PER_PAGE = 15;

// function normalize(val) { return String(val ?? "").trim().toLowerCase(); }
// function toNumber(val)  { const n = parseFloat(val); return Number.isFinite(n) ? n : null; }

// // ─── Build rows ──────────────────────────────────────────────────────────────
// // Logic:
// //   • Har main record ko micadaMap se match karo (miNumber ↔ appId)
// //   • Match mila → match / mismatch
// //   • Match nahi mila → main_only  (koi bhi condition nahi — cancel ho ya kuch bhi)
// //   • Jo MICADA records kisi bhi main se match nahi hue → micada_only
// //   • Unique row key: index-based taaki duplicate miNumber se conflict na ho
// function buildRows(mainData, micadaData) {
//   // appId → micada record map
//   const micadaMap = {};
//   micadaData.forEach(r => {
//     const k = r.appId?.trim();
//     if (k) micadaMap[k] = r;
//   });

//   const rows = [];
//   const matchedAppIds = new Set();

//   mainData.forEach((r, idx) => {
//     const miKey    = r.miNumber?.trim() ?? "";
//     const micadaRow = miKey ? (micadaMap[miKey] ?? null) : null;

//     if (micadaRow) matchedAppIds.add(micadaRow.appId?.trim());

//     const diffs = micadaRow
//       ? COMPARE_FIELDS
//           .filter(f => normalize(r[f.mainKey]) !== normalize(micadaRow[f.micadaKey]))
//           .map(f => f.mainKey)
//       : [];

//     const status = !micadaRow
//       ? "main_only"
//       : diffs.length > 0
//         ? "mismatch"
//         : "match";

//     rows.push({
//       // ✅ Unique key using index — duplicate miNumber se conflict nahi hoga
//       key:       `main_${idx}`,
//       displayKey: miKey || `NO_MI_${idx}`,
//       mainRow:   r,
//       micadaRow,
//       diffs,
//       status,
//     });
//   });

//   // MICADA-only records
//   micadaData.forEach((r, idx) => {
//     const appId = r.appId?.trim() ?? "";
//     if (!matchedAppIds.has(appId)) {
//       rows.push({
//         key:        `micada_${idx}`,
//         displayKey: appId || `NO_APPID_${idx}`,
//         mainRow:    null,
//         micadaRow:  r,
//         diffs:      [],
//         status:     "micada_only",
//       });
//     }
//   });

//   return rows;
// }

// // ─── Export ──────────────────────────────────────────────────────────────────
// const STATUS_EXPORT_LABEL = {
//   match: "Matched", mismatch: "Mismatch", main_only: "Main Only", micada_only: "MICADA Only",
// };

// function rowsToExportRecords(rows) {
//   return rows.map((row, i) => {
//     const rec = {
//       srNo:          i + 1,
//       miNumberAppId: row.displayKey,
//       status:        STATUS_EXPORT_LABEL[row.status] ?? row.status,
//     };
//     COMPARE_FIELDS.forEach(f => {
//       const mainVal   = row.mainRow?.[f.mainKey];
//       const micadaVal = row.micadaRow?.[f.micadaKey];
//       rec[`${f.label} (Main)`]   = mainVal   ?? "";
//       rec[`${f.label} (MICADA)`] = micadaVal ?? "";
//       if (f.numeric) {
//         const a = toNumber(mainVal), b = toNumber(micadaVal);
//         rec[`${f.label} (Diff)`] = (a !== null && b !== null) ? (b - a).toFixed(2) : "";
//       }
//     });
//     return rec;
//   });
// }

// // ─── UI helpers ──────────────────────────────────────────────────────────────
// const STATUS_META = {
//   match:       { label: "Matched",     cls: "bg-emerald-100 text-emerald-800 border-emerald-300" },
//   mismatch:    { label: "Mismatch",    cls: "bg-red-100    text-red-800    border-red-300"        },
//   main_only:   { label: "Main Only",   cls: "bg-amber-100  text-amber-800  border-amber-300"      },
//   micada_only: { label: "MICADA Only", cls: "bg-blue-100   text-blue-800   border-blue-300"       },
// };

// function StatusBadge({ status }) {
//   const m = STATUS_META[status];
//   return (
//     <span className={`inline-block text-[10px] font-bold uppercase tracking-wider border px-1.5 py-px ${m.cls}`}>
//       {m.label}
//     </span>
//   );
// }

// function InlineDelta({ mainVal, micadaVal }) {
//   const a = toNumber(mainVal), b = toNumber(micadaVal);
//   if (a === null || b === null) return null;
//   const delta = b - a;
//   if (delta === 0) return null;
//   const isUp = delta > 0;
//   const Icon = isUp ? HiOutlineArrowUp : HiOutlineArrowDown;
//   const fmt  = Math.abs(delta).toFixed(2).replace(/\.?0+$/, "") || "0";
//   return (
//     <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ml-1.5 ${isUp ? "text-emerald-600" : "text-red-500"}`}>
//       <Icon className="w-2.5 h-2.5" />{fmt}
//     </span>
//   );
// }

// function CellPair({ mainVal, micadaVal, isDiff, numeric }) {
//   const fmt = v => (v === null || v === undefined || v === "") ? "—" : String(v);
//   if (isDiff) {
//     return (
//       <div className="flex flex-col gap-0.5 min-w-[80px] leading-tight">
//         <span className="text-[11px] text-slate-500 line-through whitespace-nowrap">{fmt(mainVal)}</span>
//         <span className={`text-[12px] text-slate-900 font-semibold whitespace-nowrap flex items-center ${numeric ? "font-mono" : ""}`}>
//           {fmt(micadaVal)}
//           {numeric && <InlineDelta mainVal={mainVal} micadaVal={micadaVal} />}
//         </span>
//       </div>
//     );
//   }
//   return (
//     <span className={`text-[12px] text-slate-800 ${numeric ? "font-mono" : ""}`}>
//       {fmt(mainVal ?? micadaVal)}
//     </span>
//   );
// }

// function pageRange(current, total) {
//   const delta = 1;
//   const range = [];
//   for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) range.push(i);
//   const result = [1];
//   if (range[0] > 2) result.push("...");
//   result.push(...range);
//   if (range[range.length - 1] < total - 1) result.push("...");
//   if (total > 1) result.push(total);
//   return result;
// }

// // ─── Main component ──────────────────────────────────────────────────────────
// function MicadaComparison() {
//   const [financialYear, setFinancialYear] = useState("");
//   const [mainData,      setMainData]      = useState([]);
//   const [micadaData,    setMicadaData]    = useState([]);
//   const [loadingMain,   setLoadingMain]   = useState(false);
//   const [loadingMicada, setLoadingMicada] = useState(false);
//   const [mainLoaded,    setMainLoaded]    = useState(false);
//   const [micadaLoaded,  setMicadaLoaded]  = useState(false);
//   const [errorMsg,      setErrorMsg]      = useState(null);
//   const [filterStatus,  setFilterStatus]  = useState("all");
//   const [search,        setSearch]        = useState("");
//   const [page,          setPage]          = useState(1);

//   const handleLoadMain = async () => {
//     setLoadingMain(true); setErrorMsg(null);
//     try {
//       const params = { limit: 0 };
//       if (financialYear) params.financialYear = financialYear;
//       const res = await api.get("/mainfile", { params });
//       setMainData(res.data?.data ?? []);
//       setMainLoaded(true);
//     } catch (err) {
//       setErrorMsg(err.response?.data?.message || "Main Sheet load failed");
//     } finally { setLoadingMain(false); }
//   };

//   const handleLoadMicada = async () => {
//     setLoadingMicada(true); setErrorMsg(null);
//     try {
//       const params = { limit: 0 };
//       if (financialYear) params.financialYear = financialYear;
//       const res = await api.get("/micada", { params });
//       setMicadaData(res.data?.data ?? []);
//       setMicadaLoaded(true);
//     } catch (err) {
//       setErrorMsg(err.response?.data?.message || "MICADA load failed");
//     } finally { setLoadingMicada(false); }
//   };

//   const handleLoadBoth = () => { handleLoadMain(); handleLoadMicada(); };

//   const bothLoaded = mainLoaded && micadaLoaded;

//   // Step 1 — Build all rows
//   const allRows = useMemo(
//     () => bothLoaded ? buildRows(mainData, micadaData) : [],
//     [mainData, micadaData, mainLoaded, micadaLoaded]
//   );

//   // Step 2 — Summary counts
//   const summary = useMemo(() => ({
//     all:         allRows.length,
//     match:       allRows.filter(r => r.status === "match").length,
//     mismatch:    allRows.filter(r => r.status === "mismatch").length,
//     main_only:   allRows.filter(r => r.status === "main_only").length,
//     micada_only: allRows.filter(r => r.status === "micada_only").length,
//   }), [allRows]);

//   // Step 3 — Filter by status AND search
//   const filtered = useMemo(() => {
//     // ✅ Status filter — strictly by row.status
//     const byStatus = filterStatus === "all"
//       ? allRows
//       : allRows.filter(row => row.status === filterStatus);

//     const q = search.trim().toLowerCase();
//     if (!q) return byStatus;

//     return byStatus.filter(row =>
//       [row.mainRow, row.micadaRow].filter(Boolean).some(rec =>
//         Object.values(rec).some(v => String(v ?? "").toLowerCase().includes(q))
//       )
//     );
//   }, [allRows, filterStatus, search]);

//   // Step 4 — Area stats on filtered rows
//   const areaStats = useMemo(() => {
//     let mainTotal = 0, micadaTotal = 0, netDiff = 0;
//     filtered.forEach(row => {
//       const a = toNumber(row.mainRow?.areaInAcre);
//       const b = toNumber(row.micadaRow?.totalArea);
//       if (a !== null) mainTotal   += a;
//       if (b !== null) micadaTotal += b;
//       if (a !== null && b !== null) netDiff += (b - a);
//     });
//     return { mainTotal, micadaTotal, netDiff };
//   }, [filtered]);

//   // Step 5 — Pagination
//   const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
//   const safePage   = Math.min(page, totalPages);
//   const start      = (safePage - 1) * ROWS_PER_PAGE;
//   const pageRows   = filtered.slice(start, start + ROWS_PER_PAGE);

//   // Step 6 — Export
//   const exportTitle   = `MICADA_Comparison${financialYear ? `_${financialYear}` : "_All"}`;
//   const exportRecords = useMemo(() => rowsToExportRecords(filtered), [filtered]);
//   const exportData    = { title: exportTitle.replace(/_/g, " "), records: exportRecords };

//   const STAT_TABS = [
//     { key: "all",         label: "Total",       dot: "bg-slate-500"   },
//     { key: "match",       label: "Matched",     dot: "bg-emerald-500" },
//     { key: "mismatch",    label: "Mismatch",    dot: "bg-red-500"     },
//     { key: "main_only",   label: "Main Only",   dot: "bg-amber-500"   },
//     { key: "micada_only", label: "MICADA Only", dot: "bg-blue-500"    },
//   ];

//   return (
//     <div className="w-full min-h-screen bg-[#f0f2f5]">

//       {/* ── Header ── */}
//       <div className="w-full bg-white border-b border-slate-200 px-5 flex flex-wrap items-center gap-x-5 gap-y-0">
//         <div className="flex items-center gap-2.5 py-3 border-r border-slate-200 pr-5 mr-1 shrink-0">
//           <TbArrowsExchange className="w-4 h-4 text-emerald-600 shrink-0" />
//           <div>
//             <div className="text-[13px] font-bold text-slate-900 tracking-widest uppercase leading-tight">MICADA Comparison</div>
//             <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Cross-verify Main Sheet data against MICADA portal</div>
//           </div>
//         </div>

//         {/* FY select */}
//         <div className="flex items-center gap-2 py-3">
//           <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">FY</span>
//           <FinancialYearSelect
//             value={financialYear}
//             onChange={e => {
//               setFinancialYear(e.target.value);
//               setMainLoaded(false);
//               setMicadaLoaded(false);
//             }}
//             className="h-7 px-2 text-xs bg-white text-slate-900 border border-slate-300 focus:outline-none focus:border-slate-600"
//           />
//           {financialYear && (
//             <button
//               onClick={() => { setFinancialYear(""); setMainLoaded(false); setMicadaLoaded(false); }}
//               className="h-7 w-7 flex items-center justify-center border border-slate-300 text-slate-400 hover:text-red-500 hover:border-red-300 transition"
//               title="Clear FY"
//             >
//               <HiOutlineX className="w-3.5 h-3.5" />
//             </button>
//           )}
//         </div>

//         <div className="h-4 w-px bg-slate-200 shrink-0" />

//         {/* Main Sheet button */}
//         <button
//           onClick={handleLoadMain}
//           disabled={loadingMain}
//           className="flex items-center gap-2 text-[11px] font-semibold disabled:opacity-30 group py-3"
//         >
//           <HiOutlineRefresh className={`w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-600 ${loadingMain ? "animate-spin text-emerald-600" : ""}`} />
//           <span className="text-slate-600 group-hover:text-slate-900 transition">Main Sheet</span>
//           <span className={`font-mono font-bold text-xs px-1.5 py-px border ${mainLoaded ? "text-emerald-700 border-emerald-300 bg-emerald-50" : "text-slate-600 border-slate-200 bg-slate-50"}`}>
//             {mainLoaded ? mainData.length : "—"}
//           </span>
//         </button>

//         <div className="h-4 w-px bg-slate-200 shrink-0" />

//         {/* MICADA button */}
//         <button
//           onClick={handleLoadMicada}
//           disabled={loadingMicada}
//           className="flex items-center gap-2 text-[11px] font-semibold disabled:opacity-30 group py-3"
//         >
//           <HiOutlineRefresh className={`w-3.5 h-3.5 text-slate-600 group-hover:text-blue-600 ${loadingMicada ? "animate-spin text-blue-600" : ""}`} />
//           <span className="text-slate-600 group-hover:text-slate-900 transition">MICADA</span>
//           <span className={`font-mono font-bold text-xs px-1.5 py-px border ${micadaLoaded ? "text-blue-700 border-blue-300 bg-blue-50" : "text-slate-600 border-slate-200 bg-slate-50"}`}>
//             {micadaLoaded ? micadaData.length : "—"}
//           </span>
//         </button>

//         {/* Sync Both */}
//         <button
//           onClick={handleLoadBoth}
//           disabled={loadingMain || loadingMicada}
//           className="ml-auto flex items-center gap-1.5 text-[11px] font-bold bg-slate-900 text-white px-4 py-1.5 hover:bg-slate-700 disabled:opacity-30 transition shrink-0"
//         >
//           <HiOutlineRefresh className={`w-3.5 h-3.5 ${(loadingMain || loadingMicada) ? "animate-spin" : ""}`} />
//           Sync Both
//         </button>
//       </div>

//       {/* ── Error ── */}
//       {errorMsg && (
//         <div className="w-full flex items-center gap-2 text-xs font-medium text-white bg-red-700 px-5 py-2">
//           <HiOutlineExclamationCircle className="w-4 h-4 shrink-0" />
//           {errorMsg}
//         </div>
//       )}

//       {/* ── Stat strip ── */}
//       <div className="w-full bg-white border-b border-slate-200 px-5 flex flex-wrap items-stretch">
//         {STAT_TABS.map(s => (
//           <button
//             key={s.key}
//             onClick={() => { setFilterStatus(s.key); setPage(1); }}
//             className={`flex items-center gap-2 px-5 py-3 border-r border-slate-100 transition
//               ${filterStatus === s.key ? "bg-[#0f172a] text-white" : "hover:bg-slate-50 text-slate-800"}`}
//           >
//             <span className={`w-2 h-2 shrink-0 ${s.dot}`} />
//             <span className={`text-sm font-bold tabular-nums ${filterStatus === s.key ? "text-white" : "text-slate-900"}`}>
//               {summary[s.key]}
//             </span>
//             <span className={`text-[10px] font-bold uppercase tracking-widest ${filterStatus === s.key ? "text-slate-300" : "text-slate-500"}`}>
//               {s.label}
//             </span>
//           </button>
//         ))}

//         {/* Area stats */}
//         {bothLoaded && (
//           <div className="ml-auto flex items-center gap-4 px-5 py-3 text-xs font-semibold">
//             <div className="flex items-center gap-1.5 text-slate-600">
//               <span>Main:</span>
//               <span className="font-mono text-slate-800 font-bold">{areaStats.mainTotal.toFixed(2)} ac</span>
//             </div>
//             <div className="flex items-center gap-1.5 text-slate-600 border-l border-slate-200 pl-4">
//               <span>MICADA:</span>
//               <span className="font-mono text-slate-800 font-bold">{areaStats.micadaTotal.toFixed(2)} ac</span>
//             </div>
//             <div className="flex items-center gap-1.5 text-slate-600 border-l border-slate-200 pl-4">
//               <span>Net:</span>
//               {areaStats.netDiff < 0
//                 ? <HiOutlineArrowDown className="w-3.5 h-3.5 text-red-500" />
//                 : <HiOutlineArrowUp   className="w-3.5 h-3.5 text-emerald-600" />}
//               <span className={`font-mono font-bold ${areaStats.netDiff < 0 ? "text-red-500" : areaStats.netDiff > 0 ? "text-emerald-600" : "text-slate-600"}`}>
//                 {Math.abs(areaStats.netDiff).toFixed(2)} ac
//               </span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── Filter / search / export row ── */}
//       <div className="w-full bg-white border-b border-slate-200 px-5 py-2 flex flex-wrap items-center gap-3">
//         <div className="flex items-center gap-3">
//           <span className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Comparison Result</span>
//           {bothLoaded && (
//             <span className="text-[10px] text-slate-500 font-mono border border-slate-200 px-1.5 py-px">
//               miNumber ↔ appId
//             </span>
//           )}
//           {bothLoaded && (
//             <span className={`text-[10px] font-bold border px-2 py-px uppercase tracking-wider
//               ${financialYear ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-300"}`}>
//               {financialYear ? `FY ${financialYear}` : "All Years"}
//             </span>
//           )}
//         </div>
//         <div className="ml-auto flex items-center gap-2">
//           <div className="relative flex items-center">
//             <HiOutlineSearch className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
//             <input
//               value={search}
//               onChange={e => { setSearch(e.target.value); setPage(1); }}
//               placeholder="Search farmer..."
//               className="pl-8 pr-7 h-7 text-xs border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0f172a] w-44 transition"
//             />
//             {search && (
//               <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-2 text-slate-400 hover:text-slate-700">
//                 <HiOutlineX className="w-3 h-3" />
//               </button>
//             )}
//           </div>
//           {bothLoaded && filtered.length > 0 && (
//             <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
//               <Excel model="main-micada-comparision" fileName={exportTitle} label="Excel" data={exportData} variant="compact" />
//               <Pdf   model="main-micada-comparision" fileName={exportTitle} label="PDF"   data={exportData} variant="compact" />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Legend ── */}
//       <div className="w-full bg-[#fafafa] border-b border-slate-200 px-5 py-1.5 flex flex-wrap items-center gap-5">
//         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Legend</span>
//         <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
//           <span className="inline-block w-2.5 h-2.5 border border-slate-300 bg-slate-200" />Main Sheet (old)
//         </span>
//         <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
//           <span className="inline-block w-2.5 h-2.5 bg-slate-700" />MICADA (new)
//         </span>
//         <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
//           <span className="inline-block w-2.5 h-2.5 bg-yellow-200 border border-yellow-300" />Changed cell
//         </span>
//         <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
//           <HiOutlineArrowDown className="w-3 h-3 text-red-500" />
//           <HiOutlineArrowUp   className="w-3 h-3 text-emerald-600" />
//           Net acre change
//         </span>
//       </div>

//       {/* ── Empty state ── */}
//       {!bothLoaded ? (
//         <div className="w-full py-24 text-center bg-white border-x border-slate-200">
//           <HiOutlineSwitchHorizontal className="w-10 h-10 text-slate-400 mx-auto mb-3" />
//           <p className="text-sm font-semibold text-slate-800">Load both datasets to compare.</p>
//           <p className="text-xs text-slate-500 mt-1">FY select karna optional hai — bina FY ke sab records compare honge.</p>
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="w-full py-16 text-center text-xs text-slate-500 uppercase tracking-widest bg-white border-x border-slate-200">
//           No records found
//         </div>
//       ) : (
//         <>
//           {/* ── Table ── */}
//           <div className="w-full overflow-x-auto border border-slate-200 bg-white">
//             <table className="w-full text-xs border-collapse" style={{ minWidth: "900px" }}>
//               <thead>
//                 <tr className="bg-[#0f172a]">
//                   <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-300 border-r border-[#1e293b] w-10">#</th>
//                   <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-300 border-r border-[#1e293b] whitespace-nowrap">MI No. / App ID</th>
//                   <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-300 border-r border-[#1e293b]">Status</th>
//                   {COMPARE_FIELDS.map(f => (
//                     <th key={f.mainKey} className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-300 border-r border-[#1e293b] last:border-r-0 whitespace-nowrap">
//                       {f.label}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {pageRows.map((row, i) => {
//                   const rowBg =
//                     row.status === "mismatch"    ? "bg-red-50/40"   :
//                     row.status === "main_only"   ? "bg-amber-50/40" :
//                     row.status === "micada_only" ? "bg-blue-50/40"  :
//                     i % 2 !== 0                  ? "bg-slate-50/60" : "bg-white";
//                   return (
//                     <tr key={row.key} className={`${rowBg} border-b border-slate-100 hover:brightness-95 transition`}>
//                       <td className="px-3 py-2 text-slate-500 border-r border-slate-100">{start + i + 1}</td>
//                       <td className="px-3 py-2 font-mono font-semibold text-slate-800 border-r border-slate-100 whitespace-nowrap">
//                         {row.displayKey}
//                       </td>
//                       <td className="px-3 py-2 border-r border-slate-100 whitespace-nowrap">
//                         <StatusBadge status={row.status} />
//                       </td>
//                       {COMPARE_FIELDS.map(f => {
//                         const isDiff = row.diffs.includes(f.mainKey);
//                         return (
//                           <td key={f.mainKey} className={`px-3 py-2 border-r border-slate-100 last:border-r-0 ${isDiff ? "bg-yellow-50" : ""}`}>
//                             <CellPair
//                               mainVal={row.mainRow?.[f.mainKey]}
//                               micadaVal={row.micadaRow?.[f.micadaKey]}
//                               isDiff={isDiff}
//                               numeric={f.numeric}
//                             />
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* ── Pagination ── */}
//           {totalPages > 1 && (
//             <div className="w-full bg-white border border-t-0 border-slate-200 px-4 py-2 flex items-center justify-between flex-wrap gap-2">
//               <span className="text-[11px] text-slate-500">
//                 Rows{" "}
//                 <span className="font-semibold text-slate-800">{start + 1}–{Math.min(start + ROWS_PER_PAGE, filtered.length)}</span>
//                 {" "}/ <span className="font-semibold text-slate-800">{filtered.length}</span>
//               </span>
//               <div className="flex items-center gap-0.5">
//                 <button
//                   onClick={() => setPage(p => Math.max(1, p - 1))}
//                   disabled={safePage === 1}
//                   className="h-6 w-6 flex items-center justify-center border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition"
//                 >
//                   <HiOutlineChevronLeft className="w-3.5 h-3.5" />
//                 </button>
//                 {pageRange(safePage, totalPages).map((p, idx) =>
//                   p === "..." ? (
//                     <span key={`el-${idx}`} className="h-6 w-6 flex items-center justify-center text-[11px] text-slate-500">…</span>
//                   ) : (
//                     <button
//                       key={p}
//                       onClick={() => setPage(p)}
//                       className={`h-6 min-w-[24px] px-1 text-[11px] font-semibold border transition
//                         ${safePage === p ? "bg-[#0f172a] text-white border-[#0f172a]" : "bg-white text-slate-800 border-slate-300 hover:bg-slate-100"}`}
//                     >
//                       {p}
//                     </button>
//                   )
//                 )}
//                 <button
//                   onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                   disabled={safePage === totalPages}
//                   className="h-6 w-6 flex items-center justify-center border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition"
//                 >
//                   <HiOutlineChevronRight className="w-3.5 h-3.5" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default MicadaComparison;











import { useState, useMemo } from "react";
import api from "../../api/axios";
import { FinancialYearSelect } from "../../components/app";
import Pdf from "../../components/Pdf";
import Excel from "../../components/Excel";
import {
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineSwitchHorizontal,
  HiOutlineExclamationCircle,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
} from "react-icons/hi";
import { TbArrowsExchange } from "react-icons/tb";

const COMPARE_FIELDS = [
  { label: "Farmer Name",     mainKey: "name",          micadaKey: "farmerName",    numeric: false },
  { label: "Irrigation Type", mainKey: "irrigationType", micadaKey: "programmeName", numeric: false },
  { label: "Area (Acre)",     mainKey: "areaInAcre",    micadaKey: "totalArea",     numeric: true  },
];

const ROWS_PER_PAGE = 15;

// ── Normalize helpers — must match backend syncMismatchErrors logic exactly ──
function normalizeStr(val) {
  return String(val ?? "").trim().toLowerCase();
}

// 4.73  vs 4.7375 → 4.7300 vs 4.7375 → MISMATCH ✅
// 3     vs 2      → 3.0000 vs 2.0000 → MISMATCH ✅
// null  vs 3      → null   vs 3.0000 → MISMATCH ✅
// null  vs null   → null   vs null   → MATCH    ✅
function normalizeNum(val) {
  const n = parseFloat(val);
  if (isNaN(n)) return null;
  return parseFloat(n.toFixed(4));
}

function fieldMismatch(mainVal, micadaVal, numeric) {
  if (numeric) {
    return normalizeNum(mainVal) !== normalizeNum(micadaVal);
  }
  return normalizeStr(mainVal) !== normalizeStr(micadaVal);
}

function toNumber(val) { const n = parseFloat(val); return Number.isFinite(n) ? n : null; }

// ─── Build rows ──────────────────────────────────────────────────────────────
function buildRows(mainData, micadaData) {
  const micadaMap = {};
  micadaData.forEach(r => {
    const k = r.appId?.trim();
    if (k) micadaMap[k] = r;
  });

  const rows = [];
  const matchedAppIds = new Set();

  mainData.forEach((r, idx) => {
    const miKey     = r.miNumber?.trim() ?? "";
    const micadaRow = miKey ? (micadaMap[miKey] ?? null) : null;

    if (micadaRow) matchedAppIds.add(micadaRow.appId?.trim());

    // ✅ fieldMismatch — same logic as backend
    const diffs = micadaRow
      ? COMPARE_FIELDS
          .filter(f => fieldMismatch(r[f.mainKey], micadaRow[f.micadaKey], f.numeric))
          .map(f => f.mainKey)
      : [];

    const status = !micadaRow
      ? "main_only"
      : diffs.length > 0
        ? "mismatch"
        : "match";

    rows.push({
      key:        `main_${idx}`,
      displayKey: miKey || `NO_MI_${idx}`,
      mainRow:    r,
      micadaRow,
      diffs,
      status,
    });
  });

  // MICADA-only records
  micadaData.forEach((r, idx) => {
    const appId = r.appId?.trim() ?? "";
    if (!matchedAppIds.has(appId)) {
      rows.push({
        key:        `micada_${idx}`,
        displayKey: appId || `NO_APPID_${idx}`,
        mainRow:    null,
        micadaRow:  r,
        diffs:      [],
        status:     "micada_only",
      });
    }
  });

  return rows;
}

// ─── Export ──────────────────────────────────────────────────────────────────
const STATUS_EXPORT_LABEL = {
  match: "Matched", mismatch: "Mismatch", main_only: "Main Only", micada_only: "MICADA Only",
};

function rowsToExportRecords(rows) {
  return rows.map((row, i) => {
    const rec = {
      srNo:          i + 1,
      miNumberAppId: row.displayKey,
      status:        STATUS_EXPORT_LABEL[row.status] ?? row.status,
    };
    COMPARE_FIELDS.forEach(f => {
      const mainVal   = row.mainRow?.[f.mainKey];
      const micadaVal = row.micadaRow?.[f.micadaKey];
      rec[`${f.label} (Main)`]   = mainVal   ?? "";
      rec[`${f.label} (MICADA)`] = micadaVal ?? "";
      if (f.numeric) {
        const a = toNumber(mainVal), b = toNumber(micadaVal);
        rec[`${f.label} (Diff)`] = (a !== null && b !== null) ? (b - a).toFixed(2) : "";
      }
    });
    return rec;
  });
}

// ─── UI helpers ──────────────────────────────────────────────────────────────
const STATUS_META = {
  match:       { label: "Matched",     cls: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  mismatch:    { label: "Mismatch",    cls: "bg-red-100    text-red-800    border-red-300"        },
  main_only:   { label: "Main Only",   cls: "bg-amber-100  text-amber-800  border-amber-300"      },
  micada_only: { label: "MICADA Only", cls: "bg-blue-100   text-blue-800   border-blue-300"       },
};

function StatusBadge({ status }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider border px-1.5 py-px ${m.cls}`}>
      {m.label}
    </span>
  );
}

function InlineDelta({ mainVal, micadaVal }) {
  const a = toNumber(mainVal), b = toNumber(micadaVal);
  if (a === null || b === null) return null;
  const delta = b - a;
  if (delta === 0) return null;
  const isUp = delta > 0;
  const Icon = isUp ? HiOutlineArrowUp : HiOutlineArrowDown;
  const fmt  = Math.abs(delta).toFixed(2).replace(/\.?0+$/, "") || "0";
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ml-1.5 ${isUp ? "text-emerald-600" : "text-red-500"}`}>
      <Icon className="w-2.5 h-2.5" />{fmt}
    </span>
  );
}

function CellPair({ mainVal, micadaVal, isDiff, numeric }) {
  const fmt = v => (v === null || v === undefined || v === "") ? "—" : String(v);
  if (isDiff) {
    return (
      <div className="flex flex-col gap-0.5 min-w-[80px] leading-tight">
        <span className="text-[11px] text-slate-500 line-through whitespace-nowrap">{fmt(mainVal)}</span>
        <span className={`text-[12px] text-slate-900 font-semibold whitespace-nowrap flex items-center ${numeric ? "font-mono" : ""}`}>
          {fmt(micadaVal)}
          {numeric && <InlineDelta mainVal={mainVal} micadaVal={micadaVal} />}
        </span>
      </div>
    );
  }
  return (
    <span className={`text-[12px] text-slate-800 ${numeric ? "font-mono" : ""}`}>
      {fmt(mainVal ?? micadaVal)}
    </span>
  );
}

function pageRange(current, total) {
  const delta = 1;
  const range = [];
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) range.push(i);
  const result = [1];
  if (range[0] > 2) result.push("...");
  result.push(...range);
  if (range[range.length - 1] < total - 1) result.push("...");
  if (total > 1) result.push(total);
  return result;
}

// ─── Main component ──────────────────────────────────────────────────────────
function MicadaComparison() {
  const [financialYear, setFinancialYear] = useState("");
  const [mainData,      setMainData]      = useState([]);
  const [micadaData,    setMicadaData]    = useState([]);
  const [loadingMain,   setLoadingMain]   = useState(false);
  const [loadingMicada, setLoadingMicada] = useState(false);
  const [mainLoaded,    setMainLoaded]    = useState(false);
  const [micadaLoaded,  setMicadaLoaded]  = useState(false);
  const [errorMsg,      setErrorMsg]      = useState(null);
  const [filterStatus,  setFilterStatus]  = useState("all");
  const [search,        setSearch]        = useState("");
  const [page,          setPage]          = useState(1);

  const handleLoadMain = async () => {
    setLoadingMain(true); setErrorMsg(null);
    try {
      const params = { limit: 0 };
      if (financialYear) params.financialYear = financialYear;
      const res = await api.get("/mainfile", { params });
      setMainData(res.data?.data ?? []);
      setMainLoaded(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Main Sheet load failed");
    } finally { setLoadingMain(false); }
  };

  const handleLoadMicada = async () => {
    setLoadingMicada(true); setErrorMsg(null);
    try {
      const params = { limit: 0 };
      if (financialYear) params.financialYear = financialYear;
      const res = await api.get("/micada", { params });
      setMicadaData(res.data?.data ?? []);
      setMicadaLoaded(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "MICADA load failed");
    } finally { setLoadingMicada(false); }
  };

  const handleLoadBoth = () => { handleLoadMain(); handleLoadMicada(); };

  const bothLoaded = mainLoaded && micadaLoaded;

  const allRows = useMemo(
    () => bothLoaded ? buildRows(mainData, micadaData) : [],
    [mainData, micadaData, mainLoaded, micadaLoaded]
  );

  const summary = useMemo(() => ({
    all:         allRows.length,
    match:       allRows.filter(r => r.status === "match").length,
    mismatch:    allRows.filter(r => r.status === "mismatch").length,
    main_only:   allRows.filter(r => r.status === "main_only").length,
    micada_only: allRows.filter(r => r.status === "micada_only").length,
  }), [allRows]);

  const filtered = useMemo(() => {
    const byStatus = filterStatus === "all"
      ? allRows
      : allRows.filter(row => row.status === filterStatus);

    const q = search.trim().toLowerCase();
    if (!q) return byStatus;

    return byStatus.filter(row =>
      [row.mainRow, row.micadaRow].filter(Boolean).some(rec =>
        Object.values(rec).some(v => String(v ?? "").toLowerCase().includes(q))
      )
    );
  }, [allRows, filterStatus, search]);

  const areaStats = useMemo(() => {
    let mainTotal = 0, micadaTotal = 0, netDiff = 0;
    filtered.forEach(row => {
      const a = toNumber(row.mainRow?.areaInAcre);
      const b = toNumber(row.micadaRow?.totalArea);
      if (a !== null) mainTotal   += a;
      if (b !== null) micadaTotal += b;
      if (a !== null && b !== null) netDiff += (b - a);
    });
    return { mainTotal, micadaTotal, netDiff };
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const start      = (safePage - 1) * ROWS_PER_PAGE;
  const pageRows   = filtered.slice(start, start + ROWS_PER_PAGE);

  const exportTitle   = `MICADA_Comparison${financialYear ? `_${financialYear}` : "_All"}`;
  const exportRecords = useMemo(() => rowsToExportRecords(filtered), [filtered]);
  const exportData    = { title: exportTitle.replace(/_/g, " "), records: exportRecords };

  const STAT_TABS = [
    { key: "all",         label: "Total",       dot: "bg-slate-500"   },
    { key: "match",       label: "Matched",     dot: "bg-emerald-500" },
    { key: "mismatch",    label: "Mismatch",    dot: "bg-red-500"     },
    { key: "main_only",   label: "Main Only",   dot: "bg-amber-500"   },
    { key: "micada_only", label: "MICADA Only", dot: "bg-blue-500"    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#f0f2f5]">

      {/* ── Header ── */}
      <div className="w-full bg-white border-b border-slate-200 px-5 flex flex-wrap items-center gap-x-5 gap-y-0">
        <div className="flex items-center gap-2.5 py-3 border-r border-slate-200 pr-5 mr-1 shrink-0">
          <TbArrowsExchange className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <div className="text-[13px] font-bold text-slate-900 tracking-widest uppercase leading-tight">MICADA Comparison</div>
            <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Cross-verify Main Sheet data against MICADA portal</div>
          </div>
        </div>

        <div className="flex items-center gap-2 py-3">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">FY</span>
          <FinancialYearSelect
            value={financialYear}
            onChange={e => {
              setFinancialYear(e.target.value);
              setMainLoaded(false);
              setMicadaLoaded(false);
            }}
            className="h-7 px-2 text-xs bg-white text-slate-900 border border-slate-300 focus:outline-none focus:border-slate-600"
          />
          {financialYear && (
            <button
              onClick={() => { setFinancialYear(""); setMainLoaded(false); setMicadaLoaded(false); }}
              className="h-7 w-7 flex items-center justify-center border border-slate-300 text-slate-400 hover:text-red-500 hover:border-red-300 transition"
              title="Clear FY"
            >
              <HiOutlineX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="h-4 w-px bg-slate-200 shrink-0" />

        <button
          onClick={handleLoadMain}
          disabled={loadingMain}
          className="flex items-center gap-2 text-[11px] font-semibold disabled:opacity-30 group py-3"
        >
          <HiOutlineRefresh className={`w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-600 ${loadingMain ? "animate-spin text-emerald-600" : ""}`} />
          <span className="text-slate-600 group-hover:text-slate-900 transition">Main Sheet</span>
          <span className={`font-mono font-bold text-xs px-1.5 py-px border ${mainLoaded ? "text-emerald-700 border-emerald-300 bg-emerald-50" : "text-slate-600 border-slate-200 bg-slate-50"}`}>
            {mainLoaded ? mainData.length : "—"}
          </span>
        </button>

        <div className="h-4 w-px bg-slate-200 shrink-0" />

        <button
          onClick={handleLoadMicada}
          disabled={loadingMicada}
          className="flex items-center gap-2 text-[11px] font-semibold disabled:opacity-30 group py-3"
        >
          <HiOutlineRefresh className={`w-3.5 h-3.5 text-slate-600 group-hover:text-blue-600 ${loadingMicada ? "animate-spin text-blue-600" : ""}`} />
          <span className="text-slate-600 group-hover:text-slate-900 transition">MICADA</span>
          <span className={`font-mono font-bold text-xs px-1.5 py-px border ${micadaLoaded ? "text-blue-700 border-blue-300 bg-blue-50" : "text-slate-600 border-slate-200 bg-slate-50"}`}>
            {micadaLoaded ? micadaData.length : "—"}
          </span>
        </button>

        <button
          onClick={handleLoadBoth}
          disabled={loadingMain || loadingMicada}
          className="ml-auto flex items-center gap-1.5 text-[11px] font-bold bg-slate-900 text-white px-4 py-1.5 hover:bg-slate-700 disabled:opacity-30 transition shrink-0"
        >
          <HiOutlineRefresh className={`w-3.5 h-3.5 ${(loadingMain || loadingMicada) ? "animate-spin" : ""}`} />
          Sync Both
        </button>
      </div>

      {errorMsg && (
        <div className="w-full flex items-center gap-2 text-xs font-medium text-white bg-red-700 px-5 py-2">
          <HiOutlineExclamationCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* ── Stat strip ── */}
      <div className="w-full bg-white border-b border-slate-200 px-5 flex flex-wrap items-stretch">
        {STAT_TABS.map(s => (
          <button
            key={s.key}
            onClick={() => { setFilterStatus(s.key); setPage(1); }}
            className={`flex items-center gap-2 px-5 py-3 border-r border-slate-100 transition
              ${filterStatus === s.key ? "bg-[#0f172a] text-white" : "hover:bg-slate-50 text-slate-800"}`}
          >
            <span className={`w-2 h-2 shrink-0 ${s.dot}`} />
            <span className={`text-sm font-bold tabular-nums ${filterStatus === s.key ? "text-white" : "text-slate-900"}`}>
              {summary[s.key]}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${filterStatus === s.key ? "text-slate-300" : "text-slate-500"}`}>
              {s.label}
            </span>
          </button>
        ))}

        {bothLoaded && (
          <div className="ml-auto flex items-center gap-4 px-5 py-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span>Main:</span>
              <span className="font-mono text-slate-800 font-bold">{areaStats.mainTotal.toFixed(2)} ac</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 border-l border-slate-200 pl-4">
              <span>MICADA:</span>
              <span className="font-mono text-slate-800 font-bold">{areaStats.micadaTotal.toFixed(2)} ac</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 border-l border-slate-200 pl-4">
              <span>Net:</span>
              {areaStats.netDiff < 0
                ? <HiOutlineArrowDown className="w-3.5 h-3.5 text-red-500" />
                : <HiOutlineArrowUp   className="w-3.5 h-3.5 text-emerald-600" />}
              <span className={`font-mono font-bold ${areaStats.netDiff < 0 ? "text-red-500" : areaStats.netDiff > 0 ? "text-emerald-600" : "text-slate-600"}`}>
                {Math.abs(areaStats.netDiff).toFixed(2)} ac
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Filter / search / export row ── */}
      <div className="w-full bg-white border-b border-slate-200 px-5 py-2 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Comparison Result</span>
          {bothLoaded && (
            <span className="text-[10px] text-slate-500 font-mono border border-slate-200 px-1.5 py-px">
              miNumber ↔ appId
            </span>
          )}
          {bothLoaded && (
            <span className={`text-[10px] font-bold border px-2 py-px uppercase tracking-wider
              ${financialYear ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-300"}`}>
              {financialYear ? `FY ${financialYear}` : "All Years"}
            </span>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative flex items-center">
            <HiOutlineSearch className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search farmer..."
              className="pl-8 pr-7 h-7 text-xs border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0f172a] w-44 transition"
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-2 text-slate-400 hover:text-slate-700">
                <HiOutlineX className="w-3 h-3" />
              </button>
            )}
          </div>
          {bothLoaded && filtered.length > 0 && (
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <Excel model="main-micada-comparision" fileName={exportTitle} label="Excel" data={exportData} variant="compact" />
              <Pdf   model="main-micada-comparision" fileName={exportTitle} label="PDF"   data={exportData} variant="compact" />
            </div>
          )}
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="w-full bg-[#fafafa] border-b border-slate-200 px-5 py-1.5 flex flex-wrap items-center gap-5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Legend</span>
        <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
          <span className="inline-block w-2.5 h-2.5 border border-slate-300 bg-slate-200" />Main Sheet (old)
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
          <span className="inline-block w-2.5 h-2.5 bg-slate-700" />MICADA (new)
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
          <span className="inline-block w-2.5 h-2.5 bg-yellow-200 border border-yellow-300" />Changed cell
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
          <HiOutlineArrowDown className="w-3 h-3 text-red-500" />
          <HiOutlineArrowUp   className="w-3 h-3 text-emerald-600" />
          Net acre change
        </span>
      </div>

      {/* ── Empty state ── */}
      {!bothLoaded ? (
        <div className="w-full py-24 text-center bg-white border-x border-slate-200">
          <HiOutlineSwitchHorizontal className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-800">Load both datasets to compare.</p>
          <p className="text-xs text-slate-500 mt-1">FY select karna optional hai — bina FY ke sab records compare honge.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="w-full py-16 text-center text-xs text-slate-500 uppercase tracking-widest bg-white border-x border-slate-200">
          No records found
        </div>
      ) : (
        <>
          {/* ── Table ── */}
          <div className="w-full overflow-x-auto border border-slate-200 bg-white">
            <table className="w-full text-xs border-collapse" style={{ minWidth: "900px" }}>
              <thead>
                <tr className="bg-[#0f172a]">
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-300 border-r border-[#1e293b] w-10">#</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-300 border-r border-[#1e293b] whitespace-nowrap">MI No. / App ID</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-300 border-r border-[#1e293b]">Status</th>
                  {COMPARE_FIELDS.map(f => (
                    <th key={f.mainKey} className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-300 border-r border-[#1e293b] last:border-r-0 whitespace-nowrap">
                      {f.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, i) => {
                  const rowBg =
                    row.status === "mismatch"    ? "bg-red-50/40"   :
                    row.status === "main_only"   ? "bg-amber-50/40" :
                    row.status === "micada_only" ? "bg-blue-50/40"  :
                    i % 2 !== 0                  ? "bg-slate-50/60" : "bg-white";
                  return (
                    <tr key={row.key} className={`${rowBg} border-b border-slate-100 hover:brightness-95 transition`}>
                      <td className="px-3 py-2 text-slate-500 border-r border-slate-100">{start + i + 1}</td>
                      <td className="px-3 py-2 font-mono font-semibold text-slate-800 border-r border-slate-100 whitespace-nowrap">
                        {row.displayKey}
                      </td>
                      <td className="px-3 py-2 border-r border-slate-100 whitespace-nowrap">
                        <StatusBadge status={row.status} />
                      </td>
                      {COMPARE_FIELDS.map(f => {
                        const isDiff = row.diffs.includes(f.mainKey);
                        return (
                          <td key={f.mainKey} className={`px-3 py-2 border-r border-slate-100 last:border-r-0 ${isDiff ? "bg-yellow-50" : ""}`}>
                            <CellPair
                              mainVal={row.mainRow?.[f.mainKey]}
                              micadaVal={row.micadaRow?.[f.micadaKey]}
                              isDiff={isDiff}
                              numeric={f.numeric}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="w-full bg-white border border-t-0 border-slate-200 px-4 py-2 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] text-slate-500">
                Rows{" "}
                <span className="font-semibold text-slate-800">{start + 1}–{Math.min(start + ROWS_PER_PAGE, filtered.length)}</span>
                {" "}/ <span className="font-semibold text-slate-800">{filtered.length}</span>
              </span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="h-6 w-6 flex items-center justify-center border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition"
                >
                  <HiOutlineChevronLeft className="w-3.5 h-3.5" />
                </button>
                {pageRange(safePage, totalPages).map((p, idx) =>
                  p === "..." ? (
                    <span key={`el-${idx}`} className="h-6 w-6 flex items-center justify-center text-[11px] text-slate-500">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-6 min-w-[24px] px-1 text-[11px] font-semibold border transition
                        ${safePage === p ? "bg-[#0f172a] text-white border-[#0f172a]" : "bg-white text-slate-800 border-slate-300 hover:bg-slate-100"}`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="h-6 w-6 flex items-center justify-center border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition"
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

export default MicadaComparison;