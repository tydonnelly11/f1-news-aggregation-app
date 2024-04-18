import { useEffect } from "react";

const TweetFrame = ( props : { htmlContent: Array<string> }) => {

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  if(props.htmlContent === null || props.htmlContent.length === 0){
    return <div></div>
  }
  else{

  
  return (
    <div className="tweet-container">
      <h2 className="countdown">Tweets</h2>
    <ul className="tweet-list">
      {
        props.htmlContent.map((htmlContent, index) => (
          <li className='tweet' key={index} dangerouslySetInnerHTML={{ __html: htmlContent }} />
        ))
      }
    </ul>
    </div>
  );
  }
};

export default TweetFrame;