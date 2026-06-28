
import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import Pdf from "../../../components/Pdf";
import Excel from "../../../components/Excel";
import SortableHeader from "../../../components/SortableHeader";

const POPUP_COLUMNS = [
   { key: "srNo",                    label: "Sr No" },
   { key: "scanNo",                  label: "Scan No" },
   { key: "brandName",               label: "Brand" },
   { key: "name",                    label: "Name" },
   { key: "fatherName",              label: "Father Name" },
   { key: "mobileNo",                label: "Mobile No" },
   { key: "dealerName",              label: "Dealer" },
   { key: "farmerDealerCode",        label: "Dealer Code" },
   { key: "village",                 label: "Village" },
   { key: "block",                   label: "Block" },
   { key: "district",                label: "District" },
   { key: "type",                    label: "Irrigation Type" },
   { key: "areaInAcre",              label: "Area (Acre)" },
   { key: "miNumber",                label: "MI Number" },
   { key: "billNo",                  label: "Bill No" },
   { key: "billValue",               label: "Bill Value" },
   { key: "gst",                     label: "GST" },
   { key: "farmerShare",             label: "Farmer Share" },
   { key: "dateOfApplication",       label: "Date of Application", date: true },
   { key: "verificationStatus",      label: "Verification Status" },
   { key: "estimateStatus",          label: "Estimate Status" },
   { key: "onlineFarmerShareStatus", label: "Farmer Share Status" },
   { key: "challanStatus",           label: "Challan Status" },
   { key: "tallyBillStatus",         label: "Tally Bill Status" },
   { key: "billUploadStatus",        label: "Bill Upload Status" },
   { key: "verificationDone",        label: "Verification Done" },
   { key: "applicationStatus",       label: "Application Status" },
   { key: "status",                  label: "MI Status" },
   { key: "delay",                   label: "Delay" },
   { key: "remarks",                 label: "Remarks" },
   { key: "reason",                  label: "Reason" },
];

function fmtDate(val) {
   if (!val) return "—";
   try {
      return new Date(val).toLocaleDateString("en-IN", {
         day: "2-digit", month: "short", year: "numeric",
      });
   } catch { return "—"; }
}

function fmtVal(val) {
   if (val === null || val === undefined || val === "") return "—";
   return String(val);
}

export default function RecordsPopup({
   open,
   onClose,
   records = [],
   title = "Records",
   mode = "nos",
}) {
   const overlayRef = useRef(null);
   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

   function handleSort(key) {
      setSortConfig(prev => ({
         key,
         direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
      }));
   }

   const sortedRecords = useMemo(() => {
      if (!sortConfig.key) return records;
      return [...records].sort((a, b) => {
         const aVal = a[sortConfig.key];
         const bVal = b[sortConfig.key];
         if (aVal == null) return 1;
         if (bVal == null) return -1;
         const aNum = Number(aVal), bNum = Number(bVal);
         if (!isNaN(aNum) && !isNaN(bNum)) {
            return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
         }
         const cmp = String(aVal).localeCompare(String(bVal));
         return sortConfig.direction === "asc" ? cmp : -cmp;
      });
   }, [records, sortConfig]);

   // Escape key se close
   useEffect(() => {
      if (!open) return;
      const handler = (e) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
   }, [open, onClose]);

   // Body scroll lock
   useEffect(() => {
      document.body.style.overflow = open ? "hidden" : "";
      return () => { document.body.style.overflow = ""; };
   }, [open]);

   // Sort reset when records change
   useEffect(() => {
      setSortConfig({ key: null, direction: "asc" });
   }, [records]);

   // Overlay click se close
   const handleOverlayClick = useCallback((e) => {
      if (e.target === overlayRef.current) onClose();
   }, [onClose]);

   if (!open) return null;

   // Export data
   const pdfData = { title, records };
   const excelData = records.map(r =>
      Object.fromEntries(
         POPUP_COLUMNS.map(col => [
            col.label,
            col.date ? fmtDate(r[col.key]) : (r[col.key] ?? ""),
         ])
      )
   );

   const totalAcre = records.reduce((s, r) => s + (Number(r.areaInAcre) || 0), 0);

   return (
      <div
         ref={overlayRef}
         onClick={handleOverlayClick}
         className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(2px)" }}
      >
         <div
            className="bg-white flex flex-col"
            style={{
               width: "min(96vw, 1200px)",
               maxHeight: "90vh",
               boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
            }}
         >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 flex-none">
               <div className="flex items-center gap-3">
                  <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-green-700 mb-0.5">
                        Records
                     </p>
                     <h2 className="text-sm font-bold text-slate-800 leading-tight">{title}</h2>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border
                     ${mode === "acre"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-green-50 text-green-700 border-green-200"
                     }`}>
                     {mode === "acre" ? "In Acre" : "In Nos"}
                  </span>
               </div>

               <div className="flex items-center gap-2">
                  <Excel
                     model="popup-records"
                     fileName={title.replace(/\s+/g, "_")}
                     label="Excel"
                     data={pdfData}
                  />
                  <Pdf
                     model="popup-records"
                     fileName={title.replace(/\s+/g, "_")}
                     label="PDF"
                     data={pdfData}
                  />
                  <button
                     onClick={onClose}
                     className="ml-1 p-1.5 text-slate-400 hover:text-slate-700
                        hover:bg-slate-100 transition-colors rounded"
                     title="Close (Esc)"
                  >
                     ✕
                  </button>
               </div>
            </div>

            {/* ── Stats bar ── */}
            <div className="px-5 py-2 border-b border-slate-100 flex-none bg-slate-50 flex items-center gap-4">
               <span className="text-xs text-slate-500 font-semibold">
                  {records.length.toLocaleString("en-IN")} record{records.length !== 1 ? "s" : ""}
               </span>
               {mode === "acre" && (
                  <span className="text-xs text-blue-600 font-semibold">
                     Total Area: {totalAcre.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Acre
                  </span>
               )}
               {sortConfig.key && (
                  <button
                     onClick={() => setSortConfig({ key: null, direction: "asc" })}
                     className="text-xs text-slate-400 hover:text-red-500 transition-colors font-semibold ml-auto"
                  >
                     ✕ Clear Sort
                  </button>
               )}
            </div>

            {/* ── Table ── */}
            <div className="flex-1 overflow-auto">
               {records.length === 0 ? (
                  <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
                     No records found.
                  </div>
               ) : (
                  <table className="border-collapse text-xs w-full" style={{ minWidth: "1600px" }}>
                     <thead className="sticky top-0 z-10">
                        <tr>
                           <th className="px-3 py-2 text-left border border-slate-200 bg-slate-100
                              text-slate-500 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">
                              #
                           </th>
                           {POPUP_COLUMNS.map(col => (
                              <th
                                 key={col.key}
                                 onClick={() => handleSort(col.key)}
                                 className={`
                                    px-3 py-2 text-left border border-slate-200 bg-slate-100
                                    text-[10px] whitespace-nowrap cursor-pointer
                                    hover:bg-slate-200 transition-colors
                                    ${sortConfig.key === col.key ? "bg-slate-200" : ""}
                                 `}
                              >
                                 <SortableHeader
                                    label={col.label}
                                    colKey={col.key}
                                    sortConfig={sortConfig}
                                    onSort={handleSort}
                                 />
                              </th>
                           ))}
                        </tr>
                     </thead>
                     <tbody>
                        {sortedRecords.map((row, i) => (
                           <tr
                              key={row._id ?? i}
                              className={i % 2 === 0 ? "bg-white hover:bg-slate-50" : "bg-slate-50/60 hover:bg-slate-100"}
                           >
                              <td className="px-3 py-2 border border-slate-200 text-slate-400 font-mono text-[10px]">
                                 {i + 1}
                              </td>
                              {POPUP_COLUMNS.map(col => (
                                 <td
                                    key={col.key}
                                    className="px-3 py-2 border border-slate-200 text-slate-700 whitespace-nowrap"
                                 >
                                    {col.date ? fmtDate(row[col.key]) : fmtVal(row[col.key])}
                                 </td>
                              ))}
                           </tr>
                        ))}
                     </tbody>
                  </table>
               )}
            </div>
         </div>
      </div>
   );
}