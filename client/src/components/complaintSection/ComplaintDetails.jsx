import React, { useState } from "react";
import AssignForm from "./AssignForm";

const ComplaintDetails = ({ complaint, onBack, role }) => {
    const [showAssignModal, setShowAssignModal] = useState(false);

    const handleDelete = async (e) => {
        console.log(complaint._id);
        e.preventDefault();
        // try {
        //     const response = await fetch(`http://localhost:8000/api/complaints/delete`, {
        //         method: "DELETE",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({ complaintId: complaint._id }),
        //     });

        //     if (response.ok) {
        //         console.log("Complaint deleted successfully");
        //         onBack(true); // Go back to the previous page with a refresh complaint list
        //     } else {
        //         console.error("Failed to delete complaint");
        //     }
        // }
        // catch (error) {
        //     console.error("Error deleting complaint:", error);
        // }
    };

    const handleMarkAsDone = async (e) => {
        console.log("Complaint marked as done");
        e.preventDefault();
        // try {
        //     const response = await fetch(`http://localhost:8000/api/complaints/delete`, {
        //         method: "PATCH",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({ complaintId: complaint._id , status : "Resolved"}),
        //     });

        //     if (response.ok) {
        //         console.log("Complaint updated successfully");
        //         onBack(true); // Go back to the previous page with a refresh complaint list
        //     } else {
        //         console.error("Failed to update complaint");
        //     }
        // }
        // catch (error) {
        //     console.error("Error updating complaint:", error);
        // }

    };

    const handleAssign = async(e,category, subTask, assignedPerson) => {
        console.log(`Complaint assigning to ${assignedPerson} under ${category} -> ${subTask} ....`);
        e.preventDefault();
        // try {
        //     const response = await fetch(`http://localhost:8000/api/complaints/update`, {
        //         method: "PATCH",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({ complaintId: complaint._id , status : "In Progress", assignedPerson :assignedPerson ,category: category, subTask: subTask}),
        //     });

        //     if (response.ok) {
        //         console.log("Complaint updated successfully");
        //         onBack(true); // Go back to the previous page with a refresh complaint list
        //     } else {
        //         console.error("Failed to update complaint");
        //     }
        // }
        // catch (error) {
        //     console.error("Error updating complaint:", error);
        // }
        setShowAssignModal(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg relative">
            <div className="flex justify-between items-center mb-4">
                <button className="bg-gray-600 text-white px-2 py-1 rounded-md hover:bg-gray-700" onClick={onBack}>Back</button>
                {role === "student" && (
                    <button className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-gray-700" onClick={handleDelete}>Delete</button>
                )}
                {role === "nonAcadAdmin" && complaint.status === "Pending" && (
                    <button className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-700" onClick={() => setShowAssignModal(true)}>Assign</button>
                )}
                {role === "nonAcadAdmin" && complaint.status === "In Progress" && (
                    <button className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-700" onClick={handleMarkAsDone}>Mark as Done</button>
                )}
            </div>
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
                {role==="student"&&complaint.status === "In Progress"&&(
                <p className="text-sm text-gray-600 mb-4">
                    <div> <span className="font-semibold">Assigned Pesron : </span>{complaint.assignedPerson.name}</div>
                    <div> <span className="font-semibold">Phone Number : </span>{complaint.assignedPerson.phoneNo}</div>
                    
                </p>)}
                
            </div>
            {showAssignModal && <AssignForm onClose={() => setShowAssignModal(false)} onAssign={handleAssign} complaint = {complaint} />}
        </div>
    );
};

export default ComplaintDetails;