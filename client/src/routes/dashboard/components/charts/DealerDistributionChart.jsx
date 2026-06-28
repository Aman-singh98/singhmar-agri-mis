import { useSelector } from "react-redux";
import {
  PieChart, Pie, Cell, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import SectionHeader from "../ui/SectionHeader";
import { selectDealers } from "../../../../store/dealerSlice";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-gray-700">{payload[0].name}</p>
      <p className="text-gray-500 mt-0.5">
        {payload[0].value} dealers ({payload[0].payload.percent}%)
      </p>
    </div>
  );
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const r  = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x  = cx + r * Math.cos(-midAngle * RADIAN);
  const y  = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 10, fontWeight: 700 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function DealerDistributionChart() {
  const dealers = useSelector(selectDealers);

  // Group by first letter of name as mock category — replace with real field
  const groups = dealers.reduce((acc, d) => {
    const key = d.dealerType ?? d.category ?? d.dealerName?.[0]?.toUpperCase() ?? "Other";
    acc[key]  = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const total = dealers.length || 1;
  const data  = Object.entries(groups)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({
      name, value, percent: Math.round((value / total) * 100),
    }));

  return (
    <div className="bg-white border border-gray-100 p-5 shadow-sm">
      <SectionHeader title="Dealer Distribution" />
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-300 text-sm font-bold">
          No dealer data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={55} outerRadius={90}
              dataKey="value"
              labelLine={false}
              label={<CustomLabel />}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingTop: 8 }}
              iconType="square" iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}