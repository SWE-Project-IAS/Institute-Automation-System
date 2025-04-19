import React, { useState, useEffect } from 'react';
import newRequest from '../../utils/newRequest';

const FeedbackAdmin = () => {
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const res = await newRequest.get('/feedback/admin/status');
        setIsActive(res.data.isActive);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load feedback status.');
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleToggle = async () => {
    try {
      setSaving(true);
      setError('');
      const res = await newRequest.post('/feedback/admin/set', { 
        active: !isActive 
      });
      setIsActive(res.data.isActive);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update feedback status.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        <span className="ml-4 text-gray-600 text-lg">Loading status...</span>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-16 mb-8">
      <h1 className="text-3xl font-bold mb-6 text-pink-700">Global Feedback Control</h1>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-pink-50 rounded-lg p-6 mb-6">
        <div>
          <span className="text-lg font-semibold text-gray-800">
            Feedback is currently:{' '}
            <span className={isActive ? "text-green-600" : "text-red-600"}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </span>
        </div>
        
        <button
          className={`mt-4 md:mt-0 px-6 py-2 rounded font-semibold transition-colors ${
            isActive 
              ? "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300" 
              : "bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300"
          }`}
          onClick={handleToggle}
          disabled={saving}
        >
          {saving
            ? (isActive ? 'Deactivating...' : 'Activating...')
            : (isActive ? 'Deactivate Feedback' : 'Activate Feedback')}
        </button>
      </div>

      <p className="text-gray-600 text-sm mt-2">
        This will {isActive ? 'disable' : 'enable'} feedback collection for <b>all courses</b> across the platform.
      </p>
    </div>
  );
};

export default FeedbackAdmin;