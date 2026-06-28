
// import { DealerSelect, FinancialYearSelect } from "../../../../components/app";
// import NumberField from "../../ShiftingEntries/components/NumberField";
// import AccordionSection from "../../ShiftingEntries/components/AccordionSection";
// import SummaryBar from "./ReturnSummaryBar";
// import { CATEGORY_CONFIG } from "../constants";

// // ─────────────────────────────────────────────────────────────────────────────
// // ReturnEntryForm — collapsible card inside the scrollable tab body
// // Parent (ReturnEntries tab body) owns the scroll — this form does NOT scroll
// // No inline CSS · no rounded-* · standard Tailwind only
// // ─────────────────────────────────────────────────────────────────────────────

// function FieldError({ message }) {
//    if (!message) return null;
//    return (
//       <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5 font-medium">
//          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
//             <path
//                fillRule="evenodd"
//                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                clipRule="evenodd"
//             />
//          </svg>
//          {message}
//       </p>
//    );
// }

// function ReturnEntryForm({
//    form,
//    formErrors,
//    isEditing,
//    saving,
//    formOpen,
//    categorySums,
//    onFormOpenToggle,
//    onDealerChange,
//    onFinancialYearChange,
//    onReturnDateChange,
//    onCategoryChange,
//    onRemarksChange,
//    onSave,
//    onReset,
// }) {
//    return (
//       <div className="border border-gray-200 bg-white shadow-sm overflow-hidden">

//          {/* ── Accordion trigger ── */}
//          <button
//             type="button"
//             onClick={onFormOpenToggle}
//             className={[
//                "w-full flex items-center justify-between px-5 py-4 border-b transition-colors",
//                "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400",
//                isEditing
//                   ? "bg-amber-50 border-amber-100 hover:bg-amber-100"
//                   : "bg-green-50 border-green-100 hover:bg-green-100",
//                !formOpen ? "border-transparent" : "",
//             ].join(" ")}
//          >
//             <div className="flex items-center gap-2.5">
//                <div className={[
//                   "w-7 h-7 flex items-center justify-center",
//                   isEditing ? "bg-amber-500" : "bg-green-600",
//                ].join(" ")}>
//                   {isEditing ? (
//                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                      </svg>
//                   ) : (
//                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a4 4 0 010 8H9m-6-8l3-3m-3 3 3 3" />
//                      </svg>
//                   )}
//                </div>

//                <div className="text-left">
//                   <p className={[
//                      "text-sm font-semibold",
//                      isEditing ? "text-amber-800" : "text-green-800",
//                   ].join(" ")}>
//                      {isEditing ? "Edit return entry" : "New return entry"}
//                   </p>
//                   {isEditing && (
//                      <p className="text-xs text-amber-600 mt-0.5">
//                         Editing: {form.dealerName} · FY {form.financialYear}
//                      </p>
//                   )}
//                </div>
//             </div>

//             <div className="flex items-center gap-2">
//                {isEditing && (
//                   <span
//                      role="button"
//                      tabIndex={0}
//                      onClick={e => { e.stopPropagation(); onReset(); }}
//                      onKeyDown={e => e.key === "Enter" && (e.stopPropagation(), onReset())}
//                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 px-2.5 py-1.5 hover:bg-white transition-colors"
//                   >
//                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                      </svg>
//                      Cancel edit
//                   </span>
//                )}
//                <svg
//                   className={[
//                      "w-4 h-4 transition-transform duration-200",
//                      formOpen ? "rotate-180" : "",
//                      isEditing ? "text-amber-500" : "text-green-500",
//                   ].join(" ")}
//                   fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
//                >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                </svg>
//             </div>
//          </button>

//          {/* ── Form body — no scroll here, parent tab body scrolls ── */}
//          <div className={[
//             "transition-all duration-200 overflow-hidden",
//             formOpen ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0",
//          ].join(" ")}>
//             <div className="p-5 space-y-5">

//                {/* Dealer + Financial Year + Return Date */}
//                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                   <div>
//                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
//                         Dealer
//                      </label>
//                      <DealerSelect
//                         value={form.dealerName}
//                         onChange={onDealerChange}
//                         disabled={isEditing}
//                         placeholder="Select dealer"
//                      />
//                      <FieldError message={formErrors.dealerName} />
//                      {isEditing && (
//                         <p className="text-xs text-amber-600 mt-1">Dealer cannot be changed while editing.</p>
//                      )}
//                   </div>

//                   <div>
//                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
//                         Financial year
//                      </label>
//                      <FinancialYearSelect
//                         value={form.financialYear}
//                         onChange={onFinancialYearChange}
//                         placeholder="Select financial year"
//                         className={formErrors.financialYear ? "border-red-400 focus:ring-red-400" : ""}
//                      />
//                      <FieldError message={formErrors.financialYear} />
//                   </div>

//                   <div>
//                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
//                         Return date
//                      </label>
//                      <input
//                         type="date"
//                         value={form.returnDate}
//                         onChange={onReturnDateChange}
//                         className={[
//                            "w-full text-sm border px-3 py-2",
//                            "focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400",
//                            "hover:border-gray-300 transition-all",
//                            formErrors.returnDate
//                               ? "border-red-400 focus:ring-red-400"
//                               : "border-gray-200",
//                         ].join(" ")}
//                      />
//                      <FieldError message={formErrors.returnDate} />
//                   </div>
//                </div>

//                {/* ── Category accordions — ALL defaultOpen ── */}
//                {CATEGORY_CONFIG.map((cat) => (
//                   <AccordionSection
//                      key={cat.key}
//                      title={cat.label}
//                      subtitle={cat.subtitle}
//                      badge={categorySums[cat.key]}
//                      accentTitle={cat.accent.title}
//                      accentBorder={cat.accent.border}
//                      accentHeader={cat.accent.header}
//                      accentChevron={cat.accent.chevron}
//                      defaultOpen={false}
//                   >
//                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3">
//                         {cat.items.map(item => (
//                            <NumberField
//                               key={item.key}
//                               label={item.label}
//                               itemKey={item.key}
//                               value={form[cat.key]?.[item.key] ?? ""}
//                               onChange={(itemKey, val) => onCategoryChange(cat.key, itemKey, val)}
//                            />
//                         ))}
//                      </div>
//                   </AccordionSection>
//                ))}

//                {/* Remarks */}
//                <div>
//                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
//                      Remarks
//                      <span className="ml-1 normal-case font-normal text-gray-400">(optional)</span>
//                   </label>
//                   <textarea
//                      rows={2}
//                      value={form.remarks}
//                      onChange={onRemarksChange}
//                      placeholder="Any notes about this return entry…"
//                      maxLength={500}
//                      className="w-full text-sm border border-gray-200 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-gray-300 transition-all placeholder:text-gray-300"
//                   />
//                </div>

//                {/* Summary bar */}
//                <SummaryBar categorySums={categorySums} />

//                {/* Form actions */}
//                <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100">
//                   <button
//                      onClick={onReset}
//                      disabled={saving}
//                      className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
//                   >
//                      Reset
//                   </button>
//                   <button
//                      onClick={onSave}
//                      disabled={saving}
//                      className={[
//                         "flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white",
//                         "shadow-sm transition-colors disabled:opacity-60",
//                         isEditing
//                            ? "bg-amber-500 hover:bg-amber-600 active:bg-amber-700"
//                            : "bg-green-600 hover:bg-green-700 active:bg-green-800",
//                      ].join(" ")}
//                   >
//                      {saving ? (
//                         <>
//                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
//                            </svg>
//                            {isEditing ? "Updating…" : "Saving…"}
//                         </>
//                      ) : (
//                         isEditing ? "Update entry" : "Save return"
//                      )}
//                   </button>
//                </div>

//             </div>
//          </div>
//       </div>
//    );
// }

// export default ReturnEntryForm;












import { useState, useCallback } from "react";
import { DealerSelect, FinancialYearSelect } from "../../../../components/app";
import NumberField from "../../ShiftingEntries/components/NumberField";
import AccordionSection from "../../ShiftingEntries/components/AccordionSection";
import SummaryBar from "./ReturnSummaryBar";
import { CATEGORY_CONFIG } from "../constants";

function FieldError({ message }) {
   if (!message) return null;
   return (
      <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5 font-medium">
         <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
               fillRule="evenodd"
               d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
               clipRule="evenodd"
            />
         </svg>
         {message}
      </p>
   );
}

function ReturnEntryForm({
   form,
   formErrors,
   isEditing,
   saving,
   formOpen,
   categorySums,
   onFormOpenToggle,
   onDealerChange,
   onFinancialYearChange,
   onReturnDateChange,
   onCategoryChange,
   onRemarksChange,
   onSave,
   onReset,
}) {
   const [catSearch, setCatSearch] = useState("");

   const noResults = catSearch.trim() && CATEGORY_CONFIG.every(cat =>
      cat.items.every(item => !item.label.toLowerCase().includes(catSearch.toLowerCase()))
   );

   return (
      <div className="border border-gray-200 bg-white shadow-sm overflow-hidden">

         {/* ── Accordion trigger ── */}
         <button
            type="button"
            onClick={onFormOpenToggle}
            className={[
               "w-full flex items-center justify-between px-5 py-4 border-b transition-colors",
               "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400",
               isEditing
                  ? "bg-amber-50 border-amber-100 hover:bg-amber-100"
                  : "bg-green-50 border-green-100 hover:bg-green-100",
               !formOpen ? "border-transparent" : "",
            ].join(" ")}
         >
            <div className="flex items-center gap-2.5">
               <div className={[
                  "w-7 h-7 flex items-center justify-center",
                  isEditing ? "bg-amber-500" : "bg-green-600",
               ].join(" ")}>
                  {isEditing ? (
                     <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                     </svg>
                  ) : (
                     <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a4 4 0 010 8H9m-6-8l3-3m-3 3 3 3" />
                     </svg>
                  )}
               </div>

               <div className="text-left">
                  <p className={[
                     "text-sm font-semibold",
                     isEditing ? "text-amber-800" : "text-green-800",
                  ].join(" ")}>
                     {isEditing ? "Edit return entry" : "New return entry"}
                  </p>
                  {isEditing && (
                     <p className="text-xs text-amber-600 mt-0.5">
                        Editing: {form.dealerName} · FY {form.financialYear}
                     </p>
                  )}
               </div>
            </div>

            <div className="flex items-center gap-2">
               {isEditing && (
                  <span
                     role="button"
                     tabIndex={0}
                     onClick={e => { e.stopPropagation(); onReset(); }}
                     onKeyDown={e => e.key === "Enter" && (e.stopPropagation(), onReset())}
                     className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 px-2.5 py-1.5 hover:bg-white transition-colors"
                  >
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                     </svg>
                     Cancel edit
                  </span>
               )}
               <svg
                  className={[
                     "w-4 h-4 transition-transform duration-200",
                     formOpen ? "rotate-180" : "",
                     isEditing ? "text-amber-500" : "text-green-500",
                  ].join(" ")}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
               >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
               </svg>
            </div>
         </button>

         {/* ── Form body ── */}
         <div className={[
            "transition-all duration-200 overflow-hidden",
            formOpen ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0",
         ].join(" ")}>
            <div className="p-5 space-y-5">

               {/* ── Dealer + Financial Year + Return Date ── */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                     <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Dealer
                     </label>
                     <DealerSelect
                        value={form.dealerName}
                        onChange={onDealerChange}
                        disabled={isEditing}
                        placeholder="Select dealer"
                     />
                     <FieldError message={formErrors.dealerName} />
                     {isEditing && (
                        <p className="text-xs text-amber-600 mt-1">Dealer cannot be changed while editing.</p>
                     )}
                  </div>

                  <div>
                     <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Financial year
                     </label>
                     <FinancialYearSelect
                        value={form.financialYear}
                        onChange={onFinancialYearChange}
                        placeholder="Select financial year"
                        className={formErrors.financialYear ? "border-red-400 focus:ring-red-400" : ""}
                     />
                     <FieldError message={formErrors.financialYear} />
                  </div>

                  <div>
                     <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Return date
                     </label>
                     <input
                        type="date"
                        value={form.returnDate}
                        onChange={onReturnDateChange}
                        className={[
                           "w-full text-sm border px-3 py-2",
                           "focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400",
                           "hover:border-gray-300 transition-all",
                           formErrors.returnDate
                              ? "border-red-400 focus:ring-red-400"
                              : "border-gray-200",
                        ].join(" ")}
                     />
                     <FieldError message={formErrors.returnDate} />
                  </div>
               </div>

               {/* ── Item field search bar ── */}
               <div className="flex items-center gap-2 border border-gray-200 bg-gray-50 px-3 py-2">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  <input
                     type="text"
                     value={catSearch}
                     onChange={e => setCatSearch(e.target.value)}
                     placeholder="Search item fields… (e.g. 63 MM, tee, filter, dripper)"
                     className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-300 text-gray-700"
                  />
                  {catSearch && (
                     <button
                        type="button"
                        onClick={() => setCatSearch("")}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                     >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                     </button>
                  )}
               </div>

               {/* ── Category accordions ── */}
               {CATEGORY_CONFIG.map((cat) => {
                  const filteredItems = catSearch.trim()
                     ? cat.items.filter(item =>
                          item.label.toLowerCase().includes(catSearch.toLowerCase())
                       )
                     : cat.items;

                  if (catSearch.trim() && filteredItems.length === 0) return null;

                  return (
                     <AccordionSection
                        key={cat.key}
                        title={cat.label}
                        subtitle={cat.subtitle}
                        badge={categorySums[cat.key]}
                        accentTitle={cat.accent.title}
                        accentBorder={cat.accent.border}
                        accentHeader={cat.accent.header}
                        accentChevron={cat.accent.chevron}
                        defaultOpen={catSearch.trim() ? true : false}
                     >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3">
                           {filteredItems.map(item => (
                              <NumberField
                                 key={item.key}
                                 label={item.label}
                                 itemKey={item.key}
                                 value={form[cat.key]?.[item.key] ?? ""}
                                 onChange={(itemKey, val) => onCategoryChange(cat.key, itemKey, val)}
                              />
                           ))}
                        </div>
                     </AccordionSection>
                  );
               })}

               {/* ── No results message ── */}
               {noResults && (
                  <div className="text-center py-6 text-sm text-gray-400 border border-dashed border-gray-200">
                     No fields match &ldquo;<span className="text-gray-600 font-medium">{catSearch}</span>&rdquo;
                  </div>
               )}

               {/* ── Remarks ── */}
               <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                     Remarks
                     <span className="ml-1 normal-case font-normal text-gray-400">(optional)</span>
                  </label>
                  <textarea
                     rows={2}
                     value={form.remarks}
                     onChange={onRemarksChange}
                     placeholder="Any notes about this return entry…"
                     maxLength={500}
                     className="w-full text-sm border border-gray-200 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-gray-300 transition-all placeholder:text-gray-300"
                  />
               </div>

               {/* ── Summary bar ── */}
               <SummaryBar categorySums={categorySums} />

               {/* ── Form actions ── */}
               <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100">
                  <button
                     onClick={onReset}
                     disabled={saving}
                     className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                     Reset
                  </button>
                  <button
                     onClick={onSave}
                     disabled={saving}
                     className={[
                        "flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white",
                        "shadow-sm transition-colors disabled:opacity-60",
                        isEditing
                           ? "bg-amber-500 hover:bg-amber-600 active:bg-amber-700"
                           : "bg-green-600 hover:bg-green-700 active:bg-green-800",
                     ].join(" ")}
                  >
                     {saving ? (
                        <>
                           <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                           </svg>
                           {isEditing ? "Updating…" : "Saving…"}
                        </>
                     ) : (
                        isEditing ? "Update entry" : "Save return"
                     )}
                  </button>
               </div>

            </div>
         </div>
      </div>
   );
}

export default ReturnEntryForm;