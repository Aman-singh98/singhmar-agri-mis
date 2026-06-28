// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import {
// 	HiX, HiOfficeBuilding, HiHashtag, HiPlus, HiTrash,
// 	HiCheckCircle, HiExclamation, HiSparkles
// } from "react-icons/hi";
// import {
// 	addDealer,
// 	selectDealerActionLoading,
// 	clearError,
// } from "../../store/dealerSlice";

// const DEALER_CODE_REGEX = /^[A-Z]{2}\/\d{2}$/;
// const EMPTY_ROW = () => ({ dealerName: "", farmerDealerCode: "", errors: {} });

// const formatDealerCode = (raw, prev) => {
// 	if (prev.length > raw.length) return raw.toUpperCase();
// 	let val = raw.toUpperCase().replace(/[^A-Z0-9/]/g, "");
// 	if (val.length === 2 && !val.includes("/") && /^[A-Z]{2}$/.test(val)) {
// 		val = val + "/";
// 	}
// 	return val.slice(0, 5);
// };

// const AddDealer = ({ mode = "page", onClose, onSuccess }) => {
// 	const dispatch = useDispatch();
// 	const loading = useSelector(selectDealerActionLoading);
// 	const [rows, setRows] = useState([EMPTY_ROW()]);

// 	const addRow = () => setRows((prev) => [...prev, EMPTY_ROW()]);

// 	const removeRow = (i) =>
// 		setRows((prev) => prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i));

// 	const updateRow = (i, field, value) =>
// 		setRows((prev) =>
// 			prev.map((row, idx) =>
// 				idx === i ? { ...row, [field]: value, errors: { ...row.errors, [field]: "" } } : row
// 			)
// 		);

// 	const handleCodeChange = (i, raw) => {
// 		const prev = rows[i].farmerDealerCode;
// 		updateRow(i, "farmerDealerCode", formatDealerCode(raw, prev));
// 	};

// 	const validateAll = () => {
// 		let valid = true;
// 		const names = rows.map((r) => r.dealerName.trim().toLowerCase()).filter(Boolean);
// 		const codes = rows.map((r) => r.farmerDealerCode.trim().toUpperCase()).filter(Boolean);
// 		const dupNames = names.filter((n, i) => names.indexOf(n) !== i);
// 		const dupCodes = codes.filter((c, i) => codes.indexOf(c) !== i);

// 		const updated = rows.map((row) => {
// 			const errors = {};
// 			if (!row.dealerName.trim()) errors.dealerName = "Dealer name is required";
// 			else if (row.dealerName.trim().length < 2) errors.dealerName = "Min 2 characters";
// 			else if (dupNames.includes(row.dealerName.trim().toLowerCase()))
// 				errors.dealerName = "Duplicate name — ram, Ram, RAM are all same";

// 			if (!row.farmerDealerCode.trim()) errors.farmerDealerCode = "Dealer code is required";
// 			else if (!DEALER_CODE_REGEX.test(row.farmerDealerCode.trim()))
// 				errors.farmerDealerCode = "Format must be XX/00 (e.g. MP/08)";
// 			else if (dupCodes.includes(row.farmerDealerCode.trim().toUpperCase()))
// 				errors.farmerDealerCode = "Duplicate dealer code in list";

// 			if (Object.keys(errors).length) valid = false;
// 			return { ...row, errors };
// 		});

// 		setRows(updated);
// 		if (!valid) toast.error("Please fix the errors before saving");
// 		return valid;
// 	};

// 	const handleSubmit = async (e) => {
// 		if (e?.preventDefault) e.preventDefault();
// 		if (!validateAll()) return;

// 		let successCount = 0;
// 		let failCount = 0;

// 		for (let idx = 0; idx < rows.length; idx++) {
// 			const row = rows[idx];
// 			const result = await dispatch(addDealer({
// 				dealerName: row.dealerName.trim(),
// 				farmerDealerCode: row.farmerDealerCode.trim().toUpperCase(),
// 			}));

// 			if (addDealer.fulfilled.match(result)) {
// 				successCount++;
// 			} else {
// 				failCount++;
// 				const msg = result.payload || "Failed";
// 				if (msg.toLowerCase().includes("name")) {
// 					setRows((prev) => prev.map((r, i) => i === idx ? { ...r, errors: { ...r.errors, dealerName: msg } } : r));
// 				} else if (msg.toLowerCase().includes("code")) {
// 					setRows((prev) => prev.map((r, i) => i === idx ? { ...r, errors: { ...r.errors, farmerDealerCode: msg } } : r));
// 				} else {
// 					toast.error(`"${row.dealerName}" — ${msg}`);
// 				}
// 				dispatch(clearError());
// 			}
// 		}

// 		if (successCount > 0) {
// 			toast.success(successCount === 1 ? "Dealer added successfully" : `${successCount} dealers added successfully`);
// 			setRows([EMPTY_ROW()]);
// 			onSuccess && onSuccess();
// 			if (mode === "modal" && failCount === 0) onClose && onClose();
// 		}
// 	};

// 	const formBody = (
// 		<div className="space-y-3">
// 			{/* Column headers — desktop only */}
// 			<div className="hidden sm:grid grid-cols-[1fr_1fr_auto] gap-3 px-1">
// 				<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
// 					Dealer Name <span className="text-red-500">*</span>
// 				</span>
// 				<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
// 					Dealer Code <span className="text-red-500">*</span>
// 				</span>
// 				<span className="w-8" />
// 			</div>

// 			{rows.map((row, i) => (
// 				<div
// 					key={i}
// 					className={`grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-start p-3  border transition
//             ${Object.keys(row.errors).length ? "bg-red-50/40 border-red-200" : "bg-gray-50/60 border-gray-200"}`}
// 				>
// 					{/* Row number badge */}
// 					{rows.length > 1 && (
// 						<div className="sm:hidden flex items-center gap-2 mb-1">
// 							<span className="text-xs font-bold text-gray-400 bg-white border border-gray-200 px-2 py-0.5 ">
// 								#{i + 1}
// 							</span>
// 						</div>
// 					)}

// 					{/* Dealer Name */}
// 					<div className="flex flex-col gap-1">
// 						<label className="sm:hidden text-xs font-semibold text-gray-600">
// 							Dealer Name <span className="text-red-500">*</span>
// 						</label>
// 						<div className="relative">
// 							<HiOfficeBuilding className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
// 							<input
// 								value={row.dealerName}
// 								onChange={(e) => updateRow(i, "dealerName", e.target.value)}
// 								placeholder="Enter dealer name"
// 								className={`w-full pl-9 pr-3 py-2.5 text-sm border  focus:outline-none focus:ring-2 transition bg-white
//                   ${row.errors.dealerName
// 										? "border-red-300 focus:ring-red-300"
// 										: "border-gray-200 focus:ring-green-600/30 focus:border-green-500"}`}
// 							/>
// 						</div>
// 						{row.errors.dealerName && (
// 							<span className="text-xs text-red-500 flex items-center gap-1">
// 								<HiExclamation className="w-3 h-3 shrink-0" />{row.errors.dealerName}
// 							</span>
// 						)}
// 					</div>

// 					{/* Dealer Code */}
// 					<div className="flex flex-col gap-1">
// 						<label className="sm:hidden text-xs font-semibold text-gray-600">
// 							Dealer Code <span className="text-red-500">*</span>
// 						</label>
// 						<div className="relative">
// 							<HiHashtag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
// 							<input
// 								value={row.farmerDealerCode}
// 								onChange={(e) => handleCodeChange(i, e.target.value)}
// 								placeholder="MP/08"
// 								maxLength={5}
// 								className={`w-full pl-9 pr-3 py-2.5 text-sm border  focus:outline-none focus:ring-2 transition font-mono uppercase bg-white
//                   ${row.errors.farmerDealerCode
// 										? "border-red-300 focus:ring-red-300"
// 										: "border-gray-200 focus:ring-green-600/30 focus:border-green-500"}`}
// 							/>
// 						</div>
// 						{row.errors.farmerDealerCode ? (
// 							<span className="text-xs text-red-500 flex items-center gap-1">
// 								<HiExclamation className="w-3 h-3 shrink-0" />{row.errors.farmerDealerCode}
// 							</span>
// 						) : (
// 							<span className="text-xs text-gray-400">Format: XX/00 (e.g. MP/08)</span>
// 						)}
// 					</div>

// 					{/* Remove row */}
// 					<button
// 						type="button"
// 						onClick={() => removeRow(i)}
// 						disabled={rows.length === 1}
// 						className="w-8 h-9 flex items-center justify-center  border border-gray-200 bg-white
//               text-gray-400 hover:text-red-500 hover:border-red-300 hover:bg-red-50
//               disabled:opacity-30 disabled:cursor-not-allowed transition self-start"
// 					>
// 						<HiTrash className="w-4 h-4" />
// 					</button>
// 				</div>
// 			))}

// 			{/* Add row button */}
// 			<button
// 				type="button"
// 				onClick={addRow}
// 				className="flex items-center gap-2 text-sm text-green-700 font-semibold border-2 border-dashed border-green-300
//           px-4 py-2.5  w-full justify-center hover:bg-green-50 hover:border-green-400 transition"
// 			>
// 				<HiPlus className="w-4 h-4" />
// 				Add Another Dealer
// 			</button>

// 			{rows.length > 1 && (
// 				<div className="flex items-center justify-end gap-1.5 text-xs text-gray-400">
// 					<HiSparkles className="w-3 h-3" />
// 					{rows.length} dealers will be added at once
// 				</div>
// 			)}
// 		</div>
// 	);

// 	if (mode === "modal") {
// 		return (
// 			<div
// 				className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
// 				style={{ zIndex: 99999 }}
// 				onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
// 			>
// 				<div
// 					className="bg-white w-full max-w-2xl  shadow-2xl overflow-hidden flex flex-col"
// 					style={{ zIndex: 100000, maxHeight: "90vh" }}
// 					onClick={(e) => e.stopPropagation()}
// 				>
// 					{/* Modal header */}
// 					<div className="bg-gradient-to-br from-green-800 to-green-700 text-white px-5 py-5 flex items-start justify-between">
// 						<div className="flex items-center gap-3">
// 							<div className="w-10 h-10  bg-white/15 flex items-center justify-center">
// 								<HiOfficeBuilding className="w-5 h-5" />
// 							</div>
// 							<div>
// 								<h2 className="text-base font-bold leading-tight tracking-tight">Add Dealers</h2>
// 								<p className="text-xs text-green-200 mt-0.5">Add one or multiple dealers at once</p>
// 							</div>
// 						</div>
// 						<button
// 							type="button"
// 							onClick={onClose}
// 							className="w-8 h-8 flex items-center justify-center  hover:bg-white/15 transition text-green-200 hover:text-white mt-0.5"
// 						>
// 							<HiX className="w-4 h-4" />
// 						</button>
// 					</div>

// 					<div className="overflow-y-auto flex-1 px-5 py-5">
// 						<div className="border border-gray-200  p-4 bg-white shadow-sm">
// 							<div className="flex items-center gap-2 mb-4">
// 								<div className="w-6 h-6  bg-green-100 flex items-center justify-center">
// 									<HiOfficeBuilding className="w-3.5 h-3.5 text-green-700" />
// 								</div>
// 								<h3 className="text-sm font-bold text-gray-800">Dealer Information</h3>
// 							</div>
// 							{formBody}
// 						</div>
// 					</div>

// 					<div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-between gap-2">
// 						<button
// 							type="button"
// 							onClick={onClose}
// 							className="px-4 py-2  text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition"
// 						>
// 							Cancel
// 						</button>
// 						<button
// 							type="button"
// 							onClick={handleSubmit}
// 							disabled={loading}
// 							className="flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-green-300 disabled:cursor-not-allowed
//                 text-white text-sm font-bold px-6 py-2  transition shadow-sm"
// 						>
// 							{loading ? (
// 								<><span className="w-4 h-4 border-2 border-white border-t-transparent  animate-spin" /> Saving...</>
// 							) : (
// 								<><HiCheckCircle className="w-4 h-4" /> {rows.length > 1 ? `Save ${rows.length} Dealers` : "Save Dealer"}</>
// 							)}
// 						</button>
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	}

// 	// Page mode
// 	return (
// 		<div className="w-full h-full bg-gray-50">
// 			<form onSubmit={handleSubmit} className="bg-white w-full h-full flex flex-col">
// 				<div className="sticky top-0 z-20 border-b bg-white border-gray-200 px-4 sm:px-6 py-4">
// 					<div className="flex items-center gap-3">
// 						<div className="w-9 h-9  bg-green-700 flex items-center justify-center shadow-sm">
// 							<HiOfficeBuilding className="w-4.5 h-4.5 text-white" />
// 						</div>
// 						<div>
// 							<h2 className="sm:text-lg text-base font-bold text-gray-900 leading-tight">Add Dealers</h2>
// 							<p className="text-xs text-gray-400 mt-0.5">Add one or multiple dealers at once</p>
// 						</div>
// 					</div>
// 				</div>

// 				<div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-5">
// 					<div className="border border-gray-200  p-4 sm:p-6 bg-white shadow-sm">
// 						<div className="flex items-center gap-2 mb-5">
// 							<div className="w-6 h-6  bg-green-100 flex items-center justify-center">
// 								<HiOfficeBuilding className="w-3.5 h-3.5 text-green-700" />
// 							</div>
// 							<h3 className="text-sm font-bold text-gray-900">Dealer Information</h3>
// 						</div>
// 						{formBody}
// 					</div>

// 					<div className="flex justify-end pb-4">
// 						<button
// 							type="submit"
// 							disabled={loading}
// 							className="flex items-center gap-2 w-full sm:w-auto bg-green-700 hover:bg-green-800 disabled:bg-green-300
//                 disabled:cursor-not-allowed text-white text-sm font-bold px-8 py-2.5  transition shadow-sm justify-center"
// 						>
// 							{loading ? (
// 								<><span className="w-4 h-4 border-2 border-white border-t-transparent  animate-spin" /> Saving...</>
// 							) : (
// 								<><HiCheckCircle className="w-4 h-4" /> {rows.length > 1 ? `Save ${rows.length} Dealers` : "Save Dealer"}</>
// 							)}
// 						</button>
// 					</div>
// 				</div>
// 			</form>
// 		</div>
// 	);
// };

// export default AddDealer;


















import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
	HiX, HiOfficeBuilding, HiHashtag, HiPlus, HiTrash,
	HiCheckCircle, HiExclamation, HiSparkles
} from "react-icons/hi";
import {
	addDealer,
	selectDealerActionLoading,
	clearError,
} from "../../store/dealerSlice";

const EMPTY_ROW = () => ({ dealerName: "", farmerDealerCode: "", errors: {} });

const AddDealer = ({ mode = "page", onClose, onSuccess }) => {
	const dispatch = useDispatch();
	const loading = useSelector(selectDealerActionLoading);
	const [rows, setRows] = useState([EMPTY_ROW()]);

	const addRow = () => setRows((prev) => [...prev, EMPTY_ROW()]);

	const removeRow = (i) =>
		setRows((prev) => prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i));

	const updateRow = (i, field, value) =>
		setRows((prev) =>
			prev.map((row, idx) =>
				idx === i ? { ...row, [field]: value, errors: { ...row.errors, [field]: "" } } : row
			)
		);

	const validateAll = () => {
		let valid = true;
		const names = rows.map((r) => r.dealerName.trim().toLowerCase()).filter(Boolean);
		const codes = rows.map((r) => r.farmerDealerCode.trim().toLowerCase()).filter(Boolean);
		const dupNames = names.filter((n, i) => names.indexOf(n) !== i);
		const dupCodes = codes.filter((c, i) => codes.indexOf(c) !== i);

		const updated = rows.map((row) => {
			const errors = {};
			if (!row.dealerName.trim()) errors.dealerName = "Dealer name is required";
			else if (row.dealerName.trim().length < 2) errors.dealerName = "Min 2 characters";
			else if (dupNames.includes(row.dealerName.trim().toLowerCase()))
				errors.dealerName = "Duplicate name — ram, Ram, RAM are all same";

			if (!row.farmerDealerCode.trim()) errors.farmerDealerCode = "Dealer code is required";
			else if (dupCodes.includes(row.farmerDealerCode.trim().toLowerCase()))
				errors.farmerDealerCode = "Duplicate dealer code in list";

			if (Object.keys(errors).length) valid = false;
			return { ...row, errors };
		});

		setRows(updated);
		if (!valid) toast.error("Please fix the errors before saving");
		return valid;
	};

	const handleSubmit = async (e) => {
		if (e?.preventDefault) e.preventDefault();
		if (!validateAll()) return;

		let successCount = 0;
		let failCount = 0;

		for (let idx = 0; idx < rows.length; idx++) {
			const row = rows[idx];
			const result = await dispatch(addDealer({
				dealerName: row.dealerName.trim(),
				farmerDealerCode: row.farmerDealerCode.trim(),
			}));

			if (addDealer.fulfilled.match(result)) {
				successCount++;
			} else {
				failCount++;
				const msg = result.payload || "Failed";
				if (msg.toLowerCase().includes("name")) {
					setRows((prev) => prev.map((r, i) => i === idx ? { ...r, errors: { ...r.errors, dealerName: msg } } : r));
				} else if (msg.toLowerCase().includes("code")) {
					setRows((prev) => prev.map((r, i) => i === idx ? { ...r, errors: { ...r.errors, farmerDealerCode: msg } } : r));
				} else {
					toast.error(`"${row.dealerName}" — ${msg}`);
				}
				dispatch(clearError());
			}
		}

		if (successCount > 0) {
			toast.success(successCount === 1 ? "Dealer added successfully" : `${successCount} dealers added successfully`);
			setRows([EMPTY_ROW()]);
			onSuccess && onSuccess();
			if (mode === "modal" && failCount === 0) onClose && onClose();
		}
	};

	const formBody = (
		<div className="space-y-3">
			{/* Column headers — desktop only */}
			<div className="hidden sm:grid grid-cols-[1fr_1fr_auto] gap-3 px-1">
				<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
					Dealer Name <span className="text-red-500">*</span>
				</span>
				<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
					Dealer Code <span className="text-red-500">*</span>
				</span>
				<span className="w-8" />
			</div>

			{rows.map((row, i) => (
				<div
					key={i}
					className={`grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-start p-3 border transition
            ${Object.keys(row.errors).length ? "bg-red-50/40 border-red-200" : "bg-gray-50/60 border-gray-200"}`}
				>
					{/* Row number badge */}
					{rows.length > 1 && (
						<div className="sm:hidden flex items-center gap-2 mb-1">
							<span className="text-xs font-bold text-gray-400 bg-white border border-gray-200 px-2 py-0.5">
								#{i + 1}
							</span>
						</div>
					)}

					{/* Dealer Name */}
					<div className="flex flex-col gap-1">
						<label className="sm:hidden text-xs font-semibold text-gray-600">
							Dealer Name <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<HiOfficeBuilding className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
							<input
								value={row.dealerName}
								onChange={(e) => updateRow(i, "dealerName", e.target.value)}
								placeholder="Enter dealer name"
								className={`w-full pl-9 pr-3 py-2.5 text-sm border focus:outline-none focus:ring-2 transition bg-white
                  ${row.errors.dealerName
										? "border-red-300 focus:ring-red-300"
										: "border-gray-200 focus:ring-green-600/30 focus:border-green-500"}`}
							/>
						</div>
						{row.errors.dealerName && (
							<span className="text-xs text-red-500 flex items-center gap-1">
								<HiExclamation className="w-3 h-3 shrink-0" />{row.errors.dealerName}
							</span>
						)}
					</div>

					{/* Dealer Code */}
					<div className="flex flex-col gap-1">
						<label className="sm:hidden text-xs font-semibold text-gray-600">
							Dealer Code <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<HiHashtag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
							<input
								value={row.farmerDealerCode}
								onChange={(e) => updateRow(i, "farmerDealerCode", e.target.value)}
								placeholder="Enter dealer code"
								className={`w-full pl-9 pr-3 py-2.5 text-sm border focus:outline-none focus:ring-2 transition bg-white
                  ${row.errors.farmerDealerCode
										? "border-red-300 focus:ring-red-300"
										: "border-gray-200 focus:ring-green-600/30 focus:border-green-500"}`}
							/>
						</div>
						{row.errors.farmerDealerCode && (
							<span className="text-xs text-red-500 flex items-center gap-1">
								<HiExclamation className="w-3 h-3 shrink-0" />{row.errors.farmerDealerCode}
							</span>
						)}
					</div>

					{/* Remove row */}
					<button
						type="button"
						onClick={() => removeRow(i)}
						disabled={rows.length === 1}
						className="w-8 h-9 flex items-center justify-center border border-gray-200 bg-white
              text-gray-400 hover:text-red-500 hover:border-red-300 hover:bg-red-50
              disabled:opacity-30 disabled:cursor-not-allowed transition self-start"
					>
						<HiTrash className="w-4 h-4" />
					</button>
				</div>
			))}

			{/* Add row button */}
			<button
				type="button"
				onClick={addRow}
				className="flex items-center gap-2 text-sm text-green-700 font-semibold border-2 border-dashed border-green-300
          px-4 py-2.5 w-full justify-center hover:bg-green-50 hover:border-green-400 transition"
			>
				<HiPlus className="w-4 h-4" />
				Add Another Dealer
			</button>

			{rows.length > 1 && (
				<div className="flex items-center justify-end gap-1.5 text-xs text-gray-400">
					<HiSparkles className="w-3 h-3" />
					{rows.length} dealers will be added at once
				</div>
			)}
		</div>
	);

	if (mode === "modal") {
		return (
			<div
				className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
				style={{ zIndex: 99999 }}
				onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
			>
				<div
					className="bg-white w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col"
					style={{ zIndex: 100000, maxHeight: "90vh" }}
					onClick={(e) => e.stopPropagation()}
				>
					{/* Modal header */}
					<div className="bg-gradient-to-br from-green-800 to-green-700 text-white px-5 py-5 flex items-start justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-white/15 flex items-center justify-center">
								<HiOfficeBuilding className="w-5 h-5" />
							</div>
							<div>
								<h2 className="text-base font-bold leading-tight tracking-tight">Add Dealers</h2>
								<p className="text-xs text-green-200 mt-0.5">Add one or multiple dealers at once</p>
							</div>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="w-8 h-8 flex items-center justify-center hover:bg-white/15 transition text-green-200 hover:text-white mt-0.5"
						>
							<HiX className="w-4 h-4" />
						</button>
					</div>

					<div className="overflow-y-auto flex-1 px-5 py-5">
						<div className="border border-gray-200 p-4 bg-white shadow-sm">
							<div className="flex items-center gap-2 mb-4">
								<div className="w-6 h-6 bg-green-100 flex items-center justify-center">
									<HiOfficeBuilding className="w-3.5 h-3.5 text-green-700" />
								</div>
								<h3 className="text-sm font-bold text-gray-800">Dealer Information</h3>
							</div>
							{formBody}
						</div>
					</div>

					<div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-between gap-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							disabled={loading}
							className="flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-green-300 disabled:cursor-not-allowed
                text-white text-sm font-bold px-6 py-2 transition shadow-sm"
						>
							{loading ? (
								<><span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" /> Saving...</>
							) : (
								<><HiCheckCircle className="w-4 h-4" /> {rows.length > 1 ? `Save ${rows.length} Dealers` : "Save Dealer"}</>
							)}
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Page mode
	return (
		<div className="w-full h-full bg-gray-50">
			<form onSubmit={handleSubmit} className="bg-white w-full h-full flex flex-col">
				<div className="sticky top-0 z-20 border-b bg-white border-gray-200 px-4 sm:px-6 py-4">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 bg-green-700 flex items-center justify-center shadow-sm">
							<HiOfficeBuilding className="w-4.5 h-4.5 text-white" />
						</div>
						<div>
							<h2 className="sm:text-lg text-base font-bold text-gray-900 leading-tight">Add Dealers</h2>
							<p className="text-xs text-gray-400 mt-0.5">Add one or multiple dealers at once</p>
						</div>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-5">
					<div className="border border-gray-200 p-4 sm:p-6 bg-white shadow-sm">
						<div className="flex items-center gap-2 mb-5">
							<div className="w-6 h-6 bg-green-100 flex items-center justify-center">
								<HiOfficeBuilding className="w-3.5 h-3.5 text-green-700" />
							</div>
							<h3 className="text-sm font-bold text-gray-900">Dealer Information</h3>
						</div>
						{formBody}
					</div>

					<div className="flex justify-end pb-4">
						<button
							type="submit"
							disabled={loading}
							className="flex items-center gap-2 w-full sm:w-auto bg-green-700 hover:bg-green-800 disabled:bg-green-300
                disabled:cursor-not-allowed text-white text-sm font-bold px-8 py-2.5 transition shadow-sm justify-center"
						>
							{loading ? (
								<><span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" /> Saving...</>
							) : (
								<><HiCheckCircle className="w-4 h-4" /> {rows.length > 1 ? `Save ${rows.length} Dealers` : "Save Dealer"}</>
							)}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default AddDealer;