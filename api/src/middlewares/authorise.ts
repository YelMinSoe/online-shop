import type { Request, Response, NextFunction } from "express";
import { getUserById } from "../repos/authRepo.ts";

// Types
interface CustomRequest extends Request {
  userId?: number;
  user?: any;
}
export const authorise = (permission: boolean, role: string) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const result = user.role.includes(role);
    if (permission && !result) {
      return res.status(403).json({ message: "This action is not allowed" });
    }
    if (!permission && result) {
      return res.status(403).json({ message: "This action is not allowed" });
    }
    req.user = user;
    next();
  };
};
