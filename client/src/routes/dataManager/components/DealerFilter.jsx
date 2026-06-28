
// DealerFilter.jsx (Redesigned)
import { useState, useMemo } from "react";
import { HiX, HiSearch, HiOfficeBuilding } from "react-icons/hi";

function DealerFilter({ records, onFilter }) {
   const [searchInput, setSearchInput] = useState("");
   const [selectedDealer, setSelectedDealer] = useState(null);
   const [showDropdown, setShowDropdown] = useState(false);

   const allDealers = useMemo(() => {
      const seen = new Set();
      return (records ?? [])
         .filter(r => {
            const key = r.farmerDealerCode || r.dealerName;
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
         })
         .map(r => ({
            dealerName: r.dealerName,
            farmerDealerCode: r.farmerDealerCode,
         }));
   }, [records]);

   const suggestions = useMemo(() => {
      const q = searchInput.trim().toLowerCase();
      if (!q) return [];
      return allDealers.filter(d =>
         (d.dealerName || "").toLowerCase().includes(q) ||
         (d.farmerDealerCode || "").toLowerCase().includes(q)
      );
   }, [searchInput, allDealers]);

   function selectDealer(dealer) {
      setSelectedDealer(dealer);
      setSearchInput(dealer.dealerName);
      setShowDropdown(false);
      onFilter(dealer);
   }

   function clearDealer() {
      setSelectedDealer(null);
      setSearchInput("");
      setShowDropdown(false);
      onFilter(null);
   }

   return (
      <div className="relative mb-4 max-w-md">
         <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            <HiOfficeBuilding className="w-3.5 h-3.5" />
            Filter by Dealer
         </label>

         <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
               type="text"
               value={searchInput}
               onChange={e => {
                  setSearchInput(e.target.value);
                  setSelectedDealer(null);
                  setShowDropdown(true);
                  onFilter(null);
               }}
               onFocus={() => setShowDropdown(true)}
               onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
               placeholder="Search dealer name or code..."
               className="w-full pl-9 pr-8 py-2 text-sm border border-slate-300 bg-white
                  focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600
                  text-slate-700 placeholder:text-slate-400"
            />
            {searchInput && (
               <button
                  onClick={clearDealer}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1
                     text-slate-400 hover:text-slate-700 transition-colors"
               >
                  <HiX className="w-4 h-4" />
               </button>
            )}
         </div>

         {/* Dropdown */}
         {showDropdown && suggestions.length > 0 && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-300 shadow-lg max-h-52 overflow-y-auto">
               {suggestions.map((d, idx) => (
                  <button
                     key={d.farmerDealerCode || idx}
                     onMouseDown={() => selectDealer(d)}
                     className="w-full text-left px-3 py-2.5 hover:bg-green-50 transition-colors border-b border-slate-100 last:border-0 flex items-center justify-between"
                  >
                     <span className="text-sm font-semibold text-slate-700">
                        {d.dealerName}
                     </span>
                     <span className="text-xs text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5">
                        {d.farmerDealerCode}
                     </span>
                  </button>
               ))}
            </div>
         )}

         {/* Selected badge */}
         {selectedDealer && (
            <div className="mt-2 flex items-center gap-2">
               <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5">
                  <HiOfficeBuilding className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs font-semibold text-green-800">
                     {selectedDealer.dealerName}
                  </span>
                  <span className="text-[10px] text-green-600 font-mono bg-green-100 px-1.5 py-0.5">
                     {selectedDealer.farmerDealerCode}
                  </span>
               </div>
               <button
                  onClick={clearDealer}
                  className="text-xs font-semibold text-slate-400 hover:text-red-600 uppercase tracking-wider transition-colors"
               >
                  Clear
               </button>
            </div>
         )}
      </div>
   );
}

export default DealerFilter;