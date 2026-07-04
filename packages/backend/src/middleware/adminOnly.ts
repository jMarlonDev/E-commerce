import type { Request, Response, NextFunction } from "express";

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    res.status(403).json({ success: false, error: { message: "Admin access required" } });
    return;
  }
  next();
}
