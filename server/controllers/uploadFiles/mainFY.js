import { parseExcelFile } from '../../utils/excelParserLegacy.js';
import { FY2223Data } from '../../models/mainFY/index.js';

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

export async function uploadMainFY(req, res) {
	if (!req.file) {
		return res.status(400).json({ success: false, message: 'No file uploaded.' });
	}

	const { buffer, originalname: originalName } = req.file;
	const { financialYear } = req.body;

	if (!financialYear) {
		return res.status(400).json({ success: false, message: 'financialYear is required.' });
	}

	try {
		const parsed = parseExcelFile(buffer, 'main_fy');

		const [fy2223DataResult] = await Promise.all([
			insertDocs(FY2223Data, parsed.fy2223Data, financialYear, originalName),
		]);

		const counts = {
			fy2223Data: fy2223DataResult.count,
		};

		const errors = [
			...(parsed.errors ?? []),
			fy2223DataResult.error,
		].filter(Boolean);

		return res.json({
			success: true,
			counts,
			skipped: parsed.skipped ?? [],
			errors,
		});

	} catch (err) {
		console.error('MAIN FY UPLOAD ERROR:', err);
		return res.status(500).json({ success: false, message: err.message });
	}
}
