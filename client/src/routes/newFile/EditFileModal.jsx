import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectDealers } from "../../store/dealerSlice";

const BRAND_NAMES = ["NEER SHAKTI", "MOONGIPA", "ADS"];
const IRRIGATION_TYPES = ["Drip Irrigation", "Mini Sprinkler", "Portable Sprinkler"];

function FieldLabel({ label }) {
  return <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>;
}

function EditFileModal({ isOpen, record, onClose, onSave, loading }) {
  const dealers = useSelector(selectDealers);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (record) setForm({ ...record, createdBy: record.createdBy?._id || record.createdBy });
  }, [record]);

  // ✅ miNumber change hone par onlineStatus auto-set
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      onlineStatus: prev.miNumber?.trim() ? "Online" : "Offline",
    }));
  }, [form.miNumber]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleDealerChange = (e) => {
    const selectedName = e.target.value;
    const dealer = dealers.find((d) => d.dealerName === selectedName);
    setForm((p) => ({
      ...p,
      dealerName: selectedName,
      farmerDealerCode: dealer?.farmerDealerCode || p.farmerDealerCode,
    }));
  };

  const fields = [
    { name: "scanNo",     label: "Scan No" },
    { name: "name",       label: "Farmer Name" },
    { name: "fatherName", label: "Father's Name" },
    { name: "mobileNo",   label: "Mobile No" },
    { name: "address",    label: "Address" },
    { name: "block",      label: "Block" },
    { name: "district",   label: "District" },
    { name: "familyId",   label: "Family ID" },
    { name: "farmerCode", label: "Farmer Code" },
    { name: "miNumber",   label: "MI Number" },
    { name: "areaInAcre", label: "Area (Acre)", type: "number" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 overflow-y-auto py-6 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Edit Record</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              SR #{record?.srNo} — {record?.financialYear ?? "No FY (MI pending)"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto">

          {/* Brand */}
          <div>
            <FieldLabel label="Brand Name" />
            <select name="brandName" value={form.brandName || ""} onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select brand</option>
              {BRAND_NAMES.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>

          {/* Irrigation */}
          <div>
            <FieldLabel label="Irrigation Type" />
            <select name="irrigationType" value={form.irrigationType || ""} onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select type</option>
              {IRRIGATION_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Dealer */}
          <div>
            <FieldLabel label="Dealer Name" />
            <select name="dealerName" value={form.dealerName || ""} onChange={handleDealerChange}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select dealer</option>
              {dealers.map(d => <option key={d._id} value={d.dealerName}>{d.dealerName}</option>)}
            </select>
          </div>

          {/* Dealer Code */}
          <div>
            <FieldLabel label="Dealer Code" />
            <input
              name="farmerDealerCode"
              value={form.farmerDealerCode || ""}
              onChange={handleChange}
              readOnly={!!form.dealerName}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
            />
          </div>

          {/* ✅ Application Status — readonly, auto on excel */}
          <div>
            <FieldLabel label="Application Status" />
            <div className="w-full px-3 py-2 text-sm border border-dashed border-slate-200 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-between">
              <span>{form.applicationStatus || "—"}</span>
              <span className="text-xs">auto on Excel upload</span>
            </div>
          </div>

          {/* ✅ Online Status — auto from miNumber, no dropdown */}
          <div>
            <FieldLabel label="Online Status" />
            <div className={`w-full px-3 py-2 text-sm border rounded-lg flex items-center gap-2 font-medium
              ${form.onlineStatus === "Online"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-slate-50 border-slate-200 text-slate-400"}`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0
                ${form.onlineStatus === "Online" ? "bg-green-500" : "bg-slate-300"}`}
              />
              {form.onlineStatus || "Offline"}
              <span className="ml-auto text-xs font-normal opacity-60">auto</span>
            </div>
          </div>

          {/* Text fields */}
          {fields.map(f => (
            <div key={f.name}>
              <FieldLabel label={f.label} />
              <input
                type={f.type || "text"}
                name={f.name}
                value={form[f.name] || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}

          {/* Error */}
          <div className="sm:col-span-2">
            <FieldLabel label="Error / Remark" />
            <textarea
              name="error"
              value={form.error || ""}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <button onClick={onClose} disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-50">
            Cancel
          </button>
          <button onClick={() => onSave(form)} disabled={loading}
            className="px-5 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition disabled:opacity-60">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditFileModal;