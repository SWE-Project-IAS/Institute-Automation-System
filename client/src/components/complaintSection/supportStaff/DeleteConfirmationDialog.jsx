import React from "react";

/**
 * Confirmation dialog component for delete operations
 * @param {Object} props Component props
 * @param {Object} props.staff - The support staff data to be deleted
 * @param {function} props.onConfirm - Function to call when delete is confirmed
 * @param {function} props.onCancel - Function to cancel the delete operation
 * @returns {JSX.Element} The rendered component
 */
const DeleteConfirmationDialog = ({ staff, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="bg-red-50 p-4 border-b border-red-100">
                    <h3 className="text-lg font-semibold text-red-700">Confirm Deletion</h3>
                </div>

                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <svg
                            className="h-8 w-8 text-red-600 mr-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <p className="text-gray-700">
                            Are you sure you want to delete the support staff member <span className="font-bold">{staff.name}</span>?
                        </p>
                    </div>

                    <p className="text-sm text-gray-500 mb-6">This action cannot be undone. All information associated with this staff member will be permanently removed.</p>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onConfirm(staff._id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition-colors font-medium"
                        >
                            Delete Staff
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationDialog;
