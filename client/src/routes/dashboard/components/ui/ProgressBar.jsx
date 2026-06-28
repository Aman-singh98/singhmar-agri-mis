export default function ProgressBar({ label, value, total, color = "#10b981" }) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700">{value.toLocaleString()} ac</span>
          <span className="text-[10px] text-gray-400">({pct}%)</span>
        </div>
      </div>
      <div className="h-2 bg-gray-100 overflow-hidden">
        <div className="h-full transition-all duration-1000" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}