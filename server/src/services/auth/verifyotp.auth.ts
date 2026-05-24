import { prisma } from "../../lib/prisma.lib.js";
import type { VerifyOTPInput } from "../../types/type.js";

/* Verify OTP */
export const verifyOTP = async (data: VerifyOTPInput) => {
  const existingUser = await prisma.authSession.findUnique({
    where: { email: data.email },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  if (existingUser.is_verified) {
    throw new Error("OTP already used. Please request a new one.");
  }

  if (!existingUser.otp) {
    throw new Error("OTP not requested");
  }

  if (existingUser.otp_expires_at && new Date() > existingUser.otp_expires_at) {
    throw new Error("OTP expired, please request a new one");
  }

  if (existingUser.otp !== data.otp) {
    throw new Error("Invalid OTP");
  }

  const user = await prisma.authSession.update({
    where: { email: data.email },
    data: {
      is_verified: true,
    },
  });

  return { tempToken: existingUser.authsession_id };
};