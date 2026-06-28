import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDealers, selectDealers, selectDealerLoading, selectDealerError } from "../../store/dealerSlice";

/*
   Props:
   - value        (string)    : controlled selected dealerName
   - onChange     (function)  : called with dealerName string on selection
   - disabled     (boolean)   : optional, disables the trigger button
   - placeholder  (string)    : optional, overrides default placeholder text
*/
function DealerSelect({ value, onChange, disabled = false, placeholder = "Select dealer" }) {
   const dispatch = useDispatch();
   const dealers = useSelector(selectDealers);
   const dealerLoading = useSelector(selectDealerLoading);
   const dealerError = useSelector(selectDealerError);

   const [open, setOpen] = useState(false);
   const [search, setSearch] = useState("");

   useEffect(function fetchDealersOnMount() {
      if (!dealers.length && !dealerLoading) dispatch(fetchDealers());
   }, [dispatch, dealers.length, dealerLoading]);

   const filtered = dealers.filter(d =>
      d.dealerName.toLowerCase().includes(search.toLowerCase())
   );

   function handleToggle() {
      if (disabled || dealerLoading) return;
      setOpen(prev => !prev);
      setSearch("");
   }

   function handleSelect(dealerName, farmerDealerCode) {
      onChange(dealerName, farmerDealerCode);
      setOpen(false);
      setSearch("");
   }
   function handleClear(e) { e.stopPropagation(); onChange(""); }
   function handleBlur(e) { if (!e.currentTarget.contains(e.relatedTarget)) { setOpen(false); setSearch(""); } }

   const hasValue = Boolean(value);

   return (
      <div className="relative w-full" onBlur={handleBlur}>
         {/* Trigger */}
         <button
            type="button"
            onClick={handleToggle}
            disabled={disabled || dealerLoading}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2 border text-sm bg-white transition
               ${open
                  ? "border-green-600 ring-2 ring-green-100"
                  : "border-gray-200 hover:border-green-400"}
               ${disabled || dealerLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
         >
            <span className={hasValue ? "text-gray-800" : "text-gray-400"}>
               {dealerLoading ? "Loading dealers…" : (value || placeholder)}
            </span>
            <span className="flex items-center gap-1 shrink-0">
               {hasValue && (
                  <span
                     onClick={handleClear}
                     className="text-gray-400 hover:text-red-500 px-0.5 cursor-pointer transition"
                  >
                     ✕
                  </span>
               )}
               <span className={`text-gray-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`}>▾</span>
            </span>
         </button>

         {/* Dropdown */}
         {open && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 shadow-lg overflow-hidden">
               <div className="p-2 border-b border-gray-100">
                  <input
                     autoFocus
                     type="text"
                     value={search}
                     onChange={e => setSearch(e.target.value)}
                     placeholder="Search dealer…"
                     className="w-full px-3 py-1.5 text-sm border border-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition"
                  />
               </div>
               {dealerError && <p className="px-3 py-2 text-xs text-red-500">{dealerError}</p>}
               <ul className="max-h-52 overflow-y-auto">
                  {filtered.length === 0 ? (
                     <li className="px-3 py-3 text-sm text-gray-400 text-center">No dealers found.</li>
                  ) : (
                     filtered.map(d => {
                        const isSelected = d.dealerName === value;
                        return (
                           <li key={d._id ?? d.id}>
                              <button
                                 type="button"
                                 onClick={() => handleSelect(d.dealerName, d.farmerDealerCode)}
                                 className={`w-full text-left px-3 py-2.5 text-sm transition-colors
                                    ${isSelected
                                       ? "bg-green-50 text-green-800 font-semibold"
                                       : "text-gray-700 hover:bg-gray-50"}`}
                              >
                                 {d.dealerName}
                              </button>
                           </li>
                        );
                     })
                  )}
               </ul>
            </div>
         )}
      </div>
   );
}

export default DealerSelect;
