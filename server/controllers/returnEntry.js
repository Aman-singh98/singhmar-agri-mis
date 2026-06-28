import ReturnEntry from "../models/ReturnEntry.js";

// GET /api/return-entry — fetch ALL entries
export const getAllReturnEntries = async (req, res) => {
   try {
      const entries = await ReturnEntry.find()
         .populate("dealer", "dealerName farmerDealerCode")
         .sort({ createdAt: -1 });
      res.json(entries);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

// GET /api/return-entry/:id — fetch single entry by entry _id
export const getReturnEntryById = async (req, res) => {
   try {
      const entry = await ReturnEntry.findById(req.params.id)
         .populate("dealer", "dealerName farmerDealerCode");
      if (!entry) return res.status(404).json({ message: "No entry found" });
      res.json(entry);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

// GET /api/return-entry/dealer/:dealerId?fy=22-23 — fetch by dealer + financialYear
// Used by hisab to subtract returned stock from outstanding balance
export const getReturnEntryByDealer = async (req, res) => {
   try {
      const { dealerId } = req.params;
      const { fy } = req.query;

      const query = { dealer: dealerId };
      if (fy) query.financialYear = fy;

      const entries = await ReturnEntry.find(query)
         .populate("dealer", "dealerName farmerDealerCode")
         .sort({ returnDate: -1 });

      res.json(entries);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

// POST /api/return-entry — create (one per dealer+fy enforced by unique index)
export const createReturnEntry = async (req, res) => {
   try {
      const entry = await ReturnEntry.create(req.body);
      const populated = await entry.populate("dealer", "dealerName farmerDealerCode");
      res.status(201).json(populated);
   } catch (err) {
      if (err.code === 11000)
         return res.status(409).json({ message: "A return record for this dealer already exists for the selected financial year. Please edit the existing entry." });
      res.status(400).json({ message: err.message });
   }
};

// PUT /api/return-entry/:id — update by entry _id
export const updateReturnEntry = async (req, res) => {
   try {
      const entry = await ReturnEntry.findByIdAndUpdate(
         req.params.id,
         { $set: req.body },
         { new: true, runValidators: true }
      ).populate("dealer", "dealerName farmerDealerCode");
      if (!entry) return res.status(404).json({ message: "Entry not found" });
      res.json(entry);
   } catch (err) {
      res.status(400).json({ message: err.message });
   }
};

// DELETE /api/return-entry/:id — delete by entry _id
export const deleteReturnEntry = async (req, res) => {
   try {
      const entry = await ReturnEntry.findByIdAndDelete(req.params.id);
      if (!entry) return res.status(404).json({ message: "Entry not found" });
      res.json({ message: "Deleted successfully" });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};
