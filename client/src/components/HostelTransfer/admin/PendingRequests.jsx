import React, { useState } from 'react';

const PendingRequests = ({ requests, handleAction }) => {
  const [rejectionReasons, setRejectionReasons] = useState({});

  const handleLocalReasonChange = (id, value) => {
    setRejectionReasons(prev => ({ ...prev, [id]: value }));
  };

  if (requests.length === 0) {
    return (
      <div className="card bg-base-100 shadow border border-base-200 rounded-lg text-center text-gray-500 py-4">
        No pending requests.
      </div>
    );
  }

  return (
    <div className='card bg-base-100 shadow border border-base-200 p-6 rounded-lg'>
      {requests.map(request => (
        <div key={request.id} className="border rounded-lg bg-gray-100 shadow-sm mb-4 p-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            <div class="flex items-center space-x-3 py-2">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center border border-indigo-200 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" class="w-8 h-5 text-indigo-600" height="1em" width="1em">
                <path d="M0 96l576 0c0-35.3-28.7-64-64-64L64 32C28.7 32 0 60.7 0 96zm0 32L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-288L0 128zM64 405.3c0-29.5 23.9-53.3 53.3-53.3l117.3 0c29.5 0 53.3 23.9 53.3 53.3c0 5.9-4.8 10.7-10.7 10.7L74.7 416c-5.9 0-10.7-4.8-10.7-10.7zM176 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm176 16c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z"/></svg>
              </div>
              <div>
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Application Id</div>
                <div class="text-sm font-semibold text-gray-800">{request.id}</div>
              </div>
            </div>
            <div class="flex items-center space-x-3 py-2">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" class="w-5 h-5 text-indigo-600" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M336 0H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM144 32h96c8.8 0 16 7.2 16 16s-7.2 16-16 16h-96c-8.8 0-16-7.2-16-16s7.2-16 16-16zm48 128c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64 28.7-64 64-64zm112 236.8c0 10.6-10 19.2-22.4 19.2H102.4C90 416 80 407.4 80 396.8v-19.2c0-31.8 30.1-57.6 67.2-57.6h5c12.3 5.1 25.7 8 39.8 8s27.6-2.9 39.8-8h5c37.1 0 67.2 25.8 67.2 57.6v19.2z"></path></svg>
              </div>
              <div>
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Roll No</div>
                <div class="text-sm font-semibold text-gray-800">{request.rollNo}</div>
              </div>
            </div>
            <div class="flex items-center space-x-3 py-2">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" class="w-5 h-5 text-indigo-600" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg>
              </div>
              <div>
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Current Hostel</div>
                <div class="text-sm font-semibold text-gray-800">{request.currentHostel}</div>
              </div>
            </div>
            <div class="flex items-center space-x-3 py-2">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" class="w-5 h-5 text-indigo-600" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg>
              </div>
              <div>
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Requested Hostel</div>
                <div class="text-sm font-semibold text-gray-800">{request.requestedHostel}</div>
              </div>
            </div>
            <div class="flex items-center space-x-3 py-2">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" className='w-5 h-5 text-indigo-600' height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/></svg>
              </div>
              <div>
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Reason for Transfer</div>
                <div class="text-sm font-semibold text-gray-800">{request.reason}</div>
              </div>
            </div>
            <div class="flex items-center space-x-3 py-2">
            </div>
            <div className='flex justify-left mt-2'>
              <button
                onClick={() => handleAction(request.id, "Approved", "",request.requestedHostel, request.rollNo)}
                // onClick={() => console.log(request.id)}
                className="bg-green-500 max-h-10 shadow-sm text-white px-3 py-2 rounded mr-4 hover:scale-105 transition duration-200"
              >
                Approve
              </button>
              <button
                onClick={() => handleLocalReasonChange(request.id, '')}
                className="bg-red-500 max-h-10 shadow-sm text-white px-4 py-2 rounded hover:scale-105 transition duration-200"
              >
                Reject
              </button>
            </div>
            {rejectionReasons.hasOwnProperty(request.id) && (
                <div className="mt-2">
                  <textarea
                    value={rejectionReasons[request.id]}
                    onChange={(e) => handleLocalReasonChange(request.id, e.target.value)}
                    placeholder="Enter reason for rejection"
                    className="w-full shadow-sm border border-gray-300 rounded p-2 mb-2"
                  />
                  <button
                    onClick={() => {
                      const newReason = rejectionReasons[request.id];
                      // console.log(newReason);
                      handleAction(request.id, "Rejected", newReason, "", request.rollNo);
                    }}
                    className="bg-red-500 shadow-sm text-white px-4 py-2 rounded hover:scale-105 transition duration-200"
                  >
                    Submit Rejection
                  </button>
                </div>
              )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingRequests;