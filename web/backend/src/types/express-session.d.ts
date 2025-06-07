import "express-session";

declare module "express-session" {
    interface SessionData {
        userInSession?: {
            userName: string;
            email: string;
        };
    }
}
