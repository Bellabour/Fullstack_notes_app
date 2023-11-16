import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import NoteModel from "../models/note";
import { assertIsDefined } from "../util/assertlsDefined";


export const getNotes: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const notes = await NoteModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};

export const getNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note");
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

interface CreateNoteBody {
    title?: string,
    text?: string,
    categoryId?: string,
    folderId?: string,
    tagId?: string
}

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    const categoryId = req.body.categoryId;
    const folderId = req.body.folderId;
    const tagId = req.body.tagId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!title) {
            throw createHttpError(400, "Note must have a title");
        }

        const newNote = await NoteModel.create({
            userId: authenticatedUserId,
            title: title,
            text: text,
            categories: categoryId ? [categoryId] : [],
            folders: folderId ? [folderId] : [],
            tags: tagId ? [tagId] : [],
        });

        console.log("Received Request Body:", req.body);
        console.log("Created Note:", newNote);

        res.status(201).json(newNote);
        console.log("Database Response:", newNote);

    } catch (error) {
        next(error);
    }
};
interface UpdateNoteParams {
    noteId: string,
}

interface UpdateNoteBody {
    title?: string;
    text?: string;
    addCategories?: string[];
    removeCategories?: string[];
    folderId?: string;
    tagId?: string;
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const authenticatedUserId = req.session.userId;

    // Constants for add and remove categories
    const addCategories = req.body.addCategories || [];
    const removeCategories = req.body.removeCategories || [];

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }

        if (!newTitle) {
            throw createHttpError(400, "Note must have a title");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note");
        }

        note.title = newTitle;
        note.text = newText;

        // Add new categories
        if (addCategories.length > 0) {
            const newCategoryIds = addCategories.map((categoryId: string) => new mongoose.Types.ObjectId(categoryId));
            note.categories.push(...newCategoryIds);
        }

        // Remove categories
        if (removeCategories.length > 0) {
            const removeCategoryIds = removeCategories.map((categoryId: string) => new mongoose.Types.ObjectId(categoryId));
            note.categories = note.categories.filter(categoryId => !removeCategoryIds.includes(categoryId));
        }

        const updatedNote = await note.save();

        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
};
interface UpdateNoteParams {
    noteId: string;
  }
  
  interface UpdateNoteWithCategoriesBody {
    title?: string;
    text?: string;
    addCategories?: string[];
    removeCategories?: string[];
  }
  
  export const updateNoteWithCategories: RequestHandler<UpdateNoteParams, unknown, UpdateNoteWithCategoriesBody, unknown> = async (req, res, next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const addCategories = req.body.addCategories || [];
    const removeCategories = req.body.removeCategories || [];
    const authenticatedUserId = req.session.userId;
  
    try {
      assertIsDefined(authenticatedUserId);
  
      if (!mongoose.isValidObjectId(noteId)) {
        throw createHttpError(400, "Invalid note id");
      }
  
      if (!newTitle) {
        throw createHttpError(400, "Note must have a title");
      }
  
      const note = await NoteModel.findById(noteId).exec();
  
      if (!note) {
        throw createHttpError(404, "Note not found");
      }
  
      if (!note.userId.equals(authenticatedUserId)) {
        throw createHttpError(401, "You cannot access this note");
      }
  
      note.title = newTitle;
      note.text = newText;
  
      // Add new categories
      note.categories = [...note.categories, ...addCategories.map(categoryId => new mongoose.Types.ObjectId(categoryId))];
  
      // Remove categories
      note.categories = note.categories.filter(categoryId => !removeCategories.includes(categoryId.toString()));
  
      const updatedNote = await note.save();
  
      res.status(200).json(updatedNote);
    } catch (error) {
      next(error);
    }
  };

export const deleteNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note");
        }

        await note.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
interface RemoveCategoryParams {
    noteId: string;
    categoryId: string;
}

// Create a new route handler
export const removeCategory: RequestHandler<RemoveCategoryParams> = async (req, res, next) => {
    const { noteId, categoryId } = req.params;
    const authenticatedUserId = req.session.userId;

    try {
        // Check if the note ID is valid
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, 'Invalid note id');
        }

        // Find the note
        const note = await NoteModel.findById(noteId).exec();

        // Check if the note exists
        if (!note) {
            throw createHttpError(404, 'Note not found');
        }

        // Check if the user has permission to modify the note
        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, 'You cannot access this note');
        }

        // Remove the category from the note
        const categoryToRemove = new mongoose.Types.ObjectId(categoryId);
        note.categories = note.categories.filter((categoryId) => !categoryId.equals(categoryToRemove));

        // Save the updated note
        const updatedNote = await note.save();

        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
};
