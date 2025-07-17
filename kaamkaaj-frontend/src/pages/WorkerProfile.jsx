import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaEdit } from "react-icons/fa";

export default function MyWorkerProfile() {
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const { token } = useAuth();

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await axios.get("/api/workers/profile", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setProfile(res.data);
			} catch (err) {
				alert("Failed to load profile");
			} finally {
				setLoading(false);
			}
		};
		fetchProfile();
	}, []);

	const toggleAvailability = async () => {
		try {
			const res = await axios.patch("/api/workers/toggle-availability", null, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setProfile(res.data.profile);
			alert(res.data.message);
		} catch (err) {
			alert("Failed to toggle availability");
		}
	};

	if (loading) return <p className="text-white">Loading...</p>;
	if (!profile)
		return (
			<div className="text-white p-4">
				<h2 className="text-2xl mb-2">My Worker Profile</h2>
				<p className="mb-4">
					No worker profile found. You can create one from the worker section.
				</p>
				<Link
					to="/create-update-worker-profile"
					className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
				>
					Create Worker Profile
				</Link>
			</div>
		);

	return (
		<div className="text-white p-4">
			<h2 className="text-2xl mb-2">My Worker Profile</h2>
			<p>Name: {profile.user.name}</p>
			<p>Email: {profile.user.email}</p>
			<p>Skills: {profile.skills.join(", ")}</p>
			<p>Rate: {profile.rate}</p>
			<p>Status: {profile.isAvailable ? "Available" : "Unavailable"}</p>

			<button
				onClick={toggleAvailability}
				className={`flex items-center mt-2 gap-2 px-4 py-2 rounded text-white transition duration-300 ${
					profile.isAvailable
						? "bg-green-600 hover:bg-green-700"
						: "bg-gray-600 hover:bg-gray-700"
				}`}
			>
				{profile.isAvailable ? (
					<>
						<FaTimesCircle />
						Set as Unavailable
					</>
				) : (
					<>
						<FaCheckCircle />
						Set as Available
					</>
				)}
			</button>

			<Link
				to="/create-update-worker-profile"
				className="flex items-center mt-2 max-w-40 gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition duration-300"
			>
				<FaEdit />
				Edit Profile
			</Link>
		</div>
	);
}
