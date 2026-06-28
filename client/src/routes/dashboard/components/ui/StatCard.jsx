export default function StatCard({ icon: Icon, label, value, sub, accent = "#1a56db", onClick, delay = 0 }) {
  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${delay}ms`, ...(onClick ? { cursor: "pointer" } : {}) }}
      className="bg-white border border-gray-900 p-4 flex flex-col gap-1.5 animate-fadeUp
        transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-700 truncate">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1.5 leading-tight">{value}</p>
          {sub && <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>}
        </div>
        <div
          className="w-10 h-10 flex items-center justify-center flex-shrink-0 ml-2"
          style={{ background: accent + "18" }}
        >
          <Icon className="w-[18px] h-[18px]" style={{ color: accent }} />
        </div>
      </div>
    </div>
  );
}