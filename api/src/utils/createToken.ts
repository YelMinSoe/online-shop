import jwt from "jsonwebtoken";

export const createAccessToken = (id: number) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: 15 * 60,
  });
};

export const createRefreshToken = (id: number, email: string) => {
  return jwt.sign({ id, email }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "30d",
  });
};
