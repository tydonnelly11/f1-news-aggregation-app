



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
  const datePart = props.date.split("T")[0];
  const [year, month, day] = datePart.split("-");
    
  const formattedDate = [month, day, year].join("-");
    
  return (
    <div>
      <h3>Start of news for {formattedDate}</h3>
    <div>
    {
    props.summaries.map((message, index) => (
      <div key={index}>
      <h4>{message.title}</h4>
      <p>{message.summary}</p>
      </div>
      ))
    }    
  </div>
  <h3>End of news for {formattedDate}</h3>
  </div>
  )
}