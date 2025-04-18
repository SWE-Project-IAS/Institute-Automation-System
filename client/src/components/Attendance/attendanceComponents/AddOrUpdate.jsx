import AddAttendance from "./AddAttendance";
import UpdateAttendance from "./UpdateAttendance";
import { useState } from 'react';
import React, { useRef } from 'react';

function AddOrUpdate({ selectedStudent }) {
    const [AddOrUpdate, SetAddOrUpdate] = useState("Add");

    const handleRadioChange = (event) => {
        SetAddOrUpdate(event.target.value);
    };

    return (
        <div className="AddOrUpdate">
            <div className="inline-flex w-full rounded-lg overflow-hidden">
                <input type="radio" className="sr-only" name="btnradio" id="btnradio1" value="Add" autoComplete="off" onChange={handleRadioChange} checked={AddOrUpdate === "Add"} />
                <label
                    className={`w-1/2 py-3 text-center font-bold ${AddOrUpdate === "Add" ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}
                    htmlFor="btnradio1">
                    Add Attendance
                </label>

                <input type="radio" className="sr-only" name="btnradio" id="btnradio2" value="Update" autoComplete="off" onChange={handleRadioChange} checked={AddOrUpdate === "Update"} />
                <label
                    className={`w-1/2 py-3 text-center font-bold ${AddOrUpdate === "Update" ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}
                    htmlFor="btnradio2">
                    Update Attendance
                </label>
            </div>
            <div className="addupdateform">
                {(AddOrUpdate === "Add") && <AddAttendance selectedStudent={selectedStudent} />}
                {(AddOrUpdate === "Update") && <UpdateAttendance selectedStudent={selectedStudent} />}
            </div>
        </div>
    );
};

export default AddOrUpdate