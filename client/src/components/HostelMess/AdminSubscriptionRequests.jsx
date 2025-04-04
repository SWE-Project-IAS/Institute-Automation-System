import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaUser, FaCalendarAlt, FaUtensils, FaSearch } from 'react-icons/fa';
import './styles/AdminSubscriptionRequests.css';

const fetchSubscriptionRequests = async () => {
  const response = await axios.get('/api/subscription-requests');
  return response.data;
};

const processSubscriptionRequest = async ({ requestId, status, rejectionReason }) => {
  const response = await axios.put('/api/process-request', {
    requestId,
    status,
    rejectionReason
  });
  return response.data;
};

const AdminSubscriptionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);

  const loadSubscriptionRequests = async () => {
    try {
      setIsLoading(true);
      const fetchedRequests = await fetchSubscriptionRequests();
      setRequests(fetchedRequests);
      setIsLoading(false);
    } catch (err) {
      setError('Unable to load subscription requests');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptionRequests();
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      (request.studentId?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.studentId?.studentId || '').toString().includes(searchTerm);
    
    const matchesFilter = 
      filterStatus === 'ALL' || 
      request.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleRequestAction = async (status) => {
    if (!selectedRequest) return;

    if (status === 'REJECTED') {
      setShowRejectionDialog(true);
      return;
    }

    try {
      setIsProcessing(true);
      await processSubscriptionRequest({
        requestId: selectedRequest._id,
        status,
        rejectionReason: ''
      });

      await loadSubscriptionRequests();
      setSelectedRequest(null);
      setIsProcessing(false);
    } catch (err) {
      setError('Failed to process request');
      setIsProcessing(false);
    }
  };

  const handleRejectConfirm = async () => {
    try {
      setIsProcessing(true);
      await processSubscriptionRequest({
        requestId: selectedRequest._id,
        status: 'REJECTED',
        rejectionReason
      });

      await loadSubscriptionRequests();
      setSelectedRequest(null);
      setRejectionReason('');
      setShowRejectionDialog(false);
      setIsProcessing(false);
    } catch (err) {
      setError('Failed to process request');
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      APPROVED: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
    };
    
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text} ${config.border}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaTimes className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <FaUtensils className="mr-2" /> Meal Plan Requests
          </h2>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-full flex items-center px-3 py-1">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="border-none focus:ring-0 focus:outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border-none text-sm rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

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
                  `}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <FaUser className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {request.studentId?.name || 'Unknown Student'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            ID: {request.studentId?.studentId}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Current Plan:</span>
                        <span className="font-medium">{request.currentPlan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Requested Plan:</span>
                        <span className="font-medium">{request.newPlan}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 flex items-center">
                          <FaCalendarAlt className="mr-1 text-gray-400" /> Request Date:
                        </span>
                        <span className="font-medium">
                          {new Date(request.createdAt).toLocaleDateString() || 'Unknown'}
                        </span>
                      </div>
                    </div>
                    
                    {request.status === 'PENDING' && (
                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(request);
                            handleRequestAction('APPROVED');
                          }}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(request);
                            handleRequestAction('REJECTED');
                          }}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
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
                disabled={isProcessing || !rejectionReason.trim()}
                className={`
                  px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600
                  ${(isProcessing || !rejectionReason.trim()) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isProcessing ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptionRequests;