import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {
  HiOfficeBuilding, HiTrendingUp, HiChartBar,
  HiCollection, HiClipboardList, HiDocumentText,
  HiCurrencyRupee, HiUsers,
} from "react-icons/hi";
import { fetchDealers, selectDealers, selectDealerLoading } from "../../../store/dealerSlice";
import { FULL_PATHS } from "../../../constants/routes";
import StatCard from "./ui/StatCard";
import SectionHeader from "./ui/SectionHeader";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export default function StatCards({ fyList, selectedFY }) {
  const navigate      = useNavigate();
  const dispatch      = useDispatch();
  const dealers       = useSelector(selectDealers);
  const dealerLoading = useSelector(selectDealerLoading);

  const [summary, setSummary]               = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // ── slice call ──
  useEffect(() => {
    if (!dealers.length && !dealerLoading) dispatch(fetchDealers());
  }, [dispatch]);

  // ── summary fetch ──
  useEffect(() => {
    if (!selectedFY) return;
    setSummaryLoading(true);
    axios
      .get(`${API}/api/data/summary`, { params: { financialYear: selectedFY } })
      .then((res) => setSummary(res.data?.summary ?? res.data ?? null))
      .catch(() => setSummary(null))
      .finally(() => setSummaryLoading(false));
  }, [selectedFY]);

  // ── derived ──
  const miniAcres  = Math.round(dealers.reduce((s, d) => s + (d.billedMini ?? 0), 0));
  const dripAcres  = Math.round(dealers.reduce((s, d) => s + (d.billedDrip ?? 0), 0));
  const totalAcres = miniAcres + dripAcres;

  // ── Row 1 cards ──
  const row1 = [
    {
      label: "Total Dealers",
      value: dealers.length,
      icon: HiOfficeBuilding,
      accent: "#0e9f6e",
      onClick: () => navigate(FULL_PATHS.DEALER_LIST),
      delay: 0,
      sub: "Click to manage",
    },
    {
      label: "Mini Acres",
      value: `${miniAcres.toLocaleString()} ac`,
      icon: HiTrendingUp,
      accent: "#1a56db",
      delay: 60,
      sub: `${totalAcres > 0 ? Math.round((miniAcres / totalAcres) * 100) : 0}% of total`,
    },
    {
      label: "Drip Acres",
      value: `${dripAcres.toLocaleString()} ac`,
      icon: HiChartBar,
      accent: "#0891b2",
      delay: 120,
      sub: `${totalAcres > 0 ? Math.round((dripAcres / totalAcres) * 100) : 0}% of total`,
    },
    {
      label: "Financial Years",
      value: fyList.length,
      icon: HiCollection,
      accent: "#e3a008",
      onClick: () => navigate(FULL_PATHS.FINANCIAL_YEARS),
      delay: 180,
      sub: `Active: FY ${selectedFY || "—"}`,
    },
  ];

  // ── Row 2 cards ──
  const row2 = [
    {
      label: "Main File Records",
      value: summary?.mainFile  ?? 0,
      icon: HiClipboardList,
      accent: "#7e3af2",
      delay: 0,
      sub: `FY ${selectedFY || "—"}`,
    },
    {
      label: "Tally Bills",
      value: summary?.tallyBill ?? 0,
      icon: HiDocumentText,
      accent: "#e02424",
      delay: 60,
      sub: `FY ${selectedFY || "—"}`,
    },
    {
      label: "Subsidy Records",
      value: summary?.subsidy   ?? 0,
      icon: HiCurrencyRupee,
      accent: "#0e9f6e",
      delay: 120,
      sub: `FY ${selectedFY || "—"}`,
    },
    {
      label: "Micada Entries",
      value: summary?.micada    ?? 0,
      icon: HiUsers,
      accent: "#1a56db",
      delay: 180,
      sub: `FY ${selectedFY || "—"}`,
    },
  ];

  return (
    <div className="space-y-6">

      {/* ── Row 1 — At a Glance ── */}
      <div>
        <SectionHeader title="At a Glance" />
        {dealerLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {row1.map((c) => <StatCard key={c.label} {...c} />)}
          </div>
        )}
      </div>

      {/* ── Row 2 — FY Data ── */}
      <div>
        <SectionHeader
          title={`FY ${selectedFY || "—"} Data`}
          action={
            summaryLoading
              ? <span className="text-[10px] text-gray-400 animate-pulse font-semibold">Loading…</span>
              : summary === null
                ? <span className="text-[10px] text-gray-300 font-semibold">No data</span>
                : null
          }
        />
        {summaryLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {row2.map((c) => <StatCard key={c.label} {...c} />)}
          </div>
        )}
      </div>

    </div>
  );
}