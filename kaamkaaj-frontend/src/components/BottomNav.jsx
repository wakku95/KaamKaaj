import { NavLink } from "react-router-dom";
import { Home, Search, MessageCircle, User } from "lucide-react";

const navItems = [
	{ to: "/", icon: Home, label: "Home" },
	{ to: "/search", icon: Search, label: "Search" },
	{ to: "/requests", icon: MessageCircle, label: "Requests" },
	{ to: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
	return (
		<nav className="fixed bottom-0 left-0 right-0 bg-[#1e293b] border-t border-slate-700 z-50 md:hidden">
			<div className="flex justify-around items-center py-2">
				{navItems.map(({ to, icon: Icon, label }) => (
					<NavLink
						key={to}
						to={to}
						className={({ isActive }) =>
							`flex flex-col items-center gap-0.5 text-xs ${
								isActive ? "text-blue-400" : "text-slate-300"
							}`
						}
					>
						<Icon size={20} />
						<span>{label}</span>
					</NavLink>
				))}
			</div>
		</nav>
	);
}
