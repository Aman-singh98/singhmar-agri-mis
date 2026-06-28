import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
	HiX, HiOfficeBuilding, HiHashtag, HiPencil, HiTrash,
	HiExclamation, HiCheckCircle, HiShieldCheck
} from "react-icons/hi";
import {
	updateDealer,
	deleteDealer,
	selectDealerActionLoading,
	clearError,
} from "../../store/dealerSlice";

const DealerPreview = ({ dealer, initialMode = "view", onClose, onUpdated, onDeleted }) => {
	const dispatch = useDispatch();
	const loading = useSelector(selectDealerActionLoading);

	const [isEdit, setIsEdit] = useState(initialMode === "edit");
	const [confirmDelete, setConfirmDelete] = useState(initialMode === "delete");

	const [dealerName, setDealerName] = useState(dealer?.dealerName || "");
	const [farmerDealerCode, setFarmerDealerCode] = useState(dealer?.farmerDealerCode || "");
	const [nameError, setNameError] = useState("");
	const [codeError, setCodeError] = useState("");

	const resetForm = () => {
		setDealerName(dealer?.dealerName || "");
		setFarmerDealerCode(dealer?.farmerDealerCode || "");
		setNameError("");
		setCodeError("");
	};

	const handleUpdate = async () => {
		setNameError(""); setCodeError("");
		if (!dealerName.trim()) return setNameError("Dealer name is required");
		if (dealerName.trim().length < 2) return setNameError("Min 2 characters");
		if (!farmerDealerCode.trim()) return setCodeError("Dealer code is required");

		const unchanged =
			dealerName.trim().toLowerCase() === dealer?.dealerName?.toLowerCase() &&
			farmerDealerCode.trim() === dealer?.farmerDealerCode;
		if (unchanged) return toast.info("No changes detected");

		const result = await dispatch(updateDealer({
			id: dealer._id,
			dealerName: dealerName.trim(),
			farmerDealerCode: farmerDealerCode.trim(),
		}));

		if (updateDealer.fulfilled.match(result)) {
			toast.success("Dealer updated successfully");
			onUpdated && onUpdated();
			onClose();
		} else {
			const msg = result.payload || "Update failed";
			if (msg.toLowerCase().includes("name")) setNameError(msg);
			else if (msg.toLowerCase().includes("code")) setCodeError(msg);
			else toast.error(msg);
			dispatch(clearError());
		}
	};

	const handleDelete = async () => {
		const result = await dispatch(deleteDealer(dealer._id));
		if (deleteDealer.fulfilled.match(result)) {
			toast.success("Dealer deleted");
			onDeleted && onDeleted();
			onClose();
		} else {
			toast.error(result.payload || "Delete failed");
			dispatch(clearError());
		}
	};

	return (
		<>
			{/* MAIN MODAL */}
			<div
				className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
				style={{ zIndex: 99999 }}
				onClick={(e) => { if (e.target === e.currentTarget && !confirmDelete) onClose(); }}
			>
				<div
					className="bg-white w-full max-w-md shadow-2xl overflow-hidden"
					style={{ zIndex: 100000 }}
					onClick={(e) => e.stopPropagation()}
				>
					{/* HEADER */}
					<div className="relative bg-gradient-to-br from-green-800 to-green-700 text-white px-5 py-5">
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-white/15 flex items-center justify-center">
									<HiOfficeBuilding className="w-5 h-5 text-white" />
								</div>
								<div>
									<h3 className="text-base font-bold tracking-tight">
										{isEdit ? "Edit Dealer" : "Dealer Details"}
									</h3>
									<p className="text-xs text-green-200 mt-0.5">
										{isEdit ? "Update dealer information" : dealer.dealerName}
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={onClose}
								className="w-8 h-8 flex items-center justify-center hover:bg-white/15 transition text-green-200 hover:text-white"
							>
								<HiX className="w-4 h-4" />
							</button>
						</div>
					</div>

					{/* VIEW MODE */}
					{!isEdit && (
						<div className="p-5 space-y-4">
							<div className="grid grid-cols-2 gap-3">
								<InfoCard icon={<HiOfficeBuilding />} label="Dealer Name" value={dealer.dealerName} accent="green" />
								<InfoCard icon={<HiHashtag />} label="Dealer Code" value={dealer.farmerDealerCode} accent="gray" />
							</div>
							<div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100">
								<HiShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
								<p className="text-xs text-green-700 font-medium">Verified dealer record</p>
							</div>
							<div className="flex justify-between gap-2 pt-1">
								<button
									type="button"
									onClick={() => setConfirmDelete(true)}
									className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 px-4 py-2 text-sm font-medium hover:bg-red-100 transition"
								>
									<HiTrash className="w-4 h-4" /> Delete
								</button>
								<button
									type="button"
									onClick={() => setIsEdit(true)}
									className="flex items-center gap-1.5 bg-green-700 text-white px-5 py-2 text-sm font-semibold hover:bg-green-800 transition shadow-sm"
								>
									<HiPencil className="w-4 h-4" /> Edit Details
								</button>
							</div>
						</div>
					)}

					{/* EDIT MODE */}
					{isEdit && (
						<div className="p-5 space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{/* Dealer Name */}
								<div className="flex flex-col gap-1.5">
									<label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
										Dealer Name <span className="text-red-500 normal-case">*</span>
									</label>
									<div className="relative">
										<HiOfficeBuilding className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 w-4 h-4" />
										<input
											value={dealerName}
											onChange={(e) => { setDealerName(e.target.value); setNameError(""); }}
											placeholder="Enter dealer name"
											className={`w-full pl-9 pr-3 py-2.5 text-sm border focus:outline-none focus:ring-2 transition
                        ${nameError
													? "border-red-300 focus:ring-red-300 bg-red-50"
													: "border-gray-200 focus:ring-green-600/30 focus:border-green-500 bg-white"}`}
										/>
									</div>
									{nameError && <span className="text-xs text-red-500 flex items-center gap-1"><HiExclamation className="w-3 h-3" />{nameError}</span>}
								</div>

								{/* Dealer Code */}
								<div className="flex flex-col gap-1.5">
									<label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
										Dealer Code <span className="text-red-500 normal-case">*</span>
									</label>
									<div className="relative">
										<HiHashtag className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 w-4 h-4" />
										<input
											value={farmerDealerCode}
											onChange={(e) => { setFarmerDealerCode(e.target.value); setCodeError(""); }}
											placeholder="Enter dealer code"
											className={`w-full pl-9 pr-3 py-2.5 text-sm border focus:outline-none focus:ring-2 transition
                        ${codeError
													? "border-red-300 focus:ring-red-300 bg-red-50"
													: "border-gray-200 focus:ring-green-600/30 focus:border-green-500 bg-white"}`}
										/>
									</div>
									{codeError && (
										<span className="text-xs text-red-500 flex items-center gap-1">
											<HiExclamation className="w-3 h-3" />{codeError}
										</span>
									)}
								</div>
							</div>

							<div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
								<button
									type="button"
									onClick={() => { setIsEdit(false); resetForm(); }}
									className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={handleUpdate}
									disabled={loading}
									className="flex items-center gap-2 bg-green-700 text-white px-5 py-2 text-sm font-semibold hover:bg-green-800 transition disabled:opacity-50 shadow-sm"
								>
									{loading ? (
										<><span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" /> Saving...</>
									) : (
										<><HiCheckCircle className="w-4 h-4" /> Save Changes</>
									)}
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* DELETE CONFIRM */}
			{confirmDelete && (
				<div
					className="fixed inset-0 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
					style={{ zIndex: 100001 }}
					onClick={(e) => { if (e.target === e.currentTarget) setConfirmDelete(false); }}
				>
					<div
						className="bg-white w-full max-w-sm shadow-2xl overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="h-1 bg-gradient-to-r from-red-400 to-red-600 w-full" />
						<div className="p-6 text-center space-y-4">
							<div className="w-14 h-14 bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto">
								<HiTrash className="w-7 h-7 text-red-500" />
							</div>
							<div>
								<h4 className="text-base font-bold text-gray-900">Delete Dealer?</h4>
								<p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
									You're about to delete{" "}
									<span className="font-semibold text-gray-800">"{dealer.dealerName}"</span>.
									<br />
									<span className="text-red-500 text-xs font-medium">This action cannot be undone.</span>
								</p>
							</div>
							<div className="flex gap-2.5 pt-1">
								<button
									type="button"
									onClick={() => setConfirmDelete(false)}
									className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 text-sm font-semibold hover:bg-gray-200 transition"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={handleDelete}
									disabled={loading}
									className="flex-1 bg-red-600 text-white px-4 py-2.5 text-sm font-bold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
								>
									{loading ? (
										<><span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" /> Deleting...</>
									) : (
										<><HiTrash className="w-4 h-4" /> Yes, Delete</>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

const InfoCard = ({ icon, label, value, accent = "gray" }) => (
	<div className={`border p-3.5 ${accent === "green" ? "bg-green-50/50 border-green-100" : "bg-gray-50 border-gray-200"}`}>
		<div className="flex items-center gap-2 mb-2">
			<span className={`text-sm ${accent === "green" ? "text-green-600" : "text-gray-400"}`}>{icon}</span>
			<span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{label}</span>
		</div>
		<p className="text-sm font-bold text-gray-900 font-mono">{value || "—"}</p>
	</div>
);

export default DealerPreview;