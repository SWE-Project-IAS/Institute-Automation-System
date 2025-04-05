import React, { useState } from "react";
import AssignForm from "./AssignForm";

const ComplaintDetails = ({ complaint, onBack, role }) => {
    const [showAssignModal, setShowAssignModal] = useState(false);

    const handleDelete = () => {
        console.log("Complaint deleted");
    };

    const handleMarkAsDone = () => {
        console.log("Complaint marked as done");
    };

    const handleAssign = (category, subTask, person) => {
        console.log(`Complaint assigned to ${person} under ${category} -> ${subTask}`);
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