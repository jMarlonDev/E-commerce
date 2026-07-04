import type { Request, Response, NextFunction } from "express";
import { productsService } from "./products.service.js";

export const productsController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        search: req.query.search as string | undefined,
        category_id: req.query.category_id as string | undefined,
        brand_id: req.query.brand_id as string | undefined,
        min_price: req.query.min_price ? Number(req.query.min_price) : undefined,
        max_price: req.query.max_price ? Number(req.query.max_price) : undefined,
        is_featured: req.query.is_featured === "true" ? true : req.query.is_featured === "false" ? false : undefined,
        is_active: req.query.is_active === "true" ? true : req.query.is_active === "false" ? false : undefined,
        sort: req.query.sort as string | undefined,
        order: req.query.order as "asc" | "desc" | undefined,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      };
      const result = await productsService.findAll(filters);
      res.status(200).json({ success: true, data: result.products, meta: result.meta });
    } catch (error) {
      next(error);
    }
  },

  async findFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 8;
      const products = await productsService.findFeatured(limit);
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productsService.findById(String(req.params.id));
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  async findBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productsService.findBySlug(String(req.params.slug));
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productsService.create(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productsService.update(String(req.params.id), req.body);
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await productsService.delete(String(req.params.id));
      res.status(200).json({ success: true, data: { message: "Product deleted" } });
    } catch (error) {
      next(error);
    }
  },
};
