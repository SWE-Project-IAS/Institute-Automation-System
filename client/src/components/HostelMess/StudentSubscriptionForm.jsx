import React, { useState } from 'react';
import axios from 'axios';
import { FaUtensils, FaExchangeAlt, FaCheck, FaTimes } from 'react-icons/fa';
import './styles/StudentSubscriptionForm.css';

const createSubscriptionRequest = async (data) => {
  const response = await axios.post('/api/subscription-request', data);
  return response.data;
};

const StudentSubscriptionForm = () => {
  const [studentId, setStudentId] = useState('');
  const [currentPlan, setCurrentPlan] = useState('REGULAR');
  const [newPlan, setNewPlan] = useState('REGULAR');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStudentId = (id) => {
    const studentIdRegex = /^\d{9}$/;
    return studentIdRegex.test(id);
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!validateStudentId(studentId)) {
      setError('Invalid Student ID. Must be exactly 9 digits');
      setIsSubmitting(false);
      return;
    }

    if (currentPlan === newPlan) {
      setError('Current plan and new plan cannot be the same');
      setIsSubmitting(false);
      return;
    }

    try {
      await createSubscriptionRequest({ studentId, currentPlan, newPlan });
      setSuccess('Subscription request submitted successfully!');
      setStudentId('');
      setCurrentPlan('REGULAR');
      setNewPlan('REGULAR');
      setIsSubmitting(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
        'Failed to submit request. Please try again.';
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <FaUtensils className="mr-2" /> Student Meal Plan Request
          </h2>
        </div>
        
        <form onSubmit={handleCreateRequest} className="p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaTimes className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaCheck className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="studentId" className="block text-gray-700 font-medium mb-2">Student ID</label>
            <input 
              type="number" 
              id="studentId"
              value={studentId}
              onChange={(e) => {
                const value = e.target.value.slice(0, 9);
                setStudentId(value);
              }}
              placeholder="Enter 9-digit Student ID"
              required 
              min="100000000"
              max="999999999"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Must be exactly 9 digits</p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Current Plan</label>
            <div className="grid grid-cols-2 gap-4">
              <label 
                className={`
                  flex items-center p-4 border rounded-md cursor-pointer transition-all
                  ${currentPlan === 'REGULAR' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:bg-gray-50'}
                `}
              >
                <input 
                  type="radio" 
                  value="REGULAR"
                  checked={currentPlan === 'REGULAR'}
                  onChange={() => setCurrentPlan('REGULAR')}
                  className="sr-only"
                />
                <div className="ml-2">
                  <div className="font-medium text-gray-900">Regular Plan</div>
                  <div className="text-sm text-gray-500">Standard meal options</div>
                </div>
              </label>
              <label 
                className={`
                  flex items-center p-4 border rounded-md cursor-pointer transition-all
                  ${currentPlan === 'SPECIAL' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:bg-gray-50'}
                `}
              >
                <input 
                  type="radio" 
                  value="SPECIAL"
                  checked={currentPlan === 'SPECIAL'}
                  onChange={() => setCurrentPlan('SPECIAL')}
                  className="sr-only"
                />
                <div className="ml-2">
                  <div className="font-medium text-gray-900">Special Plan</div>
                  <div className="text-sm text-gray-500">Dietary restrictions</div>
                </div>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <label className="block text-gray-700 font-medium">New Plan</label>
              <FaExchangeAlt className="ml-2 text-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label 
                className={`
                  flex items-center p-4 border rounded-md cursor-pointer transition-all
                  ${newPlan === 'REGULAR' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:bg-gray-50'}
                `}
              >
                <input 
                  type="radio" 
                  value="REGULAR"
                  checked={newPlan === 'REGULAR'}
                  onChange={() => setNewPlan('REGULAR')}
                  className="sr-only"
                />
                <div className="ml-2">
                  <div className="font-medium text-gray-900">Regular Plan</div>
                  <div className="text-sm text-gray-500">Standard meal options</div>
                </div>
              </label>
              <label 
                className={`
                  flex items-center p-4 border rounded-md cursor-pointer transition-all
                  ${newPlan === 'SPECIAL' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:bg-gray-50'}
                `}
              >
                <input 
                  type="radio" 
                  value="SPECIAL"
                  checked={newPlan === 'SPECIAL'}
                  onChange={() => setNewPlan('SPECIAL')}
                  className="sr-only"
                />
                <div className="ml-2">
                  <div className="font-medium text-gray-900">Special Plan</div>
                  <div className="text-sm text-gray-500">Dietary restrictions</div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              className={`
                px-6 py-2 bg-blue-600 text-white rounded-md font-medium 
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:ring-offset-2 transition-all
                ${isSubmitting ? 'opacity-75 cursor-wait' : ''}
              `}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentSubscriptionForm;