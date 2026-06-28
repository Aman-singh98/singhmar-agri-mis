import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
	HiEye, HiOfficeBuilding, HiPlus, HiTrash, HiPencil, HiFilter,
	HiUsers, HiSearch, HiRefresh
} from "react-icons/hi";
import {
	fetchDealers,
	deleteDealer,
	selectDealers,
	selectDealerLoading,
	selectDealerError,
	clearError
} from "../../store/dealerSlice";
import AddDealer from "./AddDealer";
import DealerPreview from "./DealerPreview";
import Pdf from "../../components/Pdf";
import Filter from "../../components/Filter";
import Pagination from "../../components/Pagination";
import { ConfirmDialog, EmptyPlaceholder } from "../../components/app";

const ITEMS_PER_PAGE = 8;

const SEARCHABLE_FIELDS = [
	{ key: "dealerName", label: "Dealer Name" },
	{ key: "farmerDealerCode", label: "Dealer Code" },
];

function DealerListPage() {
	const dispatch = useDispatch();
	const dealers = useSelector(selectDealers);
	const loading = useSelector(selectDealerLoading);
	const error = useSelector(selectDealerError);

	const [currentPage, setCurrentPage] = useState(1);
	const [addOpen, setAddOpen] = useState(false);
	const [selectedDealer, setSelectedDealer] = useState(null);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewMode, setPreviewMode] = useState("view");
	const [confirmDealer, setConfirmDealer] = useState(null);
	const [selectedIds, setSelectedIds] = useState(new Set());
	const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
	const [searchTags, setSearchTags] = useState([]);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [mobileStartDate, setMobileStartDate] = useState("");
	const [mobileEndDate, setMobileEndDate] = useState("");

	useEffect(() => {
		if (!dealers.length && !loading) {
			dispatch(fetchDealers());
		}
	}, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (error) { toast.error(error); dispatch(clearError()); }
	}, [error, dispatch]);

	function addTag(tag) { setSearchTags(p => [...p, tag]); setCurrentPage(1); }
	function removeTag(id) { setSearchTags(p => p.filter(t => t.id !== id)); }
	function clearTags() { setSearchTags([]); }
	function clearMobileDates() { setMobileStartDate(""); setMobileEndDate(""); }
	function handleRefresh() { dispatch(fetchDealers()); }
	function clearSelection() { setSelectedIds(new Set()); }
	function openView(item) { setSelectedDealer(item); setPreviewMode("view"); setPreviewOpen(true); }
	function openEdit(item) { setSelectedDealer(item); setPreviewMode("edit"); setPreviewOpen(true); }

	const filtered = useMemo(() => {
		let data = [...dealers];
		if (mobileStartDate) {
			const from = new Date(mobileStartDate); from.setHours(0, 0, 0, 0);
			data = data.filter(d => d.createdAt && new Date(d.createdAt) >= from);
		}
		if (mobileEndDate) {
			const to = new Date(mobileEndDate); to.setHours(23, 59, 59, 999);
			data = data.filter(d => d.createdAt && new Date(d.createdAt) <= to);
		}
		if (searchTags.length > 0) {
			data = data.filter(item =>
				searchTags.every(tag => {
					const val = tag.value.toLowerCase();
					if (tag.field === "dealerName") return (item.dealerName || "").toLowerCase().includes(val);
					if (tag.field === "farmerDealerCode") return (item.farmerDealerCode || "").toLowerCase().includes(val);
					return true;
				})
			);
		}
		return data;
	}, [dealers, mobileStartDate, mobileEndDate, searchTags]);

	useMemo(() => { setCurrentPage(1); }, [filtered]);

	const filteredIds = useMemo(() => filtered.map(d => d._id), [filtered]);
	const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
	const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
	const paginatedIds = paginated.map(d => d._id);

	const allPageSelected = paginatedIds.length > 0 && paginatedIds.every(id => selectedIds.has(id));
	const somePageSelected = paginatedIds.some(id => selectedIds.has(id));

	function toggleOne(id) {
		setSelectedIds(prev => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	}

	function togglePageAll() {
		setSelectedIds(prev => {
			const next = new Set(prev);
			if (allPageSelected) {
				paginatedIds.forEach(id => next.delete(id));
			} else {
				paginatedIds.forEach(id => next.add(id));
			}
			return next;
		});
	}

	async function handleDelete() {
		if (!confirmDealer) return;
		const result = await dispatch(deleteDealer(confirmDealer._id));
		if (deleteDealer.fulfilled.match(result)) {
			toast.success("Dealer deleted");
			setSelectedIds(prev => { const n = new Set(prev); n.delete(confirmDealer._id); return n; });
		} else {
			toast.error(result.payload || "Delete failed");
			dispatch(clearError());
		}
		setConfirmDealer(null);
	}

	async function handleBulkDelete() {
		const ids = Array.from(selectedIds);
		let successCount = 0;
		let failCount = 0;
		for (const id of ids) {
			const result = await dispatch(deleteDealer(id));
			if (deleteDealer.fulfilled.match(result)) successCount++;
			else failCount++;
		}
		if (successCount > 0) toast.success(`${successCount} dealer${successCount > 1 ? "s" : ""} deleted`);
		if (failCount > 0) toast.error(`${failCount} deletion${failCount > 1 ? "s" : ""} failed`);
		setConfirmBulkDelete(false);
		clearSelection();
		dispatch(clearError());
	}

	return (
		<div className="w-full h-full bg-gray-50 flex flex-col">

			{/* ── PAGE HEADER ── */}
			<div className="flex-none bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
				<div className="flex items-center justify-between gap-4 flex-wrap">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10  bg-green-700 flex items-center justify-center shadow-sm">
							<HiUsers className="w-5 h-5 text-white" />
						</div>
						<div>
							<h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
								Dealer Management
							</h2>
							<p className="text-xs text-gray-400 mt-0.5">
								{loading ? "Loading..." : `${dealers.length} dealers registered`}
							</p>
						</div>
					</div>
					<div className="hidden sm:flex items-center gap-2">
						<button
							type="button"
							onClick={handleRefresh}
							disabled={loading}
							className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-gray-200 bg-white  hover:bg-gray-50 transition disabled:opacity-40"
						>
							<HiRefresh className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
							Refresh
						</button>
						<button
							type="button"
							onClick={() => setAddOpen(true)}
							className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 text-sm font-semibold  hover:bg-green-800 transition shadow-sm shadow-green-200"
						>
							<HiPlus className="w-4 h-4" />
							Add Dealer
						</button>
					</div>
				</div>
			</div>

			{/* ── BULK SELECTION BAR ── */}
			{selectedIds.size > 0 && (
				<div className="flex-none border-b bg-orange-50 border-orange-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
					<div className="flex items-center gap-3">
						<div className="w-2 h-2  bg-orange-500 animate-pulse" />
						<span className="text-sm font-semibold text-orange-800">
							{selectedIds.size} dealer{selectedIds.size > 1 ? "s" : ""} selected
						</span>
						<button
							type="button"
							onClick={clearSelection}
							className="text-xs text-orange-600 hover:text-orange-800 underline underline-offset-2 transition"
						>
							Clear
						</button>
					</div>
					<button
						type="button"
						onClick={() => setConfirmBulkDelete(true)}
						className="flex items-center gap-2 bg-red-600 text-white px-3 py-1.5  text-xs font-semibold hover:bg-red-700 transition shadow-sm"
					>
						<HiTrash className="w-3.5 h-3.5" />
						Delete ({selectedIds.size})
					</button>
				</div>
			)}

			{/* ── FILTER BAR ── */}
			<div className="flex-none bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
				<div className="hidden sm:flex gap-3 w-full items-center">
					<div className="flex-1 min-w-0">
						<Filter
							searchableFields={SEARCHABLE_FIELDS}
							isDrawerOpen={isDrawerOpen}
							setIsDrawerOpen={setIsDrawerOpen}
							searchTags={searchTags}
							onAddTag={addTag}
							onRemoveTag={removeTag}
							onClearAllTags={clearTags}
							totalCount={filtered.length}
							startDate={mobileStartDate}
							endDate={mobileEndDate}
							onStartDateChange={setMobileStartDate}
							onEndDateChange={setMobileEndDate}
							onClearDates={clearMobileDates}
						/>
					</div>
					<Pdf
						model="dealer"
						fileName="dealer-report"
						label="PDF"
					/>
				</div>

				{/* Mobile filter bar */}
				<div className="sm:hidden flex gap-2 w-full items-center">
					<button
						type="button"
						onClick={() => setIsDrawerOpen(true)}
						className="flex items-center justify-center bg-green-700 text-white p-2  hover:bg-green-800 transition flex-shrink-0"
					>
						<HiFilter className="w-5 h-5" />
					</button>
					<Pdf
						model="dealer"
						fileName="dealer-report"
						label="PDF"
					/>
					<button
						type="button"
						onClick={() => setAddOpen(true)}
						className="flex items-center justify-center gap-1.5 bg-green-700 text-white px-3 py-2  hover:bg-green-800 transition flex-1 text-sm font-semibold"
					>
						<HiPlus className="w-4 h-4" />
						Add Dealer
					</button>
				</div>
				{isDrawerOpen && (
					<div className="mt-3 sm:hidden">
						<Filter
							searchableFields={SEARCHABLE_FIELDS}
							isDrawerOpen={isDrawerOpen}
							setIsDrawerOpen={setIsDrawerOpen}
							searchTags={searchTags}
							onAddTag={addTag}
							onRemoveTag={removeTag}
							onClearAllTags={clearTags}
							totalCount={filtered.length}
							startDate={mobileStartDate}
							endDate={mobileEndDate}
							onStartDateChange={setMobileStartDate}
							onEndDateChange={setMobileEndDate}
							onClearDates={clearMobileDates}
						/>
					</div>
				)}
			</div>

			{/* ── CONTENT ── */}
			<div className="flex-1 overflow-y-auto">

				{/* Desktop Table */}
				<div className="hidden md:block p-5">
					{searchTags.length > 0 && (
						<div className="mb-3 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 ">
							<HiSearch className="w-3.5 h-3.5 text-green-600" />
							<span className="text-xs text-green-700 font-semibold">
								{filtered.length} result{filtered.length !== 1 ? "s" : ""} for active filters
							</span>
						</div>
					)}
					<div className="bg-white border border-gray-200  overflow-hidden shadow-sm">
						<table className="min-w-full text-sm">
							<thead>
								<tr className="bg-gray-50 border-b border-gray-200">
									<th className="px-4 py-3 w-10">
										<input
											type="checkbox"
											checked={allPageSelected}
											ref={el => { if (el) el.indeterminate = somePageSelected && !allPageSelected; }}
											onChange={togglePageAll}
											className="w-4 h-4 accent-green-700 cursor-pointer rounded"
										/>
									</th>
									<th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider w-14">S.No</th>
									<th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Dealer Name</th>
									<th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Code</th>
									<th className="px-4 py-3 text-center font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{loading ? (
									Array.from({ length: 6 }).map((_, i) => (
										<tr key={i}>
											{Array.from({ length: 5 }).map((__, j) => (
												<td key={j} className="px-4 py-3.5">
													<div className="h-3.5 bg-gray-100  animate-pulse" style={{ width: j === 2 ? "60%" : "40%" }} />
												</td>
											))}
										</tr>
									))
								) : paginated.length === 0 ? (
									<tr>
										<td colSpan={5}>
											<EmptyPlaceholder
												icon="🏢"
												title="No Record Found"
												description={searchTags.length > 0 ? "No dealers match your filters." : "No dealers have been added yet."}
											/>
										</td>
									</tr>
								) : (
									paginated.map((item, index) => {
										const isChecked = selectedIds.has(item._id);
										return (
											<tr
												key={item._id}
												className={
													"transition-colors " +
													(isChecked ? "bg-green-50/60" : "hover:bg-gray-50/80")
												}
											>
												<td className="px-4 py-3.5 w-10">
													<input
														type="checkbox"
														checked={isChecked}
														onChange={() => toggleOne(item._id)}
														className="w-4 h-4 accent-green-700 cursor-pointer rounded"
													/>
												</td>
												<td className="px-4 py-3.5 text-gray-400 text-xs font-mono">
													{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
												</td>
												<td className="px-4 py-3.5">
													<div className="flex items-center gap-2.5">
														<div className="w-7 h-7  bg-green-100 flex items-center justify-center flex-shrink-0">
															<HiOfficeBuilding className="w-3.5 h-3.5 text-green-700" />
														</div>
														<span className="font-semibold text-gray-800">{item.dealerName}</span>
													</div>
												</td>
												<td className="px-4 py-3.5">
													<span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1  text-xs font-mono font-semibold">
														{item.farmerDealerCode}
													</span>
												</td>
												<td className="px-4 py-3.5">
													<div className="flex items-center justify-center gap-1.5">
														<button
															onClick={() => openView(item)}
															title="View"
															className="flex items-center gap-1 bg-green-700 text-white px-2.5 py-1.5  hover:bg-green-800 transition text-xs font-medium"
														>
															<HiEye className="w-3.5 h-3.5" /> View
														</button>
														<button
															onClick={() => openEdit(item)}
															title="Edit"
															className="flex items-center gap-1 bg-white text-gray-600 border border-gray-200 px-2.5 py-1.5  hover:bg-gray-50 hover:text-gray-800 transition text-xs font-medium"
														>
															<HiPencil className="w-3.5 h-3.5" /> Edit
														</button>
														<button
															onClick={() => setConfirmDealer(item)}
															title="Delete"
															className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2.5 py-1.5  hover:bg-red-100 transition text-xs font-medium"
														>
															<HiTrash className="w-3.5 h-3.5" />
														</button>
													</div>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>

						{/* Table footer */}
						{!loading && paginated.length > 0 && (
							<div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-2">
								<span className="text-xs text-gray-400">
									Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
								</span>
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={setCurrentPage}
								/>
							</div>
						)}
					</div>
				</div>

				{/* Mobile Cards */}
				<div className="md:hidden p-3 space-y-2.5">
					{loading ? (
						Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="bg-white border border-gray-100  p-4 animate-pulse space-y-3">
								<div className="h-4 bg-gray-100  w-1/2" />
								<div className="h-3 bg-gray-100  w-1/3" />
							</div>
						))
					) : paginated.length === 0 ? (
						<EmptyPlaceholder
							icon="🏢"
							title="No Record Found"
							description={searchTags.length > 0 ? "No dealers match your filters." : "No dealers have been added yet."}
						/>
					) : (
						paginated.map(item => {
							const isChecked = selectedIds.has(item._id);
							return (
								<div
									key={item._id}
									className={
										"border  p-4 transition shadow-sm " +
										(isChecked ? "bg-green-50 border-green-300" : "bg-white border-gray-200")
									}
								>
									<div className="flex justify-between items-start mb-3">
										<div className="flex items-center gap-2.5">
											<input
												type="checkbox"
												checked={isChecked}
												onChange={() => toggleOne(item._id)}
												className="w-4 h-4 accent-green-700 cursor-pointer flex-shrink-0"
											/>
											<div className="w-7 h-7  bg-green-100 flex items-center justify-center">
												<HiOfficeBuilding className="w-3.5 h-3.5 text-green-700" />
											</div>
											<h4 className="font-semibold text-gray-800 text-sm">{item.dealerName}</h4>
										</div>
										<span className="bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-0.5  text-xs font-mono font-semibold">
											{item.farmerDealerCode}
										</span>
									</div>
									<div className="flex gap-2">
										<button
											onClick={() => openView(item)}
											className="flex-1 bg-green-700 text-white py-2  hover:bg-green-800 transition flex items-center justify-center gap-1.5 text-xs font-semibold"
										>
											<HiEye className="w-3.5 h-3.5" /> View
										</button>
										<button
											onClick={() => openEdit(item)}
											className="flex-1 bg-white text-gray-600 border border-gray-200 py-2  hover:bg-gray-50 transition flex items-center justify-center gap-1.5 text-xs font-semibold"
										>
											<HiPencil className="w-3.5 h-3.5" /> Edit
										</button>
										<button
											onClick={() => setConfirmDealer(item)}
											className="bg-red-50 text-red-600 border border-red-200 px-3 py-2  hover:bg-red-100 transition flex items-center justify-center"
										>
											<HiTrash className="w-4 h-4" />
										</button>
									</div>
								</div>
							);
						})
					)}

					{!loading && paginated.length > 0 && (
						<div className="pt-1 pb-4">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setCurrentPage}
							/>
						</div>
					)}
				</div>
			</div>

			<ConfirmDialog
				isOpen={!!confirmDealer}
				title="Delete Dealer?"
				description={`This will permanently delete "${confirmDealer?.dealerName}". This action cannot be undone.`}
				onConfirm={handleDelete}
				onCancel={() => setConfirmDealer(null)}
			/>
			<ConfirmDialog
				isOpen={confirmBulkDelete}
				title={`Delete ${selectedIds.size} Dealer${selectedIds.size > 1 ? "s" : ""}?`}
				description={`This will permanently delete ${selectedIds.size} selected dealer${selectedIds.size > 1 ? "s" : ""}. This action cannot be undone.`}
				onConfirm={handleBulkDelete}
				onCancel={() => setConfirmBulkDelete(false)}
			/>
			{previewOpen && selectedDealer && (
				<DealerPreview
					dealer={selectedDealer}
					initialMode={previewMode}
					onClose={() => { setPreviewOpen(false); setSelectedDealer(null); }}
					onUpdated={() => { setPreviewOpen(false); setSelectedDealer(null); }}
					onDeleted={() => { setPreviewOpen(false); setSelectedDealer(null); }}
				/>
			)}
			{addOpen && (
				<AddDealer
					mode="modal"
					onClose={() => setAddOpen(false)}
					onSuccess={() => setAddOpen(false)}
				/>
			)}
		</div>
	);
}

export default DealerListPage;
