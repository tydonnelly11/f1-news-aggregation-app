const express = require('express')
const cors = require('cors');
require('dotenv').config();
const snoowrap = require('snoowrap');


const app = express()
const port = 3000

const reddit = getAuthorizationToken();

function getAuthorizationToken(){
  const reddit = new snoowrap({
    userAgent: 'AGENT',
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD
  });

  return reddit;
  
}


async function callRedditAPI(){
  const oneDayAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60); // Current time in Unix timestamp minus 24 hours
  

  const posts = await reddit.getSubreddit('formula1').getNew({limit: 100});
  const recentPosts = posts.filter(post => post.created_utc >= oneDayAgo);
  const filteredPosts = recentPosts.filter(post => post.link_flair_text === ':post-news: News');
  const postMedias = filteredPosts.map(post => post.title); // Assuming you want to display titles for simplicity
  return filteredPosts[3];

}


app.use(cors());

app.get('/', (req, res) => {
  res.send('Reddit Auth');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

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