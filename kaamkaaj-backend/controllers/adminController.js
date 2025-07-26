import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import WorkerProfile from "../models/WorkerProfile.js";
import JobRequest from "../models/JobRequest.js";

export const deleteWorkerProfileById = async (req, res) => {
	const workerProfileId = req.params.id;

	try {
		const deleted = await WorkerProfile.findByIdAndDelete(workerProfileId);
		if (!deleted) {
			return res.status(404).json({ message: "Worker profile not found" });
		}
		res.json({ message: "Worker profile deleted successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to delete worker profile" });
	}
};

export const deleteUserById = async (req, res) => {
	const userId = req.params.id;

	try {
		await WorkerProfile.findOneAndDelete({ user: userId });
		await JobRequest.deleteMany({
			$or: [{ user: userId }, { worker: userId }],
		});
		await User.findByIdAndDelete(userId);

		res.json({ message: "User and related data deleted successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to delete user" });
	}
};

export const getAllRequests = async (req, res) => {
	const { status } = req.query;

	const filter = status ? { status } : {};

	try {
		const requests = await JobRequest.find(filter)
			.populate("user", "name email phone")
			.populate("worker", "name email phone");

		res.json(requests);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to fetch job requests" });
	}
};

// 📄 Get all workers with user info
export const getAllWorkers = async (req, res) => {
	const { skill, minRate, maxRate } = req.query;

	const filter = {};

	if (skill) {
		filter.skills = { $in: [skill] };
	}

	if (minRate || maxRate) {
		filter.rate = {};
		if (minRate) filter.rate.$gte = parseFloat(minRate);
		if (maxRate) filter.rate.$lte = parseFloat(maxRate);
	}
	try {
		const workers = await WorkerProfile.find(filter).populate(
			"user",
			"name email phone location"
		);
		res.json(workers);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to fetch workers" });
	}
};

// 📄 Get all users
export const getAllUsers = async (req, res) => {
	const { search } = req.query;

	const query = search
		? {
				$or: [
					{ name: { $regex: search, $options: "i" } },
					{ email: { $regex: search, $options: "i" } },
					{ phone: { $regex: search, $options: "i" } },
				],
		  }
		: {};
	try {
		const users = await User.find(query).select("-password -otp -otpExpires"); // hide sensitive fields
		res.json(users);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to fetch users" });
	}
};

export const adminLogin = async (req, res) => {
	const { email, password } = req.body;

	try {
		const admin = await Admin.findOne({ email });
		if (!admin) return res.status(404).json({ message: "Admin not found" });

		const isMatch = await bcrypt.compare(password, admin.password);
		if (!isMatch)
			return res.status(401).json({ message: "Invalid credentials" });

		const token = jwt.sign(
			{ adminId: admin._id, role: "admin" },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		res.json({ token });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Login failed" });
	}
};
