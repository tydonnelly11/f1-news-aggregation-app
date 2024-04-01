
import { sql } from '@vercel/postgres';


export default async function getDataFromDatabase(req, res) {
    try {
      const  rows = await sql`SELECT * FROM f1_posts_summary_1 ORDER BY date_column DESC`;
      console.log(rows)
      res.send(rows.rows);
      
    } catch (error) {
      console.error("Failed to fetch posts from database", error);
    }

  }
