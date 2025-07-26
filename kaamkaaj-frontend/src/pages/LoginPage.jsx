// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const res = await axios.post("/api/auth/login", {
				email,
				password,
			});
			const { token } = res.data;

			if (!res.data.isEmailVerified) {
				setError("Please verify your email first.");
				setLoading(false);
				return;
			}

			// localStorage.setItem("token", token);
			login(token);
			navigate("/");
		} catch (err) {
			console.error(err);
			setError(err.response?.data?.message || "Login failed");
			setLoading(false);
		}
	};

	return (
		<motion.div
			className="min-h-screen bg-[#1e293b] text-white flex items-center justify-center px-4"
			initial={{ opacity: 0, y: 40 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold mb-4 text-center">
					Login to KaamKaaj
				</h2>

				{error && (
					<p className="text-red-400 text-sm mb-3 text-center">{error}</p>
				)}

				<form onSubmit={handleLogin} className="space-y-4">
					<input
						type="email"
						placeholder="Email"
						className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Password"
						className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded font-semibold flex items-center justify-center"
					>
						{loading ? (
							<svg
								className="animate-spin h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
								></path>
							</svg>
						) : (
							"Login"
						)}
					</button>
				</form>

				<p className="text-sm mt-4 text-center">
					Don't have an account?{" "}
					<span
						onClick={() => navigate("/register")}
						className="text-blue-400 cursor-pointer hover:underline"
					>
						Register
					</span>
				</p>
			</div>
		</motion.div>
	);
}
