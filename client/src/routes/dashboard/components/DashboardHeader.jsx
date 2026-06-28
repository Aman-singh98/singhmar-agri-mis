
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiRefresh, HiOfficeBuilding, HiChartBar } from "react-icons/hi";
import { fetchDealers, selectDealers, selectDealerLoading } from "../../../store/dealerSlice";
import { useAuth } from "../../../context/AuthContext";
import FinancialYearSelect from "../../../components/app/FinancialYearSelect";

/* ─────────── Greeting ─────────── */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

/* ─────────── Mobile Drawer ─────────── */
const MobileDrawer = ({ open, onClose, selectedFY, setSelectedFY, fyLoading, onRefresh }) => {
  if (!open) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-[300px] max-w-[92vw]
          transform transition-transform duration-300 ease-out lg:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full bg-white flex flex-col shadow-2xl">

          {/* Drawer Header */}
          <div className="bg-gray-900 px-6 py-6 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-emerald-400 mb-1">
                Agarwal MIS
              </p>
              <h2 className="text-lg font-bold text-white tracking-tight">Controls</h2>
              <p className="text-xs text-gray-400 mt-1">Financial year & refresh</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 px-6 py-5 space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                Financial Year
              </p>
              <FinancialYearSelect
                value={selectedFY}
                onChange={(e) => setSelectedFY(e.target.value)}
                disabled={fyLoading}
              />
            </div>
            <div className="h-px bg-gray-100" />
            <button
              onClick={() => { onRefresh(); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold
                text-white bg-emerald-700 hover:bg-emerald-800 transition-all"
            >
              <HiRefresh className="w-4 h-4" /> Refresh Data
            </button>
          </div>

          {/* Drawer Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full py-2.5 text-sm font-semibold text-gray-600
                hover:text-gray-900 border border-gray-200 hover:border-gray-300
                hover:bg-white transition-all"
            >
              ✕ Close
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

/* ─────────── DashboardHeader ─────────── */
const DashboardHeader = ({ selectedFY, setSelectedFY, fyLoading, totalAcres, onRefresh }) => {
  const { user }      = useAuth();
  const dealers       = useSelector(selectDealers);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="space-y-0">

        {/* ── DESKTOP (md+) ── */}
        <div className="hidden md:flex items-start justify-between flex-wrap gap-4">
         <>
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600;1,700&family=DM+Sans:wght@400;500;700&display=swap');
  `}</style>

  <div>
    <p style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 mb-1">
      🌾 Agarwal MIS
    </p>

    <h1 className="text-3xl sm:text-4xl leading-tight">
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontWeight: 600,
          background: "linear-gradient(135deg, #16a34a 0%, #4ade80 50%, #15803d 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.01em",
        }}
      >
        Agricultural Record
      </span>
      <span
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        className="ml-2 text-gray-700 text-2xl sm:text-3xl font-light tracking-tight"
      >
        Dashboard
      </span>
    </h1>

    <p style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="text-sm mt-1.5 text-gray-400 font-medium tracking-wide">
      {getGreeting()},{" "}
      <span className="text-gray-600 font-semibold">{user?.name || "SuperAdmin"}</span>
      {" "}— Here's your overview
    </p>
  </div>
</>

          {/* Right controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <FinancialYearSelect
              value={selectedFY}
              onChange={(e) => setSelectedFY(e.target.value)}
              disabled={fyLoading}
            />
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-700
                border border-gray-200 hover:border-emerald-300 bg-white px-3 py-2
                transition-all shadow-sm font-semibold"
            >
              <HiRefresh className="w-3.5 h-3.5" /> Refresh
            </button>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white border border-gray-100 px-3 py-2">
              <span className="w-2 h-2 bg-emerald-500 animate-pulse inline-block" />
              Live data
            </div>
          </div>
        </div>

        {/* ── MOBILE (below md) ── */}
        <div className="md:hidden space-y-2">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 mb-0.5">
              🌾 Agarwal MIS
            </p>
            <h1 className="text-xl font-semibold leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">
                Agricultural Subsidy
              </span>
              <span className="ml-1.5 text-gray-800">Dashboard</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {getGreeting()}, {user?.name || "SuperAdmin"}
            </p>
          </div>

          {/* Mobile compact bar */}
          <div className="flex items-stretch border border-gray-300 overflow-hidden divide-x divide-gray-300 bg-white">

            {/* FY Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-gray-600 hover:bg-gray-50 transition relative"
            >
              <svg className="w-4 h-4 flex-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 9h10M10 14h4" />
              </svg>
              <span className="text-xs font-semibold">
                FY {selectedFY || "Select"}
              </span>
            </button>

            {/* Dealers badge */}
            <div className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3">
              <HiOfficeBuilding className="w-4 h-4 text-emerald-600 flex-none" />
              <div className="text-center">
                <p className="text-[10px] text-gray-400 leading-none">Dealers</p>
                <p className="text-xs font-bold text-gray-700 leading-tight">{dealers.length}</p>
              </div>
            </div>

            {/* Acres badge */}
            <div className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3">
              <HiChartBar className="w-4 h-4 text-blue-500 flex-none" />
              <div className="text-center">
                <p className="text-[10px] text-gray-400 leading-none">Acres</p>
                <p className="text-xs font-bold text-gray-700 leading-tight">{totalAcres.toLocaleString()}</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedFY={selectedFY}
        setSelectedFY={setSelectedFY}
        fyLoading={fyLoading}
        onRefresh={onRefresh}
      />
    </>
  );
};

export default DashboardHeader;