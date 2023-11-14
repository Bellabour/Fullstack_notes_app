import express from "express";
import * as TagsController from "../controllers/tag";

const router = express.Router();

router.post("/", TagsController.createTag);

router.get("/", TagsController.getTags);

router.get("/:categoryId", TagsController.getTag);

export default router;
