
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import FolderModel from "../models/folder";
import { assertIsDefined } from "../util/assertlsDefined";
import mongoose from "mongoose";


interface CreateFolderBody {
    name?: string,
}
export const getFolders: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const folders = await FolderModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(folders);
    } catch (error) {
        next(error);
    }
};

export const getFolder: RequestHandler = async (req, res, next) => {
    const folderId = req.params.folderId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(folderId)) {
            throw createHttpError(400, "Invalid folder id");
        }

        const folder = await FolderModel.findById(folderId).exec();

        if (!folder) {
            throw createHttpError(404, "Folder not found");
        }

        if (!folder.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this folder");
        }

        res.status(200).json(folder);
    } catch (error) {
        next(error);
    }
};


export const createFolder: RequestHandler<unknown, unknown, CreateFolderBody, unknown> = async (req, res, next) => {
    const name = req.body.name;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);
        if (!name) {
            throw createHttpError(400, "Folder must have a name");
        }

        const newFolder = await FolderModel.create({
            userId: authenticatedUserId,
            name: name,
            
            // Additional folder-related fields if needed
        });

        res.status(201).json(newFolder);
    } catch (error) {
        next(error);
    }
};
