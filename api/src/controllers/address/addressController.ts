import type { Request, Response, NextFunction } from "express";
import { addressService } from "../../services/address/addressService.ts";
import { addressValidator } from "../../middlewares/validators/address/addressValidator.ts";
import { validationResult } from "express-validator";
import { errorResponse } from "../../utils/errorResponse.ts";

//Types
interface CustomRequest extends Request {
  userId?: number;
}
export const addressController = {
  // create new address
  createNewAddress: [
    addressValidator.createNewAddress,
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) {
        errorResponse(401, errors[0].msg);
      }
      const { name, phone, postalCode, address } = req.body;
      await addressService.createNewAddress({
        name,
        phone,
        postalCode,
        address,
        userId: Number(req.userId),
      });
      res.status(201).json({ message: "Created new address successfully" });
    },
  ],
  //  Get address
  getAddress: async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { address } = await addressService.getAddress(Number(req.userId));
    res.status(200).json({ address });
  },
  //   Update address
  updateAddress: [
    addressValidator.updateAddress,
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) {
        errorResponse(401, errors[0].msg);
      }
      const { name, phone, postalCode, address } = req.body;
      const { newAddress } = await addressService.updateAddress(
        Number(req.userId),
        { name, phone, postalCode, address },
      );
      res
        .status(201)
        .json({ message: "Updated address successfully", address: newAddress });
    },
  ],
};
