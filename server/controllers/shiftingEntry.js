import ShiftingEntry from "../models/ShiftingEntry.js";

// GET /api/shifting-entry — fetch ALL entries
export const getAllEntries = async (req, res) => {
   try {
      const entries = await ShiftingEntry.find()
         .populate("dealer", "dealerName farmerDealerCode")
         .sort({ createdAt: -1 });
      res.json(entries);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

// GET /api/shifting-entry/:id — fetch single entry by entry _id
export const getEntryById = async (req, res) => {
   try {
      const entry = await ShiftingEntry.findById(req.params.id)
         .populate("dealer", "dealerName farmerDealerCode");
      if (!entry) return res.status(404).json({ message: "No entry found" });
      res.json(entry);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

// POST /api/shifting-entry — create (one per dealer enforced by unique index)
export const createEntry = async (req, res) => {
   try {
      const entry = await ShiftingEntry.create(req.body);
      const populated = await entry.populate("dealer", "dealerName farmerDealerCode");
      res.status(201).json(populated);
   } catch (err) {
      if (err.code === 11000)
         return res.status(409).json({ message: "A record for this dealer already exists. Please check the Saved Entries table." });
      res.status(400).json({ message: err.message });
   }
};

// PUT /api/shifting-entry/:id — update by entry _id
export const updateEntry = async (req, res) => {
   try {
      const entry = await ShiftingEntry.findByIdAndUpdate(
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

// DELETE /api/shifting-entry/:id — delete by entry _id
export const deleteEntry = async (req, res) => {
   try {
      const entry = await ShiftingEntry.findByIdAndDelete(req.params.id);
      if (!entry) return res.status(404).json({ message: "Entry not found" });
      res.json({ message: "Deleted successfully" });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};
