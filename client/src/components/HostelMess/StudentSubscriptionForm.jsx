import React, { useState } from 'react';
import axios from 'axios';
import './styles/StudentSubscriptionForm.css';

const createSubscriptionRequest = async (data) => {
  const response = await axios.post('/api/subscription-request', data);
  return response.data;
};

const getSubscriptionRequests = async () => {
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

const SubscriptionManagement = () => {
  const [studentId, setStudentId] = useState('');
  const [currentPlan, setCurrentPlan] = useState('REGULAR');
  const [newPlan, setNewPlan] = useState('REGULAR');
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const validateStudentId = (id) => {
    const studentIdRegex = /^\d{9}$/;
    return studentIdRegex.test(id);
  };

  const fetchSubscriptionRequests = async () => {
    setIsLoading(true);
    try {
      const fetchedRequests = await getSubscriptionRequests();
      setRequests(fetchedRequests);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch subscription requests');
      setIsLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateStudentId(studentId)) {
      setError('Invalid Student ID. Must be exactly 9 digits');
      return;
    }

    if (currentPlan === newPlan) {
      setError('Current plan and new plan cannot be the same');
      return;
    }

    try {
      await createSubscriptionRequest({ studentId, currentPlan, newPlan });
      alert('Subscription request submitted successfully!');
      setStudentId('');
      setCurrentPlan('REGULAR');
      setNewPlan('REGULAR');
      await fetchSubscriptionRequests();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
        'Failed to submit request. Please try again.';
      setError(errorMessage);
    }
  };

  const handleProcessRequest = async (requestId, status) => {
    const rejectionReason = status === 'REJECTED' 
      ? prompt('Please provide a reason for rejection:') 
      : '';
    
    try {
      await processSubscriptionRequest({ 
        requestId, 
        status, 
        rejectionReason 
      });
      alert('Subscription request processed successfully!');
      await fetchSubscriptionRequests();
    } catch (err) {
      setError('Failed to process subscription request');
    }
  };

  return (
    <div className="subscription-container">
      <div className="subscription-card">
        <form onSubmit={handleCreateRequest} className="subscription-form">
          <h2>Mess Subscription Management</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="studentId">Student ID</label>
            <input 
              type="number" 
              id="studentId"
              value={studentId}
              onChange={(e) => {
                const value = e.target.value.slice(0, 9);
                setStudentId(value);
              }}
              placeholder="Enter 9-digit Student ID"
              required 
              min="100000000"
              max="999999999"
            />
          </div>

          <div className="form-group">
            <label htmlFor="currentPlan">Current Plan</label>
            <div className="plan-options">
              <label 
                className={`plan-option ${currentPlan === 'REGULAR' ? 'selected' : ''}`}
              >
                <input 
                  type="radio" 
                  value="REGULAR"
                  checked={currentPlan === 'REGULAR'}
                  onChange={() => setCurrentPlan('REGULAR')}
                  className="plan-radio"
                />
                <span>Regular Plan</span>
              </label>
              <label 
                className={`plan-option ${currentPlan === 'SPECIAL' ? 'selected' : ''}`}
              >
                <input 
                  type="radio" 
                  value="SPECIAL"
                  checked={currentPlan === 'SPECIAL'}
                  onChange={() => setCurrentPlan('SPECIAL')}
                  className="plan-radio"
                />
                <span>Special Plan</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPlan">New Plan</label>
            <div className="plan-options">
              <label 
                className={`plan-option ${newPlan === 'REGULAR' ? 'selected' : ''}`}
              >
                <input 
                  type="radio" 
                  value="REGULAR"
                  checked={newPlan === 'REGULAR'}
                  onChange={() => setNewPlan('REGULAR')}
                  className="plan-radio"
                />
                <span>Regular Plan</span>
              </label>
              <label 
                className={`plan-option ${newPlan === 'SPECIAL' ? 'selected' : ''}`}
              >
                <input 
                  type="radio" 
                  value="SPECIAL"
                  checked={newPlan === 'SPECIAL'}
                  onChange={() => setNewPlan('SPECIAL')}
                  className="plan-radio"
                />
                <span>Special Plan</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
          >
            Submit Request
          </button>
        </form>

        {/* Subscription Requests List */}
        <div className="requests-section">
          <h3>Subscription Requests</h3>
          {isLoading ? (
            <div>Loading requests...</div>
          ) : (
            requests.map((request) => (
              <div key={request._id} className="request-item">
                <div>
                  <strong>Student:</strong> {request.studentId?.name || 'Unknown'}
                  <br />
                  <strong>Current Plan:</strong> {request.currentPlan}
                  <br />
                  <strong>Requested Plan:</strong> {request.newPlan}
                  <br />
                  <strong>Status:</strong> {request.status}
                </div>
                {request.status === 'PENDING' && (
                  <div className="request-actions">
                    <button 
                      onClick={() => handleProcessRequest(request._id, 'APPROVED')}
                      className="approve-btn"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleProcessRequest(request._id, 'REJECTED')}
                      className="reject-btn"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;