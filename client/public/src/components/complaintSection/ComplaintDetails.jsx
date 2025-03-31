import React from "react";

const ComplaintDetails = ({ complaint, onBack, role }) => {
    // Placeholder image URL (random image for demonstration)
    const placeholderImage = "https://picsum.photos/400/300";

    const handleDelete = () => {
        // Logic to delete the complaint
        console.log("Complaint deleted");
    };

    const handleMarkAsDone = () => {
        // Logic to mark the complaint as done
        console.log("Complaint marked as done");
    };
    const handleAssign = () => {
        // Logic to assign the complaint
        console.log("Complaint assigned");
    };
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg relative">
            <div className="flex justify-between items-center mb-4">
                {/* Back Button */}
                <button
                    className="top-4 left-4 bg-gray-600 text-white px-2 py-1 rounded-md hover:bg-gray-700"
                    onClick={onBack}
                >
                    Back
                </button>

                {/* Delete Button */}
                {role === "Student" && (
                    <button
                        className="top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-gray-700"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                )}
                {role === "NonAcadAdmin" && complaint.status === "Pending" && (
                    <div>
                        <button
                            className="top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-md selection:bg-gray-700"
                            onClick={handleAssign}
                        >
                            Assign
                        </button>
                    </div>
                )}
                 {role === "NonAcadAdmin" && complaint.status === "In Progress" && (
                    <div>
                        <button
                            className="top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-md selection:bg-gray-700"
                            onClick={handleMarkAsDone}
                        >
                            Mark as Done
                        </button>
                    </div>
                )}
            </div>

            {/* Complaint Details */}
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{complaint.title}</h2>
                <p className="text-sm text-gray-600 mb-1">Date: {complaint.date}</p>
                <p className="text-sm text-gray-600 mb-1">Status: {complaint.status}</p>
                <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Phone Number:</span> {complaint.phoneNumber}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Address:</span> Room {complaint.address.roomNumber}, Wing {complaint.address.wing}, {complaint.address.hostel} Hostel
                </p>
                <p className="text-sm text-gray-600 mb-4">
                    <span className="font-semibold">Description:</span> {complaint.description || "No additional details provided."}
                </p>

                {/* Image Field */}
                <div className="mb-4">
                    <h3 className="text-sm font-semibold mb-2">Attached Image:</h3>
                    {complaint.image ? (
                        <img
                            src={complaint.image}
                            alt="Complaint attachment"
                            className="w-full h-48 object-cover rounded-md"
                        />
                    ) : (
                        <img
                            src={placeholderImage}
                            alt="Placeholder"
                            className="w-full h-48 object-cover rounded-md"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetails;