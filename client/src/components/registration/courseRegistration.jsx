import { useState } from "react";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import { FaBookOpen, FaSpinner, FaPlus, FaBook } from "react-icons/fa";

function CourseRegistration() {
  // Get userId from localStorage (same as MyCourses)
  const { data: userData } = JSON.parse(localStorage.getItem("currentUser"));
  const { userId } = userData.user;
  const queryClient = useQueryClient();

  // State for elective and audit selections
  const [selectedElectives, setSelectedElectives] = useState(["", ""]);
  const [selectedAudits, setSelectedAudits] = useState(["", "", ""]);

  // Fetch available courses
  // student aur students mein fark hai kaise?
  const { isLoading, error, data: coursesData } = useQuery({
    queryKey: ["availableCourses", userId],
    queryFn: () =>
      newRequest.get(`/student/${userId}/available-courses`).then((res) => res.data),
    select: data => ({
      core: data.filter(c => c.type === 'Core'),
      elective: data.filter(c => c.type === 'Elective'),
      audit: data.filter(c => c.type === 'Audit')
    })
  });

  // Fetch pending requests
  const { data: pendingRequests = [] } = useQuery({
    queryKey: ["pendingRequests", userId],
    queryFn: () =>
      newRequest.get(`/student/${userId}/pending-requests`).then(res => res.data)
  });

  // Register handler
  const handleRegister = async (courseCode, courseType) => {
    try {
      await newRequest.post(`/student/${userId}/course-approval`, {
        courseCode,
        courseType
      });
      queryClient.invalidateQueries(["pendingRequests", userId]);
      // Optionally, show a toast or notification here
    } catch (err) {
      alert("Failed to send registration request.");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 p-8 rounded-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-gray-700">Loading available courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-8 rounded-lg text-center">
        <p className="text-red-700 text-lg mb-4">{error.message || "Failed to fetch courses"}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Course Registration</h1>
      <p className="text-gray-600 mb-6">Select and register for your courses</p>

      {/* Core Courses */}
      <Section title="Core Courses">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coursesData.core.map((course) => (
            <CourseCard
              key={course.courseCode}
              course={course}
              onRegister={() => handleRegister(course.courseCode, "Core")}
            />
          ))}
        </div>
      </Section>

      {/* Elective Courses */}
      <Section title="Elective Courses (Select 2)">
        <div className="space-y-4">
          {selectedElectives.map((selected, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <select
                className="flex-1 border rounded-lg p-3 bg-white shadow-sm"
                value={selected}
                onChange={e => {
                  const newSelected = [...selectedElectives];
                  newSelected[idx] = e.target.value;
                  setSelectedElectives(newSelected);
                }}
              >
                <option value="">Select Elective Course</option>
                {coursesData.elective.map(course => (
                  <option key={course.courseCode} value={course.courseCode}>
                    {course.courseCode} - {course.courseName} ({course.credits} credits)
                  </option>
                ))}
              </select>
              <button
                className={`px-6 py-3 rounded-lg ${
                  selected ? 'bg-pink-500 hover:bg-pink-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                } transition-colors`}
                disabled={!selected}
                onClick={() => handleRegister(selected, "Elective")}
              >
                Register
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Audit Courses */}
      <Section title="Audit Courses (Select 3)">
        <div className="space-y-4">
          {selectedAudits.map((selected, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <select
                className="flex-1 border rounded-lg p-3 bg-white shadow-sm"
                value={selected}
                onChange={e => {
                  const newSelected = [...selectedAudits];
                  newSelected[idx] = e.target.value;
                  setSelectedAudits(newSelected);
                }}
              >
                <option value="">Select Audit Course</option>
                {coursesData.audit.map(course => (
                  <option key={course.courseCode} value={course.courseCode}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </select>
              <button
                className={`px-6 py-3 rounded-lg ${
                  selected ? 'bg-pink-500 hover:bg-pink-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                } transition-colors`}
                disabled={!selected}
                onClick={() => handleRegister(selected, "Audit")}
              >
                Register
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Pending Requests */}
      <Section title="Pending Approval Requests">
        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pending requests
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Course</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingRequests.map(request => (
                  <tr key={request._id}>
                    <td className="px-6 py-4">{request.courseCode}</td>
                    <td className="px-6 py-4 capitalize">{request.courseType.toLowerCase()}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                        <FaSpinner className="animate-spin mr-2" />
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
}

// Section component for layout
function Section({ title, children }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaBook className="text-pink-500" />
        {title}
      </h2>
      {children}
    </div>
  );
}

// Course card for core courses
function CourseCard({ course, onRegister }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {course.courseCode} - {course.courseName}
          </h3>
          <p className="text-gray-600 mt-1">{course.department}</p>
          <div className="mt-2 flex gap-2">
            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm">
              {course.credits} Credits
            </span>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
              {course.semester}
            </span>
          </div>
        </div>
        <button
          onClick={onRegister}
          className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors flex items-center gap-2"
        >
          <FaPlus />
          Register
        </button>
      </div>
    </div>
  );
}

export default CourseRegistration;
