import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const CourseRegistrationFaculty = ({}) => {
  const queryClient = useQueryClient();
  const {data:userData} = JSON.parse(localStorage.getItem("currentUser"));
  const {userId: facultyId} = userData.user;

  const [filters, setFilters] = useState({ 
    rollNo: "", 
    name: "", 
    program: "", 
    semester: "" 
  });

  // Fetch pending requests
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["pendingRequests", facultyId],
    queryFn: () => newRequest.get(`/faculty/${facultyId}/pending-requests-approval`),
  });

  // Approval mutation
  const approveMutation = useMutation({
    mutationFn: (requestId) => 
      newRequest.put(`/faculty/approval-requests/${requestId}`, { status: "Approved" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingRequests"]);
    }
  });

  // Rejection mutation
  const rejectMutation = useMutation({
    mutationFn: (requestId) => 
      newRequest.put(`/faculty/approval-requests/${requestId}`, { status: "Rejected" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingRequests"]);
    }
  });

  // console.log(requests.data);
  if (isLoading) return <div>Loading requests...</div>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Course Registration Approvals</h2>
  
      {/* Requests Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Roll No</th>
            <th className="border p-2">Program</th>
            <th className="border p-2">Semester</th>
            <th className="border p-2">Course Code</th>
            <th className="border p-2">Course Type</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(requests.data) && requests.data.length > 0 ? (
            requests.data.map((request) => (
              <tr key={request.id} className="hover:bg-gray-100">
                <td className="border p-2">{request.rollNo || 'N/A'}</td>
                <td className="border p-2">{request.program || 'Not specified'}</td>
                <td className="border p-2">{request.semester || 'N/A'}</td>
                <td className="border p-2">{request.courseCode || 'Unknown'}</td>
                <td className="border p-2 capitalize">{request.courseType?.toLowerCase() || 'regular'}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => approveMutation.mutate(request.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    disabled={approveMutation.isLoading}
                  >
                    {approveMutation.isLoading ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => rejectMutation.mutate(request.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    disabled={rejectMutation.isLoading}
                  >
                    {rejectMutation.isLoading ? 'Rejecting...' : 'Reject'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border p-2 text-center text-gray-500">
                No pending approval requests
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};  

export default CourseRegistrationFaculty;