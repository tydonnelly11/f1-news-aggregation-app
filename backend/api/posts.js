
import { sql } from '@vercel/postgres';


export default async function getDataFromDatabase() {
    try {
      const  rows = await sql`SELECT * FROM f1_posts_summary_1 ORDER BY date_column DESC`;
      console.log(rows)
      
      return rows;
    } catch (error) {
      console.error("Failed to fetch posts from database", error);
    }
  }
