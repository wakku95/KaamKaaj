import { useEffect, useState } from "react";
import axios from "axios";
import AdminCard from "./AdminCard";

export default function WorkersPage() {
	const [workers, setWorkers] = useState([]);

	useEffect(() => {
		const token = localStorage.getItem("adminToken");
		axios
			.get("/api/admin/workers", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => setWorkers(res.data))
			.catch((err) => console.error(err));
	}, []);

	return (
		<div className="bg-slate-800">
			<h1 className="text-2xl font-bold mb-4">All Workers</h1>
			<div className="bg-slate-800 rounded shadow p-4">
				{workers.map((u) => (
					<AdminCard key={u._id} title={u.name} value={u.email}></AdminCard>
				))}
			</div>
		</div>
	);
}
