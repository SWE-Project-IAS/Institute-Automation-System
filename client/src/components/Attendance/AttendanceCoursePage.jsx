import React, { useContext } from "react";
import { CourseStats } from "./attendanceComponents/CourseStats";
import "./AttendanceCoursePage.css";
import { useRef } from 'react';
import AddOrUpdate from "./attendanceComponents/AddOrUpdate";
import { RoleContext } from "../../context/Rolecontext";
import 'bootstrap/dist/css/bootstrap.min.css';

function AttendanceCoursePage() {
    const { role } = useContext(RoleContext);
    return(
        <div className="course-page">
            <div className="div">
                {<CourseStats />}
                {/* {role === "faculty" && <AddOrUpdate/>} */}
            </div>
        </div>
    );
};

export default AttendanceCoursePage