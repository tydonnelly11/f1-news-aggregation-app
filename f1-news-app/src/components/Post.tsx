import './component.css'
// import TweetEmbed from './TwitterEmbedd'

type Articles = {
  date : string,
  summaries : [
    {
      title: string,
      summary: string,
      url?: string
    }
  ]
  
}

//Component for holding news articles for a given day
export const Post = (props: Articles) => {

  const summariesToDipslay = props.summaries.filter((summary) =>  (
    summary.summary !== "We can not provide a summary for this article at this time, please click the url above to view it."
    &&
    summary.summary !== "This article is behind a paywall, is in a language other than english or is a screenshot of a social media post, please click the url above to view it."
  ));
  console.log(summariesToDipslay)

  return (
    <div>
      {/* <h3 className="date-text">Start of news for {props.date}</h3> */}
    <div>
    {
    summariesToDipslay.map((message, index) => 
      (
      <div className="post-container" key={index}>
      {/* {(regex.test(message.url)) && <TweetEmbed tweetUrl={message.url} />} */}
      <span className="title-text">{message.title}</span>
      <a href={message.url} target='_blank' className="link">Link to source</a>
      <p className="summary-text">{message.summary}</p>
      </div>
      ))
    }    
  </div>
  {/* <h3 style={{borderBottom : "3px dashed red" , paddingBottom: "25px"}} className="date-text">End of news for {props.date}</h3> */}
  </div>
  )
}