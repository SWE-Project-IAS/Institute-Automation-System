import React from "react";
import { CourseStats } from "./attendanceComponents/CourseStats";
import "./AttendanceCoursePage.css";

function AttendanceCoursePage() {
    
    return(
        <div className="course-page">
            <div className="div">
                <CourseStats />
            </div>
        </div>
    );
};

export default AttendanceCoursePage