import { Request, Response } from "express";
import { createUser, getUserByUserName } from "../db/services/userService";
import bcrypt from 'bcryptjs';
import { IUser } from "../db/interfaces/user";
import { containsUsername, containsEmail } from "../utils/utils";
import { StatusCodes } from "http-status-codes";

export const registerUser = async (req: Request, res: Response): Promise<IUser | undefined | any> => {
    const { username, email, password } = req.body;

    try {
        if (await containsUsername(username)) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Username already taken" });
            return;

        }

        if (await containsEmail(email)) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already taken" });
            return;
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser({
            userName: username,
            email: email,
            password: hashedPassword,
        });

        res.status(StatusCodes.CREATED).json(newUser);

    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error", error: err });
    }
}