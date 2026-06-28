
import { modelMap }                      from '../constant/modelMap.js';
import { generateInventoryExcel }        from '../helpers/excel/generateInventoryExcel.js';
import { generateMainFileExcel }         from '../helpers/excel/generateMainFileExcel.js';
import { generateTallyBillExcel }        from '../helpers/excel/generateTallyBillExcel.js';
import { generateTdsRecordExcel }        from '../helpers/excel/generateTdsRecordExcel.js';
import { generateSubsidyExcel }          from '../helpers/excel/generateSubsidyExcel.js';
import { generateMicadaExcel }           from '../helpers/excel/generateMicadaExcel.js';
import { generateFarmerShareExcel }      from '../helpers/excel/generateFarmerShareExcel.js';
import { generateMainFySheetExcel }      from '../helpers/excel/generateMainFySheetExcel.js';
import { generateMaterialDispatchedExcel }       from '../helpers/excel/generateMaterialDispatchedExcel.js';
import { generateMaterialDispatchReceiptsExcel } from '../helpers/excel/generateMaterialDispatchReceiptsExcel.js';
import { generateAdjustedSheetExcel }    from '../helpers/excel/generateAdjustedSheetExcel.js';
import { generateDealersExcel }          from '../helpers/excel/generateDealersExcel.js';
import { generateMainFySummaryExcel }    from '../helpers/excel/generateMainFySummaryExcel.js';   // ← new
import { generateMainFyDealerSummaryExcel }    from '../helpers/excel/generateMainFyDealerSummaryExcel.js';   // ← new
import { generatePopupRecordsExcel }     from '../helpers/excel/generatePopupRecordsExcel.js';    // ← new
import { generateMainMicadaComparisionRecordsExcel } from '../helpers/excel/generateMainMicadaComparisionRecordsExcel.js';
import { generateDealerMainFileExcel } from '../helpers/excel/generateDealerMainFileExcel.js';
import { generateMainFileDealerSummaryExcel } from '../helpers/excel/generateMainFileDealerSummaryExcel.js';

// ─── Excluded fields ──────────────────────────────────────────────────────────
const EXCLUDED_FIELDS = new Set([
   '__v', 'password', 'resetToken', 'otp', 'otpExpiry', 'isDeleted', 'deletedAt',
]);

function stripExcluded(item) {
   const copy = { ...item };
   for (const field of EXCLUDED_FIELDS) delete copy[field];
   return copy;
}

// ─── Models that don't require IDs ───────────────────────────────────────────
const ALLOW_EMPTY_IDS = new Set([
   'dealer', 'tds-record', 'tally-bill', 'subsidy', 'micada', 'inventory',
   'farmer-share', 'main-file', 'main-fySheet', 'material-dispatch',
   'material-dispatch-dispatched', 'material-dispatch-receipts', 'material-dispatch-adjusted',
]);

// ─── Special models — handled directly from req.body.data ────────────────────
const SPECIAL_MODELS = new Set([
   'main-fySheet-today-summary',
   'main-fySheet-dealer-summary',
   'popup-records',
      'main-micada-comparision',  
      'dealer-mainfile-records',  
      'dealer-mainfile-summary-records'          // ← add karo

]);

// ─── Excel generators map ─────────────────────────────────────────────────────
const EXCEL_GENERATORS = new Map([
   ['dealer',                        generateDealersExcel],
   ['tds-record',                    generateTdsRecordExcel],
   ['tally-bill',                    generateTallyBillExcel],
   ['subsidy',                       generateSubsidyExcel],
   ['micada',                        generateMicadaExcel],
   ['inventory',                     generateInventoryExcel],
   ['farmer-share',                  generateFarmerShareExcel],
   ['main-file',                     generateMainFileExcel],
   ['main-fySheet',                  generateMainFySheetExcel],
   ['material-dispatch-dispatched',  generateMaterialDispatchedExcel],
   ['material-dispatch-receipts',    generateMaterialDispatchReceiptsExcel],
   ['material-dispatch-adjusted',    generateAdjustedSheetExcel],
]);

// ─── Filename map ─────────────────────────────────────────────────────────────
function getFilename(model, financialYear, dealerName) {
   const fy   = financialYear ? `_${financialYear}` : '';
   const name = dealerName ? `_${dealerName.replace(/\s+/g, '_')}` : '';
   const labels = {
      'dealer':                        'Dealers',
      'tds-record':                    'TDS_Record',
      'tally-bill':                    'Tally_Bills',
      'subsidy':                       'Subsidy',
      'micada':                        'MICADA',
      'inventory':                     'Inventory_Matrix',
      'farmer-share':                  'Farmer_Share',
      'main-file':                     'Main_File',
      'main-fySheet':                  'Main_FY_Sheet',
      'material-dispatch-dispatched':  'Material_Dispatched',
      'material-dispatch-receipts':    'Material_Receipts',
      'material-dispatch-adjusted':    'Material_Adjusted',
   };
   const base = labels[model] ?? model;
   return `${base}${fy}${name}.xlsx`;
}

// ─── Controller ───────────────────────────────────────────────────────────────
export async function downloadExcel(req, res) {
   try {
      const { model, ids, financialYear, dealerName, data, fileName } = req.body;

      // ── Special models (data passed directly from frontend) ───────────────
      if (SPECIAL_MODELS.has(model)) {
         if (!data) {
            return res.status(400).json({ message: 'data required', success: false });
         }

         let buffer;
         let outFileName;

         if (model === 'main-fySheet-today-summary') {
            buffer      = await generateMainFySummaryExcel(data);
            outFileName = `Today_Summary_${data.date ?? 'export'}.xlsx`;
         }
          if (model === 'main-fySheet-dealer-summary') {
            buffer      = await generateMainFyDealerSummaryExcel(data);
            outFileName = `Today_Summary_${data.date ?? 'export'}.xlsx`;
         }

         if (model === 'popup-records') {
            buffer      = await generatePopupRecordsExcel(data);
            const safe  = (data.title ?? 'Records').replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_');
            outFileName = `${safe}.xlsx`;
         }
         if (model === 'main-micada-comparision') {
            buffer      = await generateMainMicadaComparisionRecordsExcel(data);
            const safe  = (data.title ?? 'Records').replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_');
            outFileName = `${safe}.xlsx`;
         }
         // ── ADD this handler inside downloadExcel(), in the SPECIAL_MODELS block ──────
if (model === 'dealer-mainfile-records') {
   buffer      = await generateDealerMainFileExcel(data);
   const safe  = (data.title ?? 'File_Records').replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_');
   outFileName = `${safe}.xlsx`;
}

if (model === 'dealer-mainfile-summary-records') {
   buffer      = await generateMainFileDealerSummaryExcel(data);
   const safe  = (data.title ?? 'File_Records').replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_');
   outFileName = `${safe}.xlsx`;
}

         res.setHeader('Content-Disposition', `attachment; filename="${outFileName}"`);
         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
         res.setHeader('Content-Length', buffer.length);
         return res.send(buffer);
      }

      if (!EXCEL_GENERATORS.has(model)) {
         return res.status(400).json({ message: `No Excel generator for "${model}"`, success: false });
      }

      // ── Direct data mode (frontend passed pre-filtered records) ───────────
      if (Array.isArray(data) && data.length > 0) {
         const generateExcel = EXCEL_GENERATORS.get(model);
         const records = data.map(stripExcluded);
         const buffer = await generateExcel(records, financialYear, dealerName, [], []);
         const outFileName = getFilename(model, financialYear, dealerName);
         res.setHeader('Content-Disposition', `attachment; filename="${outFileName}"`);
         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
         res.setHeader('Content-Length', buffer.length);
         return res.send(buffer);
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
               rec.type       = subsidy.type;
               rec.village    = subsidy.village;
            }
         }
      }

      // ── Inventory: fetch rates ────────────────────────────────────────────
      let rates       = [];
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

      // ── Generate Excel ────────────────────────────────────────────────────
      const generateExcel = EXCEL_GENERATORS.get(model);
      const buffer = await generateExcel(records, financialYear, dealerName, rates, dealerRates);

      // ── Send response ─────────────────────────────────────────────────────
      const outFileName = getFilename(model, financialYear, dealerName);
      res.setHeader('Content-Disposition', `attachment; filename="${outFileName}"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Length', buffer.length);
      return res.send(buffer);

   } catch (error) {
      console.error('Excel Controller Error:', error);
      if (!res.headersSent) {
         res.status(500).json({ message: error.message, success: false });
      }
   }
}