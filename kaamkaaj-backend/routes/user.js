import express from "express";
import {
	updateUserProfile,
	deleteAccount,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js"; // your JWT middleware

const router = express.Router();

router.put("/edit", protect, updateUserProfile);

router.delete("/delete", protect, deleteAccount);

export default router;
