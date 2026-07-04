import type { Request, Response, NextFunction } from "express";
import { usersService } from "./users.service.js";

export const usersController = {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await usersService.getProfile(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await usersService.updateProfile(userId, req.body);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },
};
