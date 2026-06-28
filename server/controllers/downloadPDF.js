import { modelMap } from '../constant/modelMap.js';
import { generateDealersPDF } from '../helpers/pdf/dealersPDF.js';
import { generateTdsRecordPDF } from '../helpers/pdf/tdsRecordPDF.js';
import { generateTallyBillPDF } from '../helpers/pdf/tallyBillPDF.js';
import { generateSubsidyPDF } from '../helpers/pdf/subsidyPDF.js';
import { generateMicadaPDF } from '../helpers/pdf/micadaPDF.js';
import { generateHisabPDF } from '../helpers/pdf/generateHisabPDF.js';
import { generateMatrixPDF } from '../helpers/pdf/inventoryPDF.js';
import { generateFarmerSharePDF } from '../helpers/pdf/farmerSharePDF.js';
import { generateMainFilePDF } from '../helpers/pdf/mainFilePDF.js';
import { generateAdjustedSheetPDF } from '../helpers/pdf/adjustedSheetPDF.js';
import { generateMainFySheetPDF } from '../helpers/pdf/mainFySheetPDF.js';
import { generateMaterialDispatchedPDF } from '../helpers/pdf/materialDispatchedPDF.js';
import { generateMaterialDispatchReceiptsPDF } from '../helpers/pdf/materialDispatchReceiptsPDF.js';
import { generateMainFySummaryPDF } from '../helpers/pdf/generateMainFySummaryPDF.js';
import { generateMainFyDealerSummaryPDF } from '../helpers/pdf/generateMainFyDealerSummaryPDF.js';
import { generatePopupRecordsPDF } from '../helpers/pdf/generatePopupRecordsPDF.js';
import { generateMainMicadaComparisionRecordsPDF } from '../helpers/pdf/generateMainMicadaComparisionRecordsPDF.js';
import { generateDealerMainFilePDF } from '../helpers/pdf/generateDealerMainFilePDF.js';
import { generateMainFileDealerSummaryPDF } from '../helpers/pdf/generateMainFileDealerSummaryPDF.js';

const EXCLUDED_FIELDS = new Set([
   '__v', 'password', 'resetToken', 'otp', 'otpExpiry', 'isDeleted', 'deletedAt',
]);

function stripExcluded(item) {
   const copy = { ...item };
   for (const field of EXCLUDED_FIELDS) delete copy[field];
   return copy;
}

const ALLOW_EMPTY_IDS = new Set([
   'dealer', 'tds-record', 'tally-bill', 'subsidy', 'micada', 'inventory',
   'farmer-share', 'main-file', 'main-fySheet', 'material-dispatch',
   'material-dispatch-dispatched', 'material-dispatch-receipts', 'material-dispatch-adjusted',
]);

const PDF_GENERATORS = new Map([
   ['dealer', generateDealersPDF],
   ['tds-record', generateTdsRecordPDF],
   ['tally-bill', generateTallyBillPDF],
   ['subsidy', generateSubsidyPDF],
   ['micada', generateMicadaPDF],
   ['inventory', generateMatrixPDF],
   ['farmer-share', generateFarmerSharePDF],
   ['main-file', generateMainFilePDF],
   ['main-fySheet', generateMainFySheetPDF],
   ['material-dispatch-dispatched', generateMaterialDispatchedPDF],
   ['material-dispatch-receipts', generateMaterialDispatchReceiptsPDF],
   ['material-dispatch-adjusted', generateAdjustedSheetPDF],
]);

// ── Special models — handled directly from req.body.data ──────────────────────
const SPECIAL_MODELS = new Set([
   'hisab-detail',
   'main-fySheet-today-summary',
   'main-fySheet-dealer-summary',
   'popup-records',
   'main-micada-comparision',
   'dealer-mainfile-records',
   'dealer-mainfile-summary-records'
]);

// ── Models that support farmerDealerCode in header when filtered by dealer ────
const DEALER_CODE_MODELS = new Set([
   'tds-record',
   'material-dispatch-dispatched',
   'material-dispatch-receipts',
   'material-dispatch-adjusted',
]);

export async function downloadPDF(req, res) {
   try {
      const { model, ids, financialYear, dealerName, data } = req.body;

      // ── Special models ────────────────────────────────────────────────────
      if (SPECIAL_MODELS.has(model)) {
         if (!data) {
            return res.status(400).json({ message: 'data required', success: false });
         }

         if (model === 'hisab-detail') {
            try {
               return await generateHisabPDF(data, res, { financialYear });
            } catch (err) {
               console.error('PDF error:', err);
               if (!res.headersSent) {
                  return res.status(500).json({ message: 'PDF generation failed', success: false });
               }
            }
         }

         if (model === 'main-fySheet-today-summary') {
            try {
               return await generateMainFySummaryPDF(data, res);
            } catch (err) {
               console.error('PDF error:', err);
               if (!res.headersSent) {
                  return res.status(500).json({ message: 'PDF generation failed', success: false });
               }
            }
         }
         if (model === 'main-fySheet-dealer-summary') {
            try {
               return await generateMainFyDealerSummaryPDF(data, res);
            } catch (err) {
               console.error('PDF error:', err);
               if (!res.headersSent) {
                  return res.status(500).json({ message: 'PDF generation failed', success: false });
               }
            }
         }

         if (model === 'popup-records') {
            try {
               return await generatePopupRecordsPDF(data, res);
            } catch (err) {
               console.error('PDF error:', err);
               if (!res.headersSent) {
                  return res.status(500).json({ message: 'PDF generation failed', success: false });
               }
            }
         }

         if (model === 'main-micada-comparision') {
            try {
               return await generateMainMicadaComparisionRecordsPDF(data, res);
            } catch (err) {
               console.error('PDF error:', err);
               if (!res.headersSent) {
                  return res.status(500).json({ message: 'PDF generation failed', success: false });
               }
            }
         }


         // ── ADD this handler block inside downloadPDF(), inside the SPECIAL_MODELS block ──
         if (model === 'dealer-mainfile-records') {
            try {
               return await generateDealerMainFilePDF(data, res);
            } catch (err) {
               console.error('PDF error:', err);
               if (!res.headersSent) {
                  return res.status(500).json({ message: 'PDF generation failed', success: false });
               }
            }
         }

         if (model === 'dealer-mainfile-summary-records') {
            try {
               return await generateMainFileDealerSummaryPDF(data, res);
            } catch (err) {
               console.error('PDF error:', err);
               if (!res.headersSent) {
                  return res.status(500).json({ message: 'PDF generation failed', success: false });
               }
            }
         }

         return res.status(400).json({ message: `No handler for special model "${model}"`, success: false });
      }

      // ── Direct data mode ──────────────────────────────────────────────────
      if (Array.isArray(data) && data.length > 0) {
         const generatePDF = PDF_GENERATORS.get(model);
         if (!generatePDF) {
            return res.status(400).json({ message: `No PDF generator for "${model}"`, success: false });
         }
         const records = data.map(stripExcluded);

         let dealerCode = null;
         if (dealerName && DEALER_CODE_MODELS.has(model)) {
            dealerCode = records[0]?.farmerDealerCode ?? null;
         }

         return await generatePDF(records, res, { financialYear, dealerName, dealerCode });
      }

      // ── Validate model ────────────────────────────────────────────────────
      if (!modelMap[model]) {
         return res.status(400).json({ message: `Invalid model: "${model}"`, success: false });
      }

      const hasIds = Array.isArray(ids) && ids.length > 0;

      if (!hasIds && !ALLOW_EMPTY_IDS.has(model)) {
         return res.status(400).json({ message: `IDs required for "${model}"`, success: false });
      }

      // ── Build filter ──────────────────────────────────────────────────────
      let filter = {};
      if (hasIds) {
         filter = { _id: { $in: ids } };
      } else if (financialYear) {
         filter = { financialYear };
         if (dealerName) filter.dealerName = dealerName;
      }

      // ── Fetch records ─────────────────────────────────────────────────────
      const raw = await modelMap[model].find(filter).lean();
      if (!raw.length) {
         return res.status(404).json({ message: 'No data found', success: false });
      }

      const records = raw.map(stripExcluded);

      let dealerCode = null;
      if (dealerName && DEALER_CODE_MODELS.has(model)) {
         dealerCode = records[0]?.farmerDealerCode ?? null;
      }

      // ── Tally Bill: enrich with Subsidy data ──────────────────────────────
      if (model === 'tally-bill') {
         const miNumbers = records.map(r => r.miNumber).filter(Boolean);
         const subsidyRecords = miNumbers.length
            ? await modelMap['subsidy'].find({ applicationId: { $in: miNumbers } }).lean()
            : [];
         const subsidyMap = new Map(subsidyRecords.map(s => [s.applicationId, s]));
         for (const rec of records) {
            const subsidy = subsidyMap.get(rec.miNumber);
            if (subsidy) {
               rec.farmerName = subsidy.name;
               rec.fatherName = subsidy.fatherName;
               rec.type = subsidy.type;
               rec.village = subsidy.village;
            }
         }
      }

      // ── Generate PDF ──────────────────────────────────────────────────────
      const generatePDF = PDF_GENERATORS.get(model);
      if (!generatePDF) {
         return res.status(400).json({ message: `No PDF generator for "${model}"`, success: false });
      }

      // ── Inventory: fetch rates ────────────────────────────────────────────
      let rates = [];
      let dealerRates = [];
      if (model === 'inventory') {
         rates = await modelMap['item-rate'].find({}).lean();
         if (financialYear && dealerName) {
            const dealerDoc = await modelMap['dealer'].findOne({ dealerName }).lean();
            if (dealerDoc) {
               dealerRates = await modelMap['dealer-item-rate'].find({
                  dealer: dealerDoc._id,
                  financialYear,
               }).lean();
            }
         }
      }

      await generatePDF(records, res, { financialYear, dealerName, dealerCode, rates, dealerRates });

   } catch (error) {
      console.error('PDF Controller Error:', error);
      if (!res.headersSent) {
         res.status(500).json({ message: error.message, success: false });
      }
   }
}