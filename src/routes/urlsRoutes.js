import { urlShorten, getUrlId, getOpenShortUrl, deleteUrlId, usersMe, rankingUsers } from '../controller/Url.js';
import { Router } from 'express';
import { authValidation } from '../middleware/authMiddleware.js';
import { validateSchema } from "../middleware/validateSchema.js"
import { urlSchema } from "../schema/UrlSchema.js"

const urlsRouter = Router()

urlsRouter.post("/urls/shorten", validateSchema(urlSchema), urlShorten);
urlsRouter.get("/urls/:id", getUrlId);
urlsRouter.get("/urls/open/:shortUrl", getOpenShortUrl);
urlsRouter.delete("/urls/:id", deleteUrlId);
urlsRouter.get("/users/me", usersMe);
urlsRouter.get("/ranking", rankingUsers);

export default urlsRouter

