import SectionHeader from "./ui/SectionHeader";
import CollectionBadge from "./ui/CollectionBadge";

export default function CollectionSummary({ summary, summaryLoading }) {
  const badges = [
    { label: "Receipts",            count: summary?.receipt            ?? 0, color: "bg-emerald-50" },
    { label: "Material Dispatched", count: summary?.materialDispatched ?? 0, color: "bg-blue-50"    },
    { label: "Adjusted Sheet",      count: summary?.adjustedSheet      ?? 0, color: "bg-amber-50"   },
    { label: "TDS Records",         count: summary?.tdsRecord          ?? 0, color: "bg-violet-50"  },
    { label: "Farmer Share",        count: summary?.farmerShareDetail  ?? 0, color: "bg-rose-50"    },
    { label: "Inventories",         count: summary?.inventory          ?? 0, color: "bg-cyan-50"    },
  ];

  return (
    <div className="bg-white border border-gray-100 p-5 shadow-sm animate-fadeUp" style={{ animationDelay: "120ms" }}>
      <SectionHeader
        title="Collection Summary"
        action={summaryLoading && <span className="text-[10px] text-gray-400 animate-pulse font-semibold">Loading…</span>}
      />
      {summaryLoading ? (
        <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="h-9 skeleton" />)}</div>
      ) : (
        <div className="space-y-2">
          {badges.map(b => <CollectionBadge key={b.label} {...b} />)}
        </div>
      )}
    </div>
  );
}