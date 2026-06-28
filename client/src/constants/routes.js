export const ROUTES = {
	ROOT: "/",
	LOGIN: "/login",
	SUPER_ADMIN: "/super-admin",
	DASHBOARD: "dashboard",
	DEALER_LIST: "settings/dealers",
	FINANCIAL_YEARS: "settings/financial-years",
	UPLOAD: "upload",
	DEALER_ACCOUNT: "dealer/:dealerCode/:financialYear",
	SUPER_ADMIN_HOME: "/super-admin",
	DATA_MANAGER: "manager",
	DEALER_MASTER: "dealer-master",
	FARMER_RECORD: "farmer-record",
	MANUAL_ENTRY: "dealer-resources",
	INVENTORY_MANAGE: "inventory-manage",
	ITEMS_LIST: 'items-rate',
	SHIFTING_ENTRY: 'shifting-entry',
	RETURN_ENTRY: 'settings/return-entry',
	DEALER_ITEM_RATE: 'settings/dealer-rate',
	MAIN_FY: 'mainfy',
	USER_MANAGE: 'user/manage',
	NEW_FILE:'newfile'
};

export const buildAdminPath = (segment) => `${ROUTES.SUPER_ADMIN}/${segment}`;

export const buildDealerAccountPath = (farmerDealerCode, financialYear) =>
	`${ROUTES.SUPER_ADMIN}/dealer/${encodeURIComponent(farmerDealerCode)}/${financialYear}`;

export const FULL_PATHS = {
	DASHBOARD: buildAdminPath(ROUTES.DASHBOARD),
	DEALER_LIST: buildAdminPath(ROUTES.DEALER_LIST),
	FINANCIAL_YEARS: buildAdminPath(ROUTES.FINANCIAL_YEARS),
	UPLOAD: buildAdminPath(ROUTES.UPLOAD),
	MANAGER: buildAdminPath(ROUTES.DATA_MANAGER),
	DEALER_MASTER: buildAdminPath(ROUTES.DEALER_MASTER),
	FARMER_RECORD: buildAdminPath(ROUTES.FARMER_RECORD),
	MANUAL_ENTRY: buildAdminPath(ROUTES.MANUAL_ENTRY),
	INVENTORY_MANAGE: buildAdminPath(ROUTES.INVENTORY_MANAGE),
	ITEMS_LIST: buildAdminPath(ROUTES.ITEMS_LIST),
	SHIFTING_ENTRY: buildAdminPath(ROUTES.SHIFTING_ENTRY),
	RETURN_ENTRY: buildAdminPath(ROUTES.RETURN_ENTRY),
	DEALER_ITEM_RATE: buildAdminPath(ROUTES.DEALER_ITEM_RATE),
	MAIN_FY: buildAdminPath(ROUTES.MAIN_FY),
	USER_MANAGE: buildAdminPath(ROUTES.USER_MANAGE),
		NEW_FILE: buildAdminPath(ROUTES.NEW_FILE)

};