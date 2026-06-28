import { useSelector } from "react-redux";
import { selectDealers } from "../../../../store/dealerSlice";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import SectionHeader from "../ui/SectionHeader";

// Mock monthly spread from dealer data — replace with real API if available
function buildMonthlyData(dealers) {
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  return months.map((month, i) => {
    const slice = dealers.slice(
      Math.floor((i / 12) * dealers.length),
      Math.floor(((i + 1) / 12) * dealers.length),
    );
    return {
      month,
      Mini: Math.round(slice.reduce((s, d) => s + (d.billedMini ?? 0), 0)),
      Drip: Math.round(slice.reduce((s, d) => s + (d.billedDrip ?? 0), 0)),
    };
  });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value.toLocaleString()} ac
        </p>
      ))}
    </div>
  );
};

export default function AcresTrendChart() {
  const dealers = useSelector(selectDealers);
  const data    = buildMonthlyData(dealers);

  return (
    <div className="bg-white border border-gray-100 p-5 shadow-sm">
      <SectionHeader title="Acres Trend — Monthly" />
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barCategoryGap="30%" barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 600 }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false} tickLine={false}
            tickFormatter={(v) => `${v}ac`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
          <Legend
            wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingTop: 12 }}
            iconType="square" iconSize={8}
          />
          <Bar dataKey="Mini" fill="#10b981" radius={0} />
          <Bar dataKey="Drip" fill="#3b82f6" radius={0} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}