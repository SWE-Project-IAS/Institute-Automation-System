import React, { useState } from 'react';
import DocumentLayout from '../../components/documentSection/DocumentLayout';

const PassportPage = () => {
  // 1. Define your initial form data in a single object
  const initialFormData = {
    applicationType: 'fresh',
    placeOfBirth: '',
    semester: '',
    mode: 'normal',
    tatkalReason: '',
    travelPlans: 'no',
    travelDetails: '',
    fromDate: '',
    toDate: ''
  };

  // 2. Use that object as the default state
  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState('application');

  // Hardcoded student data
  const studentInfo = {
    name: 'JOHN MICHAEL DOE',
    rollNo: '210104067',
    department: 'DEPT. OF MECHANICAL ENGINEERING',
    programme: 'BTECH',
    dateOfBirth: '2003-08-24',
    email: 'j.doe@iitg.ac.in',
    contactNumber: '9876543210',
    hostelName: 'UMIAM',
    roomNo: 'D-234',
    fathersName: 'MICHAEL JAMES DOE',
    mothersName: 'SARAH MICHAEL DOE',
  };

  // 3. Hardcode some sample status data
  const [statusData] = useState([
    {
      applicationDate: '2025-03-01',
      appliedFor: 'Fresh Passport',
      otherDetails: 'No additional docs required',
      documentStatus: 'Submitted ID proofs',
      currentStatus: 'Under Review'
    },
    {
      applicationDate: '2025-04-10',
      appliedFor: 'Renewal of Passport',
      otherDetails: 'New address proof needed',
      documentStatus: 'Documents verified',
      currentStatus: 'Approved'
    }
  ]);

  // Handle input changes for your form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...studentInfo, ...formData });
    // TODO: Submit to your backend or handle the form data as needed.
  };

  // Renders the Application Form tab
  const renderApplicationForm = () => (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Form Header */}
      <div className="card bg-base-200 border-base-300">
        <div className="card-body">
          <h2 className="card-title text-sm">FORM NO. CERTI/02</h2>
          <p className="text-xs">Application Form For Passport Related Certificates</p>
          <p className="text-xs italic">*Please fill up the form in capital letters</p>
        </div>
      </div>

      {/* Application Type */}
      <div className="form-control p-4 bg-base-100 rounded-lg border-2 border-base-200">
        <label className="label">
          <span className="label-text font-semibold">Type of Passport Application</span>
        </label>
        <div className="flex gap-6">
          {['fresh', 'renewal'].map(type => (
            <label key={type} className="label cursor-pointer gap-2">
              <input
                type="radio"
                name="applicationType"
                className="radio-primary"
                value={type}
                checked={formData.applicationType === type}
                onChange={handleInputChange}
              />
              <span className="label-text">
                {type === 'fresh' ? 'Fresh Passport' : 'Renewal of Passport'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Student Information Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 card bg-base-100 shadow-lg border-2 border-base-200 p-6">
        <InfoDisplay label="Name of Student" value={studentInfo.name} />
        <InfoDisplay label="Roll No" value={studentInfo.rollNo} />
        <InfoDisplay label="Department" value={studentInfo.department} />
        <InfoDisplay label="Programme" value={studentInfo.programme} />
        <InfoDisplay label="Date of Birth" value={studentInfo.dateOfBirth} />
        <InfoDisplay label="Email" value={studentInfo.email} />
        <InfoDisplay label="Contact Number" value={studentInfo.contactNumber} />
        <InfoDisplay label="Hostel Name" value={studentInfo.hostelName} />
        <InfoDisplay label="Room No" value={studentInfo.roomNo} />
        <InfoDisplay label="Father's Name" value={studentInfo.fathersName} />
        <InfoDisplay label="Mother's Name" value={studentInfo.mothersName} />
      </div>

      {/* User Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 card bg-base-100 shadow-lg border-2 border-base-200 p-6">
        {/* Semester Selection */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Semester</span>
          </label>
          <select
            name="semester"
            className="select select-bordered w-full border-b-2 focus:outline-none focus:border-primary"
            value={formData.semester}
            onChange={handleInputChange}
          >
            <option value="">Choose Semester</option>
            {[1,2,3,4,5,6,7,8].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {/* Place of Birth */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Place of Birth</span>
          </label>
          <input
            type="text"
            name="placeOfBirth"
            className="input w-full border-b-2 border-base-300 focus:border-primary focus:outline-none rounded-none bg-transparent"
            value={formData.placeOfBirth}
            onChange={handleInputChange}
            placeholder="Enter your place of birth"
          />
        </div>
      </div>

      {/* Mode Selection */}
      <div className="form-control p-4 bg-base-100 rounded-lg border-2 border-base-200">
        <label className="label">
          <span className="label-text font-semibold">Mode of Passport Application</span>
        </label>
        <div className="flex gap-6">
          {['normal', 'tatkal'].map(mode => (
            <label key={mode} className="label cursor-pointer gap-2">
              <input
                type="radio"
                name="mode"
                className="radio radio-primary"
                value={mode}
                checked={formData.mode === mode}
                onChange={handleInputChange}
              />
              <span className="label-text capitalize">{mode}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Conditional Tatkal Reason */}
      {formData.mode === 'tatkal' && (
        <div className="form-control w-full p-4 bg-base-100 rounded-lg border-2 border-base-200">
          <label className="label">
            <span className="label-text font-semibold">
              If Tatkal, why? (attach relevant Document)
            </span>
          </label>
          <textarea
            name="tatkalReason"
            className="textarea textarea-bordered min-h-[120px] w-full focus:outline-none focus:border-primary"
            value={formData.tatkalReason}
            onChange={handleInputChange}
            placeholder="Explain your reason for tatkal application..."
          />
        </div>
      )}

      {/* Travel Plans */}
      <div className="space-y-4 p-4 bg-base-100 rounded-lg border-2 border-base-200">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Travel plans within 2 months with destination
            </span>
          </label>
          <div className="flex gap-6">
            {['yes', 'no'].map(option => (
              <label key={option} className="label cursor-pointer gap-2">
                <input
                  type="radio"
                  name="travelPlans"
                  className="radio radio-primary"
                  value={option}
                  checked={formData.travelPlans === option}
                  onChange={handleInputChange}
                />
                <span className="label-text capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {formData.travelPlans === 'yes' && (
          <div className="space-y-4 mt-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">
                  Place and Purpose of Visit
                </span>
              </label>
              <textarea
                name="travelDetails"
                className="textarea textarea-bordered min-h-[100px] w-full focus:outline-none focus:border-primary"
                value={formData.travelDetails}
                onChange={handleInputChange}
                placeholder="Enter place and purpose of your visit..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">From Date</span>
                </label>
                <input
                  type="date"
                  name="fromDate"
                  className="input input-bordered w-full focus:outline-none focus:border-primary"
                  value={formData.fromDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">To Date</span>
                </label>
                <input
                  type="date"
                  name="toDate"
                  className="input input-bordered w-full focus:outline-none focus:border-primary"
                  value={formData.toDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          className="px-6 py-2 rounded-lg text-primary-content shadow-md btn btn-outline hover:bg-base-300"
          onClick={() => setFormData(initialFormData)} // Use initialFormData to reset
        >
          Reset
        </button>
        <button type="submit" className="px-6 py-2 rounded-lg text-primary-content shadow-md btn btn-primary">
          Submit Application
        </button>
      </div>
    </form>
  );

  // Renders each label/value pair in the Student Info display
  const InfoDisplay = ({ label, value }) => (
    <div className="form-control">
      <label className="label">
        <span className="label-text text-xs text-gray-500">{label}</span>
      </label>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );

  // Renders the Status Table (with hardcoded statusData)
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
                'Document Status', 
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
                  colSpan="6" 
                  className="text-center py-6 text-gray-500 italic"
                >
                  No passport applications found
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
                      {row.appliedFor}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {row.otherDetails}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${row.documentStatus.toLowerCase().includes('verified') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'}
                    `}>
                      {row.documentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`
                      text-xs px-2 py-1 rounded-full font-medium
                      ${row.currentStatus.toLowerCase() === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : row.currentStatus.toLowerCase() === 'under review'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'}
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
    <DocumentLayout title="Passport Application">
      <div className="flex mb-8">
        <div className="inline-flex rounded-lg bg-base-200 p-1">
          <button
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 
              ${activeTab === 'application' 
                ? 'bg-primary text-primary-content shadow-md' 
                : 'hover:bg-base-300'}`}
            onClick={() => setActiveTab('application')}
          >
            New Application
          </button>
          <button
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 
              ${activeTab === 'status' 
                ? 'bg-primary text-primary-content shadow-md' 
                : 'hover:bg-base-300'}`}
            onClick={() => setActiveTab('status')}
          >
            Application Status
          </button>
        </div>
      </div>

      <div className="bg-base-100 rounded-lg p-6 shadow-lg border border-base-200">
        {activeTab === 'application' ? renderApplicationForm() : renderStatus()}
      </div>
    </DocumentLayout>
  );
};

export default PassportPage;
