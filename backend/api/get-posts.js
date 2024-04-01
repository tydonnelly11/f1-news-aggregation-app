import dotenv from 'dotenv'
import snoowrap from 'snoowrap';
import { sql } from '@vercel/postgres';
import fetch from 'node-fetch';

dotenv.config();

const reddit = getAuthorizationToken();

// //Cron job to run every day at 11pm 
// cron.schedule('0 23 * * *',  () => {
//   generateReportForDay();
  

  
// });

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
export default async function GetPost() {
  console.log("CRON");
  const reddit = getAuthorizationToken();

  const postsToBeSummarized = await callRedditAPI(reddit);
 

  
  const summarizedPosts = await summarizeWithDelay(postsToBeSummarized)
  console.log(summarizedPosts);
  formatReport(summarizedPosts);
}

function delay(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

async function summarizeWithDelay(posts) {
  const results = [];

  for (let post of posts) {
      try {
          // Wait for the summary to be fetched
          const summary = await summarizePostsFromUrl(post.url);
          results.push({ title: post.title, summary });
      } catch (error) {
          // Handle any errors
          results.push({ 
              title: post.title, 
              summary: `Could not generate summary, here is the articles URL for more reading ${post.url}` 
          });
      }
      // Wait for 1/4 of a second (250 milliseconds) before processing the next post
      await delay(250);
  }

  return results;
}

//Calls API to get new posts from Reddit and filters them based on news and upvotes
async function callRedditAPI(reddit){
  const oneDayAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60); // Current time in Unix timestamp minus 24 hours
  

  const posts = await reddit.getSubreddit('formula1').getNew({limit: 100});
  const recentPosts = posts.filter(post => post.created_utc >= oneDayAgo);
  const filteredPosts = recentPosts.filter(post => post.link_flair_text === ':post-news: News');
  const sortedPosts = filteredPosts.sort((a, b) => b.ups - a.ups);
  const postMedias = sortedPosts.map(post => ({ title: post.title, url: post.url }));

  
   // Assuming you want to display titles for simplicity
  return postMedias;


}

function formatReport(listOfPosts) {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 10).replace('T', ''); //Make date format compatible with SQL
  
    savePostToDatabase(formattedDate, listOfPosts);
    
    
  }
  
  async function summarizePostsFromUrl(url){
  
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer DGvwoPA498GcAz7DmTVTBqblwojI5B6l'
      },
      body: JSON.stringify({
        sourceType: 'URL',
        source: `${url}`,
      })
    };
    try{
      const response = await fetch('https://api.ai21.com/studio/v1/summarize', options);
      if (!response.ok){
        console.log('Failed to fetch summary:')
        return `This article is behind a paywall or is a screenshot of a social media post, here is url to view the source instead: ${url}`;
      }
          const data = await response.json();
          // Make sure you return something here after the async operation is complete
          return data.summary; // Assuming the API returns an object with a 'summary' property
      } 
    catch (error) {
          console.error('Failed to fetch summary:', error);
          // Return a default value or throw, depending on how you want to handle errors
          return "Error fetching summary";
      }
    }
  
  
  
  async function savePostToDatabase(date, text) {
    
    const data = JSON.stringify(text);
  
      try {
          await sql`INSERT INTO f1_posts_summary_1 (date_column, text_column) VALUES (${date}, ${data})`;
          console.log("Post saved to database");
      } catch (error) {
          console.error("Failed to save post to database", error);
      }
    
  }
  
  
  