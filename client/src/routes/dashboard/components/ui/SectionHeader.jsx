export default function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h2 className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">{title}</h2>
        <div className="h-px bg-gradient-to-r from-gray-200 to-transparent w-16" />
      </div>
      {action}
    </div>
  );
}