import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  const handleRequestAction = async (status) => {
    if (!selectedRequest) return;

    try {
      setIsProcessing(true);
      const rejectionReason = status === 'REJECTED' 
        ? prompt('Please provide a reason for rejection:') 
        : '';
      
      await processSubscriptionRequest({
        requestId: selectedRequest._id,
        status,
        rejectionReason
      });

      await loadSubscriptionRequests();
      setSelectedRequest(null);
      setIsProcessing(false);
    } catch (err) {
      alert('Failed to process request');
      setIsProcessing(false);
    }
  };

  const renderRequestStatus = (status) => {
    const statusColors = {
      PENDING: 'text-yellow-600',
      APPROVED: 'text-green-600',
      REJECTED: 'text-red-600'
    };
    return (
      <span className={`font-semibold ${statusColors[status] || 'text-gray-600'}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return <div className="loading">Loading subscription requests...</div>;
  }


  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-container">
      <h2>Subscription Requests</h2>
      
      {requests.length === 0 ? (
        <div className="no-requests">No subscription requests found</div>
      ) : (
        <div className="requests-grid">
          {requests.map((request) => (
            <div 
              key={request._id} 
              className={`request-card ${selectedRequest?._id === request._id ? 'selected' : ''}`}
              onClick={() => setSelectedRequest(request)}
            >
              <div className="request-header">
                <h3>{request.studentId?.name || 'Unknown Student'}</h3>
                {renderRequestStatus(request.status)}
              </div>
              <div className="request-details">
                <p>
                  <strong>Student ID:</strong> {request.studentId?.studentId}
                </p>
                <p>
                  <strong>Current Plan:</strong> {request.currentPlan}
                </p>
                <p>
                  <strong>Requested Plan:</strong> {request.newPlan}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRequest && (
        <div className="request-modal">
          <div className="request-modal-content">
            <h3>Process Subscription Request</h3>
            <p>Do you want to approve or reject this request?</p>
            <div className="modal-actions">
              <button 
                onClick={() => handleRequestAction('APPROVED')}
                disabled={isProcessing}
                className="approve-btn"
              >
                {isProcessing ? 'Processing...' : 'Approve'}
              </button>
              <button 
                onClick={() => handleRequestAction('REJECTED')}
                disabled={isProcessing}
                className="reject-btn"
              >
                {isProcessing ? 'Processing...' : 'Reject'}
              </button>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptionRequests;