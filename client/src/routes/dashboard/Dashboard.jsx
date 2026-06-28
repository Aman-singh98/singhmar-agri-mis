
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { HiCheck } from "react-icons/hi";
import { fetchDealers, selectDealers, selectDealerLoading } from "../../store/dealerSlice";
import DashboardHeader   from "./components/DashboardHeader";
import AcresBreakdown    from "./components/AcresBreakdown";
import CollectionSummary from "./components/CollectionSummary";
import RecentDealers     from "./components/RecentDealers";
import QuickActions      from "./components/QuickActions";
import StatCards from "./components/StatCards";
import AcresTrendChart from "./components/charts/AcresTrendChart";
import DealerDistributionChart from "./components/charts/DealerDistributionChart";
import SubsidyVsBillsChart from "./components/charts/SubsidyVsBillsChart";
import CollectionBarChart from "./components/charts/CollectionBarChart";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export default function Dashboard() {
  const dispatch      = useDispatch();
  const dealers       = useSelector(selectDealers);
  const dealerLoading = useSelector(selectDealerLoading);

  const [fyList, setFyList]         = useState([]);
  const [selectedFY, setSelectedFY] = useState("");
  const [fyLoading, setFyLoading]   = useState(true);
  const [summary, setSummary]       = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // slice call
  useEffect(() => {
    if (!dealers.length && !dealerLoading) dispatch(fetchDealers());
  }, [dispatch]);

  // financial years
  useEffect(() => {
    (async () => {
      try {
        const res   = await axios.get(`${API}/api/financial-years`);
        const years = res.data?.years ?? res.data ?? [];
        setFyList(years);
        setSelectedFY(years[0] ?? "");
      } catch (_) {}
      finally { setFyLoading(false); }
    })();
  }, []);

  // summary
  const fetchSummary = (fy) => {
    if (!fy) return;
    setSummaryLoading(true);
    axios.get(`${API}/api/data/summary`, { params: { financialYear: fy } })
      .then(res => setSummary(res.data?.summary ?? res.data ?? null))
      .catch(() => setSummary(null))
      .finally(() => setSummaryLoading(false));
  };

  useEffect(() => { fetchSummary(selectedFY); }, [selectedFY]);

  const handleRefresh = () => {
    dispatch(fetchDealers());
    fetchSummary(selectedFY);
  };

  const miniAcres  = Math.round(dealers.reduce((s, d) => s + (d.billedMini ?? 0), 0));
  const dripAcres  = Math.round(dealers.reduce((s, d) => s + (d.billedDrip ?? 0), 0));
  const totalAcres = miniAcres + dripAcres;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .animate-fadeUp { animation: fadeUp 0.4s both ease-out; }
        .skeleton {
          background: linear-gradient(90deg, #f3f4f6 25%, #e9eaeb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="min-h-full bg-[#f7f8fa] p-5 md:p-7">
        <div className="max-w-7xl mx-auto space-y-6">

          <DashboardHeader
            fyList={fyList}
            selectedFY={selectedFY}
            setSelectedFY={setSelectedFY}
            fyLoading={fyLoading}
            totalAcres={totalAcres}
            onRefresh={handleRefresh}
          />
<StatCards fyList={fyList} selectedFY={selectedFY} />


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <AcresBreakdown />
            <CollectionSummary summary={summary} summaryLoading={summaryLoading} />
            <RecentDealers />
          </div>

          

		  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
  <AcresTrendChart />
  <DealerDistributionChart />
  <SubsidyVsBillsChart summary={summary} selectedFY={selectedFY} />
  <CollectionBarChart  summary={summary} selectedFY={selectedFY} />
</div>

<QuickActions />

          <div className="flex items-center justify-between pt-2 pb-4 animate-fadeUp">
            <p className="text-xs text-gray-300 font-semibold">
              Singhmar MIS · Agricultural Subsidy Management
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-300">
              <HiCheck className="w-3 h-3 text-emerald-400" />
              Data refreshes on upload
            </div>
          </div>

        </div>
      </div>
    </>
  );
}