import { sql } from '@vercel/postgres';
 
export default async function handler(request,response) {
  
  try {
    const result =
      await sql`CREATE TABLE IF NOT EXISTS f1_posts_summary (
        date_column DATE PRIMARY KEY,
        text_column TEXT
      )`;
    return response.status(200).json({ result });
  } catch (error) {
    return response.status(500).json({ error });
  }
}