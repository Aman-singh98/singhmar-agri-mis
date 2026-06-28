// // import TallyBill from "../models/Tallybill.js";
// // import { parseTallyBillSheet } from "../utils/TallybillParsers.js";

// // export async function uploadTallyBill(req, res) {
// //    try {
// //       if (!req.file) {
// //          return res.status(400).json({ success: false, message: "No file uploaded." });
// //       }

// //       const dealerName = req.query.dealerName ?? req.body.dealerName;
// //       const farmerDealerCode = req.query.farmerDealerCode ?? req.body.farmerDealerCode;
// //       const financialYear = req.query.financialYear ?? req.body.financialYear;

// //       if (!financialYear) {
// //          return res.status(400).json({ success: false, message: "financialYear is required." });
// //       }

// //       const { docs, skipped } = parseTallyBillSheet(
// //          req.file.buffer,
// //          financialYear,
// //          dealerName,
// //          farmerDealerCode,
// //       );

// //       if (!docs.length) {
// //          return res.status(422).json({ success: false, message: "No valid rows found in the file.", skipped });
// //       }

// //       const result = await TallyBill.insertMany(docs, { ordered: false }).catch(err => {
// //          if (err.code === 11000 || err.name === "BulkWriteError") return err;
// //          throw err;
// //       });

// //       const inserted = result?.insertedCount ?? result?.result?.nInserted ?? docs.length;

// //       return res.status(201).json({ success: true, message: `Upload complete. ${inserted} records inserted.`, financialYear, inserted, skipped });
// //    } catch (err) {
// //       console.error("[uploadTallyBill]", err);
// //       return res.status(500).json({ success: false, message: err.message });
// //    }
// // }

// // export async function getTallyBill(req, res) {
// //    try {
// //       const { financialYear, farmerDealerCode, type } = req.query;

// //       const filter = {};
// //       if (financialYear) filter.financialYear = financialYear;
// //       if (farmerDealerCode) filter.farmerDealerCode = farmerDealerCode;
// //       if (type) filter.type = type;

// //       const records = await TallyBill.find(filter).sort({ date: -1 });
// //       return res.status(200).json({ success: true, data: records });
// //    } catch (err) {
// //       console.error("[getTallyBill]", err);
// //       return res.status(500).json({ success: false, message: err.message });
// //    }
// // }












// import TallyBill from "../models/Tallybill.js";
// import { parseTallyBillSheet } from "../utils/TallybillParsers.js";

// // POST /api/tallybill/upload
// export async function uploadTallyBill(req, res) {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No file uploaded.",
//       });
//     }

//     const dealerName = req.query.dealerName ?? req.body.dealerName;
//     const farmerDealerCode = req.query.farmerDealerCode ?? req.body.farmerDealerCode;

//     const { docs, skipped } = parseTallyBillSheet(
//       req.file.buffer,
//       dealerName,
//       farmerDealerCode
//     );

//     if (!docs.length) {
//       return res.status(422).json({
//         success: false,
//         message: "No valid rows found in the file.",
//         skipped,
//       });
//     }

//     const result = await TallyBill.insertMany(docs, { ordered: false }).catch((err) => {
//       if (err.code === 11000 || err.name === "BulkWriteError") return err;
//       throw err;
//     });

//     const inserted =
//       result?.insertedCount ?? result?.result?.nInserted ?? docs.length;

//     const financialYears = [...new Set(docs.map((d) => d.financialYear))];

//     return res.status(201).json({
//       success: true,
//       message: `Upload complete. ${inserted} records inserted.`,
//       financialYears,
//       inserted,
//       skipped,
//     });
//   } catch (err) {
//     console.error("[uploadTallyBill]", err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// }

// // GET /api/tallybill
// export async function getTallyBill(req, res) {
//   try {
//     const { financialYear, farmerDealerCode, type } = req.query;

//     const filter = {};

//     if (financialYear) filter.financialYear = financialYear;
//     if (farmerDealerCode) filter.farmerDealerCode = farmerDealerCode;
//     if (type) filter.type = type;

//     const records = await TallyBill.find(filter).sort({ date: -1 });

//     return res.status(200).json({
//       success: true,
//       data: records,
//     });
//   } catch (err) {
//     console.error("[getTallyBill]", err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// }











import TallyBill from "../models/Tallybill.js";
import { parseTallyBillSheet } from "../utils/TallybillParsers.js";

// POST /api/tallybill/upload
export async function uploadTallyBill(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const dealerName = req.query.dealerName ?? req.body.dealerName;
    const farmerDealerCode = req.query.farmerDealerCode ?? req.body.farmerDealerCode;

    const { docs, skipped } = parseTallyBillSheet(
      req.file.buffer,
      dealerName,
      farmerDealerCode
    );

    if (!docs.length) {
      return res.status(422).json({
        success: false,
        message: "No valid rows found in the file.",
        skipped,
      });
    }

    const result = await TallyBill.insertMany(docs, { ordered: false }).catch((err) => {
      if (
        err.code === 11000 ||
        err.name === "BulkWriteError" ||
        err.name === "ValidationError"
      ) return err;
      throw err;
    });

    const inserted =
      result?.insertedCount ?? result?.result?.nInserted ?? docs.length;

    const financialYears = [...new Set(docs.map((d) => d.financialYear))];

    return res.status(201).json({
      success: true,
      message: `Upload complete. ${inserted} records inserted.`,
      financialYears,
      inserted,
      skipped,
    });
  } catch (err) {
    console.error("[uploadTallyBill]", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// GET /api/tallybill
export async function getTallyBill(req, res) {
  try {
    const { financialYear, farmerDealerCode, type } = req.query;

    const filter = {};

    if (financialYear) filter.financialYear = financialYear;
    if (farmerDealerCode) filter.farmerDealerCode = farmerDealerCode;
    if (type) filter.type = type;

    const records = await TallyBill.find(filter).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      data: records,
    });
  } catch (err) {
    console.error("[getTallyBill]", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}