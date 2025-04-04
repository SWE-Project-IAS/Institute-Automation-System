import Course from "./Course"
import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../../../context/Rolecontext";
import { useContext } from "react";

function MyCourses(){
    const navigateTo = useNavigate()
    const { role } = useContext(RoleContext);
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
    
    const facultycourses = [
        { courseId: "EE 101", courseName: "Basic Electrical Engineering", averageAttendance: "85%" },
        { courseId: "ME 201", courseName: "Thermodynamics", averageAttendance: "78%" },
        { courseId: "CS 301", courseName: "Algorithms", averageAttendance: "92%" },
        { courseId: "HS 101", courseName: "Psychology", averageAttendance: "88%" }
    ];

    return (
        <div className="courses" id="my_courses">
            <div className="text-wrapper-2">My Courses</div>
            {courses.length > 0 ? (
                role.includes("student") ? (
                    <Course courses={courses} />
                ) : role.includes("faculty") ? (
                    <Course courses={facultycourses} />
                ) : (
                    <p>No courses available for your role.</p>
                )
            ) : (
                <p>Loading courses...</p>
            )}
        </div>
    )
};

export default MyCourses