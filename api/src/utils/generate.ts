import { randomBytes } from "crypto";

export const otpGenerator = () => {
  return (parseInt(randomBytes(3).toString("hex"), 16) % 900000) + 100000;
};

export const tokenGenerator = () => {
  return randomBytes(16).toString("hex");
};
