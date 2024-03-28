import axios from "axios"
import { useState, useEffect } from "react";

type Post = {
  title: string,
  
}

export const Post = () => 
{
  const [message, setMessage] = useState<string[]> ([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getRedditPosts");
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
      <h1 key={index}>{message}</h1>)

    )
    }    
</div>
  )
}