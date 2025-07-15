import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

export default function VerifyEmailPage() {
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [resendCooldown, setResendCooldown] = useState(0);
	const navigate = useNavigate();

	// Countdown timer
	useEffect(() => {
		if (resendCooldown > 0) {
			const timer = setTimeout(() => {
				setResendCooldown((prev) => prev - 1);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [resendCooldown]);

	const handleVerify = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");

		try {
			const res = await axios.post("/api/auth/verify-email-otp", {
				email,
				otp,
			});
			setMessage("✅ Email verified! You can now log in.");
			setTimeout(() => navigate("/login"), 2000);
		} catch (err) {
			setMessage(err.response?.data?.message || "Verification failed.");
		} finally {
			setLoading(false);
		}
	};

	const handleResend = async () => {
		if (!email) return alert("Please enter email first");

		if (resendCooldown > 0) {
			return alert(`Please wait ${resendCooldown} seconds before resending`);
		}

		try {
			await axios.post("/api/auth/send-email-otp", { email });
			setResendCooldown(60); // 60 seconds cooldown
			alert("OTP sent again. Check your inbox.");
		} catch (err) {
			const msg = err.response?.data?.message;

			if (msg === "Email is already verified.") {
				alert("Your email is already verified. You can log in now.");
				navigate("/login");
			} else {
				alert(msg || "Failed to resend OTP");
			}
		}
	};

	return (
		<div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4">
			<div className="bg-slate-800 p-6 rounded-xl shadow-xl w-full max-w-md">
				<h1 className="text-2xl font-bold mb-4 text-center">
					Verify Your Email
				</h1>
				<p className="text-sm text-slate-400 mb-4 text-center">
					Enter your email and the OTP sent to you
				</p>

				<form onSubmit={handleVerify} className="space-y-4">
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						required
						className="w-full p-2 bg-slate-700 rounded focus:outline-none"
					/>
					<input
						type="text"
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						placeholder="Enter OTP"
						required
						className="w-full p-2 bg-slate-700 rounded focus:outline-none"
					/>
					<button
						type="submit"
						disabled={loading}
						className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 transition p-2 rounded"
					>
						{loading ? <Loader className="animate-spin" size={18} /> : null}
						Verify
					</button>
				</form>

				<button
					onClick={handleResend}
					disabled={resendCooldown > 0}
					className="mt-3 text-sm text-blue-400 hover:underline disabled:text-slate-500 disabled:cursor-not-allowed"
				>
					{resendCooldown > 0
						? `Resend OTP in ${resendCooldown}s`
						: "Resend OTP"}
				</button>

				{message && (
					<p className="mt-3 text-center text-sm text-yellow-400">{message}</p>
				)}
			</div>
		</div>
	);
}
