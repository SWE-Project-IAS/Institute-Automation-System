import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import AssignForm from "./AssignForm";

const token = localStorage.getItem("token");

/**
 * Confirmation dialog component for delete operations
 * @param {Object} props Component props
 * @param {Object} props.complaint - The complaint data to be deleted
 * @param {function} props.onConfirm - Function to call when delete is confirmed
 * @param {function} props.onCancel - Function to cancel the delete operation
 * @returns {JSX.Element} The rendered component
 */
const DeleteConfirmationDialog = ({ complaint, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="bg-red-50 p-4 border-b border-red-100">
                    <h3 className="text-lg font-semibold text-red-700">Confirm Deletion</h3>
                </div>

                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <svg
                            className="h-8 w-8 text-red-600 mr-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <p className="text-gray-700">
                            Are you sure you want to delete the complaint <span className="font-bold">{complaint.title}</span>?
                        </p>
                    </div>

                    <p className="text-sm text-gray-500 mb-6">This action cannot be undone. All information associated with this complaint will be permanently removed.</p>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition-colors font-medium"
                        >
                            Delete Complaint
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ComplaintDetails = ({ complaint, onBack, role }) => {
    const [showAssignModal, setShowAssignModal] = useState(false);
    const queryClient = useQueryClient();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    // Add state for delete confirmation dialog
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    // DELETE
    const deleteMutation = useMutation({
        mutationFn: async () => {

            const res = await fetch("process.env.REACT_APP_API_URL/complaints/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ _id: complaint._id }),
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to delete complaint");
        },
        onSuccess: () => {
            toast.success("Complaint deleted");
            onBack(true);
            queryClient.invalidateQueries(["complaints"]);
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    // MARK AS DONE
    const markAsDoneMutation = useMutation({
        mutationFn: async () => {

            const res = await fetch("process.env.REACT_APP_API_URL/complaints/admin/updateStatus", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ complaintId: complaint._id, updatedStatus: "Resolved" }),
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to mark as done");
        },
        onSuccess: () => {
            toast.success("Marked as resolved");
            onBack(true);
            queryClient.invalidateQueries(["complaints"]);
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    // ASSIGN
    const assignMutation = useMutation({
        mutationFn: async (assignData) => {
            // Create the request body
            const body = {
                complaintId: complaint._id,
                supportStaffId: assignData.supportStaffId || null,
                assignedName: assignData.name,
                assignedContact: assignData.phoneNo,
            };

            
            const res = await fetch("process.env.REACT_APP_API_URL/complaints/admin/assign", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(body),
                credentials: "include",
            });

            if (!res.ok) {
                const errorData = await res.text();
                throw new Error(`Failed to assign complaint: ${errorData}`);
            }

            return await res.json();
        },
        onSuccess: () => {
            toast.success("Complaint assigned successfully");
            onBack(true);
            queryClient.invalidateQueries(["complaints"]);
        },
        onError: (err) => {
            console.error("Assignment error:", err);
            toast.error(err.message);
        },
    });

    // Event Handlers
    const handleDelete = (e) => {
        if (e) e.preventDefault();
        deleteMutation.mutate();
    };

    // New handler to show delete confirmation
    const handleDeleteClick = (e) => {
        e.preventDefault();
        setShowDeleteConfirmation(true);
    };

    // Handler to cancel delete
    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    const handleMarkAsDone = (e) => {
        e.preventDefault();
        markAsDoneMutation.mutate();
    };

    const handleAssign = (assignData) => {
        assignMutation.mutate(assignData);
        setShowAssignModal(false);
    };

    // Determine status color and icon
    let statusColor, statusBgColor, statusIcon;
    switch (complaint.status) {
        case "Pending":
            statusColor = "text-red-600";
            statusBgColor = "bg-red-50";
            statusIcon = (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                    />
                </svg>
            );
            break;
        case "In Progress":
            statusColor = "text-yellow-600";
            statusBgColor = "bg-yellow-50";
            statusIcon = (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 10.24a1 1 0 11-2 0 1 1 0 012 0z"
                        clipRule="evenodd"
                    />
                </svg>
            );
            break;
        case "Resolved":
            statusColor = "text-green-600";
            statusBgColor = "bg-green-50";
            statusIcon = (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                    />
                </svg>
            );
            break;
        default:
            statusColor = "text-gray-600";
            statusBgColor = "bg-gray-50";
            statusIcon = (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                    />
                </svg>
            );
    }

    // Get formatted date
    const formattedDate = new Date(complaint.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header with back button and actions */}
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                <button
                    className="flex items-center gap-2 text-gray-700 px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                    onClick={() => onBack(false)}
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
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Back
                </button>
                <div className="flex gap-2">
                    {(role === "student" || role === "faculty") && complaint.status !== "Resolved" && (
                        <button
                            className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors"
                            onClick={handleDeleteClick}
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            Delete
                        </button>
                    )}
                    {role === "nonAcadAdmin" && complaint.status === "Pending" && (
                        <button
                            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                            onClick={() => setShowAssignModal(true)}
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
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            Assign
                        </button>
                    )}
                    {role === "nonAcadAdmin" && complaint.status === "In Progress" && (
                        <button
                            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors"
                            onClick={handleMarkAsDone}
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
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Mark as Resolved
                        </button>
                    )}
                </div>
            </div>

            <div className="p-6">
                {/* Title and Status */}
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{complaint.title}</h2>
                    <div className={`flex items-center ${statusBgColor} ${statusColor} px-3 py-1.5 rounded-full`}>
                        {statusIcon}
                        <span className="ml-1.5 font-medium">{complaint.status}</span>
                    </div>
                </div>

                {/* Complaint Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">COMPLAINT DETAILS</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500">Date Submitted</p>
                                    <p className="font-medium">{formattedDate}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Category</p>
                                    <p className="font-medium">{complaint.category}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Sub-Category</p>
                                    <p className="font-medium">{complaint.subCategory}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">CONTACT INFORMATION</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500">Phone Number</p>
                                    <p className="font-medium">{complaint.phoneNumber || "Not provided"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Address</p>
                                    <p className="font-medium">Room {complaint.address} Hostel</p>
                                </div>
                                {complaint.timeAvailability && (
                                    <div>
                                        <p className="text-xs text-gray-500">Time Availability</p>
                                        <p className="font-medium">{complaint.timeAvailability}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {complaint.assignedName && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h3 className="text-sm font-medium text-blue-700 mb-2">ASSIGNED SUPPORT STAFF</h3>
                                <div className="flex items-center mb-3">
                                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-blue-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-blue-900">{complaint.assignedName}</p>
                                        <p className="text-sm text-blue-700">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 inline mr-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                            {complaint.assignedContact}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-blue-600 italic">Contact the assigned staff for updates on your complaint.</p>
                            </div>
                        )}

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">DESCRIPTION</h3>
                            <p className="text-gray-700 whitespace-pre-line">{complaint.description || "No description provided."}</p>
                        </div>
                    </div>
                </div>

                {/* Images */}
                {complaint.imageUrls && complaint.imageUrls.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Uploaded Images</h3>

                        {/* Main image display */}
                        <div className="mb-3 bg-gray-100 rounded-lg overflow-hidden flex justify-center">
                            <img

                                src={`process.env.BASE_URL/uploads/complaints/${complaint.imageUrls[activeImageIndex]}`}
                                alt={`Complaint Image ${activeImageIndex + 1}`}
                                className="max-h-80 object-contain"
                            />
                        </div>

                        {/* Image thumbnails */}
                        {complaint.imageUrls.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {complaint.imageUrls.map((url, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`cursor-pointer rounded-md overflow-hidden border-2 ${index === activeImageIndex ? "border-blue-500" : "border-transparent"}`}
                                    >
                                        <img

                                            src={`process.env.BASE_URL/uploads/complaints/${url}`}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="h-16 w-16 object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showAssignModal && (
                <AssignForm
                    onClose={() => setShowAssignModal(false)}
                    onAssign={handleAssign}
                    complaint={complaint}
                />
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirmation && (
                <DeleteConfirmationDialog
                    complaint={complaint}
                    onConfirm={handleDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
};

export default ComplaintDetails;
