import {
  findAllUsers,
  findOneUserByEmail,
  freezeUserByEmail,
} from "../../repos/admin/userRepo.ts";
import { errorResponse } from "../../utils/errorResponse.ts";

export const userService = {
  getAllUsers: async () => {
    const users = await findAllUsers();
    return { users };
  },
  freezeUserByEmail: async (email: string, status: "ACTIVE" | "FREEZE") => {
    return await freezeUserByEmail(email, status);
  },
};
