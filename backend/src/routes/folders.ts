import express from "express";
import * as FolderController from "../controllers/folder";

const router = express.Router();

router.post("/", FolderController.createFolder);

router.get("/", FolderController.getFolders);

router.get("/:categoryId", FolderController.getFolder);

export default router;