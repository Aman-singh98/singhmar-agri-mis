export const FY_FILE_TYPES = [
   { key: "tds", label: "TDS FILE", endpoint: "/upload/tds", acceptedName: "TDS FILE.xlsx" },
   { key: "materialDispatch", label: "MATERIAL DISPATCH DETAILS", endpoint: "/upload/material_dispatch_details", acceptedName: "MATERIAL DISPATCH DETAILS.xlsx" },
];

export const NON_FY_FILE_TYPES = [
   { key: "subsidyRecord", label: "SUBSIDY FILE", endpoint: "/upload/subsidy", acceptedName: "SUBSIDY FILE.xlsx" },
   { key: "tallyBill", label: "TALLY BILL FILE", endpoint: "/tally-bill", acceptedName: "TALLY BILL FILE.xlsx" },
   { key: "mainNewSheet", label: "MAIN NEW SHEET FILE", endpoint: "/upload/mainfile", acceptedName: "MAIN NEW SHEET FILE.xlsx" },
   { key: "micada", label: "MICADA", endpoint: "/upload/micada", acceptedName: "MICADA.xlsx" },
   { key: "0MainFY", label: "0 MAIN FY SHEET", endpoint: "/upload/main-file", acceptedName: "0 MAIN FY SHEET.xlsx" },
   { key: "farmerShareDetails", label: "FARMER SHARE DETAILS", endpoint: "/upload/farmer-share-details", acceptedName: "FARMER SHARE DETAILS.xlsx" },
];

// All combined — used in places that still need a flat list
export const FILE_TYPES = [...FY_FILE_TYPES, ...NON_FY_FILE_TYPES];

export const ACCEPTED_EXTENSIONS = [".xlsx", ".xls", ".csv"];
export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

export const TALLY_INVENTORY_TYPE = {
   key: "tallyInventory",
   label: "TALLY DEALER INVENTORY FILE",
   endpoint: "/inventory",
   acceptedName: "TALLY DEALER INVENTRY FILE.xlsx",
};