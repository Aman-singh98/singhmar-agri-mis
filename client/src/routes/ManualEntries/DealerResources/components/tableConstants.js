// // ── tableConstants.js ─────────────────────────────────────────────────────────
// // Central config for all RecordsTable instances.
// // Add new table types here without touching any component.

// /**
//  * Shared column definitions reused across paid-cash and incentives tables.
//  */
// export const SHARED_COLUMNS = [
//    { key: "date",             label: "Date",        format: "date"     },
//    { key: "dealerName",       label: "Dealer Name", format: "bold"     },
//    { key: "farmerDealerCode", label: "Dealer Code", format: "badge"    },
//    { key: "amount",           label: "Amount (₹)",  format: "currency" },
//    { key: "remarks",          label: "Remarks",     format: "plain"    },
// ];

// export const SHARED_EDIT_FIELDS = [
//    { key: "date",    label: "Date",       type: "date"   },
//    { key: "amount",  label: "Amount (₹)", type: "number" },
//    { key: "remarks", label: "Remarks",    type: "text"   },
// ];

// /**
//  * Column definitions for the Inventory table.
//  * Challan-level view — no amount column, no edit action.
//  */
// export const INVENTORY_COLUMNS = [
//    { key: "date", label: "Date", format: "date" },
//    { key: "challanNo", label: "Challan No.", format: "mono" },
//    { key: "farmerDealerCode", label: "Dealer Code", format: "badge" },
//    { key: "financialYear", label: "Financial Year", format: "plain" },
//    { key: "totalQty", label: "Total Qantity", format: "number" },
// ];




// export const PRODUCT_NAMES = {
//    "32mmLateralCl2MiniSprinklerMungipa": "32 MM Lateral CL-2 Mini Sprinkler (MUNGIPA)",
//    stickStandRod: "Stick Stand (Rod)",
//    miniSprinklerPlasticNozzleMungipa: "Mini Sprinkler Plastic Nozzle (MUNGIPA)",
//    tubeAssembly15Mtr: "Tube Assembly (1.5 Mtr)",
//    "32mmBallValveNeerShakti": "32 MM Ball Valve (NEER SHAKTI)",
//    "32mmEndPlug": "32 MM End Plug",
//    "32mmServiceSaddle75x32": "32 MM Service Saddle (75x32)",
//    "32mmMtaFta": "32 MM MTA/FTA",
//    "32mmJoiner": "32 MM Joiner",
//    "75mmHdpePipe6MtrDulyCoupledMungipa": "75 MM HDPE Pipe 6 Mtr Duly Coupled (MUNGIPA)",
//    "75mmSprinklerRubberRing": "75 MM Sprinkler Rubber Ring",
//    "75x4KgPvcPipe": "75 x 4 Kg PVC Pipe",
//    "16mmTakeOff": "16 MM Take Off",
//    "16mmJoiner": "16 MM Joiner",
//    "16mmEndCap": "16 MM End Cap",
//    "16mmGrometNeta": "16 MM Gromet Neta",
//    flashValve63mm75mm: "Flash Valve (63 MM & 75 MM)",
//    "75mmPvcElbow": "75 MM PVC Elbow",
//    "75mmPvcFtaMta": "75 MM PVC FTA/MTA",
//    "75mmPvcTee": "75 MM PVC Tee",
//    "75mmBallValveMs": "75 MM Ball Valve MS",
//    "16mmInLineLateral16x4x60NeerShakti": "16 MM IN Line Lateral (16x4x60) NEER SHAKTI",
//    pvcSolvent100ml: "PVC Solvent (100 ML)",
//    hydroCycloneFilterNeerShakti: "Hydro Cyclone Filter (NEER SHAKTI)",
//    screenFilterNeerShakti: "Screen Filter (NEER SHAKTI)",
//    ventury075Inches: "Ventury 0.75 Inches",
//    manifold25Inch: "Manifold 2.5 Inch",
//    "32mmLateralCl2MiniSprinklerAds": "32 MM Lateral CL-2 Mini Sprinkler (ADS)",
//    "32mmBendPpElbow": "32 MM Bend PP / Elbow",
//    miniSprinklerPlasticNozzleNeerShakti: "Mini Sprinkler Plastic Nozzle (NEER SHAKTI)",
//    miniSprinklerPlasticNozzleAds: "Mini Sprinkler Plastic Nozzle (ADS)",
//    "32mmBallValveMungipa": "32 MM Ball Valve (MUNGIPA)",
//    "63mmHdpe6MtrPipeDulyCoupledMungipa": "63 MM HDPE 6 Mtr Pipe Duly Coupled (MUNGIPA)",
//    "63mmSprinklerRubberRing": "63 MM Sprinkler Rubber Ring",
//    "63mmServiceSaddle63x32": "63 MM Service Saddle (63x32)",
//    "32mmBallValveAsmiPlain": "32 MM Ball Valve (ASMI) Plain",
//    "16mmLateralClass2IsiPlain": "16 MM Lateral Class 2 ISI (Plain)",
//    "63x4KgPvcPipe": "63 x 4 Kg PVC Pipe",
//    "63mmPvcElbow": "63 MM PVC Elbow",
//    "63mmPvcTee": "63 MM PVC Tee",
//    "63mmPvcFtaMta": "63 MM PVC FTA/MTA",
//    "63mmBallValveMs": "63 MM Ball Valve MS",
//    "63mmHdpePipeDulyCoupled6MtrNeerShakti": "63 MM HDPE Pipe Duly Coupled 6 MTR (NEER SHAKTI)",
//    "75mmSprinklerBendPlainWithoutClamp": "75 MM Sprinkler Bend Plain Without Clamp",
//    "75mmSprinklerTeeNeerShakti": "75 MM Sprinkler TEE (NEER SHAKTI)",
//    "75mmSprinklerEndCapNeerShakti": "75 MM Sprinkler End Cap (NEER SHAKTI)",
//    "32mmLateralCl2MiniNeerShakti": "32 MM Lateral CL-II for MINI (NEER SHAKTI)",
//    "32mmBallValveAds": "32 MM Ball Valve (ADS)",
//    "75mmHdpePipe6MtrDulyCoupledNeerShakti": "75 MM HDPE Pipe 6 MTR Duly Coupled (NEER SHAKTI)",
//    "75mmHdpePipe3MtrNeerShakti": "75 MM HDPE Pipe 3 Mtr (NEER SHAKTI)",
//    "16mmInLineLateral16x4x30NeerShakti": "16 MM IN Line Lateral 16x4x30 (NEER SHAKTI)",
//    "75mmConnectorTail": "75 MM Connector Tail",
//    "75mmConnectorCoupler": "75 MM Connector Coupler",
//    "16mmInLineLateral": "16 MM IN LINE LATERAL",
// };


// export const TABLE_CONFIGS = {
//    paidCash: {
//       endpoint: "/paid-cash",
//       icon: "💵",
//       label: "Paid Cash",
//       emptyTitle: "No paid cash records",
//       emptyDesc: "Paid cash entries will appear here once added.",
//    },
//    incentives: {
//       endpoint: "/incentives",
//       icon: "🎁",
//       label: "Incentives",
//       emptyTitle: "No incentive records",
//       emptyDesc: "Incentive entries will appear here once added.",
//    },
//    inventory: {
//       endpoint: "/inventory",
//       icon: "📦",
//       label: "Inventory (Stock items)",
//       deleteOnly: true,
//       columns: "inventory",
//       emptyTitle: "No inventory records",
//       emptyDesc: "Upload a Tally .xlsx file to import inventory entries.",
//    },
// };





// ── tableConstants.js ─────────────────────────────────────────────────────────
// Central config for all RecordsTable instances.
// Add new table types here without touching any component.

/**
 * Shared column definitions reused across paid-cash and incentives tables.
 */
export const SHARED_COLUMNS = [
   { key: "date",             label: "Date",        format: "date"     },
   { key: "dealerName",       label: "Dealer Name", format: "bold"     },
   { key: "farmerDealerCode", label: "Dealer Code", format: "badge"    },
   { key: "amount",           label: "Amount (₹)",  format: "currency" },
   { key: "remarks",          label: "Remarks",     format: "plain"    },
];

export const SHARED_EDIT_FIELDS = [
   { key: "date",    label: "Date",       type: "date"   },
   { key: "amount",  label: "Amount (₹)", type: "number" },
   { key: "remarks", label: "Remarks",    type: "text"   },
];

/**
 * Column definitions for the Inventory table.
 * Challan-level view — no amount column, no edit action.
 * totalQty is computed from the products object via the "totalQty" renderer.
 */
export const INVENTORY_COLUMNS = [
   { key: "date",             label: "Date",           format: "date"     },
   { key: "challanNo",        label: "Challan No.",    format: "mono"     },
   { key: "farmerDealerCode", label: "Dealer Code",    format: "badge"    },
   { key: "financialYear",    label: "Financial Year", format: "plain"    },
   { key: "products",         label: "Total Quantity", format: "totalQty" },
];




export const PRODUCT_NAMES = {
   "32mmLateralCl2MiniSprinklerMungipa": "32 MM Lateral CL-2 Mini Sprinkler (MUNGIPA)",
   stickStandRod: "Stick Stand (Rod)",
   miniSprinklerPlasticNozzleMungipa: "Mini Sprinkler Plastic Nozzle (MUNGIPA)",
   tubeAssembly15Mtr: "Tube Assembly (1.5 Mtr)",
   "32mmBallValveNeerShakti": "32 MM Ball Valve (NEER SHAKTI)",
   "32mmEndPlug": "32 MM End Plug",
   "32mmServiceSaddle75x32": "32 MM Service Saddle (75x32)",
   "32mmMtaFta": "32 MM MTA/FTA",
   "32mmJoiner": "32 MM Joiner",
   "75mmHdpePipe6MtrDulyCoupledMungipa": "75 MM HDPE Pipe 6 Mtr Duly Coupled (MUNGIPA)",
   "75mmSprinklerRubberRing": "75 MM Sprinkler Rubber Ring",
   "75x4KgPvcPipe": "75 x 4 Kg PVC Pipe",
   "16mmTakeOff": "16 MM Take Off",
   "16mmJoiner": "16 MM Joiner",
   "16mmEndCap": "16 MM End Cap",
   "16mmGrometNeta": "16 MM Gromet Neta",
   flashValve63mm75mm: "Flash Valve (63 MM & 75 MM)",
   "75mmPvcElbow": "75 MM PVC Elbow",
   "75mmPvcFtaMta": "75 MM PVC FTA/MTA",
   "75mmPvcTee": "75 MM PVC Tee",
   "75mmBallValveMs": "75 MM Ball Valve MS",
   "16mmInLineLateral16x4x60NeerShakti": "16 MM IN Line Lateral (16x4x60) NEER SHAKTI",
   pvcSolvent100ml: "PVC Solvent (100 ML)",
   hydroCycloneFilterNeerShakti: "Hydro Cyclone Filter (NEER SHAKTI)",
   screenFilterNeerShakti: "Screen Filter (NEER SHAKTI)",
   ventury075Inches: "Ventury 0.75 Inches",
   manifold25Inch: "Manifold 2.5 Inch",
   "32mmLateralCl2MiniSprinklerAds": "32 MM Lateral CL-2 Mini Sprinkler (ADS)",
   "32mmBendPpElbow": "32 MM Bend PP / Elbow",
   miniSprinklerPlasticNozzleNeerShakti: "Mini Sprinkler Plastic Nozzle (NEER SHAKTI)",
   miniSprinklerPlasticNozzleAds: "Mini Sprinkler Plastic Nozzle (ADS)",
   "32mmBallValveMungipa": "32 MM Ball Valve (MUNGIPA)",
   "63mmHdpe6MtrPipeDulyCoupledMungipa": "63 MM HDPE 6 Mtr Pipe Duly Coupled (MUNGIPA)",
   "63mmSprinklerRubberRing": "63 MM Sprinkler Rubber Ring",
   "63mmServiceSaddle63x32": "63 MM Service Saddle (63x32)",
   "32mmBallValveAsmiPlain": "32 MM Ball Valve (ASMI) Plain",
   "16mmLateralClass2IsiPlain": "16 MM Lateral Class 2 ISI (Plain)",
   "63x4KgPvcPipe": "63 x 4 Kg PVC Pipe",
   "63mmPvcElbow": "63 MM PVC Elbow",
   "63mmPvcTee": "63 MM PVC Tee",
   "63mmPvcFtaMta": "63 MM PVC FTA/MTA",
   "63mmBallValveMs": "63 MM Ball Valve MS",
   "63mmHdpePipeDulyCoupled6MtrNeerShakti": "63 MM HDPE Pipe Duly Coupled 6 MTR (NEER SHAKTI)",
   "75mmSprinklerBendPlainWithoutClamp": "75 MM Sprinkler Bend Plain Without Clamp",
   "75mmSprinklerTeeNeerShakti": "75 MM Sprinkler TEE (NEER SHAKTI)",
   "75mmSprinklerEndCapNeerShakti": "75 MM Sprinkler End Cap (NEER SHAKTI)",
   "32mmLateralCl2MiniNeerShakti": "32 MM Lateral CL-II for MINI (NEER SHAKTI)",
   "32mmBallValveAds": "32 MM Ball Valve (ADS)",
   "75mmHdpePipe6MtrDulyCoupledNeerShakti": "75 MM HDPE Pipe 6 MTR Duly Coupled (NEER SHAKTI)",
   "75mmHdpePipe3MtrNeerShakti": "75 MM HDPE Pipe 3 Mtr (NEER SHAKTI)",
   "16mmInLineLateral16x4x30NeerShakti": "16 MM IN Line Lateral 16x4x30 (NEER SHAKTI)",
   "75mmConnectorTail": "75 MM Connector Tail",
   "75mmConnectorCoupler": "75 MM Connector Coupler",
   "16mmInLineLateral": "16 MM IN LINE LATERAL",
};


export const TABLE_CONFIGS = {
   paidCash: {
      endpoint: "/paid-cash",
      icon: "💵",
      label: "Paid Cash",
      emptyTitle: "No paid cash records",
      emptyDesc: "Paid cash entries will appear here once added.",
   },
   incentives: {
      endpoint: "/incentives",
      icon: "🎁",
      label: "Incentives",
      emptyTitle: "No incentive records",
      emptyDesc: "Incentive entries will appear here once added.",
   },
   inventory: {
      endpoint: "/inventory",
      icon: "📦",
      label: "Inventory (Stock items)",
      deleteOnly: true,
      columns: "inventory",
      emptyTitle: "No inventory records",
      emptyDesc: "Upload a Tally .xlsx file to import inventory entries.",
   },
};