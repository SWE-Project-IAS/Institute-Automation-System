import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect,useState } from 'react';
import { useParams } from "react-router-dom";
import { Views } from 'react-big-calendar';

const localizer = momentLocalizer(moment)

function MyCalendar() {
    const {id} = useParams();
    const [myEventsList, setMyEventsList] = useState([]);
    const [view, setView] = useState(Views.WEEK);
    const [date, setDate] = useState(new Date());


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
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            defaultView={view}
            view={view} // Include the view prop
            date={date} // Include the date prop
            onView={(view) => setView(view)}
            onNavigate={(date) => {
                setDate(new Date(date));
            }}
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