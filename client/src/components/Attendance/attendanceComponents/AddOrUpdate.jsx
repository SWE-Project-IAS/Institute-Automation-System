import AddAttendance from "./AddAttendance";
import UpdateAttendance from "./UpdateAttendance";
import { useState } from 'react';
import React, { useRef } from 'react';

function AddOrUpdate(){
    const [AddOrUpdate, SetAddOrUpdate] = useState("Add"); 

    const handleRadioChange = (event) => {
        SetAddOrUpdate(event.target.value);
    };

    return(
        <div className="AddOrUpdate">
            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                <input type="radio" className="btn-check" name="btnradio" id="btnradio1" value="Add" autoComplete="off" onChange={handleRadioChange} checked={AddOrUpdate==="Add"}/>
                <label className="btn btn-outline-primary" htmlFor="btnradio1"><strong>Add Attendance</strong></label>

                <input type="radio" className="btn-check" name="btnradio" id="btnradio2" value="Update" autoComplete="off" onChange={handleRadioChange} checked={AddOrUpdate==="Update"}/>
                <label className="btn btn-outline-primary" htmlFor="btnradio2"><strong>Update Attendance</strong></label>
            </div>
            <div className="addupdateform">
                {(AddOrUpdate==="Add") && <AddAttendance/>}
                {(AddOrUpdate==="Update") && <UpdateAttendance/>}
            </div>
        </div>
    );
};

export default AddOrUpdate