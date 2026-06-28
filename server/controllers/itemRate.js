import ItemRate from "../models/ItemRate.js";

// ─── GET all items ────────────────────────────────────────────────────────────
// GET /api/item-rates
export const getItemRates = async (req, res) => {
   try {
      const items = await ItemRate.find().sort({ itemName: 1 }).lean();
      return res.status(200).json({ data: items });
   } catch (err) {
      console.error("getItemRates error:", err);
      return res
         .status(500)
         .json({ message: err.message || "Internal server error" });
   }
};

// ─── ADD a single item ────────────────────────────────────────────────────────
// POST /api/item-rates
// Body: { itemName, rateUpto, rateFrom }
export const addItemRate = async (req, res) => {
   try {
      const { itemName, rateUpto, rateFrom } = req.body;

      if (!itemName || rateUpto == null || rateFrom == null) {
         return res.status(400).json({
            message: "itemName, rateUpto and rateFrom are required",
         });
      }

      const item = await ItemRate.create({ itemName, rateUpto, rateFrom });

      return res.status(201).json({
         message: "Item added successfully",
         data: item,
      });
   } catch (err) {
      if (err.code === 11000) {
         return res.status(409).json({
            message: `Item "${req.body.itemName}" already exists`,
         });
      }
      console.error("addItemRate error:", err);
      return res
         .status(500)
         .json({ message: err.message || "Internal server error" });
   }
};

// ─── ADD multiple items at once ───────────────────────────────────────────────
// POST /api/item-rates/bulk
// Body: { items: [{ itemName, rateUpto, rateFrom }, ...] }
export const addItemRatesBulk = async (req, res) => {
   try {
      const { items } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
         return res.status(400).json({
            message: "A non-empty items array is required",
         });
      }

      const documents = items.map((item) => ({
         itemName: item.itemName,
         rateUpto: item.rateUpto,
         rateFrom: item.rateFrom,
      }));

      const result = await ItemRate.insertMany(documents, {
         ordered: false,
         rawResult: true,
      });

      return res.status(201).json({
         message: "Items added successfully",
         insertedCount: result.insertedCount,
      });
   } catch (err) {
      if (err.code === 11000 || err.writeErrors) {
         const insertedCount = err.insertedDocs?.length ?? 0;
         const skipped = err.writeErrors?.length ?? 0;
         return res.status(207).json({
            message: `${insertedCount} item(s) added. ${skipped} duplicate(s) skipped.`,
            insertedCount,
            skippedCount: skipped,
         });
      }
      console.error("addItemRatesBulk error:", err);
      return res
         .status(500)
         .json({ message: err.message || "Internal server error" });
   }
};

// ─── UPDATE an item ───────────────────────────────────────────────────────────
// PATCH /api/item-rates/:id
// Body: { itemName?, rateUpto?, rateFrom? }
export const updateItemRate = async (req, res) => {
   try {
      const { itemName, rateUpto, rateFrom } = req.body;

      const update = {};
      if (itemName != null) update.itemName = itemName;
      if (rateUpto != null) update.rateUpto = rateUpto;
      if (rateFrom != null) update.rateFrom = rateFrom;

      if (Object.keys(update).length === 0) {
         return res.status(400).json({ message: "No fields provided to update" });
      }

      const item = await ItemRate.findByIdAndUpdate(
         req.params.id,
         { $set: update },
         { new: true, runValidators: true }
      );

      if (!item) {
         return res.status(404).json({ message: "Item not found" });
      }

      return res.status(200).json({
         message: "Item updated successfully",
         data: item,
      });
   } catch (err) {
      if (err.code === 11000) {
         return res.status(409).json({
            message: "An item with that name already exists",
         });
      }
      console.error("updateItemRate error:", err);
      return res
         .status(500)
         .json({ message: err.message || "Internal server error" });
   }
};

// ─── DELETE a single item ─────────────────────────────────────────────────────
// DELETE /api/item-rates/:id
export const deleteItemRate = async (req, res) => {
   try {
      const item = await ItemRate.findByIdAndDelete(req.params.id);

      if (!item) {
         return res.status(404).json({ message: "Item not found" });
      }

      return res.status(200).json({ message: "Item deleted successfully" });
   } catch (err) {
      console.error("deleteItemRate error:", err);
      return res
         .status(500)
         .json({ message: err.message || "Internal server error" });
   }
};