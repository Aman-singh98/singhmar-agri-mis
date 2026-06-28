/**
 * @fileoverview Application root component.
 *
 * Responsibilities
 * ────────────────
 *  1. Mount the global router via <RouterProvider>.
 *  2. Mount the global toast notification container.
 *
 * Nothing else belongs here — keep this file as the thin entry shell.
 *
 * @module App
 */
import { RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import { router } from "./routes/router";

/** Tailwind class string applied to every toast card. */
const TOAST_CLASS =
	"flex items-center gap-3 bg-white text-gray-800 px-4 py-3 rounded shadow-md border border-gray-200 mb-2";

/**
 * Renders the dismiss button rendered inside each toast.
 *
 * @param   {{ closeToast: Function }} props
 * @returns {JSX.Element}
 */
function ToastCloseButton({ closeToast }) {
	return (
		<button
			onClick={closeToast}
			className="ml-2 text-gray-400 hover:text-gray-600 transition text-lg leading-none flex-shrink-0"
			aria-label="Close notification"
		>
			✕
		</button>
	);
}

/**
 * Returns the Tailwind class string for a toast card.
 * react-toastify expects toastClassName to be a function.
 *
 * @returns {string}
 */
function toastClassName() {
	return TOAST_CLASS;
}

/**
 * App — top-level React tree.
 *
 * Renders two global singletons:
 *  • ToastContainer  — portal-based notification layer
 *  • RouterProvider  — drives all client-side routing
 *
 * @returns {JSX.Element}
 */
function App() {
	return (
		<>
			<ToastContainer
				position="top-center"
				autoClose={3000}
				hideProgressBar
				closeOnClick
				pauseOnHover
				draggable
				style={{ zIndex: 9999999 }}
				toastClassName={toastClassName}
				bodyClassName="text-sm font-medium flex-1"
				closeButton={ToastCloseButton}
			/>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
