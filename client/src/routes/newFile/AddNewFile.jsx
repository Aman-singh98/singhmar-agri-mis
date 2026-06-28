
import { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDealers, selectDealers, selectDealerLoading } from "../../store/dealerSlice";
import api from "../../api/axios";
import {
  HiOutlineQrcode,
  HiOutlineTag,
  HiOutlineUser,
  HiOutlineUsers,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineMap,
  HiOutlineOfficeBuilding,
  HiOutlineFilter,
  HiOutlineScale,
  HiOutlineIdentification,
  HiOutlineHashtag,
  HiOutlineLibrary,
  HiOutlineCode,
  HiOutlineWifi,
  HiOutlineDocumentText,
  HiOutlineExclamationCircle,
  HiOutlineRefresh,
  HiOutlineSave,
  HiOutlineClipboardList,
  HiOutlineChip,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineInformationCircle,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineChevronDown,
} from "react-icons/hi";

const BRAND_NAMES = ["NEER SHAKTI", "MOONGIPA", "ADS"];
const IRRIGATION_TYPES = ["Drip Irrigation", "Mini Sprinkler", "Portable Sprinkler"];

const INITIAL_FORM = {
  scanNo: "",
  brandName: "",
  name: "",
  fatherName: "",
  mobileNo: "",
  address: "",
  block: "",
  district: "",
  irrigationType: "",
  areaInAcre: "",
  familyId: "",
  farmerCode: "",
  dealerName: "",
  farmerDealerCode: "",
  miNumber: "",
  applicationStatus: "",
  onlineStatus: "",
  error: "",
};

/* ─── Reusable primitives ──────────────────────────────────────────── */

function FieldLabel({ label, icon: Icon }) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
      {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
      {label}
    </label>
  );
}

function TextInput({ name, value, onChange, placeholder, type = "text", readOnly = false }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full px-3 py-2.5 text-sm border-b-2 border-x border-t bg-white text-slate-800 placeholder-slate-300
        focus:outline-none focus:border-b-green-500 focus:border-x-green-200 focus:border-t-green-200 transition-colors
        ${readOnly
          ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
          : "border-slate-200 hover:border-slate-300"
        }`}
    />
  );
}

function SelectInput({ name, value, onChange, options, placeholder, disabled = false }) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2.5 text-sm border-b-2 border-x border-t bg-white text-slate-800
          focus:outline-none focus:border-b-green-500 focus:border-x-green-200 focus:border-t-green-200 transition-colors appearance-none
          ${disabled
            ? "opacity-50 cursor-not-allowed border-slate-100"
            : "border-slate-200 hover:border-slate-300 cursor-pointer"
          }`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <HiOutlineFilter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  );
}

function SectionHeading({ icon: Icon, title, color = "green" }) {
  const colors = {
    green: "bg-green-600",
    blue: "bg-blue-600",
    amber: "bg-amber-500",
    purple: "bg-purple-600",
  };
  return (
    <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
      <div className={`${colors[color]} p-1.5 text-white`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{title}</span>
    </div>
  );
}

/* ─── Searchable Dealer Combobox ────────────────────────────────────
   Shows dealer name + dealer code in the list (and in the closed input
   once selected) so dealers sharing the same name can be told apart. */

function DealerCombobox({ dealers, loading, value, dealerCode, onSelect }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  // Keep the visible text in sync with the selected dealer when closed
  useEffect(() => {
    if (!open) {
      setQuery(value ? `${value}${dealerCode ? `  •  ${dealerCode}` : ""}` : "");
    }
  }, [value, dealerCode, open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = open ? query.trim().toLowerCase() : "";
    if (!q) return dealers;
    return dealers.filter((d) => {
      const code = d.farmerDealerCode || "";
      return (
        d.dealerName?.toLowerCase().includes(q) ||
        code.toLowerCase().includes(q)
      );
    });
  }, [dealers, query, open]);

  const handleFocus = () => {
    setOpen(true);
    setQuery(""); // clear so typing starts fresh; selected value still shown via placeholder-like display
  };

  const handlePick = (dealer) => {
    onSelect(dealer);
    setOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onSelect(null);
    setQuery("");
  };

  if (loading) {
    return (
      <div className="w-full px-3 py-2.5 text-sm border border-slate-200 bg-slate-50 text-slate-400 flex items-center gap-2">
        <HiOutlineRefresh className="w-4 h-4 animate-spin" />
        Loading dealers...
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onFocus={handleFocus}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search dealer by name or code"
          className="w-full pl-9 pr-16 py-2.5 text-sm border-b-2 border-x border-t border-slate-200 bg-white text-slate-800 placeholder-slate-300
            focus:outline-none focus:border-b-green-500 focus:border-x-green-200 focus:border-t-green-200 transition-colors hover:border-slate-300"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            title="Clear selection"
          >
            <HiOutlineX className="w-4 h-4" />
          </button>
        )}
        <HiOutlineChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none transition-transform ${open ? "rotate-180" : ""}`} />
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto bg-white border border-slate-200 shadow-lg">
          {filtered.length === 0 ? (
            <div className="px-3 py-3 text-sm text-slate-400">No dealers found</div>
          ) : (
            filtered.map((d) => {
              const isSelected = d.dealerName === value && d.farmerDealerCode === dealerCode;
              return (
                <button
                  key={d._id || d.id}
                  type="button"
                  onClick={() => handlePick(d)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition
                    ${isSelected ? "bg-green-600 text-white" : "hover:bg-slate-50 text-slate-700"}`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <HiOutlineOfficeBuilding className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-white" : "text-slate-400"}`} />
                    <span className="font-medium truncate">{d.dealerName}</span>
                  </span>
                  {d.farmerDealerCode && (
                    <span className={`text-[11px] font-mono font-semibold px-1.5 py-0.5 flex-shrink-0
                      ${isSelected ? "bg-green-700 text-white" : "bg-slate-100 text-slate-500"}`}>
                      {d.farmerDealerCode}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────── */

const AddNewFile = ({ currentUser = null }) => {
  const dispatch = useDispatch();
  const dealers = useSelector(selectDealers);
  const dealerLoading = useSelector(selectDealerLoading);

  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    dispatch(fetchDealers());
  }, [dispatch]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      onlineStatus: prev.miNumber.trim() ? "Online" : "Offline",
    }));
  }, [form.miNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  function handleMobileChange(e) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((prev) => ({ ...prev, mobileNo: digits }));
  }

  function handleAreaChange(e) {
    let value = e.target.value;
    // Allow only digits and one decimal point
    value = value.replace(/[^\d.]/g, "");
    // Ensure only one decimal point
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }
    // Limit to 2 decimal places
    if (parts.length === 2) {
      value = parts[0] + "." + parts[1].slice(0, 2);
    }
    setForm((prev) => ({ ...prev, areaInAcre: value }));
  }

  // dealer is the full dealer object (or null to clear)
  const handleDealerSelect = (dealer) => {
    setForm((prev) => ({
      ...prev,
      dealerName: dealer?.dealerName || "",
      farmerDealerCode: dealer?.farmerDealerCode || "",
    }));
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        areaInAcre: form.areaInAcre ? Number(form.areaInAcre) : null,
        applicationStatus: form.applicationStatus || null,
      };
      await api.post("/mainfile", payload);
      showToast("success", "File record saved successfully!");
      setForm(INITIAL_FORM);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to save record.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => setForm(INITIAL_FORM);

  return (
    <div className="w-full min-h-screen bg-slate-50">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-0 right-0 z-50 w-full sm:w-auto sm:top-4 sm:right-4 px-4 py-3 shadow-lg text-sm font-medium flex items-center gap-2 border-l-4
          ${toast.type === "success"
            ? "bg-green-50 text-green-800 border-green-500"
            : "bg-red-50 text-red-800 border-red-500"}`}
        >
          {toast.type === "success"
            ? <HiOutlineCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            : <HiOutlineXCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          }
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 text-white">
              <HiOutlineDocumentText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">Add New File Record</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                MI Number sets financial year · Application status auto-updates on Excel upload
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1.5">
            <HiOutlineInformationCircle className="w-3.5 h-3.5" />
            All fields are optional unless marked
          </div>
        </div>
      </div>

      {/* Form Body */}
      <div className="w-full p-4 sm:p-6 space-y-0">

        {/* Section 1: Basic Info */}
        <div className="w-full bg-white border border-slate-200 border-b-0 p-5 sm:p-6">
          <SectionHeading icon={HiOutlineClipboardList} title="Basic Information" color="green" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Scan No." icon={HiOutlineQrcode} />
              <TextInput name="scanNo" value={form.scanNo} onChange={handleChange} placeholder="Enter scan number" />
            </div>
            <div>
              <FieldLabel label="Brand Name" icon={HiOutlineTag} />
              <SelectInput name="brandName" value={form.brandName} onChange={handleChange} options={BRAND_NAMES} placeholder="Select brand" />
            </div>
          </div>
        </div>

        {/* Section 2: Farmer Details */}
        <div className="w-full bg-white border border-slate-200 border-b-0 p-5 sm:p-6">
          <SectionHeading icon={HiOutlineUsers} title="Farmer Details" color="blue" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <FieldLabel label="Farmer Name" icon={HiOutlineUser} />
              <TextInput name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
            </div>
            <div>
              <FieldLabel label="Father's Name" icon={HiOutlineUser} />
              <TextInput name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Father's name" />
            </div>
            <div>
              <FieldLabel label="Mobile No." icon={HiOutlinePhone} />
              <TextInput
                type="tel"
                name="mobileNo"
                value={form.mobileNo}
                onChange={handleMobileChange}
                placeholder="10-digit mobile"
                maxLength={10}
                inputMode="numeric" 
              />
              <p className="text-xs text-slate-400 mt-1">{form.mobileNo.length}/10 digits</p>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <FieldLabel label="Address" icon={HiOutlineLocationMarker} />
              <TextInput name="address" value={form.address} onChange={handleChange} placeholder="Full address" />
            </div>
            <div>
              <FieldLabel label="Block" icon={HiOutlineMap} />
              <TextInput name="block" value={form.block} onChange={handleChange} placeholder="Block name" />
            </div>
            <div>
              <FieldLabel label="District" icon={HiOutlineOfficeBuilding} />
              <TextInput name="district" value={form.district} onChange={handleChange} placeholder="District name" />
            </div>
            <div>
              <FieldLabel label="Irrigation Type" icon={HiOutlineFilter} />
              <SelectInput name="irrigationType" value={form.irrigationType} onChange={handleChange} options={IRRIGATION_TYPES} placeholder="Select type" />
            </div>
            <div>
              <FieldLabel label="Area (in Acres)" icon={HiOutlineScale} />
              <TextInput name="areaInAcre" value={form.areaInAcre} onChange={handleAreaChange} placeholder="e.g. 2.5" />
              <p className="text-xs text-slate-400 mt-1">Max 2 decimal places</p>
            </div>
            <div>
              <FieldLabel label="Family ID" icon={HiOutlineIdentification} />
              <TextInput name="familyId" value={form.familyId} onChange={handleChange} placeholder="Family ID" />
            </div>
            <div>
              <FieldLabel label="Farmer Code" icon={HiOutlineHashtag} />
              <TextInput name="farmerCode" value={form.farmerCode} onChange={handleChange} placeholder="Farmer code" />
            </div>
          </div>
        </div>

        {/* Section 3: Dealer Info */}
        <div className="w-full bg-white border border-slate-200 border-b-0 p-5 sm:p-6">
          <SectionHeading icon={HiOutlineLibrary} title="Dealer Info" color="amber" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Dealer Name" icon={HiOutlineOfficeBuilding} />
              <DealerCombobox
                dealers={dealers}
                loading={dealerLoading}
                value={form.dealerName}
                dealerCode={form.farmerDealerCode}
                onSelect={handleDealerSelect}
              />
            </div>
            <div>
              <FieldLabel label="Farmer / Dealer Code" icon={HiOutlineCode} />
              <TextInput
                name="farmerDealerCode"
                value={form.farmerDealerCode}
                onChange={handleChange}
                placeholder="Auto-filled on dealer select"
                readOnly={!!form.dealerName}
              />
            </div>
          </div>
        </div>

        {/* Section 4: MI & Status */}
        <div className="w-full bg-white border border-slate-200 p-5 sm:p-6">
          <SectionHeading icon={HiOutlineChip} title="MI & Status" color="purple" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <FieldLabel label="MI Number" icon={HiOutlineHashtag} />
              <TextInput name="miNumber" value={form.miNumber} onChange={handleChange} placeholder="Sets financial year" />
            </div>

            {/* Online Status */}
            <div>
              <FieldLabel label="Online Status" icon={HiOutlineWifi} />
              <div className={`w-full px-3 py-2.5 text-sm border-b-2 border-x border-t flex items-center gap-2 font-semibold
                ${form.onlineStatus === "Online"
                  ? "bg-green-50 border-b-green-500 border-x-green-200 border-t-green-200 text-green-700"
                  : "bg-slate-50 border-slate-200 text-slate-400"}`}
              >
                <span className={`w-2 h-2 flex-shrink-0 ${form.onlineStatus === "Online" ? "bg-green-500" : "bg-slate-300"}`} />
                {form.onlineStatus || "Offline"}
                <span className="ml-auto text-xs font-normal opacity-60 uppercase tracking-wider">auto</span>
              </div>
            </div>

            {/* Application Status */}
            <div>
              <FieldLabel label="Application Status" icon={HiOutlineDocumentText} />
              <div className="w-full px-3 py-2.5 text-sm border border-dashed border-slate-300 bg-slate-50 text-slate-400 flex items-center justify-between">
                <span>—</span>
                <span className="text-xs uppercase tracking-wider">auto on Excel upload</span>
              </div>
            </div>

            {/* Error / Remark */}
            <div className="sm:col-span-2 lg:col-span-3">
              <FieldLabel label="Error / Remark" icon={HiOutlineExclamationCircle} />
              <textarea
                name="error"
                value={form.error}
                onChange={handleChange}
                placeholder="Any error note or remark (optional)"
                rows={3}
                className="w-full px-3 py-2.5 text-sm border-b-2 border-x border-t border-slate-200 bg-white text-slate-800 placeholder-slate-300
                  focus:outline-none focus:border-b-green-500 focus:border-x-green-200 focus:border-t-green-200 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-5 mt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition disabled:opacity-50 cursor-pointer w-full sm:w-auto"
            >
              <HiOutlineRefresh className="w-4 h-4" />
              Reset
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 active:bg-green-800 border border-green-700 transition disabled:opacity-60 cursor-pointer w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <HiOutlineSave className="w-4 h-4" />
                  Save File Record
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddNewFile;