// AssignComplaintForm.js
import React, { useState } from "react";

const taskData = {
    "Computer & Comm. Centre": [
        "Automation", "Email Services", "HPC Support", "Network",
        "PC & Peripherals", "Telephone", "Turnitin", "Web Services", "Other"
    ],
    "Hostel/Resident Complaints": [
        "Plumbing", "Room Servicing", "Electricity Issues", "Furniture Repair",
        "Cleaning Services", "Other"
    ],
    "Infrastructure Complaints": [
        "Gym", "Badminton Hall", "Table Tennis Court", "Ground",
        "Swimming Pool", "Food Court", "Other"
    ]
};

const availablePeople = {
    "Automation": ["Alice", "Bob"],
    "Email Services": ["Charlie", "Dave"],
    "Plumbing": ["Eve", "Frank"],
    "Electricity Issues": ["Grace", "Hank"],
    "Gym": ["Ivy", "Jack"],
    "Other": ["Admin1", "Admin2"]
};

const peopleWithPhoneNumbers = {
    "Alice": "987-654-3210",
    "Bob": "912-345-6789",
    "Charlie": "923-456-7890",
    "Dave": "934-567-8901",
    "Eve": "945-678-9012",
    "Frank": "956-789-0123",
    "Grace": "967-890-1234",
    "Hank": "978-901-2345",
    "Ivy": "989-012-3456",
    "Jack": "900-123-4567",
    "Admin1": "911-234-5678",
    "Admin2": "922-345-6789"
};


const AssignForm = ({ onClose, onAssign ,complaint}) => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubTask, setSelectedSubTask] = useState("");
    const [selectedPerson, setSelectedPerson] = useState("");

    const handleAssign = () => {
        
        if (!selectedPerson) {
            alert("Please Seclect a person/No Person Available!!");
        } else {
            onAssign(selectedCategory, selectedSubTask, selectedPerson);
            alert("Assigned to : "+selectedPerson + "\n"+ "Phone Number : "+ peopleWithPhoneNumbers[selectedPerson])
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Assign Complaint</h2>
                <label className="block mt-4 mb-2">Assign To:</label>
                        <select className="w-full p-2 border rounded" onChange={(e) => setSelectedPerson(e.target.value)}>
                            <option value="">Select Person</option>
                            {availablePeople[complaint.subcategory].map((person) => (
                                <option key={person} value={person}>{person}</option>
                            ))}
                        </select>
                <div className="flex justify-end mt-4">
                    <button className="bg-gray-400 text-white px-4 py-2 rounded mr-2" onClick={onClose}>Cancel</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleAssign}>Assign</button>
                </div>
            </div>
        </div>
    );
};

export default AssignForm;