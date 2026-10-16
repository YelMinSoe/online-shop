import type { CookieOptions } from "express";
export const setCookie = (maxAge: number): CookieOptions => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge,
  };
};
