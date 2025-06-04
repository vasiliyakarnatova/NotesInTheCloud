import { addEditorToNote } from "../../db/services/editorService";
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