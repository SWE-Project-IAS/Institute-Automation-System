import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";
import {
  FaSearch,
  FaFilter,
  FaFileDownload,
  FaArrowLeft,
  FaEnvelope,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaUserGraduate,
  FaCalendarCheck
} from "react-icons/fa";

function FacultyCourseStudents() {
  const { courseId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    program: "",
    semester: "",
    status: ""
  });
  const [sort, setSort] = useState({
    field: "name",
    direction: "asc"
  });

  const { isLoading, error, data } = useQuery({
    queryKey: ["course-students", courseId],
    queryFn: () =>
      newRequest.get(`/faculty/courses/${courseId}/students`).then((res) => {
        console.log("Course students data received:", res.data);
        return res.data;
      }),       
  });

  // Filter and sort students
  const getFilteredStudents = () => {
    if (!data || !data.students) return [];
    
    return data.students
      .filter(student => {
        // Apply search filter
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          student.name.toLowerCase().includes(searchLower) ||
          student.rollNo.toLowerCase().includes(searchLower) ||
          student.email.toLowerCase().includes(searchLower);
        
        // Apply dropdown filters
        const matchesProgram = filter.program ? student.program === filter.program : true;
        const matchesSemester = filter.semester ? student.semester.toString() === filter.semester : true;
        const matchesStatus = filter.status ? student.registrationStatus === filter.status : true;
        
        return matchesSearch && matchesProgram && matchesSemester && matchesStatus;
      })
      .sort((a, b) => {
        // Apply sorting
        const fieldA = a[sort.field].toString().toLowerCase();
        const fieldB = b[sort.field].toString().toLowerCase();
        
        if (sort.direction === "asc") {
          return fieldA.localeCompare(fieldB);
        } else {
          return fieldB.localeCompare(fieldA);
        }
      });
  };

  // Toggle sort direction
  const toggleSort = (field) => {
    if (sort.field === field) {
      setSort({
        ...sort,
        direction: sort.direction === "asc" ? "desc" : "asc"
      });
    } else {
      setSort({
        field,
        direction: "asc"
      });
    }
  };

  // Export student list as CSV
  const exportStudentList = () => {
    if (!data || !data.students) return;
    
    const headers = ["Roll No", "Name", "Email", "Program", "Semester", "Status", "Grade"];
    const csvContent = [
      headers.join(","),
      ...getFilteredStudents().map(student => [
        student.rollNo,
        student.name,
        student.email,
        student.program,
        student.semester,
        student.registrationStatus,
        student.grade || "Not Assigned"
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${data.course.courseName}-students.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate class statistics
  const getStatistics = () => {
    if (!data || !data.students || !data.students.length) {
      return { totalStudents: 0, programCounts: {}, averageAttendance: 0 };
    }
    
    const programCounts = data.students.reduce((acc, student) => {
      acc[student.program] = (acc[student.program] || 0) + 1;
      return acc;
    }, {});
    
    const totalAttendance = data.students.reduce((sum, student) => sum + (student.attendance || 0), 0);
    const averageAttendance = (totalAttendance / data.students.length).toFixed(1);
    
    return {
      totalStudents: data.students.length,
      programCounts,
      averageAttendance
    };
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilter({
      program: "",
      semester: "",
      status: ""
    });
    setSort({
      field: "name",
      direction: "asc"
    });
  };

  return (
    <div className="p-6">
      {/* Improved header section with better spacing and hierarchy */}
      <div className="flex flex-col mb-6">
        <Link 
          to={`/courses`} 
          className="flex items-center text-blue-600 hover:text-blue-800 mb-2 w-fit"
        >
          <FaArrowLeft className="mr-1" /> Back to Course
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          {isLoading ? "Loading..." : error ? "Error" : data?.course?.courseName} Students
        </h1>
      </div>

      {isLoading ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading student data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-8 rounded-lg text-center">
          <p className="text-red-700 text-lg mb-4">{error.message || "Failed to fetch student data"}</p>
        </div>
      ) : data?.students?.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-700 text-lg mb-4">No students are registered for this course.</p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-2xl font-bold text-blue-600">{getStatistics().totalStudents}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaUserGraduate className="text-blue-500 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Program Distribution</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Object.entries(getStatistics().programCounts).map(([program, count]) => (
                      <span key={program} className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">
                        {program}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Average Attendance</p>
                  <p className="text-2xl font-bold text-blue-600">{getStatistics().averageAttendance}%</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaCalendarCheck className="text-blue-500 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by name, roll number or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filter.program}
                  onChange={(e) => setFilter({...filter, program: e.target.value})}
                >
                  <option value="">All Programs</option>
                  <option value="BTech">BTech</option>
                  <option value="MTech">MTech</option>
                  <option value="PhD">PhD</option>
                  <option value="BDes">BDes</option>
                  <option value="MDes">MDes</option>
                </select>
                
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filter.semester}
                  onChange={(e) => setFilter({...filter, semester: e.target.value})}
                >
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
                
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filter.status}
                  onChange={(e) => setFilter({...filter, status: e.target.value})}
                >
                  <option value="">All Status</option>
                  <option value="Credit">Credit</option>
                  <option value="Audit">Audit</option>
                </select>
                
                <button
                  className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                  onClick={resetFilters}
                >
                  <FaFilter className="text-gray-500" />
                  Reset
                </button>
                
                <button
                  className="flex items-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md"
                  onClick={exportStudentList}
                >
                  <FaFileDownload className="text-blue-500" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort("rollNo")}
                    >
                      <div className="flex items-center">
                        Roll No
                        {sort.field === "rollNo" && (
                          sort.direction === "asc" ? 
                            <FaSortAlphaDown className="ml-1" /> : 
                            <FaSortAlphaUp className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort("name")}
                    >
                      <div className="flex items-center">
                        Name
                        {sort.field === "name" && (
                          sort.direction === "asc" ? 
                            <FaSortAlphaDown className="ml-1" /> : 
                            <FaSortAlphaUp className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort("program")}
                    >
                      <div className="flex items-center">
                        Program
                        {sort.field === "program" && (
                          sort.direction === "asc" ? 
                            <FaSortAlphaDown className="ml-1" /> : 
                            <FaSortAlphaUp className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort("semester")}
                    >
                      <div className="flex items-center">
                        Semester
                        {sort.field === "semester" && (
                          sort.direction === "asc" ? 
                            <FaSortAlphaDown className="ml-1" /> : 
                            <FaSortAlphaUp className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort("registrationStatus")}
                    >
                      <div className="flex items-center">
                        Status
                        {sort.field === "registrationStatus" && (
                          sort.direction === "asc" ? 
                            <FaSortAlphaDown className="ml-1" /> : 
                            <FaSortAlphaUp className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort("attendance")}
                    >
                      <div className="flex items-center">
                        Attendance
                        {sort.field === "attendance" && (
                          sort.direction === "asc" ? 
                            <FaSortAlphaDown className="ml-1" /> : 
                            <FaSortAlphaUp className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort("grade")}
                    >
                      <div className="flex items-center">
                        Grade
                        {sort.field === "grade" && (
                          sort.direction === "asc" ? 
                            <FaSortAlphaDown className="ml-1" /> : 
                            <FaSortAlphaUp className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mail
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredStudents().map((student) => (
                    <tr key={student.rollNo} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.rollNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <a href={`mailto:${student.email}`} className="text-blue-600 hover:text-blue-800">
                          {student.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.program}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.semester}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${student.registrationStatus === 'Credit' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {student.registrationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                student.attendance >= 75 ? 'bg-green-500' : 
                                student.attendance >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${student.attendance}%` }}
                            ></div>
                          </div>
                          <span className="ml-2">{student.attendance}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.grade || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <a 
                            href={`mailto:${student.email}`}
                            className="text-green-600 hover:text-green-900"
                            title="Send Email"
                          >
                            <FaEnvelope />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination or Results Summary */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{getFilteredStudents().length}</span> of{" "}
                  <span className="font-medium">{data?.students?.length}</span> students
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default FacultyCourseStudents;