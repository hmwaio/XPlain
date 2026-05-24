import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const emailIpKey = (req: any) => `${req.body.email}-${ipKeyGenerator(req)}`;
// OTP sending - 5 requests per 24 hours per email
export const otpPerMinuteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  message: { error: "Please wait 60 seconds before requesting another OTP" },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: emailIpKey,
});

// OTP sending - 3 requests per hours per email
export const otpPerHourLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: "Too many OTP requests. Try again after an hour." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: emailIpKey,
});

// OTP sending - 5 requests per 24 hours per email
export const otpPerDayLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  message: { error: "Too many OTP requests. Try again after 24 hours." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: emailIpKey,
});

/* OTP verification - 3 attempts per 5 minutes per email */
export const otpVerifyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: { error: "Too many OTP attempts. Try again after 5 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: emailIpKey,
});
