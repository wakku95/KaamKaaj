import { useEffect, useState } from "react";
import axios from "axios";

export default function UsersPage() {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const token = localStorage.getItem("adminToken");
		axios
			.get("/api/admin/users", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => setUsers(res.data))
			.catch((err) => console.error(err));
	}, []);

	return (
		<div className="bg-slate-800">
			<h1 className="text-2xl font-bold mb-4">All Users</h1>
			<div className="bg-slate-800 rounded shadow p-4">
				{users ? (
					users.map((u) => (
						<div key={u._id} className="border-b py-2">
							{u.name} — {u.email}
						</div>
					))
				) : (
					<h1>No fetching failed</h1>
				)}
			</div>
		</div>
	);
}
