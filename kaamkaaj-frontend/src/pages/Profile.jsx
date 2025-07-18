import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Profile() {
	const { user, logout, token, loading } = useAuth();
	const [updatingRole, setUpdatingRole] = useState(false);
	const navigate = useNavigate();
	// const [userData, setUserData] = useState(user);
	// const [loading, setLoading] = useState(true);

	useEffect(() => {
		// setUserData((prev) => {
		// 	console.log(prev);
		// 	return user;
		// });
		// setLoading(false);
		// const fetchProfile = async () => {
		// 	try {
		// 		const res = await fetch("/api/user/get-profile", {
		// 			headers: {
		// 				Authorization: `Bearer ${token}`,
		// 			},
		// 		});
		// 		const data = await res.json();
		// 		setUserData({
		// 			name: data.name,
		// 			phone: data.phone,
		// 			isWorker: data.isWorker,
		// 		});
		// 		setLoadingP(false);
		//    }
		//  catch (err) {
		// 	alert("Failed to fetch user data");
		// }
		// };
		// fetchProfile();
	}, []);

	const becomeWorker = async () => {
		if (!window.confirm("Do you want to become a worker?")) return;

		try {
			setUpdatingRole(true);

			const res = await fetch("/api/user/edit", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ isWorker: true }),
			});

			const data = await res.json();

			if (res.ok) {
				setUser(data.user); // update AuthContext
				setUserData(data.user);
				alert("You are now a worker!");
			} else {
				alert(data.message || "Failed to switch role");
			}
		} catch (err) {
			console.error(err);
			alert("Something went wrong");
		} finally {
			setUpdatingRole(false);
		}
	};

	if (loading) return <p className="text-center text-white">Loading...</p>;

	return (
		<div className="min-h-screen bg-slate-900 text-white p-6">
			<div className="max-w-md mx-auto bg-slate-800 p-6 rounded-xl shadow-xl overflow-hidden break-words">
				<h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>

				<div className="space-y-3 text-sm">
					<p>
						<strong>Name:</strong> {user.name}
					</p>
					<p>
						<strong>Email:</strong>
						{user.email}
					</p>
					<p>
						<strong>Phone:</strong> {user.phone}
					</p>
					<p>
						<strong>Role:</strong> {user.isWorker ? "Worker" : "User"}
						{!user.isWorker && (
							<button
								onClick={becomeWorker}
								disabled={updatingRole}
								className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition"
							>
								{updatingRole ? "Updating..." : "Become a Worker"}
							</button>
						)}
					</p>
				</div>

				<div className="mt-6 flex flex-col gap-3">
					<Link
						to="/edit-profile"
						className="bg-blue-600 hover:bg-blue-700 transition text-center py-2 rounded"
					>
						Edit Profile
					</Link>

					{user.isWorker && (
						<Link
							to="/my-worker-profile"
							className="bg-yellow-600 hover:bg-yellow-700 transition text-center py-2 rounded"
						>
							View Worker Profile
						</Link>
					)}

					<button
						onClick={async () => {
							const confirm = window.confirm(
								"Are you sure you want to delete your account?"
							);
							if (confirm) {
								try {
									await fetch("/api/user/delete", {
										method: "DELETE",
										headers: {
											Authorization: `Bearer ${token}`,
										},
									});
									logout();
									navigate("/");
								} catch (err) {
									alert("Failed to delete account.");
								}
							}
						}}
						className="bg-red-600 hover:bg-red-700 transition py-2 rounded text-center"
					>
						Delete Account
					</button>
				</div>
			</div>
		</div>
	);
}
