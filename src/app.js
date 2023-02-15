import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'

dotenv.config();
const port = process.env.PORT || 5001;
const app = express();

app.use(cors());
app.use(express.json());
app.use();
app.listen(port, () => console.log(`Server running in port ${port}`));