
import { sql } from '@vercel/postgres';


export default async function getDataFromDatabase(req, res) {
    const startDate = req.query.start
    const endDate = req.query.end
    console.log(`SELECT *
    FROM f1_posts_summary_1
    WHERE date_column >= ${startDate}
    AND date_column <= ${endDate};`)
    try {
      const  rows = await sql`SELECT *
      FROM f1_posts_summary_1
      WHERE date_column >= ${startDate}::timestamp
      AND date_column <= ${endDate}::timestamp 
      ORDER BY date_column DESC;`;
      console.log(rows)
      res.send(rows.rows, rows.rowCount);
      
    } catch (error) {
      console.error("Failed to fetch posts from database", error);
    }

  }
