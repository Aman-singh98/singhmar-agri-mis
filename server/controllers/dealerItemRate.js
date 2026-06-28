/**
 * dealerItemRate.controller.js
 *
 * CRUD for dealer-specific item rate overrides.
 *
 * All responses follow the shape:
 *   { success: true,  data: <payload> }
 *   { success: false, message: <string> }
 */

import DealerItemRate from "../models/DealerItemRate.js";
import Dealer from "../models/Dealer.js";

// ── Helper ────────────────────────────────────────────────────────────────────
function notFound(res) {
   return res.status(404).json({ success: false, message: "Rate override not found." });
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /dealer-item-rates?dealer=<id>&financialYear=25-26
// Returns all overrides for a dealer + financial year, sorted by itemName.
// ─────────────────────────────────────────────────────────────────────────────
export async function listDealerItemRates(req, res) {
   try {
      const { dealer, financialYear } = req.query;

      if (!dealer || !financialYear) {
         return res.status(400).json({
            success: false,
            message: "Query params 'dealer' and 'financialYear' are required.",
         });
      }

      const rates = await DealerItemRate.find({ dealer, financialYear })
         .sort({ itemName: 1 })
         .lean();

      return res.status(200).json({ success: true, data: rates });
   } catch (err) {
      console.error("[listDealerItemRates]", err);
      return res.status(500).json({ success: false, message: "Server error." });
   }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /dealer-item-rates
// Body: { dealer, financialYear, itemName, rateUpto, rateFrom }
// ─────────────────────────────────────────────────────────────────────────────
export async function createDealerItemRate(req, res) {
   try {
      const { dealer, financialYear, itemName, rateUpto, rateFrom } = req.body;

      // ── Required field check ──────────────────────────────────────────────
      if (!dealer || !financialYear || !itemName || rateUpto == null || rateFrom == null) {
         return res.status(400).json({
            success: false,
            message: "Fields dealer, financialYear, itemName, rateUpto, rateFrom are all required.",
         });
      }

      // ── Dealer must exist ─────────────────────────────────────────────────
      const dealerExists = await Dealer.exists({ _id: dealer });
      if (!dealerExists) {
         return res.status(404).json({ success: false, message: "Dealer not found." });
      }

      // ── Duplicate check (unique index will also catch this, but gives a
      //    friendlier message than a Mongo duplicate-key error) ───────────────
      const duplicate = await DealerItemRate.exists({ dealer, financialYear, itemName });
      if (duplicate) {
         return res.status(409).json({
            success: false,
            message: `An override for "${itemName}" already exists for this dealer and financial year.`,
         });
      }

      const rate = await DealerItemRate.create({
         dealer,
         financialYear,
         itemName,
         rateUpto: Number(rateUpto),
         rateFrom: Number(rateFrom),
      });

      return res.status(201).json({ success: true, data: rate });
   } catch (err) {
      console.error("[createDealerItemRate]", err);
      // Fallback for MongoDB unique-index violation
      if (err.code === 11000) {
         return res.status(409).json({
            success: false,
            message: "An override for this item already exists for this dealer and financial year.",
         });
      }
      return res.status(500).json({ success: false, message: "Server error." });
   }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUT /dealer-item-rates/:id
// Body: { rateUpto, rateFrom }
// itemName, dealer, financialYear are intentionally NOT updatable here —
// delete and re-create to change those.
// ─────────────────────────────────────────────────────────────────────────────
export async function updateDealerItemRate(req, res) {
   try {
      const { rateUpto, rateFrom } = req.body;

      if (rateUpto == null || rateFrom == null) {
         return res.status(400).json({
            success: false,
            message: "Fields rateUpto and rateFrom are required.",
         });
      }

      if (Number(rateUpto) < 0 || Number(rateFrom) < 0) {
         return res.status(400).json({
            success: false,
            message: "Rates cannot be negative.",
         });
      }

      const updated = await DealerItemRate.findByIdAndUpdate(
         req.params.id,
         { rateUpto: Number(rateUpto), rateFrom: Number(rateFrom) },
         { new: true, runValidators: true }
      );

      if (!updated) return notFound(res);

      return res.status(200).json({ success: true, data: updated });
   } catch (err) {
      console.error("[updateDealerItemRate]", err);
      return res.status(500).json({ success: false, message: "Server error." });
   }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /dealer-item-rates/:id
// ─────────────────────────────────────────────────────────────────────────────
export async function deleteDealerItemRate(req, res) {
   try {
      const deleted = await DealerItemRate.findByIdAndDelete(req.params.id);
      if (!deleted) return notFound(res);

      return res.status(200).json({
         success: true,
         data: { _id: req.params.id },
         message: "Rate override deleted.",
      });
   } catch (err) {
      console.error("[deleteDealerItemRate]", err);
      return res.status(500).json({ success: false, message: "Server error." });
   }
}
