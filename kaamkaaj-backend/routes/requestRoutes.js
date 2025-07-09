import express from "express";
import {
	sendJobRequest,
	getUserRequests,
	getWorkerRequests,
	updateRequestStatus,
} from "../controllers/requestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/connect/:workerId", protect, sendJobRequest);

router.get("/user/requests", protect, getUserRequests);

router.get("/worker/requests", protect, getWorkerRequests);

router.put("/request/:id/status", protect, updateRequestStatus);

export default router;
