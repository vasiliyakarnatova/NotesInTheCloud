import { addEditorToNote, removeEditorFromNote } from "../../../db/services/editorService";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const addCollaborator = async (req: Request, res: Response) => {
    const { noteId } = req.params;
    const { collaboratorId } = req.body;
    
    const addedCollab = await addEditorToNote(noteId, collaboratorId);
    if (!addedCollab) {
        res.status(StatusCodes.NO_CONTENT).json(`${ addedCollab } is not found`);
        return;
    }
    
    res.status(StatusCodes.OK).json(addedCollab);
}

export const shareNote = async (req: Request, res: Response) => {

}

export const removeCollaborator = async (req: Request, res: Response) => {
    const { noteId } = req.params;
    const { collaboratorId } = req.params;
    
    const removedCollab = await removeEditorFromNote(noteId, collaboratorId);
    if (!removedCollab) {
        res.status(StatusCodes.NO_CONTENT).json("Collaborator not found or already removed");
        return;
    }
    res.status(StatusCodes.OK).json(removedCollab);
}