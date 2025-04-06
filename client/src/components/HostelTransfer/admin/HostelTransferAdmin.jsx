import React, { useState, useEffect } from 'react';
import PendingRequests from './PendingRequests';
import ApprovedRequests from './ApprovedRequests';
import RejectedRequests from './RejectedRequests';

const HostelTransferAdmin = () => {
  const [activeTab, setActiveTab] = useState('pending');
  // const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([
    // Example pending requests
    {
      id: 1,
      studentId: '220101038',
      studentName: 'Dipesh',
      currentHostel: 'Lohit',
      requestedHostel: 'Kapili',
      reason: 'Better Mess Food in Kapili',
    },
    {
      id: 2,
      studentId: '220101033',
      studentName: 'Daksh',
      currentHostel: 'Kapili',
      requestedHostel: 'Siang',
      reason: 'Better Vending Machine',
    },
    {
      id: 3,
      studentId: '220101042',
      studentName: 'Gagandeep',
      currentHostel: 'Manas',
      requestedHostel: 'Lohit',
      reason: 'Better rooms',
    },
  ]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [rejectionReasons, setRejectionReasons] = useState({});

  useEffect(() => {
    const fetchPendingRequests = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/hostel-transfer-requests');
          const text = await response.text();
          console.log('Raw response:', text); // Log raw response
          const data = JSON.parse(text);
          setPendingRequests(data.pending);
        } catch (error) {
          console.error('Error fetching pending requests:', error);
        }
      };
      fetchPendingRequests();
  }, []);

  const handleApprove = async (request) => {
    try {
        // comment below 3 lines when backend works
        setPendingRequests(pendingRequests.filter(r => r.id !== request.id));
        const approvalTimestamp = new Date().toLocaleString();
        setApprovedRequests([...approvedRequests, { ...request, approvalTimestamp }]);

        const response = await fetch(`http://localhost:5000/api/hostel-transfer/${request.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // uncomment below 3 lines when backend works
        // setPendingRequests(pendingRequests.filter(r => r.id !== request.id));
        // const approvalTimestamp = new Date().toLocaleString();
        // setApprovedRequests([...approvedRequests, { ...request, approvalTimestamp }]);
        console.log(`Notified student ${request.studentId}: Your hostel has been changed to ${request.requestedHostel}.`);
      }
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (request) => {
    const reason = rejectionReasons[request.id];
    if (!reason) return;

    try {
        // comment below 4 lines when backend works
        const rejectionTimestamp = new Date().toLocaleString();
        setRejectedRequests([...rejectedRequests, { ...request, reason, rejectionTimestamp }]);
        setPendingRequests(pendingRequests.filter(r => r.id !== request.id));
        setRejectionReasons(prev => ({ ...prev, [request.id]: '' }));

        const response = await fetch(`http://localhost:5000/api/hostel-transfer/${request.id}/reject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason }),
        });

      if (response.ok) {
        // uncomment below 4 lines when backend works
        // const rejectionTimestamp = new Date().toLocaleString();
        // setRejectedRequests([...rejectedRequests, { ...request, reason, rejectionTimestamp }]);
        // setPendingRequests(pendingRequests.filter(r => r.id !== request.id));
        // setRejectionReasons(prev => ({ ...prev, [request.id]: '' }));
        console.log(`Notified student ${request.studentId}: Your hostel transfer request was rejected: ${reason}`);
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleReasonChange = (id, value) => {
    setRejectionReasons(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div class="flex justify-around mb-6 p-1 space-x-1">
      <button 
          onClick={() => setActiveTab('pending')}
          className={`flex items-center px-5 py-2.5 shadow rounded-md text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 ${activeTab === 'pending' ? 'bg-indigo-700 text-white' : 'bg-gray-200'} text-indigo-700`}>
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="w-4 h-4 mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M464 480H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v352c0 26.51-21.49 48-48 48zM128 120c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm0 96c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm0 96c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm288-136v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12zm0 96v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12zm0 96v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12z"></path></svg>
           Pending
        </button>
        <button 
          onClick={() => setActiveTab('approved')}
          className={`flex items-center px-5 py-2.5 shadow rounded-md text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 ${activeTab === 'approved' ? 'bg-indigo-700 text-white' : 'bg-gray-200'} text-indigo-700`}>
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="w-4 h-4 mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M464 480H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v352c0 26.51-21.49 48-48 48zM128 120c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm0 96c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm0 96c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm288-136v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12zm0 96v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12zm0 96v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12z"></path></svg>
           Approved
        </button>
        <button 
          onClick={() => setActiveTab('rejected')}
          className={`flex items-center px-5 py-2.5 shadow rounded-md text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 ${activeTab === 'rejected' ? 'bg-indigo-700 text-white' : 'bg-gray-200'} text-indigo-700`}>
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="w-4 h-4 mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M464 480H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v352c0 26.51-21.49 48-48 48zM128 120c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm0 96c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm0 96c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm288-136v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12zm0 96v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12zm0 96v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12z"></path></svg>
           Rejected
        </button>
      </div>

      {activeTab === 'pending' && (
        <PendingRequests
          requests={pendingRequests}
          onApprove={handleApprove}
          onReject={handleReject}
          rejectionReasons={rejectionReasons}
          handleReasonChange={handleReasonChange}
        />
      )}

      {activeTab === 'approved' && (
        <ApprovedRequests requests={approvedRequests} />
      )}

      {activeTab === 'rejected' && (
        <RejectedRequests requests={rejectedRequests} />
      )}
    </div>
  );
};

export default HostelTransferAdmin;
