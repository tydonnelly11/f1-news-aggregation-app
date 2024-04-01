import express, { json } from 'express'
import cors from 'cors';
import dotenv from 'dotenv'
import snoowrap from 'snoowrap';
import cron from 'node-cron';
import { sql } from '@vercel/postgres';
import fetch from 'node-fetch';
import GetPost from './api/get-posts.js';


const app = express()
const port = 3001
dotenv.config();







app.use(cors());

app.get('/', (req, res) => {
  res.send('Reddit Auth');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//Sends the posts to the client
app.get('/getRedditPosts', async (req, res) => {
  // generateReportForDay();
  console.log("DONE");
  
});

app.get('/api/get-posts', (req, res) => {
  GetPost();
  console.log("DONE");

});




app.get('/posts', (req, res) => {

  getDataFromDatabase().then((result) => {
    console.log(result);
    res.send(result.rows)
  });

  async function getDataFromDatabase() {
    try {
      const  rows = await sql`SELECT * FROM f1_posts_summary_1 ORDER BY date_column DESC`;
      console.log(rows)
      
      return rows;
    } catch (error) {
      console.error("Failed to fetch posts from database", error);
    }
  }


  // formatReport();
  // getDataFromDatabase();
  // const sql = `SELECT * FROM f1_posts_summary ORDER BY date_column DESC`;
  // try {
  //   const {result} = client.query(sql);
  //   res.json(result);
  // } catch (error) {
  //   console.error("Failed to fetch posts from database", error);
  //   res.status(500).send("Error fetching posts");
  // }


});

