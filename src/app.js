import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from "./routes/authRoutes.js";
import urlsRouter from './routes/urlsRoutes.js';
import { db } from './database/database.connection.js';

dotenv.config();
const port = process.env.PORT || 5001;
const app = express();

app.use(cors());
app.use(express.json());

app.use([authRouter, urlsRouter]);

app.get('/users', async(req, res) =>{
    try {
        const customers = await db.query('SELECT * FROM users;');
        res.send(customers.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.listen(port, () => console.log(`Server running in port ${port}`));