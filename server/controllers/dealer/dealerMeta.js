import Dealer from "../../models/Dealer.js";

/* ── Shared Helpers ── */
function validateDealerFields(dealerName, farmerDealerCode) {
  if (!dealerName?.trim() || !farmerDealerCode?.trim()) {
    return "All fields are required";
  }
  return null;
}

// Case-insensitive name check helper
async function isDealerNameTaken(name, excludeId = null) {
  const query = { dealerName: { $regex: `^${name.trim()}$`, $options: "i" } };
  if (excludeId) query._id = { $ne: excludeId };
  return await Dealer.exists(query);
}

/* ── GET all dealers ── */
export async function getAllDealers(req, res) {
  try {
    const dealers = await Dealer.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: dealers });
  } catch (err) {
    console.error("getAllDealers error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

/* ── POST add dealer ── */
export async function addDealer(req, res) {
  try {
    const { dealerName, farmerDealerCode } = req.body;

    const validationError = validateDealerFields(dealerName, farmerDealerCode);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const trimmedCode = farmerDealerCode.trim();
    const trimmedName = dealerName.trim();

    // Primary key: case-insensitive dealer code check
    const codeExists = await Dealer.exists({
      farmerDealerCode: { $regex: `^${trimmedCode}$`, $options: "i" },
    });
    if (codeExists) {
      return res.status(409).json({ success: false, message: "Dealer code already exists" });
    }

    // Secondary key: case-insensitive dealer name check (ram = Ram = RAM)
    const nameTaken = await isDealerNameTaken(trimmedName);
    if (nameTaken) {
      return res.status(409).json({ success: false, message: "Dealer name already exists" });
    }

    const dealer = await Dealer.create({
      dealerName: trimmedName,
      farmerDealerCode: trimmedCode,
      createdBy: req.user?._id,
    });

    return res.status(201).json({ success: true, data: dealer });
  } catch (err) {
    console.error("addDealer error:", err);
    if (err.code === 11000) {
      const field = err.keyPattern?.farmerDealerCode ? "Dealer code" : "Dealer name";
      return res.status(409).json({ success: false, message: `${field} already exists` });
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

/* ── PUT update dealer ── */
export async function updateDealer(req, res) {
  try {
    const { id } = req.params;
    const { dealerName, farmerDealerCode } = req.body;

    const validationError = validateDealerFields(dealerName, farmerDealerCode);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const trimmedCode = farmerDealerCode.trim();
    const trimmedName = dealerName.trim();

    // Primary key: case-insensitive code conflict check
    const codeConflict = await Dealer.exists({
      farmerDealerCode: { $regex: `^${trimmedCode}$`, $options: "i" },
      _id: { $ne: id },
    });
    if (codeConflict) {
      return res.status(409).json({ success: false, message: "Dealer code already used by another dealer" });
    }

    // Secondary key: case-insensitive name conflict check (ram = Ram = RAM)
    const nameConflict = await isDealerNameTaken(trimmedName, id);
    if (nameConflict) {
      return res.status(409).json({ success: false, message: "Dealer name already used by another dealer" });
    }

    const dealer = await Dealer.findByIdAndUpdate(
      id,
      { dealerName: trimmedName, farmerDealerCode: trimmedCode },
      { new: true, runValidators: true }
    );

    if (!dealer) {
      return res.status(404).json({ success: false, message: "Dealer not found" });
    }

    return res.status(200).json({ success: true, data: dealer });
  } catch (err) {
    console.error("updateDealer error:", err);
    if (err.code === 11000) {
      const field = err.keyPattern?.farmerDealerCode ? "Dealer code" : "Dealer name";
      return res.status(409).json({ success: false, message: `${field} already exists` });
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

/* ── DELETE dealer ── */
export async function deleteDealer(req, res) {
  try {
    const { id } = req.params;
    const dealer = await Dealer.findByIdAndDelete(id);

    if (!dealer) {
      return res.status(404).json({ success: false, message: "Dealer not found" });
    }

    return res.status(200).json({ success: true, message: "Dealer deleted successfully" });
  } catch (err) {
    console.error("deleteDealer error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}