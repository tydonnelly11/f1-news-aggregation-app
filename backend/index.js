import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv'
import snoowrap from 'snoowrap';
import db from './db.js';
import cron from 'node-cron';


const app = express()
const port = 3000
dotenv.config();


//Cron job to run every day at 11pm 
cron.schedule('0 23 * * *',  () => {
formatReport();
});


const reddit = getAuthorizationToken();

//This function gets 0Auth token from Reddit
function getAuthorizationToken(){
  const reddit = new snoowrap({
    userAgent: 'F1-news-app by /u/Infamous-Ad-4143',
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD
  });

  return reddit;
  
}

//Calls API to get new posts from Reddit and filters them based on news and upvotes
async function callRedditAPI(){
  const oneDayAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60); // Current time in Unix timestamp minus 24 hours
  

  const posts = await reddit.getSubreddit('formula1').getNew({limit: 100});
  const recentPosts = posts.filter(post => post.created_utc >= oneDayAgo);
  const filteredPosts = recentPosts.filter(post => post.link_flair_text === ':post-news: News');
  const sortedPosts = filteredPosts.sort((a, b) => b.ups - a.ups);
  const postMedias = sortedPosts.map(post => ({ title: post.title, url: post.url }));

  
   // Assuming you want to display titles for simplicity
  return postMedias;


}


app.use(cors());

app.get('/', (req, res) => {
  res.send('Reddit Auth');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//Sends the posts to the client
app.get('/getRedditPosts', async (req, res) => {
  try {
    const postMedias = await callRedditAPI(reddit);
    console.log(postMedias);
    res.json(postMedias); // Send the postMedias back to the client
  } catch(error) {
    console.error("Failed to fetch Reddit posts", error);
    res.status(500).send("Error fetching posts");
  }  
  
});

function formatReport() {
  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 10).replace('T', ' '); //Make date format compatible with SQL
  const text = "Fernando Alonso Eyeing Red Bull Seat for 2025: Fernando Alonso is reportedly making strong efforts to secure a seat at Red Bull Racing for the 2025 season, according to sources close to The Race. His interest suggests a potential shift in the driver market and Alonso''s aim for a competitive ride as his career progresses."

  savePostToDatabase(formattedDate, text);
  
  
}

function savePostToDatabase(date, text) {
  
  const sql = `INSERT INTO f1_posts_summary (date_column, text_column) VALUES (?, ?)`;
  db.run(sql, [date, text], (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("A new post has been saved to the database.");
  });
}

app.get('/posts', (req, res) => {
  const sql = `SELECT * FROM f1_posts_summary ORDER BY date_column DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error fetching posts from the database");
      return;
    }
    res.json(rows);
  });
});