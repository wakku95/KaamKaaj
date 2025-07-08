import express from "express";
import {
	sendJobRequest,
	getUserRequests,
} from "../controllers/requestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/connect/:workerId", protect, sendJobRequest);

router.get("/user/requests", protect, getUserRequests);

export default router;
