import { prisma } from "../../lib/prisma.lib.js";
import { cursorPaginate } from "../pagination/cursorScroll.service.js";

/* get single post */
export const getPostById = async (postId: number, userId?: number) => {
  const post = await prisma.post.findUnique({
    where: { post_id: postId },
    include: {
      author: {
        select: {
          user_id: true,
          name: true,
          profile: { select: { profile_picture: true } },
        },
      },
      tags: true,
      _count: { select: { likes: true, comments: true } },
      likes: {
        where: { user_id: userId ?? -1 },
        select: { user_id: true },
      },
      savedBy: {
        where: { user_id: userId ?? -1 },
        select: { user_id: true },
      },
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  return {
    ...post,
    isLiked: post.likes.length > 0,
    isSaved: post.savedBy.length > 0,
  };
};

/* get all posts */
export const getAllPosts = async (
  cursor?: { id: number; created_at: Date },
  limit: number = 20,
  userId?: number,
) => {
  const result = await cursorPaginate({
    model: prisma.post,
    idField: "post_id",
    uniqueName: "created_at_post_id",
    ...(cursor && { cursor }),
    limit,
    where: { status: "published" },
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
      ...(userId && {
        likes: {
          where: { user_id: userId ?? -1 },
          select: { user_id: true },
        },
        savedBy: {
          where: { user_id: userId ?? -1 },
          select: { user_id: true },
        },
      }),
    },
  });

  result.items = result.items.map((post: any) => ({
    ...post,
    isLiked: post.likes?.length > 0,
    isSaved: post.savedBy?.length > 0,
  }));

  return result;
};
