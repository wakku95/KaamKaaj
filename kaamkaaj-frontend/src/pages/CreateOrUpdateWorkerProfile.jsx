import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const skillOptions = [
	"Electrician",
	"Plumber",
	"Carpenter",
	"Painter",
	"Mechanic",
	"AC Technician",
	"Welder",
	"Cleaner",
];

const experienceOptions = ["<1 year", "1-2 years", "3-5 years", "5+ years"];
const rateOptions = [300, 500, 800, 1000];
const radiusOptions = [5, 10, 20, 100, 200];

export default function CreateOrUpdateWorkerProfile() {
	const { token } = useAuth();
	const [formData, setFormData] = useState({
		skills: [],
		rate: "",
		experience: "",
		serviceRadius: "",
	});
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await axios.get("/api/workers/profile", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setFormData({
					skills: res.data.skills || [],
					rate: res.data.rate?.toString() || "",
					experience: res.data.experience || "",
					serviceRadius: res.data.serviceRadius?.toString() || "",
				});
				setIsEditing(true);
			} catch (err) {
				setIsEditing(false);
			}
		};
		fetchProfile();
	}, []);

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleCheckbox = (skill) => {
		setFormData((prev) => ({
			...prev,
			skills: prev.skills.includes(skill)
				? prev.skills.filter((s) => s !== skill)
				: [...prev.skills, skill],
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await axios.post("/api/workers/profile", formData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			alert("Profile saved successfully!");
			navigate("/profile");
		} catch (err) {
			alert("Failed to save profile");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
			<form
				onSubmit={handleSubmit}
				className="bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-lg"
			>
				<h2 className="text-2xl font-bold mb-4 text-center">
					{isEditing ? "Edit Worker Profile" : "Create Worker Profile"}
				</h2>

				<label className="block mb-2 text-sm">Skills</label>
				<div className="flex flex-wrap gap-2 mb-4">
					{skillOptions.map((skill) => (
						<label key={skill} className="text-sm">
							<input
								type="checkbox"
								checked={formData.skills.includes(skill)}
								onChange={() => handleCheckbox(skill)}
								className="mr-1"
							/>
							{skill}
						</label>
					))}
				</div>

				<label className="block mb-2 text-sm">Rate (PKR)</label>
				<select
					name="rate"
					value={formData.rate || ""}
					onChange={handleChange}
					className="w-full p-2 rounded bg-slate-700 mb-4"
					required
				>
					<option value="">Select rate</option>
					{rateOptions.map((rate) => (
						<option key={rate} value={rate}>
							Rs. {rate}
						</option>
					))}
				</select>

				<label className="block mb-2 text-sm">Experience</label>
				<select
					name="experience"
					value={formData.experience || ""}
					onChange={handleChange}
					className="w-full p-2 rounded bg-slate-700 mb-4"
					required
				>
					<option value="">Select experience</option>
					{experienceOptions.map((exp) => (
						<option key={exp} value={exp}>
							{exp}
						</option>
					))}
				</select>

				<label className="block mb-2 text-sm">Service Radius (km)</label>
				<select
					name="serviceRadius"
					value={formData.serviceRadius || ""}
					onChange={handleChange}
					className="w-full p-2 rounded bg-slate-700 mb-4"
					required
				>
					<option value="">Select radius</option>
					{radiusOptions.map((radius) => (
						<option key={radius} value={radius}>
							{radius} km
						</option>
					))}
				</select>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 hover:bg-blue-700 transition p-2 rounded text-white"
				>
					{isEditing ? "Update Profile" : "Create Profile"}
				</button>
			</form>
		</div>
	);
}
