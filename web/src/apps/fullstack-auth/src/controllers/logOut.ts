import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const logoutUser = (req: Request, res: Response) => {

  req.session.destroy((err) => {
    if (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Logout failed" });
      return;
    }

    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
  });
};
