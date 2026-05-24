import { prisma } from "../../lib/prisma.lib.js";
import { cursorPaginate } from "../pagination/cursorScroll.service.js";

/* Adding Comment */
export const addComment = async (
  postId: number,
  userId: number,
  content: string,
) => {
  const post = await prisma.post.findUnique({
    where: { post_id: postId },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  /* prevent self comment */
  if (post.author_id === userId) {
    throw new Error("You cannot comment on your own post");
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      user_id: userId,
      post_id: postId,
    },
    include: {
      user: {
        select: { user_id: true, name: true },
      },
    },
  });
  return comment;
};

/* Comment Deletion */
export const deleteComment = async (commentId: number, userId: number) => {
  const comment = await prisma.comment.findUnique({
    where: { comment_id: commentId },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }
  if (comment.user_id !== userId) {
    throw new Error("Not authorized to delete this comment");
  }

  await prisma.comment.delete({
    where: { comment_id: commentId },
  });

  return { message: "Comment deleted successfully" };
};

/* get post comments */
export const getPostComments = async (
  postId: number,
  cursor?: { id: number; created_at: Date },
  limit: number = 10,
) => {
  return await cursorPaginate({
    model: prisma.comment,
    idField: "comment_id",
    uniqueName: "commented_at_comment_id",
    limit,
    dateField: "commented_at",
    where: { post_id: postId },
    ...(cursor && { cursor }),
    include: {
      user: { select: { user_id: true, name: true } },
    },
  });
};
