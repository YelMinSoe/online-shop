import { addressRepo } from "../../repos/address/addressRepo.ts";
import { errorResponse } from "../../utils/errorResponse.ts";

// Types
type AddressType = {
  name: string;
  phone: string;
  postalCode: string;
  address: string;
  userId: number;
};
type updateAddressType = {
  name?: string;
  phone?: string;
  postalCode?: string;
  address?: string;
};

export const addressService = {
  // Create new address

  createNewAddress: async ({
    name,
    phone,
    postalCode,
    address,
    userId,
  }: AddressType) => {
    const adrs = await addressRepo.findAddressByUserId(userId);
    if (adrs) {
      errorResponse(401, "Address already existsz");
    }
    await addressRepo.createNewAddress({
      name,
      phone,
      postalCode,
      address,
      userId,
    });
  },
  //   Get address
  getAddress: async (userId: number) => {
    const address = await addressRepo.getAddress(userId);
    return { address };
  },
  //   Update address
  updateAddress: async (
    userId: number,
    { name, phone, postalCode, address }: updateAddressType,
  ) => {
    const adrs = await addressRepo.findAddressByUserId(userId);
    if (!adrs) errorResponse(404, "Address not found");
    const newAddress = await addressRepo.modifyAddress(userId, {
      name,
      phone,
      postalCode,
      address,
    });

    return { newAddress };
  },
};
