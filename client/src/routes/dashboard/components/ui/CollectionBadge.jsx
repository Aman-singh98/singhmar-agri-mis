export default function CollectionBadge({ label, count, color }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2 ${color}`}>
      <span className="text-xs font-semibold text-gray-700">{label}</span>
      <span className="text-xs font-black text-gray-900">{(count ?? 0).toLocaleString()}</span>
    </div>
  );
}