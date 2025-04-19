import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RoleContext } from "../../context/Rolecontext.jsx";

// Import tab components
import PendingComplaints from "./tabs/PendingComplaints.jsx";
import InProgressComplaints from "./tabs/InProgressComplaints.jsx";
import ResolvedComplaints from "./tabs/ResolvedComplaints.jsx";
import MyComplaints from "./tabs/MyComplaints.jsx";
import NewComplaintSelection from "./tabs/NewComplaintSelection.jsx";
import SupportStaffManagement from "./supportStaff/SupportStaffManagement.jsx";

/**
 * ComplaintSection component renders the complaint management interface.
 * It displays different views based on the user's role and selected page.
 * returns {JSX.Element} The rendered component.
 */
const ComplaintSection = () => {
    // type {string} - The user's role (e.g., 'student', 'faculty', 'acadAdmin').
    const { role } = useContext(RoleContext);

    //Determines if the user is a student or faculty.
    //type {boolean}
    const isStudentOrFaculty = role === "student" || role === "faculty";

    // Default active page based on the user's role.
    // type {string}
    const defaultActivePage = isStudentOrFaculty ? "My Complaints" : "Pending";

    // type {string} - Current active page in the complaint section.
    const [activePage, setActivePage] = useState(defaultActivePage);

    // For student/faculty view
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    /**
     * API endpoint for fetching complaints based on user role.
     * type {string}
     */

    const endpoint = role === "student" || role === "faculty" ? "https://ias-server-cpoh.onrender.com/api/complaints/" : "https://ias-server-cpoh.onrender.com/api/complaints/admin";

    /**
     * Fetches complaint data using React Query.
     * type {object} - Contains complaint data, loading state, error state, and refetch function.
     */
    const {
        data: responseData,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["complaints", role, isStudentOrFaculty ? page : null, isStudentOrFaculty ? limit : null],
        queryFn: async () => {
            if (isStudentOrFaculty) {
                // For students/faculty, fetch paginated data for "My Complaints"
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    body: JSON.stringify({ page, limit }),
                    credentials: "include",
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || "Failed to fetch complaints");
                }
                return result;
            } else {
                // For admin, just fetch a small list to get counts for the tabs
                // We won't display this data in the tabs as they'll fetch their own data
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    body: JSON.stringify({ page: 1, limit: 1000 }), // Fetch a large number for counting
                    credentials: "include",
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || "Failed to fetch complaints");
                }
                return result;
            }
        },
    });

    // Derived state from responseData
    const complaintData = responseData?.data || [];
    const pagination = responseData?.pagination;

    // Handle page change for student/faculty view
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Handle page size change for student/faculty view
    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1); // Reset to first page when changing limit
    };

    // If the role is Academic Admin, don't show the complaint section
    if (role === "acadAdmin") {
        return null;
    }

    return (
        <div className="flex flex-col border-1 w-[98%] m-2">
            {/* Improved Navbar with better styling */}
            <div className="bg-white p-2 rounded-lg shadow-md w-[98%] h-auto mb-4 m-auto">
                <nav className="w-full p-4 h-auto">
                    <ul className="flex justify-start space-x-4">
                        <li
                            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer ${activePage === (isStudentOrFaculty ? "My Complaints" : "Pending") ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            onClick={() => setActivePage(isStudentOrFaculty ? "My Complaints" : "Pending")}
                        >
                            {isStudentOrFaculty ? "My Complaints" : "Pending"}
                            {!isStudentOrFaculty && complaintData.filter((c) => c.status === "Pending").length > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{complaintData.filter((c) => c.status === "Pending").length}</span>}
                        </li>
                        <li
                            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer ${activePage === (isStudentOrFaculty ? "New Complaint" : "In Progress") ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            onClick={() => setActivePage(isStudentOrFaculty ? "New Complaint" : "In Progress")}
                        >
                            {isStudentOrFaculty ? "New Complaint" : "In Progress"}
                            {!isStudentOrFaculty && complaintData.filter((c) => c.status === "In Progress").length > 0 && <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">{complaintData.filter((c) => c.status === "In Progress").length}</span>}
                        </li>

                        {isStudentOrFaculty ? (
                            ""
                        ) : (
                            <>
                                <li
                                    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer ${activePage === "Resolved" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                    onClick={() => setActivePage("Resolved")}
                                >
                                    {"Resolved"}
                                    {complaintData.filter((c) => c.status === "Resolved").length > 0 && <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">{complaintData.filter((c) => c.status === "Resolved").length}</span>}
                                </li>
                                <li
                                    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer ${activePage === "Support Staff" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                    onClick={() => setActivePage("Support Staff")}
                                >
                                    {"Support Staff"}
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>

            {/* Main Content with improved styling */}
            <div className="bg-white p-6 rounded-lg shadow-md w-[98%] min-h-screen mb-4 m-auto">
                {/* Loading and Error States with better feedback */}
                {isLoading && isStudentOrFaculty && (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}
                {isError && isStudentOrFaculty && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">Error fetching complaints. Please try again later.</span>
                    </div>
                )}

                {/* Render the appropriate component based on the active page */}
                {((!isLoading && !isError) || !isStudentOrFaculty) && (
                    <>
                        {/* Student/Faculty Views */}
                        {isStudentOrFaculty && activePage === "My Complaints" && (
                            <>
                                <MyComplaints
                                    complaintData={complaintData}
                                    isLoading={isLoading}
                                    refetch={refetch}
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
                                                Showing {(pagination.currentPage - 1) * pagination.pageSize + 1} - {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems}
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
                        )}

                        {isStudentOrFaculty && activePage === "New Complaint" && <NewComplaintSelection refetch={refetch} />}

                        {/* Admin Views - Each tab now handles its own data fetching and pagination */}
                        {!isStudentOrFaculty && activePage === "Pending" && (
                            <PendingComplaints
                                isLoading={isLoading}
                                refetch={refetch}
                                role={role}
                            />
                        )}

                        {!isStudentOrFaculty && activePage === "In Progress" && (
                            <InProgressComplaints
                                isLoading={isLoading}
                                refetch={refetch}
                                role={role}
                            />
                        )}

                        {!isStudentOrFaculty && activePage === "Resolved" && (
                            <ResolvedComplaints
                                isLoading={isLoading}
                                refetch={refetch}
                                role={role}
                            />
                        )}

                        {!isStudentOrFaculty && activePage === "Support Staff" && <SupportStaffManagement />}
                    </>
                )}
            </div>
        </div>
    );
};

export default ComplaintSection;
