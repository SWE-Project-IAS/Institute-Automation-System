import React, { useState } from 'react';
import { FaTimesCircle, FaEye } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from '../../../utils/newRequest';
import { toast } from 'react-hot-toast';

const ApplicationDetails = ({ application, onClose, onViewFull }) => {
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    // Fetch detailed application data including remarks
    const { data: details } = useQuery({
        queryKey: ['application-details', application.id],
        queryFn: () => newRequest.get(`/acadAdmin/documents/applications/${application.id}`)
            .then(res => res.data),
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Error fetching application details');
        }
    });

    const [applicationStatus, setApplicationStatus] = useState(application.status);

    // Status update mutation
    const updateStatusMutation = useMutation({
        mutationFn: ({ newStatus, remarks }) => {
            return newRequest.patch(`/acadAdmin/documents/applications/${application.id}/status`, {
                status: newStatus,
                remarks
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['applications']);
            queryClient.invalidateQueries(['application-details', application.id]);
            toast.success('Status updated successfully');
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Error updating status');
        }
    });

    // Add comment mutation
    const addCommentMutation = useMutation({
        mutationFn: (comment) => {
            return newRequest.post(`/acadAdmin/documents/applications/${application.id}/comment`, {
                comment
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['applications']);
            queryClient.invalidateQueries(['application-details', application.id]);
            setNewComment('');
            toast.success('Comment added successfully');
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Error adding comment');
        }
    });

    const handleStatusChange = async (newStatus) => {
        if (loading || applicationStatus === newStatus) return;
        
        setLoading(true);
        try {
            const properStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).toLowerCase();
            await updateStatusMutation.mutateAsync({
                newStatus: properStatus, 
                remarks: `Application ${properStatus.toLowerCase()}`
            });
            setApplicationStatus(properStatus);
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        addCommentMutation.mutate(newComment);
    };

    // Ensure we have remarks array even if approvalDetails is undefined
    const remarks = details?.approvalDetails?.remarks || [];

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
                            ${applicationStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                            applicationStatus === 'Rejected' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                            'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                            {applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}
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

                    {/* Approval History with Add Comment Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Approval History</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Add a remark..."
                                />
                                <button 
                                    onClick={handleAddComment}
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                    disabled={!newComment.trim() || loading}
                                >
                                    Add Remark
                                </button>
                            </div>
                        </div>
                        
                        {remarks.length > 0 ? (
                            <div className="space-y-3">
                                {remarks.map((remark, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-900">{remark}</p>
                                        <div className="mt-2 text-sm text-gray-500">
                                            By: {details?.approvalDetails?.approvedBy?.name || 'Admin'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 italic">No remarks available</div>
                        )}
                    </div>
                </div>

                {/* Action Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
                    <button 
                        onClick={() => handleStatusChange('rejected')}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                        disabled={applicationStatus === 'rejected' || loading}
                    >
                        Reject Application
                    </button>
                    <button 
                        onClick={() => handleStatusChange('approved')}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                        disabled={applicationStatus === 'approved' || loading}
                    >
                        Approve Application
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetails;
