import React, { useState, useEffect } from "react";
import ComplaintList from "../common/ComplaintList";

/**
 * MyComplaints component displays all complaints for students and faculty users
 * @param {Object} props Component props
 * @param {Array} props.complaintData - Full array of complaint data
 * @param {boolean} props.isLoading - Loading state
 * @param {function} props.refetch - Function to refetch complaint data
 * @param {string} props.role - User role (student or faculty)
 * @returns {JSX.Element} The rendered component
 */
const MyComplaints = ({ complaintData, isLoading, refetch, role }) => {
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    if (complaintData) {
      let filtered = [...complaintData]; // For student/faculty, we show all their complaints
      
      // Apply search filter if there's a search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(complaint => {
          const titleMatch = complaint.title?.toLowerCase().includes(query);
          const categoryMatch = complaint.category?.toLowerCase().includes(query);
          const subCategoryMatch = complaint.subCategory?.toLowerCase().includes(query);
          const statusMatch = complaint.status?.toLowerCase().includes(query);
          
          return titleMatch || categoryMatch || subCategoryMatch || statusMatch;
        });
      }
      
      setFilteredComplaints(filtered);
    }
  }, [complaintData, searchQuery]);

  return (
    <ComplaintList 
      complaints={filteredComplaints}
      isLoading={isLoading}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedComplaint={selectedComplaint}
      setSelectedComplaint={setSelectedComplaint}
      refetch={refetch}
      role={role}
    />
  );
};

export default MyComplaints;