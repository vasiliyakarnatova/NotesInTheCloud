import { IUser } from "../db/interfaces/user";
import { getUserByUserName } from "../db/services/userService";

export const containsUser = async (username: string) => {
    try {
        console.log("Checking if user exists:", username);
        const user = await getUserByUserName(username) as IUser | undefined;
        console.log("User found:", user);
        if (user !== undefined) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log("Error checking user existence:", error);
        return false;
    }
}

export const getUser = async (username: string) => {
    try {
        console.log("Checking if user exists:", username);
        const user = await getUserByUserName(username) as IUser | undefined;
        console.log("User found:", user);
        if (user === undefined) {
            return undefined;
        } else {
            return user;
        }
    } catch (error) {
        console.log("Error checking user existence:", error);
        return undefined;
    }
}