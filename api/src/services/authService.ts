// Package imports
import bcrypt from "bcrypt";

// Local imports
import {
  createOtp,
  getOtpRowByEmail,
  getUserByEmail,
  updateOtp,
} from "../repos/authRepo.ts";
import { otpGenerator, tokenGenerator } from "../utils/generate.ts";
import { sendEmail } from "../utils/sendEmail.ts";
import { checkRequestCountIfSameDate, checkUserExist } from "../utils/auth.ts";
import { errorResponse } from "../utils/errorResponse.ts";

export const authServices = {
  register: async (email: string) => {
    // otp is here
    const otp = otpGenerator();
    // remember is here
    const rememberToken = tokenGenerator();
    // user is here and check user existing
    const user = await getUserByEmail(email);
    checkUserExist(user);

    // OTP hashing
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp.toString(), salt);
    // OTP Data
    const otpData = { email, otp: hashedOtp, rememberToken };
    // check otp row (otp record)
    const otpRow = await getOtpRowByEmail(email);
    if (!otpRow) {
      await createOtp({ ...otpData, requestedCount: 1 });
    } else {
      //check last request and today
      const isSameDate =
        new Date(otpRow.updatedAt).toLocaleDateString() ===
        new Date().toLocaleDateString();

      //   check request count and if request count are reached 3 times, it will throw error.
      checkRequestCountIfSameDate(isSameDate, otpRow.requestedCount);
      // updating OTP row (otp record), if it have already been had
      await updateOtp(otpRow.id, {
        ...otpData,
        requestedCount: { increment: 1 },
      });
    }
    // Sending Email is here
    await sendEmail({ to: email, viewFileName: "email", otp });

    return { rememberToken };
  },
};
