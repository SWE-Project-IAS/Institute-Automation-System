import React, { useState, useEffect } from 'react';

const AttendanceApprovalDashboard = () => {
  const [isApprovalPanelOpen, setIsApprovalPanelOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [attendanceRequests, setAttendanceRequests] = useState([]);
  const [loading, setLoading] = useState({
    courses: true,
    approvals: true
  });
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");

  // Fetch courses and approval requests on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        const coursesResponse = await fetch('https://ias-server-cpoh.onrender.com/api/attendancelanding/admin');
        if (!coursesResponse.ok) throw new Error('Failed to fetch courses');
        const coursesData = await coursesResponse.json();
        setCourses(coursesData.data || coursesData);

        // Fetch approval requests
        const approvalsResponse = await fetch('https://ias-server-cpoh.onrender.com/api/attendancelanding/admin/approval');
        if (!approvalsResponse.ok) throw new Error('Failed to fetch approval requests');
        const approvalsData = await approvalsResponse.json();
        setAttendanceRequests(approvalsData);

        setLoading({ courses: false, approvals: false });
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
        setLoading({ courses: false, approvals: false });
      }
    };

    fetchData();
  }, []);

  // Handle approval of attendance request - FIXED endpoint and state handling
  const handleApprove = async (request) => {
    try {
      const response = await fetch('https://ias-server-cpoh.onrender.com/api/attendancelanding/admin/approval', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseCode: request.courseId,
          rollNo: request.studentId,
          date: request.date
        })
      });
      
      if (!response.ok) throw new Error('Approval failed');
      
      const result = await response.json();

      // Only update the specific approved item
      setAttendanceRequests(prev => 
        prev.map(req => 
          (req.courseId === request.courseId && 
           req.studentId === request.studentId && 
           new Date(req.date).toDateString() === new Date(request.date).toDateString())
            ? { ...req, pendingApproval: false } 
            : req
        )
      );
    } catch (err) {
      console.error("Approval error:", err);
      alert(`Approval failed: ${err.message}`);
    }
  };

  // Handle approving all filtered requests - FIXED to ensure consistent handling
  const handleApproveAll = async () => {
    try {
      const approvalPromises = filteredRequests.map(request => 
        fetch('https://ias-server-cpoh.onrender.com/api/attendancelanding/admin/approval', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseCode: request.courseId,
            rollNo: request.studentId,
            date: request.date
          })
        })
      );
      
      const results = await Promise.all(approvalPromises);
      
      // Check if all requests were successful
      const allSuccessful = results.every(res => res.ok);
      if (!allSuccessful) throw new Error('Some approvals failed');

      // Make a copy of the current attendance requests and update only the approved ones
      const updatedRequests = [...attendanceRequests];
      
      filteredRequests.forEach(filtered => {
        const index = updatedRequests.findIndex(req => 
          req.courseId === filtered.courseId && 
          req.studentId === filtered.studentId && 
          new Date(req.date).toDateString() === new Date(filtered.date).toDateString()
        );
        
        if (index !== -1) {
          updatedRequests[index] = { ...updatedRequests[index], pendingApproval: false };
        }
      });
      
      setAttendanceRequests(updatedRequests);
    } catch (err) {
      console.error("Bulk approval error:", err);
      alert(`Bulk approval failed: ${err.message}`);
    }
  };

  // Filter attendance requests by selected course
  const filteredRequests = selectedCourse 
    ? attendanceRequests.filter(request => request.courseId === selectedCourse && request.pendingApproval) 
    : attendanceRequests.filter(request => request.pendingApproval);

  // Get course name by ID
  const getCourseName = (id) => {
    const course = courses.find(c => c.courseCode === id);
    return course ? course.courseName : "Unknown Course";
  };

  // Toggle the approval panel
  const toggleApprovalPanel = () => {
    setIsApprovalPanelOpen(!isApprovalPanelOpen);
  };

  // Debug information in console
  useEffect(() => {
  }, [filteredRequests, attendanceRequests]);

  if (loading.courses || loading.approvals) {
    return <div className="container mx-auto p-6 max-w-6xl">Loading data...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-6 max-w-6xl text-red-500">Error: {error}</div>;
  }

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
                <option key={course.courseCode} value={course.courseCode}>
                  {course.courseCode} - {course.courseName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr key={`${request.studentId}-${request.courseId}-${request.date}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.studentId}
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
                          onClick={() => handleApprove(request)}
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
        </div>
      )}
    </div>
  );
};

export default AttendanceApprovalDashboard;