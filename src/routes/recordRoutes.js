import express from "express";
import { getRecords, createRecord, updateRecord, deleteRecord } from "../controllers/recordController.js";
import { authenticate, authorizeRoles, updateRecord } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getRecords);
router.post("/", authenticate, authorizeRoles("ADMIN"), createRecord);
router.patch("/:id", authenticate, authorizeRoles("ADMIN"), updateRecord);
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteRecord);

export default router;