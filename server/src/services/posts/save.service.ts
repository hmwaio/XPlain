import { prisma } from "../../lib/prisma.lib.js";
import { cursorPaginate } from "../pagination/cursorScroll.service.js";

/* save post */
export const savePost = async (postId: number, userId: number) => {
  const post = await prisma.post.findUnique({
    where: {
      post_id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  /* prevent self save */
  if (post.author_id === userId) {
    throw new Error("You cannot save your own post");
  }

  const existing = await prisma.savedPost.findUnique({
    where: {
      user_id_post_id: {
        user_id: userId,
        post_id: postId,
      },
    },
  });

  if (existing) {
    throw new Error("Post already saved");
  }

  await prisma.savedPost.create({
    data: {
      user_id: userId,
      post_id: postId,
    },
  });
  return { message: "Post saved" };
};

/* Unsave post */
export const unsavePost = async (postId: number, userId: number) => {
  const saved = await prisma.savedPost.findUnique({
    where: {
      user_id_post_id: {
        user_id: userId,
        post_id: postId,
      },
    },
  });

  if (!saved) {
    throw new Error("Not saved yet");
  }

  await prisma.savedPost.delete({
    where: {
      user_id_post_id: {
        user_id: userId,
        post_id: postId,
      },
    },
  });
  return { message: "Post unsaved" };
};

/* get user's saved posts */
export const getSavedPosts = async (
  userId: number,
  cursor?: { id: number; created_at: Date },
  limit: number = 20,
) => {
  const result = await cursorPaginate({
    model: prisma.savedPost,
    idField: "saved_id",
    uniqueName: "saved_at_saved_id",
    limit,
    dateField: "saved_at",
    ...(cursor && { cursor }),
    where: { user_id: userId },
    include: {
      post: {
        include: {
          author: {
            select: {
              user_id: true,
              name: true,
              profile: {
                select: {
                  profile_picture: true,
                },
              },
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
      },
    },
  });

  // Transform and return
  const transformedItems = result.items.map((item: any) => ({
    ...item,
    post: {
      ...item.post,
      isLiked: item.post.likes?.length > 0,
      isSaved: item.post.savedBy?.length > 0,
      likes: undefined,
      savedBy: undefined,
    },
  }));

  return {
    items: transformedItems,
    nextCursor: result.nextCursor,
    hasMore: result.hasMore,
  };
};
