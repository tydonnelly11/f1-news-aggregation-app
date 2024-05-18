import { useState, useEffect, useRef, } from "react";
import axios from "axios"
import { Post } from "./Post";
import TweetFrame from "./TwitterEmbedd";
// import TweetEmbed from "./TwitterEmbedd";


//Holds all the news articles for a given day
type Articles = {
    date : string,
    summaries : [
      {
        title: string,
        summary: string
      }

    ]
    tweets : Array<string>    
}

//Component for holding news articles for a given week.
export const Page = () => {

    const [data, setData] = useState<Articles[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const postRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);


    const intialDate = new Date();
    intialDate.setDate(intialDate.getDate() - 1);

    const toUTCDate = (date: Date) => {
      return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    };
  

    const [startDate, setStartDate] = useState<Date>(toUTCDate(intialDate));
    const [endDate, setEndDate] = useState<Date>(toUTCDate(new Date(intialDate.getTime() - 7 * 24 * 60 * 60 * 1000)));
    const [isToggle, setToggle] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1); // Current page

    const formatDateRange = (start: Date, end: Date) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
      const startFormatted = new Intl.DateTimeFormat('en-US', options).format(start);
      const endAdjusted = new Date(end.getTime() + 24 * 60 * 60 * 1000); // Add one day
      const endFormatted = new Intl.DateTimeFormat('en-US', options).format(endAdjusted);
      return `News for ${startFormatted} to ${endFormatted}`;
    };

    

    useEffect(() => {
      const getTotalPosts = async () => {
        setLoading(true);
        try {
          const response = await axios.get("https://f1-news-aggregation-app-server.vercel.app/api/get-total-post-number");
          console.log(response.data);
          const weekCount = Math.ceil(response.data / 7);
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
            const response = await axios.get("https://f1-news-aggregation-app-server.vercel.app/api/posts", {
              params: {
                end: startDate.toISOString().split('T')[0] + ' 00:00:00', //End of current week
                start: endDate.toISOString().split('T')[0] + ' 00:00:00', //Start of current week
              }
            
            });
            console.log(endDate.toDateString().slice(4));
            console.log(endDate.toISOString().split('T')[0] + ' 00:00:00');
              setData(response.data.map((item: { date_column: any; text_column: any; tweets_column : any;}) => {
              // Create a Date object from the item's date_column
              const itemDate = new Date(item.date_column);
          
              const offset = 5; // CDT offset to UTC in hours
              const utcDate = new Date(itemDate.getTime() + offset * 3600 * 1000); // Adjust the date to UTC
            
              const formattedDate = utcDate.toLocaleDateString('en-US', {
                month: '2-digit', // Use two digits for the month
                day: '2-digit'    // Use two digits for the day
              });
              
            
              // Return the formatted date and summaries
              return {
                date: formattedDate,
                summaries: item.text_column,
                tweets : item.tweets_column
              };
            }));
          
            console.log(data);

              postRefs.current = response.data.map((_: any, i: number) => postRefs.current[i] || null); //Takes each post and assigns it to a ref
            
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        };
      
    
        fetchPosts();
      }, [currentPage]);


  //Scrolls to date when clicked
  const scrollToPost = (index: number) => {
    postRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
          block: 'start',
        });
      };

    const handleNext = () => {
        setCurrentPage((prevCurrentPage) => Math.min(prevCurrentPage + 1, totalPages));
        setStartDate(new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000));
        setEndDate(new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    };

    // Function to navigate to the previous page
    const handlePrevious = () => {
        setCurrentPage((prevCurrentPage) => Math.max(prevCurrentPage - 1, 1));
        setStartDate(new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000));
        setEndDate(new Date(endDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    };

    if (loading) {
        return <div className="loading-page">
            <h1>Loading posts...</h1>
            <img className="loading-gif" src="/loading-gif.gif"></img>
        </div>;
    } else {

    return (
      
        <div className="page">
            <nav className={`navbar ${isToggle ? 'navbar' : 'navbar-toggled'}`}>
              <button className={`${isToggle ? 'navbar-toggle-btn' : 'navbar-toggled-btn'}`} onClick={() => setToggle(!isToggle)} >☰</button>
              {isToggle && ( <div className="navbar-links">
              <p className="navbar-title">{formatDateRange(startDate, endDate)} </p>
              <button className="week-button-top" onClick={handlePrevious} disabled={currentPage === 1}>Next Week</button>
              <div className="nav-button-group">
                {data.map((article, index) => (

                  <button className="nav-button" key={index} onClick={() => scrollToPost(index)}>
                    {article.date}
                  </button>
                  
                ))}
              </div>
              <button className="week-button-bot" onClick={handleNext} disabled={currentPage === totalPages}>Previous Week</button>
              </div>)}

            </nav>
          
        <div>
        {
        data.map((NewsForDay, index) => (
          <div ref={el => postRefs.current[index] = el} key={index}>
              <h3 className="date-text">Start of news for {NewsForDay.date}</h3>
          <Post date={NewsForDay.date} summaries={NewsForDay.summaries} />
          {/* { <TweetFrame htmlContent={NewsForDay.tweets}/> } */}
          <h3 style={{borderBottom : "3px dashed red" , paddingBottom: "25px"}} className="date-text">End of news for {NewsForDay.date}</h3>


        </div>
        ))
        }


        </div>
        <div className="week-btn-group">
            <button className="week-button" onClick={handlePrevious} disabled={currentPage === 1}>Next Week</button>
                <h3 >Week {startDate.toDateString().slice(4)} to {endDate.toDateString().slice(4)}</h3>
            <button className="week-button" onClick={handleNext} disabled={currentPage === totalPages}>Previous Week</button>
            </div>
        </div>
        
    )
    }
}