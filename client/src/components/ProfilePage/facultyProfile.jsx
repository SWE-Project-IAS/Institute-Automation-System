import React from "react";
import styles from "./ProfilePage.module.css"; // Reuse existing CSS
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { FaGraduationCap, FaBriefcase, FaBook, FaAward, FaUsers, FaTrophy, FaMicrophone, FaSpinner } from "react-icons/fa";

const FacultyProfile = () => {
  const { data: userData } = JSON.parse(localStorage.getItem("currentUser"));
  const { userId } = userData.user;

  const { isLoading, error, data } = useQuery({
    queryKey: [`${userId}`],
    queryFn: () =>
      newRequest.get(`/faculty/${userId}`).then((res) => {
        return res.data;
      }),
  });

  const { isLoadingCourses, errorCourses, data: facultyCourses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () =>
      newRequest.get(`/faculty/${userId}/courses`).then((res) => {
        return res.data.courses;
      }),
  });

  const faculty = {
    name: data?.userId?.name,
    photo: data?.userId?.profilePhoto || "/student.jpg", // Placeholder image
    designation: data?.designation,
    email: data?.email,
    department: data?.department,
    yearOfJoining: data?.yearOfJoining,
    fieldsOfInterests: data?.specialization,
    education: data?.qualifications,
    courses: facultyCourses,
    experience: data?.experience || [],
    publications: data?.publications || [],
    researchStudents: data?.researchStudents || [],
    achievements: data?.achievements || [],
    conferences: data?.conferences || [],
  };

  // Loading state UI
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
          <p className="text-lg text-gray-700">Loading faculty profile...</p>
        </div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 m-6 rounded-lg">
        <h3 className="text-red-800 text-lg font-semibold">Error Loading Profile</h3>
        <p className="text-red-700">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-8 bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header with profile info */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={faculty.photo}
            alt={faculty.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{faculty.name}</h1>
            <p className="text-xl mb-1">{faculty.designation}</p>
            <p className="text-blue-100 mb-4">{faculty.department}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <p className="bg-blue-700 px-3 py-1 rounded-full text-sm">
                Joined: {faculty.yearOfJoining}
              </p>
              <p className="bg-blue-700 px-3 py-1 rounded-full text-sm">
                {faculty.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Fields of Interest */}
          {faculty.fieldsOfInterests && faculty.fieldsOfInterests.trim() !== "" && (
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
              <h2 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                <FaGraduationCap className="mr-2 text-blue-600" />
                Fields of Interest
              </h2>
              <p className="text-gray-700 leading-relaxed">{faculty.fieldsOfInterests}</p>
            </div>
          )}

          {/* Experience */}
          {faculty.experience?.length > 0 && faculty.experience.some(exp => exp && exp.trim() !== "") && (
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
              <h2 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                <FaBriefcase className="mr-2 text-blue-600" />
                Experience
              </h2>
              <ul className="space-y-2">
                {faculty.experience.filter(exp => exp && exp.trim() !== "").map((exp, idx) => (
                  <li key={idx} className="flex">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">{exp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Research Students */}
          {faculty.researchStudents?.length > 0 && faculty.researchStudents.some(student => student && student.trim() !== "") && (
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
              <h2 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                <FaUsers className="mr-2 text-blue-600" />
                Research Students
              </h2>
              <ul className="space-y-2">
                {faculty.researchStudents.filter(student => student && student.trim() !== "").map((rs, idx) => (
                  <li key={idx} className="flex">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">{rs}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right column (wider) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Courses Taught */}
          {faculty.courses?.length > 0 && faculty.courses.some(course => course && Object.keys(course).length > 0) && (
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h2 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                <FaBook className="mr-2 text-blue-600" />
                Courses Taught
              </h2>
              {isLoadingCourses ? (
                <div className="flex items-center justify-center p-6">
                  <FaSpinner className="animate-spin text-blue-600 mr-2" />
                  <span>Loading courses...</span>
                </div>
              ) : errorCourses ? (
                <p className="text-red-600">Error loading courses: {errorCourses.message}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {faculty.courses.filter(course => course && Object.keys(course).length > 0).map((course, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{course.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{course.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{course.department}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{course.credits}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{course.year}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{course.session}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{course.students}</td>
                          <td className="px-4 py-3 text-sm text-blue-600 font-medium">{course.avgAttendance}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Publications */}
          {faculty.publications?.length > 0 && faculty.publications.some(pub => pub && pub.trim() !== "") && (
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h2 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                <FaBook className="mr-2 text-blue-600" />
                Publications
              </h2>
              <ul className="space-y-3">
                {faculty.publications.filter(pub => pub && pub.trim() !== "").map((pub, idx) => (
                  <li key={idx} className="pb-2 border-b border-gray-100 last:border-0">
                    <div className="flex">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-700">{pub}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Achievements and Conferences in two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Achievements */}
            {faculty.achievements?.length > 0 && faculty.achievements.some(achievement => achievement && achievement.trim() !== "") && (
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h2 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                  <FaTrophy className="mr-2 text-blue-600" />
                  Achievements
                </h2>
                <ul className="space-y-2">
                  {faculty.achievements.filter(achievement => achievement && achievement.trim() !== "").map((achievement, idx) => (
                    <li key={idx} className="flex">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Conferences */}
            {faculty.conferences?.length > 0 && faculty.conferences.some(conf => conf && Object.keys(conf).length > 0) && (
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h2 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                  <FaMicrophone className="mr-2 text-blue-600" />
                  Conferences
                </h2>
                <ul className="space-y-2">
                  {faculty.conferences.filter(conf => conf && Object.keys(conf).length > 0).map((conf, idx) => (
                    <li key={idx} className="flex">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-700">
                        <strong>{conf.name}</strong> ({conf.year}) - {conf.role}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;