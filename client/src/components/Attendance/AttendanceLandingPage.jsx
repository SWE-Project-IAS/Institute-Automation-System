import React from "react";
import MyCourses from "./attendanceComponents/MyCourses";
import "./AttendanceLandingPage.css";

function AttendanceLandingPage (){
  return (
    <div className="landing-page mt-2 p-2">
      <div className="div">
        <div className="MyCourses"><MyCourses /></div>
      </div>
    </div>
  );
};

export default AttendanceLandingPage;