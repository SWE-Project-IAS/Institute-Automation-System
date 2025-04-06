import React from 'react';
import { FaTimesCircle, FaEdit } from 'react-icons/fa';

const ViewApplication = ({ application, onClose, onManage }) => {
    const renderPassportApplication = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <InfoField label="Application Type" value="Passport" />
                <InfoField label="Mode" value={application.mode} />
                <InfoField label="Place of Birth" value={application.placeOfBirth} />
                <InfoField label="Current Semester" value={application.semester} />
                <InfoField label="Father's Name" value={application.fathersName} />
                <InfoField label="Mother's Name" value={application.mothersName} />
                <InfoField label="Programme" value={application.programme} />
                <InfoField label="Hostel" value={application.hostelName} />
                <InfoField label="Room No" value={application.roomNo} />
                <InfoField label="Contact Number" value={application.contactNumber} />
                
                {application.mode === 'tatkal' && (
                    <div className="col-span-2">
                        <InfoField label="Tatkal Reason" value={application.tatkalReason} />
                    </div>
                )}
                
                {application.travelPlans === 'yes' && (
                    <>
                        <div className="col-span-2">
                            <InfoField label="Travel Details" value={application.travelDetails} />
                        </div>
                        <InfoField label="From Date" value={application.fromDate} />
                        <InfoField label="To Date" value={application.toDate} />
                    </>
                )}
            </div>
        </div>
    );

    const renderBonafideApplication = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <InfoField label="Application Type" value="Bonafide" />
                <InfoField label="Purpose" value={application.certificateFor} />
                <InfoField label="Current Semester" value={application.currentSemester} />
                <InfoField label="Father's Name" value={application.fatherName} />
                <InfoField label="Enrolled Year" value={application.enrolledYear} />
                <InfoField label="Programme" value={application.programme} />
                <InfoField label="Department" value={application.department} />
                <InfoField label="Hostel" value={application.hostel} />
                <InfoField label="Room No" value={application.roomNo} />
                <InfoField label="Date of Birth" value={application.dateOfBirth} />
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                        <p className="text-sm text-gray-500">Submitted on {application.submittedDate}</p>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={onManage}
                            className="btn btn-primary btn-sm"
                        >
                            <FaEdit /> Manage
                        </button>
                        <button 
                            onClick={onClose}
                            className="btn btn-ghost btn-sm"
                        >
                            <FaTimesCircle />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {/* Student Information */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">Student Information</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <InfoField label="Name" value={application.studentName} />
                            <InfoField label="Roll No" value={application.rollNo} />
                            <InfoField label="Department" value={application.department} />
                            <InfoField label="Email" value={application.email} />
                        </div>
                    </div>

                    {/* Application Details */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">Application Details</h3>
                        {application.type === 'passport' 
                            ? renderPassportApplication() 
                            : renderBonafideApplication()
                        }
                    </div>

                    {/* Status Timeline */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">Status Timeline</h3>
                        <div className="space-y-4">
                            {application.comments.map((comment, index) => (
                                <div key={index} className="flex gap-4 items-start">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                                    <div>
                                        <p className="text-sm text-gray-600">{comment.text}</p>
                                        <p className="text-xs text-gray-400">
                                            {comment.date} by {comment.by}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoField = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
    </div>
);

export default ViewApplication;
