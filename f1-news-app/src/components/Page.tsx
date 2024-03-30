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
    const [loading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState(1); // Current page
    const totalPages = 1; // Total number of pages

    
    useEffect(() => {
        const fetchPosts = async () => {
          setLoading(true);
          try {
            const response = await axios.get("https://f1-news-aggregation-app-server.vercel.app/posts");
            setData(response.data.map((item: { date_column: any; text_column: any; }) => ({
                date: item.date_column,
                summaries: item.text_column,
              })));
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchPosts();
      }, [currentPage]);

    const handleNext = () => {
        setCurrentPage((prevCurrentPage) => Math.min(prevCurrentPage + 1, totalPages));
    };

    // Function to navigate to the previous page
    const handlePrevious = () => {
        setCurrentPage((prevCurrentPage) => Math.max(prevCurrentPage - 1, 1));
    };

    if (loading) {
        return <h1>Loading...</h1>;
    } else {

    return (
        <div>
        <div>
        {
        data.map((NewsForDay, index) => (
            <Post key={index} date={NewsForDay.date} summaries={NewsForDay.summaries}/>
        ))
        }


        </div>
        <div>
            <button onClick={handlePrevious} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
        
    )
    }
}