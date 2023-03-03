import {  signUp, signIn} from "../controller/Auth.js";
import { Router } from 'express';
import {validateSchema} from "../middleware/validateSchema.js"
import { userSchema , signInSchema } from "../schema/AuthSchema.js";

const authRouter = Router()

authRouter.post("/signup", validateSchema(userSchema), signUp);
authRouter.post("/signin", validateSchema(signInSchema),signIn);

export default authRouter