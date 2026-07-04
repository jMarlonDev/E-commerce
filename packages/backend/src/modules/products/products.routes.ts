import express from "express";
import { productsController } from "./products.controller.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/auth.js";
import { adminOnly } from "../../middleware/adminOnly.js";
import { createProductSchema, updateProductSchema } from "./products.validation.js";

const router = express.Router();

router.get("/featured", productsController.findFeatured);
router.get("/", productsController.findAll);
router.get("/slug/:slug", productsController.findBySlug);
router.get("/:id", productsController.findById);
router.post("/", authenticate, adminOnly, validate(createProductSchema), productsController.create);
router.put("/:id", authenticate, adminOnly, validate(updateProductSchema), productsController.update);
router.delete("/:id", authenticate, adminOnly, productsController.delete);

export default router;
