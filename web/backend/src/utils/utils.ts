export const USER_ID = "user_id"

import { Request, Response } from "express";
import { IUser } from "../../../db/interfaces/user";
import { getUserByEmail, getUserByUserName } from "../../../db/services/userService";
import { StatusCodes } from "http-status-codes";

export const containsUsername = async (username: string) => {
    try {
        const user = await getUserByUserName(username) as IUser | undefined;
        
        if (user !== undefined) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

export const containsEmail = async (email: string) => {
    try {
        const user = await getUserByEmail(email) as IUser | undefined;
        
        if (user !== undefined) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

export const getUser = async (username: string) => {
    try {
        const user = await getUserByUserName(username) as IUser | undefined;

        if (user === undefined) {
            return undefined;
        } else {
            return user;
        }

    } catch (error) {
        return undefined;
    }
}

export const currentUser = async (req:Request, res:Response): Promise<any> => {
    if (req.session && req.session.userInSession) {
        res.status(StatusCodes.OK).json(req.session.userInSession);
        return req.session.userInSession; // ??
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Not authenticated" });
        return undefined; // ??
    }
};

export type Camelable<T> = {
  [K in keyof T]: T[K];
} & Record<string, unknown>;