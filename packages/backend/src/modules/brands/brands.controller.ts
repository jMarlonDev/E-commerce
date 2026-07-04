import type { Request, Response, NextFunction } from "express";
import { brandsService } from "./brands.service.js";

export const brandsController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const includeInactive = req.query.all === "true";
      const brands = await brandsService.findAll(includeInactive);
      res.status(200).json({ success: true, data: brands });
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const brand = await brandsService.findById(String(req.params.id));
      res.status(200).json({ success: true, data: brand });
    } catch (error) {
      next(error);
    }
  },

  async findBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const brand = await brandsService.findBySlug(String(req.params.slug));
      res.status(200).json({ success: true, data: brand });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const brand = await brandsService.create(req.body);
      res.status(201).json({ success: true, data: brand });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const brand = await brandsService.update(String(req.params.id), req.body);
      res.status(200).json({ success: true, data: brand });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await brandsService.delete(String(req.params.id));
      res.status(200).json({ success: true, data: { message: "Brand deleted" } });
    } catch (error) {
      next(error);
    }
  },
};
