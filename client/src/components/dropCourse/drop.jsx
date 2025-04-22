import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaRegClock, FaBookOpen, FaExclamationTriangle, 
  FaCheck, FaTimes, FaHistory, FaLock 
} from "react-icons/fa";
import newRequest from '../../utils/newRequest';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Status icon helper
const StatusIcon = ({ status }) => {
  switch (status) {
    case 'Approved':
      return <FaCheck className="text-green-500 mr-2" />;
    case 'Rejected':
      return <FaTimes className="text-red-500 mr-2" />;
    case 'Pending':
      return <FaRegClock className="text-yellow-500 mr-2" />;
    default:
      return null;
  }
};

export default function DropCourse() {
  // Get userId from localStorage just like in MyCourses
  const {data:userData} = JSON.parse(localStorage.getItem("currentUser"));
  const {userId} = userData.user;
  const queryClient = useQueryClient();

  // Fetch global drop status
  const {
    isLoading: globalStatusLoading,
    error: globalStatusError,
    data: globalDropStatus
  } = useQuery({
    queryKey: ["globalDropStatus"],
    queryFn: () =>
      newRequest.get("/acadadmin/course-drop/status").then((res) => {
        return res.data;
      }),
  });

  // Fetch enrolled courses
  const { 
    isLoading: coursesLoading, 
    error: coursesError, 
    data: enrolledCourses = [] 
  } = useQuery({
    queryKey: ["studentCourses"],
    queryFn: () =>
      newRequest.get(`/student/${userId}/courses`).then((res) => {
        return res.data.courses || [];
      }),
  });

  // Fetch all drop requests (pending + history)
  const { 
    isLoading: requestsLoading, 
    error: requestsError, 
    data: dropRequests = [] 
  } = useQuery({
    queryKey: ["dropRequests"],
    queryFn: () =>
      newRequest.get(`/student/${userId}/drop-requests`).then((res) => {
        return res.data || [];
      }),
  });

  // Create a map of pending course drop requests for filtering
  const pendingDropRequestsMap = new Map();
  dropRequests.forEach(request => {
    if (request.status === 'Pending') {
      pendingDropRequestsMap.set(request.courseId, request);
    }
  });

  // Filter out courses that already have pending drop requests
  const availableForDrop = enrolledCourses.filter(course => 
    !pendingDropRequestsMap.has(course.id)
  );

  // Mutation for creating a drop request
  const createDropRequest = useMutation({
    mutationFn: (courseId) => {
      return newRequest.post(`/student/${userId}/drop-requests`, { courseId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dropRequests"] });
      queryClient.invalidateQueries({ queryKey: ["studentCourses"] });
    },
  });

  // Mutation for cancelling a drop request
  const cancelDropRequest = useMutation({
    mutationFn: (requestId) => {
      return newRequest.delete(`/student/${userId}/drop-requests/${requestId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dropRequests"] });
      queryClient.invalidateQueries({ queryKey: ["studentCourses"] });
    },
  });

  // Function to handle requesting to drop a course
  const handleRequestDropCourse = (courseId, courseName) => {
    if (window.confirm(`Are you sure you want to request dropping ${courseName}?`)) {
      createDropRequest.mutate(courseId, {
        onSuccess: () => {
          alert("Drop request submitted successfully. You will be notified when it's processed.");
        },
        onError: (error) => {
          alert(error.response?.data?.message || "Failed to submit drop request. Please try again.");
        }
      });
    }
  };
  
  // Function to handle canceling a drop request
  const handleCancelDropRequest = (requestId, courseName) => {
    if (window.confirm(`Are you sure you want to cancel your request to drop ${courseName}?`)) {
      cancelDropRequest.mutate(requestId, {
        onSuccess: () => {
          alert("Drop request cancelled successfully.");
        },
        onError: (error) => {
          alert(error.response?.data?.message || "Failed to cancel drop request. Please try again.");
        }
      });
    }
  };

  // Determine if we're loading data
  const isLoading = coursesLoading || requestsLoading || globalStatusLoading;
  
  // Determine if there's an error
  const error = coursesError || requestsError || globalStatusError;

  // Check if global drop is active
  console.log("Global Drop Status:", globalDropStatus.data);
  const isDropActive = globalDropStatus.data?.isActive || false;
  
  // Format global drop end date if available
  const dropEndDate = globalDropStatus.data?.endDate 
    ? new Date(globalDropStatus.data.endDate).toLocaleDateString() 
    : null;

  // Get pending drop requests
  const pendingRequests = dropRequests.filter(request => request.status === 'Pending');
  // Get non-pending (history) drop requests
  const historyRequests = dropRequests.filter(request => request.status !== 'Pending');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Drop Courses</h1>
      <p className="text-gray-600 mb-6">Request to drop courses from your current semester</p>
      
      {/* Global Drop Status Banner */}
      {!globalStatusLoading && !globalStatusError && (
        <div className={`mb-6 p-4 rounded-lg ${
          isDropActive 
            ? "bg-green-100 border border-green-200" 
            : "bg-red-100 border border-red-200"
        }`}>
          <div className="flex items-center">
            {isDropActive ? (
              <>
                <FaCheck className="text-green-600 mr-2 text-xl" />
                <div>
                  <p className="font-medium text-green-700">
                    Course Drop Period is Active
                  </p>
                  {dropEndDate && (
                    <p className="text-sm text-green-600">
                      You can request to drop courses until {dropEndDate}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <FaLock className="text-red-600 mr-2 text-xl" />
                <div>
                  <p className="font-medium text-red-700">
                    Course Drop Period is Inactive
                  </p>
                  <p className="text-sm text-red-600">
                    You cannot request to drop courses at this time
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your courses...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-8 rounded-lg text-center">
          <p className="text-red-700 text-lg mb-4">{error.message || "Failed to fetch courses"}</p>
          <Link
            to="/courses"
            className="bg-pink-500 text-white py-2 px-6 rounded-md font-medium hover:bg-pink-600 transition duration-300"
          >
            Back to My Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Enrolled Courses Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <FaBookOpen className="mr-2 text-pink-500" />
              Currently Enrolled Courses
            </h2>
            
            {availableForDrop.length === 0 ? (
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p className="text-gray-700">You don't have any courses available for dropping.</p>
                {enrolledCourses.length > 0 && pendingDropRequestsMap.size > 0 && (
                  <p className="text-gray-500 text-sm mt-2">
                    All your enrolled courses already have pending drop requests.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {availableForDrop.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition duration-300"
                  >
                    <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <div className="bg-pink-100 p-3 rounded-full">
                          <FaBookOpen className="text-pink-500 text-xl" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-bold text-pink-500 mr-2">{course.id}</span>
                            <span className="text-gray-800 font-medium">{course.name}</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <span>{course.credits} Credits</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRequestDropCourse(course.id, course.name)}
                        disabled={createDropRequest.isPending || !isDropActive}
                        className={`flex items-center justify-center gap-2 ${
                          createDropRequest.isPending || !isDropActive
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                            : "bg-white text-red-500 border border-red-500 hover:bg-red-50"
                        } py-2 px-4 rounded-md font-medium transition duration-300`}
                      >
                        {createDropRequest.isPending 
                          ? "Submitting..." 
                          : !isDropActive 
                            ? "Drop Period Closed" 
                            : "Request Drop"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Pending Drop Requests Section */}
          {pendingRequests.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                <FaRegClock className="mr-2 text-yellow-500" />
                Pending Drop Requests
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                {pendingRequests.map((request) => (
                  <div
                    key={request._id}
                    className="bg-yellow-50 rounded-lg shadow border border-yellow-200 hover:shadow-md transition duration-300"
                  >
                    <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <div className="bg-yellow-100 p-3 rounded-full">
                          <FaRegClock className="text-yellow-500 text-xl" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-bold text-pink-500 mr-2">{request.courseId}</span>
                            <span className="text-gray-800 font-medium">{request.courseName}</span>
                          </div>
                          <div className="text-sm text-yellow-600 mt-1 flex items-center">
                            <FaRegClock className="mr-1" /> 
                            Requested on {new Date(request.requestDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleCancelDropRequest(request._id, request.courseName)}
                        disabled={cancelDropRequest.isPending}
                        className={`flex items-center justify-center gap-2 ${
                          cancelDropRequest.isPending 
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                            : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-50"
                        } py-2 px-4 rounded-md font-medium transition duration-300`}
                      >
                        {cancelDropRequest.isPending ? "Cancelling..." : "Cancel Request"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drop Request History Section */}
          {historyRequests.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                <FaHistory className="mr-2 text-purple-500" />
                Drop Request History
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {historyRequests.map((request) => (
                  <div
                    key={request._id}
                    className={`bg-white rounded-lg shadow border ${
                      request.status === 'Approved'
                        ? 'border-green-200'
                        : request.status === 'Rejected'
                        ? 'border-red-200'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <StatusIcon status={request.status} />
                          <span className={`font-semibold ${
                            request.status === 'Approved'
                              ? 'text-green-600'
                              : request.status === 'Rejected'
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`}>
                            {request.courseName} ({request.courseId})
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {request.decisionDate
                            ? new Date(request.decisionDate).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      {request.remarks && (
                        <div className="bg-gray-50 p-3 rounded-md mt-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Admin Remarks:</span> {request.remarks}
                          </p>
                        </div>
                      )}
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Requested on {new Date(request.requestDate).toLocaleDateString()}
                        </span>
                        <span className={`text-sm ${
                          request.status === 'Approved'
                            ? 'text-green-600'
                            : request.status === 'Rejected'
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Information Section */}
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <FaExclamationTriangle className="mr-2" />
              Important Information
            </h3>
            <ul className="list-disc pl-5 text-blue-700 text-sm space-y-2">
              <li>Course drop requests are subject to approval by the administration.</li>
              <li>You may cancel a pending drop request at any time before it's approved.</li>
              <li>Once a course drop is approved, it cannot be reversed.</li>
              <li>Please check the academic calendar for the last date to drop courses without academic penalty.</li>
              {dropEndDate && isDropActive && (
                <li><strong>Current drop period ends on {dropEndDate}.</strong></li>
              )}
            </ul>
          </div>
          
          {/* Back to Courses Link */}
          <div className="mt-8 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center text-pink-600 hover:text-pink-700"
            >
              Back to My Courses
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}