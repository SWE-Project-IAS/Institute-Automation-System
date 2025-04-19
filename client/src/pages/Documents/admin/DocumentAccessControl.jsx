import React, { useState, useEffect } from "react";
import { RoleContext } from "../../../context/Rolecontext";
import { useContext } from "react";
import newRequest from "../../../utils/newRequest";
import toast from 'react-hot-toast';

const DocumentAccessControl = () => {
  const { role, setRole } = useContext(RoleContext);
  setRole("acadAdmin");

  const [filters, setFilters] = useState({
    branch: "",
    program: "",
    semester: "",
    search: "",
  });

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [loading, setLoading] = useState(false);

  // Fetch students data
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: 10,
        ...filters
      });

      const response = await newRequest.get(`/acadadmin/students/document-access?${queryParams}`);
      
      // Fetch CPI for each student
      const studentsWithCPI = await Promise.all(
        response.data.students.map(async (student) => {
          try {
            const performanceData = await newRequest.get(`/student/${student.userId}/performance`);
            const cpi = performanceData.data.performance?.length > 0 
              ? performanceData.data.performance[performanceData.data.performance.length - 1].cpi 
              : null;
            return { ...student, cgpa: cpi };
          } catch (error) {
            console.error(`Error fetching CPI for student ${student.rollNo}:`, error);
            return { ...student, cgpa: null };
          }
        })
      );

      setStudents(studentsWithCPI);
      setPagination({
        currentPage: parseInt(response.data.currentPage),
        totalPages: parseInt(response.data.totalPages),
        total: parseInt(response.data.total)
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters, pagination.currentPage]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleToggleAccess = async (studentId, documentType) => {
    try {
      const student = students.find(s => s.id === studentId);
      const updatedAccess = {
        ...student.access,
        [documentType]: !student.access[documentType]
      };

      await newRequest.patch(`/acadadmin/students/${studentId}/document-access`, {
        access: updatedAccess
      });

      setStudents(students.map(student =>
        student.id === studentId
          ? { ...student, access: updatedAccess }
          : student
      ));

      toast.success("Document access updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating document access");
    }
  };

  const handleSelectStudent = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    setSelectedStudent(student);
    setIsEditing(false);
  };

  const handleBulkSelect = (e) => {
    if (e.target.checked) {
      setSelectedStudents(new Set(students.map(student => student.id)));
    } else {
      setSelectedStudents(new Set());
    }
  };

  const handleSingleSelect = (studentId) => {
    setSelectedStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const handleBulkAction = async (action) => {
    try {
      if (!selectedStudents.size) {
        toast.warning("No students selected");
        return;
      }

      // Parse the action string
      const isEnable = action.startsWith('enable');
      let documentType = action.replace(/^(enable|disable)/, '').toLowerCase();
      
      // Convert to correct property names
      if (documentType === 'idcard') {
        documentType = 'idCard';
      } else if (documentType === 'feereceipt') {
        documentType = 'feeReceipt';
      }

      const accessUpdate = {
        [documentType]: isEnable
      };
      
      console.log('Bulk update with:', {
        studentIds: Array.from(selectedStudents),
        access: accessUpdate
      });

      await newRequest.post('/acadadmin/students/bulk-document-access', {
        studentIds: Array.from(selectedStudents),
        access: accessUpdate
      });

      await fetchStudents();
      toast.success("Bulk update completed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error performing bulk update");
    }
  };

  const handleSaveStudent = async (updatedData) => {
    try {
      // Update document access
      await newRequest.patch(`/acadadmin/students/${updatedData.id}/document-access`, {
        access: updatedData.access
      });

      // Update student profile
      await newRequest.put(`/student/${updatedData.userId}/profile`, {
        userData: {
          userId: updatedData.userId,
          name: updatedData.name,
          email: updatedData.email,
          contact: updatedData.contact
        },
        hostel: updatedData.hostel,
        roomNo: updatedData.roomNo,
        branch: updatedData.branch,
        program: updatedData.program,
        semester: updatedData.semester
      });

      // Fetch performance data to get latest CPI
      const performanceData = await newRequest.get(`/student/${updatedData.userId}/performance`);
      const cpi = performanceData.data.performance?.length > 0 
        ? performanceData.data.performance[performanceData.data.performance.length - 1].cpi 
        : null;

      // Create updated student object with all the new data
      const updatedStudent = {
        ...updatedData,
        cgpa: cpi,
        name: updatedData.name,
        email: updatedData.email,
        contact: updatedData.contact,
        hostel: updatedData.hostel,
        roomNo: updatedData.roomNo,
        branch: updatedData.branch,
        program: updatedData.program,
        semester: updatedData.semester
      };

      // Update the students list with the new data
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === updatedData.id ? updatedStudent : student
        )
      );
      
      // Update selected student
      setSelectedStudent(updatedStudent);
      setIsEditing(false);
      toast.success("Student information updated successfully");

      // Refetch the entire list to ensure we have the latest data
      fetchStudents();
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating student information");
      console.error("Error updating student:", error);
    }
  };

  const filteredStudents = students.filter((student) => {
    const searchMatch =
      student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(filters.search.toLowerCase());

    const branchMatch = !filters.branch || student.branch === filters.branch;
    const programMatch = !filters.program || student.program === filters.program;
    const semesterMatch = !filters.semester || student.semester.toString() === filters.semester;

    return searchMatch && branchMatch && programMatch && semesterMatch;
  });

  const StudentDetails = ({ student, isEditing, onSave }) => {
    const [editData, setEditData] = useState(student);

    const handleChange = (e) => {
      setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">{student.name}</h2>
          <div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => setSelectedStudent(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Personal Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{student.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Roll No</label>
                  <p className="text-gray-900">{student.rollNo}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{student.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Contact</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="contact"
                      value={editData.contact}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{student.contact}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Academic Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600">Branch</label>
                  {isEditing ? (
                    <select
                      name="branch"
                      value={editData.branch}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select Branch</option>
                      <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                      <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                      <option value="Electronics and Electrical Engineering">Electronics and Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Biosciences and Bioengineering">Biosciences and Bioengineering</option>
                      <option value="Chemical Engineering">Chemical Engineering</option>
                      <option value="Engineering Physics">Engineering Physics</option>
                      <option value="Chemical Science and Technology">Chemical Science and Technology</option>
                      <option value="Mathematics and Computing">Mathematics and Computing</option>
                      <option value="Data Science and Artificial Intelligence">Data Science and Artificial Intelligence</option>
                      <option value="Energy Engineering">Energy Engineering</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{student.branch}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Program</label>
                  {isEditing ? (
                    <select
                      name="program"
                      value={editData.program}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select Program</option>
                      <option value="BTech">BTech</option>
                      <option value="MTech">MTech</option>
                      <option value="PhD">PhD</option>
                      <option value="BDes">BDes</option>
                      <option value="MDes">MDes</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{student.program}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Semester</label>
                  {isEditing ? (
                    <select
                      name="semester"
                      value={editData.semester}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-900">{student.semester}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600">CGPA</label>
                  <p className="text-gray-900">{student.cgpa || "Not available"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Hostel Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Hostel Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600">Hostel</label>
                  {isEditing ? (
                    <select
                      name="hostel"
                      value={editData.hostel}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select Hostel</option>
                      <option value="Brahmaputra">Brahmaputra</option>
                      <option value="Lohit">Lohit</option>
                      <option value="Disang">Disang</option>
                      <option value="Subansiri">Subansiri</option>
                      <option value="Dhansiri">Dhansiri</option>
                      <option value="Kapili">Kapili</option>
                      <option value="Manas">Manas</option>
                      <option value="Dihing">Dihing</option>
                      <option value="Barak">Barak</option>
                      <option value="Siang">Siang</option>
                      <option value="Kameng">Kameng</option>
                      <option value="Umiam">Umiam</option>
                      <option value="Married Scholar">Married Scholar</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{student.hostel}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Room No</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="roomNo"
                      value={editData.roomNo}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{student.roomNo}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Update Student Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Update Student Info</h3>
              <div className="space-y-3">
                <div className="flex flex-col space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={isEditing ? editData.access.transcript : student.access.transcript}
                      onChange={() => isEditing &&
                        setEditData({
                          ...editData,
                          access: {
                            ...editData.access,
                            transcript: !editData.access.transcript
                          }
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2">Transcript Access</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={isEditing ? editData.access.idCard : student.access.idCard}
                      onChange={() => isEditing &&
                        setEditData({
                          ...editData,
                          access: {
                            ...editData.access,
                            idCard: !editData.access.idCard
                          }
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2">ID Card Access</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={isEditing ? editData.access.feeReceipt : student.access.feeReceipt}
                      onChange={() => isEditing &&
                        setEditData({
                          ...editData,
                          access: {
                            ...editData.access,
                            feeReceipt: !editData.access.feeReceipt
                          }
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2">Fee Receipt Access</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(editData)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Update Student Info</h1>

      {selectedStudent ? (
        <StudentDetails
          student={selectedStudent}
          isEditing={isEditing}
          onSave={handleSaveStudent}
        />
      ) : (
        <>
          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name or roll number"
              name="search"
              className="border p-2 rounded"
              onChange={handleFilterChange}
            />
            <select
              name="branch"
              className="border p-2 rounded"
              onChange={handleFilterChange}
            >
              <option value="">Select Branch</option>
              <option value="Computer Science and Engineering">Computer Science and Engineering</option>
              <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
              <option value="Electronics and Electrical Engineering">Electronics and Electrical Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Biosciences and Bioengineering">Biosciences and Bioengineering</option>
              <option value="Chemical Engineering">Chemical Engineering</option>
              <option value="Engineering Physics">Engineering Physics</option>
              <option value="Chemical Science and Technology">Chemical Science and Technology</option>
              <option value="Mathematics and Computing">Mathematics and Computing</option>
              <option value="Data Science and Artificial Intelligence">Data Science and Artificial Intelligence</option>
              <option value="Energy Engineering">Energy Engineering</option>
            </select>
            <select
              name="program"
              className="border p-2 rounded"
              onChange={handleFilterChange}
            >
              <option value="">Select Program</option>
              <option value="BTech">BTech</option>
              <option value="MTech">MTech</option>
              <option value="PhD">PhD</option>
            </select>
            <select
              name="semester"
              className="border p-2 rounded"
              onChange={handleFilterChange}
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedStudents.size > 0 && (
            <div className="mb-4 p-4 bg-gray-100 rounded flex items-center space-x-4">
              <span className="font-semibold">{selectedStudents.size} students selected</span>
              <select
                className="border p-2 rounded"
                onChange={(e) => handleBulkAction(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Bulk Actions</option>
                <option value="enableTranscript">Enable Transcript Access</option>
                <option value="disableTranscript">Disable Transcript Access</option>
                <option value="enableIdCard">Enable ID Card Access</option>
                <option value="disableIdCard">Disable ID Card Access</option>
                <option value="enableFeeReceipt">Enable Fee Receipt Access</option>
                <option value="disableFeeReceipt">Disable Fee Receipt Access</option>
              </select>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <>
              {/* Students Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">
                        <input
                          type="checkbox"
                          onChange={handleBulkSelect}
                          checked={selectedStudents.size === students.length && students.length > 0}
                        />
                      </th>
                      <th className="border p-2">Roll No</th>
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Branch</th>
                      <th className="border p-2">Program</th>
                      <th className="border p-2">Semester</th>
                      <th className="border p-2">Transcript</th>
                      <th className="border p-2">ID Card</th>
                      <th className="border p-2">Fee Receipt</th>
                      <th className="border p-2">CGPA</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="border p-4 text-center text-gray-500">
                          No records found
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="border p-2">
                            <input
                              type="checkbox"
                              checked={selectedStudents.has(student.id)}
                              onChange={() => handleSingleSelect(student.id)}
                            />
                          </td>
                          <td className="border p-2">{student.rollNo}</td>
                          <td className="border p-2">{student.name}</td>
                          <td className="border p-2">{student.branch}</td>
                          <td className="border p-2">{student.program}</td>
                          <td className="border p-2">{student.semester}</td>
                          <td className="border p-2">
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-blue-600"
                              checked={student.access.transcript}
                              onChange={() => handleToggleAccess(student.id, "transcript")}
                            />
                          </td>
                          <td className="border p-2">
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-blue-600"
                              checked={student.access.idCard}
                              onChange={() => handleToggleAccess(student.id, "idCard")}
                            />
                          </td>
                          <td className="border p-2">
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-blue-600"
                              checked={student.access.feeReceipt}
                              onChange={() => handleToggleAccess(student.id, "feeReceipt")}
                            />
                          </td>
                          <td className="border p-2">
                            {student.cgpa || "-"}
                          </td>
                          <td className="border p-2">
                            <button
                              onClick={() => handleSelectStudent(student.id)}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex justify-between items-center">
                <div>
                  Showing {students.length} of {pagination.total} entries
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentAccessControl;
