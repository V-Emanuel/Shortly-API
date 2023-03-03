import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { db } from "../database/database.connection.js";
import { userSchema, signInSchema } from '../schema/AuthSchema.js';

export async function signUp(req, res) {
    const user = req.body;
    const passwordHash = bcrypt.hashSync(user.password, 5);
    const validation = userSchema.validate(user, { abortEarly: true });
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }
    const userExists = await db.query("SELECT * FROM users WHERE email = $1;", [user.email]);
    if (userExists.rows[0]) return res.status(409).send("Email já cadastrado.");

    try {
        await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
            [user.name, user.email, passwordHash]);
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function signIn(req, res) {
    const user = req.body;
    const validation = signInSchema.validate(user, { abortEarly: true });
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }
    const userConfirmation = await db.query(`SELECT * FROM users WHERE email = $1;`, [user.email]);
    const userExists = userConfirmation.rows[0];
    if (!userExists) return res.sendStatus(401);
    if (bcrypt.compareSync(userExists.password, user.password)) return res.sendStatus(401)

    try {

        const token = uuidV4();
        await db.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2);`, [userExists.id, token]);
        console.log(bcrypt.compareSync(userExists.password, user.password))
        console.log(userExists)
        res.sendStatus(200)
    } catch (error) {
        res.status(500).send(error);
    }

}

