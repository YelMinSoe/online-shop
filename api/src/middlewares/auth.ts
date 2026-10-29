import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/errorResponse.ts";
import jwt from "jsonwebtoken";

import { createAccessToken, createRefreshToken } from "../utils/createToken.ts";
import { setCookie } from "../utils/setCookie.ts";
// Types
interface CustomRequest extends Request {
  userId?: number;
}

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;
  const accessToken = req.cookies ? req.cookies.accessToken : null;

  if (!refreshToken) {
    errorResponse(401, "Refresh token is missing");
  }
  const generateNewTokens = async () => {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
      ) as { id: number; email: string };
      if (isNaN(decoded.id)) {
        errorResponse(401, "Invalid refresh token");
      }
      const newAccessToken = createAccessToken(decoded.id);
      const newRefreshToken = createRefreshToken(decoded.id, decoded.email);
      res.cookie("accessToken", newAccessToken, setCookie(15 * 60 * 1000)); // 15 minutes
      res.cookie(
        "refreshToken",
        newRefreshToken,
        setCookie(30 * 24 * 60 * 60 * 1000),
      ); // 30 days
      req.userId = decoded.id;
      next();
    } catch (error) {
      errorResponse(401, "Invalid refresh token");
    }
  };
  if (!accessToken) {
    generateNewTokens();
  } else {
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
        id: number;
      };
      if (isNaN(decoded.id)) {
        errorResponse(401, "Invalid access token");
      }
      req.userId = decoded.id;
      next();
    } catch (error) {
      errorResponse(401, "Invalid access token");
    }
  }
};
