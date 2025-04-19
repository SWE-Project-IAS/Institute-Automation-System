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
  FaSearch
} from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import newRequest from "../../utils/newRequest";

export default function AllAnnouncements() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all", "course", "admin"
  const [importanceFilter, setImportanceFilter] = useState("all"); // "all", "Critical", "High", "Medium", "Low"
  
  // Get current user data
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.data?.user?.userId;

  const { 
    isLoading, 
    error, 
    data 
  } = useQuery({
    queryKey: ["allAnnouncements"],
    queryFn: () => 
      newRequest.get(`/student/${userId}/announcements`).then((res) => {
        console.log("Announcements data received:", res.data);
        return res.data;
      })
  });

  console.log("Announcements data:", data);

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

  // Filter announcements based on search term, type and importance
  const filteredAnnouncements = data?.announcements?.filter(announcement => {
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
  }) || [];

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
            to="/dashboard"
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">All Announcements</h1>
        <p className="text-gray-600">Stay updated with the latest announcements from your courses and academic administration.</p>
      </div>
      
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <option value="admin">Academic Administration</option>
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
      {filteredAnnouncements.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <FaBullhorn className="text-5xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700">No announcements match your current filters.</p>
          {data?.announcements?.length > 0 && (
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
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAnnouncements.map((announcement, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transform transition duration-300 hover:shadow-lg"
            >
              {/* Importance Badge */}
              <div className={`${getImportanceClass(announcement.importance)} text-white text-xs font-semibold py-1 px-3 flex justify-between`}>
                <span>{getImportanceLabel(announcement.importance)}</span>
                <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                  {announcement.type === 'course' ? 'Course' : 'Academic Admin'}
                </span>
              </div>
              
              {/* Announcement Content */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{announcement.title}</h2>
                
                {/* Meta Information */}
                <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
                  {/* Posted By */}
                  <div className="flex items-center mr-4 mb-2">
                    <FaUserCircle className="mr-1" />
                    <span>
                      {announcement.type === 'course' && announcement.faculty 
                        ? `${announcement.faculty.name} (${announcement.faculty.designation})` 
                        : announcement.postedBy}
                    </span>
                  </div>
                  
                  {/* Date */}
                  <div className="flex items-center mr-4 mb-2">
                    <FaCalendarAlt className="mr-1" />
                    <span>{formatDate(announcement.date)}</span>
                  </div>
                  
                  {/* Source/Course Info */}
                  {announcement.type === 'course' && (
                    <div className="flex items-center mb-2">
                      <FaGraduationCap className="mr-1" />
                      <span>
                        <Link 
                          to={`/course/${announcement.courseId}/announcements`}
                          className="text-blue-500 hover:underline"
                        >
                          {announcement.courseName} ({announcement.courseId})
                        </Link>
                      </span>
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