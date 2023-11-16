
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import CategorieModel from "../models/category";
import { assertIsDefined } from "../util/assertlsDefined";
import NoteModel from "../models/note";
import mongoose from "mongoose";

interface CreateCategorieBody {
    name?: string,
}

export const getCategories: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const categories = await CategorieModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

export const getCategory: RequestHandler = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(categoryId)) {
            throw createHttpError(400, "Invalid category id");
        }

        const category = await CategorieModel.findById(categoryId).exec();

        if (!category) {
            throw createHttpError(404, "Category not found");
        }

        if (!category.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this category");
        }

        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};

export const createCategorie: RequestHandler<unknown, unknown, CreateCategorieBody, unknown> = async (req, res, next) => {
    const name = req.body.name;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);
        if (!name) {
            throw createHttpError(400, "Category must have a name");
        }

        const newCategorie = await CategorieModel.create({
            userId: authenticatedUserId,
            name: name,
            // Additional folder-related fields if needed
        });

        res.status(201).json(newCategorie);
    } catch (error) {
        next(error);
    }
};

export const getCategoryWithNotes: RequestHandler = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(categoryId)) {
            throw createHttpError(400, "Invalid category id");
        }

        const category = await CategorieModel.findById(categoryId).exec();

        if (!category) {
            throw createHttpError(404, "Category not found");
        }

        if (!category.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this category");
        }

        // Retrieve notes associated with this category
        const notes = await NoteModel.find({
            userId: authenticatedUserId,
            categories: category._id,
        }).exec();

        const categoryWithNotes = {
            ...category.toObject(),
            notes,
        };

        res.status(200).json(categoryWithNotes);
    } catch (error) {
        next(error);
    }
};

export const deleteCategory: RequestHandler = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(categoryId)) {
            throw createHttpError(400, "Invalid category id");
        }

        const category = await CategorieModel.findById(categoryId).exec();

        if (!category) {
            throw createHttpError(404, "Category not found");
        }

        if (!category.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this category");
        }

        // Delete the category and its associated notes
        await Promise.all([
            category.deleteOne(),
            NoteModel.deleteMany({ categories: category._id }),
        ]);

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

