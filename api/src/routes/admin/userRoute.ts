import express from "express";
import { userController } from "../../controllers/admin/userController.ts";

const router = express.Router();

router.get("/get-all-users", userController.getAllUsers);
router.patch("/freeze-user", ...userController.freezeUser);

export default router;
