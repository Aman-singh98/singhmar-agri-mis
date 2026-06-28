import { useNavigate } from "react-router-dom";
import {
  HiUpload, HiDocumentReport, HiDatabase, HiPlusCircle,
  HiCurrencyRupee, HiCollection, HiCash, HiCog,
} from "react-icons/hi";
import { FULL_PATHS } from "../../../constants/routes";
import SectionHeader from "./ui/SectionHeader";
import QuickActionBtn from "./ui/QuickActionBtn";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: "Upload Data",      description: "Import Excel / CSV files",         icon: HiUpload,         onClick: () => navigate(FULL_PATHS.UPLOAD),                  delay: 0,   badge: "New", accent: "emerald" },
    { label: "Dealer Master",    description: "Full dealer master report",         icon: HiDocumentReport, onClick: () => navigate(FULL_PATHS.DEALER_MASTER),            delay: 40,  accent: "blue"    },
    { label: "Data Manager",     description: "Manage & delete uploaded data",     icon: HiDatabase,       onClick: () => navigate(FULL_PATHS.MANAGER),                  delay: 80,  accent: "amber"   },
    { label: "Add Dealer",       description: "Register a new dealer",             icon: HiPlusCircle,     onClick: () => navigate(FULL_PATHS.DEALER_LIST),              delay: 120, accent: "emerald" },
    { label: "Hisab Calculator", description: "Compute dealer hisab & export PDF", icon: HiCurrencyRupee,  onClick: () => navigate(FULL_PATHS.HISAB ?? "/hisab"),        delay: 160, accent: "violet"  },
    { label: "Financial Years",  description: "Configure active years",            icon: HiCollection,     onClick: () => navigate(FULL_PATHS.FINANCIAL_YEARS),          delay: 200, accent: "rose"    },
    { label: "Paid Cash",        description: "Manual cash entry records",         icon: HiCash,           onClick: () => navigate(FULL_PATHS.PAID_CASH ?? "/paid-cash"),delay: 240, accent: "amber"   },
    { label: "Settings",         description: "App configuration",                 icon: HiCog,            onClick: () => navigate(FULL_PATHS.FINANCIAL_YEARS),          delay: 280, accent: "blue"    },
  ];

  return (
    <div>
      <SectionHeader title="Quick Actions" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {actions.map(a => <QuickActionBtn key={a.label} {...a} />)}
      </div>
    </div>
  );
}