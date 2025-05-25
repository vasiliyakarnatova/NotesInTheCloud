import express from "express";
import routes from "./routes/server";
import cors from "cors";
import { validateUserIdMiddleware } from "./middlewares/userIdMiddleware";
import setupDb from '../../db/db-setup';
import { accessToServerMiddleware } from "./middlewares/accessMiddleware";

const app = express();
const PORT = 8081;

setupDb()

app.use(cors());
app.use(express.json());

app.use(validateUserIdMiddleware);
app.use(accessToServerMiddleware);

app.use("/api/NotesInTheCloud", routes);

app.listen(PORT, () => {
    console.log(`Server runnig at http://localhost:${PORT}/api/NotesInTheCloud`);
});
