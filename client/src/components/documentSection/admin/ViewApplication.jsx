import React from 'react';
import { FaTimesCircle, FaEdit } from 'react-icons/fa';
import { useQuery } from "@tanstack/react-query";
import newRequest from '../../../utils/newRequest';
import { toast } from 'react-hot-toast';

const ViewApplication = ({ application, onClose, onManage }) => {
    // Fetch detailed application data
    const { data: details, isLoading, error } = useQuery({
        queryKey: ['application-details', application.id],
        queryFn: () => newRequest.get(`/acadAdmin/documents/applications/${application.id}`)
            .then(res => res.data),
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Error fetching application details');
        }
    });

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-xl">
                    Loading application details...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-xl text-red-500">
                    Error loading application details. Please try again.
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                        <p className="text-sm text-gray-500">Application #{application.id}</p>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={onManage}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Manage Application"
                        >
                            <FaEdit className="text-gray-500" />
                        </button>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FaTimesCircle className="text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex justify-center">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
                            ${details.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                            details.status === 'Rejected' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                            'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                            {details.status.charAt(0).toUpperCase() + details.status.slice(1)}
                        </span>
                    </div>

                    {/* Student Information */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold">Student Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium">{details.studentDetails?.name}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Roll Number</p>
                                <p className="font-medium">{details.studentDetails?.rollNo}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Department</p>
                                <p className="font-medium">{details.studentDetails?.department}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Program</p>
                                <p className="font-medium">{details.studentDetails?.program}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{details.studentDetails?.email}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Contact Number</p>
                                <p className="font-medium">{details.studentDetails?.contactNumber || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Batch</p>
                                <p className="font-medium">{details.studentDetails?.batch}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Current Semester</p>
                                <p className="font-medium">{details.studentDetails?.semester}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Hostel</p>
                                <p className="font-medium">{details.studentDetails?.hostelName}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Room Number</p>
                                <p className="font-medium">{details.studentDetails?.roomNo}</p>
                            </div>
                            {details.documentType === 'Passport' && (
                                <>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">Father's Name</p>
                                        <p className="font-medium">{details.studentDetails?.fathersName}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">Mother's Name</p>
                                        <p className="font-medium">{details.studentDetails?.mothersName}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">Date of Birth</p>
                                        <p className="font-medium">{details.studentDetails?.dateOfBirth ? new Date(details.studentDetails.dateOfBirth).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'N/A'}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    {/* Document Details */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold">Document Details</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm text-gray-500">Document Type</dt>
                                    <dd className="font-medium capitalize">{details.documentType}</dd>
                                </div>
                                {details.documentType === 'Bonafide' ? (
                                    <>
                                        <div>
                                            <dt className="text-sm text-gray-500">Purpose</dt>
                                            <dd className="font-medium">{details.details?.purpose || 'N/A'}</dd>
                                        </div>
                                        {details.details?.purpose === 'Other' && (
                                            <div>
                                                <dt className="text-sm text-gray-500">Other Reason</dt>
                                                <dd className="font-medium">{details.details?.otherReason || 'N/A'}</dd>
                                            </div>
                                        )}
                                        <div>
                                            <dt className="text-sm text-gray-500">Current Semester</dt>
                                            <dd className="font-medium">{details.details?.currentSemester || 'N/A'}</dd>
                                        </div>
                                    </>
                                ) : details.documentType === 'Passport' && (
                                    <>
                                        <div>
                                            <dt className="text-sm text-gray-500">Application Type</dt>
                                            <dd className="font-medium capitalize">{details.details?.applicationType || 'N/A'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm text-gray-500">Place of Birth</dt>
                                            <dd className="font-medium">{details.details?.placeOfBirth || 'N/A'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm text-gray-500">Current Semester</dt>
                                            <dd className="font-medium">{details.details?.semester || 'N/A'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm text-gray-500">Mode</dt>
                                            <dd className="font-medium capitalize">{details.details?.mode || 'N/A'}</dd>
                                        </div>
                                        {details.details?.mode === 'tatkal' && (
                                            <div>
                                                <dt className="text-sm text-gray-500">Tatkal Reason</dt>
                                                <dd className="font-medium">{details.details?.tatkalReason || 'N/A'}</dd>
                                            </div>
                                        )}
                                        <div>
                                            <dt className="text-sm text-gray-500">Travel Plans</dt>
                                            <dd className="font-medium capitalize">{details.details?.travelPlans || 'No'}</dd>
                                        </div>
                                        {details.details?.travelPlans === 'yes' && (
                                            <>
                                                <div>
                                                    <dt className="text-sm text-gray-500">Travel Details</dt>
                                                    <dd className="font-medium">{details.details?.travelDetails || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm text-gray-500">Travel Period</dt>
                                                    <dd className="font-medium">
                                                        {details.details?.fromDate && details.details?.toDate ? (
                                                            `${new Date(details.details.fromDate).toLocaleDateString()} - ${new Date(details.details.toDate).toLocaleDateString()}`
                                                        ) : 'N/A'}
                                                    </dd>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </dl>
                        </div>
                    </section>
                    
                    {/* Approval History */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold">Approval History</h3>
                        <div className="space-y-3">
                            {details.approvalDetails?.remarks?.map((remark, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-900">{remark}</p>
                                    <div className="mt-2 text-sm text-gray-500">
                                        By: {details.approvalDetails.approvedBy?.name || 'Admin'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ViewApplication;
