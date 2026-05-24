import { prisma } from "../../lib/prisma.lib.js";

/* create or get existing tags (used when creating post) */
export const getOrCreateTags = async (tagName: string[]) => {
  const tags = await Promise.all(
    tagName.map(async (name) => {
      const tag = await prisma.tag.upsert({
        where: { name: name.toLowerCase() },
        create: {
          name: name.toLowerCase(),
          usage_count: 1,
        },
        update: {
          usage_count: { increment: 1 },
        },
      });
      return tag;
    }),
  );
  return tags;
};

/* get all tags */
export const getAllTags = async () => {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { name: "asc" },
  });
  return tags;
};

/* get tag by id with posts when click */
export const getTagById = async (tagId: number) => {
  const tag = await prisma.tag.findUnique({
    where: { tag_id: tagId },
    include: {
      posts: {
        where: { status: "published" },
        include: {
          author: {
            select: { user_id: true, name: true },
          },
          _count: {
            select: { likes: true, comments: true },
          },
        },
      },
    },
  });
  if (!tag) {
    throw new Error("Tag not found");
  }
  return tag;
};

/* get popular tags */
export const getPopularTags = async (limit: number = 10) => {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: {
      posts: { _count: "desc" },
    },
    take: limit,
  });
  return tags;
};
