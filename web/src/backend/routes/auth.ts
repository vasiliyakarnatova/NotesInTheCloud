import express, { Request, Response } from 'express';
import { registerUser } from '../controllers/registerController';
import { loginUser } from '../controllers/loginController';
import { isAuthenticated } from "../middlewares/authMiddleware";
import { logoutUser } from '../controllers/logOut.ts';
import { currentUser } from '../utils/utils';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get("/home", isAuthenticated, (req, res) => {  // Check if user is logged in before accessing this route in the middleware
  res.status(StatusCodes.OK).json({ message: "Welcome to your home page!" });
});

router.post("/logout", logoutUser);

router.get("/current-user", currentUser); // current-user is used in protected route to check if the user is logged in and if he is, we return the current user

export default router;
