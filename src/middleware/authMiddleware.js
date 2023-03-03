import {db} from "../database/database.connection.js"

export async function authValidation(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if (!token) return res.sendStatus(401);

    try {
        const session = await db.query("SELECT * FROM sessions WHERE token = $1", [token]);
        if (!session) return res.sendStatus(401)
        res.locals.sessions = session;
    } catch (err) {
        res.status(500).send(err)
    }
}