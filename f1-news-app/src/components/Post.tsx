import './component.css'

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

//Component for holding one days news articles
export const Post = (props: Articles) => 

{

  return (
    <div>
      <h3 className="date-text">Start of news for {props.date}</h3>
    <div>
    {
    props.summaries.map((message, index) => (
      <div className="post-container" key={index}>
      <span className="title-text">{message.title}</span>
      <a href={message.url} target='_blank' className="link">Link to source</a>
      <p className="summary-text">{message.summary}</p>
      </div>
      ))
    }    
  </div>
  <h3 className="date-text">End of news for {props.date}</h3>
  </div>
  )
}