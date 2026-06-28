import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDealers, selectDealers, selectDealerLoading } from "../../../store/dealerSlice";
import { HiOfficeBuilding, HiArrowRight, HiPlusCircle } from "react-icons/hi";
import { FULL_PATHS } from "../../../constants/routes";
import SectionHeader from "./ui/SectionHeader";
import DealerRow from "./ui/DealerRow";

export default function RecentDealers() {
  const navigate      = useNavigate();
  const dispatch      = useDispatch();
  const dealers       = useSelector(selectDealers);
  const dealerLoading = useSelector(selectDealerLoading);

  // slice call
  useEffect(() => {
    if (!dealers.length && !dealerLoading) dispatch(fetchDealers());
  }, [dispatch]);

  const recentDealers = [...dealers]
    .sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))
    .slice(0, 6);

  return (
    <div className="bg-white border border-gray-100 p-5 shadow-sm animate-fadeUp" style={{ animationDelay: "160ms" }}>
      <SectionHeader
        title="Recent Dealers"
        action={
          <button
            onClick={() => navigate(FULL_PATHS.DEALER_LIST)}
            className="text-xs text-emerald-600 hover:text-emerald-800 font-bold flex items-center gap-1 transition"
          >
            View all <HiArrowRight className="w-3 h-3" />
          </button>
        }
      />
      {dealerLoading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-12 skeleton" />)}</div>
      ) : recentDealers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <HiOfficeBuilding className="w-10 h-10 text-gray-100 mb-3" />
          <p className="text-sm font-bold text-gray-400">No dealers yet</p>
          <button
            onClick={() => navigate(FULL_PATHS.DEALER_LIST)}
            className="flex items-center gap-2 bg-emerald-700 text-white text-xs px-4 py-2 hover:bg-emerald-800 transition font-bold mt-4"
          >
            <HiPlusCircle className="w-3.5 h-3.5" /> Add Dealer
          </button>
        </div>
      ) : (
        <div className="space-y-0.5">
          {recentDealers.map((d, i) => (
            <DealerRow key={d._id} dealer={d} index={i} onNavigate={() => navigate(FULL_PATHS.DEALER_LIST)} />
          ))}
          {dealers.length > 6 && (
            <div className="pt-3 mt-1 border-t border-gray-50">
              <button
                onClick={() => navigate(FULL_PATHS.DEALER_LIST)}
                className="w-full text-xs text-gray-400 hover:text-emerald-700 font-semibold py-1.5 hover:bg-emerald-50 transition flex items-center justify-center gap-1"
              >
                +{dealers.length - 6} more · View all <HiArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}