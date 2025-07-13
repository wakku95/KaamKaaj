import { useState } from "react";
import axios from "axios";

export default function AdminLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post("/api/admin/login", { email, password });
			localStorage.setItem("adminToken", res.data.token);
			window.location.href = "/admin";
		} catch (err) {
			alert("Invalid credentials");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-900">
			<form
				onSubmit={handleSubmit}
				className="bg-slate-800 p-6 rounded shadow-md w-96"
			>
				<h2 className="text-xl font-semibold mb-4">Admin Login</h2>
				<input
					type="email"
					className="w-full mb-3 p-2 border rounded"
					placeholder="Admin Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					className="w-full mb-3 p-2 border rounded"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
					Login
				</button>
			</form>
		</div>
	);
}
