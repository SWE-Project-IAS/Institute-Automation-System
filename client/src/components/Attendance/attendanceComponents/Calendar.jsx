import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { RoleContext } from "../../../context/Rolecontext";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";



const localizer = momentLocalizer(moment);
function MyCalendar({ selectedStudent }) { 
    const {data:userData} = JSON.parse(localStorage.getItem("currentUser"));
    const {email, userId} = userData.user;
    const { isLoading, error, data } = useQuery({
        queryKey: [`${userId}`],
        queryFn: () =>
            newRequest.get(`/student/${userId}`).then((res) => {
                return res.data;
            }),
    });
    // Proper prop destructuring
    const { role } = useContext(RoleContext);
    const { id: courseId } = useParams();
    const [myEventsList, setMyEventsList] = useState([]);
    const [view, setView] = useState(Views.MONTH);
    const [date, setDate] = useState(new Date());
    
    useEffect(() => {
        const fetchData = async () => {
            let rollNoToFetch;
            
            if (role === 'student') {
                rollNoToFetch = data?.rollNo;
            } else if (selectedStudent) {
                rollNoToFetch = selectedStudent;
            }
            if (rollNoToFetch) {
                await fetchEventData(rollNoToFetch);
            }
        };

        fetchData();
    }, [selectedStudent, role, courseId]);  // Add all dependencies

    const fetchEventData = async (rollNo) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/attendancelanding/student/${courseId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "rollno": rollNo,
                },
            });

            const dataRecieved = await response.json();

            if (response.ok) {
                setMyEventsList(dataRecieved.eventList || []);  // Ensure we always have an array
            } else {
                console.error("Error fetching attendance data:", dataRecieved.error);
            }
        } catch (error) {
            console.error("Error fetching attendance data:", error);
        }
    };

    return (
        <div className='calendar-box'>
            <Calendar
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                defaultView={view}
                view={view}
                date={date}
                onView={setView}
                onNavigate={setDate}
                localizer={localizer}
                events={myEventsList}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 350 }}
                eventPropGetter={(event) => {
                    let backgroundColor = "";
                    switch (event.title.toLowerCase()) {
                        case "present":
                            backgroundColor = "#a0e7a0"; // light green
                            break;
                        case "absent":
                            backgroundColor = "#f8a5a5"; // light red
                            break;
                        case "pending approval":
                            backgroundColor = "#fce38a"; // light yellow
                            break;
                        default:
                            backgroundColor = "#d3d3d3"; // default gray
                    }
                    return {
                        style: {
                            backgroundColor,
                            borderRadius: "5px",
                            opacity: 0.9,
                            color: "black",
                            border: "none",
                            fontWeight: "bold",
                            textTransform: "capitalize"
                        },
                    };
                }}
            />
        </div>
    );
}
export default MyCalendar;
