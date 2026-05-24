import { prisma } from "../../lib/prisma.lib.js";
import type { CreatePostInput } from "../../types/type.js";
import { getOrCreateTags } from "../aap/tags.service.js";

export const createPost = async (data: CreatePostInput, author_id: number) => {
  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content ?? null,
      post_picture: data.post_picture ?? null,
      post_picture_id: data.post_picture_id ?? null,
      category: data.category ?? null,
      status: data.status || "draft",
      author_id: author_id,
      published_at: data.status === "published" ? new Date() : null,
    },
  });

  if (data.tags && data.tags.length > 0) {
    const tags = await getOrCreateTags(data.tags);
    await prisma.post.update({
      where: { post_id: post.post_id },
      data: {
        tags: { connect: tags.map((t) => ({ tag_id: t.tag_id })) },
      },
    });
  }

  return post;
};
