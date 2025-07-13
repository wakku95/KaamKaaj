import { useEffect, useState } from "react";
import axios from "axios";

export default function RequestsPage() {
	const [requests, setRequests] = useState([]);

	useEffect(() => {
		const token = localStorage.getItem("adminToken");
		axios
			.get("/api/admin/requests", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => setRequests(res.data))
			.catch((err) => console.error(err));
	}, []);

	return (
		<div className="bg-slate-800">
			<h1 className="text-2xl font-bold mb-4">All Requests</h1>
			<div className="bg-slate-800 rounded shadow p-4">
				{requests.map((u) => (
					<div key={u._id} className="border-b py-2">
						{u.name} — {u.email}
					</div>
				))}
			</div>
		</div>
	);
}
