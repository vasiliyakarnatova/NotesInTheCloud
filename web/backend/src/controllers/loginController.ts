import { Request, Response } from "express";
import { IUser } from "../../../db/interfaces/user";
import { getUser } from "../utils/utils";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

// declare module "express-session" {
//     interface SessionData {
//         userInSession?: {
//             userName: string;
//             email: string;
//         };
//     }
// }

export const loginUser = async (req: Request, res: Response): Promise<IUser | undefined | any> => {
    const { username, password } = req.body;

    try {
        const user = await getUser(username); // getUser returns the user object from the database
        if (user !== undefined) {

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid username or password" });
                return;
            }

            //this user is logged in and we can set the session
            req.session.userInSession = {
                userName: user.userName,
                email: user.email,
            };

            res.status(StatusCodes.OK).json(user);
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid username or password" });
            return;
        }
    } catch (err) {
        console.log("User not found:", username);
        console.error("Error logging in user:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server errorr", error: err });
    }
};
