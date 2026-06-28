
// // // // import { useRef, useState, useMemo } from "react";
// // // // import { DealerSelect } from "../../../components/app";
// // // // import FinancialYearSelect from "../../../components/app/FinancialYearSelect";
// // // // import api from "../../../api/axios";
// // // // import FileSlot from "../../UploadPage/components/FileSlot";
// // // // import { TALLY_INVENTORY_TYPE } from "./constants";
// // // // import { validateFile } from "./helpers";

// // // // const ALL_TABS = ["Paid Cash", "Incentives", "Inventory"];
// // // // const ALL_TAB_ICONS = ["💵", "🎁", "📦"];
// // // // const ALL_TAB_ENDPOINTS = ["/paid-cash", "/incentives", null];
// // // // const ALL_TAB_KEYS = ["paidCash", "incentives", "inventory"];

// // // // const TODAY = new Date().toISOString().slice(0, 10);

// // // // const makeEmptyForm = () => ({
// // // //    date: TODAY,
// // // //    dealerName: "",
// // // //    farmerDealerCode: "",
// // // //    amount: "",
// // // //    financialYear: "",
// // // //    remarks: "",
// // // // });

// // // // const makeEmptySlot = () => ({
// // // //    file: null, fileError: null, status: "idle", progress: 0, result: null, errorMsg: null,
// // // // });

// // // // function Field({ label, children, error }) {
// // // //    return (
// // // //       <div className="flex flex-col gap-1">
// // // //          <label className="text-[11px] font-semibold uppercase tracking-widest text-black opacity-50">
// // // //             {label}
// // // //          </label>
// // // //          {children}
// // // //          {error && <p className="text-[11px] text-red-600">{error}</p>}
// // // //       </div>
// // // //    );
// // // // }

// // // // function TextInput({ type = "text", value, onChange, placeholder, disabled, min }) {
// // // //    return (
// // // //       <input
// // // //          type={type} value={value} onChange={onChange}
// // // //          placeholder={placeholder} disabled={disabled} min={min}
// // // //          className="w-full px-3 py-2.5 sm:py-2 text-sm border border-gray-300 bg-white text-black
// // // //             focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-600
// // // //             disabled:opacity-50 disabled:cursor-not-allowed transition placeholder-gray-400"
// // // //       />
// // // //    );
// // // // }

// // // // function Spinner() {
// // // //    return (
// // // //       <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
// // // //          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
// // // //          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
// // // //       </svg>
// // // //    );
// // // // }

// // // // function Banner({ type, message, onClose }) {
// // // //    if (!message) return null;
// // // //    return (
// // // //       <div className={`flex items-start justify-between gap-3 px-4 py-3 text-sm border
// // // //          ${type === "success"
// // // //             ? "bg-green-50 border-green-300 text-black"
// // // //             : "bg-red-50 border-red-300 text-black"}`}
// // // //       >
// // // //          <span className="leading-snug">{message}</span>
// // // //          <button onClick={onClose} className="shrink-0 opacity-50 hover:opacity-100 transition text-base leading-none mt-0.5">✕</button>
// // // //       </div>
// // // //    );
// // // // }

// // // // /**
// // // //  * @param {string[]} [allowedTabs] - subset of ["paidCash","incentives","inventory"].
// // // //  *        Defaults to all three. If only one tab is allowed, the tab bar is hidden.
// // // //  */
// // // // function ManualEntry({ onInventoryUploaded, onEntryAdded, allowedTabs }) {
// // // //    const inputRef = useRef(null);

// // // //    // Build filtered tab metadata based on allowedTabs
// // // //    const { TABS, TAB_ICONS, TAB_ENDPOINTS, TAB_KEYS } = useMemo(() => {
// // // //       const keys = allowedTabs && allowedTabs.length > 0 ? allowedTabs : ALL_TAB_KEYS;
// // // //       const indices = keys
// // // //          .map(k => ALL_TAB_KEYS.indexOf(k))
// // // //          .filter(i => i !== -1);

// // // //       return {
// // // //          TABS: indices.map(i => ALL_TABS[i]),
// // // //          TAB_ICONS: indices.map(i => ALL_TAB_ICONS[i]),
// // // //          TAB_ENDPOINTS: indices.map(i => ALL_TAB_ENDPOINTS[i]),
// // // //          TAB_KEYS: indices.map(i => ALL_TAB_KEYS[i]),
// // // //       };
// // // //    }, [allowedTabs]);

// // // //    const [activeTab, setActiveTab] = useState(0);
// // // //    const [form, setForm]           = useState(makeEmptyForm);
// // // //    const [errors, setErrors]       = useState({});
// // // //    const [loading, setLoading]     = useState(false);
// // // //    const [banner, setBanner]       = useState({ type: "", message: "" });
// // // //    const [slot, setSlot]           = useState(makeEmptySlot);
// // // //    const [dragOver, setDragOver]   = useState(false);

// // // //    const showTabBar = TABS.length > 1;

// // // //    function handleDealerChange(dealerName, farmerDealerCode) {
// // // //       setForm(prev => ({ ...prev, dealerName, farmerDealerCode: farmerDealerCode ?? "" }));
// // // //       setErrors(prev => ({ ...prev, dealerName: "" }));
// // // //    }

// // // //    function handleField(key, value) {
// // // //       setForm(prev => ({ ...prev, [key]: value }));
// // // //       setErrors(prev => ({ ...prev, [key]: "" }));
// // // //    }

// // // //    function validate() {
// // // //       const e = {};
// // // //       if (!form.dealerName)    e.dealerName    = "Please select a dealer.";
// // // //       if (!form.financialYear) e.financialYear = "Please select a financial year.";
// // // //       if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
// // // //          e.amount = "Enter a valid amount greater than 0.";
// // // //       return e;
// // // //    }

// // // //    async function handleSubmit() {
// // // //       const e = validate();
// // // //       if (Object.keys(e).length) { setErrors(e); return; }
// // // //       setLoading(true);
// // // //       setBanner({ type: "", message: "" });
// // // //       try {
// // // //          await api.post(TAB_ENDPOINTS[activeTab], {
// // // //             date: form.date,
// // // //             dealerName: form.dealerName,
// // // //             farmerDealerCode: form.farmerDealerCode,
// // // //             amount: Number(form.amount),
// // // //             financialYear: form.financialYear,
// // // //             remarks: form.remarks,
// // // //          });
// // // //          setBanner({ type: "success", message: `${TABS[activeTab]} entry saved successfully!` });
// // // //          setForm(makeEmptyForm());
// // // //          setErrors({});
// // // //          onEntryAdded?.();
// // // //       } catch (err) {
// // // //          setBanner({ type: "error", message: err.response?.data?.message ?? "Something went wrong." });
// // // //       } finally {
// // // //          setLoading(false);
// // // //       }
// // // //    }

// // // //    function handleFileSelect(file) {
// // // //       const { valid, error } = validateFile(file, TALLY_INVENTORY_TYPE.acceptedName);
// // // //       setSlot(prev => ({
// // // //          ...prev,
// // // //          file: valid ? file : null,
// // // //          fileError: error,
// // // //          status: "idle",
// // // //          result: null,
// // // //          errorMsg: null,
// // // //       }));
// // // //    }

// // // //    function handleFileRemove() {
// // // //       setSlot(makeEmptySlot());
// // // //       if (inputRef.current) inputRef.current.value = "";
// // // //    }

// // // //    async function handleUpload() {
// // // //       if (!slot.file || !form.dealerName || !form.financialYear) return;
// // // //       setSlot(prev => ({ ...prev, status: "uploading", progress: 0, errorMsg: null }));
// // // //       const timer = setInterval(() => {
// // // //          setSlot(prev => prev.progress < 85 ? { ...prev, progress: prev.progress + 15 } : prev);
// // // //       }, 300);
// // // //       try {
// // // //          const body = new FormData();
// // // //          body.append("file", slot.file);
// // // //          const { data } = await api.post(
// // // //             `${TALLY_INVENTORY_TYPE.endpoint}?dealerName=${encodeURIComponent(form.dealerName)}&farmerDealerCode=${encodeURIComponent(form.farmerDealerCode)}&financialYear=${encodeURIComponent(form.financialYear)}`,
// // // //             body,
// // // //             { headers: { "Content-Type": "multipart/form-data" } }
// // // //          );
// // // //          clearInterval(timer);
// // // //          setSlot(prev => ({ ...prev, status: "success", progress: 100, result: { totalRows: data.inserted ?? 0 } }));
// // // //          onInventoryUploaded?.();
// // // //          onEntryAdded?.();
// // // //       } catch (err) {
// // // //          clearInterval(timer);
// // // //          setSlot(prev => ({ ...prev, status: "error", progress: 0, errorMsg: err?.response?.data?.message ?? "Upload failed. Please try again." }));
// // // //       }
// // // //    }

// // // //    function handleTabChange(idx) {
// // // //       setActiveTab(idx);
// // // //       setForm(makeEmptyForm());
// // // //       setErrors({});
// // // //       setBanner({ type: "", message: "" });
// // // //       setSlot(makeEmptySlot());
// // // //    }

// // // //    const isInventoryTab = TAB_KEYS[activeTab] === "inventory";
// // // //    const canUpload      = !!form.dealerName && !!form.financialYear;

// // // //    return (
// // // //       <div className="bg-white border border-gray-300 p-4 sm:p-5">

// // // //          <p className="text-[11px] uppercase tracking-widest font-semibold mb-4 text-green-700">
// // // //             Manual Entry
// // // //          </p>

// // // //          {/* Tab bar — hidden when only one tab is allowed */}
// // // //          {showTabBar && (
// // // //             <div className="overflow-x-auto -mx-4 sm:mx-0 scrollbar-none">
// // // //                <div className="flex gap-0 border-b-2 border-gray-300 mb-5 min-w-max px-4 sm:px-0">
// // // //                   {TABS.map((tab, idx) => (
// // // //                      <button
// // // //                         key={tab}
// // // //                         type="button"
// // // //                         onClick={() => handleTabChange(idx)}
// // // //                         className={`flex items-center gap-1.5 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-0.5 transition-colors cursor-pointer whitespace-nowrap
// // // //                            ${activeTab === idx
// // // //                               ? "text-black border-green-700"
// // // //                               : "text-black opacity-40 border-transparent hover:opacity-70"}`}
// // // //                      >
// // // //                         <span>{TAB_ICONS[idx]}</span>
// // // //                         {tab}
// // // //                      </button>
// // // //                   ))}
// // // //                </div>
// // // //             </div>
// // // //          )}

// // // //          {!isInventoryTab && banner.message && (
// // // //             <div className="mb-4">
// // // //                <Banner type={banner.type} message={banner.message} onClose={() => setBanner({ type: "", message: "" })} />
// // // //             </div>
// // // //          )}

// // // //          {/* Shared fields */}
// // // //          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
// // // //             <Field label="Financial Year" error={errors.financialYear}>
// // // //                <FinancialYearSelect
// // // //                   value={form.financialYear}
// // // //                   onChange={e => handleField("financialYear", e.target.value)}
// // // //                   disabled={loading}
// // // //                />
// // // //             </Field>
// // // //             <Field label="Dealer Name" error={errors.dealerName}>
// // // //                <DealerSelect
// // // //                   value={form.dealerName}
// // // //                   onChange={handleDealerChange}
// // // //                   disabled={loading}
// // // //                   placeholder="Select dealer"
// // // //                />
// // // //             </Field>
// // // //          </div>

// // // //          {/* Paid Cash / Incentives */}
// // // //          {!isInventoryTab && (
// // // //             <>
// // // //                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // // //                   <Field label="Date" error={errors.date}>
// // // //                      <TextInput
// // // //                         type="date"
// // // //                         value={form.date}
// // // //                         onChange={e => handleField("date", e.target.value)}
// // // //                         disabled={loading}
// // // //                      />
// // // //                   </Field>
// // // //                   <Field label="Amount (₹)" error={errors.amount}>
// // // //                      <TextInput
// // // //                         type="number"
// // // //                         value={form.amount}
// // // //                         onChange={e => handleField("amount", e.target.value)}
// // // //                         placeholder="0.00"
// // // //                         disabled={loading}
// // // //                         min="0"
// // // //                      />
// // // //                   </Field>
// // // //                </div>

// // // //                <div className="mt-4">
// // // //                   <Field label="Remarks" error={errors.remarks}>
// // // //                      <TextInput
// // // //                         type="text"
// // // //                         value={form.remarks}
// // // //                         onChange={e => handleField("remarks", e.target.value)}
// // // //                         placeholder="Optional remarks…"
// // // //                         disabled={loading}
// // // //                      />
// // // //                   </Field>
// // // //                </div>

// // // //                {(form.dealerName || form.amount) && (
// // // //                   <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 p-3 bg-gray-50 border border-gray-200 text-xs text-black">
// // // //                      <span className="font-semibold">Preview:</span>
// // // //                      {form.date && <span>{form.date}</span>}
// // // //                      {form.financialYear && (
// // // //                         <>
// // // //                            <span className="text-gray-400">·</span>
// // // //                            <span className="font-medium">{form.financialYear}</span>
// // // //                         </>
// // // //                      )}
// // // //                      {form.dealerName && (
// // // //                         <>
// // // //                            <span className="text-gray-400">·</span>
// // // //                            <span className="font-medium">{form.dealerName}</span>
// // // //                         </>
// // // //                      )}
// // // //                      {form.amount && (
// // // //                         <>
// // // //                            <span className="text-gray-400">·</span>
// // // //                            <span className="font-semibold">₹ {Number(form.amount).toLocaleString("en-IN")}</span>
// // // //                         </>
// // // //                      )}
// // // //                      {form.remarks && (
// // // //                         <>
// // // //                            <span className="text-gray-400">·</span>
// // // //                            <span className="italic text-gray-500">{form.remarks}</span>
// // // //                         </>
// // // //                      )}
// // // //                   </div>
// // // //                )}

// // // //                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 mt-5 pt-4 border-t border-gray-200">
// // // //                   <button
// // // //                      type="button"
// // // //                      onClick={() => handleTabChange(activeTab)}
// // // //                      disabled={loading}
// // // //                      className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-semibold text-black border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition text-center"
// // // //                   >
// // // //                      Reset
// // // //                   </button>
// // // //                   <button
// // // //                      type="button"
// // // //                      onClick={handleSubmit}
// // // //                      disabled={loading}
// // // //                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 focus:ring-2 focus:ring-green-200 disabled:opacity-60 transition"
// // // //                   >
// // // //                      {loading && <Spinner />}
// // // //                      {loading ? "Saving…" : `Save ${TABS[activeTab]}`}
// // // //                   </button>
// // // //                </div>
// // // //             </>
// // // //          )}

// // // //          {/* Inventory tab */}
// // // //          {isInventoryTab && (
// // // //             <div className="flex flex-col gap-3">
// // // //                {!canUpload && (
// // // //                   <p className="text-xs text-black bg-amber-50 border border-amber-300 px-3 py-2">
// // // //                      ⚠️ Select a dealer and financial year above before uploading.
// // // //                   </p>
// // // //                )}
// // // //                <div className={!canUpload ? "opacity-50 pointer-events-none" : ""}>
// // // //                   <FileSlot
// // // //                      type={TALLY_INVENTORY_TYPE}
// // // //                      slot={slot}
// // // //                      isDragOver={dragOver}
// // // //                      inputRef={inputRef}
// // // //                      selectedYear={form.financialYear || "25-26"}
// // // //                      onFileSelect={handleFileSelect}
// // // //                      onRemove={handleFileRemove}
// // // //                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
// // // //                      onDragLeave={() => setDragOver(false)}
// // // //                      onDrop={e => {
// // // //                         e.preventDefault();
// // // //                         setDragOver(false);
// // // //                         const f = e.dataTransfer.files?.[0];
// // // //                         if (f) handleFileSelect(f);
// // // //                      }}
// // // //                      onUploadSingle={handleUpload}
// // // //                      disabled={slot.status === "uploading"}
// // // //                   />
// // // //                </div>
// // // //             </div>
// // // //          )}
// // // //       </div>
// // // //    );
// // // // }

// // // // export default ManualEntry;












// // // import { useRef, useState, useMemo } from "react";
// // // import { DealerSelect } from "../../../components/app";
// // // import FinancialYearSelect from "../../../components/app/FinancialYearSelect";
// // // import api from "../../../api/axios";
// // // import FileSlot from "../../UploadPage/components/FileSlot";
// // // import { TALLY_INVENTORY_TYPE } from "./constants";
// // // import { validateFile } from "./helpers";

// // // const ALL_TABS = ["Paid Cash", "Incentives", "Inventory"];
// // // const ALL_TAB_ICONS = ["💵", "🎁", "📦"];
// // // const ALL_TAB_ENDPOINTS = ["/paid-cash", "/incentives", null];
// // // const ALL_TAB_KEYS = ["paidCash", "incentives", "inventory"];

// // // const TODAY = new Date().toISOString().slice(0, 10);

// // // const makeEmptyForm = () => ({
// // //    date: TODAY,
// // //    dealerName: "",
// // //    farmerDealerCode: "",
// // //    amount: "",
// // //    financialYear: "",
// // //    remarks: "",
// // // });

// // // const makeEmptySlot = () => ({
// // //    file: null, fileError: null, status: "idle", progress: 0, result: null, errorMsg: null,
// // // });

// // // /**
// // //  * "22-23" → { min: "2022-04-01", max: "2023-03-31" }
// // //  * Returns null if financialYear is empty / invalid.
// // //  */
// // // function getFYDateRange(financialYear) {
// // //    if (!financialYear) return null;
// // //    const parts = financialYear.split("-");
// // //    if (parts.length !== 2) return null;
// // //    const startYY = parseInt(parts[0], 10);
// // //    const endYY   = parseInt(parts[1], 10);
// // //    if (isNaN(startYY) || isNaN(endYY)) return null;

// // //    // Convert 2-digit year to 4-digit (assumes 2000s)
// // //    const startYear = startYY < 100 ? 2000 + startYY : startYY;
// // //    const endYear   = endYY   < 100 ? 2000 + endYY   : endYY;

// // //    return {
// // //       min: `${startYear}-04-01`,
// // //       max: `${endYear}-03-31`,
// // //    };
// // // }

// // // function Field({ label, children, error }) {
// // //    return (
// // //       <div className="flex flex-col gap-1">
// // //          <label className="text-[11px] font-semibold uppercase tracking-widest text-black opacity-50">
// // //             {label}
// // //          </label>
// // //          {children}
// // //          {error && <p className="text-[11px] text-red-600">{error}</p>}
// // //       </div>
// // //    );
// // // }

// // // function TextInput({ type = "text", value, onChange, placeholder, disabled, min, max }) {
// // //    return (
// // //       <input
// // //          type={type} value={value} onChange={onChange}
// // //          placeholder={placeholder} disabled={disabled} min={min} max={max}
// // //          className="w-full px-3 py-2.5 sm:py-2 text-sm border border-gray-300 bg-white text-black
// // //             focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-600
// // //             disabled:opacity-50 disabled:cursor-not-allowed transition placeholder-gray-400"
// // //       />
// // //    );
// // // }

// // // function Spinner() {
// // //    return (
// // //       <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
// // //          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
// // //          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
// // //       </svg>
// // //    );
// // // }

// // // function Banner({ type, message, onClose }) {
// // //    if (!message) return null;
// // //    return (
// // //       <div className={`flex items-start justify-between gap-3 px-4 py-3 text-sm border
// // //          ${type === "success"
// // //             ? "bg-green-50 border-green-300 text-black"
// // //             : "bg-red-50 border-red-300 text-black"}`}
// // //       >
// // //          <span className="leading-snug">{message}</span>
// // //          <button onClick={onClose} className="shrink-0 opacity-50 hover:opacity-100 transition text-base leading-none mt-0.5">✕</button>
// // //       </div>
// // //    );
// // // }

// // // /**
// // //  * @param {string[]} [allowedTabs] - subset of ["paidCash","incentives","inventory"].
// // //  *        Defaults to all three. If only one tab is allowed, the tab bar is hidden.
// // //  */
// // // function ManualEntry({ onInventoryUploaded, onEntryAdded, allowedTabs }) {
// // //    const inputRef = useRef(null);

// // //    // Build filtered tab metadata based on allowedTabs
// // //    const { TABS, TAB_ICONS, TAB_ENDPOINTS, TAB_KEYS } = useMemo(() => {
// // //       const keys = allowedTabs && allowedTabs.length > 0 ? allowedTabs : ALL_TAB_KEYS;
// // //       const indices = keys
// // //          .map(k => ALL_TAB_KEYS.indexOf(k))
// // //          .filter(i => i !== -1);

// // //       return {
// // //          TABS: indices.map(i => ALL_TABS[i]),
// // //          TAB_ICONS: indices.map(i => ALL_TAB_ICONS[i]),
// // //          TAB_ENDPOINTS: indices.map(i => ALL_TAB_ENDPOINTS[i]),
// // //          TAB_KEYS: indices.map(i => ALL_TAB_KEYS[i]),
// // //       };
// // //    }, [allowedTabs]);

// // //    const [activeTab, setActiveTab] = useState(0);
// // //    const [form, setForm]           = useState(makeEmptyForm);
// // //    const [errors, setErrors]       = useState({});
// // //    const [loading, setLoading]     = useState(false);
// // //    const [banner, setBanner]       = useState({ type: "", message: "" });
// // //    const [slot, setSlot]           = useState(makeEmptySlot);
// // //    const [dragOver, setDragOver]   = useState(false);

// // //    const showTabBar = TABS.length > 1;

// // //    // Derive date range from selected financial year
// // //    const fyDateRange = getFYDateRange(form.financialYear);

// // //    function handleDealerChange(dealerName, farmerDealerCode) {
// // //       setForm(prev => ({ ...prev, dealerName, farmerDealerCode: farmerDealerCode ?? "" }));
// // //       setErrors(prev => ({ ...prev, dealerName: "" }));
// // //    }

// // //    function handleField(key, value) {
// // //       setForm(prev => ({ ...prev, [key]: value }));
// // //       setErrors(prev => ({ ...prev, [key]: "" }));
// // //    }

// // //    // When financial year changes, reset date so stale date doesn't silently sit out of range
// // //    function handleFinancialYearChange(value) {
// // //       setForm(prev => ({ ...prev, financialYear: value, date: "" }));
// // //       setErrors(prev => ({ ...prev, financialYear: "", date: "" }));
// // //    }

// // //    function validate() {
// // //       const e = {};
// // //       if (!form.dealerName)    e.dealerName    = "Please select a dealer.";
// // //       if (!form.financialYear) e.financialYear = "Please select a financial year.";
// // //       if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
// // //          e.amount = "Enter a valid amount greater than 0.";

// // //       // Date validation against financial year range
// // //       if (!form.date) {
// // //          e.date = "Please select a date.";
// // //       } else if (fyDateRange) {
// // //          if (form.date < fyDateRange.min || form.date > fyDateRange.max) {
// // //             e.date = `Date must be between ${fyDateRange.min} and ${fyDateRange.max} for FY ${form.financialYear}.`;
// // //          }
// // //       }

// // //       return e;
// // //    }

// // //    async function handleSubmit() {
// // //       const e = validate();
// // //       if (Object.keys(e).length) { setErrors(e); return; }
// // //       setLoading(true);
// // //       setBanner({ type: "", message: "" });
// // //       try {
// // //          await api.post(TAB_ENDPOINTS[activeTab], {
// // //             date: form.date,
// // //             dealerName: form.dealerName,
// // //             farmerDealerCode: form.farmerDealerCode,
// // //             amount: Number(form.amount),
// // //             financialYear: form.financialYear,
// // //             remarks: form.remarks,
// // //          });
// // //          setBanner({ type: "success", message: `${TABS[activeTab]} entry saved successfully!` });
// // //          setForm(makeEmptyForm());
// // //          setErrors({});
// // //          onEntryAdded?.();
// // //       } catch (err) {
// // //          setBanner({ type: "error", message: err.response?.data?.message ?? "Something went wrong." });
// // //       } finally {
// // //          setLoading(false);
// // //       }
// // //    }

// // //    function handleFileSelect(file) {
// // //       const { valid, error } = validateFile(file, TALLY_INVENTORY_TYPE.acceptedName);
// // //       setSlot(prev => ({
// // //          ...prev,
// // //          file: valid ? file : null,
// // //          fileError: error,
// // //          status: "idle",
// // //          result: null,
// // //          errorMsg: null,
// // //       }));
// // //    }

// // //    function handleFileRemove() {
// // //       setSlot(makeEmptySlot());
// // //       if (inputRef.current) inputRef.current.value = "";
// // //    }

// // //    async function handleUpload() {
// // //       if (!slot.file || !form.dealerName || !form.financialYear) return;
// // //       setSlot(prev => ({ ...prev, status: "uploading", progress: 0, errorMsg: null }));
// // //       const timer = setInterval(() => {
// // //          setSlot(prev => prev.progress < 85 ? { ...prev, progress: prev.progress + 15 } : prev);
// // //       }, 300);
// // //       try {
// // //          const body = new FormData();
// // //          body.append("file", slot.file);
// // //          const { data } = await api.post(
// // //             `${TALLY_INVENTORY_TYPE.endpoint}?dealerName=${encodeURIComponent(form.dealerName)}&farmerDealerCode=${encodeURIComponent(form.farmerDealerCode)}&financialYear=${encodeURIComponent(form.financialYear)}`,
// // //             body,
// // //             { headers: { "Content-Type": "multipart/form-data" } }
// // //          );
// // //          clearInterval(timer);
// // //          setSlot(prev => ({ ...prev, status: "success", progress: 100, result: { totalRows: data.inserted ?? 0 } }));
// // //          onInventoryUploaded?.();
// // //          onEntryAdded?.();
// // //       } catch (err) {
// // //          clearInterval(timer);
// // //          setSlot(prev => ({ ...prev, status: "error", progress: 0, errorMsg: err?.response?.data?.message ?? "Upload failed. Please try again." }));
// // //       }
// // //    }

// // //    function handleTabChange(idx) {
// // //       setActiveTab(idx);
// // //       setForm(makeEmptyForm());
// // //       setErrors({});
// // //       setBanner({ type: "", message: "" });
// // //       setSlot(makeEmptySlot());
// // //    }

// // //    const isInventoryTab = TAB_KEYS[activeTab] === "inventory";
// // //    const canUpload      = !!form.dealerName && !!form.financialYear;

// // //    return (
// // //       <div className="bg-white border border-gray-300 p-4 sm:p-5">

// // //          <p className="text-[11px] uppercase tracking-widest font-semibold mb-4 text-green-700">
// // //             Manual Entry
// // //          </p>

// // //          {/* Tab bar — hidden when only one tab is allowed */}
// // //          {showTabBar && (
// // //             <div className="overflow-x-auto -mx-4 sm:mx-0 scrollbar-none">
// // //                <div className="flex gap-0 border-b-2 border-gray-300 mb-5 min-w-max px-4 sm:px-0">
// // //                   {TABS.map((tab, idx) => (
// // //                      <button
// // //                         key={tab}
// // //                         type="button"
// // //                         onClick={() => handleTabChange(idx)}
// // //                         className={`flex items-center gap-1.5 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-0.5 transition-colors cursor-pointer whitespace-nowrap
// // //                            ${activeTab === idx
// // //                               ? "text-black border-green-700"
// // //                               : "text-black opacity-40 border-transparent hover:opacity-70"}`}
// // //                      >
// // //                         <span>{TAB_ICONS[idx]}</span>
// // //                         {tab}
// // //                      </button>
// // //                   ))}
// // //                </div>
// // //             </div>
// // //          )}

// // //          {!isInventoryTab && banner.message && (
// // //             <div className="mb-4">
// // //                <Banner type={banner.type} message={banner.message} onClose={() => setBanner({ type: "", message: "" })} />
// // //             </div>
// // //          )}

// // //          {/* Shared fields */}
// // //          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
// // //             <Field label="Financial Year" error={errors.financialYear}>
// // //                <FinancialYearSelect
// // //                   value={form.financialYear}
// // //                   onChange={e => handleFinancialYearChange(e.target.value)}
// // //                   disabled={loading}
// // //                />
// // //             </Field>
// // //             <Field label="Dealer Name" error={errors.dealerName}>
// // //                <DealerSelect
// // //                   value={form.dealerName}
// // //                   onChange={handleDealerChange}
// // //                   disabled={loading}
// // //                   placeholder="Select dealer"
// // //                />
// // //             </Field>
// // //          </div>

// // //          {/* Paid Cash / Incentives */}
// // //          {!isInventoryTab && (
// // //             <>
// // //                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //                   <Field label="Date" error={errors.date}>
// // //                      <TextInput
// // //                         type="date"
// // //                         value={form.date}
// // //                         onChange={e => handleField("date", e.target.value)}
// // //                         disabled={loading || !form.financialYear}
// // //                         min={fyDateRange?.min}
// // //                         max={fyDateRange?.max}
// // //                      />
// // //                      {!form.financialYear && (
// // //                         <p className="text-[11px] text-gray-400 mt-0.5">Select a financial year first.</p>
// // //                      )}
// // //                   </Field>
// // //                   <Field label="Amount (₹)" error={errors.amount}>
// // //                      <TextInput
// // //                         type="number"
// // //                         value={form.amount}
// // //                         onChange={e => handleField("amount", e.target.value)}
// // //                         placeholder="0.00"
// // //                         disabled={loading}
// // //                         min="0"
// // //                      />
// // //                   </Field>
// // //                </div>

// // //                <div className="mt-4">
// // //                   <Field label="Remarks" error={errors.remarks}>
// // //                      <TextInput
// // //                         type="text"
// // //                         value={form.remarks}
// // //                         onChange={e => handleField("remarks", e.target.value)}
// // //                         placeholder="Optional remarks…"
// // //                         disabled={loading}
// // //                      />
// // //                   </Field>
// // //                </div>

// // //                {(form.dealerName || form.amount) && (
// // //                   <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 p-3 bg-gray-50 border border-gray-200 text-xs text-black">
// // //                      <span className="font-semibold">Preview:</span>
// // //                      {form.date && <span>{form.date}</span>}
// // //                      {form.financialYear && (
// // //                         <>
// // //                            <span className="text-gray-400">·</span>
// // //                            <span className="font-medium">{form.financialYear}</span>
// // //                         </>
// // //                      )}
// // //                      {form.dealerName && (
// // //                         <>
// // //                            <span className="text-gray-400">·</span>
// // //                            <span className="font-medium">{form.dealerName}</span>
// // //                         </>
// // //                      )}
// // //                      {form.amount && (
// // //                         <>
// // //                            <span className="text-gray-400">·</span>
// // //                            <span className="font-semibold">₹ {Number(form.amount).toLocaleString("en-IN")}</span>
// // //                         </>
// // //                      )}
// // //                      {form.remarks && (
// // //                         <>
// // //                            <span className="text-gray-400">·</span>
// // //                            <span className="italic text-gray-500">{form.remarks}</span>
// // //                         </>
// // //                      )}
// // //                   </div>
// // //                )}

// // //                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 mt-5 pt-4 border-t border-gray-200">
// // //                   <button
// // //                      type="button"
// // //                      onClick={() => handleTabChange(activeTab)}
// // //                      disabled={loading}
// // //                      className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-semibold text-black border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition text-center"
// // //                   >
// // //                      Reset
// // //                   </button>
// // //                   <button
// // //                      type="button"
// // //                      onClick={handleSubmit}
// // //                      disabled={loading}
// // //                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 focus:ring-2 focus:ring-green-200 disabled:opacity-60 transition"
// // //                   >
// // //                      {loading && <Spinner />}
// // //                      {loading ? "Saving…" : `Save ${TABS[activeTab]}`}
// // //                   </button>
// // //                </div>
// // //             </>
// // //          )}

// // //          {/* Inventory tab */}
// // //          {isInventoryTab && (
// // //             <div className="flex flex-col gap-3">
// // //                {!canUpload && (
// // //                   <p className="text-xs text-black bg-amber-50 border border-amber-300 px-3 py-2">
// // //                      ⚠️ Select a dealer and financial year above before uploading.
// // //                   </p>
// // //                )}
// // //                <div className={!canUpload ? "opacity-50 pointer-events-none" : ""}>
// // //                   <FileSlot
// // //                      type={TALLY_INVENTORY_TYPE}
// // //                      slot={slot}
// // //                      isDragOver={dragOver}
// // //                      inputRef={inputRef}
// // //                      selectedYear={form.financialYear || "25-26"}
// // //                      onFileSelect={handleFileSelect}
// // //                      onRemove={handleFileRemove}
// // //                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
// // //                      onDragLeave={() => setDragOver(false)}
// // //                      onDrop={e => {
// // //                         e.preventDefault();
// // //                         setDragOver(false);
// // //                         const f = e.dataTransfer.files?.[0];
// // //                         if (f) handleFileSelect(f);
// // //                      }}
// // //                      onUploadSingle={handleUpload}
// // //                      disabled={slot.status === "uploading"}
// // //                   />
// // //                </div>
// // //             </div>
// // //          )}
// // //       </div>
// // //    );
// // // }

// // // export default ManualEntry;










// // import { useRef, useState, useMemo } from "react";
// // import { DealerSelect } from "../../../components/app";
// // import FinancialYearSelect from "../../../components/app/FinancialYearSelect";
// // import api from "../../../api/axios";
// // import FileSlot from "../../UploadPage/components/FileSlot";
// // import { TALLY_INVENTORY_TYPE } from "./constants";
// // import { validateFile } from "./helpers";

// // const ALL_TABS = ["Paid Cash", "Incentives", "Inventory"];
// // const ALL_TAB_ICONS = ["💵", "🎁", "📦"];
// // const ALL_TAB_ENDPOINTS = ["/paid-cash", "/incentives", null];
// // const ALL_TAB_KEYS = ["paidCash", "incentives", "inventory"];

// // const makeEmptyForm = () => ({
// //    date: "",
// //    dealerName: "",
// //    farmerDealerCode: "",
// //    amount: "",
// //    financialYear: "",
// //    remarks: "",
// // });

// // const makeEmptySlot = () => ({
// //    file: null, fileError: null, status: "idle", progress: 0, result: null, errorMsg: null,
// // });

// // /**
// //  * "22-23" → { min: "2022-04-01", max: "2023-03-31" }
// //  * Returns null if financialYear is empty / invalid.
// //  */
// // function getFYDateRange(financialYear) {
// //    if (!financialYear) return null;
// //    const parts = financialYear.split("-");
// //    if (parts.length !== 2) return null;
// //    const startYY = parseInt(parts[0], 10);
// //    const endYY   = parseInt(parts[1], 10);
// //    if (isNaN(startYY) || isNaN(endYY)) return null;

// //    // Convert 2-digit year to 4-digit (assumes 2000s)
// //    const startYear = startYY < 100 ? 2000 + startYY : startYY;
// //    const endYear   = endYY   < 100 ? 2000 + endYY   : endYY;

// //    return {
// //       min: `${startYear}-04-01`,
// //       max: `${endYear}-03-31`,
// //    };
// // }

// // function Field({ label, children, error }) {
// //    return (
// //       <div className="flex flex-col gap-1">
// //          <label className="text-[11px] font-semibold uppercase tracking-widest text-black opacity-50">
// //             {label}
// //          </label>
// //          {children}
// //          {error && <p className="text-[11px] text-red-600">{error}</p>}
// //       </div>
// //    );
// // }

// // function TextInput({ type = "text", value, onChange, placeholder, disabled, min, max }) {
// //    return (
// //       <input
// //          type={type} value={value} onChange={onChange}
// //          placeholder={placeholder} disabled={disabled} min={min} max={max}
// //          className="w-full px-3 py-2.5 sm:py-2 text-sm border border-gray-300 bg-white text-black
// //             focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-600
// //             disabled:opacity-50 disabled:cursor-not-allowed transition placeholder-gray-400"
// //       />
// //    );
// // }

// // function Spinner() {
// //    return (
// //       <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
// //          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
// //          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
// //       </svg>
// //    );
// // }

// // function Banner({ type, message, onClose }) {
// //    if (!message) return null;
// //    return (
// //       <div className={`flex items-start justify-between gap-3 px-4 py-3 text-sm border
// //          ${type === "success"
// //             ? "bg-green-50 border-green-300 text-black"
// //             : "bg-red-50 border-red-300 text-black"}`}
// //       >
// //          <span className="leading-snug">{message}</span>
// //          <button onClick={onClose} className="shrink-0 opacity-50 hover:opacity-100 transition text-base leading-none mt-0.5">✕</button>
// //       </div>
// //    );
// // }

// // /**
// //  * @param {string[]} [allowedTabs] - subset of ["paidCash","incentives","inventory"].
// //  *        Defaults to all three. If only one tab is allowed, the tab bar is hidden.
// //  */
// // function ManualEntry({ onInventoryUploaded, onEntryAdded, allowedTabs }) {
// //    const inputRef = useRef(null);

// //    // Build filtered tab metadata based on allowedTabs
// //    const { TABS, TAB_ICONS, TAB_ENDPOINTS, TAB_KEYS } = useMemo(() => {
// //       const keys = allowedTabs && allowedTabs.length > 0 ? allowedTabs : ALL_TAB_KEYS;
// //       const indices = keys
// //          .map(k => ALL_TAB_KEYS.indexOf(k))
// //          .filter(i => i !== -1);

// //       return {
// //          TABS: indices.map(i => ALL_TABS[i]),
// //          TAB_ICONS: indices.map(i => ALL_TAB_ICONS[i]),
// //          TAB_ENDPOINTS: indices.map(i => ALL_TAB_ENDPOINTS[i]),
// //          TAB_KEYS: indices.map(i => ALL_TAB_KEYS[i]),
// //       };
// //    }, [allowedTabs]);

// //    const [activeTab, setActiveTab] = useState(0);
// //    const [form, setForm]           = useState(makeEmptyForm);
// //    const [errors, setErrors]       = useState({});
// //    const [loading, setLoading]     = useState(false);
// //    const [banner, setBanner]       = useState({ type: "", message: "" });
// //    const [slot, setSlot]           = useState(makeEmptySlot);
// //    const [dragOver, setDragOver]   = useState(false);

// //    const showTabBar = TABS.length > 1;

// //    // Derive date range from selected financial year
// //    const fyDateRange = getFYDateRange(form.financialYear);

// //    function handleDealerChange(dealerName, farmerDealerCode) {
// //       setForm(prev => ({ ...prev, dealerName, farmerDealerCode: farmerDealerCode ?? "" }));
// //       setErrors(prev => ({ ...prev, dealerName: "" }));
// //    }

// //    function handleField(key, value) {
// //       setForm(prev => ({ ...prev, [key]: value }));
// //       setErrors(prev => ({ ...prev, [key]: "" }));
// //    }

// //    // When financial year changes, reset date so stale date doesn't silently sit out of range
// //    function handleFinancialYearChange(value) {
// //       setForm(prev => ({ ...prev, financialYear: value, date: isIncentiveTab ? "" : prev.date }));
// //       setErrors(prev => ({ ...prev, financialYear: "", date: "" }));
// //    }

// //    function validate() {
// //       const e = {};
// //       if (!form.dealerName)    e.dealerName    = "Please select a dealer.";
// //       if (!form.financialYear) e.financialYear = "Please select a financial year.";
// //       if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
// //          e.amount = "Enter a valid amount greater than 0.";

// //       // Date validation — range check only for Incentives tab
// //       if (!form.date) {
// //          e.date = "Please select a date.";
// //       } else if (isIncentiveTab && fyDateRange) {
// //          if (form.date < fyDateRange.min || form.date > fyDateRange.max) {
// //             e.date = `Date must be between ${fyDateRange.min} and ${fyDateRange.max} for FY ${form.financialYear}.`;
// //          }
// //       }

// //       return e;
// //    }

// //    async function handleSubmit() {
// //       const e = validate();
// //       if (Object.keys(e).length) { setErrors(e); return; }
// //       setLoading(true);
// //       setBanner({ type: "", message: "" });
// //       try {
// //          await api.post(TAB_ENDPOINTS[activeTab], {
// //             date: form.date,
// //             dealerName: form.dealerName,
// //             farmerDealerCode: form.farmerDealerCode,
// //             amount: Number(form.amount),
// //             financialYear: form.financialYear,
// //             remarks: form.remarks,
// //          });
// //          setBanner({ type: "success", message: `${TABS[activeTab]} entry saved successfully!` });
// //          setForm(makeEmptyForm());
// //          setErrors({});
// //          onEntryAdded?.();
// //       } catch (err) {
// //          setBanner({ type: "error", message: err.response?.data?.message ?? "Something went wrong." });
// //       } finally {
// //          setLoading(false);
// //       }
// //    }

// //    function handleFileSelect(file) {
// //       const { valid, error } = validateFile(file, TALLY_INVENTORY_TYPE.acceptedName);
// //       setSlot(prev => ({
// //          ...prev,
// //          file: valid ? file : null,
// //          fileError: error,
// //          status: "idle",
// //          result: null,
// //          errorMsg: null,
// //       }));
// //    }

// //    function handleFileRemove() {
// //       setSlot(makeEmptySlot());
// //       if (inputRef.current) inputRef.current.value = "";
// //    }

// //    async function handleUpload() {
// //       if (!slot.file || !form.dealerName || !form.financialYear) return;
// //       setSlot(prev => ({ ...prev, status: "uploading", progress: 0, errorMsg: null }));
// //       const timer = setInterval(() => {
// //          setSlot(prev => prev.progress < 85 ? { ...prev, progress: prev.progress + 15 } : prev);
// //       }, 300);
// //       try {
// //          const body = new FormData();
// //          body.append("file", slot.file);
// //          const { data } = await api.post(
// //             `${TALLY_INVENTORY_TYPE.endpoint}?dealerName=${encodeURIComponent(form.dealerName)}&farmerDealerCode=${encodeURIComponent(form.farmerDealerCode)}&financialYear=${encodeURIComponent(form.financialYear)}`,
// //             body,
// //             { headers: { "Content-Type": "multipart/form-data" } }
// //          );
// //          clearInterval(timer);
// //          setSlot(prev => ({ ...prev, status: "success", progress: 100, result: { totalRows: data.inserted ?? 0 } }));
// //          onInventoryUploaded?.();
// //          onEntryAdded?.();
// //       } catch (err) {
// //          clearInterval(timer);
// //          setSlot(prev => ({ ...prev, status: "error", progress: 0, errorMsg: err?.response?.data?.message ?? "Upload failed. Please try again." }));
// //       }
// //    }

// //    function handleTabChange(idx) {
// //       setActiveTab(idx);
// //       setForm(makeEmptyForm());
// //       setErrors({});
// //       setBanner({ type: "", message: "" });
// //       setSlot(makeEmptySlot());
// //    }

// //    const isInventoryTab = TAB_KEYS[activeTab] === "inventory";
// //    const isIncentiveTab = TAB_KEYS[activeTab] === "incentives";
// //    const canUpload      = !!form.dealerName && !!form.financialYear;

// //    return (
// //       <div className="bg-white border border-gray-300 p-4 sm:p-5">

// //          <p className="text-[11px] uppercase tracking-widest font-semibold mb-4 text-green-700">
// //             Manual Entry
// //          </p>

// //          {/* Tab bar — hidden when only one tab is allowed */}
// //          {showTabBar && (
// //             <div className="overflow-x-auto -mx-4 sm:mx-0 scrollbar-none">
// //                <div className="flex gap-0 border-b-2 border-gray-300 mb-5 min-w-max px-4 sm:px-0">
// //                   {TABS.map((tab, idx) => (
// //                      <button
// //                         key={tab}
// //                         type="button"
// //                         onClick={() => handleTabChange(idx)}
// //                         className={`flex items-center gap-1.5 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-0.5 transition-colors cursor-pointer whitespace-nowrap
// //                            ${activeTab === idx
// //                               ? "text-black border-green-700"
// //                               : "text-black opacity-40 border-transparent hover:opacity-70"}`}
// //                      >
// //                         <span>{TAB_ICONS[idx]}</span>
// //                         {tab}
// //                      </button>
// //                   ))}
// //                </div>
// //             </div>
// //          )}

// //          {!isInventoryTab && banner.message && (
// //             <div className="mb-4">
// //                <Banner type={banner.type} message={banner.message} onClose={() => setBanner({ type: "", message: "" })} />
// //             </div>
// //          )}

// //          {/* Shared fields */}
// //          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
// //             <Field label="Financial Year" error={errors.financialYear}>
// //                <FinancialYearSelect
// //                   value={form.financialYear}
// //                   onChange={e => handleFinancialYearChange(e.target.value)}
// //                   disabled={loading}
// //                />
// //             </Field>
// //             <Field label="Dealer Name" error={errors.dealerName}>
// //                <DealerSelect
// //                   value={form.dealerName}
// //                   onChange={handleDealerChange}
// //                   disabled={loading}
// //                   placeholder="Select dealer"
// //                />
// //             </Field>
// //          </div>

// //          {/* Paid Cash / Incentives */}
// //          {!isInventoryTab && (
// //             <>
// //                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                   <Field label="Date" error={errors.date}>
// //                      <TextInput
// //                         type="date"
// //                         value={form.date}
// //                         onChange={e => handleField("date", e.target.value)}
// //                         disabled={loading || (isIncentiveTab && !form.financialYear)}
// //                         min={isIncentiveTab ? fyDateRange?.min : undefined}
// //                         max={isIncentiveTab ? fyDateRange?.max : undefined}
// //                         placeholder="dd-mm-yyyy"
// //                      />
// //                      {isIncentiveTab && !form.financialYear && (
// //                         <p className="text-[11px] text-gray-400 mt-0.5">Select a financial year first.</p>
// //                      )}
// //                   </Field>
// //                   <Field label="Amount (₹)" error={errors.amount}>
// //                      <TextInput
// //                         type="number"
// //                         value={form.amount}
// //                         onChange={e => handleField("amount", e.target.value)}
// //                         placeholder="0.00"
// //                         disabled={loading}
// //                         min="0"
// //                      />
// //                   </Field>
// //                </div>

// //                <div className="mt-4">
// //                   <Field label="Remarks" error={errors.remarks}>
// //                      <TextInput
// //                         type="text"
// //                         value={form.remarks}
// //                         onChange={e => handleField("remarks", e.target.value)}
// //                         placeholder="Optional remarks…"
// //                         disabled={loading}
// //                      />
// //                   </Field>
// //                </div>

// //                {(form.dealerName || form.amount) && (
// //                   <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 p-3 bg-gray-50 border border-gray-200 text-xs text-black">
// //                      <span className="font-semibold">Preview:</span>
// //                      {form.date && <span>{form.date}</span>}
// //                      {form.financialYear && (
// //                         <>
// //                            <span className="text-gray-400">·</span>
// //                            <span className="font-medium">{form.financialYear}</span>
// //                         </>
// //                      )}
// //                      {form.dealerName && (
// //                         <>
// //                            <span className="text-gray-400">·</span>
// //                            <span className="font-medium">{form.dealerName}</span>
// //                         </>
// //                      )}
// //                      {form.amount && (
// //                         <>
// //                            <span className="text-gray-400">·</span>
// //                            <span className="font-semibold">₹ {Number(form.amount).toLocaleString("en-IN")}</span>
// //                         </>
// //                      )}
// //                      {form.remarks && (
// //                         <>
// //                            <span className="text-gray-400">·</span>
// //                            <span className="italic text-gray-500">{form.remarks}</span>
// //                         </>
// //                      )}
// //                   </div>
// //                )}

// //                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 mt-5 pt-4 border-t border-gray-200">
// //                   <button
// //                      type="button"
// //                      onClick={() => handleTabChange(activeTab)}
// //                      disabled={loading}
// //                      className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-semibold text-black border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition text-center"
// //                   >
// //                      Reset
// //                   </button>
// //                   <button
// //                      type="button"
// //                      onClick={handleSubmit}
// //                      disabled={loading}
// //                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 focus:ring-2 focus:ring-green-200 disabled:opacity-60 transition"
// //                   >
// //                      {loading && <Spinner />}
// //                      {loading ? "Saving…" : `Save ${TABS[activeTab]}`}
// //                   </button>
// //                </div>
// //             </>
// //          )}

// //          {/* Inventory tab */}
// //          {isInventoryTab && (
// //             <div className="flex flex-col gap-3">
// //                {!canUpload && (
// //                   <p className="text-xs text-black bg-amber-50 border border-amber-300 px-3 py-2">
// //                      ⚠️ Select a dealer and financial year above before uploading.
// //                   </p>
// //                )}
// //                <div className={!canUpload ? "opacity-50 pointer-events-none" : ""}>
// //                   <FileSlot
// //                      type={TALLY_INVENTORY_TYPE}
// //                      slot={slot}
// //                      isDragOver={dragOver}
// //                      inputRef={inputRef}
// //                      selectedYear={form.financialYear || "25-26"}
// //                      onFileSelect={handleFileSelect}
// //                      onRemove={handleFileRemove}
// //                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
// //                      onDragLeave={() => setDragOver(false)}
// //                      onDrop={e => {
// //                         e.preventDefault();
// //                         setDragOver(false);
// //                         const f = e.dataTransfer.files?.[0];
// //                         if (f) handleFileSelect(f);
// //                      }}
// //                      onUploadSingle={handleUpload}
// //                      disabled={slot.status === "uploading"}
// //                   />
// //                </div>
// //             </div>
// //          )}
// //       </div>
// //    );
// // }

// // export default ManualEntry;









// import { useRef, useState, useMemo } from "react";
// import { DealerSelect } from "../../../components/app";
// import FinancialYearSelect from "../../../components/app/FinancialYearSelect";
// import api from "../../../api/axios";
// import FileSlot from "../../UploadPage/components/FileSlot";
// import { TALLY_INVENTORY_TYPE } from "./constants";
// import { validateFile } from "./helpers";

// const ALL_TABS = ["Paid Cash", "Incentives", "Inventory"];
// const ALL_TAB_ICONS = ["💵", "🎁", "📦"];
// const ALL_TAB_ENDPOINTS = ["/paid-cash", "/incentives", null];
// const ALL_TAB_KEYS = ["paidCash", "incentives", "inventory"];

// const makeEmptyForm = () => ({
//    date: "",
//    dealerName: "",
//    farmerDealerCode: "",
//    amount: "",
//    financialYear: "",
//    remarks: "",
// });

// const makeEmptySlot = () => ({
//    file: null, fileError: null, status: "idle", progress: 0, result: null, errorMsg: null,
// });

// /**
//  * "22-23" → { min: "2022-04-01", max: "2023-03-31" }
//  * Returns null if financialYear is empty / invalid.
//  */
// function getFYDateRange(financialYear) {
//    if (!financialYear) return null;
//    const parts = financialYear.split("-");
//    if (parts.length !== 2) return null;
//    const startYY = parseInt(parts[0], 10);
//    const endYY   = parseInt(parts[1], 10);
//    if (isNaN(startYY) || isNaN(endYY)) return null;

//    // Convert 2-digit year to 4-digit (assumes 2000s)
//    const startYear = startYY < 100 ? 2000 + startYY : startYY;
//    const endYear   = endYY   < 100 ? 2000 + endYY   : endYY;

//    return {
//       min: `${startYear}-04-01`,
//       max: `${endYear}-03-31`,
//    };
// }

// function Field({ label, children, error }) {
//    return (
//       <div className="flex flex-col gap-1">
//          <label className="text-[11px] font-semibold uppercase tracking-widest text-black opacity-50">
//             {label}
//          </label>
//          {children}
//          {error && <p className="text-[11px] text-red-600">{error}</p>}
//       </div>
//    );
// }

// function TextInput({ type = "text", value, onChange, placeholder, disabled, min, max }) {
//    return (
//       <input
//          type={type} value={value} onChange={onChange}
//          placeholder={placeholder} disabled={disabled} min={min} max={max}
//          className="w-full px-3 py-2.5 sm:py-2 text-sm border border-gray-300 bg-white text-black
//             focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-600
//             disabled:opacity-50 disabled:cursor-not-allowed transition placeholder-gray-400"
//       />
//    );
// }

// function Spinner() {
//    return (
//       <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
//          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
//       </svg>
//    );
// }

// function Banner({ type, message, onClose }) {
//    if (!message) return null;
//    return (
//       <div className={`flex items-start justify-between gap-3 px-4 py-3 text-sm border
//          ${type === "success"
//             ? "bg-green-50 border-green-300 text-black"
//             : "bg-red-50 border-red-300 text-black"}`}
//       >
//          <span className="leading-snug">{message}</span>
//          <button onClick={onClose} className="shrink-0 opacity-50 hover:opacity-100 transition text-base leading-none mt-0.5">✕</button>
//       </div>
//    );
// }

// /**
//  * @param {string[]} [allowedTabs] - subset of ["paidCash","incentives","inventory"].
//  *        Defaults to all three. If only one tab is allowed, the tab bar is hidden.
//  */
// function ManualEntry({ onInventoryUploaded, onEntryAdded, allowedTabs }) {
//    const inputRef = useRef(null);

//    // Build filtered tab metadata based on allowedTabs
//    const { TABS, TAB_ICONS, TAB_ENDPOINTS, TAB_KEYS } = useMemo(() => {
//       const keys = allowedTabs && allowedTabs.length > 0 ? allowedTabs : ALL_TAB_KEYS;
//       const indices = keys
//          .map(k => ALL_TAB_KEYS.indexOf(k))
//          .filter(i => i !== -1);

//       return {
//          TABS: indices.map(i => ALL_TABS[i]),
//          TAB_ICONS: indices.map(i => ALL_TAB_ICONS[i]),
//          TAB_ENDPOINTS: indices.map(i => ALL_TAB_ENDPOINTS[i]),
//          TAB_KEYS: indices.map(i => ALL_TAB_KEYS[i]),
//       };
//    }, [allowedTabs]);

//    const [activeTab, setActiveTab] = useState(0);
//    const [form, setForm]           = useState(makeEmptyForm);
//    const [errors, setErrors]       = useState({});
//    const [loading, setLoading]     = useState(false);
//    const [banner, setBanner]       = useState({ type: "", message: "" });
//    const [slot, setSlot]           = useState(makeEmptySlot);
//    const [dragOver, setDragOver]   = useState(false);

//    const showTabBar = TABS.length > 1;

//    // Derive date range from selected financial year
//    const fyDateRange = getFYDateRange(form.financialYear);

//    function handleDealerChange(dealerName, farmerDealerCode) {
//       setForm(prev => ({ ...prev, dealerName, farmerDealerCode: farmerDealerCode ?? "" }));
//       setErrors(prev => ({ ...prev, dealerName: "" }));
//    }

//    function handleField(key, value) {
//       setForm(prev => ({ ...prev, [key]: value }));
//       setErrors(prev => ({ ...prev, [key]: "" }));
//    }

//    // When financial year changes, reset date so stale date doesn't silently sit out of range
//    function handleFinancialYearChange(value) {
//       setForm(prev => ({ ...prev, financialYear: value, date: isIncentiveTab ? "" : prev.date }));
//       setErrors(prev => ({ ...prev, financialYear: "", date: "" }));
//    }

//    function validate() {
//       const e = {};
//       if (!form.dealerName)    e.dealerName    = "Please select a dealer.";
//       if (!form.financialYear) e.financialYear = "Please select a financial year.";

//       // Amount validation — Incentives can be negative (e.g. a deduction/reversal),
//       // but never zero. Other tabs must be a strictly positive amount.
//       const amountNum = Number(form.amount);
//       if (!form.amount || isNaN(amountNum) || (isIncentiveTab ? amountNum === 0 : amountNum <= 0)) {
//          e.amount = isIncentiveTab
//             ? "Enter a non-zero amount (use a minus sign for deductions)."
//             : "Enter a valid amount greater than 0.";
//       }

//       // Date validation — range check only for Incentives tab
//       if (!form.date) {
//          e.date = "Please select a date.";
//       } else if (isIncentiveTab && fyDateRange) {
//          if (form.date < fyDateRange.min || form.date > fyDateRange.max) {
//             e.date = `Date must be between ${fyDateRange.min} and ${fyDateRange.max} for FY ${form.financialYear}.`;
//          }
//       }

//       return e;
//    }

//    async function handleSubmit() {
//       const e = validate();
//       if (Object.keys(e).length) { setErrors(e); return; }
//       setLoading(true);
//       setBanner({ type: "", message: "" });
//       try {
//          await api.post(TAB_ENDPOINTS[activeTab], {
//             date: form.date,
//             dealerName: form.dealerName,
//             farmerDealerCode: form.farmerDealerCode,
//             amount: Number(form.amount),
//             financialYear: form.financialYear,
//             remarks: form.remarks,
//          });
//          setBanner({ type: "success", message: `${TABS[activeTab]} entry saved successfully!` });
//          setForm(makeEmptyForm());
//          setErrors({});
//          onEntryAdded?.();
//       } catch (err) {
//          setBanner({ type: "error", message: err.response?.data?.message ?? "Something went wrong." });
//       } finally {
//          setLoading(false);
//       }
//    }

//    function handleFileSelect(file) {
//       const { valid, error } = validateFile(file, TALLY_INVENTORY_TYPE.acceptedName);
//       setSlot(prev => ({
//          ...prev,
//          file: valid ? file : null,
//          fileError: error,
//          status: "idle",
//          result: null,
//          errorMsg: null,
//       }));
//    }

//    function handleFileRemove() {
//       setSlot(makeEmptySlot());
//       if (inputRef.current) inputRef.current.value = "";
//    }

//    async function handleUpload() {
//       if (!slot.file || !form.dealerName || !form.financialYear) return;
//       setSlot(prev => ({ ...prev, status: "uploading", progress: 0, errorMsg: null }));
//       const timer = setInterval(() => {
//          setSlot(prev => prev.progress < 85 ? { ...prev, progress: prev.progress + 15 } : prev);
//       }, 300);
//       try {
//          const body = new FormData();
//          body.append("file", slot.file);
//          const { data } = await api.post(
//             `${TALLY_INVENTORY_TYPE.endpoint}?dealerName=${encodeURIComponent(form.dealerName)}&farmerDealerCode=${encodeURIComponent(form.farmerDealerCode)}&financialYear=${encodeURIComponent(form.financialYear)}`,
//             body,
//             { headers: { "Content-Type": "multipart/form-data" } }
//          );
//          clearInterval(timer);
//          setSlot(prev => ({ ...prev, status: "success", progress: 100, result: { totalRows: data.inserted ?? 0 } }));
//          onInventoryUploaded?.();
//          onEntryAdded?.();
//       } catch (err) {
//          clearInterval(timer);
//          setSlot(prev => ({ ...prev, status: "error", progress: 0, errorMsg: err?.response?.data?.message ?? "Upload failed. Please try again." }));
//       }
//    }

//    function handleTabChange(idx) {
//       setActiveTab(idx);
//       setForm(makeEmptyForm());
//       setErrors({});
//       setBanner({ type: "", message: "" });
//       setSlot(makeEmptySlot());
//    }

//    const isInventoryTab = TAB_KEYS[activeTab] === "inventory";
//    const isIncentiveTab = TAB_KEYS[activeTab] === "incentives";
//    const canUpload      = !!form.dealerName && !!form.financialYear;

//    const amountValue = Number(form.amount);
//    const isNegativeAmount = isIncentiveTab && form.amount !== "" && !isNaN(amountValue) && amountValue < 0;

//    return (
//       <div className="bg-white border border-gray-300 p-4 sm:p-5">

//          <p className="text-[11px] uppercase tracking-widest font-semibold mb-4 text-green-700">
//             Manual Entry
//          </p>

//          {/* Tab bar — hidden when only one tab is allowed */}
//          {showTabBar && (
//             <div className="overflow-x-auto -mx-4 sm:mx-0 scrollbar-none">
//                <div className="flex gap-0 border-b-2 border-gray-300 mb-5 min-w-max px-4 sm:px-0">
//                   {TABS.map((tab, idx) => (
//                      <button
//                         key={tab}
//                         type="button"
//                         onClick={() => handleTabChange(idx)}
//                         className={`flex items-center gap-1.5 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-0.5 transition-colors cursor-pointer whitespace-nowrap
//                            ${activeTab === idx
//                               ? "text-black border-green-700"
//                               : "text-black opacity-40 border-transparent hover:opacity-70"}`}
//                      >
//                         <span>{TAB_ICONS[idx]}</span>
//                         {tab}
//                      </button>
//                   ))}
//                </div>
//             </div>
//          )}

//          {!isInventoryTab && banner.message && (
//             <div className="mb-4">
//                <Banner type={banner.type} message={banner.message} onClose={() => setBanner({ type: "", message: "" })} />
//             </div>
//          )}

//          {/* Shared fields */}
//          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//             <Field label="Financial Year" error={errors.financialYear}>
//                <FinancialYearSelect
//                   value={form.financialYear}
//                   onChange={e => handleFinancialYearChange(e.target.value)}
//                   disabled={loading}
//                />
//             </Field>
//             <Field label="Dealer Name" error={errors.dealerName}>
//                <DealerSelect
//                   value={form.dealerName}
//                   onChange={handleDealerChange}
//                   disabled={loading}
//                   placeholder="Select dealer"
//                />
//             </Field>
//          </div>

//          {/* Paid Cash / Incentives */}
//          {!isInventoryTab && (
//             <>
//                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <Field label="Date" error={errors.date}>
//                      <TextInput
//                         type="date"
//                         value={form.date}
//                         onChange={e => handleField("date", e.target.value)}
//                         disabled={loading || (isIncentiveTab && !form.financialYear)}
//                         min={isIncentiveTab ? fyDateRange?.min : undefined}
//                         max={isIncentiveTab ? fyDateRange?.max : undefined}
//                         placeholder="dd-mm-yyyy"
//                      />
//                      {isIncentiveTab && !form.financialYear && (
//                         <p className="text-[11px] text-gray-400 mt-0.5">Select a financial year first.</p>
//                      )}
//                   </Field>
//                   <Field label="Amount (₹)" error={errors.amount}>
//                      <TextInput
//                         type="number"
//                         value={form.amount}
//                         onChange={e => handleField("amount", e.target.value)}
//                         placeholder={isIncentiveTab ? "e.g. 500 or -500" : "0.00"}
//                         disabled={loading}
//                         min={isIncentiveTab ? undefined : "0"}
//                      />
//                      {isIncentiveTab && (
//                         <p className="text-[11px] text-gray-400 mt-0.5">
//                            Use a minus sign for deductions or reversals.
//                         </p>
//                      )}
//                   </Field>
//                </div>

//                <div className="mt-4">
//                   <Field label="Remarks" error={errors.remarks}>
//                      <TextInput
//                         type="text"
//                         value={form.remarks}
//                         onChange={e => handleField("remarks", e.target.value)}
//                         placeholder="Optional remarks…"
//                         disabled={loading}
//                      />
//                   </Field>
//                </div>

//                {(form.dealerName || form.amount) && (
//                   <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 p-3 bg-gray-50 border border-gray-200 text-xs text-black">
//                      <span className="font-semibold">Preview:</span>
//                      {form.date && <span>{form.date}</span>}
//                      {form.financialYear && (
//                         <>
//                            <span className="text-gray-400">·</span>
//                            <span className="font-medium">{form.financialYear}</span>
//                         </>
//                      )}
//                      {form.dealerName && (
//                         <>
//                            <span className="text-gray-400">·</span>
//                            <span className="font-medium">{form.dealerName}</span>
//                         </>
//                      )}
//                      {form.amount && !isNaN(amountValue) && (
//                         <>
//                            <span className="text-gray-400">·</span>
//                            <span className={`font-semibold ${isNegativeAmount ? "text-red-600" : ""}`}>
//                               {isNegativeAmount ? "-" : ""}₹ {Math.abs(amountValue).toLocaleString("en-IN")}
//                            </span>
//                         </>
//                      )}
//                      {form.remarks && (
//                         <>
//                            <span className="text-gray-400">·</span>
//                            <span className="italic text-gray-500">{form.remarks}</span>
//                         </>
//                      )}
//                   </div>
//                )}

//                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 mt-5 pt-4 border-t border-gray-200">
//                   <button
//                      type="button"
//                      onClick={() => handleTabChange(activeTab)}
//                      disabled={loading}
//                      className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-semibold text-black border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition text-center"
//                   >
//                      Reset
//                   </button>
//                   <button
//                      type="button"
//                      onClick={handleSubmit}
//                      disabled={loading}
//                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 focus:ring-2 focus:ring-green-200 disabled:opacity-60 transition"
//                   >
//                      {loading && <Spinner />}
//                      {loading ? "Saving…" : `Save ${TABS[activeTab]}`}
//                   </button>
//                </div>
//             </>
//          )}

//          {/* Inventory tab */}
//          {isInventoryTab && (
//             <div className="flex flex-col gap-3">
//                {!canUpload && (
//                   <p className="text-xs text-black bg-amber-50 border border-amber-300 px-3 py-2">
//                      ⚠️ Select a dealer and financial year above before uploading.
//                   </p>
//                )}
//                <div className={!canUpload ? "opacity-50 pointer-events-none" : ""}>
//                   <FileSlot
//                      type={TALLY_INVENTORY_TYPE}
//                      slot={slot}
//                      isDragOver={dragOver}
//                      inputRef={inputRef}
//                      selectedYear={form.financialYear || "25-26"}
//                      onFileSelect={handleFileSelect}
//                      onRemove={handleFileRemove}
//                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
//                      onDragLeave={() => setDragOver(false)}
//                      onDrop={e => {
//                         e.preventDefault();
//                         setDragOver(false);
//                         const f = e.dataTransfer.files?.[0];
//                         if (f) handleFileSelect(f);
//                      }}
//                      onUploadSingle={handleUpload}
//                      disabled={slot.status === "uploading"}
//                   />
//                </div>
//             </div>
//          )}
//       </div>
//    );
// }

// export default ManualEntry;













import { useRef, useState, useMemo } from "react";
import { DealerSelect } from "../../../components/app";
import FinancialYearSelect from "../../../components/app/FinancialYearSelect";
import api from "../../../api/axios";
import FileSlot from "../../UploadPage/components/FileSlot";
import { TALLY_INVENTORY_TYPE } from "./constants";
import { validateFile } from "./helpers";

const ALL_TABS = ["Paid Cash", "Incentives", "Inventory"];
const ALL_TAB_ICONS = ["💵", "🎁", "📦"];
const ALL_TAB_ENDPOINTS = ["/paid-cash", "/incentives", null];
const ALL_TAB_KEYS = ["paidCash", "incentives", "inventory"];

// Paid Cash has no financial-year-derived range, so without an explicit min/max the
// native <input type="date"> year segment will happily accept 5-6 digits (e.g. "798768")
// if someone types fast or pastes. Bound it to a sane window: from this floor up to today.
const PAID_CASH_DATE_MIN = "2000-01-01";

const makeEmptyForm = () => ({
   date: "",
   dealerName: "",
   farmerDealerCode: "",
   amount: "",
   financialYear: "",
   remarks: "",
});

const makeEmptySlot = () => ({
   file: null, fileError: null, status: "idle", progress: 0, result: null, errorMsg: null,
});

/**
 * "22-23" → { min: "2022-04-01", max: "2023-03-31" }
 * Returns null if financialYear is empty / invalid.
 */
function getFYDateRange(financialYear) {
   if (!financialYear) return null;
   const parts = financialYear.split("-");
   if (parts.length !== 2) return null;
   const startYY = parseInt(parts[0], 10);
   const endYY   = parseInt(parts[1], 10);
   if (isNaN(startYY) || isNaN(endYY)) return null;

   // Convert 2-digit year to 4-digit (assumes 2000s)
   const startYear = startYY < 100 ? 2000 + startYY : startYY;
   const endYear   = endYY   < 100 ? 2000 + endYY   : endYY;

   return {
      min: `${startYear}-04-01`,
      max: `${endYear}-03-31`,
   };
}

function Field({ label, children, error }) {
   return (
      <div className="flex flex-col gap-1">
         <label className="text-[11px] font-semibold uppercase tracking-widest text-black opacity-50">
            {label}
         </label>
         {children}
         {error && <p className="text-[11px] text-red-600">{error}</p>}
      </div>
   );
}

function TextInput({ type = "text", value, onChange, placeholder, disabled, min, max }) {
   return (
      <input
         type={type} value={value} onChange={onChange}
         placeholder={placeholder} disabled={disabled} min={min} max={max}
         className="w-full px-3 py-2.5 sm:py-2 text-sm border border-gray-300 bg-white text-black
            focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-600
            disabled:opacity-50 disabled:cursor-not-allowed transition placeholder-gray-400"
      />
   );
}

function Spinner() {
   return (
      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
   );
}

function Banner({ type, message, onClose }) {
   if (!message) return null;
   return (
      <div className={`flex items-start justify-between gap-3 px-4 py-3 text-sm border
         ${type === "success"
            ? "bg-green-50 border-green-300 text-black"
            : "bg-red-50 border-red-300 text-black"}`}
      >
         <span className="leading-snug">{message}</span>
         <button onClick={onClose} className="shrink-0 opacity-50 hover:opacity-100 transition text-base leading-none mt-0.5">✕</button>
      </div>
   );
}

/**
 * @param {string[]} [allowedTabs] - subset of ["paidCash","incentives","inventory"].
 *        Defaults to all three. If only one tab is allowed, the tab bar is hidden.
 */
function ManualEntry({ onInventoryUploaded, onEntryAdded, allowedTabs }) {
   const inputRef = useRef(null);

   // Build filtered tab metadata based on allowedTabs
   const { TABS, TAB_ICONS, TAB_ENDPOINTS, TAB_KEYS } = useMemo(() => {
      const keys = allowedTabs && allowedTabs.length > 0 ? allowedTabs : ALL_TAB_KEYS;
      const indices = keys
         .map(k => ALL_TAB_KEYS.indexOf(k))
         .filter(i => i !== -1);

      return {
         TABS: indices.map(i => ALL_TABS[i]),
         TAB_ICONS: indices.map(i => ALL_TAB_ICONS[i]),
         TAB_ENDPOINTS: indices.map(i => ALL_TAB_ENDPOINTS[i]),
         TAB_KEYS: indices.map(i => ALL_TAB_KEYS[i]),
      };
   }, [allowedTabs]);

   const [activeTab, setActiveTab] = useState(0);
   const [form, setForm]           = useState(makeEmptyForm);
   const [errors, setErrors]       = useState({});
   const [loading, setLoading]     = useState(false);
   const [banner, setBanner]       = useState({ type: "", message: "" });
   const [slot, setSlot]           = useState(makeEmptySlot);
   const [dragOver, setDragOver]   = useState(false);

   const showTabBar = TABS.length > 1;

   // Derive date range from selected financial year
   const fyDateRange = getFYDateRange(form.financialYear);

   // Today, as YYYY-MM-DD — Paid Cash entries shouldn't be future-dated, and this also
   // doubles as the upper bound that stops the year segment from accepting runaway digits.
   const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

   function handleDealerChange(dealerName, farmerDealerCode) {
      setForm(prev => ({ ...prev, dealerName, farmerDealerCode: farmerDealerCode ?? "" }));
      setErrors(prev => ({ ...prev, dealerName: "" }));
   }

   function handleField(key, value) {
      setForm(prev => ({ ...prev, [key]: value }));
      setErrors(prev => ({ ...prev, [key]: "" }));
   }

   // When financial year changes, reset date so stale date doesn't silently sit out of range
   function handleFinancialYearChange(value) {
      setForm(prev => ({ ...prev, financialYear: value, date: isIncentiveTab ? "" : prev.date }));
      setErrors(prev => ({ ...prev, financialYear: "", date: "" }));
   }

   function validate() {
      const e = {};
      if (!form.dealerName)    e.dealerName    = "Please select a dealer.";
      if (!form.financialYear) e.financialYear = "Please select a financial year.";

      // Amount validation — Incentives can be negative (e.g. a deduction/reversal),
      // but never zero. Other tabs must be a strictly positive amount.
      const amountNum = Number(form.amount);
      if (!form.amount || isNaN(amountNum) || (isIncentiveTab ? amountNum === 0 : amountNum <= 0)) {
         e.amount = isIncentiveTab
            ? "Enter a non-zero amount (use a minus sign for deductions)."
            : "Enter a valid amount greater than 0.";
      }

      // Date validation — Incentives are bound to their financial year; Paid Cash is
      // bound to a sane min/today window so a stray extra digit in the year can't sneak through.
      if (!form.date) {
         e.date = "Please select a date.";
      } else if (isIncentiveTab && fyDateRange) {
         if (form.date < fyDateRange.min || form.date > fyDateRange.max) {
            e.date = `Date must be between ${fyDateRange.min} and ${fyDateRange.max} for FY ${form.financialYear}.`;
         }
      } else if (!isIncentiveTab) {
         if (form.date < PAID_CASH_DATE_MIN || form.date > todayISO) {
            e.date = `Date must be between ${PAID_CASH_DATE_MIN} and ${todayISO}.`;
         }
      }

      return e;
   }

   async function handleSubmit() {
      const e = validate();
      if (Object.keys(e).length) { setErrors(e); return; }
      setLoading(true);
      setBanner({ type: "", message: "" });
      try {
         await api.post(TAB_ENDPOINTS[activeTab], {
            date: form.date,
            dealerName: form.dealerName,
            farmerDealerCode: form.farmerDealerCode,
            amount: Number(form.amount),
            financialYear: form.financialYear,
            remarks: form.remarks,
         });
         setBanner({ type: "success", message: `${TABS[activeTab]} entry saved successfully!` });
         setForm(makeEmptyForm());
         setErrors({});
         onEntryAdded?.();
      } catch (err) {
         setBanner({ type: "error", message: err.response?.data?.message ?? "Something went wrong." });
      } finally {
         setLoading(false);
      }
   }

   function handleFileSelect(file) {
      const { valid, error } = validateFile(file, TALLY_INVENTORY_TYPE.acceptedName);
      setSlot(prev => ({
         ...prev,
         file: valid ? file : null,
         fileError: error,
         status: "idle",
         result: null,
         errorMsg: null,
      }));
   }

   function handleFileRemove() {
      setSlot(makeEmptySlot());
      if (inputRef.current) inputRef.current.value = "";
   }

   async function handleUpload() {
      if (!slot.file || !form.dealerName || !form.financialYear) return;
      setSlot(prev => ({ ...prev, status: "uploading", progress: 0, errorMsg: null }));
      const timer = setInterval(() => {
         setSlot(prev => prev.progress < 85 ? { ...prev, progress: prev.progress + 15 } : prev);
      }, 300);
      try {
         const body = new FormData();
         body.append("file", slot.file);
         const { data } = await api.post(
            `${TALLY_INVENTORY_TYPE.endpoint}?dealerName=${encodeURIComponent(form.dealerName)}&farmerDealerCode=${encodeURIComponent(form.farmerDealerCode)}&financialYear=${encodeURIComponent(form.financialYear)}`,
            body,
            { headers: { "Content-Type": "multipart/form-data" } }
         );
         clearInterval(timer);
         setSlot(prev => ({ ...prev, status: "success", progress: 100, result: { totalRows: data.inserted ?? 0 } }));
         onInventoryUploaded?.();
         onEntryAdded?.();
      } catch (err) {
         clearInterval(timer);
         setSlot(prev => ({ ...prev, status: "error", progress: 0, errorMsg: err?.response?.data?.message ?? "Upload failed. Please try again." }));
      }
   }

   function handleTabChange(idx) {
      setActiveTab(idx);
      setForm(makeEmptyForm());
      setErrors({});
      setBanner({ type: "", message: "" });
      setSlot(makeEmptySlot());
   }

   const isInventoryTab = TAB_KEYS[activeTab] === "inventory";
   const isIncentiveTab = TAB_KEYS[activeTab] === "incentives";
   const canUpload      = !!form.dealerName && !!form.financialYear;

   const amountValue = Number(form.amount);
   const isNegativeAmount = isIncentiveTab && form.amount !== "" && !isNaN(amountValue) && amountValue < 0;

   return (
      <div className="bg-white border border-gray-300 p-4 sm:p-5">

         <p className="text-[11px] uppercase tracking-widest font-semibold mb-4 text-green-700">
            Manual Entry
         </p>

         {/* Tab bar — hidden when only one tab is allowed */}
         {showTabBar && (
            <div className="overflow-x-auto -mx-4 sm:mx-0 scrollbar-none">
               <div className="flex gap-0 border-b-2 border-gray-300 mb-5 min-w-max px-4 sm:px-0">
                  {TABS.map((tab, idx) => (
                     <button
                        key={tab}
                        type="button"
                        onClick={() => handleTabChange(idx)}
                        className={`flex items-center gap-1.5 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-0.5 transition-colors cursor-pointer whitespace-nowrap
                           ${activeTab === idx
                              ? "text-black border-green-700"
                              : "text-black opacity-40 border-transparent hover:opacity-70"}`}
                     >
                        <span>{TAB_ICONS[idx]}</span>
                        {tab}
                     </button>
                  ))}
               </div>
            </div>
         )}

         {!isInventoryTab && banner.message && (
            <div className="mb-4">
               <Banner type={banner.type} message={banner.message} onClose={() => setBanner({ type: "", message: "" })} />
            </div>
         )}

         {/* Shared fields */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Field label="Financial Year" error={errors.financialYear}>
               <FinancialYearSelect
                  value={form.financialYear}
                  onChange={e => handleFinancialYearChange(e.target.value)}
                  disabled={loading}
               />
            </Field>
            <Field label="Dealer Name" error={errors.dealerName}>
               <DealerSelect
                  value={form.dealerName}
                  onChange={handleDealerChange}
                  disabled={loading}
                  placeholder="Select dealer"
               />
            </Field>
         </div>

         {/* Paid Cash / Incentives */}
         {!isInventoryTab && (
            <>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Date" error={errors.date}>
                     <TextInput
                        type="date"
                        value={form.date}
                        onChange={e => handleField("date", e.target.value)}
                        disabled={loading || (isIncentiveTab && !form.financialYear)}
                        min={isIncentiveTab ? fyDateRange?.min : PAID_CASH_DATE_MIN}
                        max={isIncentiveTab ? fyDateRange?.max : todayISO}
                        placeholder="dd-mm-yyyy"
                     />
                     {isIncentiveTab && !form.financialYear && (
                        <p className="text-[11px] text-gray-400 mt-0.5">Select a financial year first.</p>
                     )}
                  </Field>
                  <Field label="Amount (₹)" error={errors.amount}>
                     <TextInput
                        type="number"
                        value={form.amount}
                        onChange={e => handleField("amount", e.target.value)}
                        placeholder={isIncentiveTab ? "e.g. 500 or -500" : "0.00"}
                        disabled={loading}
                        min={isIncentiveTab ? undefined : "0"}
                     />
                     {isIncentiveTab && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                           Use a minus sign for deductions or reversals.
                        </p>
                     )}
                  </Field>
               </div>

               <div className="mt-4">
                  <Field label="Remarks" error={errors.remarks}>
                     <TextInput
                        type="text"
                        value={form.remarks}
                        onChange={e => handleField("remarks", e.target.value)}
                        placeholder="Optional remarks…"
                        disabled={loading}
                     />
                  </Field>
               </div>

               {(form.dealerName || form.amount) && (
                  <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 p-3 bg-gray-50 border border-gray-200 text-xs text-black">
                     <span className="font-semibold">Preview:</span>
                     {form.date && <span>{form.date}</span>}
                     {form.financialYear && (
                        <>
                           <span className="text-gray-400">·</span>
                           <span className="font-medium">{form.financialYear}</span>
                        </>
                     )}
                     {form.dealerName && (
                        <>
                           <span className="text-gray-400">·</span>
                           <span className="font-medium">{form.dealerName}</span>
                        </>
                     )}
                     {form.amount && !isNaN(amountValue) && (
                        <>
                           <span className="text-gray-400">·</span>
                           <span className={`font-semibold ${isNegativeAmount ? "text-red-600" : ""}`}>
                              {isNegativeAmount ? "-" : ""}₹ {Math.abs(amountValue).toLocaleString("en-IN")}
                           </span>
                        </>
                     )}
                     {form.remarks && (
                        <>
                           <span className="text-gray-400">·</span>
                           <span className="italic text-gray-500">{form.remarks}</span>
                        </>
                     )}
                  </div>
               )}

               <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 mt-5 pt-4 border-t border-gray-200">
                  <button
                     type="button"
                     onClick={() => handleTabChange(activeTab)}
                     disabled={loading}
                     className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-semibold text-black border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition text-center"
                  >
                     Reset
                  </button>
                  <button
                     type="button"
                     onClick={handleSubmit}
                     disabled={loading}
                     className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 focus:ring-2 focus:ring-green-200 disabled:opacity-60 transition"
                  >
                     {loading && <Spinner />}
                     {loading ? "Saving…" : `Save ${TABS[activeTab]}`}
                  </button>
               </div>
            </>
         )}

         {/* Inventory tab */}
         {isInventoryTab && (
            <div className="flex flex-col gap-3">
               {!canUpload && (
                  <p className="text-xs text-black bg-amber-50 border border-amber-300 px-3 py-2">
                     ⚠️ Select a dealer and financial year above before uploading.
                  </p>
               )}
               <div className={!canUpload ? "opacity-50 pointer-events-none" : ""}>
                  <FileSlot
                     type={TALLY_INVENTORY_TYPE}
                     slot={slot}
                     isDragOver={dragOver}
                     inputRef={inputRef}
                     selectedYear={form.financialYear || "25-26"}
                     onFileSelect={handleFileSelect}
                     onRemove={handleFileRemove}
                     onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                     onDragLeave={() => setDragOver(false)}
                     onDrop={e => {
                        e.preventDefault();
                        setDragOver(false);
                        const f = e.dataTransfer.files?.[0];
                        if (f) handleFileSelect(f);
                     }}
                     onUploadSingle={handleUpload}
                     disabled={slot.status === "uploading"}
                  />
               </div>
            </div>
         )}
      </div>
   );
}

export default ManualEntry;