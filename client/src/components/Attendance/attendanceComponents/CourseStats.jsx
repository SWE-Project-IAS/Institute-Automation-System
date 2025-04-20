import MyCalendar from "./Calendar";
import AddOrUpdate from "./AddOrUpdate";
import { parse } from 'papaparse'; // Add this import at the top
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { RoleContext } from "../../../context/Rolecontext";
import React, { useRef } from 'react';
import SearchableStudentDropdown from "./SearchableStudentDropdown";
import { FaFileUpload, FaCheckCircle, FaUndo } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";


export const CourseStats = () => {
  const {data:userData} = JSON.parse(localStorage.getItem("currentUser"));
    const {email, userId} = userData.user;
    const { isLoading, error, data } = useQuery({
        queryKey: [`${userId}`],
        queryFn: () =>
            newRequest.get(`/student/${userId}`).then((res) => {
                return res.data;
            }),
    });
  const { id } = useParams();
  const { role } = useContext(RoleContext);  
  const navigateTo = useNavigate();

  const [courseName, setCourseName] = useState();
  const [courseId, setCourseId] = useState(id);

  const [attendanceAll, setAttendanceAll] = useState(0);
  const [classesMissed, setClassesMissed] = useState(0);
  const [classesAttended, setClassesAttended] = useState(0);
  const [classesRequired, setClassesRequired] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(0);
  const [studentList, setStudentList] = useState([]); // Changed from hardcoded to state
  const [studentAttendanceData, setStudentAttendanceData] = useState({});
  const [loadingStudents, setLoadingStudents] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const showStudentStats = (rollNo) => {
      setShowStats(true);
      setSelectedStudent(rollNo);
      fetchAttendance(rollNo); // Use the parameter directly
    
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please attach a CSV file before submitting.");
      return;
    }
  
    try {
      const text = await file.text();
      parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          // Validate CSV structure
          if (!results.meta.fields || 
              !results.meta.fields.includes('rollno') || 
              !results.meta.fields.includes('date') || 
              !results.meta.fields.includes('status')) {
            alert("CSV must contain columns: rollno, date, status");
            return;
          }
          // Process and validate each record
          const attendanceData = results.data.map((row, index) => {
            // Normalize data
            const rollNo = (row.rollno || '').toString().trim();
            const date = (row.date || '').toString().trim();
            let status = (row.status || '').toString().toLowerCase().trim();
            
            // Clean status (handle cases like "absent|")
            status = status.replace(/\|$/, ''); // Remove trailing pipe
            status = status === 'present' ? 'present' : 'absent'; // Normalize
            // Validate
            const errors = [];
            if (!rollNo) errors.push("Missing roll number");
            if (!date) errors.push("Missing date");
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push("Invalid date format (use YYYY-MM-DD)");
            return {
              rowNumber: index + 2, // +1 for header, +1 for 0-based index
              rollNo,
              date,
              status,
              errors: errors.length ? errors : null
            };
          });
          
          // Separate valid and invalid records
          const validRecords = attendanceData.filter(record => !record.errors);
          const invalidRecords = attendanceData.filter(record => record.errors);
  
          if (validRecords.length === 0) {
            alert("No valid records found in CSV file");
            return;
          }
          // Prepare data for API
          const payload = validRecords.map(record => ({
            rollNo: record.rollNo,
            date: record.date,
            status: record.status
          }));
          // Upload to server
          setSubmitted('loading');
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/attendancelanding/add/bulk/${courseId}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ attendanceRecords: payload }),
            });
  
            const result = await response.json();
            
            if (!response.ok) {
              throw new Error(result.message || 'Upload failed');
            }
            setSubmitted('success');
            
            // Show detailed results
            let message = `Successfully uploaded ${result.results?.length || 0} records`;
            if (result.errors?.length > 0) {
              message += ` with ${result.errors.length} failures`;
            }
            alert(message);
            
          } catch (error) {
            setSubmitted('error');
            console.error("Upload error:", error);
            alert(`Upload failed: ${error.message}`);
          }
        },
        error: (error) => {
          console.error("CSV parsing error:", error);
          alert("Error parsing CSV file. Please check the format.");
        }
      });
    } catch (error) {
      console.error("File reading error:", error);
      alert("An error occurred while reading the file. Please try again.");
    }
  };
  
  const fetchAttendance = async (rollNo) => {
    try {

      const response = await fetch(`${process.env.REACT_APP_API_URL}/attendancelanding/student/${courseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "rollno": rollNo,
        },
      });

      const dataReceived = await response.json();

      if (dataReceived?.stats) {
        setClassesMissed(dataReceived.stats.classesMissed || 0);
        setClassesAttended(dataReceived.stats.classesAttended || 0);
        setClassesRequired(dataReceived.stats.reqClasses || 0);
        setPercentage(parseFloat(dataReceived.stats.percentage) || 0);
        setCourseName(dataReceived.courseName);
      }

      setShowStats(true);
    } catch (error) {
      console.error("Error fetching student attendance:", error);
    }
  };

  // Fetch attendance data from backend if student
  useEffect(() => {
    
    if (role === "student") {
      const rollNo = data?.rollNo;
      fetchAttendance(rollNo);
    }

  }, [role, courseId]);

  const deleteCourse = () => {
    alert("Course deleted successfully!");
    navigateTo("/");
  };

  return (
    <div className="course-stats">
      <div className="frame">
        <div className="overlap-group">
          <div className="text-wrapper">{courseId}</div>
          {courseName && <div className="div">{courseName}</div>}
        </div>
      </div>

      {(role === "student") &&
        <div>
          <div className="calendar">
            <MyCalendar/>
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
      
        {role === "faculty" && 
    <SearchableStudentDropdown 
      courseId={courseId}
      onStudentSelect={showStudentStats}  // Add this prop
    />
         }

      {(role === "faculty" || role === "acadAdmin") && showStats && (
        <div className="student-stats">
          <div className="calendar">
            <MyCalendar  selectedStudent={selectedStudent}/>
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
            <AddOrUpdate selectedStudent={selectedStudent}/>
          </div>
        </div>
      )}
    </div>
  );
};