

// import { useEffect, useRef, useState } from "react";
// import { KEY_TO_ITEM_NAME } from "../../../constants/ItemRates";

// // Sorted list of all item names for the dropdown
// const ITEM_NAME_OPTIONS = Object.values(KEY_TO_ITEM_NAME).sort((a, b) =>
//   a.localeCompare(b)
// );

// const EMPTY_FORM = {
//   itemName: "",
//   rateUpto: "",
//   rateFrom: "",
// };

// export default function DealerItemRateModal({ isOpen, onClose, onSave, editRecord }) {
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [errors, setErrors] = useState({});
//   const [saving, setSaving] = useState(false);

//   // Searchable dropdown state
//   const [search, setSearch] = useState("");
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const searchRef = useRef(null);

//   // Populate form when editing
//   useEffect(() => {
//     if (editRecord) {
//       setForm({
//         itemName: editRecord.itemName,
//         rateUpto: editRecord.rateUpto,
//         rateFrom: editRecord.rateFrom,
//       });
//     } else {
//       setForm(EMPTY_FORM);
//     }
//     setErrors({});
//     setSearch("");
//     setDropdownOpen(false);
//   }, [editRecord, isOpen]);

//   // Close dropdown on outside click
//   useEffect(() => {
//     function handleOutside(e) {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleOutside);
//     return () => document.removeEventListener("mousedown", handleOutside);
//   }, []);

//   // Focus search input when dropdown opens
//   useEffect(() => {
//     if (dropdownOpen && searchRef.current) {
//       searchRef.current.focus();
//     }
//   }, [dropdownOpen]);

//   if (!isOpen) return null;

//   const filteredOptions = ITEM_NAME_OPTIONS.filter((name) =>
//     name.toLowerCase().includes(search.toLowerCase())
//   );

//   function validate() {
//     const e = {};
//     if (!form.itemName) e.itemName = "Select an item.";
//     if (form.rateUpto === "" || isNaN(form.rateUpto) || Number(form.rateUpto) < 0)
//       e.rateUpto = "Enter a valid rate (≥ 0).";
//     if (form.rateFrom === "" || isNaN(form.rateFrom) || Number(form.rateFrom) < 0)
//       e.rateFrom = "Enter a valid rate (≥ 0).";
//     return e;
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     const e2 = validate();
//     if (Object.keys(e2).length) { setErrors(e2); return; }
//     setSaving(true);
//     try {
//       await onSave({
//         itemName: form.itemName,
//         rateUpto: Number(form.rateUpto),
//         rateFrom: Number(form.rateFrom),
//       });
//       onClose();
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     // Backdrop
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
//       <div className="w-full max-w-2xl bg-white shadow-2xl">

//         {/* Header */}
//         <div className="flex items-center justify-between border-b px-7 py-5">
//           <h2 className="text-lg font-semibold text-black">
//             {editRecord ? "Edit Rate Override" : "Add Rate Override"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-black hover:text-black/70 text-2xl leading-none"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Body */}
//         <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">

//           {/* ── Item Name — searchable dropdown ── */}
//           <div>
//             <label className="block text-sm font-medium text-black mb-2">
//               Item Name
//             </label>

//             {editRecord ? (
//               /* Locked when editing */
//               <div className="w-full border bg-gray-50 px-3 py-2.5 text-sm text-black">
//                 {form.itemName}
//               </div>
//             ) : (
//               /* Custom searchable dropdown */
//               <div className="relative" ref={dropdownRef}>
//                 {/* Trigger button */}
//                 <button
//                   type="button"
//                   onClick={() => setDropdownOpen((o) => !o)}
//                   className={`w-full border px-3 py-2.5 text-sm text-left flex items-center
//                     justify-between focus:outline-none focus:ring-2 focus:ring-green-600 transition
//                     ${errors.itemName ? "border-red-400" : "border-black"}
//                     ${form.itemName ? "text-black" : "text-black/50"}`}
//                 >
//                   <span className="truncate">
//                     {form.itemName || "— Select item —"}
//                   </span>
//                   <svg
//                     className={`w-4 h-4 text-black flex-shrink-0 ml-2 transition-transform
//                       ${dropdownOpen ? "rotate-180" : ""}`}
//                     fill="none" stroke="currentColor" viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round"
//                       strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>

//                 {/* Dropdown panel */}
//                 {dropdownOpen && (
//                   <div className="absolute z-10 mt-1 w-full border bg-white shadow-lg overflow-hidden">

//                     {/* Search bar */}
//                     <div className="p-2 border-b">
//                       <div className="relative">
//                         <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black"
//                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                             d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
//                         </svg>
//                         <input
//                           ref={searchRef}
//                           type="text"
//                           value={search}
//                           onChange={(e) => setSearch(e.target.value)}
//                           placeholder="Search items…"
//                           className="w-full border px-8 py-2 text-sm text-black
//                             focus:outline-none focus:ring-2 focus:ring-green-600"
//                         />
//                       </div>
//                     </div>

//                     {/* Options list */}
//                     <ul className="max-h-56 overflow-y-auto py-1">
//                       {filteredOptions.length === 0 ? (
//                         <li className="px-4 py-3 text-sm text-black/50 text-center">
//                           No items match "{search}"
//                         </li>
//                       ) : (
//                         filteredOptions.map((name) => (
//                           <li
//                             key={name}
//                             onClick={() => {
//                               setForm((f) => ({ ...f, itemName: name }));
//                               setErrors((e) => ({ ...e, itemName: undefined }));
//                               setDropdownOpen(false);
//                               setSearch("");
//                             }}
//                             className={`px-4 py-2.5 text-sm cursor-pointer transition-colors
//                               ${form.itemName === name
//                                 ? "bg-green-100 text-black font-medium"
//                                 : "text-black hover:bg-gray-100"
//                               }`}
//                           >
//                             {name}
//                           </li>
//                         ))
//                       )}
//                     </ul>

//                     {/* Count badge */}
//                     <div className="px-4 py-2 border-t bg-gray-50 text-xs text-black/60">
//                       {filteredOptions.length} of {ITEM_NAME_OPTIONS.length} items
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {errors.itemName && (
//               <p className="mt-1 text-xs text-red-600">{errors.itemName}</p>
//             )}
//             {editRecord && (
//               <p className="mt-1 text-xs text-black/60">
//                 Item cannot be changed. Delete and re-add to change item.
//               </p>
//             )}
//           </div>

//           {/* ── Rate fields ── */}
//           <div className="grid grid-cols-2 gap-5">
//             {/* Rate Upto */}
//             <div>
//               <label className="block text-sm font-medium text-black mb-2">
//                 Rate Upto
//                 <span className="ml-1 text-xs font-normal text-black/60">(before Sep 13, 2022)</span>
//               </label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50 text-sm">₹</span>
//                 <input
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={form.rateUpto}
//                   onChange={(e) => setForm((f) => ({ ...f, rateUpto: e.target.value }))}
//                   placeholder="0.00"
//                   className={`w-full border pl-7 pr-3 py-2.5 text-sm text-black
//                     focus:outline-none focus:ring-2 focus:ring-green-600 transition
//                     ${errors.rateUpto ? "border-red-400" : "border-black"}`}
//                 />
//               </div>
//               {errors.rateUpto && (
//                 <p className="mt-1 text-xs text-red-600">{errors.rateUpto}</p>
//               )}
//             </div>

//             {/* Rate From */}
//             <div>
//               <label className="block text-sm font-medium text-black mb-2">
//                 Rate From
//                 <span className="ml-1 text-xs font-normal text-black/60">(after Sep 13, 2022)</span>
//               </label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50 text-sm">₹</span>
//                 <input
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={form.rateFrom}
//                   onChange={(e) => setForm((f) => ({ ...f, rateFrom: e.target.value }))}
//                   placeholder="0.00"
//                   className={`w-full border pl-7 pr-3 py-2.5 text-sm text-black
//                     focus:outline-none focus:ring-2 focus:ring-green-600 transition
//                     ${errors.rateFrom ? "border-red-400" : "border-black"}`}
//                 />
//               </div>
//               {errors.rateFrom && (
//                 <p className="mt-1 text-xs text-red-600">{errors.rateFrom}</p>
//               )}
//             </div>
//           </div>

//           {/* ── Actions ── */}
//           <div className="flex justify-end gap-3 pt-1">
//             <button
//               type="button"
//               onClick={onClose}
//               className="border border-black px-5 py-2.5 text-sm text-black
//                 hover:bg-gray-100 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="bg-green-600 px-6 py-2.5 text-sm font-medium
//                 text-white hover:bg-green-700 disabled:opacity-60 transition-colors"
//             >
//               {saving ? "Saving…" : editRecord ? "Save Changes" : "Add Override"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }













import { useEffect, useRef, useState } from "react";
import { KEY_TO_ITEM_NAME } from "../../../constants/ItemRates";

// Sorted list of all item names for the dropdown
const ITEM_NAME_OPTIONS = Object.values(KEY_TO_ITEM_NAME).sort((a, b) =>
  a.localeCompare(b)
);

const EMPTY_FORM = {
  itemName: "",
  rateUpto: "",
  rateFrom: "",
};

export default function DealerItemRateModal({ isOpen, onClose, onSave, editRecord }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Searchable dropdown state
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Populate form when editing
  useEffect(() => {
    if (editRecord) {
      setForm({
        itemName: editRecord.itemName,
        rateUpto: editRecord.rateUpto,
        rateFrom: editRecord.rateFrom,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
    setSearch("");
    setDropdownOpen(false);
  }, [editRecord, isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (dropdownOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [dropdownOpen]);

  if (!isOpen) return null;

  const filteredOptions = ITEM_NAME_OPTIONS.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  function validate() {
    const e = {};
    if (!form.itemName) e.itemName = "Select an item.";
    if (form.rateUpto === "" || isNaN(form.rateUpto) || Number(form.rateUpto) < 0)
      e.rateUpto = "Enter a valid rate (≥ 0).";
    if (form.rateFrom === "" || isNaN(form.rateFrom) || Number(form.rateFrom) < 0)
      e.rateFrom = "Enter a valid rate (≥ 0).";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSaving(true);
    try {
      await onSave({
        itemName: form.itemName,
        rateUpto: Number(form.rateUpto),
        rateFrom: Number(form.rateFrom),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl border border-zinc-200">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-emerald-500"></div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
              {editRecord ? "Edit Rate Override" : "Add Rate Override"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center w-7 h-7 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* ── Item Name — searchable dropdown ── */}
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1">
              Item Name
            </label>

            {editRecord ? (
              /* Locked when editing */
              <div className="w-full border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 font-medium">
                {form.itemName}
              </div>
            ) : (
              /* Custom searchable dropdown */
              <div className="relative" ref={dropdownRef}>
                {/* Trigger button */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen((o) => !o)}
                  className={`w-full border px-3 py-2.5 text-sm text-left flex items-center
                    justify-between focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition
                    ${errors.itemName ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}
                    ${form.itemName ? "text-zinc-900" : "text-zinc-400"}`}
                >
                  <span className="truncate">
                    {form.itemName || "— Select item —"}
                  </span>
                  <svg
                    className={`w-4 h-4 text-zinc-400 flex-shrink-0 ml-2 transition-transform
                      ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown panel */}
                {dropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full border border-zinc-200 bg-white shadow-lg overflow-hidden">

                    {/* Search bar */}
                    <div className="p-2 border-b border-zinc-100">
                      <div className="relative">
                        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                          fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                        <input
                          ref={searchRef}
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search items…"
                          className="w-full border border-zinc-300 px-8 py-2 text-sm text-zinc-900 placeholder-zinc-400
                            focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                        />
                      </div>
                    </div>

                    {/* Options list */}
                    <ul className="max-h-56 overflow-y-auto py-1">
                      {filteredOptions.length === 0 ? (
                        <li className="px-4 py-3 text-sm text-zinc-400 text-center">
                          No items match "{search}"
                        </li>
                      ) : (
                        filteredOptions.map((name) => (
                          <li
                            key={name}
                            onClick={() => {
                              setForm((f) => ({ ...f, itemName: name }));
                              setErrors((e) => ({ ...e, itemName: undefined }));
                              setDropdownOpen(false);
                              setSearch("");
                            }}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors
                              ${form.itemName === name
                                ? "bg-emerald-50 text-emerald-800 font-semibold"
                                : "text-zinc-700 hover:bg-zinc-50"
                              }`}
                          >
                            {name}
                          </li>
                        ))
                      )}
                    </ul>

                    {/* Count badge */}
                    <div className="px-4 py-2 border-t border-zinc-100 bg-zinc-50 text-xs text-zinc-400">
                      {filteredOptions.length} of {ITEM_NAME_OPTIONS.length} items
                    </div>
                  </div>
                )}
              </div>
            )}

            {errors.itemName && (
              <p className="mt-1 text-xs text-red-500">{errors.itemName}</p>
            )}
            {editRecord && (
              <p className="mt-1 text-xs text-zinc-400">
                Item cannot be changed. Delete and re-add to change item.
              </p>
            )}
          </div>

          {/* ── Rate fields ── */}
          <div className="grid grid-cols-2 gap-4">
            {/* Rate Upto */}
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">
                Rate Upto
                <span className="ml-1 text-xs font-normal text-zinc-400">(before Sep 13, 2022)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">₹</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.rateUpto}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, rateUpto: e.target.value }));
                    if (errors.rateUpto) setErrors((er) => ({ ...er, rateUpto: "" }));
                  }}
                  placeholder="0.00"
                  className={`w-full border pl-7 pr-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400
                    focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition
                    ${errors.rateUpto ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`}
                />
              </div>
              {errors.rateUpto && (
                <p className="mt-1 text-xs text-red-500">{errors.rateUpto}</p>
              )}
            </div>

            {/* Rate From */}
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">
                Rate From
                <span className="ml-1 text-xs font-normal text-zinc-400">(after Sep 13, 2022)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">₹</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.rateFrom}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, rateFrom: e.target.value }));
                    if (errors.rateFrom) setErrors((er) => ({ ...er, rateFrom: "" }));
                  }}
                  placeholder="0.00"
                  className={`w-full border pl-7 pr-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400
                    focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition
                    ${errors.rateFrom ? "border-red-400 bg-red-50" : "border-zinc-300 bg-white"}`}
                />
              </div>
              {errors.rateFrom && (
                <p className="mt-1 text-xs text-red-500">{errors.rateFrom}</p>
              )}
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex justify-end gap-2 pt-1 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-zinc-600 border border-zinc-300 hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 border border-emerald-700 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Saving…" : editRecord ? "Save Changes" : "Add Override"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}