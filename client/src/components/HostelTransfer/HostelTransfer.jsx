import React, { useEffect, useState } from 'react';

const HostelTransfer = (props) => {
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

  const gender = "boy";
  useEffect(() => {
    const filteredHostels = allHostels[gender].filter(hostel => hostel !== currentHostel);
    setAvailableHostels(filteredHostels);
  }, [currentHostel, gender]);

  const handleTransferRequest = async () => {
    setRequestPending(true);
    setResponseStatus('');
    setResponseMessage('');
    setRequestTimestamp(new Date().toLocaleString());

    try {
      const response = await fetch('/api/hostel-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hostel: selectedHostel, reason }),
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
    <div className="max-w-md my-2 mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Hostel Transfer</h1>
      <p className="text-gray-700 mb-4">Current Hostel: {currentHostel}</p>

      {requestPending && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-4">
          <p>Current request is pending...</p>
          <p>Request Timestamp: {requestTimestamp}</p>
        </div>
      )}

      {availableHostels.length > 0 && !requestPending && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Select a Hostel</h2>
          <select
            onChange={(e) => setSelectedHostel(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mb-4"
          >
            <option value="">Select</option>
            {availableHostels.map((hostel, index) => (
              <option key={index} value={hostel}>{hostel}</option>
            ))}
          </select>
          <div className="mb-4">
            <label htmlFor="reason" className="block font-semibold mb-1">Reason for Transfer:</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter your reason for the hostel change request"
              className="w-full border border-gray-300 rounded p-2 resize-none min-h-[80px]"
            />
          </div>
          <button
            onClick={handleTransferRequest}
            disabled={requestPending} // Disable button if request is pending
            className={`w-full py-2 rounded transition duration-200 ${
              requestPending ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {requestPending ? 'Submitting...' : 'Submit Transfer Request'}
          </button>
        </div>
      )}

{responseStatus && (
        <div className={`mt-4 p-4 rounded ${responseStatus === 'Approved' ? 'bg-green-100 text-green-800' : responseStatus === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
          <h2 className="font-semibold">Status: {responseStatus}</h2>
          <p>{responseMessage}</p>
        </div>
      )}
    </div>

  );
};

export default HostelTransfer;