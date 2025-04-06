import React, { useState } from 'react';

function HostelLeaveStudent() {
    const [requests, setRequests] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [expandedId, setExpandedId] = useState(null);


    const [formData, setFormData] = useState({
        name: '',
        studentId: '',
        startDate: '',
        endDate: '',
        reason: '',
        hostelName: '',
    });

    const [error, setError] = useState('');

    const handleOpenForm = () => {
        setShowForm(true);
    };

    const handleDiscard = () => {
        setShowForm(false);
        setFormData({
            name: '',
            studentId: '',
            startDate: '',
            endDate: '',
            reason: '',
            hostelName: '',
        });
        setError('');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { name, studentId, startDate, endDate, reason, hostelName } = formData;

        // List of valid hostel names
        const validHostels = [
            "Lohit", "Brahmaputra", "Disang", "Dihing", "Kapili", 
            "Manas", "Gaurang", "Umiam", "Barak", "Subansiri", 
            "Dhansiri", "Kameng", "Siang"
        ];

        // Check all fields are filled
        if (!name || !studentId || !startDate || !endDate || !reason || !hostelName) {
            return "All fields are required.";
        }

        // Name: only letters and spaces, max 100 characters
        if (!/^[A-Za-z\s]{1,100}$/.test(name)) {
            return "Name should only contain letters and spaces, and be up to 100 characters.";
        }

        // Student ID: exactly 8 digits
        if (!/^\d{8}$/.test(studentId)) {
            return "Student ID must be exactly 8 digits.";
        }

        // Start date should be <= end date
        if (new Date(startDate) > new Date(endDate)) {
            return "Start date cannot be after end date.";
        }

        // Hostel name must be one of the valid options
        if (!validHostels.includes(hostelName)) {
            return `Hostel name must be one of the following: ${validHostels.join(", ")}.`;
        }

        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }
    
        const newRequest = {
            id: crypto.randomUUID(), // This ensures unique form ID
            status: 'Pending',
            ...formData,
        };
    
        setRequests([...requests, newRequest]);
        handleDiscard();
    };
    

    return (
        <div className="w-full min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center p-4 m-2">
            <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 flex items-center flex-col">
                <h2 className="text-2xl font-semibold text-center mb-4">Requests</h2>
                <hr className="border-gray-300 mb-4 w-full" />

                {requests.length === 0 ? (
                    <p className="text-center text-lg font-medium text-gray-600">No pending requests</p>
                ) : (
                    <div className="space-y-3 w-full">
                        {requests.map((req) => (
                            <div key={req.id} className="p-4 bg-gray-200 rounded-lg shadow">
                                <p><strong>Form ID:</strong> {req.id}</p>
                                <p><strong>Status:</strong> {req.status}</p>

                                <button
                                    onClick={() =>
                                        setExpandedId(expandedId === req.id ? null : req.id)
                                    }
                                    className="mt-2 text-blue-600 hover:underline"
                                >
                                    {expandedId === req.id ? 'Hide Details' : 'View Details'}
                                </button>

                                {expandedId === req.id && (
                                    <div className="mt-2 text-sm text-gray-800 space-y-1">
                                        <p><strong>Name:</strong> {req.name}</p>
                                        <p><strong>Student ID:</strong> {req.studentId}</p>
                                        <p><strong>Hostel:</strong> {req.hostelName}</p>
                                        <p><strong>From:</strong> {req.startDate}</p>
                                        <p><strong>To:</strong> {req.endDate}</p>
                                        <p><strong>Reason:</strong> {req.reason}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {!showForm && (
                    <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition" onClick={handleOpenForm}>
                        Apply for Leave
                    </button>
                )}

                {showForm && (
                    <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md w-[80%]">
                        <h3 className="text-xl font-semibold text-center mb-4">Leave Application</h3>
                        {error && <p className="text-red-500 font-medium text-center mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium">Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium">Student ID</label>
                                <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium">Hostel Name</label>
                                <input type="text" name="hostelName" value={formData.hostelName} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium">Start Date</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium">End Date</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium">Reason for Leave</label>
                                <textarea name="reason" value={formData.reason} onChange={handleChange} rows="3" required className="w-full p-2 border rounded-lg"></textarea>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button type="button" className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition" onClick={handleDiscard}>Discard</button>
                                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">Submit</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HostelLeaveStudent;
