import { useEffect, useState } from "react";
import axios from "axios";

const CourseRegistration = () => {
    const [coreCourses, setCoreCourses] = useState([]);
    const [electiveCourses, setElectiveCourses] = useState([]);
    const [auditCourses, setAuditCourses] = useState([]);
    const [selectedElectives, setSelectedElectives] = useState(["", ""]);
    const [selectedAudits, setSelectedAudits] = useState(["", "", ""]);

    const [userId, setUserId] = useState("");
    //const [rollNo, setRollNo] = useState("");

    useEffect(() => {
        const { data: userData } = JSON.parse(localStorage.getItem("currentUser"));
        const user = userData.user;
        setUserId(user.userId);
        //setRollNo(user.rollNo);
        //console.log(rollNo);
        if (user.userId) {
            axios
                .get(`http://localhost:8000/api/studentCourse/getCourse/${user.userId}`)
                .then((res) => {
                    const { coreCourses, electiveCourses, auditCourses } = res.data;
                    setCoreCourses(coreCourses);
                    setElectiveCourses(electiveCourses);
                    setAuditCourses(auditCourses);
                })
                .catch((err) => {
                    console.error("Failed to fetch course data:", err);
                });
        }
    }, []);

    const registerCourse = (course, creditOrAudit) => {
        axios
            .post("http://localhost:8000/api/studentCourse/register", {
                userId,
                courseCode: course.courseCode,
                creditOrAudit,
            })
            .then((res) => {
                alert(res.data.message);
            })
            .catch((err) => {
                alert(err.response?.data?.message || "Registration failed");
                console.error(err);
            });
    };

    const handleElectiveChange = (index, course) => {
        const updated = [...selectedElectives];
        updated[index] = course;
        setSelectedElectives(updated);
    };

    const handleAuditChange = (index, course) => {
        const updated = [...selectedAudits];
        updated[index] = course;
        setSelectedAudits(updated);
    };

    return (
        <div className="p-5">
            <h2 className="text-xl font-bold mb-4">Course Registration</h2>

            {/* Core Courses Section */}
            <h3 className="text-lg font-semibold mb-2">Core Courses</h3>
            <ul className="mb-4">
                {coreCourses.length === 0 ? (
                    <p className="text-gray-500">No core courses available</p>
                ) : (
                    coreCourses.map((course) => (
                        <li key={course.courseCode} className="flex justify-between p-2 border-b">
                            <span>{course.courseName}</span>
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                onClick={() => registerCourse(course, "Credit")}
                            >
                                Register
                            </button>
                        </li>
                    ))
                )}
            </ul>

            {/* Elective Courses Section */}
            <h3 className="text-lg font-semibold mb-2">Elective Courses</h3>
            {selectedElectives.map((selected, index) => (
                <div key={index} className="flex justify-between p-2 border-b">
                    <select
                        className="border p-2 w-1/3"
                        onChange={(e) => handleElectiveChange(index, e.target.value)}
                        value={selected}
                    >
                        <option value="">Select Elective Course</option>
                        {electiveCourses.map((course) => (
                            <option key={course.courseCode} value={course.courseCode}>
                                {course.courseName}
                            </option>
                        ))}
                    </select>
                    <button
                        className={`px-3 py-1 rounded ${
                            selected ? "bg-blue-500 text-white" : "bg-gray-300"
                        }`}
                        disabled={!selected}
                        onClick={() => {
                            const course = electiveCourses.find(c => c.courseCode === selected);
                            if (course) registerCourse(course, "Credit");
                        }}
                    >
                        Register
                    </button>
                </div>
            ))}

            {/* Audit Courses Section */}
            <h3 className="text-lg font-semibold mt-4 mb-2">Audit Courses</h3>
            {selectedAudits.map((selected, index) => (
                <div key={index} className="flex justify-between p-2 border-b">
                    <select
                        className="border p-2 w-1/3"
                        onChange={(e) => handleAuditChange(index, e.target.value)}
                        value={selected}
                    >
                        <option value="">Select Audit Course</option>
                        {auditCourses.map((course) => (
                            <option key={course.courseCode} value={course.courseCode}>
                                {course.courseName}
                            </option>
                        ))}
                    </select>
                    <button
                        className={`px-3 py-1 rounded ${
                            selected ? "bg-blue-500 text-white" : "bg-gray-300"
                        }`}
                        disabled={!selected}
                        onClick={() => {
                            const course = auditCourses.find(c => c.courseCode === selected);
                            if (course) registerCourse(course, "Audit");
                        }}
                    >
                        Register
                    </button>
                </div>
            ))}
        </div>
    );
};

export default CourseRegistration;
