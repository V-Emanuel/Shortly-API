import { db } from "../database/database.connection.js";
import { nanoid } from "nanoid";

export async function urlShorten(req, res) {

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    const { url } = req.body;
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



export async function getUrlId(req, res) {
    const { id } = req.params;
    const url = await db.query(`SELECT id, "shortUrl", url FROM urls WHERE id = $1`, [id]);
    if (!url.rows[0]) return res.sendStatus(404);
    try {

        console.log(url.rows)
        res.send(url.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getOpenShortUrl(req, res) {

    const { shortUrl } = req.params;

    const urlRows = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1`, [shortUrl]);
    if (!urlRows.rows[0]) return res.sendStatus(404);
    const url = urlRows.rows[0];

    let visitCount = Number(url.visitCount) + 1;
    try {
        await db.query(`UPDATE urls SET "visitCount"=$1 WHERE id = $2;`, [visitCount, url.id]);
        res.redirect(url.url);
    } catch (error) {
        res.status(500).send(error.message);
    }

}

export async function deleteUrlId(req, res) {

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    const sessionRows = await db.query(`SELECT * FROM sessions WHERE token = $1;`, [token]);
    if (!sessionRows.rows[0]) return res.sendStatus(401);
    const session = sessionRows.rows[0];
    const { id } = req.params;
    const url = await db.query(`SELECT * FROM urls WHERE id = $1`, [id]);
    if (!url.rows[0]) return res.sendStatus(404);
    if (!url.rows[0].shortUrl) return res.sendStatus(404);
    if(session.userId != url.userId) return res.sendStatus(401);
    try {
        await db.query(`DELETE FROM urls WHERE id = $1`, [id]);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function usersMe(req, res) {

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    const sessionRows = await db.query(`SELECT * FROM sessions WHERE token = $1;`, [token]);
    if (!sessionRows.rows[0]) res.sendStatus(401);
    const session = sessionRows.rows[0];
    const userRows = await db.query(`SELECT * FROM users WHERE id = $1;`, [session.userId]);
    const user = userRows.rows[0];

    try {
        const userInformations = db.query(`SELECT 
        users.id AS "id",
        users.name AS "name",
        SUM(urls."visitCount") AS "visitCount",
        json_agg(
            json_build_object(
                'id', urls.id,
                'shortUrl', urls."shortUrl",
                'url', urls.url,
                'visitCount', urls."visitCount"
            )
        ) AS "shortenedUrls"
    FROM 
        urls 
        JOIN users ON urls."userId" = users.id 
    WHERE 
        users.id = $1
    GROUP BY 
        users.id;
    `, [user.id])
    return res.status(200).send(userInformations)
    console.log(session)
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function rankingUsers(req, res){
    try {
        const raking = await db.query(`SELECT users.name, users.id, 
        COUNT(urls.url) AS "linksCount", 
        SUM(urls."visitCount") AS "visitCount"
        FROM urls
        LEFT JOIN users ON urls."userId" = users.id
        GROUP BY users.id
        ORDER BY "visitCount" DESC
        LIMIT 10`);
    
        res.status(200).send(raking.rows);
      } catch (error) {
        res.status(500).send(error.message);
      }
}