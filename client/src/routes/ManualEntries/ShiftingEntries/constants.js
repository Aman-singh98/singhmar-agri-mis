// ─────────────────────────────────────────────────────────────────────────────
// ShiftingEntry — constants & pure helpers
// ─────────────────────────────────────────────────────────────────────────────

// ── Item definitions ──────────────────────────────────────────────────────────

export const HDPE_ITEMS = [
   { key: "63MmHdpe6MtrPipeDulyCoupledMungipa",     label: "63 MM HDPE 6 Mtr Duly Coupled (MUNGIPA)" },
   { key: "63MmHdpePipe6MtrNeerShakti",             label: "63 MM HDPE Pipe 6 MTR (NEER SHAKTI)" },
   { key: "63MmHdpePipeDulyCoupled6MtrNeerShakti",  label: "63 MM HDPE Duly Coupled 6 MTR (NEER SHAKTI)" },
   { key: "75MmHdpePipe6MtrNeerShakti",             label: "75 MM HDPE Pipe 6 MTR (NEER SHAKTI)" },
   { key: "75MmHdpePipe6MtrDulyCoupledAds",         label: "75 MM HDPE 6 Mtr Duly Coupled (ADS)" },
   { key: "75MmHdpePipe6MtrDulyCoupledMungipa",     label: "75 MM HDPE 6 Mtr Duly Coupled (MUNGIPA)" },
   { key: "75MmHdpePipe6MtrDulyCoupledNeerShakti",  label: "75 MM HDPE 6 MTR Duly Coupled (NEER SHAKTI)" },
   { key: "90MmHdpePipe6MtrDulyCoupledNeerShakti",  label: "90 MM HDPE 6 Mtr Duly Coupled (NEER SHAKTI)" },
];

export const LATERAL32_ITEMS = [
   { key: "32MmLateralClass2ForMiniSprinklerMungipa", label: "32 MM Lateral CLASS-2 Mini Sprinkler (MUNGIPA)" },
   { key: "32MmLateralClIiAOneKissan",               label: "32 MM Lateral CL-II (A ONE KISSAN)" },
   { key: "32MmLateralClIiForMiniNeerShakti",        label: "32 MM Lateral CL-II Mini (NEER SHAKTI)" },
   { key: "32MmLateralClIiForMiniSprinklerAds",      label: "32 MM Lateral CL-II Mini Sprinkler (ADS)" },
];

export const FITTINGS_ITEMS = [
   { key: "12MmEndCap",                label: "12 MM End Cap" },
   { key: "12MmLateralPlain",          label: "12 MM Lateral Plain" },
   { key: "16MmBallValve",             label: "16 MM Ball Valve" },
   { key: "16MmEndCap",                label: "16 MM End Cap" },
   { key: "16MmGrometNeta",            label: "16 MM Gromet Neta" },
   { key: "16MmJoiner",                label: "16 MM Joiner" },
   { key: "16MmTakeOff",               label: "16 MM Take Off" },
   { key: "16MmTee",                   label: "16 MM TEE" },
   { key: "16x12x16MmTee",             label: "16x12x16 MM TEE" },
   { key: "32MmBallValveAds",          label: "32 MM Ball Valve (ADS)" },
   { key: "32MmBallValveAsmiPlain",    label: "32 MM Ball Valve (ASMI) Plain" },
   { key: "32MmBallValveMungipa",      label: "32 MM Ball Valve (MUNGIPA)" },
   { key: "32MmBallValveNeerShakti",   label: "32 MM Ball Valve (NEER SHAKTI)" },
   { key: "32MmBendPpElbow",           label: "32 MM Bend PP / Elbow" },
   { key: "32MmEndCap",                label: "32 MM End Cap" },
   { key: "32MmEndPlug",               label: "32 MM End Plug" },
   { key: "32MmHexa",                  label: "32 MM Hexa" },
   { key: "32MmJoiner",                label: "32 MM Joiner" },
   { key: "32MmMtafta",                label: "32 MM MTA / FTA" },
   { key: "32MmServiceSaddle75x32",    label: "32 MM Service Saddle (75x32)" },
   { key: "32MmTee",                   label: "32 MM TEE" },
   { key: "63MmBallValveMs",           label: "63 MM Ball Valve MS" },
   { key: "63MmPvcElbow",              label: "63 MM PVC Elbow" },
   { key: "63MmPvcFtamta",             label: "63 MM PVC FTA / MTA" },
   { key: "63MmPvcTee",                label: "63 MM PVC TEE" },
   { key: "63MmServiceSaddle63x32",    label: "63 MM Service Saddle 63x32" },
   { key: "75MmBallValveMs",           label: "75 MM Ball Valve MS" },
   { key: "75MmPvcElbow",              label: "75 MM PVC Elbow" },
   { key: "75MmPvcFtamta",             label: "75 MM PVC FTA / MTA" },
   { key: "75MmPvcTee",                label: "75 MM PVC Tee" },
   { key: "75MmSprinklerAdopterAds",      label: "75 MM Sprinkler Adopter (ADS)" },
   { key: "75MmSprinklerAdopterMungipa",  label: "75 MM Sprinkler Adopter (MUNGIPA)" },
   { key: "75MmSprinklerAdopterNeerShakti", label: "75 MM Sprinkler Adopter (NEER SHAKTI)" },
   { key: "75x63MmPvcTee",             label: "75x63 MM PVC TEE" },
   { key: "90MmServiceSaddle90x32",    label: "90 MM Service Saddle 90x32" },
   { key: "pvcReducer75x63",           label: "PVC Reducer (75x63)" },
   { key: "pvcSolvent100Ml",           label: "PVC Solvent (100 ML)" },
   { key: "75MmConnectorTail",         label: "75 MM Connector TAIL" },
   { key: "75MmConnectorCoupler",      label: "75 MM Connector Coupler" },
];

export const SPRINKLER_ITEMS = [
   { key: "63MmHdpeSprinklerBend",            label: "63 MM HDPE Sprinkler Bend" },
   { key: "63MmSprinklerEndCapMungipa",        label: "63 MM Sprinkler End Cap (MUNGIPA)" },
   { key: "63MmSprinklerRubberRing",           label: "63 MM Sprinkler Rubber Ring" },
   { key: "63MmSprinklerTee",                 label: "63 MM Sprinkler Tee" },
   { key: "75MmHdpeSprinklerPcn",             label: "75 MM HDPE Sprinkler PCN" },
   { key: "75MmSprinklerBendAds",             label: "75 MM Sprinkler Bend (ADS)" },
   { key: "75MmSprinklerBendMungipa",         label: "75 MM Sprinkler Bend (MUNGIPA)" },
   { key: "75MmSprinklerBendNeerShakti",      label: "75 MM Sprinkler Bend (NEER SHAKTI)" },
   { key: "75MmSprinklerBendPlainWithoutClamp", label: "75 MM Sprinkler Bend Plain (Without Clamp)" },
   { key: "75MmSprinklerEndCapAds",           label: "75 MM Sprinkler End Cap (ADS)" },
   { key: "75MmSprinklerEndCapMungipa",       label: "75 MM Sprinkler End Cap (MUNGIPA)" },
   { key: "75MmSprinklerEndCapNeerShakti",    label: "75 MM Sprinkler End Cap (NEER SHAKTI)" },
   { key: "75MmSprinklerPcnAds",             label: "75 MM Sprinkler PCN (ADS)" },
   { key: "75MmSprinklerPcnNeerShakti",      label: "75 MM Sprinkler PCN (NEER SHAKTI)" },
   { key: "75MmSprinklerRubberRing",         label: "75 MM Sprinkler Rubber Ring" },
   { key: "75MmSprinklerTeeAds",             label: "75 MM Sprinkler TEE (ADS)" },
   { key: "75MmSprinklerTeeMungipa",         label: "75 MM Sprinkler TEE (MUNGIPA)" },
   { key: "75MmSprinklerTeeNeerShakti",      label: "75 MM Sprinkler TEE (NEER SHAKTI)" },
   { key: "90MmHdpeSprinklerPcnNeerShakti",  label: "90 MM HDPE Sprinkler PCN (NEER SHAKTI)" },
   { key: "90MmSprinklerBend",               label: "90 MM Sprinkler Bend" },
   { key: "90MmSprinklerEndCap",             label: "90 MM Sprinkler End Cap" },
   { key: "90MmSprinklerEndCapNeerShakti",   label: "90 MM Sprinkler End Cap (NEER SHAKTI)" },
   { key: "90MmSprinklerRubberRing",         label: "90 MM Sprinkler Rubber Ring" },
   { key: "90MmSprinklerTee",               label: "90 MM Sprinkler Tee" },
   { key: "sprinklerNozzle34NeerShakti",     label: "Sprinkler Nozzle 3/4\" (NEER SHAKTI)" },
   { key: "sprinklerNozzle34Mungipa",        label: "Sprinkler Nozzle 3/4\" (MUNGIPA)" },
   { key: "stickStandRod",                   label: "Stick Stand (Rod)" },
   { key: "tubeAssembly15Mtr",               label: "Tube Assembly (1.5 Mtr)" },
];

export const ALUMINIUM_ITEMS = [
   { key: "75MmAlmPipe3Mtr",             label: "75 MM ALM Pipe 3 MTR" },
   { key: "75MmAluminiumBend",            label: "75 MM Aluminium Bend" },
   { key: "75MmAluminiumClampPcs",        label: "75 MM Aluminium Clamp (Pcs)" },
   { key: "75MmAluminiumEndCap",          label: "75 MM Aluminium End Cap" },
   { key: "75MmAluminiumFootBattenPcs",   label: "75 MM Aluminium Foot Batten (Pcs)" },
   { key: "75MmAluminiumPipemlc6Mtr",     label: "75 MM Aluminium Pipe MLC 6 Mtr" },
   { key: "75MmAluminiumPipeslc6Mtr",     label: "75 MM Aluminium Pipe SLC 6 Mtr" },
   { key: "75MmClampEpcGiPcs",            label: "75 MM Clamp EPC (GI) Pcs" },
   { key: "aluminiumRivet",               label: "Aluminium Rivet" },
];

export const PVC_PIPE_ITEMS = [
   { key: "63X4KgPvcPipe", label: "63 x 4 Kg PVC Pipe" },
   { key: "75X4KgPvcPipe", label: "75 x 4 Kg PVC Pipe" },
];

export const INLINE_LATERAL_ITEMS = [
   { key: "16MmInLineLateral",                    label: "16 MM IN LINE Lateral" },
   { key: "16MmInLineLateral16x2x30NeerShakti",   label: "16 MM IN Line Lateral (16x2x30) NEER SHAKTI" },
   { key: "16MmInLineLateral16x4x60Mungipa",      label: "16 MM IN LINE Lateral (16x4x60) MUNGIPA" },
   { key: "16MmInLineLateral16x4x60NeerShakti",   label: "16 MM IN Line Lateral (16x4x60) NEER SHAKTI" },
   { key: "16MmInLineLateral16x4x30NeerShakti",   label: "16 MM IN LINE Lateral 16x4x30 NEER SHAKTI" },
   { key: "16MmLateral16x4x40NeerShakti",         label: "16 MM Lateral 16x4x40 (NEER SHAKTI)" },
   { key: "16MmLateralClass2IsiPlain",            label: "16 MM Lateral Class 2 ISI (Plain)" },
];

export const FILTER_ITEMS = [
   { key: "63MmSandFilter",              label: "63 MM Sand Filter" },
   { key: "sandFilter",                  label: "Sand Filter" },
   { key: "screenFilterNeerShakti",      label: "Screen Filter (NEER SHAKTI)" },
   { key: "hydroCycloneFilterMungipa",   label: "Hydro Cyclone Filter (MUNGIPA)" },
   { key: "hydroCycloneFilterNeerShakti", label: "Hydro Cyclone Filter (NEER SHAKTI)" },
];

export const MISC_ITEMS = [
   { key: "airReleaseValve1",              label: "Air Release Valve 1\"" },
   { key: "drippers8Lph",                 label: "Drippers 8 LPH" },
   { key: "fertilizerTank",               label: "Fertilizer Tank" },
   { key: "flashValve63Mm75Mm",           label: "Flash Valve (63 MM & 75 MM)" },
   { key: "giRiserPipe34",                label: "GI Riser Pipe 3/4\"" },
   { key: "manifold25",                   label: "Manifold 2.5\"" },
   { key: "miniSprinklerPlasticNozzleAds",      label: "Mini Sprinkler Plastic Nozzle (ADS)" },
   { key: "miniSprinklerPlasticNozzleMungipa",  label: "Mini Sprinkler Plastic Nozzle (MUNGIPA)" },
   { key: "miniSprinklerPlasticNozzleNeerShakti", label: "Mini Sprinkler Plastic Nozzle (NEER SHAKTI)" },
   { key: "pressureGauze25",              label: "Pressure Gauze 2.5\"" },
   { key: "ventury075Inches",             label: "Ventury 0.75 Inches" },
   { key: "ventury263Mm",                 label: "Ventury 2\" 63 MM" },
];

// ── Category registry — single source of truth for form + modal ───────────────
// Each entry maps directly to its form state key and DB field name.
export const CATEGORY_CONFIG = [
   {
      key: "hdpe",
      label: "HDPE pipe items",
      subtitle: "6 Mtr pipes — enter shifted quantity",
      items: HDPE_ITEMS,
      accent: {
         title: "text-blue-700", border: "border-blue-100",
         header: "bg-blue-50/60", chevron: "text-blue-400",
         text: "text-blue-700", badge: "text-blue-500", value: "text-blue-600",
         summary: "text-blue-600", summaryBg: "bg-blue-50 border-blue-100",
      },
   },
   {
      key: "lateral32",
      label: "32 MM lateral items",
      subtitle: "CL-II laterals — enter shifted quantity",
      items: LATERAL32_ITEMS,
      accent: {
         title: "text-amber-700", border: "border-amber-100",
         header: "bg-amber-50/60", chevron: "text-amber-400",
         text: "text-amber-700", badge: "text-amber-500", value: "text-amber-600",
         summary: "text-amber-600", summaryBg: "bg-amber-50 border-amber-100",
      },
   },
   {
      key: "fittings",
      label: "Fittings",
      subtitle: "Valves, tees, joiners, elbows, saddles",
      items: FITTINGS_ITEMS,
      accent: {
         title: "text-violet-700", border: "border-violet-100",
         header: "bg-violet-50/60", chevron: "text-violet-400",
         text: "text-violet-700", badge: "text-violet-500", value: "text-violet-600",
         summary: "text-violet-600", summaryBg: "bg-violet-50 border-violet-100",
      },
   },
   {
      key: "sprinklerParts",
      label: "Sprinkler parts",
      subtitle: "Bends, tees, PCNs, end caps, rubber rings",
      items: SPRINKLER_ITEMS,
      accent: {
         title: "text-cyan-700", border: "border-cyan-100",
         header: "bg-cyan-50/60", chevron: "text-cyan-400",
         text: "text-cyan-700", badge: "text-cyan-500", value: "text-cyan-600",
         summary: "text-cyan-600", summaryBg: "bg-cyan-50 border-cyan-100",
      },
   },
   {
      key: "aluminiumParts",
      label: "Aluminium parts",
      subtitle: "Pipes, bends, clamps, battens",
      items: ALUMINIUM_ITEMS,
      accent: {
         title: "text-slate-700", border: "border-slate-200",
         header: "bg-slate-50/60", chevron: "text-slate-400",
         text: "text-slate-700", badge: "text-slate-500", value: "text-slate-600",
         summary: "text-slate-600", summaryBg: "bg-slate-50 border-slate-200",
      },
   },
   {
      key: "pvcPipes",
      label: "PVC pipes",
      subtitle: "63 x 4 Kg and 75 x 4 Kg PVC pipes",
      items: PVC_PIPE_ITEMS,
      accent: {
         title: "text-orange-700", border: "border-orange-100",
         header: "bg-orange-50/60", chevron: "text-orange-400",
         text: "text-orange-700", badge: "text-orange-500", value: "text-orange-600",
         summary: "text-orange-600", summaryBg: "bg-orange-50 border-orange-100",
      },
   },
   {
      key: "inlineLaterals",
      label: "Inline laterals",
      subtitle: "12 MM & 16 MM drip inline laterals",
      items: INLINE_LATERAL_ITEMS,
      accent: {
         title: "text-lime-700", border: "border-lime-100",
         header: "bg-lime-50/60", chevron: "text-lime-500",
         text: "text-lime-700", badge: "text-lime-500", value: "text-lime-600",
         summary: "text-lime-600", summaryBg: "bg-lime-50 border-lime-100",
      },
   },
   {
      key: "filters",
      label: "Filters",
      subtitle: "Sand, screen and hydro cyclone filters",
      items: FILTER_ITEMS,
      accent: {
         title: "text-teal-700", border: "border-teal-100",
         header: "bg-teal-50/60", chevron: "text-teal-400",
         text: "text-teal-700", badge: "text-teal-500", value: "text-teal-600",
         summary: "text-teal-600", summaryBg: "bg-teal-50 border-teal-100",
      },
   },
   {
      key: "misc",
      label: "Miscellaneous",
      subtitle: "Drippers, manifolds, valves, mini sprinklers",
      items: MISC_ITEMS,
      accent: {
         title: "text-rose-700", border: "border-rose-100",
         header: "bg-rose-50/60", chevron: "text-rose-400",
         text: "text-rose-700", badge: "text-rose-500", value: "text-rose-600",
         summary: "text-rose-600", summaryBg: "bg-rose-50 border-rose-100",
      },
   },
];

// ── Pagination & timing ───────────────────────────────────────────────────────

export const PAGE_SIZE = 8;
export const FLASH_SUCCESS_MS = 3500;
export const FLASH_ERROR_MS = 4000;

// ── Pure helpers ──────────────────────────────────────────────────────────────

/** Build a blank form object for all categories */
export function buildEmptyForm() {
   const categoryFields = Object.fromEntries(
      CATEGORY_CONFIG.map(cat => [
         cat.key,
         Object.fromEntries(cat.items.map(i => [i.key, ""]))
      ])
   );
   return { dealerName: "", dealerCode: "", financialYear: "", returnDate: "", ...categoryFields, remarks: "" };
}

/** Convert a string-valued object to numbers (empty → 0) */
export function toNumbers(obj) {
   return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, Number(v) || 0]));
}

/** Sum all numeric values in an object */
export function sumObj(obj) {
   return Object.values(obj).reduce((s, v) => s + (Number(v) || 0), 0);
}

/** Grand total across ALL categories for an entry */
export function entryGrandTotal(entry) {
   return CATEGORY_CONFIG.reduce((total, cat) => total + sumObj(entry?.[cat.key] || {}), 0);
}

// Keep these for backward compat (ShiftingEntryTable still uses them)
export function entryHdpeTotal(entry)  { return sumObj(entry?.hdpe      || {}); }
export function entryLat32Total(entry) { return sumObj(entry?.lateral32 || {}); }
