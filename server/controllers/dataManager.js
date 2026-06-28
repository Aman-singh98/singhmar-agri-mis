import MainFile from "../models/MainFile.js";
import TallyBill from "../models/Tallybill.js";
import TdsRecord from "../models/TdsRecord.js";
import SubsidyRecord from "../models/Subsidy.js";
import Receipt from "../models/materialDispatchDetails/Receipt.js";
import Inventory from "../models/Inventory.js";
import Micada from "../models/Micada.js";
import AdjustedSheet from "../models/materialDispatchDetails/AdjustedSheet.js";
import MaterialDispatched from "../models/materialDispatchDetails/MaterialDispatched.js";
import MainRecord from "../models/MainRecord.js";
import FarmerShareDetail from "../models/FarmerShareDetail.js";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function sumField(arr, field) {
   return arr.reduce((acc, doc) => acc + (Number(doc[field]) || 0), 0);
}

function round2(n) {
   return Math.round(n * 100) / 100;
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual section builders
// ─────────────────────────────────────────────────────────────────────────────

async function buildMainFile(fy) {
   const records = await MainFile.find({ financialYear: fy })
      .populate("createdBy", "name role")   // ← sirf yeh line add karo
      .lean();

   const dealerSet = new Set(records.map((r) => r.farmerDealerCode).filter(Boolean));

   const summary = {
      totalRecords: records.length,
      totalAreaAcre: round2(sumField(records, "areaInAcre")),
      totalDealers: dealerSet.size,
   };

   return { summary, records };
}

async function buildTallyBill(fy) {
   const records = await TallyBill.find({ financialYear: fy }).lean();

   const summary = {
      totalRecords: records.length,
      totalBillValue: round2(sumField(records, "billValue")),
      totalEstimateAmount: round2(sumField(records, "estimateAmount")),
      totalDifference: round2(sumField(records, "difference")),
      totalGst: round2(sumField(records, "gst")),
      totalNetAmount: round2(sumField(records, "netAmount")),
   };

   return { summary, records };
}

async function buildTdsRecord(fy) {
   const records = await TdsRecord.find({ financialYear: fy }).lean();

   const summary = {
      totalRecords: records.length,
      totalTurnover: round2(sumField(records, "turnover")),
      totalCommission: round2(sumField(records, "commissionAmount")),
      totalTds: round2(sumField(records, "tds")),
      totalPayable: round2(sumField(records, "payableAmount")),
   };

   return { summary, records };
}

async function buildSubsidy(fy) {
   const records = await SubsidyRecord.find({ financialYear: fy }).lean();

   const summary = {
      totalRecords: records.length,
      totalAreaAcre: round2(sumField(records, "areaInAcre")),
      totalAssistance: round2(sumField(records, "assistanceToBePaid")),
      totalBillValue: round2(sumField(records, "billValue")),
   };

   return { summary, records };
}

async function buildMaterialDispatch(fy) {
   const [dispatched, receipts, adjusted] = await Promise.all([
      MaterialDispatched.find({ financialYear: fy }).lean(),
      Receipt.find({ financialYear: fy }).lean(),
      AdjustedSheet.find({ financialYear: fy }).lean(),
   ]);

   const summary = {
      totalDispatched: dispatched.length,
      totalReceipts: receipts.length,
      totalAdjusted: adjusted.length,
      totalMiniAcres: round2(sumField(dispatched, "miniAcres")),
      totalDripAcres: round2(sumField(dispatched, "dripAcres")),
      totalHdpeAcres: round2(sumField(dispatched, "hdpeAcres")),
      totalMiniFarmerShare: round2(sumField(dispatched, "miniFarmerShare")),
      totalDripFarmerShare: round2(sumField(dispatched, "dripFarmerShare")),
      totalHdpeFarmerShare: round2(sumField(dispatched, "hdpeFarmerShare")),
      totalAmountReceived: round2(sumField(receipts, "amount")),
   };

   return { summary, dispatched, receipts, adjusted };
}

async function buildInventory(fy) {
   const records = await Inventory.find({ financialYear: fy }).lean();

   const dealerSet = new Set(records.map((r) => r.farmerDealerCode).filter(Boolean));

   const summary = {
      totalRecords: records.length,
      totalAcres: round2(records.reduce((acc, r) => acc + (Number(r.acre) || 0), 0)),
      totalItems: records.reduce((acc, r) => acc + (Number(r.totalItems) || 0), 0),
      totalDealers: dealerSet.size,
   };

   return { summary, records };
}

async function buildMicada(fy) {
   const records = await Micada.find({ financialYear: fy }).lean();

   const summary = {
      totalRecords: records.length,
      totalAreaAcre: round2(sumField(records, "totalArea")),
   };

   return { summary, records };
}

async function buildMainFYSheet(fy) {
   const records = await MainRecord.find({ financialYear: fy }).lean();

   const dealerSet = new Set(records.map((r) => r.farmerDealerCode).filter(Boolean));

   const summary = {
      totalRecords: records.length,
      totalAreaAcre: round2(sumField(records, "areaInAcre")),
      totalDealers: dealerSet.size,
      totalBillValue: round2(sumField(records, "billValue")),
      totalFarmerShare: round2(sumField(records, "farmerShare")),
   };

   return { summary, records };
}

async function buildFarmerShareDetail(fy) {
   const records = await FarmerShareDetail.find({ financialYear: fy }).lean();

   const dealerSet = new Set(records.map((r) => r.farmerDealerCode).filter(Boolean));

   const summary = {
      totalRecords: records.length,
      totalDealers: dealerSet.size,
      totalAreaAcre: round2(sumField(records, "areaInAcre")),
      totalEstimateAmount: round2(sumField(records, "estimateAmount")),
      totalFarmerShare: round2(sumField(records, "farmerShare")),
      totalFarmerShareDeposit: round2(sumField(records, "farmerShareDeposit")),
      totalReturnFarmerShare: round2(sumField(records, "returnFarmerShare")),
      totalDifference: round2(sumField(records, "difference")),
   };

   return { summary, records };
}

// ─────────────────────────────────────────────────────────────────────────────
// Collection → model map  (used by delete)
// ─────────────────────────────────────────────────────────────────────────────

const COLLECTION_MODEL_MAP = {
   mainFile: MainFile,
   tallyBill: TallyBill,
   tdsRecord: TdsRecord,
   subsidy: SubsidyRecord,
   materialDispatch: [MaterialDispatched, Receipt, AdjustedSheet],
   inventory: Inventory,
   micada: Micada,
   mainFYSheet: MainRecord,
   farmerShareDetail: FarmerShareDetail,
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/data/summary?financialYear=26-27
// ─────────────────────────────────────────────────────────────────────────────

export async function getSummary(req, res) {
   try {
      const { financialYear } = req.query;

      if (!financialYear) {
         return res.status(400).json({ success: false, message: "financialYear is required" });
      }

      // Run all queries in parallel for speed
      const [
         mainFile,
         tallyBill,
         tdsRecord,
         subsidy,
         materialDispatch,
         inventory,
         micada,
         mainFYSheet,
         farmerShareDetail,
      ] = await Promise.all([
         buildMainFile(financialYear),
         buildTallyBill(financialYear),
         buildTdsRecord(financialYear),
         buildSubsidy(financialYear),
         buildMaterialDispatch(financialYear),
         buildInventory(financialYear),
         buildMicada(financialYear),
         buildMainFYSheet(financialYear),
         buildFarmerShareDetail(financialYear),
      ]);

      // Return null if absolutely no data found across all sections
      const hasData =
         mainFile.records.length > 0 ||
         tallyBill.records.length > 0 ||
         tdsRecord.records.length > 0 ||
         subsidy.records.length > 0 ||
         materialDispatch.dispatched.length > 0 ||
         inventory.records.length > 0 ||
         micada.records.length > 0 ||
         mainFYSheet.records.length > 0 ||
         farmerShareDetail.records.length > 0;

      if (!hasData) {
         return res.status(200).json({ success: false, message: "No data found for this financial year" });
      }

      return res.status(200).json({
         success: true,
         financialYear,
         mainFile,
         tallyBill,
         tdsRecord,
         subsidy,
         materialDispatch,
         inventory,
         micada,
         mainFYSheet,
         farmerShareDetail,
      });
   } catch (err) {
      console.error("[getSummary]", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
   }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/data?financialYear=26-27&collections=mainFile
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteCollection(req, res) {
   try {
      const { financialYear, collections } = req.query;

      if (!financialYear || !collections) {
         return res.status(400).json({
            success: false,
            message: "financialYear and collections are required",
         });
      }

      const target = COLLECTION_MODEL_MAP[collections];

      if (!target) {
         return res.status(400).json({
            success: false,
            message: `Unknown collection: "${collections}". Valid values: ${Object.keys(COLLECTION_MODEL_MAP).join(", ")}`,
         });
      }

      // materialDispatch touches 3 models at once
      if (Array.isArray(target)) {
         const results = await Promise.all(
            target.map((Model) => Model.deleteMany({ financialYear }))
         );
         const totalDeleted = results.reduce((acc, r) => acc + r.deletedCount, 0);
         return res.status(200).json({
            success: true,
            message: `Deleted ${totalDeleted} records from ${collections} for FY ${financialYear}`,
            deletedCount: totalDeleted,
         });
      }

      const result = await target.deleteMany({ financialYear });

      return res.status(200).json({
         success: true,
         message: `Deleted ${result.deletedCount} records from ${collections} for FY ${financialYear}`,
         deletedCount: result.deletedCount,
      });
   } catch (err) {
      console.error("[deleteCollection]", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
   }
}
