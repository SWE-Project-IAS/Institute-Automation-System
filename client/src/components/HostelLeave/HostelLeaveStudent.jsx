import React, { useState } from 'react';
import newRequest from '../../utils/newRequest';
import { useQuery } from '@tanstack/react-query';

function HostelLeaveStudent() {
    const {data:userData} = JSON.parse(localStorage.getItem("currentUser"));
    const {email, userId} = userData.user;
    const [requests, setRequests] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        studentId: '',
        startDate: '',
        endDate: '',
        reason: '',
    });

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
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newReq = {
            applicationId: Date.now(),
            status: 'Pending',
            email: email,
            ...formData,
        };
        setRequests([...requests, newReq]);
        console.log(newReq);
        await newRequest.post('/hostel/leave', newReq);
        handleDiscard();
    };

    const { isLoading, error, data } = useQuery({
        queryKey: ["leaves"],
        queryFn: () =>
            newRequest.get(`/hostel/${userId}/leaves`).then((res) => {
                return res.data;
            }),
    });
    // console.log(data);

    return (
        <div className="w-full min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center p-4 m-2">
            <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 flex items-center flex-col">
                <h2 className="text-2xl font-semibold text-center mb-4">Requests</h2>
                <hr className="border-gray-300 mb-4 w-full" />
                
                {isLoading ? <p>Loading...</p> : error ? <p>Error</p>: 
                    <>
                    {data.length === 0 ? (
                        <p className="text-center text-lg font-medium text-gray-600">No pending requests</p>
                    ) : (
                        <div className="space-y-3">
                            {data.map((req) => (
                                <div key={req._id} className="p-4 bg-gray-200 rounded-lg shadow">
                                    <p><strong>ID:</strong> {req._id}</p>
                                    <p><strong>Status:</strong> {req.status}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    </>
                
                }
                
                {!showForm && (
                    <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition" onClick={handleOpenForm}>
                        Apply for Leave
                    </button>
                )}

                {showForm && (
                    <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md w-[80%]">
                        <h3 className="text-xl font-semibold text-center mb-4">Leave Application</h3>
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
                                <label className="block text-gray-700 font-medium">Start Date</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium">End Date</label>
                                <input 
                                    type="date" 
                                    name="endDate" 
                                    value={formData.endDate} 
                                    onChange={handleChange} 
                                    // min={formData.startDate}
                                    required 
                                    className={`w-full p-2 border rounded-lg ${formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate) ? 'border-red-500' : ''}`}
                                />
                                {formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate) && (
                                    <p className="text-red-500 text-sm mt-1">End date must be after start date</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium">Reason for Leave</label>
                                <textarea name="reason" value={formData.reason} onChange={handleChange} rows="3" required className="w-full p-2 border rounded-lg"></textarea>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button type="button" className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition" onClick={handleDiscard}>Discard</button>
                                <button 
                                    type="submit" 
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                                    disabled={formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)}
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HostelLeaveStudent;
