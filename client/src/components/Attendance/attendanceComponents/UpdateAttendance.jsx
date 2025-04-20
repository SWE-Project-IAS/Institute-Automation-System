import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import React from 'react';

function UpdateAttendance({ selectedStudent }) {
    const { id } = useParams(); // courseCode from URL params
    const courseCode = id;
    const rollNo = selectedStudent; // roll number

    const [date, setDate] = useState(new Date());
    const [present, setPresent] = useState(null);

    const handlePresentChange = (event) => {
        const value = event.target.value;
        setPresent(value === "true" ? true : value === "false" ? false : null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (present === null) {
            alert("Please select Present or Absent.");
            return;
        }

        const formData = {
            courseCode,
            date: date.toISOString(), // full ISO date
            isPresent: present,
            isApproved: false
        };

        try {
            const response = await fetch('process.env.REACT_APP_API_URL/attendancelanding/update', {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'rollno': rollNo
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Update failed");
            }

            alert('Attendance updated successfully!');
            setDate(new Date());
            setPresent(null);
            

        } catch (error) {
            console.error('Error updating attendance:', error.message);
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
                        <select id="attendance" name="attendance" className="attendance" onChange={handlePresentChange} value={present !== null ? String(present) : ''}>
                            <option value="">None</option>
                            <option value="true">Present</option>
                            <option value="false">Absent</option>
                        </select>
                    </div>
                </div>
                <input type="submit" value="Update" className="UpdateButton" />
            </form>
        </div>
    );
};

export default UpdateAttendance;
