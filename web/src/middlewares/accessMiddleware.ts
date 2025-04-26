import { NextFunction, Request, Response } from "express";

export function accessToNoteMiddleware(req: Request, res: Response, next: NextFunction) {
    next()
}