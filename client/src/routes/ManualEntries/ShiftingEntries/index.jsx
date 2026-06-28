
import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import api from "../../../api/axios";
import FlashAlert from "./components/FlashAlert";
import ShiftingEntryForm from "./components/ShiftingEntryForm";
import ShiftingEntryTable from "./components/ShiftingEntryTable";
import { selectDealers } from "../../../store/dealerSlice";
import {
   CATEGORY_CONFIG, FLASH_SUCCESS_MS, FLASH_ERROR_MS,
   buildEmptyForm, toNumbers, sumObj,
} from "./constants";

const PAGE_TABS = [
   { key: "form",    label: "New Entry" },
   { key: "entries", label: "Saved Entries" },
];

function ShiftingEntrySection({ onTotalsChange }) {
   const dealers = useSelector(selectDealers);

   const [activeTab,    setActiveTab]    = useState("form");
   const [form,         setForm]         = useState(buildEmptyForm);
   const [formOpen,     setFormOpen]     = useState(true);
   const [formErrors,   setFormErrors]   = useState({ dealerName: "", financialYear: "", returnDate: "" });
   const [editingId,    setEditingId]    = useState(null);
   const [saving,       setSaving]       = useState(false);
   const [entries,      setEntries]      = useState([]);
   const [loadingList,  setLoadingList]  = useState(false);
   const [confirmOpen,  setConfirmOpen]  = useState(false);
   const [deleteTarget, setDeleteTarget] = useState(null);
   const [deleting,     setDeleting]     = useState(false);
   const [deleteError,  setDeleteError]  = useState("");
   const [successMsg,   setSuccessMsg]   = useState("");
   const [errorMsg,     setErrorMsg]     = useState("");

   const editSnapshot  = useRef(null);
   const successTimer  = useRef(null);
   const errorTimer    = useRef(null);

   const isEditing    = Boolean(editingId);
   const categorySums = Object.fromEntries(
      CATEGORY_CONFIG.map(cat => [cat.key, sumObj(form[cat.key] || {})])
   );
   const hdpeSum  = categorySums.hdpe    ?? 0;
   const lat32Sum = categorySums.lateral32 ?? 0;

   useEffect(() => () => {
      clearTimeout(successTimer.current);
      clearTimeout(errorTimer.current);
   }, []);

   function showSuccess(msg) {
      clearTimeout(successTimer.current);
      setSuccessMsg(msg);
      successTimer.current = setTimeout(() => setSuccessMsg(""), FLASH_SUCCESS_MS);
   }
   function showError(msg) {
      clearTimeout(errorTimer.current);
      setErrorMsg(msg);
      errorTimer.current = setTimeout(() => setErrorMsg(""), FLASH_ERROR_MS);
   }

   const fetchEntries = useCallback(() => {
      setLoadingList(true);
      api.get("/shifting-entry")
         .then(res => {
            const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
            setEntries(list);
         })
         .catch(() => showError("Failed to load entries."))
         .finally(() => setLoadingList(false));
   }, []);

   useEffect(() => { fetchEntries(); }, [fetchEntries]);

   function resolveDealerId() {
      const match = dealers.find(d => d.dealerName === form.dealerName);
      return match ? (match._id || match.id) : null;
   }

   const handleDealerChange        = useCallback((dealerName, dealerCode) => {
      setForm(prev => ({ ...prev, dealerName: dealerName || "", dealerCode: dealerCode || "" }));
      setFormErrors(prev => ({ ...prev, dealerName: "" }));
   }, []);
   const handleFinancialYearChange = useCallback(e => {
      setForm(prev => ({ ...prev, financialYear: e.target.value || "" }));
      setFormErrors(prev => ({ ...prev, financialYear: "" }));
   }, []);
   const handleReturnDateChange    = useCallback(e => {
      setForm(prev => ({ ...prev, returnDate: e.target.value || "" }));
      setFormErrors(prev => ({ ...prev, returnDate: "" }));
   }, []);
   const handleCategoryChange      = useCallback((categoryKey, itemKey, val) => {
      setForm(prev => ({ ...prev, [categoryKey]: { ...prev[categoryKey], [itemKey]: val } }));
   }, []);
   const handleRemarksChange       = useCallback(e => {
      setForm(prev => ({ ...prev, remarks: e.target.value }));
   }, []);

   function handleReset() {
      setForm(buildEmptyForm());
      setEditingId(null);
      setErrorMsg("");
      setFormErrors({ dealerName: "", financialYear: "", returnDate: "" });
      editSnapshot.current = null;
   }

   function handleSave() {
      const errors = { dealerName: "", financialYear: "", returnDate: "" };
      if (!form.dealerName)    errors.dealerName    = "Please select a dealer.";
      if (!form.financialYear) errors.financialYear = "Please select the financial year.";
      if (!form.returnDate)    errors.returnDate    = "Please select the return date.";
      if (errors.dealerName || errors.financialYear || errors.returnDate) {
         setFormErrors(errors); return;
      }
      const dealerId = resolveDealerId();
      if (!dealerId) { showError("Dealer not found. Please re-select."); return; }

      const categoryPayload = Object.fromEntries(
         CATEGORY_CONFIG.map(cat => [cat.key, toNumbers(form[cat.key] || {})])
      );
      const payload = { dealer: dealerId, financialYear: form.financialYear, returnDate: form.returnDate, ...categoryPayload, remarks: form.remarks.trim() };

      if (isEditing && editSnapshot.current) {
         const snap = editSnapshot.current;
         const catUnchanged = CATEGORY_CONFIG.every(cat => JSON.stringify(snap[cat.key]) === JSON.stringify(payload[cat.key]));
         if (snap.financialYear === payload.financialYear && snap.returnDate === payload.returnDate && snap.remarks === payload.remarks && catUnchanged) {
            showError("No changes detected — nothing to update."); return;
         }
      }

      setSaving(true); setErrorMsg("");
      const req = isEditing
         ? api.put(`/shifting-entry/${editingId}`, payload)
         : api.post("/shifting-entry", payload);

      req.then(() => {
         onTotalsChange?.(dealerId, hdpeSum, lat32Sum);
         showSuccess(isEditing ? "Entry updated successfully." : "Entry saved successfully.");
         handleReset(); fetchEntries(); setActiveTab("entries");
      })
      .catch(err => showError(err.response?.data?.message || "Save failed. Please try again."))
      .finally(() => setSaving(false));
   }

   function handleEdit(entry) {
      const dealer     = dealers.find(d => (d._id || d.id) === (entry.dealer?._id || entry.dealer));
      const dealerName = dealer?.dealerName || entry.dealer?.dealerName || "";
      const dealerCode = dealer?.farmerDealerCode || entry.dealer?.farmerDealerCode || "";
      const categoryFields = Object.fromEntries(
         CATEGORY_CONFIG.map(cat => [cat.key, Object.fromEntries(cat.items.map(i => [i.key, entry[cat.key]?.[i.key] ?? ""]))])
      );
      setForm({ dealerName, dealerCode, financialYear: entry.financialYear || "", returnDate: entry.returnDate ? entry.returnDate.slice(0, 10) : "", ...categoryFields, remarks: entry.remarks || "" });
      setEditingId(entry._id);
      setFormOpen(true);
      setActiveTab("form");
      editSnapshot.current = {
         financialYear: entry.financialYear || "",
         returnDate: entry.returnDate ? entry.returnDate.slice(0, 10) : "",
         remarks: (entry.remarks || "").trim(),
         ...Object.fromEntries(CATEGORY_CONFIG.map(cat => [cat.key, toNumbers(categoryFields[cat.key])])),
      };
      window.scrollTo({ top: 0, behavior: "smooth" });
   }

   function handleDeleteClick(entry)   { setDeleteTarget(entry); setDeleteError(""); setConfirmOpen(true); }
   function handleDeleteCancel()        { if (deleting) return; setConfirmOpen(false); setDeleteTarget(null); setDeleteError(""); }
   function handleDeleteConfirm() {
      if (!deleteTarget) return;
      const entryId = deleteTarget._id;
      setDeleting(true); setDeleteError("");
      api.delete(`/shifting-entry/${entryId}`)
         .then(() => {
            setConfirmOpen(false); setDeleteTarget(null);
            showSuccess("Entry deleted successfully.");
            if (editingId === entryId) handleReset();
            fetchEntries();
         })
         .catch(err => setDeleteError(err.response?.data?.message || "Delete failed. Please try again."))
         .finally(() => setDeleting(false));
   }

   return (
      <div className="flex flex-col h-full overflow-hidden bg-slate-50">

         {/* ── Page Header ─────────────────────────────────────── */}
         <div className="flex-none bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
            <div>
               <p className="text-[10px] uppercase tracking-widest text-green-600 font-semibold mb-0.5">
                  Inventory
               </p>
               <h1 className="text-xl font-bold text-slate-800 tracking-tight">Shifting Entries</h1>
               <p className="text-xs text-slate-400 mt-0.5">Inventory quantity adjustments per dealer</p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono bg-slate-100 border border-slate-200 px-3 py-1.5">
               {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </span>
         </div>

         {/* ── Tab Bar ─────────────────────────────────────────── */}
         <div className="flex-none flex border-b-2 border-slate-200 bg-white px-6">
            {PAGE_TABS.map(t => {
               const isActive = activeTab === t.key;
               const isEditTab = t.key === "form" && isEditing;
               return (
                  <button
                     key={t.key}
                     onClick={() => setActiveTab(t.key)}
                     className={`px-6 py-2.5 text-sm font-semibold border-b-2 -mb-0.5 transition-colors cursor-pointer whitespace-nowrap
                        ${isActive
                           ? isEditTab
                              ? "text-amber-600 border-amber-500"
                              : "text-green-700 border-green-600"
                           : "text-slate-400 border-transparent hover:text-slate-600"}`}
                  >
                     {isEditTab ? "Edit Entry" : t.label}
                     {t.key === "entries" && entries.length > 0 && (
                        <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 tabular-nums
                           ${isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                           {entries.length}
                        </span>
                     )}
                  </button>
               );
            })}
         </div>

         {/* ── Tab Body ────────────────────────────────────────── */}
         <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0 space-y-4">

            <FlashAlert type="success" message={successMsg} />
            <FlashAlert type="error"   message={errorMsg} />

            {activeTab === "form" && (
               <ShiftingEntryForm
                  form={form} formErrors={formErrors} isEditing={isEditing}
                  saving={saving} formOpen={formOpen} categorySums={categorySums}
                  onFormOpenToggle={() => setFormOpen(o => !o)}
                  onDealerChange={handleDealerChange}
                  onFinancialYearChange={handleFinancialYearChange}
                  onReturnDateChange={handleReturnDateChange}
                  onCategoryChange={handleCategoryChange}
                  onRemarksChange={handleRemarksChange}
                  onSave={handleSave} onReset={handleReset}
               />
            )}

            {activeTab === "entries" && (
               <ShiftingEntryTable
                  entries={entries} loadingList={loadingList} editingId={editingId}
                  confirmOpen={confirmOpen} deleteTarget={deleteTarget}
                  deleting={deleting} deleteError={deleteError}
                  onEdit={handleEdit} onDeleteClick={handleDeleteClick}
                  onDeleteConfirm={handleDeleteConfirm} onDeleteCancel={handleDeleteCancel}
               />
            )}
         </div>
      </div>
   );
}

export default ShiftingEntrySection;