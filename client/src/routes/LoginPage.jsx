



// /**
//  * @module LoginPage
//  * @description Authentication entry point for the MIS portal.
//  *
//  * Architecture (SRP within a single file):
//  *  1. Constants      — static data arrays extracted from JSX
//  *  2. useLoginForm   — all form state + submit logic (custom hook)
//  *  3. Sub-components — BrandPanel, FormPanel (pure UI, zero logic)
//  *  4. LoginPage      — composition root, renders layout only
//  */
// import { useState, useCallback } from "react";
// import { useNavigate } from "react-router";
// import { toast } from "react-toastify";
// import { ROUTES } from "../constants/routes";
// import { useAuth } from "../context/AuthContext";

// // Constants
// const FLOATING_DOTS = [
// 	{ x: 10, y: 20 }, { x: 80, y: 60 }, { x: 25, y: 80 },
// 	{ x: 70, y: 30 }, { x: 50, y: 70 }, { x: 15, y: 50 }, { x: 88, y: 85 },
// ];
// const FLOAT_CLASSES = ["float-1", "float-2", "float-3"];
// const STAT_CARDS = [
// 	["Mini", "Dispatch"],
// 	["Drip", "Dispatch"],
// 	["Auto", "Reports"]
// ];
// const REDIRECT_DELAY_MS = 600;

// /**
//  * Custom Hook — useLoginForm
//  * Single responsibility: own all form state and submit logic.
//  * The UI components below are completely stateless.
//  * 
//  * @returns
//  */
// const useLoginForm = () => {
// 	const navigate = useNavigate();
// 	const { login } = useAuth();

// 	// States
// 	const [email, setEmail] = useState("s@gmail.com");
// 	const [password, setPassword] = useState("1234567890");
// 	const [showPassword, setShowPassword] = useState(false);
// 	const [loading, setLoading] = useState(false);
// 	const [focused, setFocused] = useState("");

// 	const handleSubmit = useCallback(async () => {
// 		if (!email.trim() || !password) {
// 			toast.error("Please fill in all fields.");
// 			return;
// 		}

// 		setLoading(true);
// 		try {
// 			const data = await login(email.trim().toLowerCase(), password);
// 			const userRole = data?.role;

// 			toast.success("Welcome back!");

// 			setTimeout(() => {
// 				const destination =
// 					userRole === "superadmin" ? ROUTES.SUPER_ADMIN_HOME : ROUTES.LOGIN;
// 				navigate(destination, { replace: true });
// 			}, REDIRECT_DELAY_MS);

// 		} catch (err) {
// 			const msg =
// 				err.response?.data?.message ||
// 				err.response?.data?.error ||
// 				"Invalid credentials.";
// 			toast.error(msg);
// 		} finally {
// 			setLoading(false);
// 		}
// 	}, [email, password, login, navigate]);

// 	const handleKeyDown = useCallback(
// 		(e) => { if (e.key === "Enter") handleSubmit(); },
// 		[handleSubmit]
// 	);

// 	return {
// 		email, setEmail,
// 		password, setPassword,
// 		showPassword, setShowPassword,
// 		loading,
// 		focused, setFocused,
// 		handleSubmit,
// 		handleKeyDown,
// 	};
// };

// const Spinner = () => (
// 	<span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
// 		<span style={{
// 			width: 12, height: 12,
// 			border: "2px solid rgba(255,255,255,0.3)",
// 			borderTopColor: "white",
// 			borderRadius: "50%",
// 			display: "inline-block",
// 			animation: "spin 0.7s linear infinite",
// 		}} />
// 		Signing in…
// 	</span>
// );

// const InputField = ({
// 	label, type, placeholder, value,
// 	onChange, onFocus, onBlur,
// 	disabled, isFocused, extraStyle = {},
// 	children,
// }) => (
// 	<div>
// 		<label style={{
// 			display: "block", fontSize: 10, letterSpacing: "0.25em",
// 			textTransform: "uppercase", color: "#3a6b4a", marginBottom: 8, fontWeight: 500,
// 		}}>
// 			{label}
// 		</label>
// 		<div style={{ position: "relative" }}>
// 			<input
// 				className={`input-field ${isFocused ? "focused" : ""}`}
// 				type={type}
// 				placeholder={placeholder}
// 				value={value}
// 				onChange={onChange}
// 				onFocus={onFocus}
// 				onBlur={onBlur}
// 				disabled={disabled}
// 				style={extraStyle}
// 			/>
// 			{isFocused && (
// 				<div style={{
// 					position: "absolute", bottom: 0, left: 0,
// 					height: 2, width: "100%",
// 					background: "linear-gradient(90deg, #166534, #22c55e)",
// 					borderRadius: 1,
// 				}} />
// 			)}
// 			{children}
// 		</div>
// 	</div>
// );

// const BrandPanel = () => (
// 	 <div
//     className="hidden lg:flex flex-col justify-between flex-1 relative overflow-hidden tprop-root"
//     style={{
//       backgroundImage: 'url("/HOME.jpg")',
//       backgroundSize: "cover",
//       backgroundPosition: "center",
//       backgroundRepeat: "no-repeat",
//     }}
//   >
//  {/* Dark green overlay — original gradient on top of image */}
// <div
//   className="absolute inset-0 z-0"
//   style={{
//     background: "linear-gradient(135deg, rgba(2,20,8,0.80) 0%, rgba(5,46,22,0.80) 40%, rgba(2,26,12,0.80) 100%)",
//   }}
// />
// 		{/* Animated rings */}
// 		<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
// 			{[420, 300, 180].map((size) => (
// 				<div
// 					key={size}
// 					className={size === 420 ? "rotate-slow" : undefined}
// 					style={{
// 						width: size, height: size,
// 						border: `1px solid rgba(34,197,94,${size === 420 ? 0.06 : size === 300 ? 0.1 : 0.15})`,
// 						borderRadius: "50%",
// 						position: "absolute",
// 						top: "50%", left: "50%",
// 						transform: "translate(-50%,-50%)",
// 					}}
// 				/>
// 			))}
// 		</div>

// 		{/* Floating dots */}
// 		<div className="absolute inset-0 z-0 overflow-hidden">
// 			{FLOATING_DOTS.map(({ x, y }, i) => (
// 				<div
// 					key={i}
// 					className={`absolute rounded-full ${FLOAT_CLASSES[i % 3]}`}
// 					style={{
// 						left: `${x}%`, top: `${y}%`,
// 						width: i % 2 === 0 ? 3 : 5,
// 						height: i % 2 === 0 ? 3 : 5,
// 						background: `rgba(34,197,94,${0.1 + i * 0.04})`,
// 					}}
// 				/>
// 			))}
// 		</div>
// 		<div className="temple-arch" />
// 		<div className="relative z-10 p-10 flex flex-col h-full">
// 			<div className="flex items-center gap-4">
// 				<div className="relative ring-pulse">
// 					<div style={{
// 						width: 44, height: 44,
// 						background: "linear-gradient(135deg, #14532d, #16a34a)",
// 						clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
// 						display: "flex", alignItems: "center", justifyContent: "center",
// 					}}>
// 						<div style={{
// 							width: 14, height: 14,
// 							background: "rgba(255,255,255,0.9)",
// 							clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
// 						}} />
// 					</div>
// 				</div>
// 				<div>
// 					<p style={{ color: "#86efac", fontSize: 16, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'DM Sans'" }}>AGARWAL</p>
// 					<p style={{ color: "#86efac", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase" }}>
// 						MIS Software — Management Information System
// 					</p>
// 				</div>
// 			</div>
// 			<div className="flex-1 flex flex-col justify-center">
// 				{["Agricultural", "Record", "Management"].map((word, i) => (
// 					<h1
// 						key={word}
// 						className={`tprop-serif ${i === 1 ? "shimmer-text" : ""}`}
// 						style={{
// 							fontSize: "clamp(40px, 4.5vw, 64px)",
// 							fontWeight: i === 1 ? 400 : 700,
// 							fontStyle: i === 1 ? "italic" : "normal",
// 							color: i !== 1 ? "#dcfce7" : undefined,
// 							lineHeight: 1.1,
// 							marginBottom: i === 2 ? 32 : 8,
// 						}}
// 					>
// 						{word}
// 					</h1>
// 				))}
// 				<div style={{ width: 48, height: 2, background: "linear-gradient(90deg, #16a34a, transparent)", marginBottom: 20 }} />
// 				<p style={{ color: "rgba(220,252,231,0.95)", fontSize: 13, lineHeight: 1.8, maxWidth: 340, fontWeight: 300, letterSpacing: "0.01em" }}>
// Manage Mini Dispatch, Drip Dispatch, Billed Quantity, and Subsidy data from one powerful platform — automatically linked, calculated, and reported.				</p>
// 			</div>
// 			<div className="flex gap-3">
// 			{STAT_CARDS.map(([n, l], i) => (
//    <div key={i} className="stat-card">
//       <p className="tprop-serif shimmer-text" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>{n}</p>
//       <p style={{ color: "rgba(250,252,251,0.9)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>{l}</p>
//    </div>
// ))}
// 			</div>
// 		</div>
// 	</div>
// );

// const FormPanel = ({
// 	email, setEmail,
// 	password, setPassword,
// 	showPassword, setShowPassword,
// 	loading, focused, setFocused,
// 	handleSubmit,
// }) => (
// 	<div
// 		className="flex-1 lg:flex-none lg:w-[460px] flex items-center justify-center relative tprop-root"
// 		style={{ background: "#f4fbf6" }}
// 	>
// 		<div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #14532d, #16a34a, #22c55e, #16a34a, #14532d)" }} />
// 		<div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle, rgba(22,101,52,0.06) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
// 		<div style={{ position: "absolute", bottom: 0, right: 0, width: 120, height: 120, background: "linear-gradient(135deg, transparent 50%, rgba(22,101,52,0.06) 50%)" }} />
// 		<div style={{ position: "absolute", top: 0, left: 0, width: 80, height: 80, background: "linear-gradient(315deg, transparent 50%, rgba(22,101,52,0.04) 50%)" }} />
// 		<div className="relative z-10 w-full max-w-sm px-8 py-12">
// 			<div className="flex lg:hidden items-center gap-3 mb-10 fade-up-1">
// 				<div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #14532d, #16a34a)", clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
// 					<div style={{ width: 12, height: 12, background: "white", clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
// 				</div>
// 				<div>
// 					<p style={{ color: "#052e16", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em" }}>AGARWAL</p>
// 					<p style={{ color: "#166534", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase" }}>MIS Software</p>
// 				</div>
// 			</div>
// 			<div className="fade-up-1 mb-8">
// 				<p style={{ color: "#166534", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 10, fontWeight: 500 }}>MIS Portal</p>
// 				<h2 className="tprop-serif" style={{ fontSize: 36, fontWeight: 700, color: "#052e16", lineHeight: 1.15, marginBottom: 6 }}>
// 					Sign in to your<br />
// 					<span style={{ fontStyle: "italic", fontWeight: 400, color: "#166534" }}>account</span>
// 				</h2>
// 				<div style={{ width: 32, height: 2, background: "linear-gradient(90deg, #16a34a, #22c55e)", marginTop: 12 }} />
// 			</div>
// 			<div className="fade-up-2 mb-6">
// 				<InputField
// 					label="Email Address"
// 					type="email"
// 					placeholder="Enter your email address"
// 					value={email}
// 					onChange={(e) => setEmail(e.target.value)}
// 					onFocus={() => setFocused("email")}
// 					onBlur={() => setFocused("")}
// 					disabled={loading}
// 					isFocused={focused === "email"}
// 				/>
// 			</div>
// 			<div className="fade-up-3 mb-2">
// 				<InputField
// 					label="Password"
// 					type={showPassword ? "text" : "password"}
// 					placeholder="Enter your password"
// 					value={password}
// 					onChange={(e) => setPassword(e.target.value)}
// 					onFocus={() => setFocused("password")}
// 					onBlur={() => setFocused("")}
// 					disabled={loading}
// 					isFocused={focused === "password"}
// 					extraStyle={{ paddingRight: 48 }}
// 				>
// 					<button
// 						type="button"
// 						onClick={() => setShowPassword((v) => !v)}
// 						style={{
// 							position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
// 							background: "none", border: "none", cursor: "pointer",
// 							color: "#3a6b4a", fontSize: 10, letterSpacing: "0.15em",
// 							textTransform: "uppercase", fontFamily: "'DM Sans'", fontWeight: 500, padding: "4px 0",
// 						}}
// 					>
// 						{showPassword ? "Hide" : "Show"}
// 					</button>
// 				</InputField>
// 			</div>
// 			<div className="fade-up-4">
// 				<button className="login-btn" onClick={handleSubmit} disabled={loading}>
// 					{loading ? <Spinner /> : "Access Portal →"}
// 				</button>
// 			</div>
// 		</div>
// 	</div>
// );

// const GLOBAL_STYLES = `
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

//   .tprop-root  { font-family: 'DM Sans', sans-serif; }
//   .tprop-serif { font-family: 'Playfair Display', Georgia, serif; }

//   @keyframes fadeUp    { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
//   @keyframes shimmer   { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
//   @keyframes floatDot  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
//   @keyframes rotateSlow{ from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
//   @keyframes pulse-ring{ 0% { transform:scale(0.9); opacity:0.6; } 100% { transform:scale(1.4); opacity:0; } }
//   @keyframes spin      { to { transform:rotate(360deg); } }

//   .fade-up-1 { animation: fadeUp 0.6s ease both; }
//   .fade-up-2 { animation: fadeUp 0.6s 0.1s ease both; }
//   .fade-up-3 { animation: fadeUp 0.6s 0.2s ease both; }
//   .fade-up-4 { animation: fadeUp 0.6s 0.3s ease both; }

//   .shimmer-text {
//     background: linear-gradient(90deg, #22c55e, #86efac, #22c55e, #16a34a);
//     background-size: 200% auto;
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//     animation: shimmer 3s linear infinite;
//   }

//   .float-1 { animation: floatDot 3s ease-in-out infinite; }
//   .float-2 { animation: floatDot 3s 1s ease-in-out infinite; }
//   .float-3 { animation: floatDot 3s 2s ease-in-out infinite; }

//   .rotate-slow { animation: rotateSlow 20s linear infinite; }

//   .input-field {
//     background: transparent; border: none;
//     border-bottom: 1.5px solid #c4dece;
//     outline: none; width: 100%; padding: 10px 0;
//     font-size: 14px; color: #052e16;
//     transition: border-color 0.3s;
//     font-family: 'DM Sans', sans-serif; font-weight: 300;
//   }
//   .input-field::placeholder { color: #94b8a4; }
//   .input-field.focused { border-bottom-color: #166534; }

//   .login-btn {
//     position: relative; overflow: hidden; width: 100%; padding: 15px;
//     background: linear-gradient(135deg, #14532d, #166534, #16a34a);
//     color: white; border: none; cursor: pointer;
//     font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500;
//     letter-spacing: 0.2em; text-transform: uppercase; transition: all 0.3s;
//     clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
//   }
//   .login-btn::before {
//     content: ''; position: absolute; top: 0; left: -100%;
//     width: 100%; height: 100%;
//     background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
//     transition: left 0.5s;
//   }
//   .login-btn:hover::before { left: 100%; }
//   .login-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(22,101,52,0.4); }
//   .login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

//   .stat-card {
//     background: rgba(255,255,255,0.05);
//     border: 1px solid rgba(255,255,255,0.08);
//     backdrop-filter: blur(4px);
//     padding: 16px 20px; border-radius: 2px; flex: 1;
//   }

//   .temple-arch {
//     position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%);
//     width: 200px; height: 100px;
//     border: 1px solid rgba(34,197,94,0.1);
//     border-bottom: none; border-radius: 100px 100px 0 0;
//   }

//   .ring-pulse::after {
//     content: ''; position: absolute; inset: -4px; border-radius: 50%;
//     border: 2px solid rgba(34,197,94,0.4);
//     animation: pulse-ring 2s ease-out infinite;
//   }
// `;

// const LoginPage = () => {
// 	const formProps = useLoginForm();

// 	return (
// 		<div
// 			className="min-h-screen w-full flex items-stretch relative overflow-hidden"
// 			style={{ fontFamily: "'Segoe UI', sans-serif", background: "#020f05" }}
// 			onKeyDown={formProps.handleKeyDown}
// 		>
// 			<style>{GLOBAL_STYLES}</style>
// 			<BrandPanel />
// 			<FormPanel {...formProps} />
// 		</div>
// 	);
// };

// export default LoginPage;






/**
 * @module LoginPage
 * @description Authentication entry point for the MIS portal.
 *
 * UI      — from the original commented design (BrandPanel animations, shimmer, floating dots)
 * Logic   — from the uncommented code (Redux dispatch, role button selection, validation, error handling)
 */

import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, resetLoginError } from "../store/authSlice";
import { ROUTES } from "../constants/routes";

// ─── Constants ────────────────────────────────────────────────────────────────

const FLOATING_DOTS = [
	{ x: 10, y: 20 }, { x: 80, y: 60 }, { x: 25, y: 80 },
	{ x: 70, y: 30 }, { x: 50, y: 70 }, { x: 15, y: 50 }, { x: 88, y: 85 },
];
const FLOAT_CLASSES = ["float-1", "float-2", "float-3"];
const STAT_CARDS = [
	["Mini", "Dispatch"],
	["Drip", "Dispatch"],
	["Auto", "Reports"],
];
const ROLES = [
	{ value: "superadmin", label: "Super Admin" },
	{ value: "admin",      label: "Admin"       },
	{ value: "employee",   label: "Employee"    },
];
const REDIRECT_DELAY_MS = 600;

// ─── Custom Hook ──────────────────────────────────────────────────────────────

const useLoginForm = () => {
	const dispatch   = useDispatch();
	const navigate   = useNavigate();
	const { loginLoading, loginError } = useSelector((s) => s.auth);

	const [formData, setFormData]       = useState({ role: "", email: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);
	const [focused, setFocused]           = useState("");
	const [errors, setErrors]             = useState({});

	const handleChange = useCallback((field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setErrors((prev)   => ({ ...prev, [field]: "" }));
		if (loginError) dispatch(resetLoginError());
	}, [loginError, dispatch]);

	const handleRoleSelect = useCallback((role) => {
		setFormData((prev) => ({ ...prev, role }));
		setErrors((prev)   => ({ ...prev, role: "" }));
		if (loginError) dispatch(resetLoginError());
	}, [loginError, dispatch]);

	const validate = useCallback(() => {
		const e = {};
		if (!formData.role) {
			e.role = "Please select a role to continue.";
		}
		if (!formData.email.trim()) {
			e.email = "Email is required.";
		} else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
			e.email = "Please enter a valid email address.";
		}
		if (!formData.password) {
			e.password = "Password is required.";
		} else if (formData.password.length < 6) {
			e.password = "Password must be at least 6 characters.";
		}
		setErrors(e);
		return Object.keys(e).length === 0;
	}, [formData]);

	const handleSubmit = useCallback(async () => {
		if (!validate()) return;

		const result = await dispatch(loginUser(formData));
		if (loginUser.fulfilled.match(result)) {
			// Hard redirect — bypasses any React Router / Redux render race condition.
			// localStorage is already written by authSlice.fulfilled before this line.
			window.location.href = ROUTES.SUPER_ADMIN;
		}
	}, [validate, dispatch, formData, navigate]);

	const handleKeyDown = useCallback(
		(e) => { if (e.key === "Enter") handleSubmit(); },
		[handleSubmit],
	);

	return {
		formData, handleChange,
		handleRoleSelect,
		showPassword, setShowPassword,
		loginLoading, loginError,
		focused, setFocused,
		errors,
		handleSubmit,
		handleKeyDown,
	};
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Spinner = () => (
	<span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
		<span style={{
			width: 12, height: 12,
			border: "2px solid rgba(255,255,255,0.3)",
			borderTopColor: "white",
			borderRadius: "50%",
			display: "inline-block",
			animation: "spin 0.7s linear infinite",
		}} />
		Signing in…
	</span>
);

const InputField = ({
	label, type, placeholder, value,
	onChange, onFocus, onBlur,
	disabled, isFocused, extraStyle = {},
	error, children,
}) => (
	<div>
		<label style={{
			display: "block", fontSize: 10, letterSpacing: "0.25em",
			textTransform: "uppercase", color: "#3a6b4a", marginBottom: 8, fontWeight: 500,
		}}>
			{label}
		</label>
		<div style={{ position: "relative" }}>
			<input
				className={`input-field ${isFocused ? "focused" : ""}`}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				onFocus={onFocus}
				onBlur={onBlur}
				disabled={disabled}
				style={extraStyle}
			/>
			{isFocused && (
				<div style={{
					position: "absolute", bottom: 0, left: 0,
					height: 2, width: "100%",
					background: "linear-gradient(90deg, #166534, #22c55e)",
					borderRadius: 1,
				}} />
			)}
			{children}
		</div>
		{error && (
			<span style={{ fontSize: 11, color: "#dc2626", marginTop: 4, display: "block" }}>
				{error}
			</span>
		)}
	</div>
);

const BrandPanel = () => (
	<div
		className="hidden lg:flex flex-col justify-between flex-1 relative overflow-hidden tprop-root"
		style={{
			backgroundImage: 'url("/HOME.jpg")',
			backgroundSize: "cover",
			backgroundPosition: "center",
			backgroundRepeat: "no-repeat",
		}}
	>
		{/* Dark green overlay */}
		<div
			className="absolute inset-0 z-0"
			style={{
				background: "linear-gradient(135deg, rgba(2,20,8,0.80) 0%, rgba(5,46,22,0.80) 40%, rgba(2,26,12,0.80) 100%)",
			}}
		/>

		{/* Animated rings */}
		<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
			{[420, 300, 180].map((size) => (
				<div
					key={size}
					className={size === 420 ? "rotate-slow" : undefined}
					style={{
						width: size, height: size,
						border: `1px solid rgba(34,197,94,${size === 420 ? 0.06 : size === 300 ? 0.1 : 0.15})`,
						borderRadius: "50%",
						position: "absolute",
						top: "50%", left: "50%",
						transform: "translate(-50%,-50%)",
					}}
				/>
			))}
		</div>

		{/* Floating dots */}
		<div className="absolute inset-0 z-0 overflow-hidden">
			{FLOATING_DOTS.map(({ x, y }, i) => (
				<div
					key={i}
					className={`absolute rounded-full ${FLOAT_CLASSES[i % 3]}`}
					style={{
						left: `${x}%`, top: `${y}%`,
						width: i % 2 === 0 ? 3 : 5,
						height: i % 2 === 0 ? 3 : 5,
						background: `rgba(34,197,94,${0.1 + i * 0.04})`,
					}}
				/>
			))}
		</div>

		<div className="temple-arch" />

		<div className="relative z-10 p-10 flex flex-col h-full">
			{/* Logo */}
			<div className="flex items-center gap-4">
				<div className="relative ring-pulse">
					<div style={{
						width: 44, height: 44,
						background: "linear-gradient(135deg, #14532d, #16a34a)",
						clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
						display: "flex", alignItems: "center", justifyContent: "center",
					}}>
						<div style={{
							width: 14, height: 14,
							background: "rgba(255,255,255,0.9)",
							clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
						}} />
					</div>
				</div>
				<div>
					<p style={{ color: "#86efac", fontSize: 16, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'DM Sans'" }}>AGARWAL</p>
					<p style={{ color: "#86efac", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase" }}>
						MIS Software — Management Information System
					</p>
				</div>
			</div>

			{/* Headline */}
			<div className="flex-1 flex flex-col justify-center">
				{["Agricultural", "Record", "Management"].map((word, i) => (
					<h1
						key={word}
						className={`tprop-serif ${i === 1 ? "shimmer-text" : ""}`}
						style={{
							fontSize: "clamp(40px, 4.5vw, 64px)",
							fontWeight: i === 1 ? 400 : 700,
							fontStyle: i === 1 ? "italic" : "normal",
							color: i !== 1 ? "#dcfce7" : undefined,
							lineHeight: 1.1,
							marginBottom: i === 2 ? 32 : 8,
						}}
					>
						{word}
					</h1>
				))}
				<div style={{ width: 48, height: 2, background: "linear-gradient(90deg, #16a34a, transparent)", marginBottom: 20 }} />
				<p style={{ color: "rgba(220,252,231,0.95)", fontSize: 13, lineHeight: 1.8, maxWidth: 340, fontWeight: 300, letterSpacing: "0.01em" }}>
					Manage Mini Dispatch, Drip Dispatch, Billed Quantity, and Subsidy data from one powerful platform — automatically linked, calculated, and reported.
				</p>
			</div>

			{/* Stat cards */}
			<div className="flex gap-3">
				{STAT_CARDS.map(([n, l], i) => (
					<div key={i} className="stat-card">
						<p className="tprop-serif shimmer-text" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>{n}</p>
						<p style={{ color: "rgba(250,252,251,0.9)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>{l}</p>
					</div>
				))}
			</div>
		</div>
	</div>
);

const FormPanel = ({
	formData, handleChange, handleRoleSelect,
	showPassword, setShowPassword,
	loginLoading, loginError,
	focused, setFocused,
	errors,
	handleSubmit,
}) => (
	<div
		className="flex-1 lg:flex-none lg:w-[460px] flex items-center justify-center relative tprop-root"
		style={{ background: "#f4fbf6" }}
	>
		<div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #14532d, #16a34a, #22c55e, #16a34a, #14532d)" }} />
		<div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle, rgba(22,101,52,0.06) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
		<div style={{ position: "absolute", bottom: 0, right: 0, width: 120, height: 120, background: "linear-gradient(135deg, transparent 50%, rgba(22,101,52,0.06) 50%)" }} />
		<div style={{ position: "absolute", top: 0, left: 0, width: 80, height: 80, background: "linear-gradient(315deg, transparent 50%, rgba(22,101,52,0.04) 50%)" }} />

		<div className="relative z-10 w-full max-w-sm px-8 py-12">

			{/* Mobile logo */}
			<div className="flex lg:hidden items-center gap-3 mb-10 fade-up-1">
				<div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #14532d, #16a34a)", clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
					<div style={{ width: 12, height: 12, background: "white", clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
				</div>
				<div>
					<p style={{ color: "#052e16", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em" }}>AGARWAL</p>
					<p style={{ color: "#166534", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase" }}>MIS Software</p>
				</div>
			</div>

			{/* Heading */}
			<div className="fade-up-1 mb-8">
				<p style={{ color: "#166534", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 10, fontWeight: 500 }}>MIS Portal</p>
				<h2 className="tprop-serif" style={{ fontSize: 36, fontWeight: 700, color: "#052e16", lineHeight: 1.15, marginBottom: 6 }}>
					Sign in to your<br />
					<span style={{ fontStyle: "italic", fontWeight: 400, color: "#166534" }}>account</span>
				</h2>
				<div style={{ width: 32, height: 2, background: "linear-gradient(90deg, #16a34a, #22c55e)", marginTop: 12 }} />
			</div>

			{/* Server error banner */}
			{loginError && (
				<div className="fade-up-1" style={{
					fontSize: 12, color: "#991b1b",
					background: "#fef2f2", border: "1px solid #fecaca",
					padding: "10px 14px", marginBottom: 20,
				}}>
					{loginError}
				</div>
			)}

			{/* Role Selection — buttons (from uncommented code) */}
			<div className="fade-up-2 mb-6">
				<label style={{
					display: "block", fontSize: 10, letterSpacing: "0.25em",
					textTransform: "uppercase", color: "#3a6b4a", marginBottom: 8, fontWeight: 500,
				}}>
					Login As
				</label>
				<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
					{ROLES.map((r) => (
						<button
							key={r.value}
							type="button"
							onClick={() => handleRoleSelect(r.value)}
							disabled={loginLoading}
							style={{
								padding: "9px 4px",
								fontSize: 11,
								fontWeight: 600,
								fontFamily: "'DM Sans', sans-serif",
								letterSpacing: "0.05em",
								border: formData.role === r.value ? "1.5px solid #16a34a" : "1.5px solid #c4dece",
								borderRadius: 2,
								cursor: loginLoading ? "not-allowed" : "pointer",
								background: formData.role === r.value
									? "linear-gradient(135deg, #14532d, #16a34a)"
									: "transparent",
								color: formData.role === r.value ? "#fff" : "#3a6b4a",
								transition: "all 0.2s",
							}}
						>
							{r.label}
						</button>
					))}
				</div>
				{errors.role && (
					<span style={{ fontSize: 11, color: "#dc2626", marginTop: 4, display: "block" }}>
						{errors.role}
					</span>
				)}
			</div>

			{/* Email */}
			<div className="fade-up-2 mb-6">
				<InputField
					label="Email Address"
					type="email"
					placeholder="Enter your email address"
					value={formData.email}
					onChange={(e) => handleChange("email", e.target.value)}
					onFocus={() => setFocused("email")}
					onBlur={() => setFocused("")}
					disabled={loginLoading}
					isFocused={focused === "email"}
					error={errors.email}
				/>
			</div>

			{/* Password */}
			<div className="fade-up-3 mb-8">
				<InputField
					label="Password"
					type={showPassword ? "text" : "password"}
					placeholder="Enter your password"
					value={formData.password}
					onChange={(e) => handleChange("password", e.target.value)}
					onFocus={() => setFocused("password")}
					onBlur={() => setFocused("")}
					disabled={loginLoading}
					isFocused={focused === "password"}
					extraStyle={{ paddingRight: 48 }}
					error={errors.password}
				>
					<button
						type="button"
						onClick={() => setShowPassword((v) => !v)}
						style={{
							position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
							background: "none", border: "none", cursor: "pointer",
							color: "#3a6b4a", fontSize: 10, letterSpacing: "0.15em",
							textTransform: "uppercase", fontFamily: "'DM Sans'", fontWeight: 500, padding: "4px 0",
						}}
					>
						{showPassword ? "Hide" : "Show"}
					</button>
				</InputField>
			</div>

			{/* Submit */}
			<div className="fade-up-4">
				<button className="login-btn" onClick={handleSubmit} disabled={loginLoading}>
					{loginLoading ? <Spinner /> : "Access Portal →"}
				</button>
			</div>
		</div>
	</div>
);

// ─── Global Styles ─────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .tprop-root  { font-family: 'DM Sans', sans-serif; }
  .tprop-serif { font-family: 'Playfair Display', Georgia, serif; }

  @keyframes fadeUp    { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes shimmer   { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
  @keyframes floatDot  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
  @keyframes rotateSlow{ from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  @keyframes pulse-ring{ 0% { transform:scale(0.9); opacity:0.6; } 100% { transform:scale(1.4); opacity:0; } }
  @keyframes spin      { to { transform:rotate(360deg); } }

  .fade-up-1 { animation: fadeUp 0.6s ease both; }
  .fade-up-2 { animation: fadeUp 0.6s 0.1s ease both; }
  .fade-up-3 { animation: fadeUp 0.6s 0.2s ease both; }
  .fade-up-4 { animation: fadeUp 0.6s 0.3s ease both; }

  .shimmer-text {
    background: linear-gradient(90deg, #22c55e, #86efac, #22c55e, #16a34a);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }

  .float-1 { animation: floatDot 3s ease-in-out infinite; }
  .float-2 { animation: floatDot 3s 1s ease-in-out infinite; }
  .float-3 { animation: floatDot 3s 2s ease-in-out infinite; }

  .rotate-slow { animation: rotateSlow 20s linear infinite; }

  .input-field {
    background: transparent; border: none;
    border-bottom: 1.5px solid #c4dece;
    outline: none; width: 100%; padding: 10px 0;
    font-size: 14px; color: #052e16;
    transition: border-color 0.3s;
    font-family: 'DM Sans', sans-serif; font-weight: 300;
  }
  .input-field::placeholder { color: #94b8a4; }
  .input-field.focused { border-bottom-color: #166534; }

  .login-btn {
    position: relative; overflow: hidden; width: 100%; padding: 15px;
    background: linear-gradient(135deg, #14532d, #166534, #16a34a);
    color: white; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase; transition: all 0.3s;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  }
  .login-btn::before {
    content: ''; position: absolute; top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.5s;
  }
  .login-btn:hover::before { left: 100%; }
  .login-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(22,101,52,0.4); }
  .login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .stat-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(4px);
    padding: 16px 20px; border-radius: 2px; flex: 1;
  }

  .temple-arch {
    position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%);
    width: 200px; height: 100px;
    border: 1px solid rgba(34,197,94,0.1);
    border-bottom: none; border-radius: 100px 100px 0 0;
  }

  .ring-pulse::after {
    content: ''; position: absolute; inset: -4px; border-radius: 50%;
    border: 2px solid rgba(34,197,94,0.4);
    animation: pulse-ring 2s ease-out infinite;
  }
`;

// ─── Composition Root ─────────────────────────────────────────────────────────

const LoginPage = () => {
	const formProps = useLoginForm();

	return (
		<div
			className="min-h-screen w-full flex items-stretch relative overflow-hidden"
			style={{ fontFamily: "'Segoe UI', sans-serif", background: "#020f05" }}
			onKeyDown={formProps.handleKeyDown}
		>
			<style>{GLOBAL_STYLES}</style>
			<BrandPanel />
			<FormPanel {...formProps} />
		</div>
	);
};

export default LoginPage;