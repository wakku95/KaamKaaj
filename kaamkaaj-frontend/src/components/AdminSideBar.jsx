import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
	return (
		<aside className="w-64 bg-slate-900 text-white p-5 space-y-4">
			<h2 className="text-2xl font-bold">Admin Panel</h2>
			{[
				{ to: "/admin/users", label: "Users" },
				{ to: "/admin/workers", label: "Workers" },
				{ to: "/admin/requests", label: "Requests" },
			].map(({ to, label }) => (
				<NavLink
					key={to}
					to={to}
					className={({ isActive }) =>
						`block px-2 py-1 rounded ${
							isActive ? "bg-blue-600" : "hover:bg-slate-700"
						}`
					}
				>
					{label}
				</NavLink>
			))}
		</aside>
	);
}
