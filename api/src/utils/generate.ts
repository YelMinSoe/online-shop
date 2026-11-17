import { randomBytes } from "crypto";

export const otpGenerator = () => {
  return (parseInt(randomBytes(3).toString("hex"), 16) % 900000) + 100000;
};

export const tokenGenerator = () => {
  return randomBytes(16).toString("hex");
};
export const codeGenerator = () => {
  return randomBytes(4).toString("hex").slice(0, 7).toUpperCase();
};
