import React, { useContext } from 'react';
import StudentSubscriptionForm from './StudentSubscriptionForm';
import AdminSubscriptionRequests from './AdminSubscriptionRequests';
import { RoleContext } from '../../context/Rolecontext';
import { FaUtensils } from 'react-icons/fa';
import './styles/Mess.css';

function Mess() {
  const { role } = useContext(RoleContext);

  const Header = () => (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center">
        <FaUtensils className="text-white text-2xl mr-3" />
        <h1 className="text-2xl font-bold text-white">Mess Subscription System</h1>
      </div>
    </nav>
  );

  const Unauthorized = () => (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto mt-10 text-center">
      <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-4">You don't have permission to access the Mess Subscription System.</p>
      <div className="bg-gray-100 py-2 px-4 rounded-md inline-block">
        <span className="text-sm font-medium text-gray-700">Current role: </span>
        <span className="text-sm font-bold text-blue-600">{role || 'None'}</span>
      </div>
    </div>
  );

  if (role === 'student') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <StudentSubscriptionForm />
        </div>
      </div>
    );
  } else if (role === 'nonAcadAdmin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <AdminSubscriptionRequests />
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Unauthorized />
        </div>
      </div>
    );
  }
}

export default Mess;