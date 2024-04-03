import './component.css'

type Articles = {
  date : string,
  summaries : [
    {
      title: string,
      summary: string
    }
  ]
  
}
//Component for holding one days news articles
export const Post = (props: Articles) => 

{
  console.log(props);
  console.log(props.date)
  const datePart = props.date.split("T")[0];
  const [year, month, day] = datePart.split("-");
    
  const formattedDate = [month, day, year].join("-");
    
  return (
    <div>
      <h3 className="date-text">Start of news for {formattedDate}</h3>
    <div>
    {
    props.summaries.map((message, index) => (
      <div key={index}>
      <span className="title-text">{message.title}</span>
      <p className="summary-text">{message.summary}</p>
      </div>
      ))
    }    
  </div>
  <h3>End of news for {formattedDate}</h3>
  </div>
  )
}