import type { Request, Response, NextFunction } from "express";

// Types
interface CustomRequest extends Request {
  userId?: number;
}
export const userController = {
  getAllUsers: async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    // Logic to get all users from the database
    res.status(200).json({
      message: "All users retrieved successfully.",
      userId: req.userId,
    });
  },
};
