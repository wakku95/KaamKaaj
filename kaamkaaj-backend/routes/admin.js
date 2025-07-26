import express from "express";
import {
	adminLogin,
	getAllUsers,
	getAllWorkers,
	getAllRequests,
	deleteUserById,
	deleteWorkerProfileById,
} from "../controllers/adminController.js";
import { verifyAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/users", verifyAdmin, getAllUsers);
router.get("/workers", verifyAdmin, getAllWorkers);
router.get("/requests", verifyAdmin, getAllRequests);

router.delete("/users/:id", verifyAdmin, deleteUserById);
router.delete("/workers/:id", verifyAdmin, deleteWorkerProfileById);
export default router;
