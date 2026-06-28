
import { HiDocumentText, HiCheckCircle, HiExclamationCircle, HiInbox } from "react-icons/hi";
import { formatFY } from "./helpers";

const COLS = ["File name", "FY", "Main", "Bill", "Tally", "Skipped", "Time", "Status"];

function formatTime(date) {
   return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function UploadHistory({ history, onClear }) {
   return (
      <div className="border border-gray-300 bg-white overflow-hidden">

         {/* Header */}
         <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 bg-white border border-gray-300 flex items-center justify-center">
                  <HiDocumentText className="w-3.5 h-3.5 text-green-700" />
               </div>
               <span className="text-[13px] font-semibold text-black">Upload History</span>
               <span className="text-[11px] font-mono font-semibold text-black bg-green-100 border border-green-300 px-2 py-0.5">
                  {history.length}
               </span>
            </div>
            {history.length > 0 && (
               <button
                  onClick={onClear}
                  className="text-[11px] font-semibold text-black opacity-40 hover:opacity-100 hover:text-red-600 uppercase tracking-wide transition"
               >
                  Clear all
               </button>
            )}
         </div>

         {/* ── Empty State ─────────────────────────────────────── */}
         {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-6 gap-3 text-center">
               <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <HiInbox className="w-6 h-6 text-gray-400" />
               </div>
               <div>
                  <p className="text-[13px] font-semibold text-black opacity-50">
                     No uploads yet
                  </p>
                  <p className="text-[11px] text-black opacity-30 mt-1 font-mono">
                     Uploaded files will appear here during this session
                  </p>
               </div>
            </div>
         ) : (
            <>
               {/* ── Table ───────────────────────────────────────── */}
               <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                     <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                           {COLS.map((col, i) => (
                              <th
                                 key={col}
                                 className={`px-4 py-2.5 font-semibold text-[10px] uppercase tracking-widest text-black opacity-50
                                    ${i >= 2 ? "text-right" : "text-left"}`}
                              >
                                 {col}
                              </th>
                           ))}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {history.map(entry => (
                           <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-2.5 max-w-[160px]">
                                 <p className="font-medium text-black truncate" title={entry.fileName}>
                                    {entry.fileName}
                                 </p>
                              </td>
                              <td className="px-4 py-2.5">
                                 <span className="font-mono text-black bg-green-50 border border-green-200 px-1.5 py-0.5 text-[11px]">
                                    {formatFY(entry.financialYear)}
                                 </span>
                              </td>
                              <td className="px-4 py-2.5 text-right font-mono font-semibold text-black tabular-nums">
                                 {entry.counts?.mainData ?? "—"}
                              </td>
                              <td className="px-4 py-2.5 text-right font-mono font-semibold text-black tabular-nums">
                                 {entry.counts?.billUpload ?? "—"}
                              </td>
                              <td className="px-4 py-2.5 text-right font-mono font-semibold text-black tabular-nums">
                                 {entry.counts?.tallyBill ?? "—"}
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                 {entry.skipped?.length > 0 ? (
                                    <span className="text-black font-medium" title={entry.skipped.join(", ")}>
                                       {entry.skipped.length} sheet{entry.skipped.length > 1 ? "s" : ""}
                                    </span>
                                 ) : (
                                    <span className="text-black opacity-30 font-mono">—</span>
                                 )}
                              </td>
                              <td className="px-4 py-2.5 text-right font-mono text-black opacity-50">
                                 {formatTime(entry.uploadedAt)}
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                 {entry.status === "success" ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-black bg-green-100 border border-green-300 px-2 py-0.5">
                                       <HiCheckCircle className="w-2.5 h-2.5 text-green-700" /> Done
                                    </span>
                                 ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-black bg-red-100 border border-red-300 px-2 py-0.5">
                                       <HiExclamationCircle className="w-2.5 h-2.5 text-red-600" /> Failed
                                    </span>
                                 )}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <p className="text-[11px] text-black opacity-30 text-center py-2.5 border-t border-gray-100 font-mono">
                  Session only — clears on refresh
               </p>
            </>
         )}
      </div>
   );
}

export default UploadHistory;