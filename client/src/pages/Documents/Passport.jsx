import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DocumentLayout from '../../components/documentSection/DocumentLayout';
import newRequest from '../../utils/newRequest';
import toast from 'react-hot-toast';
import {
    FaPassport, FaUserGraduate, FaGraduationCap, FaInfoCircle, FaRegClock,
    FaPlaneDeparture, FaCalendarAlt, FaMapMarkerAlt, FaSyncAlt,
    FaPaperPlane, FaCheckCircle, FaHourglassHalf, FaListAlt, FaPlus,
    FaUniversity, FaIdCard, FaEnvelope, FaPhone, FaHome, FaUser, FaUsers, FaCircle,
    FaBirthdayCake // Added for Date of Birth
} from 'react-icons/fa'; // Import necessary icons

const PassportPage = () => {
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

    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState({});
    const [activeTab, setActiveTab] = useState('application');
    const queryClient = useQueryClient();

    // Get user data from localStorage
    const {data:userData} = JSON.parse(localStorage.getItem("currentUser"));
    const {userId} = userData.user;

    // Fetch student data
    const { isLoading, error, data: studentData } = useQuery({
        queryKey: [`passport-${userId}`],
        queryFn: () =>
            newRequest.get(`/student/${userId}/passport`).then((res) => res.data),
    });

    // Fetch application history
    const { data: applications = [] } = useQuery({
        queryKey: ['passport-applications'],
        queryFn: () =>
            newRequest.get(`/student/${userId}/passport/applications`).then((res) => res.data),
    });

    // Add studentInfo from studentData
    const studentInfo = studentData || {};

    // Add statusData from applications
    const statusData = applications || [];

    // Validate form before submission
    const validateForm = () => {
        const errors = {};
        
        if (!formData.placeOfBirth?.trim()) {
            errors.placeOfBirth = 'Place of birth is required';
        }
        
        if (!formData.semester) {
            errors.semester = 'Please select your current semester';
        }

        if (formData.mode === 'tatkal' && !formData.tatkalReason?.trim()) {
            errors.tatkalReason = 'Reason for tatkal application is required';
        }

        if (formData.travelPlans === 'yes') {
            if (!formData.travelDetails?.trim()) {
                errors.travelDetails = 'Travel details are required';
            }
            if (!formData.fromDate) {
                errors.fromDate = 'From date is required';
            }
            if (!formData.toDate) {
                errors.toDate = 'To date is required';
            }
            if (formData.fromDate && formData.toDate && new Date(formData.toDate) <= new Date(formData.fromDate)) {
                errors.toDate = 'To date must be after from date';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Create passport application mutation
    const createApplication = useMutation({
        mutationFn: (formData) => {
            return newRequest.post(`/student/${userId}/passport/apply`, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['passport-applications']);
            setFormData(initialFormData);
            setFormErrors({});
            toast.success('Passport application submitted successfully');
            setActiveTab('status');
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Error submitting application');
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            createApplication.mutate(formData);
        }
    };

    // Apply gradient style to text
    const gradientTextStyle = "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-700";

    // --- Reusable Info Display Component (NEW STYLE) ---
    const InfoDisplay = ({ label, value, icon: Icon }) => (
        <div className="flex items-center space-x-3 py-2"> {/* Main container for icon + text */}
            {/* Icon Circle - Styled like the image */}
            {Icon && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm">
                    <Icon className="w-5 h-5 text-indigo-600" />
                </div>
            )}
            {/* Text Content */}
            <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">{label}</div>
                <div className="text-sm font-semibold text-gray-800">{value}</div>
            </div>
        </div>
    );


    // --- Application Form Rendering ---
    const renderApplicationForm = () => (
        <form onSubmit={handleSubmit} className="space-y-10">
            {/* Form Header - Enhanced */}
            <div className="card   border rounded-lg shadow-sm">
                <div className="card-body flex-row items-center space-x-4 p-4">
                    <FaPassport className={`w-10 h-10 ${gradientTextStyle}`} />
                    <div>
                        <h2 className="card-title text-lg font-bold text-gray-800">Passport Certificate Application</h2>
                        <p className="text-xs text-gray-500">FORM NO. CERTI/02 |<br></br>*Please fill in CAPITAL letters</p>
                    </div>
                </div>
            </div>

            {/* Application Type - Enhanced */}
            <div className="card bg-base-100 shadow border border-base-200 p-6 rounded-lg">
                <label className="label mb-3">
                    <span className="label-text text-base font-semibold flex items-center text-gray-700">
                        <FaInfoCircle className="w-5 h-5 mr-2 text-blue-600" /> Type of Passport Application
                    </span>
                </label>
                <div className="flex flex-col sm:flex-row sm:gap-4 space-y-2 sm:space-y-0">
                    {['fresh', 'renewal'].map(type => (
                        <label key={type} className="label cursor-pointer gap-3 p-3 rounded-lg border border-base-300 hover:border-indigo-400 hover:bg-indigo-50 transition duration-150 ease-in-out">
                            <input
                                type="radio"
                                name="applicationType"
                                // Apply gradient to checked radio using custom CSS potentially or DaisyUI primary color
                                className="radio radio-primary checked:bg-indigo-600 border-gray-300"
                                value={type}
                                checked={formData.applicationType === type}
                                onChange={handleInputChange}
                            />
                            <span className="label-text font-medium text-sm text-gray-700">
                                {type === 'fresh' ? 'Fresh Passport' : 'Renewal of Passport'}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Student Information Display - Using New InfoDisplay Style */}
            <div className="card bg-base-100 shadow border border-base-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700 border-b pb-3">
                    <FaUserGraduate className="w-6 h-6 mr-2 text-indigo-600" /> Student Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1"> {/* Reduced gap-y */}
                    {/* Map student info using the NEW InfoDisplay component */}
                    <InfoDisplay label="Name" value={studentInfo.name} icon={FaUser} />
                    <InfoDisplay label="Roll No" value={studentInfo.rollNo} icon={FaIdCard} />
                    <InfoDisplay label="Programme" value={studentInfo.programme} icon={FaGraduationCap} />
                    <InfoDisplay label="Department" value={studentInfo.department} icon={FaUniversity} />
                    <InfoDisplay label="Date of Birth" value={studentInfo.dateOfBirth} icon={FaBirthdayCake} />
                    <InfoDisplay label="Email" value={studentInfo.email} icon={FaEnvelope} />
                    <InfoDisplay label="Contact Number" value={studentInfo.contactNumber} icon={FaPhone} />
                    <InfoDisplay label="Hostel & Room" value={`${studentInfo.hostelName} / ${studentInfo.roomNo}`} icon={FaHome} />
                    <InfoDisplay label="Father's Name" value={studentInfo.fathersName} icon={FaUsers} />
                    <InfoDisplay label="Mother's Name" value={studentInfo.mothersName} icon={FaUsers} />
                </div>
            </div>

            {/* User Input Fields - Enhanced */}
            <div className="card bg-base-100 shadow border border-base-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-5 flex items-center text-gray-700 border-b pb-3">
                    <FaInfoCircle className="w-6 h-6 mr-2 text-blue-600" /> Additional Details Required
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Semester Selection */}
                    <div className="form-control w-full">
                        <label className="label pb-1">
                            <span className="label-text font-semibold flex items-center text-sm text-gray-600">
                                <FaUniversity className="w-4 h-4 mr-2 text-gray-400" /> Current Semester
                            </span>
                        </label>
                        <select
                            name="semester"
                            className="select select-bordered w-full focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            value={formData.semester}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" disabled>Select Semester...</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                        {formErrors.semester && <p className="text-red-500 text-xs mt-1">{formErrors.semester}</p>}
                    </div>

                    {/* Place of Birth */}
                    <div className="form-control w-full">
                        <label className="label pb-1">
                            <span className="label-text font-semibold flex items-center text-sm text-gray-600">
                                <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-400" /> Place of Birth (As per documents)
                            </span>
                        </label>
                        <input
                            type="text"
                            name="placeOfBirth"
                            className="input input-bordered w-full focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            value={formData.placeOfBirth}
                            onChange={handleInputChange}
                            placeholder="e.g., New Delhi"
                            required
                        />
                        {formErrors.placeOfBirth && <p className="text-red-500 text-xs mt-1">{formErrors.placeOfBirth}</p>}
                    </div>
                </div>
            </div>

            {/* Mode Selection - Enhanced */}
            <div className="card bg-base-100 shadow border border-base-200 p-6 rounded-lg">
                <label className="label mb-3">
                    <span className="label-text text-base font-semibold flex items-center text-gray-700">
                        <FaRegClock className="w-5 h-5 mr-2 text-blue-600" /> Mode of Passport Application
                    </span>
                </label>
                <div className="flex flex-col sm:flex-row sm:gap-4 space-y-2 sm:space-y-0">
                    {['normal', 'tatkal'].map(mode => (
                        <label key={mode} className="label cursor-pointer gap-3 p-3 rounded-lg border border-base-300 hover:border-indigo-400 hover:bg-indigo-50 transition duration-150 ease-in-out">
                            <input
                                type="radio"
                                name="mode"
                                className="radio radio-primary checked:bg-indigo-600 border-gray-300"
                                value={mode}
                                checked={formData.mode === mode}
                                onChange={handleInputChange}
                            />
                            <span className="label-text font-medium text-sm capitalize text-gray-700">{mode}</span>
                        </label>
                    ))}
                </div>

                {/* Conditional Tatkal Reason */}
                {formData.mode === 'tatkal' && (
                    <div className="form-control w-full mt-6 pt-4 border-t border-base-200">
                        <label className="label pb-1">
                            <span className="label-text font-semibold text-orange-700 flex items-center text-sm">
                                <FaInfoCircle className="w-4 h-4 mr-2" /> Reason for Tatkal (Attach supporting document if any)
                            </span>
                        </label>
                        <textarea
                            name="tatkalReason"
                            className="textarea textarea-bordered min-h-[100px] w-full focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            value={formData.tatkalReason}
                            onChange={handleInputChange}
                            placeholder="Explain the urgency..."
                            required={formData.mode === 'tatkal'}
                        />
                        {formErrors.tatkalReason && <p className="text-red-500 text-xs mt-1">{formErrors.tatkalReason}</p>}
                    </div>
                )}
            </div>

            {/* Travel Plans - Enhanced */}
            <div className="card bg-base-100 shadow border border-base-200 p-6 rounded-lg">
                <label className="label mb-3">
                    <span className="label-text text-base font-semibold flex items-center text-gray-700">
                        <FaPlaneDeparture className="w-5 h-5 mr-2 text-blue-600" /> Travel Plans (Within next 2 months)
                    </span>
                </label>
                <div className="flex flex-col sm:flex-row sm:gap-4 space-y-2 sm:space-y-0 mb-4">
                    {['yes', 'no'].map(option => (
                        <label key={option} className="label cursor-pointer gap-3 p-3 rounded-lg border border-base-300 hover:border-indigo-400 hover:bg-indigo-50 transition duration-150 ease-in-out">
                            <input
                                type="radio"
                                name="travelPlans"
                                className="radio radio-primary checked:bg-indigo-600 border-gray-300"
                                value={option}
                                checked={formData.travelPlans === option}
                                onChange={handleInputChange}
                            />
                            <span className="label-text font-medium capitalize text-sm text-gray-700">{option}</span>
                        </label>
                    ))}
                </div>

                {/* Conditional Travel Details */}
                {formData.travelPlans === 'yes' && (
                    <div className="space-y-6 mt-6 pt-5 border-t border-base-200 animate-fade-in">
                        <div className="form-control w-full">
                            <label className="label pb-1">
                                <span className="label-text font-semibold flex items-center text-sm text-gray-600">
                                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-400" /> Place and Purpose of Visit
                                </span>
                            </label>
                            <textarea
                                name="travelDetails"
                                className="textarea textarea-bordered min-h-[100px] w-full focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                value={formData.travelDetails}
                                onChange={handleInputChange}
                                placeholder="e.g., Paris, France for Summer Internship"
                                required={formData.travelPlans === 'yes'}
                            />
                            {formErrors.travelDetails && <p className="text-red-500 text-xs mt-1">{formErrors.travelDetails}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label pb-1">
                                    <span className="label-text font-semibold flex items-center text-sm text-gray-600">
                                        <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-400" /> From Date
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    name="fromDate"
                                    className="input input-bordered w-full focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    value={formData.fromDate}
                                    onChange={handleInputChange}
                                    required={formData.travelPlans === 'yes'}
                                />
                                {formErrors.fromDate && <p className="text-red-500 text-xs mt-1">{formErrors.fromDate}</p>}
                            </div>
                            <div className="form-control">
                                <label className="label pb-1">
                                    <span className="label-text font-semibold flex items-center text-sm text-gray-600">
                                        <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-400" /> To Date
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    name="toDate"
                                    className="input input-bordered w-full focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    value={formData.toDate}
                                    onChange={handleInputChange}
                                    required={formData.travelPlans === 'yes'}
                                />
                                {formErrors.toDate && <p className="text-red-500 text-xs mt-1">{formErrors.toDate}</p>}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Submit Buttons - Enhanced */}
            <div className="flex justify-end gap-4 mt-8">
                <button
                    type="button"
                    className="px-6 py-2 rounded-lg text-primary-content shadow-md btn btn-outline hover:bg-base-300  hover:outline hover:outline-black"
                    onClick={() => setFormData(initialFormData)}
                >
                   Reset Form
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 rounded-lg text-primary-content shadow-md btn btn-primary  hover:outline hover:outline-black"
                >
                    Submit Application
                </button>
            </div>
        </form>
    );

    // --- Status Table Rendering ---
    const renderStatus = () => (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className={`text-2xl md:text-3xl font-bold ${gradientTextStyle} flex items-center`}>
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
                            {[
                                'Sl.', 'Date', 'Application Type', 'Mode', 'Remarks', 'Status'
                            ].map((header) => (
                                <th key={header} className="px-6 py-4 text-xs font-semibold text-indigo-800 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-base-200">
                        {statusData.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-gray-500 italic">
                                    <FaInfoCircle className="inline w-5 h-5 mr-2" /> No passport applications found.
                                </td>
                            </tr>
                        ) : (
                            statusData.map((row, index) => (
                                <tr key={index} className="hover:bg-indigo-50/50 transition-colors duration-150">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{index + 1}.</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                        <FaCalendarAlt className="inline w-4 h-4 mr-1.5 text-indigo-500 opacity-80" />
                                        {row.applicationDate}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap capitalize">
                                            {row.applicationType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap capitalize
                                            ${row.mode === 'tatkal' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                                            {row.mode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {Array.isArray(row.remarks) ? (
                                            <div className="max-w-xs space-y-1">
                                                {row.remarks.map((remark, idx) => (
                                                    <div key={idx} className="truncate" title={remark}>
                                                        • {remark}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">No remarks</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap capitalize
                                            ${row.currentStatus === 'Approved' 
                                                ? 'bg-green-100 text-green-800' 
                                                : row.currentStatus === 'Rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'}`}>
                                            <FaCircle className="w-1.5 h-1.5 mr-1.5" />
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

    // --- Main Component Return ---
    return (
        <DocumentLayout title="Passport Application">
            {/* Tab Navigation - Enhanced */}
            <div className="mb-8 flex justify-center sm:justify-start">
                <div className="inline-flex rounded-lg p-1 shadow-inner space-x-1 border border-indigo-200">
                    <button
                        className={`flex items-center px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50
              ${activeTab === 'application'
                                ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-md' // Gradient for active tab
                                : 'text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800'}`}
                        onClick={() => setActiveTab('application')}
                    >
                        <FaPlus className="w-4 h-4 mr-2" /> New Application
                    </button>
                    <button
                        className={`flex items-center px-5 py-2.5 shadow rounded-md text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50
              ${activeTab === 'status'
                                ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-md' // Gradient for active tab
                                : 'text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800'}`}
                        onClick={() => setActiveTab('status')}
                    >
                        <FaListAlt className="w-4 h-4 mr-2" /> Application Status
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-base-200 min-h-[400px]">
                {activeTab === 'application' ? renderApplicationForm() : renderStatus()}
            </div>

            {/* Add basic CSS for fade-in animation (optional, place in your global CSS or a <style> tag) */}
            <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        /* Optional: Style checked radio button background more precisely if DaisyUI primary doesn't match gradient */
        /* input[type="radio"].radio-primary:checked {
           background-image: linear-gradient(to right, var(--tw-gradient-stops));
           --tw-gradient-from: #4f46e5; // indigo-600
           --tw-gradient-to: #2563eb; // blue-700
           --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
           border-color: transparent; // Hide default border when checked
        } */
        /* Optional: Style radio button checkmark color */
        /* input[type="radio"].radio-primary:checked::after {
            background-color: white !important; // Ensure checkmark is visible on gradient
        } */

      `}</style>
        </DocumentLayout>
    );
};

export default PassportPage;