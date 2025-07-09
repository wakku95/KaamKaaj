import WorkerProfile from "../models/WorkerProfile.js";

export const createOrUpdateWorkerProfile = async (req, res) => {
	const { skills, experience, rate, serviceRadius, location } = req.body;

	try {
		const existing = await WorkerProfile.findOne({ user: req.user._id });
		if (!req.user.isEmailVerified) {
			return res.json({ message: "Email is not verified" });
		}
		if (existing) {
			// Update existing profile
			existing.skills = skills;
			existing.experience = experience;
			existing.rate = rate;
			existing.serviceRadius = serviceRadius;
			existing.location = location;

			// Don't touch credits or access control here
			await existing.save();
			return res.json({ message: "Profile updated", profile: existing });
		}

		// Create new profile with default credits
		const profile = await WorkerProfile.create({
			user: req.user._id,
			skills,
			experience,
			rate,
			serviceRadius,
			location,
			credits: 5, // 🎁 5 free credits
			canAccessJobs: true, // ✅ allow even when credits = 0 (for now)
		});

		res.status(201).json({ message: "Profile created", profile });
	} catch (err) {
		console.error(err);
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
