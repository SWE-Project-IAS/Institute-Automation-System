import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaBullhorn, 
  FaCalendarAlt, 
  FaUserCircle,
  FaExclamationTriangle,
  FaTag,
  FaPaperclip,
  FaGraduationCap,
  FaBook,
  FaUniversity,
  FaFilter,
  FaSearch,
  FaPlus,
  FaEye,
  FaSortAmountDown
} from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import newRequest from "../../utils/newRequest";

export default function FacultyAnnouncements() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all", "course", "admin"
  const [importanceFilter, setImportanceFilter] = useState("all"); // "all", "Critical", "High", "Medium", "Low"
  const [sortBy, setSortBy] = useState("date"); // "date", "importance", "title"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc", "desc"
  
  // Get current faculty data
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const facultyId = currentUser?.data?.user?.userId;

  const { 
    isLoading, 
    error, 
    data 
  } = useQuery({
    queryKey: ["facultyAnnouncements"],
    queryFn: () => 
      newRequest.get(`/faculty/${facultyId}/announcements`).then((res) => {
        console.log("Faculty announcements data received:", res.data);
        return res.data;
      })
  });

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get importance style
  const getImportanceClass = (importance) => {
    switch (importance) {
      case 'Critical':
        return 'bg-red-500';
      case 'High':
        return 'bg-orange-500';
      case 'Medium':
        return 'bg-blue-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Get importance label
  const getImportanceLabel = (importance) => {
    switch (importance) {
      case 'Critical':
        return 'Critical Announcement';
      case 'High':
        return 'Important Announcement';
      case 'Medium':
        return 'Announcement';
      case 'Low':
        return 'Information';
      default:
        return 'Announcement';
    }
  };

  // Filter and sort announcements
  const processedAnnouncements = data?.announcements ? data.announcements
    // Filter
    .filter(announcement => {
      // Filter by search term
      const matchesSearch = 
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by type
      const matchesType = 
        filterType === "all" || 
        announcement.type === filterType;
      
      // Filter by importance
      const matchesImportance = 
        importanceFilter === "all" || 
        announcement.importance === importanceFilter;
      
      return matchesSearch && matchesType && matchesImportance;
    })
    // Sort
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "desc" 
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      }
      if (sortBy === "importance") {
        const importanceOrder = { "Critical": 4, "High": 3, "Medium": 2, "Low": 1 };
        return sortOrder === "desc"
          ? importanceOrder[b.importance] - importanceOrder[a.importance]
          : importanceOrder[a.importance] - importanceOrder[b.importance];
      }
      if (sortBy === "title") {
        return sortOrder === "desc"
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      }
      return 0;
    }) : [];

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-red-200 max-w-md">
          <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Announcements</h2>
          <p className="text-gray-600 mb-6">
            {error.response?.data?.message || "There was an error loading your announcements. Please try again later."}
          </p>
          <Link
            to="/faculty/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-pink-500 text-white py-2 px-6 rounded-md font-medium hover:bg-pink-600 transition duration-300"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Faculty Announcements</h1>
        <p className="text-gray-600">View all administrative and course announcements relevant to you.</p>
      </div>
      
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-2.5 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-3 text-gray-400">
                <FaSearch />
              </div>
            </div>
          </div>
          
          {/* Type Filter */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Type</label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="course">Course Announcements</option>
              <option value="admin">Administrative Announcements</option>
            </select>
          </div>
          
          {/* Importance Filter */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Importance</label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={importanceFilter}
              onChange={(e) => setImportanceFilter(e.target.value)}
            >
              <option value="all">All Importance Levels</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          
          {/* Sort By */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Sort By</label>
            <div className="flex">
              <select
                className="w-full p-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Date</option>
                <option value="importance">Importance</option>
                <option value="title">Title</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="bg-gray-100 p-2.5 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
              >
                <FaSortAmountDown className={`transform ${sortOrder === "asc" ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Announcements Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
          <div className="bg-pink-100 rounded-full p-3 mr-4">
            <FaBullhorn className="text-pink-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Announcements</p>
            <p className="font-semibold text-xl">{data?.count || 0}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <FaBook className="text-blue-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Course Announcements</p>
            <p className="font-semibold text-xl">
              {data?.announcements?.filter(a => a.type === 'course').length || 0}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
          <div className="bg-purple-100 rounded-full p-3 mr-4">
            <FaUniversity className="text-purple-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Admin Announcements</p>
            <p className="font-semibold text-xl">
              {data?.announcements?.filter(a => a.type === 'admin').length || 0}
            </p>
          </div>
        </div>
      </div>
      
      {/* Announcements List */}
      {processedAnnouncements.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <FaBullhorn className="text-5xl text-gray-400 mx-auto mb-4" />
          {data?.announcements?.length > 0 ? (
            <>
              <p className="text-gray-700">No announcements match your current filters.</p>
              <button 
                className="mt-4 text-pink-500 hover:text-pink-600 font-medium"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setImportanceFilter("all");
                }}
              >
                Clear all filters
              </button>
            </>
          ) : (
            <p className="text-gray-700">No announcements are available at this time.</p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {processedAnnouncements.map((announcement) => (
            <div 
              key={announcement._id || announcement.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transform transition duration-300 hover:shadow-lg"
            >
              {/* Importance Badge */}
              <div className={`${getImportanceClass(announcement.importance)} text-white text-xs font-semibold py-1 px-3 flex justify-between`}>
                <span>{getImportanceLabel(announcement.importance)}</span>
                <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                  {announcement.type === 'course' ? 'Course' : 'Administrative'}
                </span>
              </div>
              
              {/* Announcement Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{announcement.title}</h2>
                </div>
                
                {/* Meta Information */}
                <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
                  {/* Posted By */}
                  <div className="flex items-center mr-4 mb-2">
                    <FaUserCircle className="mr-1" />
                    <span>
                      { announcement.postedBy}
                    </span>
                  </div>
                  
                  {/* Date */}
                  <div className="flex items-center mr-4 mb-2">
                    <FaCalendarAlt className="mr-1" />
                    <span>{formatDate(announcement.date)}</span>
                  </div>
                  
                  {/* Course Info */}
                  {/* {announcement.type === 'course' && (
                    <div className="flex items-center mb-2">
                      <FaGraduationCap className="mr-1" />
                      <span>
                        <Link 
                          to={`/faculty/courses/${announcement.courseId}`}
                          className="text-blue-500 hover:underline"
                        >
                          {announcement.courseName} ({announcement.courseCode})
                        </Link>
                      </span>
                    </div>
                  )}
                   */}
                  {/* Admin Info */}
                  {announcement.type === 'admin' && (
                    <div className="flex items-center mb-2">
                      <FaUniversity className="mr-1" />
                      <span>{announcement.departmentName || "University Administration"}</span>
                    </div>
                  )}
                </div>
                
                {/* Announcement Body */}
                <div className="text-gray-700 mb-4">
                  <p>{announcement.content}</p>
                </div>
                
                {/* Attachments if any */}
                {announcement.attachments && announcement.attachments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium flex items-center text-gray-700 mb-2">
                      <FaPaperclip className="mr-1" />
                      Attachments
                    </h3>
                    <ul className="space-y-2">
                      {announcement.attachments.map((attachment, idx) => (
                        <li key={idx}>
                          <a 
                            href={attachment.url} 
                            className="text-blue-500 hover:underline flex items-center"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="mr-1">📎</span>
                            {attachment.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}