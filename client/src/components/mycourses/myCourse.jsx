import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  FaBookOpen, 
  FaClipboardList, 
  FaBullhorn, 
  FaCalendarAlt, 
  FaChartBar,
  FaComments,
  FaFileAlt,
  FaExternalLinkAlt,
  FaLock
} from "react-icons/fa";

export default function MyCourses() {
  // Example student object with current courses
  const [studentCourses] = useState([
    {
      id: "CS101",
      name: "Introduction to Computer Science",
      instructor: "Dr. Jane Smith",
      credits: 4,
      assignments: 8,
      announcements: 3,
      attendance: 85
    },
    {
      id: "MATH202",
      name: "Calculus II",
      instructor: "Prof. Robert Johnson",
      credits: 3,
      assignments: 12,
      announcements: 2,
      attendance: 92
    },
    {
      id: "ENG105",
      name: "Academic Writing",
      instructor: "Dr. Maria Garcia",
      credits: 3,
      assignments: 5,
      announcements: 5,
      attendance: 78
    },
    {
      id: "PHYS101",
      name: "Physics for Engineers",
      instructor: "Dr. Alan Chen",
      credits: 4,
      assignments: 10,
      announcements: 7,
      attendance: 88
    }
  ]);

  // New state to track if feedback is currently available
  const [isFeedbackAvailable] = useState(false); // Set to false by default, you would get this from backend later

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">My Courses</h1>
      <p className="text-gray-600 mb-6">Current semester enrolled courses</p>
      
      {studentCourses.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-700 text-lg mb-4">You are not enrolled in any courses.</p>
          <Link
            to="/registration"
            className="bg-pink-500 text-white py-2 px-6 rounded-md font-medium hover:bg-pink-600 transition duration-300"
          >
            Course Registration
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {studentCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 overflow-hidden"
            >
              {/* Course Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-3 rounded-full">
                      <FaBookOpen className="text-pink-500 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{course.name}</h2>
                      <p className="text-gray-600 text-sm">{course.instructor}</p>
                    </div>
                  </div>
                  <span className="bg-gray-100 text-gray-700 text-sm py-1 px-3 rounded-full font-medium">
                    {course.id}
                  </span>
                </div>
              </div>
              
              {/* Course Stats */}
              <div className="grid grid-cols-3 border-b border-gray-200">
                <div className="p-4 text-center border-r border-gray-200">
                  <p className="text-2xl font-semibold text-pink-500">{course.credits}</p>
                  <p className="text-xs text-gray-600 font-medium uppercase">Credits</p>
                </div>
                <div className="p-4 text-center border-r border-gray-200">
                  <p className="text-2xl font-semibold text-pink-500">{course.assignments}</p>
                  <p className="text-xs text-gray-600 font-medium uppercase">Assignments</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-2xl font-semibold text-pink-500">{course.attendance}%</p>
                  <p className="text-xs text-gray-600 font-medium uppercase">Attendance</p>
                </div>
              </div>
              
              {/* Course Actions */}
              <div className="p-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Quick Access</p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={`/course/${course.id}/announcements`}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    <FaBullhorn className="text-pink-400" />
                    <span>Announcements</span>
                    {course.announcements > 0 && (
                      <span className="bg-pink-100 text-pink-600 text-xs rounded-full py-1 px-2 ml-1">
                        {course.announcements}
                      </span>
                    )}
                  </Link>
                  
                  <Link
                    to={`/course/${course.id}/assignment`}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    <FaClipboardList className="text-pink-400" />
                    <span>Assignments</span>
                  </Link>
                  
                  <Link
                    // to={`/course/${course.id}`}
                    to="/attendancelanding"
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    <FaCalendarAlt className="text-pink-400" />
                    <span>Attendance</span>
                  </Link>
                  
                  {isFeedbackAvailable ? (
                    <Link
                      to={`/courseFeedback`}
                      className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
                    >
                      <FaComments className="text-pink-400" />
                      <span>Feedback</span>
                    </Link>
                  ) : (
                    <div className="flex items-center justify-center gap-2 bg-gray-100 border border-gray-300 rounded-md p-3 text-sm font-medium text-gray-500 cursor-not-allowed">
                      <FaLock className="text-gray-400" />
                      <span>Feedback</span>
                      <span className="bg-gray-200 text-gray-600 text-xs rounded-full py-1 px-2 ml-1">
                        Closed
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <Link 
                    // to={`/course/${course.id}/details`}
                    className="flex items-center justify-center gap-2 w-full bg-pink-50 text-pink-600 border border-pink-200 rounded-md p-2 text-sm font-medium hover:bg-pink-100 transition duration-200"
                  >
                    <span>View Course Details</span>
                    <FaExternalLinkAlt className="text-xs" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Registration Link */}
      <div className="mt-8 text-center">
        <Link
          to="/dropcourse"
          className="inline-flex items-center text-pink-600 hover:text-pink-700"
        >
          Need to drop a course? Click here
          <FaExternalLinkAlt className="ml-1 text-xs" />
        </Link>
      </div>
      
      {/* Feedback availability notice */}
      {!isFeedbackAvailable && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Course feedback is currently closed. Check back during the feedback period.
        </div>
      )}
    </div>
  );
}