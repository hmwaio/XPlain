import { prisma } from "../../lib/prisma.lib.js";

/* get user's followers */
export const getFollowers = async (userId: number) => {
  const followers = await prisma.follow.findMany({
    where: { following_id: userId },
    include: {
      follower: {
        select: { user_id: true, name: true },
      },
    },
  });

  return followers.map((f) => f.follower);
};

/* get user's following */
export const getFollowing = async (userId: number) => {
  const following = await prisma.follow.findMany({
    where: {
      follower_id: userId,
    },
    include: {
      following: {
        select: { user_id: true, name: true },
      },
    },
  });

  return following.map((f) => f.following);
};

/* get follower/following counts */
export const getFollowCounts = async (userId: number) => {
  const [followerCount, followingCount] = await Promise.all([
    prisma.follow.count({ where: { following_id: userId } }),
    prisma.follow.count({ where: { follower_id: userId } }),
  ]);

  return { followers: followerCount, following: followingCount };
};
