import mongoose from "mongoose";
import { isValidPhoneNumber } from "libphonenumber-js";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		phone: {
			type: String,
			required: true,
			validate: {
				validator: function (v) {
					return isValidPhoneNumber(v); // Accepts E.164 format like +923001234567
				},
				message: (props) => `${props.value} is not a valid phone number!`,
			},
		},
		isWorker: { type: Boolean, default: false },
		otpCode: String,
		otpExpires: Date,
		isEmailVerified: { type: Boolean, default: false },
		location: {
			type: { type: String, enum: ["Point"], default: "Point" },
			coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
		},
	},
	{ timestamps: true }
);

userSchema.index({ location: "2dsphere" });

export default mongoose.model("User", userSchema);
