import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Dot,
} from "recharts";
import SectionHeader from "../ui/SectionHeader";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function SubsidyVsBillsChart({ summary, selectedFY }) {
  // Build quarterly breakdown from summary totals
  // Replace with real quarterly API data if available
  const base    = summary?.subsidy   ?? 0;
  const bills   = summary?.tallyBill ?? 0;
  const mainF   = summary?.mainFile  ?? 0;

  const data = [
    { quarter: "Q1", Subsidy: Math.round(base * 0.2),  TallyBills: Math.round(bills * 0.18), MainFile: Math.round(mainF * 0.22) },
    { quarter: "Q2", Subsidy: Math.round(base * 0.28), TallyBills: Math.round(bills * 0.25), MainFile: Math.round(mainF * 0.3)  },
    { quarter: "Q3", Subsidy: Math.round(base * 0.32), TallyBills: Math.round(bills * 0.35), MainFile: Math.round(mainF * 0.28) },
    { quarter: "Q4", Subsidy: Math.round(base * 0.2),  TallyBills: Math.round(bills * 0.22), MainFile: Math.round(mainF * 0.2)  },
  ];

  return (
    <div className="bg-white border border-gray-100 p-5 shadow-sm">
      <SectionHeader
        title="Subsidy vs Tally Bills"
        action={
          <span className="text-[10px] text-gray-400 font-semibold">
            FY {selectedFY || "—"}
          </span>
        }
      />
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="quarter"
            tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 600 }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingTop: 12 }}
            iconType="square" iconSize={8}
          />
          <Line
            type="monotone" dataKey="Subsidy"
            stroke="#10b981" strokeWidth={2.5}
            dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone" dataKey="TallyBills"
            stroke="#8b5cf6" strokeWidth={2.5}
            dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone" dataKey="MainFile"
            stroke="#f59e0b" strokeWidth={2.5}
            dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}