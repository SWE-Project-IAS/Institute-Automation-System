import Course from "./Course"
import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../../../context/Rolecontext";
import { useContext } from "react";
import SearchableStudentDropdown from "./SearchableStudentDropdown";
import AttendanceApprovalDashboard from "./AttendanceApprovalDashboard";

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

    const [selectedStudent, setSelectedStudent] = useState("");
    const [showStats, setShowStats] = useState(false);
    const [studentAttendanceData, setStudentAttendanceData] = useState({});

    // Handle student selection
  const handleStudentChange = (e) => {
    const rollNumber = e.target.value;
    setSelectedStudent(rollNumber);
    
    if (rollNumber) {
      setShowStats(true);
      // Update stats based on selected student
      const studentData = studentAttendanceData[rollNumber];
    //   setClassesMissed(studentData.classesMissed);
    //   setClassesAttended(studentData.classesAttended);
    //   setClassesRequired(studentData.reqClasses);
    //   setPercentage(studentData.percentage);
    } else {
      setShowStats(false);
    }
  };
    
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

    const studentList = [
        { rollNumber: "S101", name: "Alice Johnson" },
        { rollNumber: "S102", name: "Bob Smith" },
        { rollNumber: "S103", name: "Charlie Brown" },
        { rollNumber: "S104", name: "Diana Prince" },
        { rollNumber: "S105", name: "Ethan Hunt" },
        { rollNumber: "S106", name: "Fiona Gallagher" },
        { rollNumber: "S107", name: "George Miller" },
        { rollNumber: "S108", name: "Hannah Davis" },
        { rollNumber: "S109", name: "Ian Wright" },
        { rollNumber: "S110", name: "Julia Roberts" },
    ];

    return (
        <div className="courses" id="my_courses">
            {role === "student" && <div className="text-wrapper-2">My Courses</div>}
            {role === "faculty" && <div className="text-wrapper-2">My Courses</div>}
            {role == "acadAdmin" && <AttendanceApprovalDashboard/>}
            {role == "acadAdmin" && <h1 className="text-2xl font-bold text-gray-800 ml-5">Search Student Attendance:</h1>}
            {role == "acadAdmin" && <SearchableStudentDropdown setShowStats={setShowStats} />}
            {courses.length > 0 ? (
                role.includes("student") ? (
                    <Course courses={courses} />
                ) : role.includes("faculty") ? (
                    <Course courses={facultycourses} />
                ) : role.includes("acadAdmin") ? (
                    (showStats && <Course courses={courses} />)
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