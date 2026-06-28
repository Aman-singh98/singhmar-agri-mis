// import Inventory from "../../models/Inventory.js";
// import { parseInventorySheet } from "../../utils/Inventoryparsers.js";

// /**
//  * POST /api/inventory
//  * Query params : dealerName, farmerDealerCode, financialYear
//  * Body         : multipart/form-data  field "file" = .xlsx
//  */
// export async function uploadInventory(req, res) {
//    try {
//       if (!req.file) {
//          return res.status(400).json({ success: false, message: "No file uploaded." });
//       }

//       const { dealerName, farmerDealerCode, financialYear } = req.query;

//       if (!financialYear) {
//          return res.status(400).json({ success: false, message: "financialYear query param is required." });
//       }
//       if (!dealerName) {
//          return res.status(400).json({ success: false, message: "dealerName query param is required." });
//       }

//       const { docs, skipped } = parseInventorySheet(
//          req.file.buffer,
//          financialYear,       // "26-27"
//          farmerDealerCode,    // "MP/08"
//          dealerName,          // "RUPASH BASAL"  ← now passed through
//          req.user._id,
//       );

//       if (!docs.length) {
//          return res.status(422).json({ success: false, message: "No valid rows found in the file.", skipped });
//       }

//       const result = await Inventory.insertMany(docs, { ordered: false }).catch(err => {
//          if (err.code === 11000 || err.name === "BulkWriteError") return err;
//          throw err;
//       });

//       const inserted = result?.insertedCount ?? result?.result?.nInserted ?? docs.length;

//       return res.status(201).json({
//          success: true,
//          message: `Upload complete. ${inserted} records inserted.`,
//          financialYear,
//          inserted,
//          skipped,
//       });
//    } catch (err) {
//       console.error("[uploadInventory]", err);
//       return res.status(500).json({ success: false, message: err.message });
//    }
// }

// export async function getInventory(req, res) {
//    try {
//       const { financialYear, farmerDealerCode } = req.query;

//       const filter = {};
//       if (financialYear) filter.financialYear = financialYear;
//       if (farmerDealerCode) filter.farmerDealerCode = farmerDealerCode;

//       const records = await Inventory.find(filter).sort({ date: -1 });

//       return res.status(200).json({ success: true, data: records });
//    } catch (err) {
//       console.error("[getInventory]", err);
//       return res.status(500).json({ success: false, message: err.message });
//    }
// }















import Inventory from "../../models/Inventory.js";
import { parseInventorySheet } from "../../utils/Inventoryparsers.js";

/**
 * POST /api/inventory
 * Query params : dealerName, farmerDealerCode, financialYear
 * Body         : multipart/form-data  field "file" = .xlsx
 */
export async function uploadInventory(req, res) {
   try {
      if (!req.file) {
         return res.status(400).json({ success: false, message: "No file uploaded." });
      }

      const { dealerName, farmerDealerCode, financialYear } = req.query;

      if (!financialYear) {
         return res.status(400).json({ success: false, message: "financialYear query param is required." });
      }
      if (!dealerName) {
         return res.status(400).json({ success: false, message: "dealerName query param is required." });
      }

      const { docs, skipped } = parseInventorySheet(
         req.file.buffer,
         financialYear,
         farmerDealerCode,
         dealerName,
         req.user._id,
      );

      if (!docs.length) {
         return res.status(422).json({ success: false, message: "No valid rows found in the file.", skipped });
      }

      const result = await Inventory.insertMany(docs, { ordered: false }).catch(err => {
         if (err.code === 11000 || err.name === "BulkWriteError") return err;
         throw err;
      });

      const inserted = result?.insertedCount ?? result?.result?.nInserted ?? docs.length;

      return res.status(201).json({
         success: true,
         message: `Upload complete. ${inserted} records inserted.`,
         financialYear,
         inserted,
         skipped,
      });
   } catch (err) {
      console.error("[uploadInventory]", err);
      return res.status(500).json({ success: false, message: err.message });
   }
}

export async function getInventory(req, res) {
   try {
      const { financialYear, farmerDealerCode } = req.query;

      const filter = {};
      if (financialYear) filter.financialYear = financialYear;
      if (farmerDealerCode) filter.farmerDealerCode = farmerDealerCode;

      const records = await Inventory.find(filter).sort({ date: -1 });

      return res.status(200).json({ success: true, data: records });
   } catch (err) {
      console.error("[getInventory]", err);
      return res.status(500).json({ success: false, message: err.message });
   }
}

/**
 * DELETE /api/inventory
 * Query params : dealerName (required), financialYear (required)
 * Deletes ALL inventory records for the given dealer + financial year.
 */
export async function deleteInventory(req, res) {
   try {
      const { dealerName, financialYear } = req.query;

      if (!dealerName || !financialYear) {
         return res.status(400).json({
            success: false,
            message: "Both dealerName and financialYear query params are required.",
         });
      }

      const result = await Inventory.deleteMany({ dealerName, financialYear });

      return res.status(200).json({
         success: true,
         message: `Deleted ${result.deletedCount} inventory records for "${dealerName}" (${financialYear}).`,
         deletedCount: result.deletedCount,
      });
   } catch (err) {
      console.error("[deleteInventory]", err);
      return res.status(500).json({ success: false, message: err.message });
   }
}