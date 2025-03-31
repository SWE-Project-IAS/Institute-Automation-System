import Course from "./Course"
import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";


function MyCourses(){
    const navigateTo = useNavigate()
    //const [courses, setCourses] = useState([])
    /*
    useEffect(() =>{
        const fetchCourses = async () => {
            try {

                const response = await fetch('http://localhost:3000/')
                const json = await response.json()
                if (response.ok) {
                    setCourses(json.courses)

                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchCourses()
    },[])
    */
    
     const courses = [
         {courseId : "ME 101", courseName: "Engineering Mechanics", attendance: "7%"},
         {courseId : "CS 101", courseName: "Introduction to Computing", attendance: "10%"},
         {courseId : "BT 101", courseName: "Introduction to Biology", attendance: "50%"},
         {courseId : "CS 201", courseName: "Discrete Mathematics", attendance: "7%"},
         {courseId : "CS 201", courseName: "Discrete Mathematics", attendance: "7%"},
         {courseId : "BT 101", courseName: "Introduction to Biology", attendance: "50%"},
         {courseId : "BT 101", courseName: "Introduction to Biology", attendance: "50%"},
         {courseId : "CS 201", courseName: "Discrete Mathematics", attendance: "7%"},
         {courseId : "HS 125", courseName: "Macroeconomics", attendance: "7%"}
     ]
     
    return (
        <div className="courses" id = "my_courses">
            <div className="text-wrapper-2">My Courses</div>
            {courses.length > 0 ? (
                <Course courses={courses} />
            ) : (
                <p>Loading courses...</p>
            )}
        </div>
    )
};

export default MyCourses