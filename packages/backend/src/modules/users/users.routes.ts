import express from "express";
import { usersController } from "./users.controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

router.get("/me", authenticate, usersController.getProfile);
router.put("/me", authenticate, usersController.updateProfile);

export default router;
