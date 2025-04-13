import React, { useState } from 'react';
import DocumentLayout from '../../components/documentSection/DocumentLayout';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { toast } from 'react-hot-toast';
import {
  FaUser, FaIdBadge, FaUserTie, FaCalendarAlt, FaGraduationCap, FaBook, FaHome, FaDoorOpen, FaBirthdayCake, FaChartLine, FaFileAlt, FaInfoCircle, FaListAlt, FaPlus, FaExclamationCircle
} from "react-icons/fa";

const BonafidePage = () => {
  const initialFormData = {
    currentSemester: '',
    certificateFor: '',
    otherReason: ''  // Add new field
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({}); // Add form errors state
  const [activeTab, setActiveTab] = useState('application');
  const queryClient = useQueryClient();
  
  // Get user data from localStorage
  const {data:userData} = JSON.parse(localStorage.getItem("currentUser"));
  const {userId} = userData.user;

  // Fetch student data
  const { isLoading, error, data: studentData } = useQuery({
    queryKey: [`bonafide-${userId}`],
    queryFn: () =>
      newRequest.get(`/student/${userId}/bonafide`).then((res) => res.data),
  });

  // Fetch application history
  const { data: applications = [] } = useQuery({
    queryKey: ['bonafide-applications'],
    queryFn: () =>
      newRequest.get(`/student/${userId}/bonafide/applications`).then((res) => res.data),
  });

  // Create bonafide application mutation
  const createApplication = useMutation({
    mutationFn: (formData) => {
      return newRequest.post(`/student/${userId}/bonafide/apply`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['bonafide-applications']);
      toast.success('Bonafide application submitted successfully');
      setFormData(initialFormData);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error submitting application');
    },
  });

  // Show loading or error states
  if (isLoading) {
    return (
      <DocumentLayout title="Bonafide Certificate">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading student information...</p>
          </div>
        </div>
      </DocumentLayout>
    );
  }

  if (error) {
    return (
      <DocumentLayout title="Bonafide Certificate">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading student information. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </DocumentLayout>
    );
  }

  const studentInfo = [
    { label: "Name", value: studentData?.name || "Loading...", icon: FaUser },
    { label: "Roll No", value: studentData?.rollNo || "Loading...", icon: FaIdBadge },
    { label: "Son of / Daughter of", value: studentData?.fatherName || "Loading...", icon: FaUserTie },
    { label: "Enrolled Year", value: studentData?.enrolledYear || "Loading...", icon: FaCalendarAlt },
    { label: "Programme", value: studentData?.program || "Loading...", icon: FaGraduationCap },
    { label: "Department", value: studentData?.department || "Loading...", icon: FaBook },
    { label: "Hostel", value: studentData?.hostel || "Loading...", icon: FaHome },
    { label: "Room No", value: studentData?.roomNo || "Loading...", icon: FaDoorOpen },
    { label: "Date of Birth", value: studentData?.dateOfBirth ? new Date(studentData.dateOfBirth).toLocaleDateString() : "Loading...", icon: FaBirthdayCake },
  ];

  const certificateReasons = [
    'Bank Account Opening',
    'Passport Application',
    'Visa Application',
    'Education Loan',
    'Scholarship Application',
    'Other'
  ];

  const validateForm = () => {
    const errors = {};
    
    if (!formData.currentSemester) {
      errors.currentSemester = 'Please select a semester';
    }
    
    if (!formData.certificateFor) {
      errors.certificateFor = 'Please select a purpose';
    }
    
    if (formData.certificateFor === 'Other' && !formData.otherReason?.trim()) {
      errors.otherReason = 'Please specify the reason';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Clear otherReason if certificateFor is not "Other"
      ...(name === 'certificateFor' && value !== 'Other' ? { otherReason: '' } : {})
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Send the form data with otherReason as a separate field
      const submissionData = {
        currentSemester: formData.currentSemester,
        certificateFor: formData.certificateFor,
        otherReason: formData.certificateFor === 'Other' ? formData.otherReason : undefined
      };
      createApplication.mutate(submissionData);
    }
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
              className={`select select-bordered w-full focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                formErrors.currentSemester ? 'border-red-500' : ''
              }`}
              value={formData.currentSemester}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select Semester...</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            {formErrors.currentSemester && (
              <label className="label">
                <span className="label-text-alt text-red-500">{formErrors.currentSemester}</span>
              </label>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label pb-1">
              <span className="label-text font-semibold flex items-center text-sm text-gray-600">
                <FaFileAlt className="w-4 h-4 mr-2 text-gray-400" /> Certificate For
              </span>
            </label>
            <select
              name="certificateFor"
              className={`select select-bordered w-full focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                formErrors.certificateFor ? 'border-red-500' : ''
              }`}
              value={formData.certificateFor}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select Purpose...</option>
              {certificateReasons.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
            {formErrors.certificateFor && (
              <label className="label">
                <span className="label-text-alt text-red-500">{formErrors.certificateFor}</span>
              </label>
            )}
          </div>

          {/* Conditional Other Reason Text Input */}
          {formData.certificateFor === 'Other' && (
            <div className="form-control w-full md:col-span-2">
              <label className="label pb-1">
                <span className="label-text font-semibold flex items-center text-sm text-gray-600">
                  <FaFileAlt className="w-4 h-4 mr-2 text-gray-400" /> Please Specify Reason
                </span>
              </label>
              <input
                type="text"
                name="otherReason"
                className={`input input-bordered w-full focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                  formErrors.otherReason ? 'border-red-500' : ''
                }`}
                value={formData.otherReason}
                onChange={handleInputChange}
                placeholder="Enter your specific reason for the certificate"
                required
              />
              {formErrors.otherReason && (
                <label className="label">
                  <span className="label-text-alt text-red-500">{formErrors.otherReason}</span>
                </label>
              )}
            </div>
          )}
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
          Total Applications: {applications.length}
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
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500 italic">
                  <FaInfoCircle className="inline w-5 h-5 mr-2" /> No applications found.
                </td>
              </tr>
            ) : (
              applications.map((app, index) => (
                <tr key={index} className="hover:bg-indigo-50/50 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{index + 1}.</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                    {new Date(app.applicationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                      {app.certificateFor}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={app.remarks}>
                    {app.remarks || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap
                      ${app.currentStatus.toLowerCase() === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : app.currentStatus.toLowerCase() === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'}
                    `}>
                      {app.currentStatus}
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

