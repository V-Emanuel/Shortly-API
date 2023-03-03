import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import {db }from "../database/database.connection.js";
import { userSchema, signInSchema } from '../schema/AuthSchema.js';

export async function signUp(req, res) {
    const user = req.body;
    const passwordHash = bcrypt.hashSync(user.password, 10);
    /*  const validation = userSchema.validate(user, { abortEarly: true });
      if (validation.error) {
          const errors = validation.error.details.map((detail) => detail.message);
          return res.status(422).send(errors);
      }*/
    const userExists = await db.query("SELECT * FROM users WHERE email = $1;", [user.email]);
    if (!userExists) return res.status(400).send("Email já cadastrado.");

    try {
        await db.query("INSERT INTO users (name,email, password, created_at) VALUES ($1, $2, $3, $4);",
            [user.name, user.email, passwordHash, date.now()]);
        res.sendStatus(409);
    } catch (error) {
        res.status(500).send(err);
    }
}

export async function signIn(req, res) {
    const { email, password } = res.body;
    /*const validation = signInSchema.validate({ email, password }, { abortEarly: true });
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }*/
    const userExists = await db.query("SELECT * FROM users WHERE email = $1;", [email]);
    if (!userExists) return res.status(400);

    try {
        if (userExists && bcrypt.compareSync(password, userExists.password)) {
            const token = uuidV4();
            await db.query("INSERT INTO sessions ('userId', token) VALUES ($1, $2);", [userExists.id, token]);
        }
    } catch (error) {
        res.status(500).send(err);
    }

}