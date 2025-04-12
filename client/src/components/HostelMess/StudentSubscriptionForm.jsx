import React, { useState } from 'react';
import { FaUtensils, FaExchangeAlt, FaCheck, FaTimes } from 'react-icons/fa';
import './styles/StudentSubscriptionForm.css';

const StudentSubscriptionForm = () => {
  const [studentId, setStudentId] = useState('');
  const [currentPlan, setCurrentPlan] = useState('Basic (10 meals/week)');
  const [newPlan, setNewPlan] = useState('Premium (19 meals/week)');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStudentId = (id) => {
    const studentIdRegex = /^\d{8}$/;
    return studentIdRegex.test(id);
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!validateStudentId(studentId)) {
      setError('Invalid Student ID. Must be exactly 8 digits');
      setIsSubmitting(false);
      return;
    }

    if (currentPlan === newPlan) {
      setError('Current plan and new plan cannot be the same');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call with a timeout
    setTimeout(() => {
      setSuccess('Meal plan change request submitted successfully! You will be notified when your request is processed.');
      setStudentId('');
      setCurrentPlan('Basic (10 meals/week)');
      setNewPlan('Premium (19 meals/week)');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <FaUtensils className="mr-2" /> Student Meal Plan Change Request
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
                const value = e.target.value.slice(0, 8);
                setStudentId(value);
              }}
              placeholder="Enter 8-digit Student ID"
              required 
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Must be exactly 8 digits</p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Current Plan</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label 
                className={`
                  flex items-center p-4 border rounded-md cursor-pointer transition-all
                  ${currentPlan === 'Basic (10 meals/week)' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:bg-gray-50'}
                `}
              >
                <input 
                  type="radio" 
                  value="Basic (10 meals/week)"
                  checked={currentPlan === 'Basic (10 meals/week)'}
                  onChange={() => setCurrentPlan('Basic (10 meals/week)')}
                  className="sr-only"
                />
                <div className="ml-2">
                  <div className="font-medium text-gray-900">Basic</div>
                  <div className="text-sm text-gray-500">10 meals/week</div>
                </div>
              </label>
              
              <label 
                className={`
                  flex items-center p-4 border rounded-md cursor-pointer transition-all
                  ${currentPlan === 'Premium (19 meals/week)' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:bg-gray-50'}
                `}
              >
                <input 
                  type="radio" 
                  value="Premium (19 meals/week)"
                  checked={currentPlan === 'Premium (19 meals/week)'}
                  onChange={() => setCurrentPlan('Premium (19 meals/week)')}
                  className="sr-only"
                />
                <div className="ml-2">
                  <div className="font-medium text-gray-900">Premium</div>
                  <div className="text-sm text-gray-500">19 meals/week</div>
                </div>
              </label>
              
              <label 
                className={`
                  flex items-center p-4 border rounded-md cursor-pointer transition-all
                  ${currentPlan === 'Unlimited (24/7 access)' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:bg-gray-50'}
                `}
              >
                <input 
                  type="radio" 
                  value="Unlimited (24/7 access)"
                  checked={currentPlan === 'Unlimited (24/7 access)'}
                  onChange={() => setCurrentPlan('Unlimited (24/7 access)')}
                  className="sr-only"
                />
                <div className="ml-2">
                  <div className="font-medium text-gray-900">Unlimited</div>
                  <div className="text-sm text-gray-500">24/7 access</div>
                </div>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <label className="block text-gray-700 font-medium">New Plan</label>
              <FaExchangeAlt className="ml-2 text-blue-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label 
                className={`
                  flex items-center p-4 border rounded-md cursor-pointer transition-all
                  ${newPlan === 'Basic (10 meals/week)' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:bg-gray-50'}
                `}
              >
                <input 
                  type="radio" 
                  value="Basic (10 meals/week)"
                  checked={newPlan === 'Basic (10 meals/week)'}
                  onChange={() => setNewPlan('Basic (10 meals/week)')}
                  className="sr-only"
                />
                <div className="ml-2">
                  <div className="font-medium text-gray-900">Basic</div>
                  <div className="text-sm text-gray-500">10 meals/week</div>
                </div>
              </label>
              
              <label 
                className={`
                  flex items-center p-4 border rounded-md cursor-pointer transition-all
                  ${newPlan === 'Premium (19 meals/week)' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:bg-gray-50'}
                `}
              >
                <input 
                  type="radio" 
                  value="Premium (19 meals/week)"
                  checked={newPlan === 'Premium (19 meals/week)'}
                  onChange={() => setNewPlan('Premium (19 meals/week)')}
                  className="sr-only"
                />
                <div className="ml-2">
                  <div className="font-medium text-gray-900">Premium</div>
                  <div className="text-sm text-gray-500">19 meals/week</div>
                </div>
              </label>
              
              <label 
                className={`
                  flex items-center p-4 border rounded-md cursor-pointer transition-all
                  ${newPlan === 'Unlimited (24/7 access)' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:bg-gray-50'}
                `}
              >
                <input 
                  type="radio" 
                  value="Unlimited (24/7 access)"
                  checked={newPlan === 'Unlimited (24/7 access)'}
                  onChange={() => setNewPlan('Unlimited (24/7 access)')}
                  className="sr-only"
                />
                <div className="ml-2">
                  <div className="font-medium text-gray-900">Unlimited</div>
                  <div className="text-sm text-gray-500">24/7 access</div>
                </div>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="text-sm text-gray-600 mb-4">
              <p><strong>Important:</strong> Plan changes are subject to approval and typically processed within 2-3 business days.</p>
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