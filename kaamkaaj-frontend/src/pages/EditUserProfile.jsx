// src/pages/EditUserProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function EditUserProfile() {
	const { token, user, setUser } = useAuth();
	const navigate = useNavigate();
	const [userData, setUserData] = useState({
		name: "",
		phone: "",
		password: "",
		isWorker: null,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await fetch("/api/user/get-profile", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await res.json();
				setUserData({
					name: data.name,
					email: data.email,
					phone: data.phone,
					password: "",
					isWorker: data.isWorker,
				});
				// setUser({
				// 	name: data.name,
				// 	email: user.email,
				// 	phone: data.phone,
				// 	isWorker: data.isWorker,
				// });
				setLoading(false);
			} catch (err) {
				alert("Failed to fetch user data");
			}
		};
		fetchProfile();
	}, []);

	const handleChange = (e) => {
		setUserData({ ...userData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/user/edit", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(userData),
			});
			if (!res.ok) throw new Error("Failed to update profile");
			setUser(userData);
			alert("Profile updated successfully");
			navigate("/profile");
		} catch (err) {
			alert(err.message);
		}
	};

	if (loading) return <p className="text-white text-center">Loading...</p>;

	return (
		<div className="min-h-screen bg-slate-900 text-white p-6">
			<div className="max-w-md mx-auto bg-slate-800 p-6 rounded-xl shadow-xl">
				<h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm mb-1">Name</label>
						<input
							type="text"
							name="name"
							value={userData.name}
							onChange={handleChange}
							className="w-full p-2 rounded bg-slate-700 text-white"
							required
						/>
					</div>
					<div>
						<label className="block text-sm mb-1">Phone</label>
						<input
							type="text"
							name="phone"
							value={userData.phone}
							onChange={handleChange}
							className="w-full p-2 rounded bg-slate-700 text-white"
							required
						/>
					</div>
					<div>
						<label className="block text-sm mb-1">
							New Password (optional)
						</label>
						<input
							type="password"
							name="password"
							value={userData.password}
							onChange={handleChange}
							className="w-full p-2 rounded bg-slate-700 text-white"
						/>
					</div>
					<button
						type="submit"
						className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded"
					>
						Update Profile
					</button>
				</form>
			</div>
		</div>
	);
}
