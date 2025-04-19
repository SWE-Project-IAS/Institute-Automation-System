import React, { useState } from 'react';
import { FaCheck, FaTimes, FaUser, FaCalendarAlt, FaUtensils, FaSearch } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import toast from 'react-hot-toast';
import './styles/AdminSubscriptionRequests.css';

const AdminSubscriptionRequests = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);

  const queryClient = useQueryClient();
  
  // Fetch requests using React Query
  const { data: requests = [], isLoading, error } = useQuery({
    queryKey: ['subscriptionRequests', filterStatus],
    queryFn: async () => {
      // API doesn't support status filtering, so we'll do it client-side
      const res = await newRequest.get('/hostel/mess/admin/requests');
      let data = res.data;
      
      // Filter data if needed (client-side filtering)
      if (filterStatus !== 'ALL') {
        data = data.filter(req => req.status === filterStatus);
      }
      
      return data;
    },
    keepPreviousData: true,
  });

  // Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationFn: ({ requestId, status, rejectionReason }) => {
      return newRequest.put(`/hostel/mess/admin/requests/${requestId}`, { 
        status, 
        rejectionReason: rejectionReason || undefined 
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['subscriptionRequests']);
      toast.success(`Request ${variables.status.toLowerCase()} successfully!`);
      setSelectedRequest(null);
      setShowRejectionDialog(false);
      setRejectionReason('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update request.');
    }
  });

  // Filter based on search term locally
const filteredRequests = requests.filter(request => {
  // Change from studentId to userId
  const matchesSearch =
    (request.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (request.studentRollNo || '').toString().includes(searchTerm);
  return matchesSearch;
});
  // Handle Approve/Reject button clicks
  const handleRequestAction = (requestId, status, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    const request = requests.find(req => req._id === requestId);
    if (!request) return;
    
    setSelectedRequest(request);
    
    if (status === 'Rejected') {
      setShowRejectionDialog(true);
    } else {
      updateStatusMutation.mutate({ 
        requestId: request._id, 
        status: 'Approved' 
      });
    }
  };

  // Handle Confirming Rejection from Dialog
  const handleRejectConfirm = () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    
    updateStatusMutation.mutate({
      requestId: selectedRequest._id,
      status: 'Rejected',
      rejectionReason: rejectionReason
    });
  };

  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      'Approved': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      'Rejected': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
    };
    
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text} ${config.border}`}>
        {status}
      </span>
    );
  };

  // Format meal plan name for display
  const formatPlanName = (plan) => {
    switch (plan) {
      case 'Basic': return 'Basic (10 meals/week)';
      case 'Premium': return 'Premium (19 meals/week)';
      case 'Unlimited': return 'Unlimited (24/7 access)';
      case 'None': return 'None (No meal plan)';
      default: return plan || 'N/A';
    }
  };

  if (isLoading) return <p className="text-center p-10">Loading requests...</p>;
  if (error) return <p className="text-center p-10 text-red-500">Error loading requests: {error.message}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <FaUtensils className="mr-2" /> Meal Plan Requests
          </h2>
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="bg-white rounded-full flex items-center px-3 py-1">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search Student or ID..."
                className="border-none focus:ring-0 focus:outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border-none text-sm rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="ALL">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        {/* Request Grid */}
        <div className="p-6">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
              <p className="mt-1 text-sm text-gray-500">No subscription requests match your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <div
                  key={request._id}
                  className={`
                    border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md
                    ${selectedRequest?._id === request._id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                    ${request.status === 'Pending' ? 'border-yellow-300' : request.status === 'Approved' ? 'border-green-300' : 'border-red-300'}
                  `}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="p-4">
                    {/* Request Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <FaUser className="text-blue-600" />
                        </div>
                        <div>
  <h3 className="font-medium text-gray-900">{request.studentName || 'N/A'}</h3>
  <p className="text-sm text-gray-500">ID: {request.studentRollNo || 'N/A'}</p>
</div>
                      </div>
                      {/* Status Badge */}
                      {getStatusBadge(request.status)}
                    </div>
                    
                    {/* Request Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Requested Plan:</span>
                        <span className="font-medium text-blue-600">{formatPlanName(request.newPlan)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 flex items-center">
                          <FaCalendarAlt className="mr-1 text-gray-400" /> Request Date:
                        </span>
                        <span className="font-medium">
                          {new Date(request.createdAt).toLocaleDateString() || 'N/A'}
                        </span>
                      </div>
                      {request.status === 'Rejected' && request.rejectionReason && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-500">Rejection Reason:</span>
                          <p className="text-red-600 mt-1">{request.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions for Pending */}
                    {request.status === 'Pending' && (
                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end space-x-2">
                        <button
                          onClick={(e) => handleRequestAction(request._id, 'Approved', e)}
                          disabled={updateStatusMutation.isLoading}
                          className={`px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 ${updateStatusMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {updateStatusMutation.isLoading && selectedRequest?._id === request._id ? '...' : 'Approve'}
                        </button>
                        <button
                          onClick={(e) => handleRequestAction(request._id, 'Rejected', e)}
                          disabled={updateStatusMutation.isLoading}
                          className={`px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 ${updateStatusMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rejection Dialog */}
      {showRejectionDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Provide Rejection Reason</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejecting this request..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            ></textarea>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectionDialog(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={updateStatusMutation.isLoading || !rejectionReason.trim()}
                className={`
                  px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600
                  ${(updateStatusMutation.isLoading || !rejectionReason.trim()) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {updateStatusMutation.isLoading ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptionRequests;