import React, { useState } from 'react';
import DocumentLayout from '../../components/documentSection/DocumentLayout';
import { FaUser, FaIdBadge, FaUserTie, FaCalendarAlt, FaGraduationCap, FaBook, FaHome, FaDoorOpen, FaBirthdayCake, FaChartLine, FaFileAlt } from "react-icons/fa";

const BonafidePage = () => {
  // 1. Define your initial form data for resetting
  const initialFormData = {
    currentSemester: '',
    certificateFor: ''
  };

  // 2. Use that object in state
  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState('application');

  // Hardcoded student data (will come from backend)
  const studentInfo = [
    { label: "Name", value: "JOHN SMITH DOE", icon: <FaUser /> },
    { label: "Roll No", value: "220103045", icon: <FaIdBadge /> },
    { label: "Son of / Daughter of", value: "ROBERT JAMES DOE", icon: <FaUserTie /> },
    { label: "Enrolled Year", value: "2022", icon: <FaCalendarAlt /> },
    { label: "Programme", value: "BTech", icon: <FaGraduationCap /> },
    { label: "Department", value: "Dept. of Mechanical Engineering", icon: <FaBook /> },
    { label: "Hostel", value: "Kameng", icon: <FaHome /> },
    { label: "Room No", value: "A-123", icon: <FaDoorOpen /> },
    { label: "Date of Birth", value: "2003-08-25", icon: <FaBirthdayCake /> },
  ];

  // Hardcoded reasons for certificate
  const certificateReasons = [
    'Bank Account Opening',
    'Passport Application',
    'Visa Application',
    'Education Loan',
    'Scholarship Application',
    'Other'
  ];

  // 3. Hardcode some sample "status" data
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
    // Combine student info + form data
    console.log({ ...studentInfo, ...formData });
    // TODO: Submit to your backend or handle the data
  };

  // --- Application Form ---
  const renderApplicationForm = () => (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Form Header */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title text-m">Bonafide Certificate Application</h2>
          <p className="text-xs italic">*Please verify your information below</p>
        </div>
      </div>

      {/* Student Information Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 card bg-base-100 shadow-lg border-2 border-base-200 p-6">
        {studentInfo.map((item, index) => (
          <InfoDisplay key={index} label={item.label} value={item.value} icon={item.icon} />
        ))}
      </div>

      {/* User Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 card bg-base-100 shadow-lg border-2 border-base-200 p-6">
        {/* Current Semester Selection */}
        <div className="form-control w-full">
          <label className="label flex items-center gap-2">
            <FaChartLine className="text-blue-700" />
            <span className="label-text font-semibold">Current Semester</span>
          </label>
          <select
            name="currentSemester"
            className="select select-bordered w-full focus:outline-none focus:border-primary border-b-2"
            value={formData.currentSemester}
            onChange={handleInputChange}
          >
            <option value="">Choose Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {/* Certificate Purpose Selection */}
        <div className="form-control w-full">
          <label className="label flex items-center gap-2">
            <FaFileAlt className="text-blue-700" />
            <span className="label-text font-semibold">Certificate For</span>
          </label>
          <select
            name="certificateFor"
            className="select select-bordered w-full focus:outline-none focus:border-primary border-b-2"
            value={formData.certificateFor}
            onChange={handleInputChange}
          >
            <option value="">Choose Purpose</option>
            {certificateReasons.map(reason => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          className="px-6 py-2 rounded-lg text-primary-content shadow-md btn btn-outline hover:bg-base-300  hover:outline hover:outline-black"
          onClick={() => setFormData(initialFormData)}  // <-- Reset form
        >
          Reset
        </button>
        <button type="submit" className="px-6 py-2 rounded-lg text-primary-content shadow-md btn btn-primary  hover:outline hover:outline-black">
          Submit Application
        </button>
      </div>
    </form>
  );

  // Displays each label/value pair with an icon
  const InfoDisplay = ({ label, value, icon }) => (
    <div className="form-control flex items-center gap-4 p-3 border-b border-gray-200 md:border-none md:p-0 transition-colors duration-200 hover:bg-gray-50 rounded-md">
      <span className="text-blue-700 text-xl bg-blue-100 p-2 rounded-full">
        {icon}
      </span>
      <div>
        <label className="label">
          <span className="label-text text-xs text-gray-500">{label}</span>
        </label>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );

  // --- Status Table ---
  const renderStatus = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Passport Application Status</h3>
        <div className="text-sm text-gray-500">
          Total Applications: {statusData.length}
        </div>
      </div>
  
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-primary text-primary-content">
            <tr>
              {[
                'Sl. No.',
                'Application Date', 
                'Applied For', 
                'Other Details', 
                'Current Status'
              ].map((header, index) => (
                <th 
                  key={index} 
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {statusData.length === 0 ? (
              <tr>
                <td 
                  colSpan="5" 
                  className="text-center py-6 text-gray-500 italic"
                >
                  No applications found
                </td>
              </tr>
            ) : (
              statusData.map((row, index) => (
                <tr 
                  key={index} 
                  className="border-b hover:bg-base-200 transition-colors duration-200"
                >
                  <td className="px-4 py-4 text-sm font-medium">{index + 1}</td>
                  <td className="px-4 py-4 text-sm">
                    <span className="font-semibold text-gray-700">
                      {row.applicationDate}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className="bg-base-200 px-2 py-1 rounded-md text-xs">
                      {row.certificateFor}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {row.otherDetails}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`
                      text-xs px-2 py-1 rounded-full font-medium
                      ${row.currentStatus.toLowerCase() === "approved" 
                        ? "bg-green-100 text-green-800" 
                        : row.currentStatus.toLowerCase() === "under review"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"}
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
      {/* Tabs */}
      <div className="flex mb-8 bg-base-100 rounded-lg p-3 shadow-lg border border-base-200">
        <div className="inline-flex rounded-lg bg-base-200 p-1">
          <button
            className={`px-6 py-2.5 rounded-lg text-sm font-medium shadow-md transition-all duration-200 
              ${activeTab === "application" 
                ? "bg-primary text-primary-content shadow-md bg-blue-700 text-white" 
                : "hover:bg-base-300 hover:outline hover:outline-black"}`}
            onClick={() => setActiveTab("application")}
          >
            New Application
          </button>
          <button
            className={`ml-4 px-6 py-2.5 rounded-lg text-sm shadow-md font-medium transition-all duration-200 
              ${activeTab === "status" 
                ? "bg-primary text-primary-content shadow-md bg-blue-700 text-white" 
                : "hover:bg-base-300 hover:outline hover:outline-black"}`}
            onClick={() => setActiveTab("status")}
          >
            Application Status
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-base-100 rounded-lg p-6 shadow-lg border border-base-200">
        {activeTab === "application" ? renderApplicationForm() : renderStatus()}
      </div>
    </DocumentLayout>
  );
};

export default BonafidePage;