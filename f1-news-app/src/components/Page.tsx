import { useState, useEffect } from "react";
import axios from "axios"
import { Post } from "./Post";


//Holds all the news articles for a given day
type Articles = {
    date : string,
    summaries : [
      {
        title: string,
        summary: string
      }
    ]
    
}



export const Page = () => {

    const [data, setData] = useState<Articles[]>([]);

    
    useEffect(() => {
        const fetchPosts = async () => {
          try {
            const response = await axios.get("http://localhost:3001/posts");
            console.log(response);
            
            setData(response.data);
            console.log(data);
            
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchPosts();
      }, []);

    return (
        <div>
        {
        data.map((NewsForDay) => (
            <Post date={NewsForDay.date} summaries={NewsForDay.summaries}/>
        ))
        }

        </div>
    )
}