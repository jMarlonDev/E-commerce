import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, first_name, last_name } = req.body;
      const result = await authService.register({ email, password, first_name, last_name });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refresh(refreshToken);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.body;
      const result = await authService.googleLogin(code);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
};
