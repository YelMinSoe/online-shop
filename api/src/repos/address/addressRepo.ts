import { prisma } from "../../lib/prisma.ts";

export const addressRepo = {
  // Create new address
  createNewAddress: async (addressData: any) => {
    return await prisma.address.create({
      data: addressData,
    });
  },
  //   Get address
  getAddress: async (userId: number) => {
    return await prisma.address.findUnique({ where: { userId } });
  },
  //   update address
  modifyAddress: async (userId: number, addressData: any) => {
    return await prisma.address.update({
      where: { userId },
      data: addressData,
    });
  },
  // find Address by userId
  findAddressByUserId: async (userId: number) => {
    return await prisma.address.findUnique({ where: { userId } });
  },
};
