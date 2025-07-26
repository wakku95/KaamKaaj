// src/components/Header.jsx
import { Link, useLocation } from "react-router-dom";
import { Bell, LogOut, Menu, User } from "lucide-react";
import { useState } from "react";
import MobileDrawer from "./MobileDrawer";
import { useAuth } from "../context/AuthContext";

export default function Header() {
	// const token = localStorage.getItem("token");
	const { logout, isLoggedIn } = useAuth();
	// const isLoggedIn = !!token;
	const [drawerOpen, setDrawerOpen] = useState(false);
	const location = useLocation();

	const navLinks = [
		{ to: "/", label: "Home" },
		{ to: "/search", label: "Search" },
		...(isLoggedIn
			? [
					{ to: "/requests", label: "Requests" },
					{ to: "/profile", label: "Profile" },
			  ]
			: []),
	];

	const clickLogout = () => {
		// localStorage.removeItem("token");.
		logout();
		window.location.href = "/";
	};

	return (
		<header className="sticky top-0 z-50 bg-[#1e293b] text-white shadow-sm px-4 py-3 flex items-center justify-between">
			{/* Left: Hamburger + Logo (mobile only) */}
			<div className="flex items-center gap-2">
				<button
					className="md:hidden text-gray-300 hover:text-blue-400"
					onClick={() => setDrawerOpen(!drawerOpen)}
				>
					<Menu size={22} />
				</button>
				<Link to="/" className="text-xl font-bold tracking-tight text-white">
					KaamKaaj
				</Link>
			</div>

			{/* Nav links */}
			<nav className="hidden md:flex gap-6">
				{navLinks.map(({ to, label }) => (
					<Link
						key={to}
						to={to}
						className={`text-sm ${
							location.pathname === to
								? "font-bold text-blue-400"
								: "text-gray-300"
						} hover:text-blue-300 transition`}
					>
						{label}
					</Link>
				))}
			</nav>

			{/* Right side */}
			<div className="flex items-center gap-4">
				{isLoggedIn ? (
					<>
						<button className="text-gray-300 hover:text-blue-300">
							<Bell size={20} />
						</button>
						<Link
							to="/profile"
							className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
						>
							U
						</Link>
						<button
							onClick={clickLogout}
							className="text-gray-300 hover:text-red-400 transition"
						>
							<LogOut size={20} />
						</button>
					</>
				) : (
					<>
						<Link to="/login" className="text-sm text-blue-400 hover:underline">
							Login
						</Link>
						<Link
							to="/register"
							className="text-sm text-blue-400 hover:underline"
						>
							Register
						</Link>
					</>
				)}
			</div>

			{/* Mobile Drawer */}
			<MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
		</header>
	);
}
