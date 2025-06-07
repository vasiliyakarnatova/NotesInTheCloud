import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => { // Check if user is logged in
  if (req.session.userInSession && req.session.userInSession.userName && req.session.userInSession.email) { // Check if there is an user with field userInSession in the session and if he has a username
    next();
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Not authenticated" });
  }
};
