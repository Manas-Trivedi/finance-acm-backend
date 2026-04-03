import express from "express";
import { getRecords, createRecord } from "../controllers/recordController.js";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getRecords);
router.post("/", authenticate, authorizeRoles("ADMIN"), createRecord);

export default router;