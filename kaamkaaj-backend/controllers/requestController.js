import JobRequest from "../models/JobRequest.js";
import User from "../models/User.js";

export const sendJobRequest = async (req, res) => {
	const { workerId } = req.params;
	const { message } = req.body;

	try {
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
