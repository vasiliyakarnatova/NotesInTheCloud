import express from "express";
import { getNotes, getNote, createNote, updateNote, deleteNote } from "../controllers/noteController"
import { createTask, deleteTask, updateTask } from "../controllers/taskController";
import { addCollaborator, shareNote } from "../controllers/userController";

const router = express.Router();

router.get("/", getNotes)
router.get("/:noteId", getNote);
router.post("/", createNote);
router.put("/:noteId", updateNote);
router.delete("/:noteId", deleteNote);

router.post("/:noteId", createTask);
router.delete("/:noteId/:taskId", deleteTask)
router.put("/:noteId/:taskId", updateTask)

router.patch("/:noteId", addCollaborator)
router.get("/:userId/:noteId/shared", shareNote)

export default router;