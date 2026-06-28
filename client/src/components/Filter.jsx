import { useState, useRef, useEffect } from "react";
import { HiFilter, HiX, HiSearch, HiCalendar, HiChevronDown } from "react-icons/hi";

// ─────────────────────────────────────────────────────────────────────────────
// Filter — pure Tailwind, no inline CSS, no rounded-*
// ─────────────────────────────────────────────────────────────────────────────

/* ── Tag color sets (Tailwind class groups per index) ── */
const TAG_PALETTE = [
   { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500"   },
   { bg: "bg-violet-50", text: "text-violet-700",  border: "border-violet-200", dot: "bg-violet-500" },
   { bg: "bg-emerald-50",text: "text-emerald-800", border: "border-emerald-200",dot: "bg-emerald-500"},
   { bg: "bg-orange-50", text: "text-orange-700",  border: "border-orange-200", dot: "bg-orange-500" },
   { bg: "bg-rose-50",   text: "text-rose-700",    border: "border-rose-200",   dot: "bg-rose-500"   },
   { bg: "bg-teal-50",   text: "text-teal-700",    border: "border-teal-200",   dot: "bg-teal-500"   },
   { bg: "bg-green-50",  text: "text-green-800",   border: "border-green-200",  dot: "bg-green-500"  },
   { bg: "bg-fuchsia-50",text: "text-fuchsia-700", border: "border-fuchsia-200",dot: "bg-fuchsia-500"},
];

const getColor = (fieldKey, fields) => {
   const idx = fields.findIndex((f) => f.key === fieldKey);
   return TAG_PALETTE[(idx >= 0 ? idx : 0) % TAG_PALETTE.length];
};

/* ── Tag chip ── */
function SearchTag({ tag, onRemove, searchableFields }) {
   const c   = getColor(tag.field, searchableFields);
   const lbl = searchableFields.find((f) => f.key === tag.field)?.label || tag.field;
   return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
         <span className={`w-1.5 h-1.5 shrink-0 ${c.dot}`} />
         <span className="font-semibold">{lbl}:</span>
         <span>{tag.value}</span>
         <button
            type="button"
            onClick={() => onRemove(tag.id)}
            className={`ml-0.5 flex items-center opacity-60 hover:opacity-100 transition-opacity ${c.text}`}
         >
            <HiX className="w-3 h-3" />
         </button>
      </span>
   );
}

/* ── Main Filter ── */
const Filter = ({
   searchableFields = [],
   allColumns       = [],
   visibleColumns   = [],
   toggleColumn,
   isDrawerOpen,
   setIsDrawerOpen,
   searchTags       = [],
   onAddTag,
   onRemoveTag,
   onClearAllTags,
   startDate        = "",
   endDate          = "",
   onStartDateChange,
   onEndDateChange,
   onClearDates,
   totalCount,
}) => {
   const [inputValue,   setInputValue]   = useState("");
   const [selectedField,setSelectedField]= useState("");
   const [fieldOpen,    setFieldOpen]    = useState(false);
   const fieldDropdownRef = useRef(null);

   useEffect(() => {
      if (!selectedField && searchableFields.length)
         setSelectedField(searchableFields[0].key);
   }, [searchableFields, selectedField]);

   useEffect(() => {
      const handler = (e) => {
         if (fieldDropdownRef.current && !fieldDropdownRef.current.contains(e.target))
            setFieldOpen(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
   }, []);

   const selectedLabel = searchableFields.find((f) => f.key === selectedField)?.label || "Field";
   const hasActiveDates = !!(startDate || endDate);
   const activeCount    = searchTags.length + (hasActiveDates ? 1 : 0);

   const handleAdd = () => {
      const val = inputValue.trim();
      if (!val || !selectedField) return;
      onAddTag({ id: Date.now(), field: selectedField, value: val });
      setInputValue("");
   };

   /* shared input classes */
   const inputCls = "w-full text-sm text-slate-900 border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 hover:border-slate-300 transition-all";

   return (
      <>
         {/* ══════════ DESKTOP ══════════ */}
         <div className="hidden sm:flex flex-col gap-2.5 w-full">

            {/* Row */}
            <div className="flex items-center gap-2 w-full">

               {/* Compound search input */}
               <div className="flex items-stretch flex-1 min-w-0 border border-slate-200 bg-white shadow-sm relative z-40 overflow-visible">

                  {/* Field picker */}
                  <div ref={fieldDropdownRef} className="relative shrink-0 z-50">
                     <button
                        type="button"
                        onClick={() => setFieldOpen((v) => !v)}
                        className="flex items-center gap-1.5 px-3 h-full bg-slate-50 border-r border-slate-200 text-xs font-semibold text-slate-500 hover:bg-green-50 transition-colors cursor-pointer whitespace-nowrap focus:outline-none"
                     >
                        <HiFilter className="w-3 h-3 text-slate-400" />
                        <span className="max-w-[90px] overflow-hidden text-ellipsis">{selectedLabel}</span>
                        <HiChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${fieldOpen ? "rotate-180" : ""}`} />
                     </button>

                     {fieldOpen && (
                        <div className="absolute top-[calc(100%+6px)] left-0 min-w-[180px] bg-white border border-slate-200 shadow-lg z-[9999] overflow-hidden animate-[fadeIn_0.14s_ease]">
                           {searchableFields.map((f, i) => (
                              <button
                                 key={f.key}
                                 type="button"
                                 onClick={() => { setSelectedField(f.key); setFieldOpen(false); }}
                                 className={[
                                    "w-full flex items-center gap-2 px-3.5 py-2.5 text-left text-sm transition-colors",
                                    i < searchableFields.length - 1 ? "border-b border-slate-100" : "",
                                    selectedField === f.key
                                       ? "bg-green-50 text-green-700 font-semibold"
                                       : "text-slate-800 font-normal hover:bg-green-50",
                                 ].join(" ")}
                              >
                                 {selectedField === f.key && (
                                    <span className="w-1.5 h-1.5 bg-green-600 shrink-0" />
                                 )}
                                 {f.label}
                              </button>
                           ))}
                        </div>
                     )}
                  </div>

                  {/* Text input */}
                  <input
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                     placeholder={`Search by ${selectedLabel}…`}
                     className="flex-1 min-w-0 px-3 py-2.5 text-sm text-slate-900 bg-transparent border-none outline-none placeholder:text-slate-300"
                  />

                  {/* Add button */}
                  <button
                     type="button"
                     onClick={handleAdd}
                     className="flex items-center gap-1.5 px-3.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shrink-0 transition-colors cursor-pointer border-none whitespace-nowrap"
                  >
                     <HiSearch className="w-3 h-3" />
                     Add Filter
                  </button>
               </div>

               {/* Clear all */}
               {searchTags.length > 0 && (
                  <button
                     type="button"
                     onClick={onClearAllTags}
                     className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 shrink-0 transition-colors cursor-pointer whitespace-nowrap"
                  >
                     <HiX className="w-3 h-3" />
                     Clear
                  </button>
               )}

               {/* Result count */}
               {totalCount !== undefined && searchTags.length > 0 && (
                  <span className="shrink-0 text-xs font-bold text-green-800 bg-green-100 border border-green-300 px-3 py-1.5 whitespace-nowrap tracking-tight">
                     {totalCount} result{totalCount !== 1 ? "s" : ""}
                  </span>
               )}
            </div>

            {/* Active tags row */}
            {searchTags.length > 0 && (
               <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Active</span>
                  {searchTags.map((tag) => (
                     <SearchTag key={tag.id} tag={tag} onRemove={onRemoveTag} searchableFields={searchableFields} />
                  ))}
               </div>
            )}
         </div>

         {/* ══════════ MOBILE ══════════ */}
         <div className="flex sm:hidden items-center gap-2 w-full">
            <button
               type="button"
               onClick={() => setIsDrawerOpen(true)}
               className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer border-none"
            >
               <HiFilter className="w-4 h-4" />
               Filters
               {activeCount > 0 && (
                  <span className="min-w-5 h-5 flex items-center justify-center px-1.5 bg-green-600 text-white text-[11px] font-bold tabular-nums">
                     {activeCount}
                  </span>
               )}
            </button>

            {totalCount !== undefined && (
               <span className="text-xs font-semibold text-slate-500 border border-slate-200 px-3 py-2 bg-slate-50 whitespace-nowrap">
                  {totalCount} results
               </span>
            )}
         </div>

         {/* ══════════ MOBILE DRAWER ══════════ */}
         {isDrawerOpen && (
            <>
               {/* Backdrop */}
               <div
                  onClick={() => setIsDrawerOpen(false)}
                  className="fixed inset-0 bg-slate-900/55 backdrop-blur-sm z-40"
               />

               {/* Drawer panel */}
               <div className="fixed left-0 top-0 h-full w-80 bg-white z-50 flex flex-col shadow-2xl">

                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
                     <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-green-100 flex items-center justify-center shrink-0">
                           <HiFilter className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-900">Filters</span>
                        {activeCount > 0 && (
                           <span className="px-2 py-0.5 bg-green-600 text-white text-[11px] font-bold">
                              {activeCount}
                           </span>
                        )}
                     </div>
                     <button
                        type="button"
                        onClick={() => setIsDrawerOpen(false)}
                        className="flex items-center justify-center p-1 text-slate-400 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"
                     >
                        <HiX className="w-5 h-5" />
                     </button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-6">

                     {/* Search section */}
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Search</p>
                        <select
                           value={selectedField}
                           onChange={(e) => setSelectedField(e.target.value)}
                           className={`${inputCls} mb-2 appearance-none`}
                        >
                           {searchableFields.map((f) => (
                              <option key={f.key} value={f.key}>{f.label}</option>
                           ))}
                        </select>
                        <div className="flex gap-2">
                           <input
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                              placeholder={`Enter ${selectedLabel}…`}
                              className={`${inputCls} flex-1`}
                           />
                           <button
                              type="button"
                              onClick={handleAdd}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold shrink-0 transition-colors cursor-pointer border-none"
                           >
                              Add
                           </button>
                        </div>
                        {searchTags.length > 0 && (
                           <div className="mt-3 flex flex-wrap gap-1.5">
                              {searchTags.map((tag) => (
                                 <SearchTag key={tag.id} tag={tag} onRemove={onRemoveTag} searchableFields={searchableFields} />
                              ))}
                           </div>
                        )}
                     </div>

                     {/* Date range section */}
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                           <HiCalendar className="w-3 h-3" />
                           Date Range
                        </p>
                        <div className="flex flex-col gap-2">
                           {[
                              { label: "From", val: startDate,  cb: onStartDateChange },
                              { label: "To",   val: endDate,    cb: onEndDateChange   },
                           ].map(({ label, val, cb }) => (
                              <div key={label}>
                                 <span className="block text-[11px] font-semibold text-slate-400 mb-1">{label}</span>
                                 <input
                                    type="date"
                                    value={val}
                                    onChange={(e) => cb && cb(e.target.value)}
                                    className={inputCls}
                                 />
                              </div>
                           ))}
                           {hasActiveDates && (
                              <button
                                 type="button"
                                 onClick={onClearDates}
                                 className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-transparent border-none cursor-pointer py-0.5 transition-colors"
                              >
                                 <HiX className="w-3 h-3" />
                                 Clear dates
                              </button>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Footer */}
                  <div className="flex gap-2 px-5 py-3.5 border-t border-slate-200 bg-slate-50 shrink-0">
                     {activeCount > 0 && (
                        <button
                           type="button"
                           onClick={() => { onClearAllTags(); if (onClearDates) onClearDates(); }}
                           className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-500 bg-white border border-slate-200 hover:bg-green-50 transition-colors cursor-pointer"
                        >
                           Clear All
                        </button>
                     )}
                     <button
                        type="button"
                        onClick={() => setIsDrawerOpen(false)}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 border-none transition-colors cursor-pointer"
                     >
                        Apply & Close
                     </button>
                  </div>
               </div>
            </>
         )}
      </>
   );
};

export default Filter;