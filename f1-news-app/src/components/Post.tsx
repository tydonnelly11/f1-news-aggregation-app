import axios from "axios"
import { useState } from "react";

export const Post = () => 
{
  const [message, setMessage] = useState('');
  try{
    axios.get('http://localhost:3000/').
    then(function (response) {
      console.log(response)
      setMessage(response.data)
    })
  } catch (error) {
    console.error(error)
  }
  
  return (
    <div>
      <h1>{message}</h1>
    </div>
  )
}