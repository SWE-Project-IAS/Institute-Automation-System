import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";

function AddAttendance({ selectedStudent }) {
    const { id } = useParams(); // get courseCode from URL params
    const courseCode = id;
    const  rollNo  = selectedStudent; // get rollNo from selected student

    const [date, setDate] = useState(new Date());
    const [present, setPresent] = useState(null);

    const handlePresentChange = (event) => {
        const value = event.target.value;
        setPresent(value === "true"); // convert string to boolean
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            courseCode: courseCode,
            date: date.toISOString(), // send full ISO date
            isPresent: present,
            isApproved: false
        };

        try {
            const response = await fetch('process.env.REACT_APP_API_URL/attendancelanding/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    rollno: rollNo // set roll number in headers
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            setDate(new Date());
            setPresent(null);

            alert('Attendance added successfully!');
            
        } catch (error) {
            console.error('Error adding attendance:', error.message);
            alert(error.message);
        }
    };

    return (
        <div className="AddAttendance">
            <form className="add-attendance" onSubmit={handleSubmit}>
                <div className="input">
                    <div className="date-option">
                        <label htmlFor="date">Date</label><br />
                        <DatePicker
                            showIcon
                            selected={date}
                            onChange={(date) => setDate(date)}
                        />
                        <br />
                    </div>
                    <div className="attendance-option">
                        <label htmlFor="attendance">Attendance</label><br />
                        <select
                            id="attendance"
                            name="attendance"
                            onChange={handlePresentChange}
                            className="attendance"
                            value={present === null ? "" : present.toString()}
                        >
                            <option value="">None</option>
                            <option value="true">Present</option>
                            <option value="false">Absent</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="AddButton">Add</button>
            </form>
        </div>
    );
}

export default AddAttendance;
