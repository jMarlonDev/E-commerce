import express from "express";
import { brandsController } from "./brands.controller.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/auth.js";
import { adminOnly } from "../../middleware/adminOnly.js";
import { createBrandSchema, updateBrandSchema } from "./brands.validation.js";

const router = express.Router();

router.get("/", brandsController.findAll);
router.get("/slug/:slug", brandsController.findBySlug);
router.get("/:id", brandsController.findById);
router.post("/", authenticate, adminOnly, validate(createBrandSchema), brandsController.create);
router.put("/:id", authenticate, adminOnly, validate(updateBrandSchema), brandsController.update);
router.delete("/:id", authenticate, adminOnly, brandsController.delete);

export default router;
