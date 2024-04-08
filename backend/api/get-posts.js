import dotenv from 'dotenv'
import snoowrap from 'snoowrap';
import { sql } from '@vercel/postgres';
import fetch from 'node-fetch';

dotenv.config();  

  


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
//Vercel serverless function
export default async function GetPost(res,req) {
  const reddit = getAuthorizationToken();

  const [postsToBeSummarized, TwitterPosts] = await callRedditAPI(reddit);
  console.log(postsToBeSummarized);
 

  
  // const summarizedPosts = await summarizeWithDelay(postsToBeSummarized)
  // console.log(summarizedPosts);
  // formatReport(summarizedPosts, TwitterPosts);

  return new Response('Posts have been summarized and saved to the database')

}

//This function waits for 2.5 seconds before processing the next post
function delay(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

//Summarizes the posts with a delay of 2.5 seconds
async function summarizeWithDelay(posts) {
  const results = [];

  for (let post of posts) {
      try {
          // Wait for the summary to be fetched
          const summary = await summarizePostsFromUrl(post.url);
          results.push({ title: post.title, summary, url: post.url});
      } catch (error) {
          //If the article is behind a paywall or is a screenshot of a social media post, the summary will be the URL
          results.push({ 
              title: post.title, 
              summary: `Could not generate summary, here is the articles URL for more reading ${post.url}` 
          });
      }
      await delay(2500);
  }

  return results;
}

//Calls API to get new posts from Reddit and filters them based on news and upvotes
async function callRedditAPI(reddit){
  const oneDayAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60); // Current time in Unix timestamp minus 24 hours
  

  const posts = await reddit.getSubreddit('formula1').getNew({limit: 100});
  const recentPosts = posts.filter(post => post.created_utc >= oneDayAgo); //Get posts from last day
  const filteredPosts = recentPosts.filter(post => post.link_flair_text === ':post-news: News'); //Only posts flagged as news
  const sortedPosts = filteredPosts.sort((a, b) => b.ups - a.ups); //Sort by upvotes
  const postMedias = sortedPosts.map(post => ({ title: post.title, url: post.url })); //Map the title and URL


  const regexTwitter = /https:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/;
  const regexX = /https:\/\/x\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/;

  
  const TwitterPosts = postMedias.filter(post => post.url.match(regexTwitter) || post.url.match(regexX));
  const nonTwitterPosts = postMedias.filter(post => !post.url.match(regexTwitter) && !post.url.match(regexX));
  

  



  
  return nonTwitterPosts, TwitterPosts;


}

//Formats date to be saved in the database
function formatReport(summaries, tweets) {
    const now = new Date();
    now.setDate(now.getDate() - 1); //Get the date of yesterday
    const formattedDate = now.toISOString().slice(0, 10).replace('T', ''); //Make date format compatible with SQL
  
    savePostToDatabase(formattedDate, summaries, tweets);
    
    
  }
  
  async function summarizePostsFromUrl(url){
  
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${process.env.AI21_API_KEY}`
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
        return `This article is behind a paywall, is in a language other than english or is a screenshot of a social media post, please click the url above to view it.`;
      }
          const data = await response.json();
          return data.summary; 
      } 
    catch (error) {
          console.error('Failed to fetch summary:', error);
          return "Error fetching summary";
      }
    }
  
  
  //Saves the post to the database
  async function savePostToDatabase(date, summaries, tweets) {
    
    const text = { summaries, tweets };
    const data = JSON.stringify(text);
  
      try {
          await sql`INSERT INTO f1_posts_summary_1 (date_column, text_column) VALUES (${date}, ${data})`;
          console.log("Post saved to database");
      } catch (error) {
          console.error("Failed to save post to database", error);
      }
    
  }
  
  
  