import { prisma } from "../../lib/prisma.lib.js";
import { cursorPaginate } from "../pagination/cursorScroll.service.js";

// Get OWN profile with private info
export const getOwnProfile = async (
  userId: number,
  cursor?: { id: number; created_at: Date },
  limit: number = 20,
) => {
  const user = await prisma.user.findUnique({
    where: { user_id: userId },
    select: {
      user_id: true,
      name: true,
      email: true,
      created_at: true,
      profile: {
        select: {
          profile_picture: true,
          profile_picture_id: true,
          cover_picture: true,
          cover_picture_id: true,
        },
      },
    },
  });

  if (!user) throw new Error("User not found");

  // Get stats
  const [publishedCount, draftCount, followerCount, followingCount] =
    await Promise.all([
      prisma.post.count({ where: { author_id: userId, status: "published" } }),
      prisma.post.count({ where: { author_id: userId, status: "draft" } }),
      prisma.follow.count({ where: { following_id: userId } }),
      prisma.follow.count({ where: { follower_id: userId } }),
    ]);

  // get own all posts (with pagination)
  // All posts (mixed by time)
  const getOwnAllPosts = await cursorPaginate({
    model: prisma.post,
    idField: "post_id",
    dateField: "created_at",
    uniqueName: "created_at_post_id",
    ...(cursor && { cursor }),
    limit,
    where: { author_id: userId },
    include: {
      author: {
        select: {
          user_id: true,
          name: true,
          profile: { select: { profile_picture: true } },
        },
      },
      tags: { select: { name: true } },
      _count: { select: { likes: true, comments: true } },
      likes: {
        where: { user_id: userId },
        select: { user_id: true },
      },
      savedBy: {
        where: { user_id: userId },
        select: { user_id: true },
      },
    },
  });

  const postsWithStatus = getOwnAllPosts.items.map((post: any) => ({
    ...post,
    isLiked: post.likes?.length > 0,
    isSaved: post.savedBy?.length > 0,
    likes: undefined,
    savedBy: undefined,
  }));

  return {
    profile: {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      profile_picture: user.profile?.profile_picture || null,
      cover_picture: user.profile?.cover_picture || null,
      joined: user.created_at,
      stats: {
        published: publishedCount,
        drafts: draftCount,
        followers: followerCount,
        following: followingCount,
      },
    },
    posts: postsWithStatus,
    nextCursor: getOwnAllPosts.nextCursor,
    hasMore: getOwnAllPosts.hasMore,
  };
};

// Get own published posts (with pagination)
export const getOwnPublishedPosts = async (
  userId: number,
  cursor?: { id: number; created_at: Date },
  limit: number = 20,
) => {
  return await cursorPaginate({
    model: prisma.post,
    idField: "post_id",
    dateField: "created_at",
    uniqueName: "created_at_post_id",
    ...(cursor && { cursor }),
    limit,
    where: {
      author_id: userId,
      status: "published",
    },
    include: {
      _count: { select: { likes: true, comments: true } },
    },
  });
};

// Get own draft posts (with pagination)
export const getOwnDraftPosts = async (
  userId: number,
  cursor?: { id: number; created_at: Date },
  limit: number = 20,
) => {
  return await cursorPaginate({
    model: prisma.post,
    idField: "post_id",
    dateField: "created_at",
    uniqueName: "created_at_post_id",
    ...(cursor && { cursor }),
    limit,
    where: {
      author_id: userId,
      status: "draft",
    },
  });
};
