
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import TagModel from "../models/tag";
import { assertIsDefined } from "../util/assertlsDefined";
import mongoose from "mongoose";


interface CreateTagBody {
    name?: string,
}
export const getTags: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const tags = await TagModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(tags);
    } catch (error) {
        next(error);
    }
};

export const getTag: RequestHandler = async (req, res, next) => {
    const tagId = req.params.tagId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(tagId)) {
            throw createHttpError(400, "Invalid tag id");
        }

        const tag = await TagModel.findById(tagId).exec();

        if (!tag) {
            throw createHttpError(404, "Tag not found");
        }

        if (!tag.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this tag");
        }

        res.status(200).json(tag);
    } catch (error) {
        next(error);
    }
};


export const createTag: RequestHandler<unknown, unknown, CreateTagBody, unknown> = async (req, res, next) => {
    const name = req.body.name;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);
        if (!name) {
            throw createHttpError(400, "Tag must have a name");
        }

        const newTag = await TagModel.create({
            userId: authenticatedUserId,
            name: name,
            // Additional folder-related fields if needed
        });

        res.status(201).json(newTag);
    } catch (error) {
        next(error);
    }
};
