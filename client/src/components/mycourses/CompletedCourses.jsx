import { useState, useEffect } from "react";
import newRequest from '../../utils/newRequest';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  FaBookOpen,
  FaCheckCircle,
  FaCalendarAlt,
  FaRegChartBar,
  FaUniversity,
  FaBuilding,
  FaClock,
  FaArrowLeft
} from "react-icons/fa";

function CompletedCourses() {
  const { data: userData } = JSON.parse(localStorage.getItem("currentUser"));
  const { userId } = userData.user;

  const { isLoading, error, data: completedCourses = [] } = useQuery({
    queryKey: ["completedCourses"],
    queryFn: () =>
      newRequest.get(`/student/${userId}/completed-courses`).then((res) => {
        return res.data.courses || [];
      }),
  });

  console.log("Completed Courses:", completedCourses);
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-6">
      {/* Back to Courses Navigation */}
      <div className="mb-4">
        <Link to="/courses" className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
          <FaArrowLeft className="mr-2" />
          Back to Courses
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-gray-800">Completed Courses</h1>
      <p className="text-gray-600 mb-6">Your academic history</p>

      {isLoading ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your academic history...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-8 rounded-lg text-center">
          <p className="text-red-700 text-lg mb-4">
            {error.message || "Failed to fetch completed courses"}
          </p>
        </div>
      ) : completedCourses.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-700 text-lg mb-4">No completed courses found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {completedCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            >
              {/* Course Header with Grade */}
              <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaCheckCircle className="text-green-500 text-lg" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {course.courseName}
                    </h2>
                    <p className="text-gray-600 text-sm">{course.courseCode}</p>
                  </div>
                </div>
                <span className="bg-gray-100 text-gray-700 text-sm py-1 px-3 rounded-full font-medium">
                  {course.grade || 'N/A'}
                </span>
              </div>

              {/* Course Details - Top Row */}
              <div className="p-4 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 rounded-full p-2">
                    <FaRegChartBar className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Credits</p>
                    <p className="text-lg font-semibold text-green-600">{course.credits}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 rounded-full p-2">
                    <FaCalendarAlt className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Semester</p>
                    <p className="text-lg font-semibold text-green-600">{course.semester}</p>
                  </div>
                </div>
              </div>

              {/* Department Row */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 rounded-full p-2">
                    <FaBuilding className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Department</p>
                    <p className="text-lg font-semibold text-green-600">{course.department}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-wrap justify-between items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaUniversity className="text-green-400" />
                    <span>{course.creditOrAudit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-green-400" />
                    <span>
                      Completed: {formatDate(course.completedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CompletedCourses;