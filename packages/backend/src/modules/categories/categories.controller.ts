import type { Request, Response, NextFunction } from "express";
import { categoriesService } from "./categories.service.js";

export const categoriesController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const includeInactive = req.query.all === "true";
      const categories = await categoriesService.findAll(includeInactive);
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoriesService.findById(String(req.params.id));
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  async findBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoriesService.findBySlug(String(req.params.slug));
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoriesService.create(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoriesService.update(String(req.params.id), req.body);
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await categoriesService.delete(String(req.params.id));
      res.status(200).json({ success: true, data: { message: "Category deleted" } });
    } catch (error) {
      next(error);
    }
  },
};
