import { NextFunction, Request, Response } from "express";
import { USER_ID } from "../utils/utils"

export function validateUserIdMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log("I am in Middleware!");
    
    const userId = req.headers[USER_ID] as string | undefined;

    if (!userId) {
        res.status(400).json({
            error: "Missing userId in header" 
        })
        return 
    }

    next()
}