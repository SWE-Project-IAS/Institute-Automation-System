import MyCalendar from "./Calendar";
import AddOrUpdate from "./AddOrUpdate";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { RoleContext } from "../../../context/Rolecontext";
import React, { useRef } from 'react';
import SearchableStudentDropdown from "./SearchableStudentDropdown";
import { FaFileUpload, FaCheckCircle, FaUndo } from "react-icons/fa";


const dummyCourses = [
  {
    id: "1",
    courseId: "CS101",
    courseName: "Introduction to Computer Science",
    semester: 1,
    attendanceAll: [],
    stats: { classesMissed: 2, classesAttended: 18, reqClasses: 20, percentage: 90 },
  },
  {
    id: "2",
    courseId: "MATH201",
    courseName: "Calculus II",
    semester: 2,
    attendanceAll: [],
    stats: { classesMissed: 5, classesAttended: 15, reqClasses: 20, percentage: 75 },
  },
  {
    id: "3",
    courseId: "PHY301",
    courseName: "Physics III",
    semester: 3,
    attendanceAll: [],
    stats: { classesMissed: 3, classesAttended: 17, reqClasses: 20, percentage: 85 },
  },
  {
    id: "4",
    courseId: "CHEM101",
    courseName: "Basic Chemistry",
    semester: 1,
    attendanceAll: [],
    stats: { classesMissed: 4, classesAttended: 16, reqClasses: 20, percentage: 80 },
  },
  {
    id: "5",
    courseId: "ENG202",
    courseName: "English Literature",
    semester: 2,
    attendanceAll: [],
    stats: { classesMissed: 1, classesAttended: 19, reqClasses: 20, percentage: 95 },
  },
  {
    id: "6",
    courseId: "HIST101",
    courseName: "World History",
    semester: 1,
    attendanceAll: [],
    stats: { classesMissed: 6, classesAttended: 14, reqClasses: 20, percentage: 70 },
  },
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

// Create dummy attendance data for each student
const generateStudentAttendanceData = () => {
  const studentAttendanceData = {};


  studentList.forEach(student => {
    studentAttendanceData[student.rollNumber] = {
      classesMissed: Math.floor(Math.random() * 10),
      classesAttended: Math.floor(Math.random() * 15) + 5,
      reqClasses: 20
    };
    // Calculate percentage
    studentAttendanceData[student.rollNumber].percentage = Math.round(
      (studentAttendanceData[student.rollNumber].classesAttended / 
       studentAttendanceData[student.rollNumber].reqClasses) * 100
    );
  });
  
  return studentAttendanceData;
};

export const CourseStats = () => {

    
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = () => {
    if (!file) return alert("Please attach a file before submitting.");
    setSubmitted(true);
    alert("Assignment submitted successfully!");
  };


  const { role } = useContext(RoleContext);  
  const navigateTo = useNavigate();
  const { id } = useParams();
  const course = dummyCourses.find((c) => c.id === id) || dummyCourses[0];
  const [showStats, setShowStats] = useState(false);

  const [courseName, setCourseName] = useState(course.courseName);
  const [courseId, setCourseId] = useState(course.courseId);
  const [semester, setSemester] = useState(course.semester);
  const [attendanceAll, setAttendanceAll] = useState(course.attendanceAll);
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  // Student selection and stats
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentAttendanceData, setStudentAttendanceData] = useState({});
  
  const [classesMissed, setClassesMissed] = useState(course.stats.classesMissed);
  const [classesAttended, setClassesAttended] = useState(course.stats.classesAttended);
  const [classesRequired, setClassesRequired] = useState(course.stats.reqClasses);
  const [percentage, setPercentage] = useState(course.stats.percentage);

  // Generate dummy attendance data for students on component mount
  useEffect(() => {
    setStudentAttendanceData(generateStudentAttendanceData());
  }, []);

  // Handle student selection
  const handleStudentChange = (e) => {
    const rollNumber = e.target.value;
    setSelectedStudent(rollNumber);
    
    if (rollNumber) {
      setShowStats(true);
      // Update stats based on selected student
      const studentData = studentAttendanceData[rollNumber];
      setClassesMissed(studentData.classesMissed);
      setClassesAttended(studentData.classesAttended);
      setClassesRequired(studentData.reqClasses);
      setPercentage(studentData.percentage);
    } else {
      setShowStats(false);
    }
  };

  const deleteCourse = () => {
    alert("Course deleted successfully!");
    navigateTo("/");
  };

  return (
    <div className="course-stats">
      <div className="frame">
        <div className="overlap-group">
          <div className="text-wrapper">{courseId}</div>
          <div className="div">{courseName}</div>
        </div>
        <div className="text-wrapper-2">{semester} Semester</div>
      </div>
      {(role === "student" || role === "acadAdmin") &&
        <div>
          <div className="calendar">
            <MyCalendar />
          </div>
          <div className="stats">
            <div className="frame-2">
                <div className="overlap">
                <div className="text-wrapper-3">Your Attendance</div>
                <div className="pie-chart">
                    <div className="overlap-group-2">
                        <div className="ellipse" />
                        <div className="text-wrapper-4-attendance">{percentage}%</div>
                    </div>
                </div>
                </div>
            </div>
            <div className="frame-2">
                <div className="overlap">
                <div className="text-wrapper-3">Classes Missed</div>
                <div className="pie-chart">
                    <div className="overlap-group-2">
                        <div className="ellipse" />
                        <div className="text-wrapper-4">{classesMissed}</div>
                    </div>
                </div>
                </div>
            </div>
            <div className="frame-2">
                <div className="overlap">
                <div className="text-wrapper-3">Classes Attended</div>
                <div className="pie-chart">
                    <div className="overlap-group-2">
                        <div className="ellipse" />
                        <div className="text-wrapper-4">{classesAttended}</div>
                    </div>
                </div>
                </div>
            </div>
            <div className="frame-2">
                <div className="overlap">
                <div className="text-wrapper-3">Required Classes</div>
                <div className="pie-chart">
                    <div className="overlap-group-2">
                        <div className="ellipse" />
                        <div className="text-wrapper-4">{classesRequired}</div>
                    </div>
                </div>
                </div>
            </div>
          </div>
        </div>
      }
      {role === "faculty" && <div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-4">
            {/* File Upload */}
            <div>
              <label className="block text-gray-700 font-medium">
                Upload attendance from file:  
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="block w-full mt-2 border border-gray-300 rounded-md p-2"
  
                />
              </label>
            </div>
            
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="flex items-center bg-blue-300 text-black px-4 py-2 rounded-md  transition duration-300 mt-8">
              <FaCheckCircle className="mr-2" /> Upload Attendance
            </button>
          </div>
        </div>
        </div>
      }
      {role === "faculty" && <SearchableStudentDropdown setShowStats={setShowStats} />}
      {/* <div className="course-dropdown">
        <div className="student-selector">
          <label htmlFor="student-select">Select Student: </label>
          <select 
            id="student-select" 
            value={selectedStudent} 
            onChange={handleStudentChange}
            className="student-dropdown"
          >
            <option value="">-- Select Student --</option>
            {studentList.map((student) => (
              <option key={student.rollNumber} value={student.rollNumber}>
                {student.rollNumber} - {student.name}
              </option>
            ))}
          </select>
        </div>
      </div> */}
      {role === "faculty" && showStats && (
        <div className="student-stats">
          <div className="calendar">
            <MyCalendar />
          </div>
          <div className="stats">
            <div className="frame-2">
              <div className="overlap">
                <div className="text-wrapper-3">Attendance</div>
                <div className="pie-chart">
                  <div className="overlap-group-2">
                    <div className="ellipse" />
                    <div className="text-wrapper-4-attendance">{percentage}%</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="frame-2">
              <div className="overlap">
                <div className="text-wrapper-3">Classes Missed</div>
                <div className="pie-chart">
                  <div className="overlap-group-2">
                    <div className="ellipse" />
                    <div className="text-wrapper-4">{classesMissed}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="frame-2">
              <div className="overlap">
                <div className="text-wrapper-3">Classes Attended</div>
                <div className="pie-chart">
                  <div className="overlap-group-2">
                    <div className="ellipse" />
                    <div className="text-wrapper-4">{classesAttended}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="frame-2">
              <div className="overlap">
                <div className="text-wrapper-3">Required Classes</div>
                <div className="pie-chart">
                  <div className="overlap-group-2">
                    <div className="ellipse" />
                    <div className="text-wrapper-4">{classesRequired}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="add-or-update">
            <AddOrUpdate/>
          </div>
        </div>
      )}
    </div>
  );
};