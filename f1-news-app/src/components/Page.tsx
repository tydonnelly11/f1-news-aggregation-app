import { useState, useEffect, useRef, } from "react";
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
    const postRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);

    const [currentPage, setCurrentPage] = useState(1); // Current page

    useEffect(() => {
      const getTotalPosts = async () => {
        setLoading(true);
        try {
          const response = await axios.get("https://f1-news-aggregation-app-server.vercel.app/api/get-total-post-number");
          console.log(response.data);
          const weekCount = Math.floor(response.data / 7) + 1;
          setTotalPages(weekCount);
          

          
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      getTotalPosts();
    }, [])

    
    useEffect(() => {
        const fetchPosts = async () => {
          setLoading(true);
          try {
            const response = await axios.get("https://f1-news-aggregation-app-server.vercel.app/api/posts");
            setData(response.data.map((item: { date_column: any; text_column: any; }) => ({
              date: new Date(item.date_column).toLocaleDateString('en-US', {
                month: '2-digit', // Use two digits for the month
                day: '2-digit'    // Use two digits for the day
              }),
                summaries: item.text_column,
              })));

              postRefs.current = response.data.map((_: any, i: number) => postRefs.current[i] || null);
            


          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        };
      
    
        fetchPosts();
      }, [currentPage]);

  const scrollToPost = (index: number) => {
    postRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
          block: 'start',
        });
      };

    const handleNext = () => {
        setCurrentPage((prevCurrentPage) => Math.min(prevCurrentPage + 1, totalPages));
    };

    // Function to navigate to the previous page
    const handlePrevious = () => {
        setCurrentPage((prevCurrentPage) => Math.max(prevCurrentPage - 1, 1));
    };

    if (loading) {
        return <div className="loading-page">
            <h1>Loading posts...</h1>
            <img className="loading-gif" src="/loading-gif.gif"></img>
        </div>;
    } else {

    return (
      
        <div>
            <nav className="navbar">
          {data.map((article, index) => (

            <button className="nav-button" key={index} onClick={() => scrollToPost(index)}>
              {article.date}
            </button>
          ))}
        </nav>
        <div>
        {
        data.map((NewsForDay, index) => (
          <div ref={el => postRefs.current[index] = el} key={index}>
          <Post date={NewsForDay.date} summaries={NewsForDay.summaries} />
        </div>
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