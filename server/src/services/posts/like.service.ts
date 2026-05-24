import { prisma } from "../../lib/prisma.lib.js";

export const likePost = async (postId: number, userId: number) => {
  const post = await prisma.post.findUnique({
    where: { post_id: postId },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  /* prevent self like */
  // if (post.author_id === userId) {
  //   throw new Error("You cannot like your own post");
  // }

  const existing = await prisma.like.findUnique({
    where: {
      user_id_post_id: {
        user_id: userId,
        post_id: postId,
      },
    },
  });

  if (existing) {
    throw new Error("You already liked this post");
  }

  await prisma.like.create({
    data: {
      user_id: userId,
      post_id: postId,
    },
  });
  return { message: "Post liked" };
};

export const unlikePost = async (postId: number, userId: number) => {
  const like = await prisma.like.findUnique({
    where: {
      user_id_post_id: {
        user_id: userId,
        post_id: postId,
      },
    },
  });

  if (!like) {
    throw new Error("Not liked yet");
  }

  await prisma.like.delete({
    where: {
      user_id_post_id: {
        user_id: userId,
        post_id: postId,
      },
    },
  });
  return { message: "Post unliked" };
};
