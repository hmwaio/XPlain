import { prisma } from "../../lib/prisma.lib.js";

// auto-called after registration
export const createProfile = async (userId: number) => {
  const profile = await prisma.profile.create({
    data: { user_id: userId },
  });
  return profile;
};
