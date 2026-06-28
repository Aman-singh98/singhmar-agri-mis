import { useState, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import {
	HiChevronDown, HiChevronLeft, HiChevronRight, HiLogout,
	HiUserCircle, HiDotsVertical, HiPlus, HiX
} from "react-icons/hi";
import { sidebarMenu } from "../constants/sidebarMenu";
import { ROUTES } from "../constants/routes";
import { useAuth } from "../context/AuthContext";

function findActiveGroupName(menus, pathname) {
	for (const menu of menus) {
		if (!menu.subMenu) continue;
		const hasMatch = menu.subMenu.some((sub) => sub.path === pathname);
		if (hasMatch) return menu.name;
	}
	return "";
}

function CollapseToggleButton({ collapsed, onToggle }) {
	return (
		<button
			onClick={onToggle}
			className="hidden md:flex absolute -right-3 top-6 bg-white text-stone-700
			           border border-stone-200 rounded-full p-1 shadow-md
			           hover:bg-stone-50 transition z-10"
			aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
		>
			{collapsed ? <HiChevronRight className="w-4 h-4" /> : <HiChevronLeft className="w-4 h-4" />}
		</button>
	);
}

function SidebarHeader({ collapsed, onClose }) {
	return (
		<div className="flex-none flex items-center justify-between p-4 border-b border-white/10 pt-5">
			<div className="flex items-center gap-3">
				<div className="w-9 h-9 border border-green-600 flex items-center justify-center">
					<div className="w-2.5 h-2.5 bg-green-500 rotate-45" />
				</div>
				{!collapsed && (
					<div>
						<p style={{ color: "#86efac", fontSize: 16, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'DM Sans'" }}>AGARWAL</p>
						<p className="text-[10px] uppercase tracking-widest text-green-500 font-light">
							Agricultural Management Information System
						</p>
					</div>
				)}
			</div>
			{onClose && (
				<button
					onClick={onClose}
					className="lg:hidden p-1 rounded hover:bg-white/10 transition"
					aria-label="Close navigation menu"
				>
					<HiX className="w-5 h-5" />
				</button>
			)}
		</div>
	);
}

function SubMenuItems({ items, currentPath, onLinkClick, collapsed }) {
	if (collapsed) {
		return (
			<div className="mt-1 space-y-0.5 flex flex-col items-center">
				{items.map((sub, index) => {
					const SubIcon = sub.icon;
					const isActive = currentPath === sub.path;
					return (
						<NavLink
							key={index}
							to={sub.path}
							onClick={onLinkClick}
							title={sub.name}
							className={`p-2 rounded transition-colors
								${isActive
									? "bg-green-600 text-white shadow"
									: "text-stone-400 hover:bg-white/10 hover:text-white"
								}`}
						>
							{SubIcon && <SubIcon className="w-4 h-4" />}
						</NavLink>
					);
				})}
			</div>
		);
	}

	return (
		<div className="ml-8 mt-1 space-y-0.5">
			{items.map((sub, index) => {
				const SubIcon = sub.icon;
				const isActive = currentPath === sub.path;
				return (
					<NavLink
						key={index}
						to={sub.path}
						onClick={onLinkClick}
						className={`flex items-center gap-2 px-3 py-2 text-xs rounded transition-colors
							${isActive
								? "bg-green-600 text-white font-semibold shadow"
								: "text-stone-400 hover:text-white hover:bg-white/8"
							}`}
					>
						{SubIcon
							? <SubIcon className="w-3.5 h-3.5" />
							: sub.name.includes("Add") && <HiPlus className="w-3.5 h-3.5 text-green-400" />
						}
						{sub.name}
					</NavLink>
				);
			})}
		</div>
	);
}

function ProfileSection({ user, collapsed, isProfileOpen, onToggleProfile, onProfileClick, onLogout }) {
	return (
		<div className="flex-none relative px-3 py-4 border-t border-white/10">
			<div className="flex items-center gap-3">
				<button
					onClick={onProfileClick}
					title="My Profile"
					className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center
					           justify-center font-bold text-sm hover:ring-2 hover:ring-green-400/50 transition"
				>
					{user?.name?.charAt(0)?.toUpperCase()}
				</button>
				{!collapsed && (
					<>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-semibold text-white truncate">{user?.name}</p>
							<p className="text-xs text-stone-400 truncate capitalize">{user?.role}</p>
						</div>
						<button
							onClick={onToggleProfile}
							className="p-1 rounded-full hover:bg-white/10 transition"
							aria-label="Profile options"
						>
							<HiDotsVertical className="w-5 h-5 text-stone-400" />
						</button>
					</>
				)}
			</div>
			{isProfileOpen && !collapsed && (
				<div className="absolute bottom-16 left-3 right-3 bg-white text-stone-700
				                rounded shadow-2xl overflow-hidden z-50 border border-stone-100">
					{/* <button
						onClick={onProfileClick}
						className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 text-sm transition"
					>
						<HiUserCircle className="w-5 h-5 text-stone-700" />
						My Profile
					</button> */}
					<div className="border-t border-stone-100" />
					<button
						onClick={onLogout}
						className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 text-sm transition"
					>
						<HiLogout className="w-5 h-5" />
						Log out
					</button>
				</div>
			)}
		</div>
	);
}

function Sidebar({ collapsed, setCollapsed, onClose }) {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const menus = sidebarMenu(user)[user?.role] ?? [];

	const [activeDropdown, setActiveDropdown] = useState("");

	useEffect(() => {
		const activeGroup = findActiveGroupName(menus, location.pathname);
		setActiveDropdown(activeGroup);
	}, [location.pathname]);

	function toggleDropdown(name) {
		setActiveDropdown((prev) => (prev === name ? "" : name));
	}

	function closeOnMobile() {
		if (onClose) onClose();
	}

	function handleMyProfile() {
		setActiveDropdown("");
		closeOnMobile();
		navigate(`/${user.role}/profile`);
	}

	function handleToggleProfilePopover() {
		setActiveDropdown((prev) => (prev === "profile" ? "" : "profile"));
	}

	function handleLogout() {
		logout();
		navigate(ROUTES.LOGIN);
	}

	return (
		<aside
			className={`relative h-full flex flex-col shadow-xl transition-all duration-300
			            bg-stone-900 text-stone-100
			            ${collapsed ? "w-20" : "w-64"}`}
		>
			<div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-700 via-green-500 to-green-700" />
			{!onClose && (
				<CollapseToggleButton
					collapsed={collapsed}
					onToggle={() => setCollapsed(!collapsed)}
				/>
			)}
			<SidebarHeader collapsed={collapsed} onClose={onClose} />
			<nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto custom-scrollbar">
				<style>{`
					.custom-scrollbar::-webkit-scrollbar       { width: 4px; }
					.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
					.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }
					.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34,197,94,0.4); }
					.custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.15) transparent; }
				`}</style>
				{menus.map((item, index) => {
					const Icon = item.icon;
					if (item.subMenu) {
						const isOpen = activeDropdown === item.name;
						const isParentActive = item.subMenu.some((sub) => sub.path === location.pathname);
						const showSubItems = isOpen || isParentActive;

						return (
							<div key={index}>
								<div
									onClick={() => toggleDropdown(item.name)}
									className={`flex items-center justify-between px-3 py-2.5 rounded cursor-pointer transition-colors
										${isParentActive
											? "bg-green-600/20 text-green-400 border border-green-600/30"
											: "hover:bg-white/8 text-stone-300 hover:text-white"
										}`}
								>
									<div className="flex items-center gap-3">
										<Icon className="w-5 h-5" />
										{!collapsed && (
											<span className="text-sm font-medium">{item.name}</span>
										)}
									</div>
									{!collapsed && (
										<HiChevronDown
											className={`w-4 h-4 transition-transform duration-200
											            ${isOpen ? "rotate-180" : ""}`}
										/>
									)}
								</div>
								{showSubItems && (
									<SubMenuItems
										items={item.subMenu}
										currentPath={location.pathname}
										onLinkClick={closeOnMobile}
										collapsed={collapsed}
									/>
								)}
							</div>
						);
					}

					const isActive = location.pathname === item.path;
					return (
						<NavLink
							key={index}
							to={item.path}
							onClick={closeOnMobile}
							className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors
								${isActive
									? "bg-green-600 text-white font-semibold shadow"
									: "text-stone-300 hover:text-white hover:bg-white/8"
								}`}
						>
							<Icon className="w-5 h-5" />
							{!collapsed && (
								<span className="text-sm font-medium">{item.name}</span>
							)}
						</NavLink>
					);
				})}
			</nav>

			<ProfileSection
				user={user}
				collapsed={collapsed}
				isProfileOpen={activeDropdown === "profile"}
				onToggleProfile={handleToggleProfilePopover}
				onProfileClick={handleMyProfile}
				onLogout={handleLogout}
			/>
		</aside>
	);
}

export default Sidebar;