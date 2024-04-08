import React, { useEffect, useRef } from 'react';
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


    const loadTwitterScript = () => {
        if (!window.twttr) { // Only load the script if it's not already loaded
            const script = document.createElement('script');
            script.src = 'https://platform.twitter.com/widgets.js';
            script.async = true;
            script.charset = 'utf-8';
            document.body.appendChild(script);
        }
    };

    // Function to render the tweet using Twitter's widgets API
    const renderTweet = () => {
      if (window.twttr && containerRef.current) {
        window.twttr.widgets.createTweetEmbed(
          extractTweetId(tweetUrl),
          containerRef.current,
          {
            theme: 'light', // You can set options here (e.g., 'light' or 'dark')
          }
        );
      }
    };

    // Helper function to extract the tweet ID from the tweet URL
    const extractTweetId = (url: string) => {
      const match = url.match(/\/status\/(\d+)/);
      return match ? match[1] : '';
    };

    loadTwitterScript();
    renderTweet();
  }, [tweetUrl]);

  return <div ref={containerRef} />;
};

export default TweetEmbed;