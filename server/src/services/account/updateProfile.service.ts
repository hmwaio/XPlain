import { prisma } from "../../lib/prisma.lib.js";
import { generateOTP } from "../../utils/otp.util.js";
import { hashPassword, verifyPassword } from "../../utils/passwords.js";
import { verifyOTP } from "../auth/verifyotp.auth.js";
import { deleteImage } from "../uploads/cloudinary.service.js";

export const updateProfile = async (
  userId: number,
  data: {
    name?: string;
    email?: string;
    profile_picture?: string;
    profile_picture_id?: string;
    cover_picture?: string;
    cover_picture_id?: string;
  },
) => {
  // Update user info
  const updateUserData: any = {};
  if (data.name) updateUserData.name = data.name;
  if (data.email) updateUserData.email = data.email;

  if (Object.keys(updateUserData).length > 0) {
    await prisma.user.update({
      where: { user_id: userId },
      data: updateUserData,
    });
  }

  // Update profile pictures
  const updateProfileData: any = {};

  if (data.profile_picture && data.profile_picture_id) {
    const existingProfile = await prisma.profile.findUnique({
      where: { user_id: userId },
      select: { profile_picture_id: true },
    });

    if (existingProfile?.profile_picture_id) {
      try {
        await deleteImage(existingProfile.profile_picture_id);
      } catch (error) {
        console.error("Failed to delete old profile picture");
      }
    }

    updateProfileData.profile_picture = data.profile_picture;
    updateProfileData.profile_picture_id = data.profile_picture_id;
  }

  if (data.cover_picture && data.cover_picture_id) {
    const existingProfile = await prisma.profile.findUnique({
      where: { user_id: userId },
      select: { cover_picture_id: true },
    });

    if (existingProfile?.cover_picture_id) {
      try {
        await deleteImage(existingProfile.cover_picture_id);
      } catch (error) {
        console.error("Failed to delete old cover picture");
      }
    }

    updateProfileData.cover_picture = data.cover_picture;
    updateProfileData.cover_picture_id = data.cover_picture_id;
  }

  if (Object.keys(updateProfileData).length > 0) {
    await prisma.profile.upsert({
      where: { user_id: userId },
      update: updateProfileData,
      create: {
        user_id: userId,
        ...updateProfileData,
      },
    });
  }

  return { message: "Profile updated successfully" };
};

/* delete profile picture */
export const deleteProfilePicture = async (
  userId: number,
  type: "profile" | "cover",
) => {
  const profile = await prisma.profile.findUnique({
    where: { user_id: userId },
  });

  if (!profile) {
    throw new Error("Profile not found");
  }

  const publicId =
    type === "profile" ? profile.profile_picture_id : profile.cover_picture_id;

  if (publicId) {
    await deleteImage(publicId);
  }

  await prisma.profile.update({
    where: { user_id: userId },
    data:
      type === "profile"
        ? { profile_picture: null, profile_picture_id: null }
        : { cover_picture: null, cover_picture_id: null },
  });
  return { message: `${type} picture deleted successfully` };
};

/* chage password */
export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string,
) => {
  if (!currentPassword || !newPassword) {
    throw new Error("All fields are required");
  }

  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const user = await prisma.user.findUnique({
    where: { user_id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check current password
  const isValid = await verifyPassword(currentPassword, user.password);
  if (!isValid) {
    throw new Error("Current password is incorrect");
  }

  // Prevent using same password again
  const isSame = await verifyPassword(newPassword, user.password);
  if (isSame) {
    throw new Error("New password must be different from current password");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { user_id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password changed successfully" };
};

/* change email */
export const changeEmail = async (
  userId: number,
  newEmail: string,
  password: string,
) => {
  if (!newEmail || !password) {
    throw new Error("All fields are required");
  }

  const normalizedEmail = newEmail.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { user_id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Verify password before changing email
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new Error("Password is incorrect");
  }

  if (normalizedEmail === user.email) {
    throw new Error("New email must be different");
  }

  const existingEmail = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingEmail) {
    throw new Error("Email already in use");
  }

  const { OTP, expiredAt } = generateOTP();

  // Create or update OTP session
  await prisma.authSession.upsert({
    where: { email: normalizedEmail },
    update: {
      otp: OTP,
      otp_expires_at: expiredAt,
      is_verified: false,
    },
    create: {
      email: normalizedEmail,
      otp: OTP,
      otp_expires_at: expiredAt,
    },
  });

  return { email: normalizedEmail, otp: OTP };
};

/* confirmEmailChange */
export const confirmEmailChange = async (
  userId: number,
  email: string,
  otp: string,
) => {
  await verifyOTP({ email, otp });

  await prisma.user.update({
    where: { user_id: userId },
    data: { email },
  });

  await prisma.authSession.delete({
    where: { email },
  });

  return { message: "Email updated successfully" };
};
