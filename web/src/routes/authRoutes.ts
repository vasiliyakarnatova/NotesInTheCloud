import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { createUser, getUserByUserName } from '../db/services/userService';
import { IUser } from '../db/interfaces/user';

const router = express.Router();

router.post('/register', async (req: Request, res: Response): Promise<any> => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await getUserByUserName(username);
        //return res.status(400).json({ message: "I am right" });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" + existingUser });
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
});

router.post('/login', async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body;

    try {
        const user = await getUserByUserName(username);
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        res.json(user); // По желание можеш да пратиш токен тук
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});

export default router;
