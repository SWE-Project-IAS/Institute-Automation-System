import React from 'react';

const ApprovedRequests = ({ requests }) => {
  if (requests.length === 0) {
    return (
      <div className="card bg-base-100 shadow border border-base-200 rounded-lg text-center text-gray-500 py-4">
        No approved requests.
      </div>
    );
  }

  return (
    <div className='card bg-base-100 shadow border border-base200 p-6 rounded-lg'>
      {requests.map(request => (
        <div key={request.id} className="mb-4 shadow-sm p-4 border rounded bg-green-100">
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
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" class="w-5 h-5 text-indigo-600" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
                </svg>
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
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Old Hostel</div>
                <div class="text-sm font-semibold text-gray-800">{request.currentHostel}</div>
              </div>
            </div>
            <div class="flex items-center space-x-3 py-2">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" class="w-5 h-5 text-indigo-600" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg>
              </div>
              <div>
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Newly Allocated Hostel</div>
                <div class="text-sm font-semibold text-gray-800">{request.requestedHostel}</div>
              </div>
            </div>
          </div>
          {/* <p className='mt-2'>Approval Timestamp: {request.approvalTimestamp}</p> */}
        </div>
      ))}
    </div>
  );
};

export default ApprovedRequests;