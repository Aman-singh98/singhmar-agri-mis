import MainFile from "../models/MainFile.js";
import Micada from "../models/Micada.js";

// ── MICADA Mismatch Fields ────────────────────────────────────────────────────
// type: "string" → trim + lowercase compare
// type: "number" → parseFloat → toFixed(4) precision compare
const COMPARE_FIELDS = [
  { mainKey: "name",           micadaKey: "farmerName",    type: "string" },
  { mainKey: "irrigationType", micadaKey: "programmeName", type: "string" },
  { mainKey: "areaInAcre",    micadaKey: "totalArea",     type: "number" },
];

function normalizeStr(val) {
  return String(val ?? "").trim().toLowerCase();
}

// 4.73 vs 4.7375 → 4.7300 vs 4.7375 → MISMATCH ✅
// 3    vs 2      → 3.0000 vs 2.0000 → MISMATCH ✅
// 2    vs 2.00   → 2.0000 vs 2.0000 → MATCH    ✅
// null vs 3      → null   vs 3.0000 → MISMATCH ✅ (null != number)
function normalizeNum(val) {
  const n = parseFloat(val);
  if (isNaN(n)) return null;
  return parseFloat(n.toFixed(4));
}

function fieldMismatch(doc, micadaRow, field) {
  if (field.type === "number") {
    const a = normalizeNum(doc[field.mainKey]);
    const b = normalizeNum(micadaRow[field.micadaKey]);
    // dono null hain → match (dono missing)
    // ek null, ek number → mismatch
    return a !== b;
  }
  return normalizeStr(doc[field.mainKey]) !== normalizeStr(micadaRow[field.micadaKey]);
}

// ── syncMismatchErrors ────────────────────────────────────────────────────────
/**
 * MainFile ke `error` field ko MICADA se compare karke set karta hai.
 *
 * Logic:
 *   - MICADA match mila + koi bhi field mismatch  → error = "Error"
 *   - MICADA match mila + sab fields match        → error = null
 *   - MICADA mein miNumber hai hi nahi            → error = null
 *
 * @param {string|string[]} miNumbers
 */
const syncMismatchErrors = async (miNumbers) => {
  if (!miNumbers) return;

  const ids = Array.isArray(miNumbers)
    ? miNumbers.filter(Boolean)
    : [miNumbers].filter(Boolean);

  if (ids.length === 0) return;

  // Latest MICADA record per appId
  const micadaDocs = await Micada.find({ appId: { $in: ids } }).lean();

  const micadaMap = {};
  for (const r of micadaDocs) {
    if (!micadaMap[r.appId] || r.createdAt > micadaMap[r.appId].createdAt) {
      micadaMap[r.appId] = r;
    }
  }

  const mainDocs = await MainFile.find({ miNumber: { $in: ids } }).lean();
  if (mainDocs.length === 0) return;

  const bulkOps = mainDocs.map((doc) => {
    const micadaRow = micadaMap[doc.miNumber];

    let errorVal = null;
    if (micadaRow) {
      const hasMismatch = COMPARE_FIELDS.some((f) => fieldMismatch(doc, micadaRow, f));
      if (hasMismatch) errorVal = "Error";
    }

    return {
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { error: errorVal } },
      },
    };
  });

  if (bulkOps.length) {
    await MainFile.bulkWrite(bulkOps, { ordered: false });
  }
};

// ── resyncAllMismatchErrors ───────────────────────────────────────────────────
/**
 * Saare MainFile records ka error field ek baar fresh recalculate karta hai.
 *
 * Use case:
 *   - Pehle upload ho chuke records jinpe syncMismatchErrors kabhi nahi chala
 *   - Logic change ke baad poora DB re-sync karna ho
 *
 * @param {string} [financialYear] - e.g. "2022-23" (optional)
 * @returns {{ updated: number, errors: number }}
 */
const resyncAllMismatchErrors = async (financialYear) => {
  const BATCH_SIZE = 500;

  const miFilter = { miNumber: { $ne: null } };
  if (financialYear) miFilter.financialYear = financialYear;

  const distinctMiNumbers = await MainFile.distinct("miNumber", miFilter);
  if (distinctMiNumbers.length === 0) return { updated: 0, errors: 0 };

  // Saare MICADA records ek saath fetch karo — latest per appId
  const micadaDocs = await Micada.find({
    appId: { $in: distinctMiNumbers },
  }).lean();

  const micadaMap = {};
  for (const r of micadaDocs) {
    if (!micadaMap[r.appId] || r.createdAt > micadaMap[r.appId].createdAt) {
      micadaMap[r.appId] = r;
    }
  }

  let totalUpdated = 0;
  let totalErrors  = 0;

  for (let offset = 0; offset < distinctMiNumbers.length; offset += BATCH_SIZE) {
    const batchIds = distinctMiNumbers.slice(offset, offset + BATCH_SIZE);

    const mainDocs = await MainFile.find(
      { miNumber: { $in: batchIds } },
      { _id: 1, miNumber: 1, name: 1, irrigationType: 1, areaInAcre: 1 }
    ).lean();

    if (mainDocs.length === 0) continue;

    const bulkOps = mainDocs.map((doc) => {
      const micadaRow = micadaMap[doc.miNumber];

      let errorVal = null;
      if (micadaRow) {
        const hasMismatch = COMPARE_FIELDS.some((f) => fieldMismatch(doc, micadaRow, f));
        if (hasMismatch) errorVal = "Error";
      }

      return {
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { error: errorVal } },
        },
      };
    });

    try {
      const result = await MainFile.bulkWrite(bulkOps, { ordered: false });
      totalUpdated += result.modifiedCount;
    } catch (err) {
      console.error(`resyncAllMismatchErrors batch error (offset ${offset}):`, err);
      totalErrors += batchIds.length;
    }
  }

  return { updated: totalUpdated, errors: totalErrors };
};

// ── syncApplicationStatus ─────────────────────────────────────────────────────
/**
 * MICADA ke shortStatus se MainFile ka applicationStatus sync karta hai.
 *
 * @param {string|string[]|object[]} input
 *   - string / string[]  → appId(s) — DB se last inserted record ka shortStatus lega
 *   - object[]           → parsed docs array from sheet — sheet ki last row ka shortStatus lega
 */
const syncApplicationStatus = async (input) => {
  if (!input) return;

  let statusMap = {};

  // ── CASE 1: docs array from sheet (upload flow) ───────────────────────────
  if (
    Array.isArray(input) &&
    input.length > 0 &&
    typeof input[0] === "object" &&
    input[0].appId !== undefined
  ) {
    for (const doc of input) {
      if (!doc.appId) continue;
      statusMap[doc.appId] = doc.shortStatus ?? null;
    }
  }

  // ── CASE 2: appId string(s) — MainFile create/update flow ────────────────
  else {
    const ids = Array.isArray(input)
      ? input.filter(Boolean)
      : [input].filter(Boolean);

    if (ids.length === 0) return;

    const micadaRecords = await Micada.find(
      { appId: { $in: ids } },
      { appId: 1, shortStatus: 1 }
    )
      .sort({ _id: -1 })
      .lean();

    for (const rec of micadaRecords) {
      if (rec.appId && !statusMap[rec.appId]) {
        statusMap[rec.appId] = rec.shortStatus ?? null;
      }
    }
  }

  if (Object.keys(statusMap).length === 0) return;

  const bulkOps = Object.entries(statusMap).map(([appId, shortStatus]) => ({
    updateMany: {
      filter: { miNumber: appId },
      update: { $set: { applicationStatus: shortStatus } },
    },
  }));

  await MainFile.bulkWrite(bulkOps, { ordered: false });
};

export { syncApplicationStatus, syncMismatchErrors, resyncAllMismatchErrors };