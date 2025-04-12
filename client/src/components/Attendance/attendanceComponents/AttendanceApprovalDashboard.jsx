import React, { useState } from 'react';

const AttendanceApprovalDashboard = () => {
  // State to control whether the approval panel is visible
  const [isApprovalPanelOpen, setIsApprovalPanelOpen] = useState(false);

  // Dummy data for students
  const students = [
    { id: "S001", name: "John Doe", age: 20, program: "Computer Science", year: 3, department: "Engineering", activeCourses: ["CS301", "CS302", "MTH201"], currentSemester: 5 },
    { id: "S002", name: "Jane Smith", age: 21, program: "Biology", year: 4, department: "Sciences", activeCourses: ["BIO401", "CHM301", "BIO402"], currentSemester: 7 },
    { id: "S003", name: "Alex Johnson", age: 19, program: "Computer Science", year: 2, department: "Engineering", activeCourses: ["CS201", "CS302", "PHY101"], currentSemester: 3 },
    { id: "S004", name: "Sara Williams", age: 22, program: "Literature", year: 4, department: "Arts", activeCourses: ["LIT401", "HIS301", "ENG402"], currentSemester: 7 },
    { id: "S005", name: "Michael Brown", age: 20, program: "Mathematics", year: 3, department: "Sciences", activeCourses: ["MTH201", "MTH301", "CS301"], currentSemester: 5 }
  ];

  // Dummy data for courses
  const courses = [
    { id: "CS301", name: "Data Structures", description: "Advanced data structures and algorithms", facultyId: "F001", maxIntake: 60, slot: "A", semester: 5 },
    { id: "CS302", name: "Database Systems", description: "Fundamentals of database management", facultyId: "F002", maxIntake: 50, slot: "B", semester: 5 },
    { id: "MTH201", name: "Linear Algebra", description: "Vectors, matrices and linear transformations", facultyId: "F003", maxIntake: 70, slot: "C", semester: 3 },
    { id: "BIO401", name: "Molecular Biology", description: "Study of molecular basis of biological activity", facultyId: "F004", maxIntake: 40, slot: "D", semester: 7 },
    { id: "CHM301", name: "Organic Chemistry", description: "Study of structure and reactions of organic compounds", facultyId: "F005", maxIntake: 45, slot: "E", semester: 5 },
    { id: "CS201", name: "Programming Fundamentals", description: "Basic programming concepts", facultyId: "F001", maxIntake: 80, slot: "A", semester: 3 },
    { id: "PHY101", name: "Mechanics", description: "Study of motion and forces", facultyId: "F006", maxIntake: 65, slot: "B", semester: 1 },
    { id: "LIT401", name: "Modern Literature", description: "Analysis of modern literary works", facultyId: "F007", maxIntake: 35, slot: "C", semester: 7 },
    { id: "BIO402", name: "Genetics", description: "Study of genes and heredity", facultyId: "F004", maxIntake: 40, slot: "F", semester: 7 }
  ];

  // Dummy data for attendance approvals
  const [attendanceRequests, setAttendanceRequests] = useState([
    { studentId: "S001", courseId: "CS301", date: "2025-04-01", present: true, pendingApproval: true },
    { studentId: "S002", courseId: "BIO401", date: "2025-04-01", present: true, pendingApproval: true },
    { studentId: "S003", courseId: "CS302", date: "2025-04-02", present: true, pendingApproval: true },
    { studentId: "S001", courseId: "MTH201", date: "2025-04-02", present: true, pendingApproval: true },
    { studentId: "S004", courseId: "LIT401", date: "2025-04-03", present: true, pendingApproval: true },
    { studentId: "S005", courseId: "CS301", date: "2025-04-03", present: true, pendingApproval: true },
    { studentId: "S003", courseId: "PHY101", date: "2025-04-04", present: true, pendingApproval: true },
    { studentId: "S002", courseId: "BIO402", date: "2025-04-04", present: true, pendingApproval: true }
  ]);

  // State for course search
  const [selectedCourse, setSelectedCourse] = useState("");

  // Handle approval of attendance request
  const handleApprove = (index) => {
    const updatedRequests = [...attendanceRequests];
    updatedRequests[index] = { ...updatedRequests[index], pendingApproval: false };
    setAttendanceRequests(updatedRequests);
  };

  // Handle approving all filtered requests
  const handleApproveAll = () => {
    const updatedRequests = [...attendanceRequests];
    
    // Find all requests that match the current filter
    attendanceRequests.forEach((request, index) => {
      if (request.pendingApproval && (!selectedCourse || request.courseId === selectedCourse)) {
        updatedRequests[index] = { ...request, pendingApproval: false };
      }
    });
    
    setAttendanceRequests(updatedRequests);
  };

  // Filter attendance requests by selected course
  const filteredRequests = selectedCourse 
    ? attendanceRequests.filter(request => request.courseId === selectedCourse && request.pendingApproval) 
    : attendanceRequests.filter(request => request.pendingApproval);

  // Get student name by ID
  const getStudentName = (id) => {
    const student = students.find(s => s.id === id);
    return student ? student.name : "Unknown Student";
  };

  // Get course name by ID
  const getCourseName = (id) => {
    const course = courses.find(c => c.id === id);
    return course ? course.name : "Unknown Course";
  };

  // Toggle the approval panel
  const toggleApprovalPanel = () => {
    setIsApprovalPanelOpen(!isApprovalPanelOpen);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-2">
        <button 
          onClick={toggleApprovalPanel}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm flex items-center"
        >
          {isApprovalPanelOpen ? (
            <span>Close Approvals</span>
          ) : (
            <>
              <span>Open Pending Approvals</span>
              <span className="ml-2 bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {attendanceRequests.filter(r => r.pendingApproval).length}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Dashboard Summary (Always Visible)
      {!isApprovalPanelOpen && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Attendance Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium text-blue-700">Pending Approvals</h3>
              <p className="text-3xl font-bold text-blue-600">{attendanceRequests.filter(r => r.pendingApproval).length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-lg font-medium text-green-700">Approved Attendances</h3>
              <p className="text-3xl font-bold text-green-600">{attendanceRequests.filter(r => !r.pendingApproval).length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="text-lg font-medium text-purple-700">Total Courses</h3>
              <p className="text-3xl font-bold text-purple-600">{courses.length}</p>
            </div>
          </div>
        </div>
      )} */}
      
      {/* Approval Panel (Only Visible when toggled) */}
      {isApprovalPanelOpen && (
        <div className="bg-white rounded-lg shadow-md transition-all duration-300 ease-in-out">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Pending Attendance Approvals</h2>
              <p className="text-gray-600 mt-2">Review and approve student attendance records</p>
            </div>
            {filteredRequests.length > 0 && (
              <button
                onClick={handleApproveAll}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm"
              >
                Approve All {selectedCourse ? `(${getCourseName(selectedCourse)})` : ''}
              </button>
            )}
          </div>
          
          {/* Course Search */}
          <div className="p-6 border-b border-gray-200">
            <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Course:
            </label>
            <select
              id="course-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.id} - {course.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Attendance Requests Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request, index) => (
                    <tr key={`${request.studentId}-${request.courseId}-${request.date}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {getStudentName(request.studentId)}
                          </div>
                          <div className="ml-2 text-xs text-gray-500">
                            {request.studentId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getCourseName(request.courseId)}</div>
                        <div className="text-xs text-gray-500">{request.courseId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.pendingApproval
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {request.pendingApproval ? 'Pending' : 'Approved'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleApprove(attendanceRequests.findIndex(r => 
                            r.studentId === request.studentId && 
                            r.courseId === request.courseId && 
                            r.date === request.date
                          ))}
                          className={`px-4 py-2 rounded-md ${
                            request.pendingApproval
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!request.pendingApproval}
                        >
                          {request.pendingApproval ? 'Approve' : 'Approved'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      No pending approval requests found for the selected course.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Statistics
          <div className="p-6 bg-gray-50 rounded-b-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700">Total Pending</h3>
                <p className="text-2xl font-bold text-blue-600">{attendanceRequests.filter(r => r.pendingApproval).length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700">Approved Today</h3>
                <p className="text-2xl font-bold text-green-600">{attendanceRequests.filter(r => !r.pendingApproval).length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700">Course with Most Pending</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {(() => {
                    const counts = {};
                    attendanceRequests.filter(r => r.pendingApproval).forEach(r => {
                      counts[r.courseId] = (counts[r.courseId] || 0) + 1;
                    });
                    const mostPending = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
                    return mostPending ? `${mostPending[0]} (${mostPending[1]})` : 'None';
                  })()}
                </p>
              </div>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default AttendanceApprovalDashboard;