import axios from "axios"
import { useState, useEffect } from "react";

type Post = {
  title: string,
  url: string,
  
}

export const Post = () => 
{
  const [message, setMessage] = useState<Post[]> ([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/posts");
        console.log(response);
        // Assuming response.data is the message you want to set
        // If response.data is an object or array, you might need to handle it differently
        setMessage(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, []);
  
  return (
    <div>
    {message.map((message, index) => (
      <div key={index}>
      <h4>{message.title}</h4>
      <p>{message.url}</p>
      </div>)

    )
    }    
</div>
  )
}