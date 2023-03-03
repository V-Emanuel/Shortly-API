import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from "./routes/authRoutes.js";

dotenv.config();
const port = process.env.PORT || 5001;
const app = express();

app.use(cors());
app.use(express.json());

app.use([authRouter]);

app.listen(port, () => console.log(`Server running in port ${port}`));