import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  FaArrowLeft, 
  FaBullhorn, 
  FaCalendarAlt, 
  FaUserCircle, 
  FaExclamationTriangle,
  FaTag,
  FaPaperclip
} from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import newRequest from "../../utils/newRequest";

export default function CourseAnnouncements() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  // Get current user data
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.data?.user?.userId;

  // console.log("User ID:", userId);
  // console.log("Course ID:", courseId);

  const { 
    isLoading, 
    error, 
    data 
  } = useQuery({
    queryKey: ["courseAnnouncements", courseId],
    queryFn: () => 
      newRequest.get(`/student/courses/${courseId}`).then((res) => {
        console.log("Course data received:", res.data);
        setCourse(res.data);
        return res.data;
      }),
    enabled: !!courseId
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

  // Error state - Course not found
  if (error) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-red-200 max-w-md">
          <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Course Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error.response?.data?.message || "The course you're looking for doesn't exist or you don't have access to it."}
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center gap-2 bg-pink-500 text-white py-2 px-6 rounded-md font-medium hover:bg-pink-600 transition duration-300"
          >
            <FaArrowLeft className="text-sm" />
            Return to My Courses
          </Link>
        </div>
      </div>
    );
  }

  // Normal state - Display announcements
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center mb-6">
        <Link to="/courses" className="mr-4 text-pink-500 hover:text-pink-600">
          <FaArrowLeft className="text-xl" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">{course?.courseName} Announcements</h1>
      </div>
      
      {/* Course Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Course Code</p>
            <p className="font-medium">{course?.courseCode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-medium">{course?.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Credits</p>
            <p className="font-medium">{course?.credits}</p>
          </div>
        </div>
      </div>
      
      {/* Announcements List */}
      {!course?.announcements || course.announcements.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <FaBullhorn className="text-5xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700">No announcements yet for this course.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {course.announcements.map((announcement) => (
            <div 
              key={announcement.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            >
              {/* Importance Badge */}
              <div className={`${getImportanceClass(announcement.importance)} text-white text-xs font-semibold py-1 px-3`}>
                {getImportanceLabel(announcement.importance)}
              </div>
              
              {/* Announcement Content */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{announcement.title}</h2>
                
                {/* Meta Information */}
                <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
                  <div className="flex items-center mr-4 mb-2">
                    <FaUserCircle className="mr-1" />
                    <span>
                      {announcement.faculty.name}
                    </span>
                  </div>
                  <div className="flex items-center mr-4 mb-2">
                    <FaCalendarAlt className="mr-1" />
                    <span>{formatDate(announcement.date)}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaTag className="mr-1" />
                    <span>{announcement.importance}</span>
                  </div>
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
                      {announcement.attachments.map((attachment, index) => (
                        <li key={index}>
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