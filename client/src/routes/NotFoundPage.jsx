/**
 * @fileoverview NotFoundPage — 404 catch-all page.
 *
 * Rendered by the router's wildcard route ("*") whenever the user
 * navigates to a URL that does not match any defined route.
 *
 * Responsibilities
 * ────────────────
 *  1. Clearly communicate that the page does not exist.
 *  2. Provide one-click recovery paths (go back, go to dashboard).
 *  3. Show the attempted URL so the user understands what went wrong.
 *
 * @module pages/NotFoundPage
 */
import { useNavigate, useLocation } from "react-router-dom";
import { HiArrowLeft, HiHome } from "react-icons/hi";
import { FULL_PATHS } from "../constants/routes";

function NotFoundPage() {
	const navigate = useNavigate();
	const location = useLocation();

	function handleGoBack() {
		navigate(-1);
	}

	function handleGoDashboard() {
		navigate(FULL_PATHS.DASHBOARD, { replace: true });
	}

	return (
		<div
			className="min-h-screen bg-stone-50 flex items-center justify-center px-4"
			role="main"
			aria-labelledby="not-found-heading"
		>
			<div className="max-w-md w-full text-center space-y-8">
				<div className="flex justify-center">
					<div className="relative w-16 h-16">
						<div className="absolute inset-0 bg-yellow-500/20 rotate-45 rounded-sm" />
						<div className="absolute inset-2 bg-yellow-500/40 rotate-45 rounded-sm" />
						<div className="absolute inset-4 bg-yellow-500 rotate-45 rounded-sm" />
					</div>
				</div>
				<div className="space-y-3">
					<p className="text-[80px] font-black text-stone-900 leading-none tracking-tighter">
						404
					</p>
					<h1
						id="not-found-heading"
						className="text-xl font-bold text-stone-700"
					>
						Page not found
					</h1>
					<p className="text-sm text-stone-400 leading-relaxed">
						The page you're looking for doesn't exist or may have been moved.
					</p>
				</div>
				<div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-200
                        rounded-lg px-4 py-2 max-w-full overflow-hidden">
					<span className="text-xs text-stone-400 flex-shrink-0">URL</span>
					<code className="text-xs font-mono text-stone-600 truncate">
						{location.pathname}
					</code>
				</div>
				<div className="flex items-center justify-center gap-3">
					<button
						onClick={handleGoBack}
						className="flex items-center gap-2 px-5 py-2.5 border border-stone-200
                       bg-white text-stone-700 text-sm font-medium rounded-lg
                       hover:bg-stone-50 transition shadow-sm"
					>
						<HiArrowLeft className="w-4 h-4" />
						Go back
					</button>
					<button
						onClick={handleGoDashboard}
						className="flex items-center gap-2 px-5 py-2.5 bg-stone-900
                       text-white text-sm font-medium rounded-lg
                       hover:bg-stone-800 transition shadow-sm"
					>
						<HiHome className="w-4 h-4" />
						Dashboard
					</button>
				</div>
				<p className="text-[10px] uppercase tracking-widest text-stone-300 font-medium">
					Agarwal MIS Software
				</p>

			</div>
		</div>
	);
}

export default NotFoundPage;