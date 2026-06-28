import MainFile from "../models/MainFile.js";
import User from "../models/User.js";
import { parseMainFileSheet } from "../utils/excelParser.js";
import { syncApplicationStatus } from "../utils/syncApplicationStatus.js";
import { syncMismatchErrors } from "../utils/syncApplicationStatus.js"; // ✅ NEW


// ==================== POST: Upload MainFile Sheet ====================
export const uploadMainFileSheet = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const superadmin = await User.findOne({ role: "superadmin" }).select("_id").lean();
    const createdBy = superadmin?._id || null;

    const { docs, skipped } = parseMainFileSheet(req.file.buffer);

    if (docs.length === 0) {
      return res.status(422).json({ success: false, message: "No valid rows found.", skipped });
    }

    const docsWithCreator = docs.map((doc) => ({ ...doc, createdBy }));

    const bulkOps = docsWithCreator.map((doc) => ({
      updateOne: {
        filter: { scanNo: doc.scanNo },
        update: { $setOnInsert: doc },
        upsert: true,
      },
    }));

    const result = await MainFile.bulkWrite(bulkOps, { ordered: false });

    // miNumber wale records ka applicationStatus sync karo
    const miNumbers = [
      ...new Set(docsWithCreator.map((d) => d.miNumber).filter(Boolean)),
    ];
    await syncApplicationStatus(miNumbers);
    await syncMismatchErrors(miNumbers); // ✅ NEW

    const inserted = result.upsertedCount;
    const duplicate = result.matchedCount;

    return res.status(201).json({
      success: true,
      message: `${inserted} new records inserted, ${duplicate} duplicates skipped.`,
      inserted,
      duplicate,
      skipped,
    });
  } catch (error) {
    console.error("uploadMainFileSheet error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ==================== POST: Create Single MainFile Record ====================
// POST /api/mainfile
export const createMainFile = async (req, res) => {
  try {
    const createdBy = req.user?._id || req.user?.id || null;

    const { miNumber, ...rest } = req.body;

    let financialYear = null;
    if (miNumber?.trim()) {
      const match = miNumber.trim().match(/MI(\d{2})(\d{2})/i);
      if (match) financialYear = `20${match[1]}-${match[2]}`;
    }

    const srNoFilter = financialYear ? { financialYear } : {};
    const lastRecord = await MainFile.findOne(srNoFilter)
      .sort({ srNo: -1 })
      .select("srNo")
      .lean();
    const srNo = (lastRecord?.srNo || 0) + 1;

    const doc = new MainFile({
      ...rest,
      miNumber: miNumber?.trim() || null,
      financialYear,
      srNo,
      createdBy,
    });

    await doc.save();

    if (doc.miNumber) {
      await syncApplicationStatus(doc.miNumber);
      await syncMismatchErrors([doc.miNumber]); // ✅ NEW
    }

    // Re-fetch with updated applicationStatus + populated createdBy
    const populated = await MainFile.findById(doc._id)
      .populate("createdBy", "name role")
      .lean();

    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error("createMainFile error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ==================== GET: All MainFile Records ====================
// GET /api/mainfile?financialYear=&farmerDealerCode=&name=&miNumber=&block=&district=&page=&limit=
export const getAllMainFile = async (req, res) => {
  try {
    const {
      financialYear, farmerDealerCode, name, miNumber,
      brandName, block, district, irrigationType,
      applicationStatus, page = 1, limit = 0,
    } = req.query;

    const filter = {};
    if (financialYear)     filter.financialYear     = financialYear;
    if (farmerDealerCode)  filter.farmerDealerCode  = { $regex: farmerDealerCode, $options: "i" };
    if (name)              filter.name              = { $regex: name, $options: "i" };
    if (miNumber)          filter.miNumber          = { $regex: miNumber, $options: "i" };
    if (brandName)         filter.brandName         = { $regex: brandName, $options: "i" };
    if (block)             filter.block             = { $regex: block, $options: "i" };
    if (district)          filter.district          = { $regex: district, $options: "i" };
    if (irrigationType)    filter.irrigationType    = { $regex: irrigationType, $options: "i" };
    if (applicationStatus) filter.applicationStatus = { $regex: applicationStatus, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      MainFile.find(filter)
        .populate("createdBy", "name role")
        .sort({ srNo: 1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      MainFile.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true, total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data,
    });
  } catch (error) {
    console.error("getAllMainFile error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ==================== GET: Single MainFile Record ====================
export const getMainFileById = async (req, res) => {
  try {
    const record = await MainFile.findById(req.params.id)
      .populate("createdBy", "name role")
      .lean();
    if (!record) return res.status(404).json({ success: false, message: "Record not found." });
    return res.status(200).json({ success: true, data: record });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ==================== PUT: Update MainFile Record ====================
export const updateMainFile = async (req, res) => {
  try {
    const { miNumber, financialYear: fyFromBody, ...rest } = req.body;

    // Agar miNumber update ho raha hai to financialYear re-calculate karo
    let financialYear = fyFromBody ?? undefined;
    if (miNumber !== undefined) {
      if (miNumber?.trim()) {
        const match = miNumber.trim().match(/MI(\d{2})(\d{2})/i);
        financialYear = match ? `20${match[1]}-${match[2]}` : null;
      } else {
        financialYear = null;
      }
    }

    const updateData = {
      ...rest,
      ...(miNumber !== undefined && { miNumber: miNumber?.trim() || null }),
      ...(financialYear !== undefined && { financialYear }),
    };

    const updated = await MainFile.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: false }
    )
      .populate("createdBy", "name role")
      .lean();

    if (!updated) return res.status(404).json({ success: false, message: "Record not found." });

    if (updated.miNumber) {
      await syncApplicationStatus(updated.miNumber);
      await syncMismatchErrors([updated.miNumber]); // ✅ NEW

      // Sync ke baad fresh data fetch karo (applicationStatus + error updated hoga)
      const fresh = await MainFile.findById(updated._id)
        .populate("createdBy", "name role")
        .lean();

      return res.status(200).json({ success: true, data: fresh });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ==================== DELETE: Single MainFile Record ====================
export const deleteMainFile = async (req, res) => {
  try {
    const deleted = await MainFile.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Record not found." });
    return res.status(200).json({ success: true, message: "Record deleted." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ==================== DELETE: Bulk Delete by Financial Year ====================
export const bulkDeleteMainFile = async (req, res) => {
  try {
    const { financialYear } = req.body;
    if (!financialYear)
      return res.status(400).json({ success: false, message: "financialYear is required." });
    const result = await MainFile.deleteMany({ financialYear });
    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} records deleted for FY ${financialYear}.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};