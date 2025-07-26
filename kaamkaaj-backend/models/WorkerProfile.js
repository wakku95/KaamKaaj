import mongoose from "mongoose";

const workerProfileSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		skills: [String], // e.g., ["electrician", "plumber"]
		experience: String, // e.g., "3 years"
		rate: Number, // e.g., 500 (PKR)
		serviceRadius: Number, // in kilometers
		location: {
			type: { type: String, enum: ["Point"], default: "Point" },
			coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
		},
		locationName: { type: String, default: "Unknown" },

		// NEW: Credits system (for future monetization)
		credits: {
			type: Number,
			default: 5, // 5 free points for now
		},
		canAccessJobs: {
			type: Boolean,
			default: true, // For now, allow access even if credits = 0
		},
		isAvailable: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

workerProfileSchema.index({ location: "2dsphere" });

export default mongoose.model("WorkerProfile", workerProfileSchema);
