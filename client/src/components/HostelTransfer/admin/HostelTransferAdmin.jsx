import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import newRequest from "../../../utils/newRequest";
import PendingRequests from './PendingRequests';
import ApprovedRequests from './ApprovedRequests';
import RejectedRequests from './RejectedRequests';

const HostelTransferAdmin = () => {

  const [requests, setRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');

  const { isLoading, error, data } = useQuery({
    queryKey: ["transfer-requests"],
    queryFn: () =>
      newRequest.get(`/hostel/transfer-requests`).then((res) => {
        return res.data;
      }),
    });
      
  useEffect(() => {
    if (!isLoading && !error && data) {
      // console.log(data);
      setRequests(data.map(item => ({
        id: item._id,
        rollNo: item.rollNo,
        requestedHostel: item.requestedHostel,
        currentHostel: item.currentHostel,
        reason: item.reason,
        status: item.status
      })));
    }
  }, [data, isLoading, error]);
  
  // console.log(res.data);

  useEffect(() => {
    if (requests) {
      setPendingRequests(requests.filter(req => req.status === 'Pending'));
      setApprovedRequests(requests.filter(req => req.status === 'Approved'));
      setRejectedRequests(requests.filter(req => req.status === 'Rejected'));
    }
  }, [requests]);


  const handleAction = (id, newStatus, newReason, newHostel, rollNo) => {
    // console.log(id,newStatus,newReason,newHostel, rollNo);
    newRequest.put(`/hostel/transfer-requests/${id}`, { status: newStatus, reason: newReason, newHostel: newHostel, rollNo: rollNo})
      .then(response => {
        console.log('Status updated successfully');
        // Update local state based on new status
        setPendingRequests(prev => prev.filter(req => req.id !== id));
        if (newStatus === 'Approved') {
          setApprovedRequests(prev => [...prev, { ...response.data, status: newStatus }]);
        } else if (newStatus === 'Rejected') {
          setRejectedRequests(prev => [...prev, { ...response.data, status: newStatus }]);
        }
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  };
  
  

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div class="flex justify-around mb-6 p-1 space-x-1">
      <button 
          onClick={() => setActiveTab('pending')}
          className={`flex items-center px-5 py-2.5 shadow rounded-md text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 ${activeTab === 'pending' ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-indigo-700'} `}>
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="w-4 h-4 mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M464 480H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v352c0 26.51-21.49 48-48 48zM128 120c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm0 96c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm0 96c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm288-136v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12zm0 96v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12zm0 96v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12z"></path></svg>
           Pending
        </button>
        <button 
          onClick={() => setActiveTab('approved')}
          className={`flex items-center px-5 py-2.5 shadow rounded-md text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 ${activeTab === 'approved' ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-indigo-700'} `}>
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="w-4 h-4 mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M464 480H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v352c0 26.51-21.49 48-48 48zM128 120c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm0 96c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm0 96c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm288-136v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12zm0 96v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12zm0 96v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12z"></path></svg>
           Approved
        </button>
        <button 
          onClick={() => setActiveTab('rejected')}
          className={`flex items-center px-5 py-2.5 shadow rounded-md text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 ${activeTab === 'rejected' ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-indigo-700'} `}>
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="w-4 h-4 mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M464 480H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v352c0 26.51-21.49 48-48 48zM128 120c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm0 96c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm0 96c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm288-136v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12zm0 96v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12zm0 96v-32c0-6.627-5.373-12-12-12H204c-6.627 0-12 5.373-12 12v32c0 6.627 5.373 12 12 12h200c6.627 0 12-5.373 12-12z"></path></svg>
           Rejected
        </button>
      </div>

      {activeTab === 'pending' && (
        <PendingRequests
          requests={pendingRequests}
          handleAction={handleAction}
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
