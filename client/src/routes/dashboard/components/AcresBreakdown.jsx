import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchDealers, selectDealers, selectDealerLoading } from "../../../store/dealerSlice";
import { HiChartBar } from "react-icons/hi";
import SectionHeader from "./ui/SectionHeader";
import ProgressBar from "./ui/ProgressBar";

export default function AcresBreakdown() {
  const dispatch      = useDispatch();
  const dealers       = useSelector(selectDealers);
  const dealerLoading = useSelector(selectDealerLoading);

  // slice call
  useEffect(() => {
    if (!dealers.length && !dealerLoading) dispatch(fetchDealers());
  }, [dispatch]);

  const miniAcres  = Math.round(dealers.reduce((s, d) => s + (d.billedMini ?? 0), 0));
  const dripAcres  = Math.round(dealers.reduce((s, d) => s + (d.billedDrip ?? 0), 0));
  const totalAcres = miniAcres + dripAcres;

  return (
    <div className="bg-white border border-gray-100 p-5 shadow-sm animate-fadeUp" style={{ animationDelay: "80ms" }}>
      <SectionHeader title="Acres Breakdown" />
      {dealerLoading ? (
        <div className="space-y-4">{[...Array(2)].map((_, i) => <div key={i} className="h-10 skeleton" />)}</div>
      ) : totalAcres === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <HiChartBar className="w-10 h-10 text-gray-100 mb-3" />
          <p className="text-sm font-bold text-gray-300">No billing data</p>
          <p className="text-xs text-gray-300 mt-1">Upload data to see acres</p>
        </div>
      ) : (
        <div className="space-y-5">
          <ProgressBar label="Mini Irrigation" value={miniAcres} total={totalAcres} color="#10b981" />
          <ProgressBar label="Drip Irrigation"  value={dripAcres} total={totalAcres} color="#3b82f6" />
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="bg-emerald-50 p-3 text-center">
              <p className="text-xl font-black text-emerald-700">{miniAcres.toLocaleString()}</p>
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-wide mt-0.5">Mini</p>
            </div>
            <div className="bg-blue-50 p-3 text-center">
              <p className="text-xl font-black text-blue-700">{dripAcres.toLocaleString()}</p>
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-wide mt-0.5">Drip</p>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-50">
            <span className="text-xs text-gray-400 font-semibold">Total Billed</span>
            <span className="text-sm font-black text-gray-800">{totalAcres.toLocaleString()} ac</span>
          </div>
        </div>
      )}
    </div>
  );
}