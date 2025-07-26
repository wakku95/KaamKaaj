import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSideBar";

export default function AdminLayout() {
	return (
		<div className="min-h-screen flex">
			<AdminSidebar />
			<main className="flex-1 bg-slate-800 p-6 overflow-y-auto">
				<Outlet />
			</main>
		</div>
	);
}
