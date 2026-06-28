import PaidCash from "../../models/PaidCash.js";
import Incentive from "../../models/Incentive.js";

/* ── Shared Helpers ─────────────────────────────────────────────────────────── */

/**
 * @param {object}  entry
 * @param {object}  [options]
 * @param {boolean} [options.allowNegativeAmount=false] - When true (Incentives), negative
 *        amounts are accepted (deductions/reversals) and only zero is rejected. When false
 *        (PaidCash), the amount must be strictly greater than 0.
 */
function validateEntry({ dealerName, farmerDealerCode, amount, financialYear }, { allowNegativeAmount = false } = {}) {
   if (!dealerName?.trim() || !farmerDealerCode?.trim()) {
      return "Dealer name and dealer code are required";
   }

   const amountNum = Number(amount);
   const amountMissing = amount === undefined || amount === null || amount === "" || isNaN(amountNum);
   const amountInvalid = allowNegativeAmount ? amountNum === 0 : amountNum <= 0;

   if (amountMissing || amountInvalid) {
      return allowNegativeAmount
         ? "Amount is required and must not be zero"
         : "Amount must be greater than 0";
   }

   if (!financialYear?.trim()) {
      return "Financial year is required";
   }
   return null;
}

function buildEntry({ date, dealerName, farmerDealerCode, amount, financialYear, remarks, userId }) {
   return {
      date: date ? new Date(date) : new Date(),
      dealerName: dealerName.trim(),
      farmerDealerCode: farmerDealerCode.trim().toUpperCase(),
      amount: Number(amount),
      financialYear: financialYear.trim(),
      remarks: remarks?.trim() ?? "",
      createdBy: userId,
   };
}

/**
 * Creates the four CRUD handlers (getAll, add, update, delete) for any model.
 * @param {import("mongoose").Model} Model  - Mongoose model
 * @param {string}                   label  - Used in console.error messages e.g. "PaidCash"
 * @param {object}                   [options]
 * @param {boolean}                  [options.allowNegativeAmount=false] - See validateEntry.
 */
function createHandlers(Model, label, { allowNegativeAmount = false } = {}) {
   /* ── GET all ── */
   async function getAll(req, res) {
      try {
         const records = await Model.find().sort({ date: -1 }).lean();
         return res.status(200).json({ success: true, data: records });
      } catch (err) {
         console.error(`getAll${label} error:`, err);
         return res.status(500).json({ success: false, message: "Server error" });
      }
   }

   /* ── POST create ── */
   async function add(req, res) {
      try {
         const { date, dealerName, farmerDealerCode, amount, financialYear, remarks } = req.body;

         const validationError = validateEntry(
            { dealerName, farmerDealerCode, amount, financialYear },
            { allowNegativeAmount }
         );
         if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
         }

         const record = await Model.create(
            buildEntry({ date, dealerName, farmerDealerCode, amount, financialYear, remarks, userId: req.user?._id })
         );
         return res.status(201).json({ success: true, data: record });
      } catch (err) {
         console.error(`add${label} error:`, err);
         return res.status(500).json({ success: false, message: "Server error" });
      }
   }

   /* ── PUT update ── */
   async function update(req, res) {
      try {
         const { date, amount, financialYear, remarks } = req.body;
         const patch = {};

         if (date !== undefined)            patch.date          = new Date(date);
         if (financialYear !== undefined)   patch.financialYear = financialYear.trim();
         if (remarks !== undefined)         patch.remarks       = remarks.trim();
         if (amount !== undefined) {
            const amountNum = Number(amount);
            const amountInvalid = isNaN(amountNum) || (allowNegativeAmount ? amountNum === 0 : amountNum <= 0);
            if (amountInvalid) {
               return res.status(400).json({
                  success: false,
                  message: allowNegativeAmount ? "Amount must not be zero" : "Amount must be greater than 0",
               });
            }
            patch.amount = amountNum;
         }

         const record = await Model.findByIdAndUpdate(
            req.params.id,
            { $set: patch },
            { new: true, runValidators: true }
         );
         if (!record) {
            return res.status(404).json({ success: false, message: "Record not found" });
         }
         return res.status(200).json({ success: true, data: record });
      } catch (err) {
         console.error(`update${label} error:`, err);
         return res.status(500).json({ success: false, message: "Server error" });
      }
   }

   /* ── DELETE ── */
   async function remove(req, res) {
      try {
         const record = await Model.findByIdAndDelete(req.params.id);
         if (!record) {
            return res.status(404).json({ success: false, message: "Record not found" });
         }
         return res.status(200).json({ success: true, message: "Record deleted successfully" });
      } catch (err) {
         console.error(`delete${label} error:`, err);
         return res.status(500).json({ success: false, message: "Server error" });
      }
   }

   return { getAll, add, update, remove };
}

/* ── Named exports ──────────────────────────────────────────────────────────── */

const paidCash = createHandlers(PaidCash, "PaidCash");
const incentive = createHandlers(Incentive, "Incentive", { allowNegativeAmount: true });

export const getAllPaidCash  = paidCash.getAll;
export const addPaidCash    = paidCash.add;
export const updatePaidCash = paidCash.update;
export const deletePaidCash = paidCash.remove;

export const getAllIncentives  = incentive.getAll;
export const addIncentive      = incentive.add;
export const updateIncentive   = incentive.update;
export const deleteIncentive   = incentive.remove;