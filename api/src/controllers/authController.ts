// Package imports
import type { Request, Response, NextFunction } from "express";

// Local imports

export const authControllers = {
  // Register is started from here
  register: (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "This is register" });
  },
  // Verify Otp is started from here
  verifyOtp: (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "This is verify otp" });
  },
  // Confirm Password is started from here
  confirmPassword: (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "This is confirm password" });
  },
  //Login is started from here
  login: (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "This is login" });
  },
};
