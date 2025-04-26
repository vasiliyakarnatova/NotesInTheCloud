import express from "express";
import { getNotes, getNoteFromUser, createNoteForUser, updateNoteById, deleteNoteById } from "../controllers/noteController"
import { createTask, deleteTask, updateTask } from "../controllers/taskController";
import { addCollaborator, shareNote } from "../controllers/userController";

const router = express.Router();

router.get("/", getNotes)  
router.post("/", createNoteForUser);
router.get("/:noteId", getNoteFromUser);
router.put("/:noteId", updateNoteById);
router.delete("/:noteId", deleteNoteById);

router.post("/:noteId", createTask);
router.delete("/:noteId/:taskId", deleteTask);
router.put("/:noteId/:taskId", updateTask)

router.patch("/:noteId", addCollaborator);
router.get("/:userId/:noteId/shared", shareNote);

export default router;