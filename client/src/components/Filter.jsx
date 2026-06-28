// import React, { useState, useRef, useEffect } from "react";
// import { HiFilter, HiX, HiSearch, HiCalendar, HiChevronDown } from "react-icons/hi";

// /* ─── Color palette per field index ─── */
// const TAG_PALETTE = [
// 	{ bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE", dot: "#3B82F6" },
// 	{ bg: "#F5F3FF", text: "#6D28D9", border: "#DDD6FE", dot: "#8B5CF6" },
// 	{ bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0", dot: "#10B981" },
// 	{ bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA", dot: "#F97316" },
// 	{ bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3", dot: "#F43F5E" },
// 	{ bg: "#F0FDFA", text: "#0F766E", border: "#99F6E4", dot: "#14B8A6" },
// 	{ bg: "#F0FDF4", text: "#166534", border: "#86EFAC", dot: "#22C55E" },
// 	{ bg: "#FDF4FF", text: "#86198F", border: "#F0ABFC", dot: "#D946EF" },
// ];

// const getColor = (field, fields) => {
// 	const idx = fields.findIndex((f) => f.key === field);
// 	return TAG_PALETTE[(idx >= 0 ? idx : 0) % TAG_PALETTE.length];
// };

// /* ─── Tag chip ─── */
// const SearchTag = ({ tag, onRemove, searchableFields }) => {
// 	const c = getColor(tag.field, searchableFields);
// 	const lbl = searchableFields.find((f) => f.key === tag.field)?.label || tag.field;
// 	return (
// 		<span
// 			style={{
// 				display: "inline-flex",
// 				alignItems: "center",
// 				gap: "6px",
// 				padding: "4px 10px",
// 				borderRadius: "6px",
// 				fontSize: "12px",
// 				fontWeight: 500,
// 				background: c.bg,
// 				color: c.text,
// 				border: `1px solid ${c.border}`,
// 				fontFamily: "'DM Sans', sans-serif",
// 				animation: "tagIn 0.18s ease",
// 			}}
// 		>
// 			<span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
// 			<span style={{ fontWeight: 600 }}>{lbl}:</span>
// 			<span>{tag.value}</span>
// 			<button
// 				onClick={() => onRemove(tag.id)}
// 				style={{
// 					marginLeft: 2,
// 					background: "none",
// 					border: "none",
// 					cursor: "pointer",
// 					padding: 0,
// 					color: c.text,
// 					opacity: 0.6,
// 					display: "flex",
// 					alignItems: "center",
// 					transition: "opacity 0.15s",
// 				}}
// 				onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
// 				onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
// 			>
// 				<HiX style={{ width: 12, height: 12 }} />
// 			</button>
// 		</span>
// 	);
// };

// /* ─── Main Filter component ─── */
// const Filter = ({
// 	searchableFields = [],
// 	allColumns = [],
// 	visibleColumns = [],
// 	toggleColumn,
// 	isDrawerOpen,
// 	setIsDrawerOpen,
// 	searchTags = [],
// 	onAddTag,
// 	onRemoveTag,
// 	onClearAllTags,
// 	startDate = "",
// 	endDate = "",
// 	onStartDateChange,
// 	onEndDateChange,
// 	onClearDates,
// 	totalCount,
// }) => {
// 	const [inputValue, setInputValue] = useState("");
// 	const [selectedField, setSelectedField] = useState("");
// 	const [fieldOpen, setFieldOpen] = useState(false);
// 	const fieldDropdownRef = useRef(null);

// 	useEffect(() => {
// 		if (!selectedField && searchableFields.length) setSelectedField(searchableFields[0].key);
// 	}, [searchableFields, selectedField]);

// 	useEffect(() => {
// 		const handler = (e) => {
// 			if (fieldDropdownRef.current && !fieldDropdownRef.current.contains(e.target)) setFieldOpen(false);
// 		};
// 		document.addEventListener("mousedown", handler);
// 		return () => document.removeEventListener("mousedown", handler);
// 	}, []);

// 	const selectedLabel = searchableFields.find((f) => f.key === selectedField)?.label || "Field";
// 	const hasActiveDates = !!(startDate || endDate);
// 	const activeCount = searchTags.length + (hasActiveDates ? 1 : 0);

// 	const handleAdd = () => {
// 		const val = inputValue.trim();
// 		if (!val || !selectedField) return;
// 		onAddTag({ id: Date.now(), field: selectedField, value: val });
// 		setInputValue("");
// 	};

// 	/* ── Shared style tokens ── */
// 	const radius = "8px";
// 	const borderColor = "#E2E8F0";
// 	const textBase = "#0F172A";
// 	const textMuted = "#64748B";
// 	const fontFamily = "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif";

// 	// ── Green theme tokens (from index.css) ──
// 	const primary = "#16a34a";   // --color-primary
// 	const primaryDark = "#15803d";   // --color-primary-dark
// 	const primaryMuted = "#dcfce7";   // --color-primary-muted
// 	const primaryText = "#166534";   // --color-primary-text
// 	const primaryRing = "rgba(22,163,74,0.15)";

// 	const inputStyle = {
// 		fontFamily,
// 		fontSize: 13,
// 		color: textBase,
// 		border: `1px solid ${borderColor}`,
// 		borderRadius: radius,
// 		padding: "8px 12px",
// 		outline: "none",
// 		background: "#fff",
// 		transition: "border-color 0.15s, box-shadow 0.15s",
// 		width: "100%",
// 		boxSizing: "border-box",
// 	};

// 	const focusInput = (e) => {
// 		e.target.style.borderColor = primary;
// 		e.target.style.boxShadow = `0 0 0 3px ${primaryRing}`;
// 	};
// 	const blurInput = (e) => {
// 		e.target.style.borderColor = borderColor;
// 		e.target.style.boxShadow = "none";
// 	};

// 	return (
// 		<>
// 			<style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
//         @keyframes tagIn { from { opacity:0; transform:scale(0.88); } to { opacity:1; transform:scale(1); } }
//         @keyframes drawerIn { from { transform:translateX(-100%); } to { transform:translateX(0); } }
//         @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
//         .flt-field-btn:hover { background: #F0FDF4 !important; }
//         .flt-add-btn:hover { background: ${primaryDark} !important; }
//         .flt-clear-btn:hover { background: #FEF2F2 !important; border-color: #FECACA !important; }
//         .flt-drawer-apply:hover { background: ${primaryDark} !important; }
//         .flt-drawer-clear:hover { background: #F0FDF4 !important; }
//         .flt-mobile-btn:hover { background: #1E293B !important; }
//         .flt-option:hover { background: #F0FDF4; }
//       `}</style>

// 			{/* ══════════════ DESKTOP ══════════════ */}
// 			<div style={{ fontFamily, display: "none" }} className="flt-desktop">
// 				{/* injected below via media query approach — use className visibility */}
// 			</div>

// 			{/* We'll use className-based responsive for simplicity */}

// 			{/* DESKTOP — hidden on mobile via inline responsive trick */}
// 			<div
// 				style={{
// 					fontFamily,
// 					display: "flex",
// 					flexDirection: "column",
// 					gap: 10,
// 					width: "100%",
// 				}}
// 				className="flt-wrap-desktop"
// 			>
// 				{/* Row */}
// 				<div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>

// 					{/* Search compound input */}
// 					<div
// 						style={{
// 							display: "flex",
// 							alignItems: "stretch",
// 							flex: 1,
// 							minWidth: 0,
// 							border: `1px solid ${borderColor}`,
// 							borderRadius: radius,
// 							background: "#fff",
// 							overflow: "visible",
// 							boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
// 							position: "relative",
// 							zIndex: 40,
// 						}}
// 					>
// 						{/* Field picker */}
// 						<div ref={fieldDropdownRef} style={{ position: "relative", flexShrink: 0, zIndex: 50 }}>
// 							<button
// 								type="button"
// 								className="flt-field-btn"
// 								onClick={() => setFieldOpen((v) => !v)}
// 								style={{
// 									display: "flex",
// 									alignItems: "center",
// 									gap: 6,
// 									padding: "0 12px",
// 									height: "100%",
// 									background: "#F8FAFC",
// 									borderRight: `1px solid ${borderColor}`,
// 									borderRadius: `${radius} 0 0 ${radius}`,
// 									cursor: "pointer",
// 									border: "none",
// 									fontFamily,
// 									fontSize: 12,
// 									fontWeight: 600,
// 									color: textMuted,
// 									letterSpacing: "0.01em",
// 									transition: "background 0.15s",
// 									whiteSpace: "nowrap",
// 								}}
// 							>
// 								<HiFilter style={{ width: 13, height: 13, color: "#94A3B8" }} />
// 								<span style={{ maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis" }}>{selectedLabel}</span>
// 								<HiChevronDown
// 									style={{
// 										width: 12,
// 										height: 12,
// 										color: "#94A3B8",
// 										transform: fieldOpen ? "rotate(180deg)" : "rotate(0deg)",
// 										transition: "transform 0.2s",
// 									}}
// 								/>
// 							</button>

// 							{fieldOpen && (
// 								<div
// 									style={{
// 										position: "absolute",
// 										top: "calc(100% + 6px)",
// 										left: 0,
// 										minWidth: 180,
// 										background: "#fff",
// 										border: `1px solid ${borderColor}`,
// 										borderRadius: 10,
// 										boxShadow: "0 8px 24px rgba(15,23,42,0.10), 0 2px 6px rgba(15,23,42,0.06)",
// 										zIndex: 9999,
// 										overflow: "hidden",
// 										animation: "fadeIn 0.14s ease",
// 									}}
// 								>
// 									{searchableFields.map((f, i) => (
// 										<button
// 											key={f.key}
// 											type="button"
// 											className="flt-option"
// 											onClick={() => { setSelectedField(f.key); setFieldOpen(false); }}
// 											style={{
// 												width: "100%",
// 												display: "flex",
// 												alignItems: "center",
// 												gap: 8,
// 												padding: "9px 14px",
// 												background: selectedField === f.key ? "#F0FDF4" : "transparent",
// 												border: "none",
// 												cursor: "pointer",
// 												fontFamily,
// 												fontSize: 13,
// 												fontWeight: selectedField === f.key ? 600 : 400,
// 												color: selectedField === f.key ? primary : textBase,
// 												textAlign: "left",
// 												borderBottom: i < searchableFields.length - 1 ? `1px solid #F1F5F9` : "none",
// 												transition: "background 0.12s",
// 											}}
// 										>
// 											{selectedField === f.key && (
// 												<span style={{ width: 6, height: 6, borderRadius: "50%", background: primary, flexShrink: 0 }} />
// 											)}
// 											{f.label}
// 										</button>
// 									))}
// 								</div>
// 							)}
// 						</div>

// 						{/* Text input */}
// 						<input
// 							value={inputValue}
// 							onChange={(e) => setInputValue(e.target.value)}
// 							onKeyDown={(e) => e.key === "Enter" && handleAdd()}
// 							placeholder={`Search by ${selectedLabel}…`}
// 							style={{
// 								flex: 1,
// 								minWidth: 0,
// 								padding: "9px 12px",
// 								border: "none",
// 								outline: "none",
// 								fontFamily,
// 								fontSize: 13,
// 								color: textBase,
// 								background: "transparent",
// 							}}
// 						/>

// 						{/* Add button */}
// 						<button
// 							type="button"
// 							className="flt-add-btn"
// 							onClick={handleAdd}
// 							style={{
// 								display: "flex",
// 								alignItems: "center",
// 								gap: 6,
// 								padding: "0 14px",
// 								background: primary,
// 								border: "none",
// 								borderRadius: `0 ${radius} ${radius} 0`,
// 								cursor: "pointer",
// 								fontFamily,
// 								fontSize: 12,
// 								fontWeight: 600,
// 								color: "#fff",
// 								letterSpacing: "0.02em",
// 								whiteSpace: "nowrap",
// 								flexShrink: 0,
// 								transition: "background 0.15s",
// 							}}
// 						>
// 							<HiSearch style={{ width: 13, height: 13 }} />
// 							Add Filter
// 						</button>
// 					</div>

// 					{/* Clear all */}
// 					{searchTags.length > 0 && (
// 						<button
// 							type="button"
// 							className="flt-clear-btn"
// 							onClick={onClearAllTags}
// 							style={{
// 								display: "flex",
// 								alignItems: "center",
// 								gap: 5,
// 								padding: "8px 12px",
// 								background: "#FFF5F5",
// 								border: "1px solid #FED7D7",
// 								borderRadius: radius,
// 								cursor: "pointer",
// 								fontFamily,
// 								fontSize: 12,
// 								fontWeight: 600,
// 								color: "#E53E3E",
// 								whiteSpace: "nowrap",
// 								flexShrink: 0,
// 								transition: "background 0.15s, border-color 0.15s",
// 							}}
// 						>
// 							<HiX style={{ width: 13, height: 13 }} />
// 							Clear
// 						</button>
// 					)}

// 					{/* Result count */}
// 					{totalCount !== undefined && searchTags.length > 0 && (
// 						<span
// 							style={{
// 								flexShrink: 0,
// 								fontSize: 12,
// 								fontWeight: 700,
// 								color: primaryText,
// 								background: primaryMuted,
// 								border: `1px solid #86efac`,
// 								padding: "6px 12px",
// 								borderRadius: radius,
// 								whiteSpace: "nowrap",
// 								fontFamily,
// 								letterSpacing: "0.01em",
// 							}}
// 						>
// 							{totalCount} result{totalCount !== 1 ? "s" : ""}
// 						</span>
// 					)}
// 				</div>

// 				{/* Active tags */}
// 				{searchTags.length > 0 && (
// 					<div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
// 						<span style={{ fontSize: 11, fontWeight: 600, color: textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>
// 							Active
// 						</span>
// 						{searchTags.map((tag) => (
// 							<SearchTag key={tag.id} tag={tag} onRemove={onRemoveTag} searchableFields={searchableFields} />
// 						))}
// 					</div>
// 				)}
// 			</div>

// 			{/* ══════════════ MOBILE ══════════════ */}
// 			<div
// 				className="flt-wrap-mobile"
// 				style={{ fontFamily, display: "flex", alignItems: "center", gap: 8, width: "100%" }}
// 			>
// 				<button
// 					type="button"
// 					className="flt-mobile-btn"
// 					onClick={() => setIsDrawerOpen(true)}
// 					style={{
// 						flex: 1,
// 						display: "flex",
// 						alignItems: "center",
// 						justifyContent: "center",
// 						gap: 8,
// 						padding: "10px 14px",
// 						background: "#0F172A",
// 						border: "none",
// 						borderRadius: radius,
// 						cursor: "pointer",
// 						fontFamily,
// 						fontSize: 13,
// 						fontWeight: 600,
// 						color: "#fff",
// 						transition: "background 0.15s",
// 					}}
// 				>
// 					<HiFilter style={{ width: 15, height: 15 }} />
// 					Filters
// 					{activeCount > 0 && (
// 						<span
// 							style={{
// 								minWidth: 20,
// 								height: 20,
// 								borderRadius: 10,
// 								background: primary,
// 								color: "#fff",
// 								fontSize: 11,
// 								fontWeight: 700,
// 								display: "flex",
// 								alignItems: "center",
// 								justifyContent: "center",
// 								padding: "0 5px",
// 							}}
// 						>
// 							{activeCount}
// 						</span>
// 					)}
// 				</button>

// 				{totalCount !== undefined && (
// 					<span
// 						style={{
// 							fontFamily,
// 							fontSize: 12,
// 							fontWeight: 600,
// 							color: textMuted,
// 							border: `1px solid ${borderColor}`,
// 							borderRadius: radius,
// 							padding: "8px 12px",
// 							whiteSpace: "nowrap",
// 							background: "#F8FAFC",
// 						}}
// 					>
// 						{totalCount} results
// 					</span>
// 				)}
// 			</div>

// 			{/* Responsive: hide desktop on small screens, hide mobile on large */}
// 			<style>{`
//         @media (min-width: 640px) { .flt-wrap-mobile { display: none !important; } }
//         @media (max-width: 639px) { .flt-wrap-desktop { display: none !important; } }
//       `}</style>

// 			{/* ══════════════ MOBILE DRAWER ══════════════ */}
// 			{isDrawerOpen && (
// 				<>
// 					<div
// 						onClick={() => setIsDrawerOpen(false)}
// 						style={{
// 							position: "fixed", inset: 0,
// 							background: "rgba(15,23,42,0.55)",
// 							backdropFilter: "blur(2px)",
// 							zIndex: 40,
// 							animation: "fadeIn 0.2s ease",
// 						}}
// 					/>
// 					<div
// 						style={{
// 							position: "fixed",
// 							left: 0, top: 0,
// 							height: "100%",
// 							width: 320,
// 							background: "#fff",
// 							zIndex: 50,
// 							display: "flex",
// 							flexDirection: "column",
// 							boxShadow: "4px 0 32px rgba(15,23,42,0.14)",
// 							animation: "drawerIn 0.25s cubic-bezier(0.22,1,0.36,1)",
// 							fontFamily,
// 						}}
// 					>
// 						{/* Header */}
// 						<div
// 							style={{
// 								display: "flex",
// 								justifyContent: "space-between",
// 								alignItems: "center",
// 								padding: "18px 20px",
// 								borderBottom: `1px solid ${borderColor}`,
// 								background: "#FAFAFA",
// 							}}
// 						>
// 							<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// 								<div
// 									style={{
// 										width: 32, height: 32, borderRadius: 8,
// 										background: primaryMuted,
// 										display: "flex", alignItems: "center", justifyContent: "center",
// 									}}
// 								>
// 									<HiFilter style={{ width: 16, height: 16, color: primary }} />
// 								</div>
// 								<span style={{ fontSize: 15, fontWeight: 700, color: textBase }}>Filters</span>
// 								{activeCount > 0 && (
// 									<span
// 										style={{
// 											padding: "2px 8px", borderRadius: 20,
// 											background: primary, color: "#fff",
// 											fontSize: 11, fontWeight: 700,
// 										}}
// 									>
// 										{activeCount}
// 									</span>
// 								)}
// 							</div>
// 							<button
// 								onClick={() => setIsDrawerOpen(false)}
// 								style={{
// 									background: "none", border: "none", cursor: "pointer",
// 									color: textMuted, padding: 4, borderRadius: 6,
// 									display: "flex", alignItems: "center", justifyContent: "center",
// 									transition: "color 0.15s",
// 								}}
// 								onMouseEnter={(e) => (e.currentTarget.style.color = "#E53E3E")}
// 								onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
// 							>
// 								<HiX style={{ width: 18, height: 18 }} />
// 							</button>
// 						</div>

// 						{/* Body */}
// 						<div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

// 							{/* Search section */}
// 							<div style={{ marginBottom: 24 }}>
// 								<p style={{ fontSize: 11, fontWeight: 700, color: textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>
// 									Search
// 								</p>
// 								<select
// 									value={selectedField}
// 									onChange={(e) => setSelectedField(e.target.value)}
// 									style={{ ...inputStyle, marginBottom: 8, appearance: "none" }}
// 									onFocus={focusInput}
// 									onBlur={blurInput}
// 								>
// 									{searchableFields.map((f) => (
// 										<option key={f.key} value={f.key}>{f.label}</option>
// 									))}
// 								</select>
// 								<div style={{ display: "flex", gap: 8 }}>
// 									<input
// 										value={inputValue}
// 										onChange={(e) => setInputValue(e.target.value)}
// 										onKeyDown={(e) => e.key === "Enter" && handleAdd()}
// 										placeholder={`Enter ${selectedLabel}…`}
// 										style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
// 										onFocus={focusInput}
// 										onBlur={blurInput}
// 									/>
// 									<button
// 										type="button"
// 										onClick={handleAdd}
// 										style={{
// 											padding: "8px 16px",
// 											background: primary,
// 											color: "#fff",
// 											border: "none",
// 											borderRadius: radius,
// 											cursor: "pointer",
// 											fontFamily,
// 											fontSize: 13,
// 											fontWeight: 600,
// 											flexShrink: 0,
// 										}}
// 									>
// 										Add
// 									</button>
// 								</div>
// 								{searchTags.length > 0 && (
// 									<div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
// 										{searchTags.map((tag) => (
// 											<SearchTag key={tag.id} tag={tag} onRemove={onRemoveTag} searchableFields={searchableFields} />
// 										))}
// 									</div>
// 								)}
// 							</div>

// 							{/* Date section */}
// 							<div>
// 								<p style={{ fontSize: 11, fontWeight: 700, color: textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
// 									<HiCalendar style={{ width: 13, height: 13 }} />
// 									Date Range
// 								</p>
// 								<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
// 									{[
// 										{ label: "From", val: startDate, cb: onStartDateChange },
// 										{ label: "To", val: endDate, cb: onEndDateChange },
// 									].map(({ label, val, cb }) => (
// 										<div key={label}>
// 											<span style={{ fontSize: 11, fontWeight: 600, color: textMuted, display: "block", marginBottom: 4 }}>{label}</span>
// 											<input
// 												type="date"
// 												value={val}
// 												onChange={(e) => cb && cb(e.target.value)}
// 												style={inputStyle}
// 												onFocus={focusInput}
// 												onBlur={blurInput}
// 											/>
// 										</div>
// 									))}
// 									{hasActiveDates && (
// 										<button
// 											onClick={onClearDates}
// 											style={{
// 												background: "none", border: "none",
// 												cursor: "pointer",
// 												fontFamily,
// 												fontSize: 12,
// 												fontWeight: 600,
// 												color: "#E53E3E",
// 												display: "flex",
// 												alignItems: "center",
// 												gap: 4,
// 												padding: "2px 0",
// 											}}
// 										>
// 											<HiX style={{ width: 13, height: 13 }} />
// 											Clear dates
// 										</button>
// 									)}
// 								</div>
// 							</div>
// 						</div>

// 						{/* Footer */}
// 						<div
// 							style={{
// 								padding: "14px 20px",
// 								borderTop: `1px solid ${borderColor}`,
// 								background: "#FAFAFA",
// 								display: "flex",
// 								gap: 8,
// 							}}
// 						>
// 							{activeCount > 0 && (
// 								<button
// 									type="button"
// 									className="flt-drawer-clear"
// 									onClick={() => { onClearAllTags(); if (onClearDates) onClearDates(); }}
// 									style={{
// 										flex: 1,
// 										padding: "10px",
// 										border: `1px solid ${borderColor}`,
// 										borderRadius: radius,
// 										cursor: "pointer",
// 										fontFamily,
// 										fontSize: 13,
// 										fontWeight: 600,
// 										color: textMuted,
// 										background: "#fff",
// 										transition: "background 0.15s",
// 									}}
// 								>
// 									Clear All
// 								</button>
// 							)}
// 							<button
// 								type="button"
// 								className="flt-drawer-apply"
// 								onClick={() => setIsDrawerOpen(false)}
// 								style={{
// 									flex: 1,
// 									padding: "10px",
// 									border: "none",
// 									borderRadius: radius,
// 									cursor: "pointer",
// 									fontFamily,
// 									fontSize: 13,
// 									fontWeight: 600,
// 									color: "#fff",
// 									background: primary,
// 									transition: "background 0.15s",
// 								}}
// 							>
// 								Apply & Close
// 							</button>
// 						</div>
// 					</div>
// 				</>
// 			)}
// 		</>
// 	);
// };

// export default Filter;











import React, { useState, useRef, useEffect } from "react";
import { HiFilter, HiX, HiSearch, HiCalendar, HiChevronDown } from "react-icons/hi";

// ─────────────────────────────────────────────────────────────────────────────
// Filter — pure Tailwind, no inline CSS, no rounded-*
// ─────────────────────────────────────────────────────────────────────────────

/* ── Tag color sets (Tailwind class groups per index) ── */
const TAG_PALETTE = [
   { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500"   },
   { bg: "bg-violet-50", text: "text-violet-700",  border: "border-violet-200", dot: "bg-violet-500" },
   { bg: "bg-emerald-50",text: "text-emerald-800", border: "border-emerald-200",dot: "bg-emerald-500"},
   { bg: "bg-orange-50", text: "text-orange-700",  border: "border-orange-200", dot: "bg-orange-500" },
   { bg: "bg-rose-50",   text: "text-rose-700",    border: "border-rose-200",   dot: "bg-rose-500"   },
   { bg: "bg-teal-50",   text: "text-teal-700",    border: "border-teal-200",   dot: "bg-teal-500"   },
   { bg: "bg-green-50",  text: "text-green-800",   border: "border-green-200",  dot: "bg-green-500"  },
   { bg: "bg-fuchsia-50",text: "text-fuchsia-700", border: "border-fuchsia-200",dot: "bg-fuchsia-500"},
];

const getColor = (fieldKey, fields) => {
   const idx = fields.findIndex((f) => f.key === fieldKey);
   return TAG_PALETTE[(idx >= 0 ? idx : 0) % TAG_PALETTE.length];
};

/* ── Tag chip ── */
function SearchTag({ tag, onRemove, searchableFields }) {
   const c   = getColor(tag.field, searchableFields);
   const lbl = searchableFields.find((f) => f.key === tag.field)?.label || tag.field;
   return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
         <span className={`w-1.5 h-1.5 shrink-0 ${c.dot}`} />
         <span className="font-semibold">{lbl}:</span>
         <span>{tag.value}</span>
         <button
            type="button"
            onClick={() => onRemove(tag.id)}
            className={`ml-0.5 flex items-center opacity-60 hover:opacity-100 transition-opacity ${c.text}`}
         >
            <HiX className="w-3 h-3" />
         </button>
      </span>
   );
}

/* ── Main Filter ── */
const Filter = ({
   searchableFields = [],
   allColumns       = [],
   visibleColumns   = [],
   toggleColumn,
   isDrawerOpen,
   setIsDrawerOpen,
   searchTags       = [],
   onAddTag,
   onRemoveTag,
   onClearAllTags,
   startDate        = "",
   endDate          = "",
   onStartDateChange,
   onEndDateChange,
   onClearDates,
   totalCount,
}) => {
   const [inputValue,   setInputValue]   = useState("");
   const [selectedField,setSelectedField]= useState("");
   const [fieldOpen,    setFieldOpen]    = useState(false);
   const fieldDropdownRef = useRef(null);

   useEffect(() => {
      if (!selectedField && searchableFields.length)
         setSelectedField(searchableFields[0].key);
   }, [searchableFields, selectedField]);

   useEffect(() => {
      const handler = (e) => {
         if (fieldDropdownRef.current && !fieldDropdownRef.current.contains(e.target))
            setFieldOpen(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
   }, []);

   const selectedLabel = searchableFields.find((f) => f.key === selectedField)?.label || "Field";
   const hasActiveDates = !!(startDate || endDate);
   const activeCount    = searchTags.length + (hasActiveDates ? 1 : 0);

   const handleAdd = () => {
      const val = inputValue.trim();
      if (!val || !selectedField) return;
      onAddTag({ id: Date.now(), field: selectedField, value: val });
      setInputValue("");
   };

   /* shared input classes */
   const inputCls = "w-full text-sm text-slate-900 border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 hover:border-slate-300 transition-all";

   return (
      <>
         {/* ══════════ DESKTOP ══════════ */}
         <div className="hidden sm:flex flex-col gap-2.5 w-full">

            {/* Row */}
            <div className="flex items-center gap-2 w-full">

               {/* Compound search input */}
               <div className="flex items-stretch flex-1 min-w-0 border border-slate-200 bg-white shadow-sm relative z-40 overflow-visible">

                  {/* Field picker */}
                  <div ref={fieldDropdownRef} className="relative shrink-0 z-50">
                     <button
                        type="button"
                        onClick={() => setFieldOpen((v) => !v)}
                        className="flex items-center gap-1.5 px-3 h-full bg-slate-50 border-r border-slate-200 text-xs font-semibold text-slate-500 hover:bg-green-50 transition-colors cursor-pointer whitespace-nowrap focus:outline-none"
                     >
                        <HiFilter className="w-3 h-3 text-slate-400" />
                        <span className="max-w-[90px] overflow-hidden text-ellipsis">{selectedLabel}</span>
                        <HiChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${fieldOpen ? "rotate-180" : ""}`} />
                     </button>

                     {fieldOpen && (
                        <div className="absolute top-[calc(100%+6px)] left-0 min-w-[180px] bg-white border border-slate-200 shadow-lg z-[9999] overflow-hidden animate-[fadeIn_0.14s_ease]">
                           {searchableFields.map((f, i) => (
                              <button
                                 key={f.key}
                                 type="button"
                                 onClick={() => { setSelectedField(f.key); setFieldOpen(false); }}
                                 className={[
                                    "w-full flex items-center gap-2 px-3.5 py-2.5 text-left text-sm transition-colors",
                                    i < searchableFields.length - 1 ? "border-b border-slate-100" : "",
                                    selectedField === f.key
                                       ? "bg-green-50 text-green-700 font-semibold"
                                       : "text-slate-800 font-normal hover:bg-green-50",
                                 ].join(" ")}
                              >
                                 {selectedField === f.key && (
                                    <span className="w-1.5 h-1.5 bg-green-600 shrink-0" />
                                 )}
                                 {f.label}
                              </button>
                           ))}
                        </div>
                     )}
                  </div>

                  {/* Text input */}
                  <input
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                     placeholder={`Search by ${selectedLabel}…`}
                     className="flex-1 min-w-0 px-3 py-2.5 text-sm text-slate-900 bg-transparent border-none outline-none placeholder:text-slate-300"
                  />

                  {/* Add button */}
                  <button
                     type="button"
                     onClick={handleAdd}
                     className="flex items-center gap-1.5 px-3.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shrink-0 transition-colors cursor-pointer border-none whitespace-nowrap"
                  >
                     <HiSearch className="w-3 h-3" />
                     Add Filter
                  </button>
               </div>

               {/* Clear all */}
               {searchTags.length > 0 && (
                  <button
                     type="button"
                     onClick={onClearAllTags}
                     className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 shrink-0 transition-colors cursor-pointer whitespace-nowrap"
                  >
                     <HiX className="w-3 h-3" />
                     Clear
                  </button>
               )}

               {/* Result count */}
               {totalCount !== undefined && searchTags.length > 0 && (
                  <span className="shrink-0 text-xs font-bold text-green-800 bg-green-100 border border-green-300 px-3 py-1.5 whitespace-nowrap tracking-tight">
                     {totalCount} result{totalCount !== 1 ? "s" : ""}
                  </span>
               )}
            </div>

            {/* Active tags row */}
            {searchTags.length > 0 && (
               <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Active</span>
                  {searchTags.map((tag) => (
                     <SearchTag key={tag.id} tag={tag} onRemove={onRemoveTag} searchableFields={searchableFields} />
                  ))}
               </div>
            )}
         </div>

         {/* ══════════ MOBILE ══════════ */}
         <div className="flex sm:hidden items-center gap-2 w-full">
            <button
               type="button"
               onClick={() => setIsDrawerOpen(true)}
               className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer border-none"
            >
               <HiFilter className="w-4 h-4" />
               Filters
               {activeCount > 0 && (
                  <span className="min-w-5 h-5 flex items-center justify-center px-1.5 bg-green-600 text-white text-[11px] font-bold tabular-nums">
                     {activeCount}
                  </span>
               )}
            </button>

            {totalCount !== undefined && (
               <span className="text-xs font-semibold text-slate-500 border border-slate-200 px-3 py-2 bg-slate-50 whitespace-nowrap">
                  {totalCount} results
               </span>
            )}
         </div>

         {/* ══════════ MOBILE DRAWER ══════════ */}
         {isDrawerOpen && (
            <>
               {/* Backdrop */}
               <div
                  onClick={() => setIsDrawerOpen(false)}
                  className="fixed inset-0 bg-slate-900/55 backdrop-blur-sm z-40"
               />

               {/* Drawer panel */}
               <div className="fixed left-0 top-0 h-full w-80 bg-white z-50 flex flex-col shadow-2xl">

                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
                     <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-green-100 flex items-center justify-center shrink-0">
                           <HiFilter className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-900">Filters</span>
                        {activeCount > 0 && (
                           <span className="px-2 py-0.5 bg-green-600 text-white text-[11px] font-bold">
                              {activeCount}
                           </span>
                        )}
                     </div>
                     <button
                        type="button"
                        onClick={() => setIsDrawerOpen(false)}
                        className="flex items-center justify-center p-1 text-slate-400 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"
                     >
                        <HiX className="w-5 h-5" />
                     </button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-6">

                     {/* Search section */}
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Search</p>
                        <select
                           value={selectedField}
                           onChange={(e) => setSelectedField(e.target.value)}
                           className={`${inputCls} mb-2 appearance-none`}
                        >
                           {searchableFields.map((f) => (
                              <option key={f.key} value={f.key}>{f.label}</option>
                           ))}
                        </select>
                        <div className="flex gap-2">
                           <input
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                              placeholder={`Enter ${selectedLabel}…`}
                              className={`${inputCls} flex-1`}
                           />
                           <button
                              type="button"
                              onClick={handleAdd}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold shrink-0 transition-colors cursor-pointer border-none"
                           >
                              Add
                           </button>
                        </div>
                        {searchTags.length > 0 && (
                           <div className="mt-3 flex flex-wrap gap-1.5">
                              {searchTags.map((tag) => (
                                 <SearchTag key={tag.id} tag={tag} onRemove={onRemoveTag} searchableFields={searchableFields} />
                              ))}
                           </div>
                        )}
                     </div>

                     {/* Date range section */}
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                           <HiCalendar className="w-3 h-3" />
                           Date Range
                        </p>
                        <div className="flex flex-col gap-2">
                           {[
                              { label: "From", val: startDate,  cb: onStartDateChange },
                              { label: "To",   val: endDate,    cb: onEndDateChange   },
                           ].map(({ label, val, cb }) => (
                              <div key={label}>
                                 <span className="block text-[11px] font-semibold text-slate-400 mb-1">{label}</span>
                                 <input
                                    type="date"
                                    value={val}
                                    onChange={(e) => cb && cb(e.target.value)}
                                    className={inputCls}
                                 />
                              </div>
                           ))}
                           {hasActiveDates && (
                              <button
                                 type="button"
                                 onClick={onClearDates}
                                 className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-transparent border-none cursor-pointer py-0.5 transition-colors"
                              >
                                 <HiX className="w-3 h-3" />
                                 Clear dates
                              </button>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Footer */}
                  <div className="flex gap-2 px-5 py-3.5 border-t border-slate-200 bg-slate-50 shrink-0">
                     {activeCount > 0 && (
                        <button
                           type="button"
                           onClick={() => { onClearAllTags(); if (onClearDates) onClearDates(); }}
                           className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-500 bg-white border border-slate-200 hover:bg-green-50 transition-colors cursor-pointer"
                        >
                           Clear All
                        </button>
                     )}
                     <button
                        type="button"
                        onClick={() => setIsDrawerOpen(false)}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 border-none transition-colors cursor-pointer"
                     >
                        Apply & Close
                     </button>
                  </div>
               </div>
            </>
         )}
      </>
   );
};

export default Filter;