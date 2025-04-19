import React from "react";
import ComplaintDetails from "../ComplaintDetails";

/**
 * ComplaintList component to display a filterable and searchable list of complaints
 * @param {Object} props Component props
 * @param {Array} props.complaints - Array of complaints to display
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.searchQuery - Current search query
 * @param {function} props.setSearchQuery - Function to update search query
 * @param {Object|null} props.selectedComplaint - Currently selected complaint for details view
 * @param {function} props.setSelectedComplaint - Function to set selected complaint
 * @param {function} props.refetch - Function to refetch complaints data
 * @param {string} props.role - User role
 * @returns {JSX.Element} The rendered component
 */
const ComplaintList = ({ complaints, isLoading, searchQuery, setSearchQuery, selectedComplaint, setSelectedComplaint, refetch, role }) => {
    /**
     * Sets the selected complaint for viewing details.
     * @param {object} complaint - The complaint to view.
     */
    const handleViewDetails = (complaint) => {
        setSelectedComplaint(complaint);
    };

    /**
     * Handles the back action from the complaint details view.
     * @param {boolean} wasDeleted - Indicates if the complaint was deleted.
     */
    const handleBackFromDetails = (wasDeleted) => {
        setSelectedComplaint(null);
        if (wasDeleted) {
            refetch();
        }
    };

    // If a complaint is selected, show its details
    if (selectedComplaint) {
        return (
            <ComplaintDetails
                complaint={selectedComplaint}
                onBack={handleBackFromDetails}
                role={role}
            />
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search complaints by title, category..."
                        className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={() => setSearchQuery("")}
                            title="Clear search"
                        >
                            <svg
                                className="w-4 h-4 text-gray-500 hover:text-gray-700"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {searchQuery && (
                <p className="text-sm text-gray-600 mb-2">
                    Found {complaints.length} {complaints.length === 1 ? "result" : "results"} for "{searchQuery}"
                </p>
            )}

            {/* Complaint List with improved card design */}
            {!isLoading && complaints.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {complaints.map((complaint) => {
                        // Determine status color based on status
                        let statusColor = "gray";
                        if (complaint.status === "Pending") statusColor = "red";
                        else if (complaint.status === "In Progress") statusColor = "yellow";
                        else if (complaint.status === "Resolved") statusColor = "green";

                        return (
                            <div
                                key={complaint._id}
                                className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-gray-800">{complaint.title}</h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${statusColor}-100 text-${statusColor}-800 border border-${statusColor}-300`}>{complaint.status}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Date:</span> {new Date(complaint.date).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Category:</span> {complaint.category} - {complaint.subCategory}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-4">Description: {complaint.description.length > 100 ? `${complaint.description.slice(0, 100)}...` : complaint.description}</p>
                                    <div className="flex justify-end">
                                        <button
                                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                                            onClick={() => handleViewDetails(complaint)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                !isLoading && (
                    <div className="text-center py-8">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 mx-auto text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p className="text-gray-600 font-medium">No complaints found.</p>
                        <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria.</p>
                    </div>
                )
            )}
        </div>
    );
};

export default ComplaintList;
