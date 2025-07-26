import User from "../models/User.js";
import bcrypt from "bcryptjs";
import WorkerProfile from "../models/WorkerProfile.js";
import JobRequest from "../models/JobRequest.js";

export const getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		if (!user) return res.status(404).json({ message: "User not found" });

		res.json(user);
	} catch (err) {
		res.status(500).json({ message: "Profile fetching failed" });
	}
};

export const deleteAccount = async (req, res) => {
	const userId = req.user._id;

	try {
		// 1. Delete any worker profile
		await WorkerProfile.findOneAndDelete({ user: userId });

		// 2. Delete job requests where user is sender or receiver
		await JobRequest.deleteMany({
			$or: [{ user: userId }, { worker: userId }],
		});

		// 3. Delete the user
		await User.findByIdAndDelete(userId);

		res.json({ message: "Account and related data deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: "Failed to delete account" });
	}
};

export const updateUserProfile = async (req, res) => {
	const userId = req.user._id;
	const { name, phone, password, isWorker } = req.body;

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		// ✅ Update fields only if provided
		if (name) user.name = name;
		if (phone) user.phone = phone;
		if (!isWorker) {
			if (user.isWorker)
				return res
					.status(401)
					.json({ message: "Worker cannot become a user." });
		}
		if (isWorker) user.isWorker = isWorker;
		if (password) {
			const hashed = await bcrypt.hash(password, 10);
			user.password = hashed;
		}

		await user.save();
		res.json({ message: "Profile updated successfully", user });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Profile update failed" });
	}
};
