import { getEditorByUsernameAndNoteId } from "../../../db/services/editorService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { USER_ID } from "../utils/utils";
import { getUserByUserName } from "../../../db/services/userService";

export async function accessToNoteMiddleware(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers[USER_ID] as string;
    const { noteId } = req.params;

    const editor = await getEditorByUsernameAndNoteId(userId, noteId); 
    if (!editor) {
        res.status(StatusCodes.FORBIDDEN).json(`user with this username ${ userId } does not have permision to this note/s`);
        return;
    }

    next()
}

export async function accessToServerMiddleware(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers[USER_ID] as string;

    const user = await getUserByUserName(userId); 
    if (!user) {
        res.status(StatusCodes.FORBIDDEN).json(`user with this username does not exist: ${ user }`);
        return;
    }

    next()
}