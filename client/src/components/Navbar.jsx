// import { HiMenu, HiLogout } from "react-icons/hi";
// import { HiMoon, HiSun } from "react-icons/hi2";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useTheme } from "../context/ThemeContext";
// import { ROUTES } from "../constants/routes";

// function getUserInitial(name) {
// 	return name?.charAt(0)?.toUpperCase() ?? "";
// }

// function UserAvatar({ initial, size = "w-10 h-10" }) {
// 	return (
// 		<div
// 			className={`${size} rounded-full bg-stone-900 flex items-center justify-center
// 			            text-green-400 font-semibold text-sm shadow`}
// 		>
// 			{initial}
// 		</div>
// 	);
// }

// function Navbar({ onMenuClick }) {
// 	const { user, logout } = useAuth();
// 	const navigate = useNavigate();
// 	const { theme, toggleTheme } = useTheme();
// 	const userInitial = getUserInitial(user?.name);

// 	function handleLogout() {
// 		logout();
// 		navigate(ROUTES.LOGIN);
// 	}

// 	return (
// 		<header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700 shadow-sm">
// 			<div className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8">

// 				{/* Left — menu + logo */}
// 				<div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
// 					<button
// 						onClick={onMenuClick}
// 						className="lg:hidden p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
// 						aria-label="Open navigation menu"
// 					>
// 						<HiMenu className="w-5 h-5 sm:w-6 sm:h-6 text-stone-600 dark:text-stone-300" />
// 					</button>
// 					<div className="flex items-center gap-2 min-w-0">
// 						<div className="hidden sm:flex w-8 h-8 bg-stone-900 dark:bg-stone-700 items-center justify-center">
// 							<div className="w-2.5 h-2.5 bg-green-500 rotate-45" />
// 						</div>
// 						<div className="leading-tight min-w-0">
// 							<h1 className="text-sm sm:text-base md:text-lg font-bold text-stone-900 dark:text-white tracking-tight truncate">
// 								<span className="font-semibold text-green-900 dark:text-green-400">Singhmar</span>
// 							</h1>
// 							<p className="text-[10px] uppercase tracking-widest text-green-700 dark:text-green-500 font-medium">
// 								Agricultural Management Information System — Management Information System
// 							</p>
// 						</div>
// 					</div>
// 				</div>

// 				{/* Right — theme toggle + user + logout */}
// 				<div className="flex items-center gap-2 sm:gap-3 md:gap-4">

// 					{/* 🌙 Theme toggle button */}
// 					<button
// 						onClick={toggleTheme}
// 						className="p-2 rounded-lg text-stone-500 dark:text-stone-400
//                              hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
// 						title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
// 						aria-label="Toggle theme"
// 					>
// 						{theme === "dark"
// 							? <HiSun className="w-5 h-5 text-amber-400" />
// 							: <HiMoon className="w-5 h-5" />
// 						}
// 					</button>

// 					{/* md+ user info */}
// 					<div className="hidden md:flex items-center gap-3 border-l border-stone-200 dark:border-stone-700 pl-3 md:pl-4">
// 						<UserAvatar initial={userInitial} size="w-9 h-9 lg:w-10 lg:h-10" />
// 						<div className="leading-tight min-w-0">
// 							<p className="text-sm font-semibold text-stone-800 dark:text-stone-100 truncate max-w-[100px] lg:max-w-[140px]">
// 								{user?.name}
// 							</p>
// 							<p className="text-xs text-stone-600 dark:text-stone-400 capitalize truncate">
// 								{user?.role}
// 							</p>
// 						</div>
// 					</div>

// 					{/* sm user info */}
// 					<div className="hidden sm:flex md:hidden items-center gap-2 border-l border-stone-200 dark:border-stone-700 pl-3">
// 						<UserAvatar initial={userInitial} size="w-8 h-8" />
// 						<p className="text-xs font-semibold text-stone-800 dark:text-stone-100 truncate max-w-[80px]">
// 							{user?.name}
// 						</p>
// 					</div>

// 					{/* mobile avatar only */}
// 					<div className="flex sm:hidden items-center border-l border-stone-200 dark:border-stone-700 pl-2">
// 						<UserAvatar initial={userInitial} size="w-8 h-8" />
// 					</div>

// 					<button
// 						onClick={handleLogout}
// 						className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950 active:bg-red-100 transition-colors"
// 						title="Logout"
// 						aria-label="Logout"
// 					>
// 						<HiLogout className="w-5 h-5" />
// 					</button>
// 				</div>
// 			</div>
// 		</header>
// 	);
// }

// export default Navbar;












import { HiMenu, HiLogout } from "react-icons/hi";
import { HiMoon, HiSun } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ROUTES } from "../constants/routes";

function getUserInitial(name) {
	return name?.charAt(0)?.toUpperCase() ?? "";
}

function UserAvatar({ initial, size = "w-9 h-9" }) {
	return (
		<div
			className={`${size} rounded-full bg-stone-900 dark:bg-stone-700 flex items-center justify-center
			            text-green-400 font-semibold text-sm shrink-0 shadow`}
		>
			{initial}
		</div>
	);
}

function Navbar({ onMenuClick }) {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const { theme, toggleTheme } = useTheme();
	const userInitial = getUserInitial(user?.name);

	function handleLogout() {
		logout();
		navigate(ROUTES.LOGIN);
	}

	return (
		<header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700 shadow-sm w-full">
			<div className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-5 md:px-7 lg:px-10 max-w-screen-2xl mx-auto">

				{/* ── Left: hamburger + logo ── */}
				<div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">

					{/* Hamburger — hidden on lg+ */}
					<button
						onClick={onMenuClick}
						className="lg:hidden p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors shrink-0"
						aria-label="Open navigation menu"
					>
						<HiMenu className="w-5 h-5 sm:w-6 sm:h-6 text-stone-600 dark:text-stone-300" />
					</button>

					{/* Logo mark — hidden on xs */}
					<div className="hidden xs:flex sm:flex w-7 h-7 sm:w-8 sm:h-8 bg-stone-900 dark:bg-stone-700 items-center justify-center shrink-0">
						<div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rotate-45" />
					</div>

					{/* Brand text */}
					<div className="leading-tight min-w-0">
						<h1 className="text-sm sm:text-base md:text-lg font-bold text-stone-900 dark:text-white tracking-tight truncate">
							<span className="font-semibold text-green-900 dark:text-green-400">Agricultural Management Information System</span>
						</h1>
						{/* Tagline: hidden on tiny screens, shown sm+ */}
						<p className="hidden xs:block text-[9px] sm:text-[10px] uppercase tracking-widest text-green-700 dark:text-green-500 font-medium truncate">
							Agricultural Management Information System — Management Information System
						</p>
					</div>
				</div>

				{/* ── Right: theme + user + logout ── */}
				<div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">

					{/* Theme toggle */}
					<button
						onClick={toggleTheme}
						className="p-2 rounded-lg text-stone-500 dark:text-stone-400
						           hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
						title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
						aria-label="Toggle theme"
					>
						{theme === "dark"
							? <HiSun className="w-5 h-5 text-amber-400" />
							: <HiMoon className="w-5 h-5" />
						}
					</button>

					{/* User info — lg+: avatar + name + role */}
					<div className="hidden lg:flex items-center gap-3 border-l border-stone-200 dark:border-stone-700 pl-4">
						<UserAvatar initial={userInitial} size="w-9 h-9 xl:w-10 xl:h-10" />
						<div className="leading-tight min-w-0">
							<p className="text-sm font-semibold text-stone-800 dark:text-stone-100 truncate max-w-[120px] xl:max-w-[160px]">
								{user?.name}
							</p>
							<p className="text-xs text-stone-500 dark:text-stone-400 capitalize truncate">
								{user?.role}
							</p>
						</div>
					</div>

					{/* User info — sm–md: avatar + name only */}
					<div className="hidden sm:flex lg:hidden items-center gap-2 border-l border-stone-200 dark:border-stone-700 pl-2 sm:pl-3">
						<UserAvatar initial={userInitial} size="w-8 h-8" />
						<p className="hidden sm:block md:hidden text-xs font-semibold text-stone-800 dark:text-stone-100 truncate max-w-[72px]">
							{user?.name}
						</p>
						{/* md: show name + role stacked */}
						<div className="hidden md:flex lg:hidden flex-col leading-tight min-w-0">
							<p className="text-xs font-semibold text-stone-800 dark:text-stone-100 truncate max-w-[90px]">
								{user?.name}
							</p>
							<p className="text-[11px] text-stone-500 dark:text-stone-400 capitalize truncate">
								{user?.role}
							</p>
						</div>
					</div>

					{/* Avatar only — xs (< sm) */}
					<div className="flex sm:hidden items-center border-l border-stone-200 dark:border-stone-700 pl-2">
						<UserAvatar initial={userInitial} size="w-8 h-8" />
					</div>

					{/* Logout */}
					<button
						onClick={handleLogout}
						className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950
						           active:bg-red-100 transition-colors"
						title="Logout"
						aria-label="Logout"
					>
						<HiLogout className="w-5 h-5" />
					</button>
				</div>
			</div>
		</header>
	);
}

export default Navbar;