// import { createBrowserRouter, Navigate } from "react-router-dom";
// import { ROUTES } from "../constants/routes";
// import Layout from "../layouts/Layout";
// import LoginPage from "./LoginPage";
// import DashboardPage from "./dashboard/Dashboard";
// import NotFoundPage from "../routes/NotFoundPage";
// import DataManager from "./dataManager";
// import DealerListPage from "./dealer/DealerListPage";
// import UploadPage from "./UploadPage";
// import DealerMasterPage from "./dealerMaster/index";
// import FinancialYearPage from "./FinancialYearPage";
// import ItemsRateManager from "./ItemsRateManager";
// import ShiftingEntrySection from "./ManualEntries/ShiftingEntries";
// import DealerResources from "./ManualEntries/DealerResources";
// import FarmersTab from "./dealerMaster/components/FarmersTab";
// import ReturnEntries from "./ManualEntries/ReturnEntries";
// import DealerItemRatesPage from "./DealerItemRatesPage";
// import InventoryManage from "./inventorymanage/InventoryManage";
// import MainFY from "./dataManager/mainfy";

// const adminChildRoutes = [
// 	{ index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
// 	{ path: ROUTES.DASHBOARD, element: <DashboardPage /> },
// 	{ path: ROUTES.DEALER_LIST, element: <DealerListPage /> },
// 	{ path: ROUTES.FINANCIAL_YEARS, element: <FinancialYearPage /> },
// 	{ path: ROUTES.UPLOAD, element: <UploadPage /> },
// 	{ path: ROUTES.DATA_MANAGER, element: <DataManager /> },
//     { path: ROUTES.MAIN_FY, element: <MainFY /> },
// 	{ path: ROUTES.DEALER_MASTER, element: <DealerMasterPage /> },
// 	{ path: ROUTES.FARMER_RECORD, element: <FarmersTab /> },
// 	{ path: ROUTES.MANUAL_ENTRY, element: <DealerResources /> },
// 	{ path: ROUTES.INVENTORY_MANAGE, element: <InventoryManage /> },
// 	{ path: ROUTES.ITEMS_LIST, element: <ItemsRateManager /> },
// 	{ path: ROUTES.SHIFTING_ENTRY, element: <ShiftingEntrySection /> },
// 	{ path: ROUTES.RETURN_ENTRY, element: <ReturnEntries /> },
// 	{ path: ROUTES.DEALER_ITEM_RATE, element: <DealerItemRatesPage /> }
// ];

// const rootRoutes = [
// 	{ path: ROUTES.ROOT, element: <Navigate to={ROUTES.LOGIN} replace /> },
// 	{ path: ROUTES.LOGIN, element: <LoginPage /> },
// 	{
// 		path: ROUTES.ADMIN,
// 		element: <Layout />,
// 		children: adminChildRoutes,
// 	},
// 	{ path: "*", element: <NotFoundPage /> },
// ];

// export const router = createBrowserRouter(rootRoutes);











import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import Layout from "../layouts/Layout";
import LoginPage from "./LoginPage";
import DashboardPage from "./dashboard/Dashboard";
import NotFoundPage from "../routes/NotFoundPage";
import DataManager from "./dataManager";
import DealerListPage from "./dealer/DealerListPage";
import UploadPage from "./UploadPage";
import DealerMasterPage from "./dealerMaster/index";
import FinancialYearPage from "./FinancialYearPage";
import ItemsRateManager from "./ItemsRateManager";
import ShiftingEntrySection from "./ManualEntries/ShiftingEntries";
import DealerResources from "./ManualEntries/DealerResources";
import FarmersTab from "./dealerMaster/components/FarmersTab";
import ReturnEntries from "./ManualEntries/ReturnEntries";
import DealerItemRatesPage from "./DealerItemRatesPage";
import InventoryManage from "./inventorymanage/InventoryManage";
import MainFY from "./dataManager/mainfy";
import UserManage from "./usermanage/UserManage";
import ProtectedRoute from "../components/ProtectedRoute";
import NewFile from "./newFile/NewFile";

// All three roles (superadmin / admin / employee) are allowed into the
// /super-admin route group for now. Tighten this later by passing
// allowedRoles={["superadmin"]} (etc.) to ProtectedRoute, or by splitting
// into separate route groups per role if/when that's needed.
const superAdminChildRoutes = [
	{ index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
	{ path: ROUTES.DASHBOARD, element: <DashboardPage /> },
		{ path: ROUTES.NEW_FILE, element: <NewFile /> },
	{ path: ROUTES.USER_MANAGE, element: <UserManage /> },
	{ path: ROUTES.DEALER_LIST, element: <DealerListPage /> },
	{ path: ROUTES.FINANCIAL_YEARS, element: <FinancialYearPage /> },
	{ path: ROUTES.UPLOAD, element: <UploadPage /> },
	{ path: ROUTES.DATA_MANAGER, element: <DataManager /> },
	{ path: ROUTES.MAIN_FY, element: <MainFY /> },
	{ path: ROUTES.DEALER_MASTER, element: <DealerMasterPage /> },
	{ path: ROUTES.FARMER_RECORD, element: <FarmersTab /> },
	{ path: ROUTES.MANUAL_ENTRY, element: <DealerResources /> },
	{ path: ROUTES.INVENTORY_MANAGE, element: <InventoryManage /> },
	{ path: ROUTES.ITEMS_LIST, element: <ItemsRateManager /> },
	{ path: ROUTES.SHIFTING_ENTRY, element: <ShiftingEntrySection /> },
	{ path: ROUTES.RETURN_ENTRY, element: <ReturnEntries /> },
	{ path: ROUTES.DEALER_ITEM_RATE, element: <DealerItemRatesPage /> }
];

const rootRoutes = [
	{ path: ROUTES.ROOT, element: <Navigate to={ROUTES.LOGIN} replace /> },
	{ path: ROUTES.LOGIN, element: <LoginPage /> },
	{
		element: <ProtectedRoute />, // any logged-in role can pass, for now
		children: [
			{
				path: ROUTES.SUPER_ADMIN,
				element: <Layout />,
				children: superAdminChildRoutes,
			},
		],
	},
	{ path: "*", element: <NotFoundPage /> },
];

export const router = createBrowserRouter(rootRoutes);