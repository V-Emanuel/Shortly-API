import { db } from "../database/database.connection.js";
import { nanoid } from "nanoid";

export async function urlShorten(req, res){
    const {url} = req.body;
    if(!url) return res.sendStatus(422);
    const shortUrl = nanoid();
    const token = res.locals;
    const sessionRows = await db.query(`SELECT * FROM sessions WHERE token = $1;`, [token]);
    const session = sessionRows.rows[0];
    try {
        await db.query(`INSERT INTO urls ('userId', url, 'shortUrl') VALUES ($1, $2, $3)`,
        [session.userId, url, shortUrl]);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getUrlId(req, res){
    const {id} = req.params;
    try {
        const url = await db.query(`SELECT id, 'shortUrl', 'url, FROM ulrs WHERE id = $1`, [id]);
        res.send(url.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
}