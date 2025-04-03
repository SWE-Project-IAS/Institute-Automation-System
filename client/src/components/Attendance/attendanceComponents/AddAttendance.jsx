import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";

function AddAttendance(){
    const {id} = useParams();

    const [date, setDate] = useState(new Date());
    const [present, setPresent] = useState(false);

    const handlePresentChange = (event) => {
        setPresent(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const formData = {
            date: date.toISOString().split('T')[0],
            present
        };
        console.log(formData);
        
        try {
            const response = await fetch(`http://localhost:3000/course/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
    
            setDate(null);
            setPresent(null);
    
            alert('Attendance added successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error adding attendance:', error.message);
            alert(error.message);
        }
    };
    

    return(
        <div className="AddAttendance">
            <form className="add-attendance" onSubmit={handleSubmit}>
                <div className="input">
                    <div className="date-option">
                        <label htmlFor="date">Date</label><br />
                        <DatePicker
                            showIcon
                            selected={date}
                            onChange={(date) => {
                                setDate(date);
                                console.log(date);
                            }}
                        />
                        <br/>
                    </div>
                    <div className="attendance-option">
                        <label htmlFor="attendance">Attendance</label><br />
                        <select id="attendance" name="attendance" onChange={handlePresentChange} className="attendance">
                            <option value={null}>None</option>
                            <option value="true">Present</option>
                            <option value="false">Absent</option>
                        </select>
                    </div>
                </div>
                <input type="submit" value="Add" className="AddButton"/>
            </form>
        </div>
    );
};

export default AddAttendance