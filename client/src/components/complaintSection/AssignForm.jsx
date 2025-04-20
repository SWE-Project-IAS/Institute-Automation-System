// AssignComplaintForm.js
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const AssignForm = ({ onClose, onAssign, complaint }) => {
    const [selectedStaffId, setSelectedStaffId] = useState("");
    const [supportStaff, setSupportStaff] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSupportStaff = async () => {
            setIsLoading(true);
            setError(null);
            try {
                console.log(`Fetching support staff for category: ${complaint.category}, subCategory: ${complaint.subCategory}`);
                const token = localStorage.getItem("accessToken");

                const response = await fetch(`https://ias-server-cpoh.onrender.com/api/complaints/admin/filteredSupportStaff?category=${complaint.category}&subCategory=${complaint.subCategory}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ category: complaint.category, subCategory: complaint.subCategory }),
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch support staff");
                }

                const data = await response.json();
                setSupportStaff(data.supportStaff || []);
                setSelectedStaffId("");
            } catch (error) {
                console.error("Error fetching support staff:", error);
                setError("Failed to load support staff. Please try again.");
                toast.error("Failed to load support staff");
            } finally {
                setIsLoading(false);
            }
        };

        if (complaint?.category && complaint?.subCategory) {
            fetchSupportStaff();
        }
    }, [complaint?.category, complaint?.subCategory]);

    const handleStaffSelect = (staff) => {
        setSelectedStaffId(staff._id);
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        if (!selectedStaffId) {
            toast.error("Please select a staff member to assign!");
            return;
        }

        const selectedStaff = supportStaff.find((staff) => staff._id === selectedStaffId);

        if (!selectedStaff) {
            toast.error("Selected staff not found. Please try again.");
            return;
        }

        const assignData = {
            complaintId: complaint._id,
            name: selectedStaff.name,
            phoneNo: selectedStaff.phone,
            supportStaffId: selectedStaffId,
        };

        console.log("Assigning to:", assignData);
        onAssign(assignData);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Assign Complaint</h2>
                <div className="mb-6">
                    <span className="block font-medium text-gray-700 mb-2">Complaint Details:</span>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-gray-800">
                            <span className="font-semibold">Category:</span> {complaint.category}
                        </p>
                        <p className="text-gray-800">
                            <span className="font-semibold">Sub-category:</span> {complaint.subCategory}
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center my-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-900"></div>
                    </div>
                ) : error ? (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
                ) : (
                    <div className="mb-6">
                        <h3 className="font-medium text-gray-700 mb-4">Select Support Staff:</h3>
                        {supportStaff && supportStaff.length > 0 ? (
                            <div className="max-h-60 overflow-y-auto border rounded-lg">
                                {supportStaff.map((staff) => {
                                    const assignedCount = staff.assignedComplaints?.length || 0;
                                    return (
                                        <div
                                            key={staff._id}
                                            className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${selectedStaffId === staff._id ? "bg-blue-50" : ""}`}
                                            onClick={() => handleStaffSelect(staff)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <p className="font-medium text-gray-800">{staff.name}</p>
                                                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                                                    {assignedCount} {assignedCount === 1 ? "complaint" : "complaints"}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{staff.phone}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center p-6">
                                <p className="text-gray-500 mb-2">No available support staff found for this category.</p>
                                <p className="text-sm text-blue-600">Please go to the Support Staff tab to add new staff members.</p>
                            </div>
                        )}
                    </div>
                )}

                <form
                    onSubmit={handleAssign}
                    className="mt-6"
                >
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                            disabled={isLoading || !selectedStaffId}
                        >
                            {isLoading ? "Assigning..." : "Assign"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignForm;
