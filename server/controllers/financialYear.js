/**
 * controllers/financialYear.controller.js
 *
 * Handles CRUD for financial years.
 * On DELETE → cascades to every collection that holds a financialYear string field,
 * then purges uploaded files from disk.
 */
import fs from "fs";
import path from "path";
import FinancialYear from "../models/financialYear.js";
import TdsRecord from "../models/TdsRecord.js";
import SubsidyRecord from "../models/Subsidy.js";
import AdjustedSheet from "../models/materialDispatchDetails/AdjustedSheet.js";
import MaterialDispatched from "../models/materialDispatchDetails/MaterialDispatched.js";
import Receipt from "../models/materialDispatchDetails/Receipt.js";
import TallyBill from "../models/Tallybill.js";
import PaidCash from "../models/PaidCash.js";
import Micada from "../models/Micada.js";
import MainFile from "../models/MainFile.js";
import Inventory from "../models/Inventory.js";
import Incentive from "../models/Incentive.js";
import MainRecord from "../models/MainRecord.js";
import FarmerShareDetail from "../models/FarmerShareDetail.js";

/* Registry
 * One entry per collection that must be wiped when a financial year is deleted.
 * To add a new collection in future: just append one line here.
 */
const DEPENDENT_MODELS = [
   { name: "TdsRecord", model: TdsRecord },
   { name: "SubsidyRecord", model: SubsidyRecord },
   { name: "AdjustedSheet", model: AdjustedSheet },
   { name: "MaterialDispatched", model: MaterialDispatched },
   { name: "Receipt", model: Receipt },
   { name: "TallyBill", model: TallyBill },
   { name: "PaidCash", model: PaidCash },
   { name: "Micada", model: Micada },
   { name: "MainFile", model: MainFile },
   { name: "Inventory", model: Inventory },
   { name: "Incentive", model: Incentive },
   { name: "MainRecord", model: MainRecord },
   { name: "FarmerShareDetail", model: FarmerShareDetail },
];

// File Purge
function purgeYearUploads(year) {
   const uploadDir = path.resolve("uploads", year);
   if (!fs.existsSync(uploadDir)) return;
   fs.rmSync(uploadDir, { recursive: true, force: true });
}

// Cascade Delete Helper
async function cascadeDeleteByYear(label) {
   const filter = { financialYear: label };
   const results = {};

   await Promise.all(
      DEPENDENT_MODELS.map(async ({ name, model }) => {
         try {
            const { deletedCount } = await model.deleteMany(filter);
            results[name] = deletedCount;
         } catch (err) {
            // Log but don't abort — delete as much as possible
            console.error(`[cascadeDelete] Failed on ${name}:`, err.message);
            results[name] = `ERROR: ${err.message}`;
         }
      })
   );

   return results;
}

// Controllers

/**
 * GET /api/financial-years
 * Returns all years sorted descending (latest first).
 */
export async function fetchAllYears(req, res) {
   try {
      const years = await FinancialYear.find().sort({ startYear: -1 }).lean();
      res.json({ success: true, data: years.map((y) => y.label) });
   } catch (err) {
      res.status(500).json({ success: false, message: "Failed to fetch financial years." });
   }
}

/**
 * POST /api/financial-years
 * Body: { year: "2026-27" }
 */
export async function createYear(req, res) {
   try {
      const { year } = req.body;

      if (!year || typeof year !== "string") {
         return res.status(400).json({ success: false, message: "year is required." });
      }

      const label = year.trim();
const FY_REGEX = /^\d{4}-\d{2}$/;

if (!FY_REGEX.test(label)) {
  return res.status(400).json({ success: false, message: "Invalid format. Use YYYY-YY." });
}

// ✅ Add this block
const [startStr, endStr] = label.split("-");
const expectedSuffix = (parseInt(startStr, 10) + 1) % 100;
const actualSuffix = parseInt(endStr, 10);
if (actualSuffix !== expectedSuffix) {
  return res.status(400).json({
    success: false,
    message: `Invalid financial year. For ${startStr}, suffix must be ${String(expectedSuffix).padStart(2, "0")} (e.g. ${startStr}-${String(expectedSuffix).padStart(2, "0")}).`,
  });
}

      const exists = await FinancialYear.findOne({ label });
      if (exists) {
         return res.status(409).json({ success: false, message: "This financial year already exists." });
      }

const startYear = parseInt(label.split("-")[0], 10);
       await FinancialYear.create({ label, startYear });

      res.status(201).json({ success: true, message: `Financial year ${label} added.`, data: label });
   } catch (err) {
      res.status(500).json({ success: false, message: "Failed to add financial year." });
   }
}

/**
 * DELETE /api/financial-years/:year
 * Param: year = "26-27"
 *
 * Deletes the FinancialYear record, then cascades deleteMany({ financialYear: label })
 * across every dependent collection, then purges uploaded files from disk.
 *
 * Response includes a per-collection deleted count for transparency.
 */
export async function removeYear(req, res) {
   try {
      const label = req.params.year?.trim();

      if (!label) {
         return res.status(400).json({ success: false, message: "year param is required." });
      }

      // 1. Delete the FinancialYear record itself
      const record = await FinancialYear.findOneAndDelete({ label });
      if (!record) {
         return res.status(404).json({ success: false, message: "Financial year not found." });
      }

      // 2. Cascade delete across all dependent collections (runs in parallel)
      const deletedCounts = await cascadeDeleteByYear(label);

      // 3. Remove uploaded files from disk
      purgeYearUploads(label);

      res.json({
         success: true,
         message: `Financial year ${label} and all related data have been deleted.`,
         deleted: deletedCounts,
      });

   } catch (err) {
      console.error("[removeYear] Unexpected error:", err);
      res.status(500).json({ success: false, message: "Failed to delete financial year." });
   }
}
