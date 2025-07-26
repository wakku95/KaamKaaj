import express from "express";
import {
	createOrUpdateWorkerProfile,
	getMyWorkerProfile,
	searchWorkersNearby,
	toggleAvailability,
} from "../controllers/workerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/profile", protect, createOrUpdateWorkerProfile);
router.get("/profile", protect, getMyWorkerProfile);
router.get("/search", searchWorkersNearby);
router.patch("/toggle-availability", protect, toggleAvailability);

export default router;
