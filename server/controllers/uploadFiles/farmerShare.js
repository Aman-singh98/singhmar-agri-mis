import { parseExcelFile } from '../../utils/excelParserLegacy.js';
import { FarmerChallanDetails, FarmerChallanPending, MaterialSheet } from '../../models/farmerShare/index.js';

async function insertDocs(Model, rawDocs, financialYear, uploadedFile) {
	if (!rawDocs?.length) return { count: 0, error: null };

	const docs = rawDocs.map((d) => ({ ...d, financialYear, uploadedFile }));

	try {
		const result = await Model.insertMany(docs, { ordered: false });
		return { count: result.length, error: null };
	} catch (err) {
		const inserted = err.insertedDocs?.length ?? 0;
		return { count: inserted, error: err.message };
	}
}

export async function uploadFarmerShare(req, res) {
	if (!req.file) {
		return res.status(400).json({ success: false, message: 'No file uploaded.' });
	}

	const { buffer, originalname: originalName } = req.file;
	const { financialYear } = req.body;

	if (!financialYear) {
		return res.status(400).json({ success: false, message: 'financialYear is required.' });
	}

	try {
		const parsed = parseExcelFile(buffer, 'farmer_share');

		const [farmerChallanDetailsResult, farmerChallanPendingResult, materialSheetResult] = await Promise.all([
			insertDocs(FarmerChallanDetails, parsed.farmerChallanDetails, financialYear, originalName),
			insertDocs(FarmerChallanPending, parsed.farmerChallanPending, financialYear, originalName),
			insertDocs(MaterialSheet, parsed.materialSheet, financialYear, originalName),
		]);

		const counts = {
			farmerChallanDetails: farmerChallanDetailsResult.count,
			farmerChallanPending: farmerChallanPendingResult.count,
			materialSheet: materialSheetResult.count,
		};

		const errors = [
			...(parsed.errors ?? []),
			farmerChallanDetailsResult.error,
			farmerChallanPendingResult.error,
			materialSheetResult.error,
		].filter(Boolean);

		return res.json({
			success: true,
			counts,
			skipped: parsed.skipped ?? [],
			errors,
		});

	} catch (err) {
		console.error('FARMER SHARE UPLOAD ERROR:', err);
		return res.status(500).json({ success: false, message: err.message });
	}
}
