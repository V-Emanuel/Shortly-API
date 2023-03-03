import { urlShorten, getUrlId } from '../controller/Url.js';
import { Router } from 'express';
import { authValidation } from '../middleware/authMiddleware.js';

const urlsRouter = Router()

urlsRouter.post("/urls/shorten", authValidation, urlShorten);
urlsRouter.get("/urls/:id",getUrlId);

export default urlsRouter