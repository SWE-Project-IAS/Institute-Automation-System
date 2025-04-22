import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const CourseRegistrationFaculty = () => {
  const queryClient = useQueryClient();
  const { data: userData } = JSON.parse(localStorage.getItem("currentUser"));
  const { userId: facultyId } = userData.user;

  const location = useLocation();
  const { courseName: selectedCourseCode } = location.state || {};

  const [filters, setFilters] = useState({
    rollNo: "",
    program: "",
    semester: "",
  });

  const [selectedRequests, setSelectedRequests] = useState([]);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["pendingRequests", facultyId],
    queryFn: () => newRequest.get(`/faculty/${facultyId}/pending-requests-approval`),
  });

  const approveMutation = useMutation({
    mutationFn: (requestId) =>
      newRequest.put(`/faculty/approval-requests/${requestId}`, { status: "Approved" }),
    onSuccess: () => queryClient.invalidateQueries(["pendingRequests"]),
  });

  const rejectMutation = useMutation({
    mutationFn: (requestId) =>
      newRequest.put(`/faculty/approval-requests/${requestId}`, { status: "Rejected" }),
    onSuccess: () => queryClient.invalidateQueries(["pendingRequests"]),
  });

  const handleBulkAction = async (status) => {
    const mutation = status === "Approved" ? approveMutation : rejectMutation;

    for (const id of selectedRequests) {
      await mutation.mutateAsync(id);
    }

    setSelectedRequests([]);
  };

  const handleCheckboxChange = (requestId) => {
    setSelectedRequests((prevSelected) =>
      prevSelected.includes(requestId)
        ? prevSelected.filter((id) => id !== requestId)
        : [...prevSelected, requestId]
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredRequests = Array.isArray(requests.data)
    ? requests.data.filter((req) => {
        return (
          req.courseCode === selectedCourseCode &&
          (!filters.rollNo || req.rollNo?.toLowerCase().includes(filters.rollNo.toLowerCase())) &&
          (!filters.program || req.program?.toLowerCase().includes(filters.program.toLowerCase())) &&
          (!filters.semester || req.semester?.toString() === filters.semester)
        );
      })
    : [];

  if (isLoading) return <div>Loading requests...</div>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">
        Course Registration Approvals for {selectedCourseCode}
      </h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          name="rollNo"
          placeholder="Filter by Roll No"
          value={filters.rollNo}
          onChange={handleFilterChange}
          className="p-2 border rounded w-1/3"
        />
        <input
          type="text"
          name="program"
          placeholder="Filter by Program"
          value={filters.program}
          onChange={handleFilterChange}
          className="p-2 border rounded w-1/3"
        />
        <input
          type="text"
          name="semester"
          placeholder="Filter by Semester"
          value={filters.semester}
          onChange={handleFilterChange}
          className="p-2 border rounded w-1/3"
        />
      </div>

      {/* Bulk Actions */}
      {selectedRequests.length > 0 && (
        <div className="mb-4 flex gap-4">
          <button
            onClick={() => handleBulkAction("Approved")}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Approve Selected ({selectedRequests.length})
          </button>
          <button
            onClick={() => handleBulkAction("Rejected")}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reject Selected ({selectedRequests.length})
          </button>
        </div>
      )}

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">
              <input
                type="checkbox"
                onChange={(e) =>
                  setSelectedRequests(
                    e.target.checked ? filteredRequests.map((r) => r.id) : []
                  )
                }
                checked={
                  filteredRequests.length > 0 &&
                  selectedRequests.length === filteredRequests.length
                }
              />
            </th>
            <th className="border p-2">Roll No</th>
            <th className="border p-2">Program</th>
            <th className="border p-2">Semester</th>
            <th className="border p-2">Course Code</th>
            <th className="border p-2">Course Type</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-100">
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRequests.includes(request.id)}
                    onChange={() => handleCheckboxChange(request.id)}
                  />
                </td>
                <td className="border p-2">{request.rollNo || "N/A"}</td>
                <td className="border p-2">{request.program || "Not specified"}</td>
                <td className="border p-2">{request.semester || "N/A"}</td>
                <td className="border p-2">{request.courseCode || "Unknown"}</td>
                <td className="border p-2 capitalize">
                  {request.courseType?.toLowerCase() || "regular"}
                </td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => approveMutation.mutate(request.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    disabled={approveMutation.isLoading}
                  >
                    {approveMutation.isLoading ? "Approving..." : "Approve"}
                  </button>
                  <button
                    onClick={() => rejectMutation.mutate(request.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    disabled={rejectMutation.isLoading}
                  >
                    {rejectMutation.isLoading ? "Rejecting..." : "Reject"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="border p-2 text-center text-gray-500">
                No pending approval requests for this course
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CourseRegistrationFaculty;