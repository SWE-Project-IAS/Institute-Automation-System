import React, { useState, useMemo } from "react";
import { FaEye, FaEdit, FaFileExport, FaCheck, FaTimes } from "react-icons/fa";

const ApplicationsList = ({ onSelect, onView }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    date: "all",
    search: "",
  });

  const { filteredApps, applications } = useMemo(() => {
    const mockApplications = [
      {
        id: 1,
        type: "passport",
        studentName: "John Doe",
        rollNo: "220103045",
        submittedDate: "2024-03-15",
        status: "pending",
        department: "Computer Science",
        semester: "6",
        comments: [
          { text: "Documents verified", date: "2024-03-16", by: "Admin" },
        ],
      },
      {
        id: 2,
        type: "bonafide",
        studentName: "Jane Smith",
        rollNo: "220103046",
        submittedDate: "2024-03-14",
        status: "approved",
        department: "Mechanical",
        semester: "4",
        comments: [
          { text: "Purpose verified", date: "2024-03-14", by: "Admin" },
          { text: "Approved", date: "2024-03-15", by: "HOD" },
        ],
      },
      {
        id: 3,
        type: "passport",
        studentName: "Mike Johnson",
        rollNo: "220103047",
        submittedDate: "2024-03-13",
        status: "rejected",
        department: "Electrical",
        semester: "5",
        comments: [
          { text: "Missing documents", date: "2024-03-14", by: "Admin" },
        ],
      },
      // Add more sample applications...
    ];

    const filtered = mockApplications.filter((app) => {
      const matchesType = filters.type === "all" || app.type === filters.type;
      const matchesStatus =
        filters.status === "all" || app.status === filters.status;
      const matchesSearch =
        app.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
        app.rollNo.includes(filters.search);

      return matchesType && matchesStatus && matchesSearch;
    });

    return { filteredApps: filtered, applications: mockApplications };
  }, [filters]);

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for IDs:`, selectedItems);
    // Handle bulk actions here
  };

  const handleExport = () => {
    // Export logic here
    console.log("Exporting filtered applications:", filteredApps);
  };

  return (
    <div className="p-6">
      {/* Enhanced Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1">
            <label className="text-sm text-gray-600">Search</label>
            <input
              type="text"
              placeholder="Search by name, roll no, or ID..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
          <div className="w-48 space-y-1">
            <label className="text-sm text-gray-600">Type</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              <option value="all">All Types</option>
              <option value="passport">Passport</option>
              <option value="bonafide">Bonafide</option>
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
          <button
            onClick={handleExport}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <FaFileExport /> Export
          </button>
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

      {/* Table */}
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
                Submitted
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comments
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredApps.map((app) => (
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
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                      app.type === "passport"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {app.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {app.studentName}
                    </span>
                    {/* <span className="text-sm text-gray-500">{app.rollNo}</span> */}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    {/* <span className="font-medium text-gray-900">
                      {app.studentName}
                    </span> */}
                    <span className="text-sm text-gray-500">{app.rollNo}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{app.submittedDate}</td>
                <td className="px-4 py-3">
                  <span
                    className={`badge ${
                      app.status === "approved"
                        ? "badge-success"
                        : app.status === "rejected"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-3">{app.department}</td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-600">
                    {app.comments.length} comments
                  </div>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsList;
