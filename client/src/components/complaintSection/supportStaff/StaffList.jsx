import React from "react";

/**
 * Component for displaying the list of support staff members
 * @param {Object} props Component props
 * @param {Array} props.displayedStaff - The staff data to display
 * @param {Function} props.handleStaffRowClick - Function to handle row click
 * @param {Function} props.setStaffToDelete - Function to set staff for deletion
 * @param {Function} props.requestSort - Function to handle sorting
 * @param {Function} props.getSortDirectionIndicator - Function to get sort direction indicator
 * @param {String} props.searchQuery - Current search query
 * @param {Function} props.setSearchQuery - Function to update search query
 * @param {Boolean} props.isLoading - Whether data is loading
 * @param {Boolean} props.isError - Whether there was an error loading data
 * @returns {JSX.Element} The rendered component
 */
const StaffList = ({ displayedStaff, handleStaffRowClick, setStaffToDelete, requestSort, getSortDirectionIndicator, searchQuery, setSearchQuery, isLoading, isError }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Support Staff List</h3>

            {isLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading support staff data...</p>
                </div>
            ) : isError ? (
                <p className="text-red-600">Error loading support staff data. Please try again.</p>
            ) : (
                <>
                    {/* Search bar */}
                    <div className="mb-4 flex">
                        <div className="relative flex-grow">
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
                                className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search by name, phone, or category..."
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

                    {displayedStaff.length > 0 ? (
                        <>
                            {searchQuery && (
                                <p className="text-sm text-gray-600 mb-2">
                                    Found {displayedStaff.length} {displayedStaff.length === 1 ? "result" : "results"} for "{searchQuery}"
                                </p>
                            )}
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th
                                                className="py-2 px-4 text-left cursor-pointer hover:bg-gray-200"
                                                onClick={() => requestSort("name")}
                                            >
                                                Name {getSortDirectionIndicator("name")}
                                            </th>
                                            <th
                                                className="py-2 px-4 text-left cursor-pointer hover:bg-gray-200"
                                                onClick={() => requestSort("phone")}
                                            >
                                                Phone {getSortDirectionIndicator("phone")}
                                            </th>
                                            <th className="py-2 px-4 text-left">Categories</th>
                                            <th className="py-2 px-4 text-left">Subcategories</th>
                                            <th
                                                className="py-2 px-4 text-left cursor-pointer hover:bg-gray-200"
                                                onClick={() => requestSort("assignedComplaints")}
                                            >
                                                Assigned Complaints {getSortDirectionIndicator("assignedComplaints")}
                                            </th>
                                            <th
                                                className="py-2 px-4 text-left cursor-pointer hover:bg-gray-200"
                                                onClick={() => requestSort("resolvedComplaints")}
                                            >
                                                Resolved Complaints {getSortDirectionIndicator("resolvedComplaints")}
                                            </th>
                                            <th className="py-2 px-4 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedStaff.map((staff) => {
                                            const assignedCount = staff.assignedComplaints ? staff.assignedComplaints.length : 0;
                                            const resolvedCount = staff.resolvedComplaints ? staff.resolvedComplaints.length : 0;
                                            const hasComplaints = assignedCount > 0 || resolvedCount > 0;

                                            return (
                                                <tr
                                                    key={staff._id}
                                                    className={`border-t ${hasComplaints ? "cursor-pointer hover:bg-gray-50" : ""}`}
                                                    onClick={() => handleStaffRowClick(staff)}
                                                >
                                                    <td className="py-3 px-4">{staff.name}</td>
                                                    <td className="py-3 px-4">{staff.phone}</td>
                                                    <td className="py-3 px-4">{staff.categories && staff.categories.length > 0 ? staff.categories.join(", ") : "All categories"}</td>
                                                    <td className="py-3 px-4">{staff.subCategories && staff.subCategories.length > 0 ? staff.subCategories.join(", ") : "All subcategories"}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`font-medium ${assignedCount >= 5 ? "text-red-600" : assignedCount > 0 ? "text-blue-600" : ""}`}>{assignedCount}</span>
                                                        {assignedCount > 0 && <span className="text-xs text-gray-500 ml-1">active {assignedCount === 1 ? "complaint" : "complaints"}</span>}
                                                        {assignedCount >= 5 && <span className="ml-2 text-xs bg-red-100 text-red-600 py-1 px-2 rounded">At capacity</span>}
                                                        {assignedCount > 0 && <span className="ml-2 text-xs text-blue-600 hover:underline">(Click to view)</span>}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`font-medium ${resolvedCount > 0 ? "text-green-600" : ""}`}>{resolvedCount}</span>
                                                        {resolvedCount > 0 && <span className="text-xs text-gray-500 ml-1">resolved {resolvedCount === 1 ? "complaint" : "complaints"}</span>}
                                                        {resolvedCount > 0 && <span className="ml-2 text-xs text-green-600 hover:underline">(Click to view)</span>}
                                                    </td>
                                                    <td
                                                        className="py-3 px-4"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setStaffToDelete(staff);
                                                            }}
                                                            className={`bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm ${assignedCount > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                                            disabled={assignedCount > 0}
                                                            title={assignedCount > 0 ? "Cannot delete staff with assigned complaints" : "Delete staff"}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-600">{searchQuery ? `No support staff found matching "${searchQuery}". Try a different search term.` : "No support staff found. Add some staff members using the form above."}</p>
                    )}
                </>
            )}
        </div>
    );
};

export default StaffList;
