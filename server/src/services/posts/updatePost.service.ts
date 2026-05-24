import { prisma } from "../../lib/prisma.lib.js";
import type { CreatePostInput } from "../../types/type.js";

export const updatePost = async (
  postId: number,
  author_id: number,
  data: Partial<CreatePostInput>,
) => {
  const existingPost = await prisma.post.findUnique({
    where: { post_id: postId },
  });

  if (!existingPost) {
    throw new Error("Post not found");
  }

  if (existingPost.author_id !== author_id) {
    throw new Error("Not authorized to delete this post");
  }

  const updateData: any = {};
  if (data.title) updateData.title = data.title;
  if (data.content !== undefined) updateData.content = data.content ?? null;
  if (data.post_picture !== undefined)
    updateData.post_picture = data.post_picture ?? null;
  if (data.post_picture_id !== undefined)
    updateData.post_picture_id = data.post_picture_id ?? null;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.status) {
    updateData.status = data.status;
    if (data.status === "published" && !existingPost.published_at) {
      updateData.published_at = new Date();
    }
  }

  const post = await prisma.post.update({
    where: { post_id: postId },
    data: updateData,
  });
  return post;
};
