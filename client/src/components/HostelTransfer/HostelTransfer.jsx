import React, { useContext } from 'react';
import HostelTransferStudent from './HostelTransferStudent';
import HostelTransferAdmin from './admin/HostelTransferAdmin';
import { RoleContext } from '../../context/Rolecontext';
import { FaUtensils } from 'react-icons/fa';

function HostelTransfer() {
  const { role } = useContext(RoleContext);

  const Header = () => (
    <div className="">
        <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-6">
            Hostel Transfer
            <div className="w-16 h-1 bg-indigo-500 mx-auto mt-2 rounded-full"></div>
        </h1>
    </div>
  );

  const Unauthorized = () => (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto mt-10 text-center">
      <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-4">You don't have permission to access the Hostel Transfer System.</p>
      <div className="bg-gray-100 py-2 px-4 rounded-md inline-block">
        <span className="text-sm font-medium text-gray-700">Current role: </span>
        <span className="text-sm font-bold text-blue-600">{role || 'None'}</span>
      </div>
    </div>
  );

  if (role === 'student') {
    return (
      <div className="container mx-auto p-6">
        <Header />
        <div className="container mx-auto px-4">
          <HostelTransferStudent />
        </div>
      </div>
    );
  } else if (role === 'nonAcadAdmin') {
    return (
      <div className="container mx-auto p-6">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <HostelTransferAdmin />
        </div>
      </div>
    );
  } else {
    return (
      <div className="container mx-auto p-6">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Unauthorized />
        </div>
      </div>
    );
  }
}

export default HostelTransfer;