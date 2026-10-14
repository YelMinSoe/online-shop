import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "node:path";
import { errorResponse } from "./errorResponse.ts";

export const sendEmail = async ({
  to,
  viewFileName,
  otp,
}: {
  to: string;
  viewFileName: string;
  otp: number;
}) => {
  try {
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "16053cc180ed01",
        pass: "2d845739fcbcc7",
      },
    });

    const dataString = await ejs.renderFile(
      path.join(process.cwd(), "src", "views", `${viewFileName}.ejs`),
      { otp },
    );

    await transport.sendMail({
      from: "teamHex@gmail.com",
      to,
      subject: "OTP Sending",
      html: dataString,
    });
  } catch (error) {
    console.error("sendEmail failed:", error);
    errorResponse(500, "Unable to send email. Please try again later.");
  }
};
