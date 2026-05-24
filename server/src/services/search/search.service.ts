import { prisma } from "../../lib/prisma.lib.js";
import { offsetPaginate } from "../pagination/offsetScroll.service.js";

type SearchFilters = {
  query?: string;
  category?: string;
  tag?: string;
  author?: string;
};

export const searchPosts = async (
  filters: SearchFilters,
  page: number = 1,
  limit: number = 20,
) => {
  const searchQuery = filters.query?.trim();

  const where: any = {
    status: "published",
  };

  if (searchQuery && searchQuery.length >= 2) {
    where.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { content: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  if (filters.category?.trim()) {
    where.category = filters.category.trim();
  }

  if (filters.tag?.trim()) {
    where.tags = {
      some: { name: filters.tag.trim().toLowerCase() },
    };
  }

  if (filters.author?.trim()) {
    where.author = {
      name: { contains: filters.author.trim(), mode: "insensitive" },
    };
  }

  return await offsetPaginate({
    model: prisma.post,
    page,
    limit,
    where,
    orderBy: {
      created_at: "desc",
    },
    include: {
      author: {
        select: {
          user_id: true,
          name: true,
          profile: {
            select: { profile_picture: true },
          },
        },
      },
      tags: { select: { name: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
};

export const searchUsers = async (
  query: string,
  page: number = 1,
  limit: number = 20,
) => {
  const trimmed = query.trim();

  if (trimmed.length < 2) {
    return {
      items: [],
      total: 0,
      page,
      limit,
    };
  }

  return await offsetPaginate({
    model: prisma.user,
    page,
    limit,
    where: {
      name: { contains: trimmed, mode: "insensitive" },
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      profile: {
        select: { profile_picture: true },
      },
    },
  });
};
