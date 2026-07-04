import express from "express";
import { categoriesController } from "./categories.controller.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/auth.js";
import { adminOnly } from "../../middleware/adminOnly.js";
import { createCategorySchema, updateCategorySchema } from "./categories.validation.js";

const router = express.Router();

router.get("/", categoriesController.findAll);
router.get("/slug/:slug", categoriesController.findBySlug);
router.get("/:id", categoriesController.findById);
router.post("/", authenticate, adminOnly, validate(createCategorySchema), categoriesController.create);
router.put("/:id", authenticate, adminOnly, validate(updateCategorySchema), categoriesController.update);
router.delete("/:id", authenticate, adminOnly, categoriesController.delete);

export default router;
