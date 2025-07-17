// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { Link } from "react-router-dom";
// import { FaCheckCircle, FaTimesCircle, FaEdit } from "react-icons/fa";

// export default function MyWorkerProfile() {
// 	const [profile, setProfile] = useState(null);
// 	const [loading, setLoading] = useState(true);
// 	const [location, setLocation] = useState({
// 		coordinates: null,
// 		locationName: "",
// 	});
// 	const [locationStatus, setLocationStatus] = useState(""); // For showing feedback
// 	const { token } = useAuth();

// 	useEffect(() => {
// 		const fetchProfile = async () => {
// 			try {
// 				const res = await axios.get("/api/workers/profile", {
// 					headers: {
// 						Authorization: `Bearer ${token}`,
// 					},
// 				});
// 				setProfile(res.data);
// 			} catch (err) {
// 				alert("Failed to load profile");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};
// 		fetchProfile();
// 	}, []);

// 	const getLocation = async () => {
// 		if (!navigator.geolocation) {
// 			setLocationStatus("Geolocation not supported.");
// 			return;
// 		}

// 		setLocationStatus("Fetching location...");

// 		navigator.geolocation.getCurrentPosition(
// 			async (position) => {
// 				const lat = position.coords.latitude;
// 				const lon = position.coords.longitude;

// 				try {
// 					const res = await axios.get(
// 						`https://us1.locationiq.com/v1/reverse.php?key=pk.3c70466dc51de1ed2704d56f43383f52&lat=${lat}&lon=${lon}&format=json`
// 					);

// 					const name =
// 						res.data.address.suburb ||
// 						res.data.address.city ||
// 						res.data.address.town ||
// 						res.data.display_name ||
// 						"Unknown Area";

// 					setLocation({
// 						coordinates: [lon, lat],
// 						locationName: name,
// 					});
// 					setLocationStatus("Location set successfully.");
// 				} catch (err) {
// 					console.error("LocationIQ error:", err);
// 					setLocation({
// 						coordinates: [lon, lat],
// 						locationName: "Unknown",
// 					});
// 					setLocationStatus("Could not fetch area name.");
// 				}
// 			},
// 			(error) => {
// 				console.error("Geolocation error:", error);
// 				setLocationStatus("Failed to get location.");
// 			}
// 		);
// 	};

// 	const toggleAvailability = async () => {
// 		try {
// 			const res = await axios.patch("/api/workers/toggle-availability", null, {
// 				headers: {
// 					Authorization: `Bearer ${token}`,
// 				},
// 			});
// 			setProfile(res.data.profile);
// 			alert(res.data.message);
// 		} catch (err) {
// 			alert("Failed to toggle availability");
// 		}
// 	};

// 	if (loading) return <p className="text-white">Loading...</p>;
// 	if (!profile)
// 		return (
// 			<div className="text-white p-4">
// 				<h2 className="text-2xl mb-2">My Worker Profile</h2>
// 				<p className="mb-4">
// 					No worker profile found. You can create one from the worker section.
// 				</p>
// 				<Link
// 					to="/create-update-worker-profile"
// 					className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
// 				>
// 					Create Worker Profile
// 				</Link>
// 			</div>
// 		);

// 	return (
// 		<div className="text-white p-4">
// 			<h2 className="text-2xl mb-2">My Worker Profile</h2>
// 			<p>Name: {profile.user.name}</p>
// 			<p>Email: {profile.user.email}</p>
// 			<p>Skills: {profile.skills.join(", ")}</p>
// 			<p>Rate: {profile.rate}</p>
// 			<p>Status: {profile.isAvailable ? "Available" : "Unavailable"}</p>

// 			<button
// 				onClick={toggleAvailability}
// 				className={`flex items-center mt-2 gap-2 px-4 py-2 rounded text-white transition duration-300 ${
// 					profile.isAvailable
// 						? "bg-green-600 hover:bg-green-700"
// 						: "bg-gray-600 hover:bg-gray-700"
// 				}`}
// 			>
// 				<div className="mb-4">
// 					<button
// 						type="button"
// 						onClick={getLocation}
// 						className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
// 					>
// 						Get My Location
// 					</button>
// 					<p className="text-sm mt-1 text-gray-300">
// 						{locationStatus ||
// 							"Your area will help us match you to nearby jobs."}
// 					</p>
// 					<div
// 						{...(location.locationName && (
// 							<p className="text-sm mt-1 text-white">
// 								📍 Location: {location.locationName}
// 							</p>
// 						))}
// 					/>
// 				</div>
// 				{profile.isAvailable ? (
// 					<>
// 						<FaTimesCircle />
// 						Set as Unavailable
// 					</>
// 				) : (
// 					<>
// 						<FaCheckCircle />
// 						Set as Available
// 					</>
// 				)}
// 			</button>

// 			<Link
// 				to="/create-update-worker-profile"
// 				className="flex items-center mt-2 max-w-40 gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition duration-300"
// 			>
// 				<FaEdit />
// 				Edit Profile
// 			</Link>
// 		</div>
// 	);
// }
