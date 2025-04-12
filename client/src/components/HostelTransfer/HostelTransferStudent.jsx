import React, { useEffect, useState } from 'react';

const HostelTransferStudent = (props) => {
  const allHostels = {
    boy: ['Lohit', 'Brahmaputra', 'Kapili', 'Siang', 'Disang', 'Dihing', 'Gaurang', 'Kameng', 'Barak', 'Umiam', 'Manas'],
    girl: ['Dhansiri', 'Disang Girls', 'Subhansiri'],
  };

  const [availableHostels, setAvailableHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState('');
  const [currentHostel, setCurrentHostel] = useState("Lohit"); // This should be fetched from the server or user profile
  const [requestPending, setRequestPending] = useState(false);
  const [responseStatus, setResponseStatus] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [reason, setReason] = useState('');
  const [requestTimestamp, setRequestTimestamp] = useState(null);

  // Example student data
  const studentId = '220101038';
  const studentName = 'Dipesh';

  const gender = "boy";
  useEffect(() => {
    const filteredHostels = allHostels[gender].filter(hostel => hostel !== currentHostel);
    setAvailableHostels(filteredHostels);
  }, [currentHostel, gender]);

  const handleTransferRequest = async () => {
    // Clear previous status and message
    setResponseStatus('');
    setResponseMessage('');

    // Validation: Check if both fields are filled
    if (!selectedHostel) {
      setResponseMessage('Please select a hostel.');
      return;
    }
    if (!reason.trim()) {
      setResponseMessage('Please provide a reason for the transfer.');
      return;
    }

    setRequestPending(true);
    setRequestTimestamp(new Date().toLocaleString());

    try {
      const requestData = {
        id: 2, // Example ID, this should be dynamically assigned in a real application
        studentId,
        studentName,
        currentHostel,
        requestedHostel: selectedHostel,
        reason,
      };

      const response = await fetch('/api/hostel-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      // Check if the response indicates approval
      if (response.ok && data.approved) {
        setResponseStatus('Approved');
        setResponseMessage('Transfer Approved! Room assignment updated.');
        setCurrentHostel(selectedHostel);
      } else {
        setResponseStatus('Rejected');
        setResponseMessage(data.reason || 'Transfer request rejected.');
      }
    } catch (error) {
      setResponseStatus('Error');
      setResponseMessage('An error occurred while processing your request. Please try again.');
    } finally {
      setRequestPending(false); // Reset requestPending to false
      setReason(''); // Clear the reason textbox
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      {requestPending && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-4">
          <p>Current request is pending...</p>
          <p>Request Timestamp: {requestTimestamp}</p>
        </div>
      )}

      {availableHostels.length > 0 && !requestPending && (
        <div className=''>
          <div className="flex items-center space-x-3 pt-1 pb-3 mb-2 border-b">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="w-5 h-5 text-indigo-600" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">Current Hostel</div>
              <div className="text-sm font-semibold text-gray-800">{currentHostel}</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold flex items-center text-gray-700 pb-3">Select a Hostel</h3>

          <select
            value={selectedHostel}
            onChange={(e) => setSelectedHostel(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mb-4"
          >
            <option value="">Select</option>
            {availableHostels.map((hostel, index) => (
              <option key={index} value={hostel}>{hostel}</option>
            ))}
          </select>
          <div className="mb-4">
            <label htmlFor="reason" className="text-lg font-semibold flex items-center text-gray-700 pb-3">Reason for Transfer:</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter your reason for the hostel change request"
              className="w-full border border-gray-300 rounded p-2 resize-none min-h-[80px]"
            />
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <button
              type="submit"
              onClick={handleTransferRequest}
              disabled={requestPending} // Disable button if request is pending
              className={`px-6 py-2 rounded-lg text-primary-content shadow-md btn btn-primary hover:outline hover:outline-black transition duration-200 
                ${
                requestPending ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`
              }
            >
              {requestPending ? 'Submitting...' : 'Submit Transfer Request'}
            </button>
          </div>
        </div>
      )}

      {responseMessage && !responseStatus && (
        <div className="mt-4 p-4 rounded bg-yellow-100 text-yellow-800">
          <p>{responseMessage}</p>
        </div>
      )}

      {responseStatus && (
        <div className={`mt-4 p-4 rounded ${responseStatus === 'Approved' ? 'bg-green-100 text-green-800' : responseStatus === 'Rejected' ? 'bg-red-100 text-red-800' : responseStatus === 'Error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
          <h2 className="font-semibold">Status: {responseStatus}</h2>
          <p>{responseMessage}</p>
        </div>
      )}
    </div>
  );
};

export default HostelTransferStudent;