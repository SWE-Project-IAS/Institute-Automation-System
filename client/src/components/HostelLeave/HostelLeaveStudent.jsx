import React, { useState, useEffect } from 'react';
import newRequest from '../../utils/newRequest';
import { useQuery } from '@tanstack/react-query';

const HostelLeaveStudent = () => {
    const { data: userData } = JSON.parse(localStorage.getItem("currentUser"));
    const { email, userId } = userData.user;

    const [activeTab, setActiveTab] = useState('pending');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
    });
    const [responseMessage, setResponseMessage] = useState('');
    const [requestPending, setRequestPending] = useState(false);

    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ["leaves"],
        queryFn: () =>
            newRequest.get(`/hostel/${userId}/leaves`).then((res) => res.data),
    });

    // Segregate requests
    const [pendingRequests, setPendingRequests] = useState([]);
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [rejectedRequests, setRejectedRequests] = useState([]);

    useEffect(() => {
        if (data) {
            setPendingRequests(data.filter(req => req.status === 'Pending'));
            setApprovedRequests(data.filter(req => req.status === 'Approved'));
            setRejectedRequests(data.filter(req => req.status === 'Rejected'));
        }
    }, [data]);

    useEffect(() => {
        // Clear response message when leave data changes (e.g., after approval/rejection)
        setResponseMessage('');
    }, [data]);

    const handleOpenForm = () => setShowForm(true);
    const handleDiscard = () => {
        setShowForm(false);
        setFormData({ startDate: '', endDate: '', reason: '' });
        setResponseMessage('');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMessage('');
        // Normalize dates to midnight for accurate comparison and submission
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log(start, end, today);

        if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
            setResponseMessage('All fields are required.');
            return;
        }
        if (start < today) {
            setResponseMessage('Start date cannot be in the past.');
            return;
        }
        if (start > end) {
            setResponseMessage('Start date cannot be after end date.');
            return;
        }
        if (pendingRequests.length > 0) {
            setResponseMessage('You already have a pending leave request.');
            return;
        }
        
        setRequestPending(true);
        try {
            const newReq = {
                applicationId: Date.now(),
                status: 'Pending',
                email,
                startDate: formData.startDate, // send as "YYYY-MM-DD"
                endDate: formData.endDate,
                reason: formData.reason,
            };
            await newRequest.post('/hostel/leave', newReq);
            await refetch(); // <-- Add this line
            setResponseMessage('Leave request submitted successfully.');
            setShowForm(false);
            setFormData({ startDate: '', endDate: '', reason: '' }); // Clear form after success
        } catch (err) {
            setResponseMessage('Failed to submit request.');
        } finally {
            setRequestPending(false);
        }
    };

    // Helper for tab button styles
    const tabButtonClass = (tab) =>
        `flex items-center px-5 py-2.5 shadow rounded-md text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50
        ${activeTab === tab ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-indigo-700'}
        `;

    // Card component for leave requests
    const LeaveCard = ({ req }) => {
        // Choose background color based on status
        let bg = "bg-gray-200";
        if (req.status === "Approved") bg = "bg-green-100";
        else if (req.status === "Rejected") bg = "bg-red-100";
        else if (req.status === "Pending") bg = "bg-yellow-50";
    
        return (
            <div className={`mb-4 p-4 shadow-sm border rounded ${bg}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                    <div className="flex items-center space-x-3 py-2">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm">
                            <svg stroke="currentColor" fill="currentColor" viewBox="0 0 448 512" className="w-5 h-5 text-indigo-600"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
                        </div>
                        <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Application Id</div>
                            <div className="text-sm font-semibold text-gray-800">{req.applicationId || req._id}</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 py-2">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm">
                            <svg stroke="currentColor" fill="currentColor" viewBox="0 0 384 512" className="w-5 h-5 text-indigo-600"><path d="M336 0H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM144 32h96c8.8 0 16 7.2 16 16s-7.2 16-16 16h-96c-8.8 0-16-7.2-16-16s7.2-16 16-16zm48 128c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64 28.7-64 64-64zm112 236.8c0 10.6-10 19.2-22.4 19.2H102.4C90 416 80 407.4 80 396.8v-19.2c0-31.8 30.1-57.6 67.2-57.6h5c12.3 5.1 25.7 8 39.8 8s27.6-2.9 39.8-8h5c37.1 0 67.2 25.8 67.2 57.6v19.2z"></path></svg>
                        </div>
                        <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Start Date</div>
                            <div className="text-sm font-semibold text-gray-800">{req.startDate ? new Date(req.startDate).toLocaleDateString() : ''}</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 py-2">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm">
                            <svg stroke="currentColor" fill="currentColor" viewBox="0 0 576 512" className="w-5 h-5 text-indigo-600"><path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0z"></path></svg>
                        </div>
                        <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">End Date</div>
                            <div className="text-sm font-semibold text-gray-800">{req.endDate ? new Date(req.endDate).toLocaleDateString() : ''}</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 py-2">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm">
                            <svg stroke="currentColor" fill="currentColor" viewBox="0 0 576 512" className="w-5 h-5 text-indigo-600"><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/></svg>
                        </div>
                        <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Reason</div>
                            <div className="text-sm font-semibold text-gray-800">{req.reason}</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 py-2">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm">
                            <svg stroke="currentColor" fill="currentColor" viewBox="0 0 576 512" className="w-5 h-5 text-indigo-600"><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/></svg>
                        </div>
                        <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Status</div>
                            <div className="text-sm font-semibold text-gray-800">{req.status}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center p-4 m-2">
            <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 flex items-center flex-col">
                <h2 className="text-2xl font-semibold text-center mb-4">Leave Requests</h2>
                <hr className="border-gray-300 mb-4 w-full" />

                {/* Tabs */}
                <div className="flex justify-around w-full mb-6">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={tabButtonClass('pending')}
                        style={activeTab === 'pending' ? { color: '#fff', fontWeight: 600 } : {}}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setActiveTab('approved')}
                        className={tabButtonClass('approved')}
                        style={activeTab === 'approved' ? { color: '#fff', fontWeight: 600 } : {}}
                    >
                        Approved
                    </button>
                    <button
                        onClick={() => setActiveTab('rejected')}
                        className={tabButtonClass('rejected')}
                        style={activeTab === 'rejected' ? { color: '#fff', fontWeight: 600 } : {}}
                    >
                        Rejected
                    </button>
                </div>

                {/* Tab Content */}
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error loading requests.</p>
                ) : (
                    <>
                        {activeTab === 'pending' && (
                            <>
                                {pendingRequests.length === 0 ? (
                                    <p className="card w-full bg-base-100 shadow border border-base-200 rounded-lg text-center text-gray-500 py-4">No pending requests</p>
                                ) : (
                                    <div className="space-y-3">
                                        {pendingRequests.map((req) => <LeaveCard key={req._id} req={req} />)}
                                    </div>
                                )}
                                {pendingRequests.length === 0 && !showForm && (
                                    <button
                                        className="mt-4 bg-indigo-700 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
                                        onClick={handleOpenForm}
                                        disabled={pendingRequests.length > 0}
                                    >
                                        Apply for Leave
                                    </button>
                                )}
                            </>
                        )}

                        {activeTab === 'approved' && (
                            approvedRequests.length === 0 ? (
                                <p className="card w-full bg-base-100 shadow border border-base-200 rounded-lg text-center text-gray-500 py-4">No approved requests</p>
                            ) : (
                                <div className="space-y-3">
                                    {approvedRequests.map((req) => <LeaveCard key={req._id} req={req} />)}
                                </div>
                            )
                        )}

                        {activeTab === 'rejected' && (
                            rejectedRequests.length === 0 ? (
                                <p className="card w-full bg-base-100 shadow border border-base-200 rounded-lg text-center text-gray-500 py-4">No rejected requests</p>
                            ) : (
                                <div className="space-y-3">
                                    {rejectedRequests.map((req) => <LeaveCard key={req._id} req={req} />)}
                                </div>
                            )
                        )}
                    </>
                )}

                {/* Leave Application Form */}
                {showForm && (
                    <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md w-[80%]">
                        <h3 className="text-xl font-semibold text-center mb-4">Leave Application</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    className={`w-full p-2 border rounded-lg ${
                                        formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)
                                            ? 'border-red-500'
                                            : ''
                                    }`}
                                />
                                {formData.startDate && new Date(formData.startDate) < new Date(new Date().setHours(0,0,0,0)) && (
                                    <p className="text-red-500 text-sm mt-1">Start date cannot be in the past</p>
                                )}
                                {formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate) && (
                                    <p className="text-red-500 text-sm mt-1">Start date cannot be after end date</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                    className={`w-full p-2 border rounded-lg ${
                                        formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)
                                            ? 'border-red-500'
                                            : ''
                                    }`}
                                />
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
                                    disabled={
                                        requestPending ||
                                        (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate))
                                    }
                                >
                                    {requestPending ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {responseMessage && (
                    <div className="mt-4 p-4 rounded bg-yellow-100 text-yellow-800">
                        <p>{responseMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HostelLeaveStudent;
