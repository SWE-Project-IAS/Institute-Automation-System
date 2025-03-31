import React from "react";
import SiteAlert from "./attendanceComponents/siteAlert";
import MyCourses from "./attendanceComponents/MyCourses";
import "./AttendanceLandingPage.css";
import { useEffect,useState } from "react";


function AttendanceLandingPage (){
  
  const [overall, setOverall] = useState(0)

  function makeInt(percentageString) {
    const numericString = percentageString.replace('%', '');    
    const integerValue = parseInt(numericString, 10);
    return integerValue;
}


  useEffect(() =>{
      const fetchOverall = async () => {
          try {

              const response = await fetch('http://localhost:3000/')
              const json = await response.json()
              if (response.ok) {
                  setOverall(makeInt(json.totalAttendancePercentage))
              }
          } catch (error) {
              console.log(error)
          }
      }
      fetchOverall()
  },[])


  return (
    <div className="landing-page">
      <div className="div">
        {overall<75 && <SiteAlert />}
        <br />
        <div className="MyCourses"><MyCourses /></div>
  
        {/* <br/> */}
        {/* <Announcements /> */}
      </div>
    </div>
  );
};

export default AttendanceLandingPage;