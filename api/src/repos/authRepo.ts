import { prisma } from "../lib/prisma.ts";

// Create OTP
export const createOtp = async (otpData: any) => {
  return prisma.otp.create({
    data: otpData,
  });
};
// Update OTP
export const updateOtp = async (id: number, otpData: any) => {
  return prisma.otp.update({
    where: { id },
    data: otpData,
  });
};

//  Get user by Email
export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

//  Get Otp row by email
export const getOtpRowByEmail = async (email: string) => {
  return prisma.otp.findUnique({ where: { email } });
};

// Create user
export const createUser = async (userData: any) => {
  return prisma.user.create({
    data: userData,
  });
};

// Update user
export const updateUser = async (id: number, userData: any) => {
  return prisma.user.update({
    where: { id },
    data: userData,
  });
};
