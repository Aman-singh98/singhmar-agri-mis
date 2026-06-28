/**
 * micadaStatusMap.js
 * ─────────────────────────────────────────────────────────────────────────
 * Maps MICADA's long/technical "currentStatus" strings (column A in your
 * sheet) to your internal short-form status (column B).
 *
 * USAGE:
 *   import { getShortStatus } from './micadaStatusMap.js';
 *   const shortStatus = getShortStatus(rawMicadaStatus); // returns string or null
 *
 * NOTE: Matching is done after normalizing (trim + collapse multiple
 * spaces + lowercase) so minor spacing/case differences in the excel
 * file from MICADA don't break the match.
 * ─────────────────────────────────────────────────────────────────────────
 */

// ── Raw mapping table (exactly as per your sheet) ───────────────────────────
export const MICADA_STATUS_MAP = {
  "Application Approval - Approval by 'DD Associate' at 'Application'": "Application Verification Pending",
  "Application Approval - Approval by 'DD Associate' at 'Application Verification'": "Application Verification Pending",
  "Application Approval - Approval by 'JE' at 'Application Verification'": "Application Verification Pending",
  "Application Approval - Approval by 'DD Associate' at 'Application documents scrutiny and recommendation'": "Application Verification Pending",
  "Application Approval - Approval by 'DMICADA' at 'Application Approval'": "Application Verification Pending",
  "Application Approval - Approval by 'DMICADA' at 'Application Verification'": "Application Verification Pending",
  "Application Approval - Approval by 'DDMI' at 'Application Verification'": "Application Verification Pending",
  "Application Approval - Approval by 'Farmer' at 'Farmer Pond Stage1 Intimation'": "Application Verification Pending",
  "Pond1 - Approval by 'JE' at 'Pond Stage1 Verification'": "Application Verification Pending",
  "Pond1 - Approval by 'XEN' at 'Pond Stage1 Verification'": "Application Verification Pending",
  "Pond1 - Approval by 'DD Associate' at 'Pond Stage1 Subsidy Calculation'": "Application Verification Pending",
  "Pond1 - Approval by 'CAO' at 'Payment advice submission to bank and amount disbursment'": "Application Verification Pending",
  "Pond1 - Approval by 'Farmer' at 'Farmer Pond Stage1 Intimation'": "Application Verification Pending",
  "Pond1 - Approval by 'DMICADA' at 'Lot generation for subsidy disbursement'": "Application Verification Pending",
  "Application Approval - Approval by 'JE-EW' at 'Application Verification'": "Application Verification Pending",
  "Pond2 - Approval by 'XEN' at 'Pond Stage2 Verification'": "Application Verification Pending",
  "Pond1 - Approval by 'DMICADA' at 'Pond Stage1 Subsidy Calculation'": "Application Verification Pending",
  "Application Approval - Approval by 'Farmer' at 'Farmer Pond Stage2 Intimation'": "Application Verification Pending",

  "Application Approval - Approval by 'Farmer' at 'Application Submission'": "Application In-Complete",

  "Application Approval - Approval by 'Vendor' at 'Mi Pre Survey'": "Estimate Survey Pending",
  "Pond1 - Approval by 'CAO' at 'Pond Stage1 Subsidy Disbursment'": "Estimate Survey Pending",
  "Pond2 - Approval by 'JE' at 'Pond Stage2 Verification'": "Estimate Survey Pending",
  "MI - Approval by 'Vendor' at 'Mi Pre Survey'": "Estimate Survey Pending",

  "Application Approval - Approval by 'Vendor' at 'Vendor Estimation'": "Estimate Submission Pending",
  "MI - Approval by 'Vendor' at 'Vendor Estimation'": "Estimate Submission Pending",

  "MI - Approval by 'DD Associate' at 'Estimation Verification'": "Estimate Verification Pending",
  "MI - Approval by 'DD Associate' at 'Estimation,design,documents scrutiny and recommendation'": "Estimate Verification Pending",
  "MI - Approval by 'DMICADA' at 'Estimation Verification'": "Estimate Verification Pending",
  "MI - Approval by 'DMICADA' at 'Estimation approval'": "Estimate Verification Pending",
  "MI - Approval by 'DDMI' at 'Estimation Verification'": "Estimate Verification Pending",

  "MI - Approval by 'Farmer' at 'Challan & Payments'": "Challan Generation Pending",
  "MI - Approval by 'Farmer' at 'Challan generation & Payments/intimation'": "Challan Generation Pending",

  "MI - Approval by 'Bank' at 'Payment Intimation'": "Payment Pending",
  "MI - Approval by 'Vendor' at 'Payment Intimation'": "Full Payment Request",

  "MI - Approval by 'DMICADA' at 'Mi FarmerShare to Vendor PFMS Calc'": "Bill Upload Pending",
  "MI - Approval by 'DMICADA' at 'Processing of Farmer Share to Vendor'": "Bill Upload Pending",
  "MI - Approval by 'Vendor' at 'MIS installation and BOQ Submission'": "Bill Upload Pending",
  "MI - Approval by 'Vendor' at 'BOQ Submission'": "Bill Upload Pending",

  "MI - Approval by 'JE' at 'MI Field Survey Verification'": "Field Verification pending",
  "MI - Approval by 'JE' at 'MIS Field Physical Verification'": "Field Verification pending",
  "MI - Approval by 'CJE' at 'MI Field Survey Verification'": "Field Verification pending",

  "MI - Approval by 'CXEN' at 'MI Field Survey Verification'": "Field Verified",
  "MI - Approval by 'XEN' at 'MI Field Survey Verification'": "Field Verified Pending at XEN",
  "MI - Approval by 'XEN' at 'MIS Field Physical Re-Verification(5%) and recommendation'": "Field Verified Pending at XEN",

  "MI - Approval by 'CAO' at 'Mi FarmerShare to Vendor Subsidy Disbursment'": "Subsidy in process",
  "MI - Approval by 'ADMIN' at 'MI Subsidy Calculation'": "Subsidy in process",
  "MI - Approval by 'ADMIN' at 'MI Subsidy approval'": "Subsidy in process",
  "MI - Approval by 'CAO' at 'Payment of Farmer Share to Vendor'": "Subsidy in process",
  "MI - Approval by 'DMICADA' at 'Lot generation for subsidy disbursement'": "Subsidy in process",
  "MI - Approval by 'CAO' at 'Mi FarmerShare to Vendor Subsidy Disbursment'": "Subsidy in process",
  "MI - Approval by 'SDO' at 'MI Field Survey Verification'": "Subsidy in process",
  "MI - Approval by 'DMICADA' at 'MI Subsidy recommendation'": "Subsidy in process",
  "MI - Approval by 'DD Associate' at 'PV scrutiny,MIS Subsidy checking and recommendation'": "Subsidy in process",
  "MI - Approval by 'CAO' at 'Uploading and processing of beneficiaries details of payment on GoI's PFMS Portal'": "Subsidy in process",
  "MI - Approval by 'DD Associate' at 'MI Subsidy Calculation'": "Subsidy in process",
  "MI - Approval by 'DMICADA' at 'MI RTF PFMS Calculation'": "Subsidy in process",
  "MI - Approval by 'DMICADA' at 'MI STF PFMS Calculation'": "Subsidy in process",
  "MI - Approval by 'CAO' at 'MI STV Subsidy Disbursment'": "Subsidy in process",
  "MI - Approval by 'CAO' at 'MI STF Subsidy Disbursment'": "Subsidy in process",
  "Pond2 - Approval by 'CAO' at 'Pond Stage2 Subsidy Disbursment'": "Subsidy in process",
  "Pond3 - Approval by 'CAO' at 'Pond Stage3 Subsidy Disbursment'": "Subsidy in process",
  "MI - Approval by 'JE-EW' at 'Pond Stage3 Subsidy Calculation'": "Subsidy in process",
  "Pond2 - Approval by 'DD-EW' at 'Pond Stage2 Subsidy Calculation'": "Subsidy in process",
  "MI - Approval by 'DMICADA' at 'MI STV PFMS Calculation'": "Subsidy in process",
  "Pond1 - Approval by 'DD-EW' at 'Pond Stage1 Subsidy Calculation'": "Subsidy in process",
  "Pond2 - Approval by 'JE-EW' at 'Pond Stage2 Subsidy Calculation'": "Subsidy in process",
  "Pond1 - Approval by 'DMICADA' at 'Pond Stage1 PFMS Calculation'": "Subsidy in process",
  "Pond1 - Approval by 'JE-EW' at 'Pond Stage1 Subsidy Calculation'": "Subsidy in process",
  "Pond2 - Approval by 'DD Associate' at 'Pond Stage2 Subsidy Calculation'": "Subsidy in process",
  "Pond1 - Approval by 'DDTank' at 'Pond Stage1 Subsidy Calculation'": "Subsidy in process",
  "MI - Approval by 'DDMI' at 'MI Subsidy Calculation'": "Subsidy in process",
  "MI - Approval by 'DMICADA' at 'MI Subsidy Calculation'": "Subsidy in process",
};

// ── Normalizer: trims, collapses internal whitespace, lowercases ──────────
const normalize = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.trim().replace(/\s+/g, " ").toLowerCase();
};

// ── Build a normalized lookup map once (for fast + safe matching) ─────────
const NORMALIZED_MAP = new Map();
for (const [rawKey, shortValue] of Object.entries(MICADA_STATUS_MAP)) {
  NORMALIZED_MAP.set(normalize(rawKey), shortValue);
}

/**
 * getShortStatus
 * Looks up the short-form status for a given raw MICADA status string.
 *
 * @param {string} rawStatus - The raw "currentStatus" value from MICADA excel
 * @returns {string|null} - The mapped short-form status, or null if no match found
 */
export const getShortStatus = (rawStatus) => {
  if (!rawStatus) return null;
  const key = normalize(rawStatus);
  return NORMALIZED_MAP.get(key) || null;
};

export default MICADA_STATUS_MAP;