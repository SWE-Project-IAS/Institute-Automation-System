import React, { useState, useEffect } from 'react';
import newRequest from '../../utils/newRequest';

const AcadAdmin = () => {
  // Feedback state
  const [isFeedbackActive, setIsFeedbackActive] = useState(false);
  const [feedbackEndDate, setFeedbackEndDate] = useState('');
  
  // Course Drop state
  const [isDropActive, setIsDropActive] = useState(false);
  const [dropEndDate, setDropEndDate] = useState('');
  
  // Course Registration state
  const [isRegistrationActive, setIsRegistrationActive] = useState(false);
  const [registrationEndDate, setRegistrationEndDate] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [dateErrors, setDateErrors] = useState({
    feedback: '',
    drop: '',
    registration: '',
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        
        // Fetch feedback status
        const feedbackRes = await newRequest.get('/feedback/admin/status');
        setIsFeedbackActive(feedbackRes.data.isActive);
        if (feedbackRes.data.endDate) {
          const date = new Date(feedbackRes.data.endDate);
          setFeedbackEndDate(date.toISOString().split('T')[0]);
        }
        
        // Fetch course drop status
        const dropRes = await newRequest.get('/acadadmin/course-drop/status');
        setIsDropActive(dropRes.data.data.isActive);
        console.log(dropRes.data.data);
        if (dropRes.data.data.endDate) {
          const date = new Date(dropRes.data.data.endDate);
          setDropEndDate(date.toISOString().split('T')[0]);
        }
        
        // Fetch course registration status
        const regRes = await newRequest.get('/acadadmin/course-registration/status');
        setIsRegistrationActive(regRes.data.data.isActive);
        if (regRes.data.endDate) {
          const date = new Date(regRes.data.data.endDate);
          setRegistrationEndDate(date.toISOString().split('T')[0]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load status information.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatus();
  }, []);

  const validateDate = (date, type) => {
    if (!date) {
      setDateErrors(prev => ({...prev, [type]: 'End date is required to activate'}));
      return false;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      setDateErrors(prev => ({...prev, [type]: 'End date must be in the future'}));
      return false;
    }

    setDateErrors(prev => ({...prev, [type]: ''}));
    return true;
  };

  const handleFeedbackToggle = async () => {
    if (!isFeedbackActive && !validateDate(feedbackEndDate, 'feedback')) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      const res = await newRequest.post('/feedback/admin/set', {
        active: !isFeedbackActive,
        endDate: feedbackEndDate
      });
      setIsFeedbackActive(res.data.isActive);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update feedback status.');
    } finally {
      setSaving(false);
    }
  };

  const handleDropToggle = async () => {
    if (!isDropActive && !validateDate(dropEndDate, 'drop')) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      const res = await newRequest.post('/acadadmin/course-drop/set', {
        active: !isDropActive,
        endDate: dropEndDate
      });
      setIsDropActive(res.data.data.isActive);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update course drop status.');
    } finally {
      setSaving(false);
    }
  };

  const handleRegistrationToggle = async () => {
    if (!isRegistrationActive && !validateDate(registrationEndDate, 'registration')) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      const res = await newRequest.post('/acadadmin/course-registration/set', {
        active: !isRegistrationActive,
        endDate: registrationEndDate
      });
      setIsRegistrationActive(res.data.data.isActive);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update course registration status.');
    } finally {
      setSaving(false);
    }
  };

  const handleDateChange = (e, type, setterFunction) => {
    setterFunction(e.target.value);
    if (dateErrors[type]) {
      validateDate(e.target.value, type);
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
      <h1 className="text-3xl font-bold mb-6 text-pink-700">Academic System Controls</h1>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
      
      <div className="space-y-6">
        {/* Feedback Control Section */}
        <div className="bg-pink-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-pink-700">Course Feedback</h2>
          <div className="mb-4">
            <span className="text-lg font-semibold text-gray-800">
              Status:{' '}
              <span className={isFeedbackActive ? "text-green-600" : "text-red-600"}>
                {isFeedbackActive ? 'Active' : 'Inactive'}
              </span>
            </span>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="feedbackEndDate">
              End Date
            </label>
            <input
              type="date"
              id="feedbackEndDate"
              className={`shadow appearance-none border ${dateErrors.feedback ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              value={feedbackEndDate}
              onChange={(e) => handleDateChange(e, 'feedback', setFeedbackEndDate)}
              disabled={isFeedbackActive}
              min={new Date().toISOString().split('T')[0]}
            />
            {dateErrors.feedback && <p className="text-red-500 text-xs italic mt-1">{dateErrors.feedback}</p>}
          </div>
          
          <button
            className={`w-full px-4 py-2 rounded font-semibold transition-colors ${
              isFeedbackActive
                ? "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300"
                : "bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300"
            }`}
            onClick={handleFeedbackToggle}
            disabled={saving || (!isFeedbackActive && !feedbackEndDate)}
          >
            {saving && isFeedbackActive === !isFeedbackActive
              ? 'Updating...'
              : (isFeedbackActive ? 'Deactivate Feedback' : 'Activate Feedback')}
          </button>
          
          <p className="text-gray-600 text-xs mt-2">
            {isFeedbackActive 
              ? `Active until ${new Date(feedbackEndDate).toLocaleDateString()}` 
              : 'Enable feedback collection for all courses'}
          </p>
        </div>

        {/* Course Drop Control Section */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Course Drop Period</h2>
          <div className="mb-4">
            <span className="text-lg font-semibold text-gray-800">
              Status:{' '}
              <span className={isDropActive ? "text-green-600" : "text-red-600"}>
                {isDropActive ? 'Active' : 'Inactive'}
              </span>
            </span>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dropEndDate">
              End Date
            </label>
            <input
              type="date"
              id="dropEndDate"
              className={`shadow appearance-none border ${dateErrors.drop ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              value={dropEndDate}
              onChange={(e) => handleDateChange(e, 'drop', setDropEndDate)}
              disabled={isDropActive}
              min={new Date().toISOString().split('T')[0]}
            />
            {dateErrors.drop && <p className="text-red-500 text-xs italic mt-1">{dateErrors.drop}</p>}
          </div>
          
          <button
            className={`w-full px-4 py-2 rounded font-semibold transition-colors ${
              isDropActive
                ? "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300"
                : "bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300"
            }`}
            onClick={handleDropToggle}
            disabled={saving || (!isDropActive && !dropEndDate)}
          >
            {saving && isDropActive === !isDropActive
              ? 'Updating...'
              : (isDropActive ? 'Deactivate Course Drop' : 'Activate Course Drop')}
          </button>
          
          <p className="text-gray-600 text-xs mt-2">
            {isDropActive 
              ? `Active until ${new Date(dropEndDate).toLocaleDateString()}` 
              : 'Enable course drop period for students'}
          </p>
        </div>

        {/* Course Registration Control Section */}
        {/* <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-green-700">Course Registration Period</h2>
          <div className="mb-4">
            <span className="text-lg font-semibold text-gray-800">
              Status:{' '}
              <span className={isRegistrationActive ? "text-green-600" : "text-red-600"}>
                {isRegistrationActive ? 'Active' : 'Inactive'}
              </span>
            </span>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="registrationEndDate">
              End Date
            </label>
            <input
              type="date"
              id="registrationEndDate"
              className={`shadow appearance-none border ${dateErrors.registration ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              value={registrationEndDate}
              onChange={(e) => handleDateChange(e, 'registration', setRegistrationEndDate)}
              disabled={isRegistrationActive}
              min={new Date().toISOString().split('T')[0]}
            />
            {dateErrors.registration && <p className="text-red-500 text-xs italic mt-1">{dateErrors.registration}</p>}
          </div>
          
          <button
            className={`w-full px-4 py-2 rounded font-semibold transition-colors ${
              isRegistrationActive
                ? "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300"
                : "bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300"
            }`}
            onClick={handleRegistrationToggle}
            disabled={saving || (!isRegistrationActive && !registrationEndDate)}
          >
            {saving && isRegistrationActive === !isRegistrationActive
              ? 'Updating...'
              : (isRegistrationActive ? 'Deactivate Registration' : 'Activate Registration')}
          </button>
          
          <p className="text-gray-600 text-xs mt-2">
            {isRegistrationActive 
              ? `Active until ${new Date(registrationEndDate).toLocaleDateString()}` 
              : 'Enable course registration period for students'}
          </p>
        </div> */}
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Admin Notes:</h3>
        <ul className="list-disc list-inside text-gray-600 text-sm">
          <li>Activating any period will make it available to all students in the system</li>
          <li>End dates cannot be modified once a period is activated</li>
          <li>Each period can be controlled independently of the others</li>
          <li>Students will only be able to perform actions when the respective period is active</li>
        </ul>
      </div>
    </div>
  );
};

export default AcadAdmin;