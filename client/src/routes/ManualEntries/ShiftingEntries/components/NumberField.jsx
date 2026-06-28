
function NumberField({ label, itemKey, value, onChange }) {
   return (
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
         <label className="flex-1 text-xs text-slate-600 leading-snug">{label}</label>
         <input
            type="number"
            min="0"
            step="1"
            value={value}
            onChange={e => onChange(itemKey, e.target.value)}
            placeholder="0"
            className="w-24 text-right text-sm font-mono border border-slate-200 px-2.5 py-1.5
               focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400
               hover:border-slate-300 transition-all bg-white"
         />
      </div>
   );
}

export default NumberField;