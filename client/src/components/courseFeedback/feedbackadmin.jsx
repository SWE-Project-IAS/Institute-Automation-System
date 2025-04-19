import React, { useState, useEffect } from 'react';
import newRequest from '../../utils/newRequest';

const FeedbackAdmin = () => {
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const res = await newRequest.get('/feedback/admin/status');
        setIsActive(res.data.isActive);
        if (res.data.endDate) {
          // Format date to YYYY-MM-DD for input field
          const date = new Date(res.data.endDate);
          setEndDate(date.toISOString().split('T')[0]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load feedback status.');
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const validateDate = () => {
    if (!endDate) {
      setDateError('End date is required to activate feedback');
      return false;
    }

    const selectedDate = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      setDateError('End date must be in the future');
      return false;
    }

    setDateError('');
    return true;
  };

  const handleToggle = async () => {
    // If currently inactive and trying to activate, validate the date
    if (!isActive && !validateDate()) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      const res = await newRequest.post('/feedback/admin/set', {
        active: !isActive,
        endDate: endDate
      });
      setIsActive(res.data.isActive);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update feedback status.');
    } finally {
      setSaving(false);
    }
  };

  const handleDateChange = (e) => {
    setEndDate(e.target.value);
    if (dateError) {
      validateDate();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        <span className="ml-4 text-gray-600 text-lg">Loading status...</span>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-16 mb-8">
      <h1 className="text-3xl font-bold mb-6 text-pink-700">Global Feedback Control</h1>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
      
      <div className="flex flex-col bg-pink-50 rounded-lg p-6 mb-6">
        <div className="mb-4">
          <span className="text-lg font-semibold text-gray-800">
            Feedback is currently:{' '}
            <span className={isActive ? "text-green-600" : "text-red-600"}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </span>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
            Feedback End Date
          </label>
          <input
            type="date"
            id="endDate"
            className={`shadow appearance-none border ${dateError ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            value={endDate}
            onChange={handleDateChange}
            disabled={isActive} // Can only set date when inactive
            min={new Date().toISOString().split('T')[0]} // Prevent past dates
          />
          {dateError && <p className="text-red-500 text-xs italic mt-1">{dateError}</p>}
          <p className="text-gray-600 text-xs mt-1">
            {isActive 
              ? "End date cannot be modified while feedback is active." 
              : "Set the date when the feedback period will end."}
          </p>
        </div>
        
        <button
          className={`px-6 py-2 rounded font-semibold transition-colors ${
            isActive
              ? "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300"
              : "bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300"
          }`}
          onClick={handleToggle}
          disabled={saving || (!isActive && !endDate)}
        >
          {saving
            ? (isActive ? 'Deactivating...' : 'Activating...')
            : (isActive ? 'Deactivate Feedback' : 'Activate Feedback')}
        </button>
      </div>
      
      <p className="text-gray-600 text-sm mt-2">
        {isActive 
          ? `Feedback is active and will be available until ${new Date(endDate).toLocaleDateString()}.` 
          : 'This will enable feedback collection for all courses across the platform.'}
      </p>
    </div>
  );
};

export default FeedbackAdmin;