import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer,
} from "recharts";
import SectionHeader from "../ui/SectionHeader";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-gray-700">{label}</p>
      <p className="text-gray-600 mt-0.5 font-semibold">
        {payload[0].value.toLocaleString()} records
      </p>
    </div>
  );
};

export default function CollectionBarChart({ summary, selectedFY }) {
  const data = [
    { name: "Receipts",    value: summary?.receipt            ?? 0 },
    { name: "Dispatched",  value: summary?.materialDispatched ?? 0 },
    { name: "Adj. Sheet",  value: summary?.adjustedSheet      ?? 0 },
    { name: "TDS",         value: summary?.tdsRecord          ?? 0 },
    { name: "Farmer Share",value: summary?.farmerShareDetail  ?? 0 },
    { name: "Inventory",   value: summary?.inventory          ?? 0 },
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-white border border-gray-100 p-5 shadow-sm">
      <SectionHeader
        title="Collection Overview"
        action={
          <span className="text-[10px] text-gray-400 font-semibold">
            FY {selectedFY || "—"}
          </span>
        }
      />
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-300 text-sm font-bold">
          No collection data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} layout="vertical" barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              type="category" dataKey="name"
              tick={{ fontSize: 10, fill: "#6b7280", fontWeight: 600 }}
              axisLine={false} tickLine={false} width={80}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
            <Bar dataKey="value" radius={0}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}