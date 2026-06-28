/**
 * hisabRoutes.js
 * Mount this in your main app:
 *   import hisabRoutes from "./routes/hisabRoutes.js";
 *   app.use("/api/hisab", hisabRoutes);
*/

import express from "express";
import { computeHisab } from "../helpers/hisabCalculator.js";
import { generateHisabPdf } from "../helpers/pdf/pdfgenerator.js";

// ── Import all Mongoose models ────────────────────────────────────────────────
import Inventory from "../models/Inventory.js";
import TallyBill from "../models/Tallybill.js";
import SubsidyRecord from "../models/Subsidy.js";
import MainRecord from "../models/MainRecord.js";
import Receipt from "../models/materialDispatchDetails/Receipt.js";
import AdjustedSheet from "../models/materialDispatchDetails/AdjustedSheet.js";
import Incentive from "../models/Incentive.js";
import TdsRecord from "../models/TdsRecord.js";
import PaidCash from "../models/PaidCash.js";
import Dealer from "../models/Dealer.js";
import FinancialYear from "../models/financialYear.js";
import MaterialDispatched from "../models/materialDispatchDetails/MaterialDispatched.js";
import FarmerShareDetail from "../models/FarmerShareDetail.js";
import ItemRate from "../models/ItemRate.js";
import ShiftingEntry from "../models/ShiftingEntry.js";
import ReturnEntry from "../models/ReturnEntry.js";
import HisabSnapshot from "../models/Hisabsnapshot.js";

const router = express.Router();

// Bundle all models for calculator
const Models = {
   Inventory,
   TallyBill,
   SubsidyRecord,
   MaterialDispatched,
   MainRecord,
   Receipt,
   AdjustedSheet,
   Incentive,
   TdsRecord,
   PaidCash,
   Dealer,
   ItemRate,
   ShiftingEntry,
   ReturnEntry,
   HisabSnapshot,
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/hisab/financial-years
// Returns list of all financial years for dropdown
// ─────────────────────────────────────────────────────────────────────────────
router.get("/financial-years", async (req, res) => {
   try {
      const years = await FinancialYear.find({}).sort({ year: 1 }).lean();
      res.json({ success: true, data: years });
   } catch (err) {
      console.error("financial-years error:", err);
      res.status(500).json({ success: false, message: err.message });
   }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/hisab/dealers
// Returns all dealers (for dropdown in Tab 2)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/dealers", async (req, res) => {
   try {
      const dealers = await Dealer.find({}).sort({ name: 1 }).lean();
      res.json({ success: true, data: dealers });
   } catch (err) {
      console.error("dealers error:", err);
      res.status(500).json({ success: false, message: err.message });
   }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/hisab/all-dealers?financialYear=22-23
// Compute hisab for ALL dealers for the given financial year
// Returns summary list (Tab 1)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/all-dealers", async (req, res) => {
   try {
      const { financialYear } = req.query;
      if (!financialYear) {
         return res.status(400).json({ success: false, message: "financialYear query param required" });
      }

      const dealers = await Dealer.find({}).lean();
      if (!dealers.length) {
         return res.json({ success: true, data: [], count: 0 });
      }

      // Compute hisab for all dealers in parallel (batched to avoid DB overload)
      const BATCH_SIZE = 5;
      const results = [];

      for (let i = 0; i < dealers.length; i += BATCH_SIZE) {
         const batch = dealers.slice(i, i + BATCH_SIZE);
         const batchResults = await Promise.all(
            batch.map(async (dealer) => {
               try {
                  const hisab = await computeHisab(Models, dealer.farmerDealerCode, financialYear);
                  return {
                     ...hisab,
                     dealerName: dealer.dealerName,
                     dealerLocation: dealer.location || dealer.village || "",
                  };
               } catch (err) {
                  console.error(`Hisab error for dealer ${dealer.farmerDealerCode}:`, err.message);
                  return {
                     farmerDealerCode: dealer.farmerDealerCode,
                     dealerName: dealer.dealerName,
                     financialYear,
                     error: err.message,
                  };
               }
            })
         );
         results.push(...batchResults);
      }

      res.json({ success: true, count: results.length, data: results });
   } catch (err) {
      console.error("all-dealers error:", err);
      res.status(500).json({ success: false, message: err.message });
   }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/hisab/dealer/:farmerDealerCode?financialYear=22-23
// Full detailed hisab for a single dealer (Tab 3)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/dealer/:farmerDealerCode", async (req, res) => {
   try {
      const { farmerDealerCode } = req.params;
      const { financialYear } = req.query;

      if (!financialYear) {
         return res.status(400).json({ success: false, message: "financialYear query param required" });
      }

      const dealer = await Dealer.findOne({ farmerDealerCode }).lean();
      if (!dealer) {
         return res.status(404).json({ success: false, message: "Dealer not found" });
      }

      const hisab = await computeHisab(Models, farmerDealerCode, financialYear);

      res.json({
         success: true,
         data: {
            ...hisab,
            dealerName: dealer.dealerName,
            dealerLocation: dealer.location || dealer.village || "",
         },
      });
   } catch (err) {
      console.error("dealer hisab error:", err);
      res.status(500).json({ success: false, message: err.message });
   }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/hisab/dealer/:farmerDealerCode/farmers?financialYear=22-23
// Returns FarmerShareDetail records for a single dealer (Farmers tab)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/dealer/:farmerDealerCode/farmers", async (req, res) => {
   try {
      const { farmerDealerCode } = req.params;
      const { financialYear } = req.query;
      if (!financialYear) {
         return res.status(400).json({ success: false, message: "financialYear query param required" });
      }
      const farmers = await FarmerShareDetail.find({ farmerDealerCode, financialYear })
         .sort({ srNo: 1 })
         .select("srNo name miNumber type areaInAcre farmerShare farmerShareDeposit returnFarmerShare difference onlineFarmerShareStatus depositDate")
         .lean();
      res.json({ success: true, data: farmers });
   } catch (err) {
      console.error("farmers route error:", err);
      res.status(500).json({ success: false, message: err.message });
   }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/hisab/dealer/:farmerDealerCode/pdf?financialYear=22-23
// Download PDF for a single dealer
// ─────────────────────────────────────────────────────────────────────────────
router.get("/dealer/:farmerDealerCode/pdf", async (req, res) => {
   try {
      const { farmerDealerCode } = req.params;
      const { financialYear } = req.query;

      if (!financialYear) {
         return res.status(400).json({ success: false, message: "financialYear query param required" });
      }

      const dealer = await Dealer.findOne({ farmerDealerCode }).lean();
      if (!dealer) {
         return res.status(404).json({ success: false, message: "Dealer not found" });
      }

      const hisab = await computeHisab(Models, farmerDealerCode, financialYear);

      generateHisabPdf(hisab, dealer, res);
   } catch (err) {
      console.error("PDF generation error:", err);
      res.status(500).json({ success: false, message: err.message });
   }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/hisab/save-closing
// Save (or overwrite) the closing balance for a dealer + FY.
// Body: { farmerDealerCode, financialYear, closingBalance }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/save-closing", async (req, res) => {
   try {
      const { farmerDealerCode, financialYear, closingBalance } = req.body;

      if (!farmerDealerCode || !financialYear || closingBalance === undefined) {
         return res.status(400).json({
            success: false,
            message: "farmerDealerCode, financialYear and closingBalance are required.",
         });
      }

      const snapshot = await HisabSnapshot.findOneAndUpdate(
         { farmerDealerCode, financialYear },
         { closingBalance: Number(closingBalance), savedAt: new Date() },
         { upsert: true, new: true }
      );

      res.json({ success: true, data: snapshot });
   } catch (err) {
      console.error("save-closing error:", err);
      res.status(500).json({ success: false, message: err.message });
   }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/hisab/closing-balance/:farmerDealerCode?financialYear=22-23
// Get saved closing balance for a dealer + FY.
// Returns null in data if no snapshot saved yet.
// ─────────────────────────────────────────────────────────────────────────────
router.get("/closing-balance/:farmerDealerCode", async (req, res) => {
   try {
      const { farmerDealerCode } = req.params;
      const { financialYear } = req.query;

      if (!financialYear) {
         return res.status(400).json({ success: false, message: "financialYear query param required" });
      }

      const snapshot = await HisabSnapshot.findOne({ farmerDealerCode, financialYear }).lean();

      res.json({ success: true, data: snapshot ?? null });
   } catch (err) {
      console.error("closing-balance error:", err);
      res.status(500).json({ success: false, message: err.message });
   }
});

export default router;
