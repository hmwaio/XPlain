import { prisma } from "../../lib/prisma.lib.js";
import type { SendOtpInput } from "../../types/type.js";
import { generateOTP } from "../../utils/otp.util.js";

/* SignUp */
export const signupUser = async (data: SendOtpInput) => {
  const { OTP, expiredAt } = generateOTP();

  const existingSession = await prisma.authSession.findUnique({
    where: { email: data.email },
  });

  // Case 1: Session exists and already verified → error
  if (existingSession?.is_verified) {
    throw new Error("OTP already verified. Please complete registration");
  }

  /* Case 2: Session exists but not verified -> Update OTP (resend case) */
  if (existingSession && !existingSession.is_verified) {
    await prisma.authSession.update({
      where: { email: data.email },
      data: {
        otp: OTP,
        otp_expires_at: expiredAt,
      },
    });
    return { otp: OTP, email: data.email }; // return to controller for Brevo
  }

  /* Case 3: User not exist -> Create new record */
  const user = await prisma.authSession.create({
    data: {
      email: data.email,
      otp: OTP,
      otp_expires_at: expiredAt,
    },
  });
  return { otp: OTP, email: data.email }; // return to brevo
};
