import express from "express";
import routes from "./routes/server";
import cors from "cors";
import { validateUserIdMiddleware } from "./middlewares/userIdMiddleware";
import { Model } from "objection"
import { knexInstance } from "./db/"

const app = express();
const PORT = 8080;

Model.knex(knexInstance)

app.use(cors());
app.use(express.json());

app.use(validateUserIdMiddleware)

app.use("/api/NotesInTheCloud", routes);

app.listen(PORT, () => {
    console.log(`Server runnig at http://localhost:${PORT}/api/NotesInTheCloud`);
});
