import { prisma } from "../../lib/prisma.lib.js";

/* follow user */
export const followUser = async (followerId: number, followingId: number) => {
  if (followerId === followingId) {
    throw new Error("You cannot follow yourslef");
  }

  const userToFollow = await prisma.user.findUnique({
    where: { user_id: followingId },
  });

  if (!userToFollow) {
    throw new Error("User not found");
  }

  const existing = await prisma.follow.findUnique({
    where: {
      follower_id_following_id: {
        follower_id: followerId,
        following_id: followingId,
      },
    },
  });

  if (existing) {
    throw new Error("Already following");
  }

  await prisma.follow.create({
    data: {
      follower_id: followerId,
      following_id: followingId,
    },
  });

  return { message: "User followed successfully" };
};

/* Unfollow user */
export const unfollowUser = async (followerId: number, followingId: number) => {
  const follow = await prisma.follow.findUnique({
    where: {
      follower_id_following_id: {
        follower_id: followerId,
        following_id: followingId,
      },
    },
  });

  if (!follow) {
    throw new Error("Not following this user");
  }

  await prisma.follow.delete({
    where: {
      follower_id_following_id: {
        follower_id: followerId,
        following_id: followingId,
      },
    },
  });

  return { message: "User unfollowed successfully" };
};
