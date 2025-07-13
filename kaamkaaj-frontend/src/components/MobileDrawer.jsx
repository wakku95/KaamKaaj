// src/components/MobileDrawer.jsx
import { NavLink } from "react-router-dom";

export default function MobileDrawer({ open, onClose }) {
	return (
		<>
			{/* Backdrop */}
			<div
				onClick={onClose}
				className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 ${
					open ? "opacity-100 visible" : "opacity-0 invisible"
				}`}
			/>

			{/* Drawer */}
			<div
				className={`fixed top-0 left-0 h-full w-64 bg-[#1e293b] text-white shadow-lg z-50 transform transition-transform duration-300 ${
					open ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="px-5 py-4 border-b border-slate-700 text-lg font-semibold">
					Menu
				</div>
				<nav className="flex flex-col px-5 pt-3 text-sm">
					{[
						{ to: "/", label: "Home" },
						{ to: "/search", label: "Search" },
						{ to: "/requests", label: "Requests" },
						{ to: "/profile", label: "Profile" },
					].map(({ to, label }) => (
						<NavLink
							key={to}
							to={to}
							onClick={onClose}
							className={({ isActive }) =>
								`py-2 border-b border-slate-700 ${
									isActive ? "text-blue-400 font-semibold" : "text-slate-300"
								}`
							}
						>
							{label}
						</NavLink>
					))}
				</nav>
			</div>
		</>
	);
}
