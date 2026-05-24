import { prisma } from "../../lib/prisma.lib.js";
import { deleteImage } from "../uploads/cloudinary.service.js";

export const deleteAccount = async (userId: number, password: string) => {
  // Verify password
  const user = await prisma.user.findUnique({
    where: { user_id: userId },
    include: { profile: true },
  });

  if (!user) throw new Error("User not found");

  const { verifyPassword } = await import("../../utils/passwords.js");
  const isValid = await verifyPassword(password, user.password);

  if (!isValid) throw new Error("Invalid password");

  // Delete profile pictures from Cloudinary
  if (user.profile?.profile_picture_id) {
    await deleteImage(user.profile.profile_picture_id);
  }
  if (user.profile?.cover_picture_id) {
    await deleteImage(user.profile.cover_picture_id);
  }

  // Delete all post images
  const posts = await prisma.post.findMany({
    where: { author_id: userId },
    select: { post_picture_id: true },
  });

  await Promise.all(
    posts
      .filter((p) => p.post_picture_id)
      .map((p) => deleteImage(p.post_picture_id!)),
  );

  // Delete user (cascade deletes everything)
  await prisma.user.delete({
    where: { user_id: userId },
  });

  return { message: "Account deleted successfully" };
};
