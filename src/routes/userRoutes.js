import express from "express";
import { getUsers, updateUserRole, updateUserStatus } from "../controllers/userController.js";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, authorizeRoles("ADMIN"), getUsers);
router.patch("/:id/role", authenticate, authorizeRoles("ADMIN"), updateUserRole);
router.patch("/:id/status", authenticate, authorizeRoles("ADMIN"), updateUserStatus);

export default router;