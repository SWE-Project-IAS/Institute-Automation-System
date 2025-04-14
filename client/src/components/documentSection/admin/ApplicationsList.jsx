import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaFileExport, FaCheck, FaTimes } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from '../../../utils/newRequest';
import { toast } from 'react-hot-toast';

const ApplicationsList = ({ onSelect, onView }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // New state for immediate search input
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    search: "",
  });

  // Debounce search input updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchInput
      }));
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const queryClient = useQueryClient();

  // Fetch applications with filters
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications', filters],
    queryFn: async () => {
      // Construct query parameters
      const queryParams = new URLSearchParams();
      
      if (filters.type !== 'all') {
        queryParams.append('type', filters.type);
      }
      if (filters.status !== 'all') {
        // Convert status to proper case before sending
        const properStatus = filters.status.charAt(0).toUpperCase() + filters.status.slice(1).toLowerCase();
        queryParams.append('status', properStatus);
      }
      if (filters.search) {
        queryParams.append('rollNo', filters.search);
      }

      const url = `/acadAdmin/documents/applications/filter?${queryParams.toString()}`;
      const response = await newRequest.get(url);
      return response.data;
    }
  });

  // Bulk status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => {
      // Convert status to proper case before sending
      const properStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      return newRequest.patch(`/acadAdmin/documents/applications/${id}/status`, {
        status: properStatus,
        remarks: `Status changed to ${properStatus}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['applications']);
      toast.success('Applications updated successfully');
      setSelectedItems([]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error updating applications');
    }
  });

  const handleBulkAction = async (action) => {
    const status = action === 'approve' ? 'approved' : 'rejected';
    await Promise.all(
      selectedItems.map(id => updateStatusMutation.mutate({ id, status }))
    );
  };

  // Transform the raw applications data
  const filteredApps = applications.map(app => ({
    id: app._id,
    type: app.documentType.toLowerCase(),
    studentName: app.studentId?.userId?.name || 'N/A',
    rollNo: app.studentId?.rollNo || 'N/A',
    submittedDate: new Date(app.createdAt).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    status: app.status,
    department: app.studentId?.department || 'N/A',
    semester: app.details?.semester || '',
    remarks: app.approvalDetails?.remarks || []
  }));

  return (
    <div className="p-6">
      {/* Enhanced Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1">
            <label className="text-sm text-gray-600">Search by Roll Number</label>
            <input
              type="text"
              placeholder="Enter roll number..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoFocus
            />
          </div>
          <div className="w-48 space-y-1">
            <label className="text-sm text-gray-600">Document Type</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              <option value="all">All Types</option>
              <option value="Bonafide">Bonafide</option>
              <option value="Passport">Passport</option>
            </select>
          </div>
          <div className="w-48 space-y-1">
            <label className="text-sm text-gray-600">Status</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
          <span className="text-blue-700">
            Selected: {selectedItems.length} applications
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction("approve")}
              className="px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
            >
              <FaCheck size={12} /> Approve
            </button>
            <button
              onClick={() => handleBulkAction("reject")}
              className="px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
            >
              <FaTimes size={12} /> Reject
            </button>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  onChange={(e) => {
                    setSelectedItems(
                      e.target.checked ? filteredApps.map((app) => app.id) : []
                    );
                  }}
                  checked={selectedItems.length === filteredApps.length && filteredApps.length > 0}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roll No
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                </td>
              </tr>
            ) : filteredApps.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                  {searchInput ? `No applications found for roll number "${searchInput}"` : 'No applications found matching the filters.'}
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedItems.includes(app.id)}
                      onChange={(e) => {
                        setSelectedItems((prev) =>
                          e.target.checked
                            ? [...prev, app.id]
                            : prev.filter((id) => id !== app.id)
                        );
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize
                      ${app.type === "passport" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                      {app.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{app.studentName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-500">{app.rollNo}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-500">{app.department}</div>
                  </td>
                  <td className="px-4 py-3">{app.submittedDate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize
                      ${app.status === "Approved"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : app.status === "Rejected"
                        ? "bg-rose-100 text-rose-800 border border-rose-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(app)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                        title="View Details"
                      >
                        <FaEye className="text-gray-500" />
                      </button>
                      <button
                        onClick={() => onSelect(app)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                        title="Manage Application"
                      >
                        <FaEdit className="text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsList;
