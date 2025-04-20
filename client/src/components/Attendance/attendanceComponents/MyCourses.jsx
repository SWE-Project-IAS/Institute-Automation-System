import Course from "./Course";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../../../context/Rolecontext";
import SearchableStudentDropdown from "./SearchableStudentDropdown";
import AttendanceApprovalDashboard from "./AttendanceApprovalDashboard";
import SiteAlert from "./siteAlert";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";

function MyCourses() {
    const {data:userData} = JSON.parse(localStorage.getItem("currentUser"));
    const {email, userId} = userData.user;

    const { isLoading, error, data } = useQuery({
        queryKey: [`${userId}`],
        queryFn: () =>
            newRequest.get(`/student/${userId}`).then((res) => {
                return res.data;
            }),
    });
    const navigateTo = useNavigate();
    const { role } = useContext(RoleContext);
    
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [overall, setOverall] = useState(true); // true means safe, false means alert

    const [selectedStudent, setSelectedStudent] = useState("");
    const [showStats, setShowStats] = useState(false);

    const showStudentStats = (rollNo) => {
        setSelectedStudent(rollNo);
        fetchStudentCourses(rollNo); // Use the parameter directly
        setShowStats(true);
    };

    const fetchStudentCourses = async (rollNo) => {

        try {
            const response = await fetch("process.env.REACT_APP_API_URL/attendancelanding/student", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "rollno": rollNo
                }
            });
    
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            const dataReceived = await response.json();
    
            const formattedCourses = dataReceived.attendance.map(course => ({
                courseId: course.courseCode,
                courseName: course.courseName,
                attendance: `${course.percentage}%`,
                percentage: course.percentage
            }));
            setCourses(formattedCourses);
            //turn formattedCourses;
        } catch (error) {
            console.error("Error fetching student courses:", error);
            throw error; // Re-throw for caller to handle
        }
    };
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);

                if (role === "student") {
                    const rollNo =  data?.rollNo;
                    if (!rollNo) {
                        throw new Error("Roll number not found in localStorage.");
                    }

                    const response = await fetch("process.env.REACT_APP_API_URL/attendancelanding/student", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "rollno": rollNo,
                            "role":role
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`Server responded with status: ${response.status}`);
                    }

                    const dataReceived = await response.json();

                    const formattedCourses = dataReceived.attendance.map(course => ({
                        courseId: course.courseCode,
                        courseName: course.courseName,
                        attendance: `${course.percentage}%`,
                        percentage: course.percentage
                    }));

                    // Check for any course with attendance below 75%
                    const hasLowAttendance = formattedCourses.some(course => course.percentage < 75);
                    setOverall(!hasLowAttendance);
                    setCourses(formattedCourses);
                } else if (role === "faculty") {
                    // Fetch faculty courses from the backend
                    if (!userId) {
                        throw new Error("Faculty ID not found in localStorage.");
                    }

                    const response = await fetch("process.env.REACT_APP_API_URL/attendancelanding/faculty", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "userid": userId
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`Server responded with status: ${response.status}`);
                    }

                    const dataReceived = await response.json();

                    if (!dataReceived.success) {
                        throw new Error(dataReceived.message || "Failed to fetch faculty courses");
                    }

                    // Format the courses for display
                    const formattedCourses = dataReceived.data.map(course => ({
                        courseId: course.courseCode,
                        courseName: course.courseName || `Course ${course.courseCode}`,
                        averageAttendance: `${course.attendancePercentage}%`,
                        totalStudents: course.totalStudents
                    }));
                    setCourses(formattedCourses);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [role]);

    const handleStudentChange = async (e) => {
        const rollNumber = e.target.value;
        setSelectedStudent(rollNumber);

        if (rollNumber) {
            setLoading(true);
            try {
                const response = await fetch(`process.env.REACT_APP_API_URL/attendancelanding/${rollNumber}`);

                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }

                const dataReceived = await response.json();

                const formattedCourses = dataReceived.attendance.map(course => ({
                    courseId: course.courseCode,
                    courseName: course.courseName,
                    attendance: `${course.percentage}%`,
                    percentage: course.percentage
                }));

                const hasLowAttendance = formattedCourses.some(course => course.percentage < 75);
                setOverall(!hasLowAttendance);

                setCourses(formattedCourses);
                setShowStats(true);
            } catch (error) {
                console.error("Error fetching student data:", error);
            } finally {
                setLoading(false);
            }
        } else {
            setShowStats(false);
        }
    };

    return (
        <div className="courses" id="my_courses">
            {role === "student" && <div className="text-wrapper-2">My Courses</div>}
            {role === "student" && !overall && <SiteAlert />}
            {role === "faculty" && <div className="text-wrapper-2">My Courses</div>}
            {role === "acadAdmin" && <AttendanceApprovalDashboard />}
            {role === "acadAdmin" && <h1 className="text-2xl font-bold text-gray-800 ml-5">Search Student Attendance:</h1>}
            {role === "acadAdmin" && (
                <SearchableStudentDropdown 
                onStudentSelect={showStudentStats}  // Add this prop
              />
            )}

            {loading ? (
                <p>Loading courses...</p>
            ) : courses.length > 0 ? (
                role === "student" || (role === "acadAdmin" && showStats) ? (
                    <Course courses={courses} />
                ) : role === "faculty" ? (
                    <Course courses={courses} />
                ) : (
                    <p>No courses available for your role.</p>
                )
            ) : (
                <p>No courses found.</p>
            )}
        </div>
    );
}

export default MyCourses;