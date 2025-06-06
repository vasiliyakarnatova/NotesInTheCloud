import express from "express";
import serverRoutes from "./routes/server";
import authRoutes from "./routes/auth";
import cors from "cors";
import { validateUserIdMiddleware } from "./middlewares/userIdMiddleware";
import setupDb from '../db/db-setup';
import { accessToServerMiddleware } from "./middlewares/accessMiddleware";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();
const PORT = 8081;

setupDb()

//app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ // Enable CORS for all routes
    origin: "http://localhost:5173", // Replace with the frontend URL
    credentials: true // Allow credentials (cookies) to be sent with requests
}));
app.use(session({ // Set up session middleware
    secret: "my-secret-key", // change this
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    cookie: {
        secure: false, // change to true if using https
        httpOnly: true, // for security reasons, don't allow client-side JS to access the cookie
        maxAge: 1000 * 60 * 60 // 1 hour lifetime of the cookie
    }
}));

app.use("/api/NotesInTheCloud", authRoutes);
app.use(
    "/api/NotesInTheCloud", 
    validateUserIdMiddleware, 
    accessToServerMiddleware, 
    serverRoutes
);

app.listen(PORT, () => {
    console.log(`Server runnig at http://localhost:${PORT}/api/NotesInTheCloud`);
});
