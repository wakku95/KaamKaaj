import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

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
				className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
			>
				{profile.isAvailable ? "Set as Unavailable" : "Set as Available"}
			</button>
		</div>
	);
}
