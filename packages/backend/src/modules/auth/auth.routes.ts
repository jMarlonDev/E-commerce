import express from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { registerSchema, loginSchema, refreshTokenSchema, googleLoginSchema } from "./auth.validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", validate(refreshTokenSchema), authController.refresh);
router.post("/google", validate(googleLoginSchema), authController.googleLogin);

export default router;
