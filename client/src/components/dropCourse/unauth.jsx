import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const Unauthorized = ({ role }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <div className="flex flex-col items-center text-center">
        <div className="bg-red-100 p-3 rounded-full mb-4">
          <FaExclamationTriangle className="text-red-500 text-2xl" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        
        <p className="text-gray-600 mb-4">
          You don't have permission to access this page.
        </p>
        
        <div className="bg-gray-100 p-3 rounded-md w-full mb-4">
          <p className="text-sm text-gray-500 mb-1">Current role:</p>
          <p className="font-medium text-gray-700">{role || 'None'}</p>
        </div>
        
        <a 
          href="/" 
          className="bg-blue-500 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-600 transition duration-300"
        >
          Return to Homepage
        </a>
      </div>
    </div>
  </div>
);

export default Unauthorized;