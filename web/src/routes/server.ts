import express from "express";
import { getNotes, getNoteFromUser, createNoteForUser, updateNoteById, deleteNoteById } from "../controllers/noteController"
import { createTask, deleteTask, updateTask } from "../controllers/taskController";
import { addCollaborator, shareNote } from "../controllers/editorController";
import { accessToNoteMiddleware } from "../middlewares/accessMiddleware";

const router = express.Router();

router.get("/", getNotes)
router.post("/", createNoteForUser);
router.get("/:noteId", accessToNoteMiddleware, getNoteFromUser);
router.put("/:noteId", accessToNoteMiddleware, updateNoteById);
router.delete("/:noteId", accessToNoteMiddleware, deleteNoteById);

router.post("/:noteId", accessToNoteMiddleware, createTask);
router.delete("/:noteId/:taskId", accessToNoteMiddleware, deleteTask);
router.put("/:noteId/:taskId", accessToNoteMiddleware, updateTask)

router.patch("/:noteId", accessToNoteMiddleware, addCollaborator);
router.get("/:userId/:noteId/shared", accessToNoteMiddleware, shareNote);

export default router;