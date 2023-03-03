import { db } from "../database/database.connection.js";
import { nanoid } from "nanoid";

export async function urlShorten(req, res){

    const { authorization } = req.headers
    const token = authorization?.replace('Bearer ', '')
    const {url} = req.body;
    const shortUrl = nanoid(8);

    const sessionRows = await db.query(`SELECT * FROM sessions WHERE token = $1;`, [token]);
    const session = sessionRows.rows[0];
    if (!sessionRows.rows[0]) return res.sendStatus(401);
    try {
        await db.query(`INSERT INTO urls ("userId", url, "shortUrl") VALUES ($1, $2, $3)`,
        [session.userId, url, shortUrl]);
        const returnUrl = await db.query(`SELECT id, "shortUrl" FROM urls WHERE "shortUrl" = $1`, [shortUrl]);
        res.status(201).send(returnUrl.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
}



export async function getUrlId(req, res){
    const {id} = req.params;
    const url = await db.query(`SELECT id, "shortUrl", url FROM urls WHERE id = $1`, [id]);
    if(!url.rows[0]) return res.sendStatus(404);
    try {
        
        console.log(url.rows)
        res.send(url.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getOpenShortUrl(req, res){
    const {shortUrl} = req.params;
    const url = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1`, [shortUrl,]);
    if(!url) return res.sendStatus(404);
    let viewsCount = url.rows[0].views + 1;
    try {
        await db.query(`UPDATE urls SET "views"=$1 WHERE id = $2;`, [viewsCount,url.rows[0].id,]);
        res.redirect(url.rows[0].url);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function deleteUrlId(req, res){
    const {id} = req.params;
    const url = await db.query(`SELECT * FROM urls WHERE id = $1`, [id]);
    if(!url.rows[0]) return res.sendStatus(404);
    if(!url.rows[0].shortUrl) return res.sendStatus(404);
    try {
        await db.query(`DELETE FROM urls WHERE id = $1`, [id]);
        res.send(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

/*export async function usersMe(req, res){

    const token = res.locals;

    const sessionRows = await db.query(`SELECT * FROM sessions WHERE token = $1;`, [token]);
    const session = sessionRows.rows[0];
    const userRows = await db.query(`SELECT * FROM users WHERE id = $1;`, [session.userId]);
    const user = userRows.rows[0];
}*/