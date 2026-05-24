import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { prisma } from "../../lib/prisma.lib.js";
import {
  getAllTags,
  getPopularTags,
  getTagById,
} from "../../services/aap/tags.service.js";
import { errorResponse, successResponse } from "../../utils/response.js";

const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const getAll = async (req: Request, res: Response) => {
  try {
    const tags = await getAllTags();

    return successResponse(res, { tags }, "Tags fetch successfully", OK);
  } catch (error) {
    return errorResponse(
      res,
      error instanceof Error ? error.message : "Failed to fetch tags",
      INTERNAL_SERVER_ERROR,
    );
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const tagId = parseInt(req.params.id as string);
    if (isNaN(tagId)) {
      return res.status(BAD_REQUEST).json({ error: "Invalid tag ID" });
    }
    const tag = await getTagById(tagId);
    return successResponse(res, { tag }, "Tag fetch successfully", OK);
  } catch (error) {
    if (error instanceof Error) {
      res.status(BAD_REQUEST).json({ error: error.message });
    } else {
      res.status(INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch tag" });
    }
  }
};

export const getPopular = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    if (isNaN(limit)) {
      return res.status(BAD_REQUEST).json({ error: "Invalid limit" });
    }
    const tags = await getPopularTags(limit);
    res.status(OK).json({ tags });
  } catch (error) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch popular tags" });
  }
};

export const autocomplete = async (req: Request, res: Response) => {
  try {
    const query = ((req.query.q as string) || "").toLowerCase();
    if (!query || query.length < 2) {
      return res.status(OK).json({ tags: [] });
    }
    const tags = await prisma.tag.findMany({
      where: {
        name: { startsWith: query },
      },
      select: { name: true },
      take: 10,
      orderBy: { usage_count: "desc" },
    });
    res.status(OK).json({ tags: tags.map((t) => t.name) });
  } catch (error) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to autocomplete " });
  }
};
