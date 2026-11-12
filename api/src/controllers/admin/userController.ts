import type { Request, Response, NextFunction } from "express";
import { userService } from "../../services/admin/userService.ts";
import { validationResult } from "express-validator";
import { errorResponse } from "../../utils/errorResponse.ts";
import { userValidator } from "../../middlewares/validators/admin/userValidator.ts";

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
    const { users } = await userService.getAllUsers();
    res.status(200).json({
      message: "All users retrieved successfully.",
      users,
      userId: req.userId,
    });
  },

  freezeUser: [
    userValidator.freezeUser,
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) {
        errorResponse(401, errors[0].msg);
      }
      const { email, status } = req.body;
      await userService.freezeUserByEmail(email, status);
      res.status(200).json({
        message: "Freeze user successfully.",
        userId: req.userId,
      });
    },
  ],
};
