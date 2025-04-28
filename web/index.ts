import express from 'express';
import authRoutes from './src/routes/authRoutes';
import cors from 'cors';
import setupDb from './src/db/db-setup';
import session from "express-session";
import cookieParser from "cookie-parser";

const app = express(); // Create an instance of express
const PORT = 3000;

setupDb();

app.use(express.json()); // Parse JSON bodies to JS objects to be able to use req.body in the routes

app.use(cookieParser());  // include cookie parser middleware to parse cookies in the request

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

app.use('/api', authRoutes); // Use the auth routes defined in authRoutes.ts 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
