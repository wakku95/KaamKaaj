import WorkerProfile from "../models/WorkerProfile.js";

export const createOrUpdateWorkerProfile = async (req, res) => {
	const { skills, experience, rate, serviceRadius, location, locationName } =
		req.body;

	const skillOptions = [
		"Electrician",
		"Plumber",
		"Carpenter",
		"Painter",
		"Mechanic",
		"AC Technician",
		"Welder",
		"Cleaner",
		"Mason",
		"Tile Fixer",
		"Marble Fixer",
		"Steel Fixer",
		"Construction Labor",
		"Shuttering Carpenter",
		"Roofing Expert",
		"Plaster Worker",
		"Excavator Operator",
		"Scaffolder",
		"Glass Installer",
		"POP Ceiling Installer",
		"Solar Panel Installer",
		"False Ceiling Technician",
		"Bricklayer",
		"Waterproofing Expert",
		"Grill Fabricator",
		"Landscaper",
		"Floor Polisher",
		"Pest Control Technician",
		"Window Installer",
		"Gate Maker",
		"Sanitary Worker",
	];

	const experienceOptions = ["<1 year", "1-2 years", "3-5 years", "5+ years"];
	const rateOptions = [300, 500, 800, 1000];
	const radiusOptions = [5, 10, 20, 100, 200];
	try {
		if (!req.user.isEmailVerified) {
			return res.status(403).json({ message: "Email is not verified" });
		}
		if (!req.user.isWorker) {
			return res.status(403).json({ message: "You have to be a worker first" });
		}

		// ✅ Validate skills
		if (
			!Array.isArray(skills) ||
			skills.some((skill) => !skillOptions.includes(skill))
		) {
			return res.status(400).json({ message: "Invalid skills selected" });
		}

		// ✅ Validate experience
		if (!experienceOptions.includes(experience)) {
			return res.status(400).json({ message: "Invalid experience value" });
		}

		// ✅ Validate rate
		if (!rateOptions.includes(rate)) {
			return res.status(400).json({ message: "Invalid rate selected" });
		}

		// ✅ Validate service radius
		if (!radiusOptions.includes(serviceRadius)) {
			return res.status(400).json({ message: "Invalid service radius" });
		}

		let profile = await WorkerProfile.findOne({ user: req.user._id });

		if (profile) {
			if (skills) profile.skills = skills;
			if (experience) profile.experience = experience;
			if (rate) profile.rate = rate;
			if (serviceRadius) profile.serviceRadius = serviceRadius;
			if (locationName) profile.locationName = locationName;
			if (location) profile.location = location; // optional

			await profile.save();
			return res.json({ message: "Profile updated", profile });
		}

		profile = await WorkerProfile.create({
			user: req.user._id,
			skills,
			experience,
			rate,
			serviceRadius,
			locationName: locationName || "Unknown",
			location,
			credits: 5,
			canAccessJobs: true,
		});

		res.status(201).json({ message: "Profile created", profile });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ message: "Failed to create/update profile" });
	}
};

export const getMyWorkerProfile = async (req, res) => {
	try {
		const profile = await WorkerProfile.findOne({
			user: req.user._id,
		}).populate("user", "name email");
		if (!profile) {
			return res.status(404).json({ message: "No profile found" });
		}
		res.json(profile);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to fetch profile" });
	}
};

export const searchWorkersNearby = async (req, res) => {
	const { longitude, latitude, skill, radius = 5 } = req.query;

	if (!longitude || !latitude) {
		return res.status(400).json({ message: "Coordinates are required" });
	}

	try {
		const workers = await WorkerProfile.find({
			skills: skill ? { $in: [skill] } : { $exists: true },
			isAvailable: true,
			location: {
				$nearSphere: {
					$geometry: {
						type: "Point",
						coordinates: [parseFloat(longitude), parseFloat(latitude)],
					},
					$maxDistance: parseFloat(radius) * 1000, // convert km to meters
				},
			},
		}).populate("user", "name email");

		res.json(workers);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Search failed" });
	}
};

export const toggleAvailability = async (req, res) => {
	try {
		const profile = await WorkerProfile.findOne({ user: req.user._id });
		if (!profile) {
			return res.status(404).json({ message: "Worker profile not found" });
		}
		profile.isAvailable = !profile.isAvailable;
		await profile.save();
		res.json({
			message: `Worker is now ${
				profile.isAvailable ? "available" : "unavailable"
			}`,
			profile,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to toggle availability" });
	}
};
