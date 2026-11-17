import express from "express";
import { addressController } from "../../controllers/address/addressController.ts";

const router = express.Router();

router.post("/create-new-address", ...addressController.createNewAddress);
router.get("/get-address", addressController.getAddress);
router.patch("/modify-address", ...addressController.updateAddress);

export default router;
