import { Request, RequestHandler, Response } from "express";
import bcrypt from  "bcryptjs";
import { IUser } from "../db/interfaces/user";
import { getUser } from "../utils/utils";

export const loginUser = async (req: Request, res: Response): Promise<IUser | undefined | any> => {
    const { username, password } = req.body;

    try {
        const user = await getUser(username);
        if (user !== undefined) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid username or password" });
            }

            res.json(user);
        } else {
            return res.status(401).json({ message: "Invalid username or password" });
        }

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};