import React, { useEffect, useRef } from 'react';
import axios from 'axios';
declare global {
    interface Window {
        twttr: any;
    }
}

interface TweetEmbedProps {
  tweetUrl: string;
}

const TweetEmbed: React.FC<TweetEmbedProps> = ({ tweetUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to load the Twitter widgets.js script
    


    
    // Function to render the tweet using Twitter's widgets API
    const getEmbed = async () => {
      const response = await axios.get("https://publish.twitter.com/oembed", {
        params: {
          url : tweetUrl,
        }
      })

      console.log(response.data.html)
      
    };

    // Helper function to extract the tweet ID from the tweet URL
    

    getEmbed()
  }, []);

  return <div ref={containerRef} />;
};

export default TweetEmbed;