/**
 * ItemRates.js
 *
 * Shared constants used across the hisab calculation engine.
 *
 * NOTE: Item rates are now fetched live from the ItemRate model in MongoDB.
 *       getRate() has been removed. Use Models.ItemRate in hisabCalculator.js.
 */

// ── HDPE pipe inventory product keys ─────────────────────────────────────────
const HDPE_ITEM_KEYS = [
   "63MmHdpe6MtrPipeDulyCoupledMungipa",
   "63MmHdpePipe6MtrNeerShakti",
   "63MmHdpePipeDulyCoupled6MtrNeerShakti",
   "75MmHdpePipe6MtrNeerShakti",
   "75MmHdpePipe6MtrDulyCoupledAds",
   "75MmHdpePipe6MtrDulyCoupledMungipa",
   "75MmHdpePipe6MtrDulyCoupledNeerShakti",
   "90MmHdpePipe6MtrDulyCoupledNeerShakti",
];

// ── 32MM lateral inventory product keys ──────────────────────────────────────
const LATERAL32_ITEM_KEYS = [
   "32MmLateralClass2ForMiniSprinklerMungipa",
   "32MmLateralClIiAOneKissan",
   "32MmLateralClIiForMiniNeerShakti",
   "32MmLateralClIiForMiniSprinklerAds",
];

// ── Fittings: valves, tees, joiners, elbows, end caps, saddles ───────────────
const FITTINGS_ITEM_KEYS = [
   "12MmEndCap",
   "12MmLateralPlain",
   "16MmBallValve",
   "16MmEndCap",
   "16MmGrometNeta",
   "16MmJoiner",
   "16MmTakeOff",
   "16MmTee",
   "16x12x16MmTee",
   "32MmBallValveAds",
   "32MmBallValveAsmiPlain",
   "32MmBallValveMungipa",
   "32MmBallValveNeerShakti",
   "32MmBendPpElbow",
   "32MmEndCap",
   "32MmEndPlug",
   "32MmHexa",
   "32MmJoiner",
   "32MmMtafta",
   "32MmServiceSaddle75x32",
   "32MmTee",
   "63MmBallValveMs",
   "63MmPvcElbow",
   "63MmPvcFtamta",
   "63MmPvcTee",
   "63MmServiceSaddle63x32",
   "75MmBallValveMs",
   "75MmPvcElbow",
   "75MmPvcFtamta",
   "75MmPvcTee",
   "75MmSprinklerAdopterAds",
   "75MmSprinklerAdopterMungipa",
   "75MmSprinklerAdopterNeerShakti",
   "75x63MmPvcTee",
   "90MmServiceSaddle90x32",
   "pvcReducer75x63",
   "pvcSolvent100Ml",
   "75MmConnectorTail",
   "75MmConnectorCoupler",
];

// ── Sprinkler parts: bends, tees, PCNs, end caps, rubber rings ───────────────
const SPRINKLER_ITEM_KEYS = [
   "63MmHdpeSprinklerBend",
   "63MmSprinklerEndCapMungipa",
   "63MmSprinklerRubberRing",
   "63MmSprinklerTee",
   "75MmHdpeSprinklerPcn",
   "75MmSprinklerBendAds",
   "75MmSprinklerBendMungipa",
   "75MmSprinklerBendNeerShakti",
   "75MmSprinklerBendPlainWithoutClamp",
   "75MmSprinklerEndCapAds",
   "75MmSprinklerEndCapMungipa",
   "75MmSprinklerEndCapNeerShakti",
   "75MmSprinklerPcnAds",
   "75MmSprinklerPcnNeerShakti",
   "75MmSprinklerRubberRing",
   "75MmSprinklerTeeAds",
   "75MmSprinklerTeeMungipa",
   "75MmSprinklerTeeNeerShakti",
   "90MmHdpeSprinklerPcnNeerShakti",
   "90MmSprinklerBend",
   "90MmSprinklerEndCap",
   "90MmSprinklerEndCapNeerShakti",
   "90MmSprinklerRubberRing",
   "90MmSprinklerTee",
   "sprinklerNozzle34NeerShakti",
   "sprinklerNozzle34Mungipa",
   "stickStandRod",
   "tubeAssembly15Mtr",
];

// ── Aluminium parts: pipes, bends, clamps, battens ───────────────────────────
const ALUMINIUM_ITEM_KEYS = [
   "75MmAlmPipe3Mtr",
   "75MmAluminiumBend",
   "75MmAluminiumClampPcs",
   "75MmAluminiumEndCap",
   "75MmAluminiumFootBattenPcs",
   "75MmAluminiumPipemlc6Mtr",
   "75MmAluminiumPipeslc6Mtr",
   "75MmClampEpcGiPcs",
   "aluminiumRivet",
];

// ── PVC pipes ─────────────────────────────────────────────────────────────────
const PVC_PIPE_ITEM_KEYS = [
   "63X4KgPvcPipe",
   "75X4KgPvcPipe",
];

// ── Inline laterals (12MM / 16MM) ─────────────────────────────────────────────
const INLINE_LATERAL_ITEM_KEYS = [
   "16MmInLineLateral",
   "16MmInLineLateral16x2x30NeerShakti",
   "16MmInLineLateral16x4x60Mungipa",
   "16MmInLineLateral16x4x60NeerShakti",
   "16MmInLineLateral16x4x30NeerShakti",
   "16MmLateral16x4x40NeerShakti",
   "16MmLateralClass2IsiPlain",
];

// ── Filters ───────────────────────────────────────────────────────────────────
const FILTER_ITEM_KEYS = [
   "63MmSandFilter",
   "sandFilter",
   "screenFilterNeerShakti",
   "hydroCycloneFilterMungipa",
   "hydroCycloneFilterNeerShakti",
];

// ── Miscellaneous ─────────────────────────────────────────────────────────────
const MISC_ITEM_KEYS = [
   "airReleaseValve1",
   "drippers8Lph",
   "fertilizerTank",
   "flashValve63Mm75Mm",
   "giRiserPipe34",
   "manifold25",
   "miniSprinklerPlasticNozzleAds",
   "miniSprinklerPlasticNozzleMungipa",
   "miniSprinklerPlasticNozzleNeerShakti",
   "pressureGauze25",
   "ventury075Inches",
   "ventury263Mm",
];

// ── Map: inventory product key → exact itemName as stored in ItemRate model ──
const KEY_TO_ITEM_NAME = {
   // 12 MM
   "12MmEndCap": "12 MM End Cap",
   "12MmLateralPlain": "12 MM Lateral Plain",
   // 16 MM
   "16MmBallValve": "16 MM Ball Valve",
   "16MmEndCap": "16 MM End Cap",
   "16MmGrometNeta": "16 MM Gromet Neta",
   "16MmInLineLateral": "16 MM IN LINE LATERAL",
   "16MmInLineLateral16x2x30NeerShakti": "16 MM IN Line Lateral (16x2x30) NEER SHAKTI",
   "16MmInLineLateral16x4x60Mungipa": "16 MM IN LINE Lateral (16x4x60) (MUNGIPA)",
   "16MmInLineLateral16x4x60NeerShakti": "16 MM IN Line Lateral (16x4x60) NEER SHAKTI",
   "16MmInLineLateral16x4x30NeerShakti": "16 MM IN LINE Lateral 16x4x30 NEER SHAKTI",
   "16MmJoiner": "16 MM Joiner",
   "16MmLateral16x4x40NeerShakti": "16 MM Lateral 16x4x40 (NEER SHAKTI)",
   "16MmLateralClass2IsiPlain": "16 MM Lateral Class 2 ISI (Plain)",
   "16MmTakeOff": "16 MM Take Off",
   "16MmTee": "16 MM TEE",
   "16x12x16MmTee": "16x12x16 MM TEE",
   // 32 MM
   "32MmBallValveAds": "32 MM Ball Valve (ADS)",
   "32MmBallValveAsmiPlain": "32 MM Ball Valve (ASMI) (Plain)",
   "32MmBallValveMungipa": "32 MM Ball Valve (MUNGIPA)",
   "32MmBallValveNeerShakti": "32 MM Ball Valve NEER SHAKTI",
   "32MmBendPpElbow": "32 MM Bend PP/ Elbow",
   "32MmEndCap": "32 MM End Cap",
   "32MmEndPlug": "32 MM End Plug",
   "32MmHexa": "32 MM Hexa",
   "32MmJoiner": "32 MM Joiner",
   "32MmLateralClass2ForMiniSprinklerMungipa": "32 MM LATERAL CLASS-2 FOR MINI SPRINKLER (MUNGIPA)",
   "32MmLateralClIiAOneKissan": "32 MM Lateral CL-II (A ONE KISSAN)",
   "32MmLateralClIiForMiniNeerShakti": "32 MM Lateral CL-II for MINI (NEER SHAKTI)",
   "32MmLateralClIiForMiniSprinklerAds": "32 MM Lateral CL-II for MINI Sprinkler (ADS)",
   "32MmMtafta": "32 MM MTA/FTA",
   "32MmServiceSaddle75x32": "32 MM Service Saddle (75x32)",
   "32MmTee": "32 MM TEE",
   // 63 MM
   "63MmBallValveMs": "63 MM Ball Valve MS",
   "63MmHdpe6MtrPipeDulyCoupledMungipa": "63 MM HDPE 6 Mtr Pipe Duly Coupled (MUNGIPA)",
   "63MmHdpePipe": "63 MM HDPE Pipe",
   "63MmHdpePipe6MtrNeerShakti": "63 MM HDPE Pipe 6 MTR (NEER SHAKTI)",
   "63MmHdpePipeDulyCoupled6MtrNeerShakti": "63 MM HDPE Pipe Duly Coupled 6 MTR (NEER SHAKTI)",
   "63MmHdpeSprinklerBend": "63 MM HDPE Sprinkler Bend",
   "63MmPvcElbow": "63 MM PVC Elbow",
   "63MmPvcFtamta": "63 MM PVC FTA/MTA",
   "63MmPvcTee": "63 MM PVC TEE",
   "63MmSandFilter": "63 MM Sand Filter",
   "63MmServiceSaddle63x32": "63 MM Service Saddle 63x32",
   "63MmSprinklerEndCapMungipa": "63 MM Sprinkler End Cap (MUNGIPA)",
   "63MmSprinklerRubberRing": "63 MM Sprinkler Rubber Ring",
   "63MmSprinklerTee": "63 MM Sprinkler Tee",
   "63X4KgPvcPipe": "63 x 4 Kg PVC Pipe",
   // 75 MM
   "75MmAlmPipe3Mtr": "75 MM ALM Pipe 3 MTR",
   "75MmAluminiumBend": "75 MM Aluminium BEND",
   "75MmAluminiumClampPcs": "75 MM Aluminium Clamp (Pcs)",
   "75MmAluminiumEndCap": "75 MM Aluminium End Cap",
   "75MmAluminiumFootBattenPcs": "75 MM Aluminium Foot Batten Pcs",
   "75MmAluminiumPipemlc6Mtr": "75 MM Aluminium Pipe/MLC 6 Mtr",
   "75MmAluminiumPipeslc6Mtr": "75 MM Aluminium Pipe/SLC 6 Mtr",
   "75MmBallValveMs": "75 MM Ball Valve MS",
   "75MmClampEpcGiPcs": "75 MM Clamp EPC (GI) Pcs",
   "75MmHdpePipe": "75 MM HDPE Pipe",
   "75MmHdpePipe3MtrAds": "75 MM HDPE Pipe 3 Mtr (ADS)",
   "75MmHdpePipe3MtrMungipa": "75 MM HDPE Pipe 3 Mtr (MUNGIPA)",
   "75MmHdpePipe3MtrNeerShakti": "75 MM HDPE Pipe 3 Mtr (NEER SHAKTI)",
   "75MmHdpePipe6MtrNeerShakti": "75 MM HDPE Pipe 6 MTR (NEER SHAKTI)",
   "75MmHdpePipe6MtrDulyCoupledAds": "75 MM HDPE Pipe 6 Mtr Duly Coupled (ADS)",
   "75MmHdpePipe6MtrDulyCoupledMungipa": "75 MM HDPE Pipe 6 Mtr Duly Coupled (MUNGIPA)",
   "75MmHdpePipe6MtrDulyCoupledNeerShakti": "75 MM HDPE Pipe 6 MTR Duly Coupled (NEER SHAKTI)",
   "75MmHdpeSprinklerPcn": "75 MM HDPE Sprinkler PCN",
   "75MmPvcElbow": "75 MM PVC Elbow",
   "75MmPvcFtamta": "75 MM PVC FTA/MTA",
   "75MmPvcTee": "75 MM PVC Tee",
   "75MmSprinklerAdopterAds": "75 MM Sprinkler Adopter (ADS)",
   "75MmSprinklerAdopterMungipa": "75 MM Sprinkler Adopter (MUNGIPA)",
   "75MmSprinklerAdopterNeerShakti": "75 MM Sprinkler Adopter (NEER SHAKTI)",
   "75MmSprinklerBendAds": "75 MM Sprinkler Bend (ADS)",
   "75MmSprinklerBendMungipa": "75 MM Sprinkler Bend (MUNGIPA)",
   "75MmSprinklerBendNeerShakti": "75 MM Sprinkler Bend (NEER SHAKTI)",
   "75MmSprinklerBendPlainWithoutClamp": "75 MM Sprinkler Bend PLAIN Without Clamp",
   "75MmSprinklerEndCapAds": "75 MM Sprinkler End Cap (ADS)",
   "75MmSprinklerEndCapMungipa": "75 MM Sprinkler End Cap (MUNGIPA)",
   "75MmSprinklerEndCapNeerShakti": "75 MM Sprinkler End Cap (NEER SHAKTI)",
   "75MmSprinklerPcnAds": "75 MM Sprinkler PCN (ADS)",
   "75MmSprinklerPcnNeerShakti": "75 MM Sprinkler PCN (NEER SHAKTI)",
   "75MmSprinklerRubberRing": "75 MM Sprinkler Rubber Ring",
   "75MmSprinklerTeeAds": "75 MM Sprinkler TEE (ADS)",
   "75MmSprinklerTeeMungipa": "75 MM Sprinkler TEE (MUNGIPA)",
   "75MmSprinklerTeeNeerShakti": "75 MM Sprinkler TEE (NEER SHAKTI)",
   "75X4KgPvcPipe": "75 x 4 Kg PVC Pipe",
   "75x63MmPvcTee": "75x63 MM PVC TEE",
   // 90 MM
   "90MmHdpePipe": "90 MM HDPE Pipe",
   "90MmHdpePipe3MtrNeerShakti": "90 MM HDPE Pipe 3 Mtr (NEER SHAKTI)",
   "90MmHdpePipe6MtrDulyCoupledNeerShakti": "90 MM HDPE Pipe 6 Mtr Duly Coupled (NEER SHAKTI)",
   "90MmHdpeSprinklerPcnNeerShakti": "90 MM HDPE Sprinkler PCN (NEER SHAKTI)",
   "90MmServiceSaddle90x32": "90 MM Service Saddle 90x32",
   "90MmSprinklerBend": "90 MM Sprinkler Bend",
   "90MmSprinklerEndCap": "90 MM Sprinkler End Cap",
   "90MmSprinklerEndCapNeerShakti": "90 MM Sprinkler End Cap (NEER SHAKTI)",
   "90MmSprinklerRubberRing": "90 MM Sprinkler Rubber Ring",
   "90MmSprinklerTee": "90 MM Sprinkler Tee",
   // Misc
   "airReleaseValve1": "Air Release Valve 1''",
   "aluminiumRivet": "Aluminium Rivet",
   "drippers8Lph": "Drippers 8 LPH",
   "fertilizerTank": "Fertilizer Tank",
   "flashValve63Mm75Mm": "Flash Valve (63 MM & 75 MM)",
   "giRiserPipe34": "GI RISER PIPE 3/4\"",
   "hydroCycloneFilterMungipa": "Hydro Cyclone Filter MUNGIPA",
   "hydroCycloneFilterNeerShakti": "Hydro Cyclone Filter NEER SHAKTI",
   "manifold25": "Manifold 2.5''",
   "miniSprinklerPlasticNozzleAds": "Mini Sprinkler (Plastic Nozzle) ADS",
   "miniSprinklerPlasticNozzleMungipa": "Mini Sprinkler (Plastic Nozzle) MUNGIPA",
   "miniSprinklerPlasticNozzleNeerShakti": "Mini Sprinkler (Plastic Nozzle) NEER SHAKTI",
   "pressureGauze25": "Pressure Gauze 2.5''",
   "pvcReducer75x63": "PVC Reducer (75x63)",
   "pvcSolvent100Ml": "PVC Solvent (100 ML)",
   "sandFilter": "Sand Filter",
   "screenFilterNeerShakti": "Screen Filter NEER SHAKTI",
   "sprinklerNozzle34NeerShakti": "Sprinkler Nozzle 3/4'' (NEER SHAKTI)",
   "sprinklerNozzle34Mungipa": "SPRINKLER NOZZLE 3/4\" (MUNGIPA)",
   "stickStandRod": "Stick Stand (Rod)",
   "tubeAssembly15Mtr": "Tube Assembly (1.5 Mtr)",
   "ventury075Inches": "Ventury 0.75 inches",
   "ventury263Mm": "Ventury 2'' 63 MM",
   // Aliase keys
   "75MmConnectorTail": "75 MM Connector TAIL",
   "75MmConnectorCoupler": "75 MM Connector Coupler"
};

export {
  HDPE_ITEM_KEYS,
  LATERAL32_ITEM_KEYS,
  FITTINGS_ITEM_KEYS,
  SPRINKLER_ITEM_KEYS,
  ALUMINIUM_ITEM_KEYS,
  PVC_PIPE_ITEM_KEYS,
  INLINE_LATERAL_ITEM_KEYS,
  FILTER_ITEM_KEYS,
  MISC_ITEM_KEYS,
  KEY_TO_ITEM_NAME,
};