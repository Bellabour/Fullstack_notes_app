import express from "express";
import * as CategorieController from "../controllers/categorie";

const router = express.Router();

router.post("/create", CategorieController.createCategorie);

router.get("/", CategorieController.getCategories);

router.get("/:categoryId", CategorieController.getCategory);

router.get("/:categoryId/withNotes", CategorieController.getCategoryWithNotes);

router.delete("/:categoryId", CategorieController.deleteCategory);

export default router;
