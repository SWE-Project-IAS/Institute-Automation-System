import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import newRequest from '../../utils/newRequest';
import { useQuery } from '@tanstack/react-query';
import { 
  FaBookOpen, 
  FaClipboardList, 
  FaBullhorn, 
  FaCalendarAlt,
  FaUsers,
  FaExternalLinkAlt,
  FaChartBar,
  FaChartLine,
  FaCommentAlt,
  FaStar
} from "react-icons/fa";

function FacultyCourses() {
  const navigate = useNavigate();
  const handleViewFeedback = (course) => {
    console.log("Course ID:", course.id);
    // Use course.id as courseCode if that's what your backend returns
    navigate("/faculty/feedback/view", {
      state: {
        courseCode: course.id,
        courseName: course.name,
        department: course.department
      }
    }); 
  };

  // Get userId from localStorage
  const {data:userData} = JSON.parse(localStorage.getItem("currentUser"));
  const {userId} = userData.user;
  
  const [isFeedbackAvailable, setIsFeedbackAvailable] = useState(false);

  const { isLoading, error, data: facultyCourses = [] } = useQuery({
    queryKey: ["faculty-courses"],
    queryFn: () =>
      newRequest.get(`/faculty/${userId}/courses`).then((res) => {
        console.log("Faculty course data received:", res.data);
        setIsFeedbackAvailable(res.data.feedbackOpen || false);
        return res.data.courses || [];
      }),
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">My Teaching Courses</h1>
      <p className="text-gray-600 mb-6">Current semester courses you are instructing</p>
      
      {isLoading ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your courses...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-8 rounded-lg text-center">
          <p className="text-red-700 text-lg mb-4">{error.message || "Failed to fetch courses"}</p>
          <Link
            to="/profile"
            className="bg-blue-500 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-600 transition duration-300"
          >
            Return to Profile
          </Link>
        </div>
      ) : facultyCourses.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-700 text-lg mb-4">You are not assigned to any courses this semester.</p>
          <Link
            to="/profile"
            className="bg-blue-500 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-600 transition duration-300"
          >
            Return to Profile
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {facultyCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 overflow-hidden"
            >
              {/* Course Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaBookOpen className="text-blue-500 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{course.name}</h2>
                      <p className="text-gray-600 text-sm">Course Code: {course.id}</p>
                    </div>
                  </div>
                  <span className="bg-gray-100 text-gray-700 text-sm py-1 px-3 rounded-full font-medium">
                    {course.credits} Credits
                  </span>
                </div>
              </div>
              
              {/* Course Stats */}
              <div className="grid grid-cols-3 border-b border-gray-200">
                <div className="p-4 text-center border-r border-gray-200">
                  <p className="text-2xl font-semibold text-blue-500">{course.students || 0}</p>
                  <p className="text-xs text-gray-600 font-medium uppercase">Students</p>
                </div>
                <div className="p-4 text-center border-r border-gray-200">
                  <p className="text-2xl font-semibold text-blue-500">{course.assignments || 0}</p>
                  <p className="text-xs text-gray-600 font-medium uppercase">Assignments</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-2xl font-semibold text-blue-500">{course.avgAttendance || 0}%</p>
                  <p className="text-xs text-gray-600 font-medium uppercase">Avg. Attendance</p>
                </div>
              </div>
              
              {/* Course Actions */}
              <div className="p-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Instructor Actions</p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={`/course/${course.id}/announcements`}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    <FaBullhorn className="text-blue-400" />
                    <span>Announcements</span>
                  </Link>
                  
                  <Link
                    to={`/course/${course.id}/assignments`}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    <FaClipboardList className="text-blue-400" />
                    <span>Assignments</span>
                  </Link>
                  
                  <Link
                    to={`/attendancelanding/${course.id}`}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    <FaCalendarAlt className="text-blue-400" />
                    <span>Attendance</span>
                  </Link>
                  
                  <Link
                    to={`/course/${course.id}/students`}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    <FaUsers className="text-blue-400" />
                    <span>Students</span>
                  </Link>
                </div>
                
                {/* Enhanced Feedback Report Section */}
                {isFeedbackAvailable && (
                  <div className="mt-4">
                    {/* <div className="flex items-center mb-3">
                      <div className="bg-blue-500 p-2 rounded-full mr-3">
                        <FaChartBar className="text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-700">Course Feedback Available</h3>
                    </div> */}
                    
                    {/* <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="flex flex-col items-center justify-center bg-white p-2 rounded shadow-sm">
                        <FaStar className="text-yellow-400 mb-1" />
                        <span className="text-xs text-gray-600">Ratings</span>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-white p-2 rounded shadow-sm">
                        <FaCommentAlt className="text-blue-400 mb-1" />
                        <span className="text-xs text-gray-600">Comments</span>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-white p-2 rounded shadow-sm">
                        <FaChartLine className="text-green-400 mb-1" />
                        <span className="text-xs text-gray-600">Analytics</span>
                      </div>
                    </div> */}
                    
                    <button
                      onClick={() => handleViewFeedback(course)}
                      className="flex items-center justify-center gap-2 w-full bg-blue-50 text-blue-600 border border-blue-200 rounded-md p-2 text-sm font-medium hover:bg-blue-100 transition duration-200"
                      // className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md font-medium transition duration-300"
                    >
                      <FaChartBar />
                      View Complete Feedback Report
                    </button>
                  </div>
                )}

                <div className="mt-4">
                  {/* <Link 
                    to={`/faculty/course/${course.id}`}
                    className="flex items-center justify-center gap-2 w-full bg-blue-50 text-blue-600 border border-blue-200 rounded-md p-2 text-sm font-medium hover:bg-blue-100 transition duration-200"
                  >
                    <span>View Course Details</span>
                    <FaExternalLinkAlt className="text-xs" />
                  </Link> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Course management links */}
      {/* <div className="mt-8 text-center">
        <Link
          to="/faculty/course-requests"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mr-6"
        >
          Request new course
          <FaExternalLinkAlt className="ml-1 text-xs" />
        </Link>
        
        <Link
          to="/faculty/course-schedule"
          className="inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          View teaching schedule
          <FaExternalLinkAlt className="ml-1 text-xs" />
        </Link>
      </div> */}
      
      {/* Enhanced Feedback Unavailability Notice */}
      {!isFeedbackAvailable && facultyCourses.length > 0 && (
        <div className="mt-6 bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
          <FaChartBar className="text-gray-400 text-xl mx-auto mb-2" />
          <p className="text-gray-700 font-medium">Course Feedback Reports</p>
          <p className="text-gray-600 text-sm">
            Feedback collection is currently closed. Reports will be available when the feedback period opens.
          </p>
        </div>
      )}
    </div>
  );
}

export default FacultyCourses;