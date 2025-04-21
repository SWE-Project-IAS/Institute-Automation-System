import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const CourseRegistrationFaculty = () => {
  const queryClient = useQueryClient();
  const { data: userData } = JSON.parse(localStorage.getItem("currentUser"));
  const { userId: facultyId } = userData.user;
  
  // Get the course code from URL parameters
  const { courseCode } = useParams();
  const location = useLocation();
  const courseName = location.state?.courseName || courseCode;

  const [filters, setFilters] = useState({ 
    rollNo: "", 
    name: "", 
    program: "", 
    semester: "",
  });

  // Fetch pending requests for the specific course
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["pendingRequests", facultyId, courseCode],
    queryFn: () => 
      newRequest.get(`/faculty/${facultyId}/pending-requests-approval?courseCode=${courseCode}`),
  });

  // Approval mutation
  const approveMutation = useMutation({
    mutationFn: (requestId) => 
      newRequest.put(`/faculty/approval-requests/${requestId}`, { status: "Approved" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingRequests", facultyId, courseCode]);
    }
  });

  // Rejection mutation
  const rejectMutation = useMutation({
    mutationFn: (requestId) => 
      newRequest.put(`/faculty/approval-requests/${requestId}`, { status: "Rejected" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingRequests", facultyId, courseCode]);
    }
  });

  if (isLoading) return <div>Loading requests...</div>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">
        Course Registration Approvals for {courseName}
      </h2>
  
    {/* Requests Table */}
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2 text-center">Roll No</th>
          <th className="border p-2 text-center">Program</th>
          <th className="border p-2 text-center">Semester</th>
          <th className="border p-2 text-center">Course Type</th>
          <th className="border p-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(requests.data) && requests.data.length > 0 ? (
          requests.data.map((request) => (
            <tr key={request.id} className="hover:bg-gray-100 text-center">
              <td className="border p-2">{request.rollNo || 'N/A'}</td>
              <td className="border p-2">{request.program || 'Not specified'}</td>
              <td className="border p-2">{request.semester || 'N/A'}</td>
              <td className="border p-2 capitalize">{request.courseType?.toLowerCase() || 'regular'}</td>
              <td className="border p-2">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => approveMutation.mutate(request.id)}
                    className="w-28 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
                    disabled={approveMutation.isLoading}
                  >
                    {approveMutation.isLoading ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => rejectMutation.mutate(request.id)}
                    className="w-28 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
                    disabled={rejectMutation.isLoading}
                  >
                    {rejectMutation.isLoading ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="border p-2 text-center text-gray-500 py-6">
              No pending approval requests for {courseName}
            </td>
          </tr>
        )}
      </tbody>
    </table>

    </div>
  );
};

export default CourseRegistrationFaculty;
