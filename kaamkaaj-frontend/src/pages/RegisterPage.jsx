import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
		isWorker: false,
		location: {
			type: "Point",
			coordinates: [0, 0],
		},
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	useEffect(() => {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					setFormData((prev) => ({
						...prev,
						location: {
							type: "Point",
							coordinates: [longitude, latitude],
						},
					}));
				},
				(error) => {
					console.warn("Location access denied or unavailable");
				}
			);
		} else {
			console.warn("Geolocation not supported by browser");
		}
	}, []);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await axios.post("/api/auth/register", formData);
			alert("Registered! Please check your email for OTP.");
			try {
				await axios.post("/api/auth/send-email-otp", { email: formData.email });
			} catch (err) {
				alert("Otp failed to send. Please resend it manually");
			}

			navigate("/verify-email");
		} catch (err) {
			alert(err.response?.data?.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4"
		>
			<div className="bg-[#1e293b] p-8 rounded-xl shadow-lg w-full max-w-md text-white">
				<h2 className="text-2xl font-bold mb-6 text-center">
					Register to KaamKaaj
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						name="name"
						placeholder="Full Name"
						required
						className="w-full p-3 rounded bg-[#334155] focus:outline-none"
						value={formData.name}
						onChange={handleChange}
					/>

					<input
						type="email"
						name="email"
						placeholder="Email"
						required
						className="w-full p-3 rounded bg-[#334155] focus:outline-none"
						value={formData.email}
						onChange={handleChange}
					/>

					<input
						type="tel"
						name="phone"
						placeholder="Phone (e.g. +923001234567)"
						required
						className="w-full p-3 rounded bg-[#334155] focus:outline-none"
						value={formData.phone}
						onChange={handleChange}
					/>

					<input
						type="password"
						name="password"
						placeholder="Password"
						required
						className="w-full p-3 rounded bg-[#334155] focus:outline-none"
						value={formData.password}
						onChange={handleChange}
					/>
					<div className="flex items-center gap-4 mt-2">
						<label className="flex items-center">
							<input
								type="radio"
								name="isWorker"
								value={true}
								checked={formData.isWorker === true}
								onChange={() => setFormData({ ...formData, isWorker: true })}
								className="mr-2"
							/>
							I'm a Worker
						</label>
						<label className="flex items-center">
							<input
								type="radio"
								name="isWorker"
								value={false}
								checked={formData.isWorker === false}
								onChange={() => setFormData({ ...formData, isWorker: false })}
								className="mr-2"
							/>
							I'm a Customer
						</label>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-semibold transition"
					>
						{loading ? "Registering..." : "Register"}
					</button>
				</form>

				<p className="text-center text-sm mt-4">
					Already have an account?{" "}
					<a href="/login" className="text-blue-400 hover:underline">
						Login
					</a>
				</p>
			</div>
		</motion.div>
	);
}
