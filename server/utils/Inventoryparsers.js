import XLSX from 'xlsx';
import { KEY_TO_ITEM_NAME } from '../constant/ItemRates.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

function toNum(val) {
   const n = parseFloat(val);
   return isNaN(n) ? 0 : n;
}

function toNumOrNull(val) {
   const n = parseFloat(val);
   return isNaN(n) ? null : n;
}

function toStr(val) {
   if (val === null || val === undefined) return null;
   const s = String(val).trim();
   return s === '' || s === 'NaN' ? null : s;
}

function parseDate(value) {
   if (!value) return null;
   if (value instanceof Date) return isNaN(value) ? null : value;

   if (typeof value === 'number') {
      const d = XLSX.SSF.parse_date_code(value);
      if (d) return new Date(d.y, d.m - 1, d.d);
      return null;
   }

   const str = String(value).trim();

   if (str.includes('.')) {
      const parts = str.split('.');
      if (parts.length === 3) {
         let [d, m, y] = parts;
         if (y.length === 2) y = '20' + y;
         const date = new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
         return isNaN(date) ? null : date;
      }
   }

   if (str.includes('/')) {
      const parts = str.split('/');
      if (parts.length === 3) {
         let [d, m, y] = parts;
         if (y.length === 2) y = '20' + y;
         const date = new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
         return isNaN(date) ? null : date;
      }
   }

   const d = new Date(str);
   return isNaN(d) ? null : d;
}

function readSheet(workbook, sheetName) {
   const sheet = workbook.Sheets[sheetName];
   if (!sheet) return [];
   return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
}

// ── Fuzzy matching helpers ────────────────────────────────────────────────────

/**
 * Normalize a string for fuzzy comparison:
 *   - remove all whitespace
 *   - lowercase
 *   - remove special chars like quotes, slashes, dashes
 *
 * Examples:
 *   "32MM JOINER"           → "32mmjoiner"
 *   "32 MM Joiner"          → "32mmjoiner"
 *   "75 MM PVC FTA/MTA"     → "75mmpvcftamta"
 *   "Air Release Valve 1''" → "airreleaseval1"
 */
function normalizeStr(str) {
   return String(str)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ''); // keep only alphanumeric
}

// Build two lookup maps from KEY_TO_ITEM_NAME:
//   1. exact:  displayName (original) → key
//   2. fuzzy:  normalizedDisplayName  → key
const ITEM_NAME_TO_KEY_EXACT  = Object.fromEntries(
   Object.entries(KEY_TO_ITEM_NAME).map(([k, v]) => [v, k])
);

const ITEM_NAME_TO_KEY_FUZZY  = Object.fromEntries(
   Object.entries(KEY_TO_ITEM_NAME).map(([k, v]) => [normalizeStr(v), k])
);

/**
 * Find the model key for a given Excel header string.
 * Strategy:
 *   1. Exact match  (fastest, handles perfectly formatted headers)
 *   2. Fuzzy match  (handles spacing/case differences like "32MM JOINER")
 *
 * @param {string} header
 * @returns {string|null}  model key or null if not found
 */
function findKey(header) {
   const trimmed = String(header).trim();

   // 1. Exact
   if (ITEM_NAME_TO_KEY_EXACT[trimmed]) return ITEM_NAME_TO_KEY_EXACT[trimmed];

   // 2. Fuzzy
   const normalized = normalizeStr(trimmed);
   if (ITEM_NAME_TO_KEY_FUZZY[normalized]) return ITEM_NAME_TO_KEY_FUZZY[normalized];

   return null;
}

// ── Skip-column headers (not product names, not errors) ──────────────────────

// These column headers are intentionally ignored during product matching.
const SKIP_HEADERS = new Set([
   normalizeStr('Date'),
   normalizeStr('Challan No.'),
   normalizeStr('Challan No'),
   normalizeStr('Voucher No'),
   normalizeStr('Voucher No.'),
   normalizeStr('Acre'),
   normalizeStr('Total Items'),
   normalizeStr('Total'),
   normalizeStr('Sr No'),
   normalizeStr('Sr. No.'),
   normalizeStr('Sr No.'),
   normalizeStr('S.No'),
   normalizeStr('S.No.'),
]);

// ── Build column-index → model-key map from the header row ───────────────────

/**
 * Reads the header row and returns:
 *   colMap        : { colIndex: modelKey }   — for product columns
 *   totalItemsCol : index of "Total Items" column (or null)
 *   unmatched     : array of { colIndex, header } for unrecognised product headers
 *
 * Unmatched columns are collected here so the caller can decide to throw an error
 * listing ALL unrecognised headers at once (better UX than stopping at first).
 */
function buildColMap(headerRow) {
   const colMap      = {};
   let totalItemsCol = null;
   const unmatched   = [];

   headerRow.forEach((cell, idx) => {
      if (cell === null || cell === undefined) return;
      const header    = String(cell).trim();
      if (!header)    return;

      const normHeader = normalizeStr(header);

      // Skip known non-product columns
      if (SKIP_HEADERS.has(normHeader)) return;

      // "Total Items" / "Total" column
      if (normHeader === normalizeStr('Total Items') || normHeader === normalizeStr('Total')) {
         totalItemsCol = idx;
         return;
      }

      const key = findKey(header);
      if (key) {
         colMap[idx] = key;
      } else {
         unmatched.push({ colIndex: idx, header });
      }
   });

   return { colMap, totalItemsCol, unmatched };
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * @param {Buffer} buffer
 * @param {string} financialYear     — e.g. "26-27"
 * @param {string} farmerDealerCode  — e.g. "MP/08"
 * @param {string} dealerName        — dealer display name
 * @param {string} createdBy         — req.user._id
 */
export function parseInventorySheet(buffer, financialYear, farmerDealerCode, dealerName, createdBy) {
   const wb = XLSX.read(buffer, { type: 'buffer', cellDates: true });

   const sheetName = wb.SheetNames.find(n => n.trim() === 'TALLY INVENTRY') ?? wb.SheetNames[0];
   const rows = readSheet(wb, sheetName);

   if (!rows.length) throw new Error(`Sheet "${sheetName}" is empty.`);

   // Row 4 is the header row (0-indexed)
   const headerRow = rows[4] ?? [];
   const { colMap, totalItemsCol, unmatched } = buildColMap(headerRow);

   // ── Unmatched header error ────────────────────────────────────────────────
   // If any product column header could not be matched, throw a clear error
   // so the user knows exactly which headers need to be fixed in their Excel file.
   if (unmatched.length > 0) {
      const lines = unmatched.map(
         ({ colIndex, header }) => `  • Column ${colIndex + 1}: "${header}"`
      );
      throw new Error(
         `Excel file mein kuch column headers match nahi hue:\n\n` +
         lines.join('\n') +
         `\n\nPlease in headers ko sahi karo ya ItemRates.js mein add karo.\n` +
         `(Matching case-insensitive aur spaces-ignore karke hoti hai)`
      );
   }

   // Determine Total Items column: use found col, else last column of header row
   const lastHeaderCol = totalItemsCol ?? (headerRow.length - 1);

   const dataRows = rows.slice(5).filter(r => r[1]); // skip empty rows (no challan)
   const docs    = [];
   const skipped = [];

   for (let i = 0; i < dataRows.length; i++) {
      const r      = dataRows[i];
      const rowNum = i + 6;
      const challanNo = toStr(r[1]);

      if (!challanNo) continue;

      const date = parseDate(r[0]);
      if (!date) {
         skipped.push({ row: rowNum, challanNo, reason: 'Invalid or missing date' });
         continue;
      }

      // Build products object by reading each matched column
      const products = {};
      Object.entries(colMap).forEach(([colIdx, modelKey]) => {
         products[modelKey] = toNum(r[colIdx]);
      });

      docs.push({
         dealerName      : dealerName || farmerDealerCode || 'UNKNOWN',
         farmerDealerCode: farmerDealerCode || 'UNKNOWN',
         financialYear,
         date,
         challanNo,
         acre      : toNumOrNull(r[2]),
         products,
         totalItems: toNum(r[lastHeaderCol]),
         createdBy,
      });
   }

   return { docs, skipped };
}