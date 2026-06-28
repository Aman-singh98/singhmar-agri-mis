
// import Micada from "../models/Micada.js";
// import { parseMicadaSheet } from "../utils/excelParser.js";
// import { getShortStatus } from "../constant/micadaStatusMap.js";
// import { syncApplicationStatus } from "../utils/syncApplicationStatus.js"; // ✅ NEW
// import crypto from "crypto";

// // ── Helper: Generate unique hash for entire record
// // NOTE: shortStatus is intentionally NOT included here — it's a derived
// // value computed from currentStatus, so hashing it would be redundant
// // and would change the hash every time the mapping table is edited.
// const generateRecordHash = (doc) => {
//   const recordData = JSON.stringify({
//     appId: doc.appId,
//     programmeName: doc.programmeName,
//     farmerName: doc.farmerName,
//     village: doc.village,
//     block: doc.block,
//     district: doc.district,
//     mobile: doc.mobile,
//     address: doc.address,
//     dateOfApplication: doc.dateOfApplication,
//     totalArea: doc.totalArea,
//     currentStatus: doc.currentStatus,
//     remarks: doc.remarks,
//     status: doc.status,
//   });

//   return crypto.createHash("sha256").update(recordData).digest("hex");
// };

// // ==================== POST: Upload Micada Sheet ====================
// // POST /api/micada/upload
// // ✅ FIXED: Uses record hash to prevent exact duplicates while keeping all data
// // ✅ NEW: Auto-derives shortStatus from currentStatus via micadaStatusMap.js
// // ✅ NEW: Syncs MainFile.applicationStatus after upload
// export const uploadMicadaSheet = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No file uploaded.",
//       });
//     }

//     const { docs, skipped } = parseMicadaSheet(req.file.buffer);

//     if (docs.length === 0) {
//       return res.status(422).json({
//         success: false,
//         message: "No valid rows found in the sheet.",
//         skipped,
//       });
//     }

//     // ✅ ADD shortStatus + HASH TO EACH DOCUMENT
//     const unmatchedStatuses = [];

//     const docsWithHash = docs.map((doc) => {
//       const shortStatus = getShortStatus(doc.status);

//       if (doc.status && !shortStatus) {
//         unmatchedStatuses.push({ appId: doc.appId, status: doc.status });
//       }

//       const docWithShortStatus = { ...doc, shortStatus };

//       return {
//         ...docWithShortStatus,
//         recordHash: generateRecordHash(docWithShortStatus),
//       };
//     });

//     // ✅ UPSERT LOGIC: Check by recordHash + financialYear
//     const bulkOps = docsWithHash.map((doc) => ({
//       updateOne: {
//         filter: {
//           recordHash: doc.recordHash,
//           financialYear: doc.financialYear,
//         },
//         update: { $set: doc },
//         upsert: true,
//       },
//     }));

//     const result = await Micada.bulkWrite(bulkOps, { ordered: false });

//     // ✅ FIX: Poora docsWithHash array pass karo (appIds nahi)
//     // syncApplicationStatus docs array detect karega aur sheet ki LAST ROW ka shortStatus lega
//     // Same appId ke multiple rows → last occurrence = sheet ka neeche wala row = latest status
//     await syncApplicationStatus(docsWithHash);

//     const financialYears = [...new Set(docs.map((d) => d.financialYear))];

//     return res.status(201).json({
//       success: true,
//       message: `${result.upsertedCount} new records added, ${result.modifiedCount} records updated.`,
//       upserted: result.upsertedCount,
//       updated: result.modifiedCount,
//       total: docs.length,
//       financialYears,
//       skipped,
//       unmatchedStatusCount: unmatchedStatuses.length,
//       unmatchedStatuses,
//     });
//   } catch (error) {
//     console.error("uploadMicadaSheet error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== GET: All Micada Records ====================
// // GET /api/micada?financialYear=&appId=&farmerName=&block=&district=&page=&limit=
// export const getAllMicada = async (req, res) => {
//   try {
//     const {
//       financialYear,
//       appId,
//       farmerName,
//       village,
//       block,
//       district,
//       currentStatus,
//       shortStatus,
//       page = 1,
//       limit = 20,
//     } = req.query;

//     const filter = {};

//     if (financialYear) filter.financialYear = financialYear;
//     if (appId) filter.appId = { $regex: appId, $options: "i" };
//     if (farmerName) filter.farmerName = { $regex: farmerName, $options: "i" };
//     if (village) filter.village = { $regex: village, $options: "i" };
//     if (block) filter.block = { $regex: block, $options: "i" };
//     if (district) filter.district = { $regex: district, $options: "i" };
//     if (currentStatus)
//       filter.currentStatus = { $regex: currentStatus, $options: "i" };
//     if (shortStatus)
//       filter.shortStatus = { $regex: shortStatus, $options: "i" };

//     const skip = (Number(page) - 1) * Number(limit);

//     const [data, total] = await Promise.all([
//       Micada.find(filter)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(Number(limit))
//         .lean(),
//       Micada.countDocuments(filter),
//     ]);

//     return res.status(200).json({
//       success: true,
//       total,
//       page: Number(page),
//       pages: Math.ceil(total / Number(limit)),
//       data,
//     });
//   } catch (error) {
//     console.error("getAllMicada error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== GET: Single Micada Record ====================
// // GET /api/micada/:id
// export const getMicadaById = async (req, res) => {
//   try {
//     const record = await Micada.findById(req.params.id).lean();

//     if (!record) {
//       return res.status(404).json({
//         success: false,
//         message: "Record not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: record,
//     });
//   } catch (error) {
//     console.error("getMicadaById error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== PUT: Update Micada Record ====================
// // PUT /api/micada/:id
// // ✅ NEW: Recalculates shortStatus if status was edited
// // ✅ NEW: Syncs MainFile.applicationStatus after update
// export const updateMicada = async (req, res) => {
//   try {
//     const shortStatus =
//       "status" in req.body ? getShortStatus(req.body.status) : undefined;

//     const updatedDoc = {
//       ...req.body,
//       ...(shortStatus !== undefined ? { shortStatus } : {}),
//     };
//     updatedDoc.recordHash = generateRecordHash(updatedDoc);

//     const updated = await Micada.findByIdAndUpdate(
//       req.params.id,
//       { $set: updatedDoc },
//       { new: true, runValidators: true }
//     ).lean();

//     if (!updated) {
//       return res.status(404).json({
//         success: false,
//         message: "Record not found.",
//       });
//     }

//     // ✅ NEW: Micada update ke baad MainFile sync karo
//     if (updated.appId) {
//       await syncApplicationStatus(updated.appId);
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Record updated successfully.",
//       data: updated,
//     });
//   } catch (error) {
//     console.error("updateMicada error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== DELETE: Single Micada Record ====================
// // DELETE /api/micada/:id
// export const deleteMicada = async (req, res) => {
//   try {
//     const deleted = await Micada.findByIdAndDelete(req.params.id);

//     if (!deleted) {
//       return res.status(404).json({
//         success: false,
//         message: "Record not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Record deleted successfully.",
//     });
//   } catch (error) {
//     console.error("deleteMicada error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== DELETE: Bulk Delete by Financial Year ====================
// // DELETE /api/micada/bulk
// export const bulkDeleteMicada = async (req, res) => {
//   try {
//     const { financialYear } = req.body;

//     if (!financialYear) {
//       return res.status(400).json({
//         success: false,
//         message: "financialYear is required.",
//       });
//     }

//     const result = await Micada.deleteMany({ financialYear });

//     return res.status(200).json({
//       success: true,
//       message: `${result.deletedCount} records deleted for FY ${financialYear}.`,
//       deleted: result.deletedCount,
//     });
//   } catch (error) {
//     console.error("bulkDeleteMicada error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== GET: Statistics by Financial Year ====================
// // GET /api/micada/stats/summary
// export const getMicadaStats = async (req, res) => {
//   try {
//     const stats = await Micada.aggregate([
//       {
//         $group: {
//           _id: "$financialYear",
//           totalRecords: { $sum: 1 },
//           totalArea: { $sum: "$totalArea" },
//         },
//       },
//       { $sort: { _id: -1 } },
//     ]);

//     return res.status(200).json({
//       success: true,
//       data: stats,
//     });
//   } catch (error) {
//     console.error("getMicadaStats error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==================== GET: Records by MI Number ====================
// // GET /api/micada/mi/:appId
// export const getMicadaByMINumber = async (req, res) => {
//   try {
//     const { appId } = req.params;

//     const records = await Micada.find({ appId })
//       .sort({ createdAt: -1 })
//       .lean();

//     if (!records || records.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: `No records found for MI number: ${appId}`,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       total: records.length,
//       data: records,
//     });
//   } catch (error) {
//     console.error("getMicadaByMINumber error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };










import Micada from "../models/Micada.js";
import { parseMicadaSheet } from "../utils/excelParser.js";
import { getShortStatus } from "../constant/micadaStatusMap.js";
import { syncApplicationStatus } from "../utils/syncApplicationStatus.js";
import { syncMismatchErrors } from "../utils/syncApplicationStatus.js"; // ✅ NEW
import crypto from "crypto";

// ── Helper: Generate unique hash for entire record
// NOTE: shortStatus is intentionally NOT included here — it's a derived
// value computed from currentStatus, so hashing it would be redundant
// and would change the hash every time the mapping table is edited.
const generateRecordHash = (doc) => {
  const recordData = JSON.stringify({
    appId: doc.appId,
    programmeName: doc.programmeName,
    farmerName: doc.farmerName,
    village: doc.village,
    block: doc.block,
    district: doc.district,
    mobile: doc.mobile,
    address: doc.address,
    dateOfApplication: doc.dateOfApplication,
    totalArea: doc.totalArea,
    currentStatus: doc.currentStatus,
    remarks: doc.remarks,
    status: doc.status,
  });

  return crypto.createHash("sha256").update(recordData).digest("hex");
};

// ==================== POST: Upload Micada Sheet ====================
// POST /api/micada/upload
// ✅ FIXED: Uses record hash to prevent exact duplicates while keeping all data
// ✅ NEW: Auto-derives shortStatus from currentStatus via micadaStatusMap.js
// ✅ NEW: Syncs MainFile.applicationStatus after upload
// ✅ NEW: Syncs MainFile.error after MICADA comparison
export const uploadMicadaSheet = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const { docs, skipped } = parseMicadaSheet(req.file.buffer);

    if (docs.length === 0) {
      return res.status(422).json({
        success: false,
        message: "No valid rows found in the sheet.",
        skipped,
      });
    }

    // ✅ ADD shortStatus + HASH TO EACH DOCUMENT
    const unmatchedStatuses = [];

    const docsWithHash = docs.map((doc) => {
      const shortStatus = getShortStatus(doc.status);

      if (doc.status && !shortStatus) {
        unmatchedStatuses.push({ appId: doc.appId, status: doc.status });
      }

      const docWithShortStatus = { ...doc, shortStatus };

      return {
        ...docWithShortStatus,
        recordHash: generateRecordHash(docWithShortStatus),
      };
    });

    // ✅ UPSERT LOGIC: Check by recordHash + financialYear
    const bulkOps = docsWithHash.map((doc) => ({
      updateOne: {
        filter: {
          recordHash: doc.recordHash,
          financialYear: doc.financialYear,
        },
        update: { $set: doc },
        upsert: true,
      },
    }));

    const result = await Micada.bulkWrite(bulkOps, { ordered: false });

    // ✅ Poora docsWithHash array pass karo (appIds nahi)
    // syncApplicationStatus docs array detect karega aur sheet ki LAST ROW ka shortStatus lega
    // Same appId ke multiple rows → last occurrence = sheet ka neeche wala row = latest status
    await syncApplicationStatus(docsWithHash);

    // ✅ NEW: MICADA upload ke baad mismatch errors sync karo
    const affectedMiNumbers = [
      ...new Set(docsWithHash.map((d) => d.appId).filter(Boolean)),
    ];
    await syncMismatchErrors(affectedMiNumbers);

    const financialYears = [...new Set(docs.map((d) => d.financialYear))];

    return res.status(201).json({
      success: true,
      message: `${result.upsertedCount} new records added, ${result.modifiedCount} records updated.`,
      upserted: result.upsertedCount,
      updated: result.modifiedCount,
      total: docs.length,
      financialYears,
      skipped,
      unmatchedStatusCount: unmatchedStatuses.length,
      unmatchedStatuses,
    });
  } catch (error) {
    console.error("uploadMicadaSheet error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET: All Micada Records ====================
// GET /api/micada?financialYear=&appId=&farmerName=&block=&district=&page=&limit=
export const getAllMicada = async (req, res) => {
  try {
    const {
      financialYear,
      appId,
      farmerName,
      village,
      block,
      district,
      currentStatus,
      shortStatus,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (financialYear) filter.financialYear = financialYear;
    if (appId) filter.appId = { $regex: appId, $options: "i" };
    if (farmerName) filter.farmerName = { $regex: farmerName, $options: "i" };
    if (village) filter.village = { $regex: village, $options: "i" };
    if (block) filter.block = { $regex: block, $options: "i" };
    if (district) filter.district = { $regex: district, $options: "i" };
    if (currentStatus)
      filter.currentStatus = { $regex: currentStatus, $options: "i" };
    if (shortStatus)
      filter.shortStatus = { $regex: shortStatus, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      Micada.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Micada.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data,
    });
  } catch (error) {
    console.error("getAllMicada error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET: Single Micada Record ====================
// GET /api/micada/:id
export const getMicadaById = async (req, res) => {
  try {
    const record = await Micada.findById(req.params.id).lean();

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("getMicadaById error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== PUT: Update Micada Record ====================
// PUT /api/micada/:id
// ✅ NEW: Recalculates shortStatus if status was edited
// ✅ NEW: Syncs MainFile.applicationStatus after update
// ✅ NEW: Syncs MainFile.error after MICADA comparison
export const updateMicada = async (req, res) => {
  try {
    const shortStatus =
      "status" in req.body ? getShortStatus(req.body.status) : undefined;

    const updatedDoc = {
      ...req.body,
      ...(shortStatus !== undefined ? { shortStatus } : {}),
    };
    updatedDoc.recordHash = generateRecordHash(updatedDoc);

    const updated = await Micada.findByIdAndUpdate(
      req.params.id,
      { $set: updatedDoc },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Record not found.",
      });
    }

    if (updated.appId) {
      // ✅ applicationStatus sync
      await syncApplicationStatus(updated.appId);
      // ✅ NEW: Mismatch error sync
      await syncMismatchErrors(updated.appId);
    }

    return res.status(200).json({
      success: true,
      message: "Record updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("updateMicada error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== DELETE: Single Micada Record ====================
// DELETE /api/micada/:id
export const deleteMicada = async (req, res) => {
  try {
    const deleted = await Micada.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Record deleted successfully.",
    });
  } catch (error) {
    console.error("deleteMicada error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== DELETE: Bulk Delete by Financial Year ====================
// DELETE /api/micada/bulk
export const bulkDeleteMicada = async (req, res) => {
  try {
    const { financialYear } = req.body;

    if (!financialYear) {
      return res.status(400).json({
        success: false,
        message: "financialYear is required.",
      });
    }

    const result = await Micada.deleteMany({ financialYear });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} records deleted for FY ${financialYear}.`,
      deleted: result.deletedCount,
    });
  } catch (error) {
    console.error("bulkDeleteMicada error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET: Statistics by Financial Year ====================
// GET /api/micada/stats/summary
export const getMicadaStats = async (req, res) => {
  try {
    const stats = await Micada.aggregate([
      {
        $group: {
          _id: "$financialYear",
          totalRecords: { $sum: 1 },
          totalArea: { $sum: "$totalArea" },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("getMicadaStats error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET: Records by MI Number ====================
// GET /api/micada/mi/:appId
export const getMicadaByMINumber = async (req, res) => {
  try {
    const { appId } = req.params;

    const records = await Micada.find({ appId })
      .sort({ createdAt: -1 })
      .lean();

    if (!records || records.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No records found for MI number: ${appId}`,
      });
    }

    return res.status(200).json({
      success: true,
      total: records.length,
      data: records,
    });
  } catch (error) {
    console.error("getMicadaByMINumber error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};