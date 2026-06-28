import {
	HiReply,
	HiCog,
	HiChartPie,
	HiViewGrid,          // Dashboard Overview
	HiUsers,             // User Management
	HiIdentification,    // User Manage
	HiDocumentAdd,       // New File
	HiCloudUpload,       // Upload Data
	HiDatabase,          // Data Manager
	HiCalendar,          // Main FY
	HiLibrary,           // Dealer Master
	HiUserCircle,        // Farmer Record
	HiArchive,           // Inventory Manage
	HiCash,              // Cash & Incentives
	HiSwitchHorizontal,  // Shifting Entries
	HiShieldCheck,       // Dealers (Settings)
	HiTag,               // Dealer Item Rate
	HiClipboardList,     // Financial Years
	HiCurrencyRupee,     // Items Rate
} from "react-icons/hi";
import { FULL_PATHS } from "./routes";

const SUPER_ADMIN_MENU = [
	{
		name: "Dashboard",
		icon: HiChartPie,
		subMenu: [
			{ name: "Overview", path: FULL_PATHS.DASHBOARD, icon: HiViewGrid },
		],
	},
	{
		name: "User Management",
		icon: HiUsers,
		subMenu: [
			{ name: "User Manage", path: FULL_PATHS.USER_MANAGE, icon: HiIdentification },
		],
	},
	{ name: "New File",      icon: HiDocumentAdd,       path: FULL_PATHS.NEW_FILE },
	{ name: "Upload Data",   icon: HiCloudUpload,        path: FULL_PATHS.UPLOAD },
	{ name: "Data Manager",  icon: HiDatabase,           path: FULL_PATHS.MANAGER },
	{ name: "Main FY",       icon: HiCalendar,           path: FULL_PATHS.MAIN_FY },
	{ name: "Dealer Master", icon: HiLibrary,            path: FULL_PATHS.DEALER_MASTER },
	{ name: "Farmer Record", icon: HiUserCircle,         path: FULL_PATHS.FARMER_RECORD },
	{ name: "Inventory Manage", icon: HiArchive,         path: FULL_PATHS.INVENTORY_MANAGE },
	{
		name: "Manual Entries",
		icon: HiClipboardList,
		subMenu: [
			{ name: "Cash & Incentives",  path: FULL_PATHS.MANUAL_ENTRY,   icon: HiCash },
			{ name: "Shifting Entries",   path: FULL_PATHS.SHIFTING_ENTRY, icon: HiSwitchHorizontal },
			{ name: "Return Entries",     path: FULL_PATHS.RETURN_ENTRY,   icon: HiReply },
		],
	},
	{
		name: "Settings",
		icon: HiCog,
		subMenu: [
			{ name: "Dealers",           path: FULL_PATHS.DEALER_LIST,      icon: HiShieldCheck },
			{ name: "Dealer item rate",  path: FULL_PATHS.DEALER_ITEM_RATE, icon: HiTag },
			{ name: "Financial Years",   path: FULL_PATHS.FINANCIAL_YEARS,  icon: HiCalendar },
			{ name: "Items rate",        path: FULL_PATHS.ITEMS_LIST,        icon: HiCurrencyRupee },
		],
	},
];

// All three roles currently see the same menu. When access needs to differ
// per role, filter SUPER_ADMIN_MENU (and its subMenu arrays) based on `user.role`
// before returning, instead of returning the same array for every key.
export function sidebarMenu(user) {
	return {
		superadmin: SUPER_ADMIN_MENU,
		admin:      SUPER_ADMIN_MENU,
		employee:   SUPER_ADMIN_MENU,
	};
}