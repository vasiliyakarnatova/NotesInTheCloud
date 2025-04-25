import express from 'express';
import authRoutes from './src/routes/authRoutes'; // <-- Убедись, че пътят е правилен
import bodyParser from 'body-parser';
import cors from 'cors';
import setupDb from './src/db/db-setup';

const app = express();
const PORT = 3000;

setupDb();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
