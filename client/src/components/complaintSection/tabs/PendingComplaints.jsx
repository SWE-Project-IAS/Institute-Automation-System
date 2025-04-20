import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ComplaintList from "../common/ComplaintList";

/**
 * PendingComplaints component displays complaints with "Pending" status for admin users
 * @param {Object} props Component props
 * @param {boolean} props.isLoading - Initial loading state
 * @param {function} props.refetch - Function to refetch all complaint data
 * @param {string} props.role - User role
 * @returns {JSX.Element} The rendered component
 */
const PendingComplaints = ({ isLoading: initialLoading, refetch: refetchAll, role }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState(null);

  // Fetch complaints with "Pending" status
  const {
    data: responseData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["pendingComplaints", page, limit],
    queryFn: async () => {
      const response = await fetch("https://ias-server-cpoh.onrender.com/api/complaints/admin/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ 
          status: "Pending",
          page, 
          limit 
        }),
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch pending complaints");
      }
      return result;
    },
  });

  // Extract complaints from response data
  const complaints = responseData?.data || [];

  // Update pagination state when response data changes
  useEffect(() => {
    if (responseData?.pagination) {
      setPagination(responseData.pagination);
    }
  }, [responseData]);

  // Apply search filter if there's a search query
  const filteredComplaints = searchQuery.trim() 
    ? complaints.filter(complaint => {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = complaint.title?.toLowerCase().includes(query);
        const categoryMatch = complaint.category?.toLowerCase().includes(query);
        const subCategoryMatch = complaint.subCategory?.toLowerCase().includes(query);
        const assigneeMatch = complaint.assignedName?.toLowerCase().includes(query);
        
        return titleMatch || categoryMatch || subCategoryMatch || assigneeMatch;
      })
    : complaints;

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle page size change
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  return (
    <>
      <ComplaintList 
        complaints={filteredComplaints}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedComplaint={selectedComplaint}
        setSelectedComplaint={setSelectedComplaint}
        refetch={() => {
          refetch();  // Refetch the current tab data
          refetchAll(); // Also refetch all data to update counts in the tab bar
        }}
        role={role}
      />

      {/* Pagination Controls */}
      {pagination && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="mr-2 text-sm text-gray-600">Items per page:</span>
            <select 
              className="border rounded p-1 text-sm" 
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="ml-4 text-sm text-gray-600">
              Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} - {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems}
            </span>
          </div>
          
          <div className="flex items-center">
            <button 
              className="mx-1 px-2 py-1 rounded border bg-gray-100 disabled:opacity-50"
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(1)}
            >
              &laquo;
            </button>
            <button 
              className="mx-1 px-2 py-1 rounded border bg-gray-100 disabled:opacity-50"
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              &lt;
            </button>
            
            <span className="mx-2 text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button 
              className="mx-1 px-2 py-1 rounded border bg-gray-100 disabled:opacity-50"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              &gt;
            </button>
            <button 
              className="mx-1 px-2 py-1 rounded border bg-gray-100 disabled:opacity-50"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.totalPages)}
            >
              &raquo;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PendingComplaints;