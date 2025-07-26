import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const skillOptions = [
	{ value: "Electrician", label: "Electrician (الیکٹریشن)" },
	{ value: "Plumber", label: "Plumber (پلمبر)" },
	{ value: "Carpenter", label: "Carpenter (ترکھان)" },
	{ value: "Painter", label: "Painter (رنگ ساز)" },
	{ value: "Mechanic", label: "Mechanic (مکینک)" },
	{ value: "AC Technician", label: "AC Technician (اے سی ٹیکنیشن)" },
	{ value: "Welder", label: "Welder (ویلڈر)" },
	{ value: "Cleaner", label: "Cleaner (صفائی والا)" },
	{ value: "Mason", label: "Mason / Mistri (مستری)" },
	{ value: "Tile Fixer", label: "Tile Fixer (ٹائل لگانے والا)" },
	{ value: "Marble Fixer", label: "Marble Fixer (ماربل لگانے والا)" },
	{ value: "Steel Fixer", label: "Steel Fixer (سٹیل فکسر)" },
	{ value: "Construction Labor", label: "Construction Labor (مزدور)" },
	{
		value: "Shuttering Carpenter",
		label: "Shuttering Carpenter (شٹرنگ ترکھان)",
	},
	{ value: "Roofing Expert", label: "Roofing Expert (چھت بنانے والا)" },
	{ value: "Plaster Worker", label: "Plaster Worker (پلستر کرنے والا)" },
	{
		value: "Excavator Operator",
		label: "Excavator Operator (ایکسکیویٹر آپریٹر)",
	},
	{ value: "Scaffolder", label: "Scaffolder (سکافولڈ لگانے والا)" },
	{ value: "Glass Installer", label: "Glass Installer (شیشہ لگانے والا)" },
	{
		value: "POP Ceiling Installer",
		label: "POP Ceiling Installer (پی او پی سیلنگ کاریگر)",
	},
	{
		value: "Solar Panel Installer",
		label: "Solar Panel Installer (سولر انسٹالر)",
	},
	{
		value: "False Ceiling Technician",
		label: "False Ceiling Technician (فال سیلنگ کاریگر)",
	},
	{ value: "Bricklayer", label: "Bricklayer (اینٹیں لگانے والا)" },
	{
		value: "Waterproofing Expert",
		label: "Waterproofing Expert (واٹر پروفنگ ماہر)",
	},
	{ value: "Grill Fabricator", label: "Grill Fabricator (گرِل بنانے والا)" },
	{ value: "Landscaper", label: "Landscaper (گھاس باغ لگانے والا)" },
	{ value: "Floor Polisher", label: "Floor Polisher (فرش پالش کرنے والا)" },
	{
		value: "Pest Control Technician",
		label: "Pest Control Technician (کیڑوں کا خاتمہ کرنے والا)",
	},
	{ value: "Window Installer", label: "Window Installer (کھڑکی لگانے والا)" },
	{ value: "Gate Maker", label: "Gate Maker (دروازہ بنانے والا)" },
	{ value: "Sanitary Worker", label: "Sanitary Worker (سینیٹری ورکر)" },
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

				const profile = res.data;

				setFormData({
					skills: Array.isArray(profile.skills) ? profile.skills : [],
					rate: typeof profile.rate === "number" ? profile.rate : "",
					experience: profile.experience || "",
					serviceRadius:
						typeof profile.serviceRadius === "number"
							? profile.serviceRadius
							: "",
				});

				setIsEditing(true);
			} catch (err) {
				console.error("Failed to fetch worker profile", err);
				setIsEditing(false);
			}
		};

		fetchProfile();
	}, []);

	const handleChange = (e) => {
		const { name, value, type } = e.target;

		const numericFields = ["rate", "serviceRadius"];
		if (numericFields.includes(name)) {
			setFormData((prev) => ({
				...prev,
				[name]: Number(value),
			}));
		} else if (name === "skills") {
			const selectedOptions = Array.from(e.target.selectedOptions).map(
				(opt) => opt.value
			);
			setFormData((prev) => ({
				...prev,
				skills: selectedOptions,
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
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
			navigate("/my-worker-profile");
		} catch (err) {
			console.error("Error details:", err.response?.data || err.message);
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
						<label key={skill.value} className="text-sm">
							<input
								type="checkbox"
								checked={formData.skills.includes(skill.value)}
								onChange={() => handleCheckbox(skill.value)}
								className="mr-1"
							/>
							{skill.label}
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
