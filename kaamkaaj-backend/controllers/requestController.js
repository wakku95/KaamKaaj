import JobRequest from "../models/JobRequest.js";
import User from "../models/User.js";
import { sendStatusEmail } from "../utils/emailService.js";

export const sendJobRequest = async (req, res) => {
	const { workerId } = req.params;
	const { message } = req.body;

	try {
		if (!req.user.isEmailVerified) {
			return res
				.status(403)
				.json({ message: "Please verify your email first." });
		}

		// prevent self-contact
		if (workerId === req.user._id.toString()) {
			return res
				.status(400)
				.json({ message: "You cannot send request to yourself." });
		}

		// ensure worker exists
		const worker = await User.findById(workerId);
		if (!worker || !worker.isWorker) {
			return res.status(404).json({ message: "Worker not found" });
		}

		// prevent duplicate requests (optional)
		const existing = await JobRequest.findOne({
			user: req.user._id,
			worker: workerId,
			status: "pending",
		});

		if (existing) {
			return res
				.status(400)
				.json({ message: "You already sent a request to this worker." });
		}

		// 5️⃣ Get worker profile and update credits
		const workerProfile = await WorkerProfile.findOne({ user: workerId });
		if (workerProfile) {
			if (workerProfile.credits > 0) {
				workerProfile.credits -= 1;
				await workerProfile.save();
			}
			// ✅ You still allow request even if credits = 0
		}

		// create new request
		const request = await JobRequest.create({
			user: req.user._id,
			worker: workerId,
			message,
		});

		res.status(201).json({ message: "Request sent successfully", request });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to send request" });
	}
};

export const getUserRequests = async (req, res) => {
	try {
		const requests = await JobRequest.find({ user: req.user._id })
			.populate("worker", "name email") // populate worker info
			.sort({ createdAt: -1 }); // newest first

		res.json(requests);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to fetch your requests" });
	}
};

export const getWorkerRequests = async (req, res) => {
	try {
		// Ensure only workers can access this
		if (!req.user.isWorker) {
			return res
				.status(403)
				.json({ message: "Only workers can view incoming requests." });
		}

		const requests = await JobRequest.find({ worker: req.user._id })
			.populate("user", "name email") // populate user info (who sent the request)
			.sort({ createdAt: -1 }); // newest first

		res.json(requests);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to fetch requests." });
	}
};

export const updateRequestStatus = async (req, res) => {
	const { id } = req.params;
	const { status } = req.body;

	// Validate status
	if (!["accepted", "rejected"].includes(status)) {
		return res
			.status(400)
			.json({ message: "Invalid status. Must be 'accepted' or 'rejected'." });
	}

	try {
		const request = await JobRequest.findById(id);
		if (request.status !== "pending") {
			return res.status(400).json({
				message: `You cannot change status once it is already ${request.status}.`,
			});
		}
		if (!request) {
			return res.status(404).json({ message: "Request not found." });
		}

		// Ensure only the assigned worker can update it
		if (request.worker.toString() !== req.user._id.toString()) {
			return res
				.status(403)
				.json({ message: "Not authorized to update this request." });
		}

		request.status = status;
		await request.save();
		// ✅ Notify user via email
		const user = await User.findById(request.user).select("name email phone");
		let extraInfo = {};
		if (status === "accepted") {
			extraInfo.contactInfo = {
				name: user.name,
				email: user.email,
				phone: user.phone, // ✅ Include phone after acceptance
			};
		}

		await sendStatusEmail(user.email, status);
		res.json({ message: `Request ${status}`, request, ...extraInfo });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Failed to update request status." });
	}
};
