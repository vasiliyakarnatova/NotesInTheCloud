import { Request, Response } from "express";
import { createUser } from "../db/services/userService";
import bcrypt from 'bcryptjs';
import { IUser } from "../db/interfaces/user";
import { containsUser } from "../utils/utils";

export const registerUser = async (req: Request, res: Response): Promise<IUser | undefined | any> => {
    const { username, email, password } = req.body;

    try {
        if (await containsUser(username)) {
            return res.status(400).json({ message: "Username already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser({
            userName: username,
            email: email,
            password: hashedPassword,
        });

        res.status(201).json(newUser);
    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ message: "Server error", error: err });
    }
}