import React from "react";
import styles from "./ProfilePage.module.css";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { FaUser, FaGraduationCap, FaBook, FaSpinner, FaExclamationTriangle } from "react-icons/fa";

const StudentProfile = () => {
  const { data: userData } = JSON.parse(localStorage.getItem("currentUser"));
  const { email, userId } = userData.user;

  const { isLoading, error, data } = useQuery({
    queryKey: [`${userId}`],
    queryFn: () =>
      newRequest.get(`/student/${userId}`).then((res) => {
        return res.data;
      }),
  });

  const { isLoadingCourses, errorCourses, data: studentCourses = [] } = useQuery({
    queryKey: ["completed-courses"],
    queryFn: () =>
      newRequest.get(`/student/${userId}/completed-courses`).then((res) => {
        return res.data.courses || [];
      }),
  });

  const student = {
    rollNumber: data?.rollNo,
    name: data?.userId?.name,
    photo: data?.userId?.profilePicture || "/dummy_user.png",
    signphoto: data?.userId?.signature || "/sign.jpg",
    hostel: data?.hostel,
    email: data?.email,
    Bloodgr: data?.userId?.bloodGroup,
    contactno: data?.userId?.contactNo,
    dob: data?.userId?.dateOfBirth,
    roomNo: data?.roomNo,
    semester: data?.semester,
    fatherName: data?.fatherName,
    motherName: data?.motherName,
    branch: data?.department,
    yearOfJoining: data?.batch?.substr(0, 4),
    programme: data?.program,
    courses: studentCourses,
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 rounded-lg">
          <FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
          <p className="text-lg text-gray-700">Loading student profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
        <div className="flex items-center">
          <FaExclamationTriangle className="text-red-500 text-xl mr-3" />
          <h3 className="text-lg font-medium text-red-800">Error Loading Profile</h3>
        </div>
        <p className="mt-2 text-red-700">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden mt-8 mb-8">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center">
          <FaUser className="mr-2" /> Student Profile
        </h1>
        <p className="text-blue-100 mt-1">Academic Records & Personal Information</p>
      </div>
      
      <div className="p-6">
        {/* Profile Information Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Photo and Signature */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={student.photo}
                alt="Student"
                className="w-36 h-36 rounded-full object-cover border-4 border-gray-200 shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {student.semester || 'N/A'} Sem
              </div>
            </div>
            
            <div className="w-full max-w-[150px] bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1 text-center">Signature</p>
              <img
                src={student.signphoto}
                alt="Signature"
                className="h-14 w-full object-contain"
              />
            </div>
          </div>

          {/* Student Details */}
          <div className="w-full">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{student.name || 'N/A'}</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                {student.rollNumber || 'N/A'}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                <div className="flex items-center border-b border-gray-200 pb-1">
                  <span className="text-gray-500 w-1/2">Programme:</span>
                  <span className="font-semibold text-gray-800">{student.programme || 'N/A'}</span>
                </div>
                <div className="flex items-center border-b border-gray-200 pb-1">
                  <span className="text-gray-500 w-1/2">Branch:</span>
                  <span className="font-semibold text-gray-800">{student.branch || 'N/A'}</span>
                </div>
                <div className="flex items-center border-b border-gray-200 pb-1">
                  <span className="text-gray-500 w-1/2">Year of Joining:</span>
                  <span className="font-semibold text-gray-800">{student.yearOfJoining || 'N/A'}</span>
                </div>
                <div className="flex items-center border-b border-gray-200 pb-1">
                  <span className="text-gray-500 w-1/2">Email:</span>
                  <span className="font-semibold text-gray-800">{student.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Personal Details</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Blood Group:</span> <span className="font-medium ml-2">{student.Bloodgr || 'N/A'}</span></p>
                  <p><span className="text-gray-500">Contact Number:</span> <span className="font-medium ml-2">{student.contactno || 'N/A'}</span></p>
                  <p><span className="text-gray-500">Date of Birth:</span> <span className="font-medium ml-2">{student.dob || 'N/A'}</span></p>
                  <p><span className="text-gray-500">Father's Name:</span> <span className="font-medium ml-2">{student.fatherName || 'N/A'}</span></p>
                  <p><span className="text-gray-500">Mother's Name:</span> <span className="font-medium ml-2">{student.motherName || 'N/A'}</span></p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Hostel Information</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Hostel:</span> <span className="font-medium ml-2">{student.hostel || 'N/A'}</span></p>
                  <p><span className="text-gray-500">Room Number:</span> <span className="font-medium ml-2">{student.roomNo || 'N/A'}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Table Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FaGraduationCap className="mr-2 text-blue-600" /> Completed Courses
            </h2>
            {isLoadingCourses && <FaSpinner className="animate-spin text-blue-600" />}
          </div>

          {errorCourses ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-red-700">Error loading courses: {errorCourses.message}</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {student.courses.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-4 text-center text-gray-500">No completed courses found</td>
                    </tr>
                  ) : (
                    student.courses.map((course, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{course.courseCode}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{course.courseName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{course.department}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{course.creditOrAudit}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{course.semester}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{course.credits}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2.5 py-0.5 rounded-full font-medium ${
                            course.grade === 'A' || course.grade === 'A+' || course.grade === 'A-'
                              ? 'bg-green-100 text-green-800'
                              : course.grade === 'B' || course.grade === 'B+' || course.grade === 'B-'
                              ? 'bg-blue-100 text-blue-800'
                              : course.grade === 'C' || course.grade === 'C+' || course.grade === 'C-'
                              ? 'bg-yellow-100 text-yellow-800'
                              : course.grade === 'D' || course.grade === 'D+'
                              ? 'bg-orange-100 text-orange-800'
                              : course.grade === 'F'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {course.grade}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;