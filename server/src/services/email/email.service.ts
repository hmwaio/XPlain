import nodemailer from "nodemailer";
import { otpEmailTemplate } from "../../templates/sendOTPEmail.template.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTPEmail = async (email: string, otp: string) => {
  const otpemailTemplate = otpEmailTemplate({ otp, email });
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Verify your account - XPlain",
    html: otpemailTemplate,
  });
};

export const testConnection = async () => {
  try {
    await transporter.verify();
    console.log("Brevo connection successful");
  } catch (error) {
    console.log("Brevo connection failed ", error);
  }
};
