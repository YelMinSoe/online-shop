import { errorResponse } from "./errorResponse.ts";

export const checkUserExist = (user: any) => {
  if (user) {
    errorResponse(400, "This email have already been registered.");
  }
};

// Check otp row
export const checkOtpRowExist = (otpRow: any) => {
  if (!otpRow) {
    errorResponse(404, "OTP not found.");
  }
};

export const checkRequestCountIfSameDate = (
  isSameDate: boolean,
  requestedCount: number,
) => {
  if (isSameDate && requestedCount >= 3) {
    errorResponse(
      401,
      "Oop,You have reached the maximum number of OTP requests.Please try again later.",
    );
  }
};
