import React, { useContext } from "react";
import { CourseStats } from "./attendanceComponents/CourseStats";
import "./AttendanceCoursePage.css";
import { useRef } from 'react';
import AddOrUpdate from "./attendanceComponents/AddOrUpdate";
import { RoleContext } from "../../context/Rolecontext";

function AttendanceCoursePage() {
    const { role } = useContext(RoleContext);
    return(
        <div className="course-page">
            <div className="div">
                {<CourseStats />}
            </div>
        </div>
    );
};

export default AttendanceCoursePage