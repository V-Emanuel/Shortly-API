

import { signIn, signUp} from "../controller/Auth.js";
import { Router } from 'express';
import {validateSchema} from "../middleware/validateSchema.js"
import { userSchema , signInSchema } from "../schema/AuthSchema.js";

const authRouter = Router()

authRouter.post("/sign-up", validateSchema(userSchema), signUp);
authRouter.post("/sign-in", validateSchema(signInSchema),signIn);

export default authRouter