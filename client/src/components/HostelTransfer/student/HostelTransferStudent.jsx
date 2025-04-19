import React, { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import ApprovedRequests from './ApprovedRequests';
import RejectedRequests from './RejectedRequests';

const HostelTransferStudent = () => {
  const { data: userData } = JSON.parse(localStorage.getItem("currentUser"));
  const { email, userId } = userData.user;
  // console.log(userId);

  const { isLoading, error, data } = useQuery({
    queryKey: [`${userId}`],
    queryFn: () =>
      newRequest.get(`/student/${userId}`).then((res) => {
        return res.data;
      }),
  });

  const allHostels = {
    boy: ['Brahmaputra', 'Lohit', 'Gaurang', 'Disang', 'Kapili', 'Manas', 'Dihing', 'Barak', 'Siang', 'Kameng', 'Umiam', 'Married Scholar'],
    girl: ['Dhansiri', 'Disang', 'Subhansiri'],
  };

  const [activeTab, setActiveTab] = useState('pending');
  const [availableHostels, setAvailableHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState('');
  const [currentHostel, setCurrentHostel] = useState('');
  const [requests, setRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState('');
  const [requestPending, setRequestPending] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    if (data) {
      setCurrentHostel(data?.hostel);
      const gender = allHostels.boy.includes(data?.hostel) ? 'boy' : 'girl';
      const filteredHostels = allHostels[gender].filter(hostel => hostel !== data?.hostel);
      setAvailableHostels(filteredHostels);
    }
  }, [data]);

  const { isLoading: isLoadingRequests, error: errorRequests, data: transferRequests } = useQuery({
    queryKey: ["transferRequests"],
    queryFn: () =>
      newRequest.get(`/hostel/${userId}/transfer-requests`).then((res) => {
        // console.log(res.data);
        return res.data;
      }),
    // onSuccess: (data) => {
    //   setPendingRequests(data.filter(req => req.status === 'Pending'));
    //   setApprovedRequests(data.filter(req => req.status === 'Approved'));
    //   setRejectedRequests(data.filter(req => req.status === 'Rejected'));
    // }
  });

  useEffect(() => {
    if (!isLoadingRequests && !errorRequests && transferRequests) {
      // console.log(transferRequests);
      setRequests(transferRequests.map(item => ({
        id: item._id,
        rollNo: item.rollNo,
        requestedHostel: item.requestedHostel,
        currentHostel: item.currentHostel,
        reason: item.reason,
        status: item.status
      })));
    }
  }, [transferRequests, isLoadingRequests, errorRequests]);

  useEffect(() => {
    if (requests) {
      setPendingRequests(requests.filter(req => req.status === 'Pending'));
      setApprovedRequests(requests.filter(req => req.status === 'Approved'));
      setRejectedRequests(requests.filter(req => req.status === 'Rejected'));
    }
  }, [requests]);

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleDiscard = () => {
    setShowForm(false);
    setSelectedHostel('');
    setReason('');
  };

  const handleTransferRequest = async (e) => {
    e.preventDefault();
    setResponseMessage('');

    if (!selectedHostel || !reason.trim()) {
      setResponseMessage('Please fill all fields.');
      return;
    }

    setRequestPending(true);

    try {
      const newReq = {
        status: 'Pending',
        studentId: data?.rollNo,
        currentHostel,
        requestedHostel: selectedHostel,
        reason,
      };

      await newRequest.post('/hostel/transfer', newReq);
      setPendingRequests([...pendingRequests, newReq]);
      handleDiscard();
    } catch (error) {
      setResponseMessage('An error occurred while processing your request. Please try again.');
    } finally {
      setRequestPending(false);
    }
  };

  if (isLoading || isLoadingRequests) return <p>Loading...</p>;
  if (error || errorRequests) return <p>Error: {error?.message || errorRequests?.message}</p>;

  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center p-4 m-2">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 flex items-center flex-col ">
        <h2 className="text-2xl font-semibold text-center mb-4">Transfer Requests</h2>
        <hr className="border-gray-300 mb-4 w-full" />

        <div className="flex justify-around w-full mb-6">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex items-center px-5 py-2.5 shadow rounded-md text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 ${activeTab === 'pending' ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-indigo-700' } `}>
            Pending
          </button>
          <button 
            onClick={() => setActiveTab('approved')}
            className={`flex items-center px-5 py-2.5 shadow rounded-md text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 ${activeTab === 'approved' ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-indigo-700'} `}>
            Approved
          </button>
          <button 
            onClick={() => setActiveTab('rejected')}
            className={`flex items-center px-5 py-2.5 shadow rounded-md text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 ${activeTab === 'rejected' ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-indigo-700'} `}>
            Rejected
          </button>
        </div>

        {activeTab === 'pending' && (
          <>
            {pendingRequests.length === 0 ? (
              <p className="card w-full bg-base-100 shadow border border-base-200 rounded-lg text-center text-gray-500 py-4">No pending requests</p>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((req, index) => (
                  <div key={index} className="p-4 bg-gray-200 rounded-lg shadow">
                    <p><strong>Current Hostel:</strong> {req.currentHostel}</p>
                    <p><strong>Requested Hostel:</strong> {req.requestedHostel}</p>
                    <p><strong>Reason:</strong> {req.reason}</p>
                    <p><strong>Status:</strong> {req.status}</p>
                  </div>
                ))}
              </div>
            )}

            {pendingRequests.length === 0 && !showForm && (
              <button className="mt-4 bg-indigo-700 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition" onClick={handleOpenForm}>
                Apply for Transfer
              </button>
            )}
          </>
        )}

        {activeTab === 'approved' && (
          <ApprovedRequests requests={approvedRequests} />
        )}

        {activeTab === 'rejected' && (
          <RejectedRequests requests={rejectedRequests} />
        )}

        {showForm && (
          <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md w-[80%]">
            <div className="flex items-center space-x-3 pt-1 pb-3 mb-2 border-b">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Current Hostel : {currentHostel}</div>
            </div>
            <form onSubmit={handleTransferRequest} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Select a Hostel</label>
                <select
                  value={selectedHostel}
                  onChange={(e) => setSelectedHostel(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                >
                  <option value="">Select</option>
                  {availableHostels.map((hostel, index) => (
                    <option key={index} value={hostel}>{hostel}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Reason for Transfer</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter your reason for the hostel change request"
                  className="w-full border border-gray-300 rounded p-2 resize-none min-h-[80px]"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button type="button" className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition" onClick={handleDiscard}>Discard</button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  disabled={requestPending}
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

export default HostelTransferStudent;