import { useState, useEffect, useCallback } from "react";
import { FaFileExcel } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../api/axios";

function Excel({
	ids = [],
	model = "",
	fileName = "export",
	label = "Excel",
	disabled = false,
	className = "",
	variant,
	financialYear = "",
	dealerName = "",
	data = null,        // ← added (same as Pdf)
}) {
	const [loading, setLoading] = useState(false);
	const [screenSize, setScreenSize] = useState("lg");

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			if (width < 480) setScreenSize("xs");
			else if (width < 640) setScreenSize("sm");
			else if (width < 1024) setScreenSize("md");
			else setScreenSize("lg");
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const activeVariant =
		variant || (screenSize === "xs" || screenSize === "sm" ? "compact" : "full");

	const handleClick = useCallback(async () => {
		const toastId = toast.loading("Generating Excel…");
		setLoading(true);
		try {
			let payload;

			if (data !== null && data !== undefined) {
				// ── Direct data mode: frontend sends calculated data as-is ──
				payload = { model, data };
				if (financialYear) payload.financialYear = financialYear;
				if (dealerName)    payload.dealerName    = dealerName;
			} else if (financialYear) {
				// ── Aggregation-based model (legacy) ──
				payload = { model, financialYear };
				if (dealerName) payload.dealerName = dealerName;
			} else {
				// ── Standard model — backend fetches by ids or all ──
				payload = { model };
				if (Array.isArray(ids) && ids.length > 0) payload.ids = ids;
			}

			const response = await api.post("/download/excel", payload, { responseType: "blob" });

			const blob = new Blob([response.data], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			const link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.download = `${fileName}-${new Date().toISOString().split("T")[0]}.xlsx`;
			document.body.appendChild(link);
			link.click();
			window.URL.revokeObjectURL(link.href);
			document.body.removeChild(link);

			toast.update(toastId, {
				render: "Excel downloaded",
				type: "success",
				isLoading: false,
				autoClose: 3000,
			});
		} catch (error) {
			let message = error.message;
			if (error.response?.data instanceof Blob) {
				try {
					const text = await error.response.data.text();
					const json = JSON.parse(text);
					message = json.message || message;
				} catch {
					// keep original message
				}
			} else {
				message = error.response?.data?.message || message;
			}
			toast.update(toastId, {
				render: `❌ Failed: ${message}`,
				type: "error",
				isLoading: false,
				autoClose: 4000,
			});
		} finally {
			setLoading(false);
		}
	}, [ids, model, fileName, financialYear, dealerName, data]);  // ← data added to deps

	const isDisabled = disabled || loading;

	function Spinner() {
		return (
			<svg
				style={{ animation: "excelSpin 0.75s linear infinite", flexShrink: 0 }}
				width="14" height="14" viewBox="0 0 14 14" fill="none"
			>
				<circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
				<path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			</svg>
		);
	}

	if (activeVariant === "compact") {
		return (
			<>
				<style>{`@keyframes excelSpin{to{transform:rotate(360deg)}}`}</style>
				<button
					type="button"
					onClick={handleClick}
					disabled={isDisabled}
					title={`Download ${label}`}
					className={`
						inline-flex items-center justify-center
						w-8 h-8
						border border-green-200 bg-white text-green-700
						hover:bg-green-50 hover:border-green-300
						active:bg-green-100
						transition-all duration-150
						disabled:opacity-40 disabled:cursor-not-allowed
						flex-shrink-0 shadow-sm
						${className}
					`}
				>
					{loading ? <Spinner /> : <FaFileExcel className="w-3.5 h-3.5" />}
				</button>
			</>
		);
	}

	return (
		<>
			<style>{`@keyframes excelSpin{to{transform:rotate(360deg)}}`}</style>
			<button
				type="button"
				onClick={handleClick}
				disabled={isDisabled}
				title={`Download ${label}`}
				className={`
					inline-flex items-center gap-1.5
					px-3 py-2
					border border-green-200 bg-white text-green-700
					hover:bg-green-50 hover:border-green-300
					active:bg-green-100
					text-xs font-semibold
					transition-all duration-150
					disabled:opacity-40 disabled:cursor-not-allowed
					whitespace-nowrap shadow-sm
					${className}
				`}
			>
				{loading ? <Spinner /> : <FaFileExcel className="w-3.5 h-3.5" />}
				<span>{loading ? "Generating…" : label}</span>
			</button>
		</>
	);
}

export default Excel;