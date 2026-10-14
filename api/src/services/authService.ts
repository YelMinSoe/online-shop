// Package imports
import bcrypt from "bcrypt";
import moment from "moment";

// Local imports
import {
  createOtp,
  getOtpRowByEmail,
  getUserByEmail,
  updateOtp,
} from "../repos/authRepo.ts";
import { otpGenerator, tokenGenerator } from "../utils/generate.ts";
import { sendEmail } from "../utils/sendEmail.ts";
import {
  checkOtpRowExist,
  checkRequestCountIfSameDate,
  checkUserExist,
} from "../utils/auth.ts";
import { errorResponse } from "../utils/errorResponse.ts";

export const authServices = {
  // Register Service / request otp
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
    // await sendEmail({ to: email, viewFileName: "email", otp });

    // Return values are here
    return { rememberToken, otp };
  },
  /* Veriry OTP is started from here */
  verifyOtp: async (email: string, otp: string, token: string) => {
    // user is here and check user existing
    const user = await getUserByEmail(email);
    checkUserExist(user);

    // Check otp record exist or not
    const otpRow = await getOtpRowByEmail(email);
    checkOtpRowExist(otpRow);

    // Check is it same date?
    const isSameDate =
      new Date(otpRow!.updatedAt).toLocaleDateString() ===
      new Date().toLocaleDateString();

    //   if it 5 times errors in the same day, throw error
    if (otpRow!.errorCount === 5 && isSameDate) {
      errorResponse(
        401,
        "You have reached the maximum number of OTP attempts.Please try again later.",
      );
    }

    // Check remember token that's got from otp request and token from request body (for security)
    if (otpRow?.rememberToken !== token) {
      await updateOtp(otpRow!.id, { errorCount: 5 });
      errorResponse(401, "This is attacked request.");
    }

    // Check otp is expired or not
    const isExpired = moment().diff(otpRow?.updatedAt, "minutes") > 5;
    if (isExpired) {
      errorResponse(401, "OTP is expired");
    }
    // Compare otp
    const isMatched = await bcrypt.compare(otp, otpRow!.otp);
    // when password is wrong, check in the same day?
    if (!isMatched) {
      await updateOtp(otpRow!.id, {
        errorCount: isSameDate ? { increment: 1 } : 1,
      });
      errorResponse(401, "Wrong OTP.Please try again");
    }
    const verifyToken = tokenGenerator();
    await updateOtp(otpRow!.id, { verifyToken, errorCount: 0 });
    // Return values
    return { verifyToken };
  },
};
