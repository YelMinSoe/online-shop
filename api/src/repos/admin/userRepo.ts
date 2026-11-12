import { prisma } from "../../lib/prisma.ts";

// Get all users

export const findAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      status: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// find one user by email
export const findOneUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

// Freeze user by email
export const freezeUserByEmail = async (
  email: string,
  status: "ACTIVE" | "FREEZE",
) => {
  return await prisma.user.update({
    where: { email },
    data: { status },
  });
};
//
