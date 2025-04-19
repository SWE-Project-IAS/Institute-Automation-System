// studentsubscriptionform.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { FaUtensils, FaExchangeAlt, FaCheck, FaTimes, FaInfoCircle, FaHistory, FaSpinner } from 'react-icons/fa';
import './styles/StudentSubscriptionForm.css'; 
import newRequest from '../../utils/newRequest'; 


const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};


const StudentSubscriptionForm = () => {
  const [currentPlan, setCurrentPlan] = useState('None');
  const [newPlan, setNewPlan] = useState(''); 
  const [pendingRequest, setPendingRequest] = useState(null);

  const [requestHistory, setRequestHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true); 


  const fetchData = useCallback(async () => {
    setIsLoadingInfo(true);
    setHistoryLoading(true);
    setError('');
    setHistoryError('');

    try {
      // Fetch current subscription and pending request
      const infoResponse = await newRequest.get('/hostel/mess/subscription'); // No ID needed, uses auth token
      if (infoResponse.data) {
        const { subscription, pendingRequest: pending } = infoResponse.data;
        setCurrentPlan(subscription?.currentPlan || 'None');
        setPendingRequest(pending || null);

        // Initialize new plan selection (avoid selecting current or pending)
        const initialNewPlan = ['Basic', 'Premium', 'Unlimited', 'None'].find(p =>
            p !== (subscription?.currentPlan || 'None') && p !== pending?.newPlan
        ) || 'Basic'; // Default to basic if all else fails
        setNewPlan(initialNewPlan);

      } else {
         setCurrentPlan('None');
         setNewPlan('Basic'); // Default if fetch fails
      }
    } catch (err) {
      console.error("Error fetching subscription info:", err);
      setError('Failed to fetch your current meal plan status. Please try again later.');
      setCurrentPlan('None'); // Default on error
      setNewPlan('Basic'); // Default on error
    } finally {
        setIsLoadingInfo(false);
    }

    // Fetch request history
    try {
        const historyResponse = await newRequest.get('/hostel/mess/requests/history'); // New endpoint
        setRequestHistory(historyResponse.data || []);
    } catch (err) {
         console.error("Error fetching request history:", err);
         setHistoryError('Failed to load your meal plan request history.');
         setRequestHistory([]); // Set empty on error
    } finally {
        setHistoryLoading(false);
    }
  }, []); // No dependencies, runs once on mount

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Run fetchData on mount

  // Handler for submitting a new request
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (currentPlan === newPlan) {
      setError('Current plan and new plan cannot be the same.');
      return;
    }
    if (!newPlan) {
        setError('Please select a new meal plan to request.');
        return;
    }
    if (pendingRequest) {
      setError('You already have a pending meal plan change request.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Payload only needs the newPlan, backend gets user ID from token
      const payload = { newPlan };
      const response = await newRequest.post('/hostel/mess/subscribe', payload);

      setSuccess('Meal plan change request submitted successfully! It is now pending approval.');
      // Refresh data to show the new pending request and updated history
      fetchData();

    } catch (err) {
      console.error("Submission Error:", err);
      const errorMessage = err.response?.data?.message || 'Failed to submit request. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get display text for plan
  const getPlanDisplayText = (plan) => {
    switch (plan) {
      case 'Basic': return 'Basic (10 meals/week)';
      case 'Premium': return 'Premium (19 meals/week)';
      case 'Unlimited': return 'Unlimited (24/7 access)';
      case 'None': return 'None (No meal plan)';
      default: return plan || 'N/A';
    }
  };

   // Helper for status badge styling
  const getStatusClass = (status) => {
    switch (status) {
        case 'Approved': return 'bg-green-100 text-green-800';
        case 'Rejected': return 'bg-red-100 text-red-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };


  // --- Render Logic ---

  if (isLoadingInfo) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
         <FaSpinner className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading your meal plan information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* --- Request Form Section --- */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <FaUtensils className="mr-2" /> Meal Plan Change Request
          </h2>
        </div>

        <form onSubmit={handleCreateRequest} className="p-6 space-y-6">
          {/* Error/Success Messages */}
          {error && (
             <div className="bg-red-50 border-l-4 border-red-500 p-4">
                 <p className="text-sm text-red-700 flex items-center"><FaTimes className="mr-2"/> {error}</p>
             </div>
          )}
          {success && (
             <div className="bg-green-50 border-l-4 border-green-500 p-4">
                 <p className="text-sm text-green-700 flex items-center"><FaCheck className="mr-2"/> {success}</p>
             </div>
          )}

          {/* Pending Request Info */}
          {pendingRequest && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
               <p className="text-sm text-yellow-700 flex items-center">
                <FaInfoCircle className="mr-2 flex-shrink-0" />
                 <span><strong>Pending Request:</strong> Your request to change to <strong>{getPlanDisplayText(pendingRequest.newPlan)}</strong> submitted on {formatDate(pendingRequest.createdAt)} is currently being processed. You cannot submit another request until this one is resolved.</span>
               </p>
            </div>
          )}

          {/* Current Plan Display */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Current Plan</label>
            <div className="p-4 border rounded-md bg-gray-50">
              <div className="font-medium text-gray-900">{getPlanDisplayText(currentPlan)}</div>
              <p className="text-sm text-gray-500 mt-1">Your currently active meal plan.</p>
            </div>
          </div>

          {/* New Plan Selection */}
          <div>
             <div className="flex items-center mb-2">
               <label className="block text-gray-700 font-medium">Request Change To</label>
               <FaExchangeAlt className="ml-2 text-blue-500" />
             </div>
            {/* Disable selection if there's a pending request */}
            <fieldset disabled={!!pendingRequest || isSubmitting}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {['None', 'Basic', 'Premium', 'Unlimited'].map((plan) => (
                        <label
                            key={plan}
                            className={`
                                flex items-center p-3 border rounded-md cursor-pointer transition-all text-sm
                                ${newPlan === plan ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:bg-gray-50'}
                                ${currentPlan === plan ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
                                ${pendingRequest || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <input
                                type="radio"
                                value={plan}
                                checked={newPlan === plan}
                                onChange={() => setNewPlan(plan)}
                                disabled={currentPlan === plan || !!pendingRequest || isSubmitting}
                                className="sr-only" // Hide actual radio, style the label
                                aria-label={`Select plan: ${getPlanDisplayText(plan)}`}
                            />
                            <div className="ml-2 flex flex-col">
                                <span className="font-medium text-gray-900">{plan}</span>
                                <span className="text-xs text-gray-500">{getPlanDisplayText(plan).split('(')[1]?.replace(')', '') || 'No meals'}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </fieldset>
             {currentPlan !== 'None' && newPlan === 'None' && (
                <p className="text-xs text-yellow-600 mt-2">Warning: Selecting 'None' will cancel your current meal plan if approved.</p>
             )}
          </div>

          {/* Important Notice */}
          <div className="border-t border-gray-200 pt-4">
             <p className="text-sm text-gray-600">
                <strong>Important:</strong> Plan changes are subject to admin approval and typically processed within 2-3 business days. Check the history below for updates.
             </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`
                px-6 py-2 bg-blue-600 text-white rounded-md font-medium
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:ring-offset-2 transition-all flex items-center justify-center
                ${isSubmitting ? 'opacity-75 cursor-wait' : ''}
                ${currentPlan === newPlan || !newPlan || !!pendingRequest ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={isSubmitting || currentPlan === newPlan || !newPlan || !!pendingRequest}
            >
              {isSubmitting ? <><FaSpinner className="animate-spin mr-2"/> Submitting...</> : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>

        {/* --- Request History Section --- */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-100 px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FaHistory className="mr-2" /> Request History
                </h3>
            </div>
            <div className="p-6">
                {historyLoading && (
                     <div className="text-center py-4">
                        <FaSpinner className="animate-spin h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Loading history...</p>
                     </div>
                )}
                {historyError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                        <p className="text-sm text-red-700 flex items-center"><FaTimes className="mr-2"/> {historyError}</p>
                    </div>
                )}
                {!historyLoading && !historyError && requestHistory.length === 0 && (
                    <p className="text-gray-500 text-center py-4">You haven't submitted any meal plan change requests yet.</p>
                )}
                {!historyLoading && !historyError && requestHistory.length > 0 && (
                    <ul className="space-y-4">
                        {requestHistory.map((req) => (
                            <li key={req._id} className="border rounded-md p-4 bg-gray-50">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                                    <p className="text-sm font-medium text-gray-700">
                                        Request to change from <span className="font-semibold">{getPlanDisplayText(req.currentPlan)}</span> to <span className="font-semibold">{getPlanDisplayText(req.newPlan)}</span>
                                    </p>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(req.status)} mt-2 sm:mt-0`}>
                                        {req.status}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 space-y-1">
                                    <p>Submitted: {formatDate(req.createdAt)}</p>
                                    {req.processedAt && <p>Processed: {formatDate(req.processedAt)}</p>}
                                    {req.status === 'Rejected' && req.rejectionReason && (
                                        <p className="text-red-600">Reason: {req.rejectionReason}</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    </div>
  );
};

export default StudentSubscriptionForm;