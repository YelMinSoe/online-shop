// Package imports
import bcrypt from "bcrypt";
import moment from "moment";

// Local imports
import {
  createOtp,
  createUser,
  getOtpRowByEmail,
  getUserByEmail,
  getUserById,
  updateOtp,
  updateUser,
} from "../repos/authRepo.ts";
import { otpGenerator, tokenGenerator } from "../utils/generate.ts";
import { sendEmail } from "../utils/sendEmail.ts";
import {
  checkOtpRowExist,
  checkRequestCountIfSameDate,
  checkUserExist,
} from "../utils/auth.ts";
import { errorResponse } from "../utils/errorResponse.ts";
import { accessToken, newRefreshToken } from "../utils/createToken.ts";
import jwt from "jsonwebtoken";

export const authServices = {
  // Register Service / request otp is started from here
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
        new Date(otpRow!.updatedAt).toLocaleDateString() ===
        new Date().toLocaleDateString();

      //   check request count and if request count are reached 3 times, it will throw error.
      checkRequestCountIfSameDate(isSameDate, otpRow!.requestedCount);

      // updating OTP row (otp record), if it have already been had
      await updateOtp(otpRow!.id, {
        ...otpData,
        errorCount: 0,
        requestedCount: isSameDate ? { increment: 1 } : 1,
      });
    }

    // Sending Email is here
    // await sendEmail({ to: email, viewFileName: "email", otp });

    // Return values are here
    return { rememberToken, otp };
  },
  /* 
  Veriry OTP is started from here
   */
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
  /* 
  Confirm password is started from here 
  */
  confrimPassword: async (email: string, password: string, token: string) => {
    // user is here and check user existing
    const user = await getUserByEmail(email);
    checkUserExist(user);

    // Check otp record exist or not
    const otpRow = await getOtpRowByEmail(email);
    checkOtpRowExist(otpRow);

    if (otpRow?.errorCount === 5) {
      errorResponse(
        401,
        "You have reached the maximum number of OTP attempts.Please try again later.",
      );
    }

    // check verify token that's got from verify and token from request body (for security)
    if (otpRow?.verifyToken !== token) {
      await updateOtp(otpRow!.id, { errorCount: 5 });
      errorResponse(401, "This is attacked request.");
    }

    // Check it is  expired
    const isExpired = moment().diff(otpRow?.updatedAt, "minutes") > 10;
    if (isExpired) {
      errorResponse(401, "This service is expired. Please try again.");
    }
    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const refreshToken = "I will replace with jwt refresh token";

    // Create user
    const newUser = await createUser({
      email,
      password: hashedPassword,
      refreshToken,
    });

    // JWT tokens
    const access = accessToken(newUser.id);
    const refresh = newRefreshToken(newUser.id, newUser.email);

    // Update user
    await updateUser(newUser.id, { refreshToken: refresh });

    return { id: newUser.id, accessToken: access, refreshToken: refresh };
  },
  /* 
  Login is started from here 
  */
  login: async (email: string, password: string) => {
    // Check user existing
    const user = await getUserByEmail(email);
    if (!user) errorResponse(404, "User not Found");

    // Check user's status freeze or not
    if (user?.status === "FREEZE") {
      errorResponse(
        401,
        "Your account has been frozen. Please contact support.",
      );
    }

    const isMatched = await bcrypt.compare(password, user!.password);
    const isSameDate =
      new Date(user!.updatedAt).toLocaleDateString() ===
      new Date().toLocaleDateString();
    if (!isMatched) {
      if (isSameDate && user!.loginErrorCount >= 3) {
        await updateUser(user!.id, { status: "FREEZE" });
        errorResponse(
          401,
          "Your account has been frozen due to multiple failed login attempts. Please contact support.",
        );
      }
      await updateUser(user!.id, {
        loginErrorCount: isSameDate ? { increment: 1 } : 1,
      });
      errorResponse(401, "Invalid password. Please try again.");
    }

    const access = accessToken(user!.id);
    const refresh = newRefreshToken(user!.id, user!.email);

    await updateUser(user!.id, { refreshToken: refresh, loginErrorCount: 0 });

    return { id: user?.id, accessToken: access, refreshToken: refresh };
  },
  /* 
  Login is started from here 
  */
  logout: async (refreshToken: string) => {
    // Check refresh token
    if (!refreshToken) {
      errorResponse(400, "You are not unauthenticated user");
    }
    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
        id: number;
        email: string;
      };
    } catch (error) {
      errorResponse(400, "You are not unauthenticated user");
    }
    // Check id is number or not {this is option for security}
    if (isNaN(decoded!.id)) {
      errorResponse(400, "You are not unauthenticated user");
    }

    // Check user exist or not
    const user = await getUserById(decoded!.id);
    if (!user) {
      errorResponse(401, "This email has not been registered.");
    }

    // Check refresh token is same or not
    if (user?.email !== decoded!.email) {
      errorResponse(401, "This email has not been registered.");
    }

    // Update user table with refresh token rotation
    await updateUser(user!.id, { refreshToken: tokenGenerator() });
  },
  /* 
  Forget password is started from here 
  */
  forgetPassword: async (email: string) => {
    const user = await getUserByEmail(email);
    const otpRow = await getOtpRowByEmail(email);

    if (!user || email !== otpRow?.email) {
      errorResponse(401, "This email has not been registered");
    }

    // check last request and today
    const isSameDate =
      new Date(otpRow!.updatedAt).toLocaleDateString() ===
      new Date().toLocaleDateString();

    if (otpRow?.requestedCount === 5) {
      errorResponse(
        401,
        "You have reached the maximum number of OTP requests for today. Please try again tomorrow.",
      );
    }
    if (otpRow!.requestedCount < 5) {
      await updateOtp(otpRow!.id, {
        requestedCount: isSameDate ? { increment: 1 } : 1,
      });
    }

    const otp = otpGenerator();
    const rememberToken = tokenGenerator();

    const salt = await bcrypt.genSalt(10);
    const hashOtp = await bcrypt.hash(otp.toString(), salt);

    await updateOtp(otpRow!.id, { otp: hashOtp, rememberToken });

    // Sending Email is here
    // await sendEmail({ to: email, viewFileName: "email", otp });

    return { otp, rememberToken };
  },

  /* 
  Verify otp for forget password is started from here 
  */
  verifyOtpForForgetPassword: async (
    email: string,
    otp: string,
    token: string,
  ) => {
    const user = await getUserByEmail(email);
    const otpRow = await getOtpRowByEmail(email);
    if (!user || email !== otpRow?.email) {
      errorResponse(401, "This email has not been registered");
    }

    if (otpRow?.errorCount === 5) {
      errorResponse(
        401,
        "You have reached the maximum number of OTP attempts.Please try again later.",
      );
    }
    if (otpRow!.rememberToken !== token) {
      await updateOtp(otpRow!.id, { errorCount: 5 });
      errorResponse(
        401,
        "You have reached the maximum number of OTP attempts.Please try again later.",
      );
    }
    // check last request and today
    const isSameDate =
      new Date(otpRow!.updatedAt).toLocaleDateString() ===
      new Date().toLocaleDateString();

    if (otpRow!.errorCount > 5) {
      await updateOtp(otpRow!.id, {
        errorCount: isSameDate ? { increment: 1 } : 1,
      });
    }

    const isExpired = moment().diff(otpRow?.updatedAt, "minutes") > 5;
    if (isExpired) {
      errorResponse(401, "OTP is expired");
    }

    const isMatched = await bcrypt.compare(otp, otpRow!.otp);
    if (!isMatched) {
      await updateOtp(otpRow!.id, {
        errorCount: isSameDate ? { increment: 1 } : 1,
      });
      errorResponse(401, "Wrong OTP.Please try again");
    }

    const verifyToken = tokenGenerator();
    await updateOtp(otpRow!.id, { verifyToken, errorCount: 0 });

    return { verifyToken };
  },
  resetPassword: async (email: string, password: string, token: string) => {
    const user = await getUserByEmail(email);
    const otpRow = await getOtpRowByEmail(email);

    if (!user || email !== otpRow?.email) {
      errorResponse(401, "This email has not been registered");
    }

    if (otpRow?.verifyToken !== token) {
      errorResponse(401, "This is attacked request.");
    }
    if (otpRow?.errorCount === 5) {
      errorResponse(
        401,
        "You have reached the maximum number of OTP attempts.Please try again later.",
      );
    }

    const isExpired = moment().diff(otpRow?.updatedAt, "minutes") > 10;
    if (isExpired) {
      errorResponse(401, "This service is expired. Please try again.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // JWT tokens
    const access = accessToken(user!.id);
    const refresh = newRefreshToken(user!.id, user!.email);

    await updateUser(user!.id, {
      password: hashedPassword,
      refreshToken: refresh,
    });

    return { id: user!.id, accessToken: access, refreshToken: refresh };
  },
};
