import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect,useState } from 'react';
import { useParams } from "react-router-dom";

const localizer = momentLocalizer(moment)

function MyCalendar() {
    const {id} = useParams();
    const [myEventsList, setMyEventsList] = useState([]);


    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/course/${id}`);
                const data = await response.json()
                if (response.ok) {
                    setMyEventsList(data.eventList);
                } else {
                    console.error('Error fetching event data:', data.error);
                }
            } catch (error) {
                console.error('Error fetching event data:', error);
            }
        };

        fetchEventData();
    }, []);

      
    return (
        <div className='calendar-box'>
            <Calendar
            views={['month']}
            localizer={localizer}
              events={myEventsList}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 350 }}
            />
        </div>
    );
};

export default MyCalendar