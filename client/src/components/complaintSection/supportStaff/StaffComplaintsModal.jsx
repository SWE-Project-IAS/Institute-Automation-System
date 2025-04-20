import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

/**
 * Modal component to display a staff member's assigned and resolved complaints
 * @param {Object} props Component props
 * @param {Object} props.staff - The staff member to display complaints for
 * @param {function} props.onClose - Function to close the modal
 * @returns {JSX.Element} The rendered component
 */
const StaffComplaintsModal = ({ staff, onClose }) => {
    const [activeTab, setActiveTab] = useState("assigned");

    // Fetch complaint details for the given IDs
    const fetchComplaintDetails = async (complaintIds) => {
        if (!complaintIds || complaintIds.length === 0) {
            return [];
        }

        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/complaints/admin/details`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ complaintIds }),
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to load complaint details");
        }

        const data = await response.json();
        return data.complaints || [];
    };

    // Fetch assigned complaints
    const {
        data: assignedComplaints = [],
        isLoading: isLoadingAssigned,
        isError: isErrorAssigned,
        error: assignedError,
        refetch: refetchAssigned,
    } = useQuery({
        queryKey: ["assignedComplaints", staff._id],
        queryFn: () => fetchComplaintDetails(staff.assignedComplaints),
        enabled: !!staff.assignedComplaints && staff.assignedComplaints.length > 0,
        retry: 1,
        onError: (error) => {
            toast.error(`Error loading assigned complaints: ${error.message}`);
        },
    });

    // Fetch resolved complaints
    const {
        data: resolvedComplaints = [],
        isLoading: isLoadingResolved,
        isError: isErrorResolved,
        error: resolvedError,
        refetch: refetchResolved,
    } = useQuery({
        queryKey: ["resolvedComplaints", staff._id],
        queryFn: () => fetchComplaintDetails(staff.resolvedComplaints),
        enabled: !!staff.resolvedComplaints && staff.resolvedComplaints.length > 0,
        retry: 1,
        onError: (error) => {
            toast.error(`Error loading resolved complaints: ${error.message}`);
        },
    });

    // Format the date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        switch (status) {
            case "Pending":
                return "bg-red-100 text-red-800 border-red-200";
            case "In Progress":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Resolved":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    useEffect(() => {
        // Refetch data when tab changes
        if (activeTab === "assigned") {
            refetchAssigned();
        } else if (activeTab === "resolved") {
            refetchResolved();
        }
    }, [activeTab, refetchAssigned, refetchResolved]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gray-100 p-4 rounded-t-lg border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Complaints Assigned to {staff.name}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav
                        className="flex"
                        aria-label="Tabs"
                    >
                        <button
                            onClick={() => setActiveTab("assigned")}
                            className={`px-4 py-3 text-sm font-medium ${activeTab === "assigned" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"}`}
                        >
                            Assigned Complaints ({staff.assignedComplaints?.length || 0})
                        </button>
                        <button
                            onClick={() => setActiveTab("resolved")}
                            className={`px-4 py-3 text-sm font-medium ${activeTab === "resolved" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"}`}
                        >
                            Resolved Complaints ({staff.resolvedComplaints?.length || 0})
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-4 flex-grow">
                    {activeTab === "assigned" && (
                        <>
                            {isLoadingAssigned ? (
                                <div className="flex justify-center items-center h-40">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : isErrorAssigned ? (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                                    <p className="font-medium">Failed to load complaint details. Please try again.</p>
                                    <p className="text-sm">{assignedError?.message}</p>
                                    <button
                                        onClick={() => refetchAssigned()}
                                        className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : assignedComplaints.length === 0 ? (
                                <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">No active complaints assigned to this staff member.</div>
                            ) : (
                                <div className="space-y-4">
                                    {assignedComplaints.map((complaint) => (
                                        <div
                                            key={complaint._id}
                                            className="border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-semibold text-gray-800">{complaint.title}</h3>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(complaint.status)}`}>{complaint.status}</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2 text-sm">
                                                    <p>
                                                        <span className="font-medium">Date:</span> {formatDate(complaint.date)}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Category:</span> {complaint.category} - {complaint.subCategory}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-700 mb-2 line-clamp-2">{complaint.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === "resolved" && (
                        <>
                            {isLoadingResolved ? (
                                <div className="flex justify-center items-center h-40">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : isErrorResolved ? (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                                    <p className="font-medium">Failed to load complaint details. Please try again.</p>
                                    <p className="text-sm">{resolvedError?.message}</p>
                                    <button
                                        onClick={() => refetchResolved()}
                                        className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : resolvedComplaints.length === 0 ? (
                                <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">No resolved complaints for this staff member.</div>
                            ) : (
                                <div className="space-y-4">
                                    {resolvedComplaints.map((complaint) => (
                                        <div
                                            key={complaint._id}
                                            className="border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-semibold text-gray-800">{complaint.title}</h3>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(complaint.status)}`}>{complaint.status}</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2 text-sm">
                                                    <p>
                                                        <span className="font-medium">Date:</span> {formatDate(complaint.date)}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Category:</span> {complaint.category} - {complaint.subCategory}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-700 mb-2 line-clamp-2">{complaint.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StaffComplaintsModal;
