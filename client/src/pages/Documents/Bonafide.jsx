
import React, { useState } from 'react';
import DocumentLayout from '../../components/documentSection/DocumentLayout';
import {
  FaUser, FaIdBadge, FaUserTie, FaCalendarAlt, FaGraduationCap, FaBook, FaHome, FaDoorOpen, FaBirthdayCake, FaChartLine, FaFileAlt, FaInfoCircle, FaListAlt, FaPlus
} from "react-icons/fa";

const BonafidePage = () => {
  const initialFormData = {
    currentSemester: '',
    certificateFor: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState('application');

  const studentInfo = [
    { label: "Name", value: "JOHN SMITH DOE", icon: FaUser },
    { label: "Roll No", value: "220103045", icon: FaIdBadge },
    { label: "Son of / Daughter of", value: "ROBERT JAMES DOE", icon: FaUserTie },
    { label: "Enrolled Year", value: "2022", icon: FaCalendarAlt },
    { label: "Programme", value: "BTech", icon: FaGraduationCap },
    { label: "Department", value: "Dept. of Mechanical Engineering", icon: FaBook },
    { label: "Hostel", value: "Kameng", icon: FaHome },
    { label: "Room No", value: "A-123", icon: FaDoorOpen },
    { label: "Date of Birth", value: "2003-08-25", icon: FaBirthdayCake },
  ];

  const certificateReasons = [
    'Bank Account Opening',
    'Passport Application',
    'Visa Application',
    'Education Loan',
    'Scholarship Application',
    'Other'
  ];

  const [statusData] = useState([
    {
      applicationDate: '2025-03-05',
      certificateFor: 'Bank Account Opening',
      otherDetails: 'No additional docs required',
      currentStatus: 'Under Review'
    },
    {
      applicationDate: '2025-03-10',
      certificateFor: 'Visa Application',
      otherDetails: 'Pending Dean approval',
      currentStatus: 'Approved'
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...studentInfo, ...formData });
    alert('Application Submitted (Simulated)');
  };

  const InfoDisplay = ({ label, value, icon: Icon }) => (
    <div className="flex items-center space-x-3 py-2">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm">
        <Icon className="w-5 h-5 text-indigo-600" />
      </div>
      <div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">{label}</div>
        <div className="text-sm font-semibold text-gray-800">{value}</div>
      </div>
    </div>
  );

  const renderApplicationForm = () => (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="card border rounded-lg shadow-sm">
        <div className="card-body flex-row items-center space-x-4 p-4">
          <FaFileAlt className="w-10 h-10 text-indigo-600" />
          <div>
            <h2 className="card-title text-lg font-bold text-gray-800">Bonafide Certificate Application</h2>
            <p className="text-xs text-gray-500">FORM NO. CERTI/01 | *Please verify your information below</p>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow border border-base-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700 border-b pb-3">
          <FaGraduationCap className="w-6 h-6 mr-2 text-indigo-600" /> Student Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          {studentInfo.map((item, index) => (
            <InfoDisplay key={index} label={item.label} value={item.value} icon={item.icon} />
          ))}
        </div>
      </div>

      <div className="card bg-base-100 shadow border border-base-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-5 flex items-center text-gray-700 border-b pb-3">
          <FaInfoCircle className="w-6 h-6 mr-2 text-blue-600" /> Additional Details Required
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control w-full">
            <label className="label pb-1">
              <span className="label-text font-semibold flex items-center text-sm text-gray-600">
                <FaChartLine className="w-4 h-4 mr-2 text-gray-400" /> Current Semester
              </span>
            </label>
            <select
              name="currentSemester"
              className="select select-bordered w-full focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={formData.currentSemester}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select Semester...</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label pb-1">
              <span className="label-text font-semibold flex items-center text-sm text-gray-600">
                <FaFileAlt className="w-4 h-4 mr-2 text-gray-400" /> Certificate For
              </span>
            </label>
            <select
              name="certificateFor"
              className="select select-bordered w-full focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={formData.certificateFor}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select Purpose...</option>
              {certificateReasons.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          className="px-6 py-2 rounded-lg text-primary-content shadow-md btn btn-outline hover:bg-base-300 hover:outline hover:outline-black"
          onClick={() => setFormData(initialFormData)}
        >
          Reset Form
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg text-primary-content shadow-md btn btn-primary hover:outline hover:outline-black"
        >
          Submit Application
        </button>
      </div>
    </form>
  );

  const renderStatus = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-2xl md:text-3xl font-bold text-indigo-600 flex items-center">
          <FaListAlt className="w-7 h-7 mr-3" /> Application Status History
        </h3>
        <div className="text-sm font-medium text-gray-600 bg-base-200 px-3 py-1 rounded-full">
          Total Applications: {statusData.length}
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-base-200">
        <table className="w-full table-auto">
          <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 text-left">
            <tr>
              {["Sl.", "Date", "Purpose", "Details", "Current Status"].map((header) => (
                <th key={header} className="px-6 py-4 text-xs font-semibold text-indigo-800 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {statusData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500 italic">
                  <FaInfoCircle className="inline w-5 h-5 mr-2" /> No applications found.
                </td>
              </tr>
            ) : (
              statusData.map((row, index) => (
                <tr key={index} className="hover:bg-indigo-50/50 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{index + 1}.</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                    {row.applicationDate}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                      {row.certificateFor}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={row.otherDetails}>
                    {row.otherDetails || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap
                      ${row.currentStatus.toLowerCase() === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'}
                    `}>
                      {row.currentStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <DocumentLayout title="Bonafide Certificate">
      <div className="mb-8 flex justify-center sm:justify-start">
        <div className="inline-flex rounded-lg p-1 shadow-inner space-x-1 border border-indigo-200">
          <button
            className={`flex items-center px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50
              ${activeTab === 'application'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-md'
                : 'text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800'}`}
            onClick={() => setActiveTab('application')}
          >
            <FaPlus className="w-4 h-4 mr-2" /> New Application
          </button>
          <button
            className={`flex items-center px-5 py-2.5 shadow rounded-md text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50
              ${activeTab === 'status'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-md'
                : 'text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800'}`}
            onClick={() => setActiveTab('status')}
          >
            <FaListAlt className="w-4 h-4 mr-2" /> Application Status
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-base-200 min-h-[400px]">
        {activeTab === 'application' ? renderApplicationForm() : renderStatus()}
      </div>
    </DocumentLayout>
  );
};

export default BonafidePage;

