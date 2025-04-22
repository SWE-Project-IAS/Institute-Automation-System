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
              <div className='card w-full bg-base-100 shadow border border-base200 p-6 rounded-lg'>
                {pendingRequests.map((req, index) => (
                  <div key={index} className="mb-2 shadow-sm p-4 border rounded bg-gray-200">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                    <div class="flex items-center space-x-3 py-2">
                      <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center border border-indigo-200 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" class="w-8 h-5 text-indigo-600" height="1em" width="1em">
                        <path d="M0 96l576 0c0-35.3-28.7-64-64-64L64 32C28.7 32 0 60.7 0 96zm0 32L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-288L0 128zM64 405.3c0-29.5 23.9-53.3 53.3-53.3l117.3 0c29.5 0 53.3 23.9 53.3 53.3c0 5.9-4.8 10.7-10.7 10.7L74.7 416c-5.9 0-10.7-4.8-10.7-10.7zM176 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm176 16c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z"/></svg>
                      </div>
                      <div>
                        <div class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Application id</div>
                        <div class="text-sm font-semibold text-gray-800">{req.id}</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 py-2">
                      <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" class="w-5 h-5 text-indigo-600" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg>
                      </div>
                      <div>
                        <div class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Requested Hostel</div>
                        <div class="text-sm font-semibold text-gray-800">{req.requestedHostel}</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 py-2">
                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" className='w-5 h-5 text-indigo-600' height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/></svg>
                    </div>
                      <div>
                        <div class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Reason</div>
                        <div class="text-sm font-semibold text-gray-800">{req.reason}</div>
                      </div>
                    </div>
                  </div>
                  {/* <p className='mt-2'>Approval Timestamp: {request.approvalTimestamp}</p> */}
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