import React, { useState } from 'react';
import { FaTimesCircle, FaEye } from 'react-icons/fa';

const ApplicationDetails = ({ application, onClose, onViewFull }) => {
    const [newComment, setNewComment] = useState('');
    const [status, setStatus] = useState(application.status);

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        // Add API call here
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        // Add API call here
        setNewComment('');
    };

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Review Application</h2>
                        <p className="text-sm text-gray-500">Application #{application.id}</p>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={onViewFull}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Full Application"
                        >
                            <FaEye className="text-gray-500" />
                        </button>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FaTimesCircle className="text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex justify-center">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
                            ${status === 'approved' ? 'bg-green-100 text-green-700' :
                            status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    </div>

                    {/* Quick Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Student</p>
                            <p className="font-medium">{application.studentName}</p>
                            <p className="text-sm text-gray-500">{application.rollNo}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Document Type</p>
                            <p className="font-medium capitalize">{application.type}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Submitted On</p>
                            <p className="font-medium">{application.submittedDate}</p>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Comments & History</h3>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto p-4 bg-gray-50 rounded-lg">
                            {application.comments.map((comment, index) => (
                                <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                                    <p className="text-gray-900">{comment.text}</p>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                        <span>{comment.by}</span>
                                        <span>•</span>
                                        <span>{comment.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Comment */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Add a comment..."
                            />
                            <button 
                                onClick={handleAddComment}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                disabled={!newComment.trim()}
                            >
                                Add Comment
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
                    <button 
                        onClick={() => handleStatusChange('rejected')}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                        disabled={status === 'rejected'}
                    >
                        Reject Application
                    </button>
                    <button 
                        onClick={() => handleStatusChange('approved')}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                        disabled={status === 'approved'}
                    >
                        Approve Application
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetails;
