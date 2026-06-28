function fmt(val) {
   if (val === null || val === undefined || val === "") return "—";
   const n = Number(val);
   if (isNaN(n)) return val;
   // Round to max 2 decimal places — whole numbers stay clean (no trailing .00),
   // values with decimals get capped at 2 places (e.g. 768.065 → 768.07).
   return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

// Derive previous year label from financialYear e.g. "2022-23" → "2021-22"
function prevYear(fy) {
   if (!fy) return "Prev Year";
   const parts = fy.split("-");
   if (parts.length !== 2) return fy;
   const s = parseInt(parts[0], 10);
   const e = parseInt(parts[1], 10);
   return `${s - 1}-${String(e - 1).slice(-2)}`;
}

const TH = ({ children, colSpan, rowSpan, className = "" }) => (
   <th
      colSpan={colSpan}
      rowSpan={rowSpan}
      className={`border border-gray-400 px-1 py-1 text-center text-[11px] font-bold whitespace-nowrap ${className}`}
   >
      {children}
   </th>
);

const TD = ({ children, className = "" }) => (
   <td
      className={`border border-gray-300 px-1 py-[3px] text-center text-[11px] whitespace-nowrap ${className}`}
   >
      {children}
   </td>
);

function DealerMaterialDispatchSummary({ rows = [], financialYear = "" }) {
   const fy      = financialYear || "——";
   const prevFy  = prevYear(financialYear);

   if (rows.length === 0) {
      return (
         <div className="p-6 text-center text-gray-400 text-sm">
            No dealer summary data available.
         </div>
      );
   }

   return (
      <div className="overflow-x-auto mt-2">
         <table className="border-collapse min-w-full text-xs">
            <thead>
               {/* ── Row 1 : top-level group headers ── */}
               <tr className="bg-[#4CAF50] text-white">
                  <TH rowSpan={2}>Sr No.</TH>
                  <TH rowSpan={2} className="min-w-[140px]">Name of Dealer</TH>
                  <TH rowSpan={2}>Dealer Code</TH>

                  {/* Material Dispatched In Acre */}
                  <TH colSpan={2} className="bg-[#388E3C]">
                     Material Dispatched In Acre {fy}
                  </TH>

                  {/* Document Received in Acre — TOTAL across all years, no {fy} suffix */}
                  <TH colSpan={2} className="bg-[#F57C00] text-white">
                     Document Received in Acre
                  </TH>

                  {/* Difference */}
                  <TH colSpan={2} className="bg-[#C62828] text-white">
                     Difference {fy}
                  </TH>

                  <TH rowSpan={2} className="bg-[#1565C0] text-white">
                     Total Doc Received
                  </TH>
                  <TH rowSpan={2} className="bg-[#6A1B9A] text-white">
                     Pending Doc
                  </TH>

                  {/* Farmer Share */}
                  <TH colSpan={3} className="bg-[#0277BD] text-white">
                     Farmer Share {fy}
                  </TH>

                  <TH rowSpan={2} className="bg-[#558B2F] text-white min-w-[80px]">
                     Opening Balance {prevFy}
                  </TH>
                  <TH rowSpan={2} className="bg-[#00838F] text-white">
                     Receipts {fy}
                  </TH>
                  <TH rowSpan={2} className="bg-[#E65100] text-white">
                     TOTAL Outstanding {fy}
                  </TH>
                  <TH rowSpan={2} className="bg-[#AD1457] text-white">
                     Outstanding {fy}
                  </TH>
                  <TH rowSpan={2} className="bg-[#4E342E] text-white">
                     Balance Outstanding {fy}
                  </TH>
               </tr>

               {/* ── Row 2 : sub-column headers ── */}
               <tr className="bg-[#66BB6A] text-white">
                  {/* Material Dispatched sub */}
                  <TH className="bg-[#43A047] text-white">MINI</TH>
                  <TH className="bg-[#43A047] text-white">DRIP</TH>

                  {/* Document Received sub */}
                  <TH className="bg-[#FB8C00] text-white">MINI SPRINKLER</TH>
                  <TH className="bg-[#FB8C00] text-white">Drip Irrigation</TH>

                  {/* Difference sub */}
                  <TH className="bg-[#E53935] text-white">MINI</TH>
                  <TH className="bg-[#E53935] text-white">DRIP</TH>

                  {/* Farmer Share sub */}
                  <TH className="bg-[#0288D1] text-white">Drip</TH>
                  <TH className="bg-[#0288D1] text-white">Mini</TH>
                  <TH className="bg-[#0288D1] text-white">HDPE</TH>
               </tr>
            </thead>

            <tbody>
               {rows.map((row, i) => (
                  <tr
                     key={`${row.farmerDealerCodeRaw ?? row.farmerDealerCode ?? "row"}-${i}`}
                     className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                     <TD>{i + 1}</TD>
                     <TD className="text-left font-semibold">{row.dealerName ?? "—"}</TD>
                     <TD>{row.farmerDealerCode ?? "—"}</TD>

                     {/* Material Dispatched */}
                     <TD>{fmt(row.miniAcresDispatched)}</TD>
                     <TD>{fmt(row.dripAcresDispatched)}</TD>

                     {/* Document Received */}
                     <TD className="bg-orange-50">{fmt(row.miniSprinklerDocAcres)}</TD>
                     <TD className="bg-orange-50">{fmt(row.dripIrrigationDocAcres)}</TD>

                     {/* Difference */}
                     <TD className="bg-red-50">{fmt(row.diffMini)}</TD>
                     <TD className="bg-red-50">{fmt(row.diffDrip)}</TD>

                     <TD>{fmt(row.totalDocReceived)}</TD>
                     <TD>{fmt(row.pendingDoc)}</TD>

                     {/* Farmer Share */}
                     <TD>{fmt(row.farmerShareDrip)}</TD>
                     <TD>{fmt(row.farmerShareMini)}</TD>
                     <TD>{fmt(row.farmerShareHdpe)}</TD>

                     <TD>{fmt(row.openingBalance)}</TD>
                     <TD>{fmt(row.receipts)}</TD>
                     <TD>{fmt(row.totalOutstanding)}</TD>
                     <TD>{fmt(row.outstanding)}</TD>
                     <TD className="font-semibold">{fmt(row.balanceOutstanding)}</TD>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default DealerMaterialDispatchSummary;