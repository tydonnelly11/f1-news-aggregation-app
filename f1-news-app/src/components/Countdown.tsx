
import { useEffect, useState } from "react"
// import axios from "axios"
import './component.css'

//Hold countdown to next GP
export const Countdown = () => {

    const [timeLeft, setTimeLeft] = useState<string>();

    useEffect(() => {
        const targetDate = new Date("May 19, 2024, 8:00:00").getTime(); //Current start time of Imola GP

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            //Calculate days, hours, minutes, seconds
           

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            

            setTimeLeft(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");

            // If the count down is over, write some text 
            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft("Imola GP has started!");
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

   
    return (
        <div>
            <h2 className="countdown">Countdown to start of Imola GP: {timeLeft}</h2>
        </div>
    )


}