import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaBullhorn, FaCalendarAlt, FaUserCircle } from "react-icons/fa";

export default function CourseAnnouncements() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching course data and announcements
  useEffect(() => {
    // This would be an API call in a real application
    setTimeout(() => {
      const courseData = {
        id: courseId,
        name: courseId === "CS101" ? "Introduction to Computer Science" :
              courseId === "MATH202" ? "Calculus II" :
              courseId === "ENG105" ? "Academic Writing" : "Unknown Course"
      };
      
      // Sample announcements data
      const announcementsData = [
        {
          id: 1,
          title: "Welcome to the course!",
          content: "Hello everyone! Welcome to our course. I'm excited to have you all in this class. Please make sure to review the syllabus and prepare for our first lecture.",
          date: "March 28, 2025",
          author: "Dr. Smith",
          important: true
        },
        {
          id: 2,
          title: "Assignment #1 Posted",
          content: "The first assignment has been posted and is due next Friday. Please let me know if you have any questions about the requirements.",
          date: "March 29, 2025",
          author: "Dr. Smith",
          important: false
        },
        {
          id: 3,
          title: "Office Hours Change",
          content: "Please note that my office hours will be changed from Tuesday 2-4pm to Wednesday 1-3pm starting next week.",
          date: "March 30, 2025",
          author: "Dr. Smith",
          important: true
        }
      ];
      
      setCourse(courseData);
      setAnnouncements(announcementsData);
      setLoading(false);
    }, 500); // Simulate network delay
  }, [courseId]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center mb-6">
        <Link to="/my-courses" className="mr-4 text-pink-500 hover:text-pink-600">
          <FaArrowLeft className="text-xl" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">{course.name} Announcements</h1>
      </div>
      
      {/* Announcements List */}
      {announcements.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <FaBullhorn className="text-5xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700">No announcements yet for this course.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <div 
              key={announcement.id} 
              className={`bg-white rounded-lg shadow-md border ${announcement.important ? 'border-pink-300' : 'border-gray-200'} overflow-hidden`}
            >
              {/* Important Badge */}
              {announcement.important && (
                <div className="bg-pink-500 text-white text-xs font-semibold py-1 px-3">
                  Important Announcement
                </div>
              )}
              
              {/* Announcement Content */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{announcement.title}</h2>
                
                {/* Meta Information */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <div className="flex items-center mr-4">
                    <FaUserCircle className="mr-1" />
                    <span>{announcement.author}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    <span>{announcement.date}</span>
                  </div>
                </div>
                
                {/* Announcement Body */}
                <div className="text-gray-700 mb-2">
                  <p>{announcement.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}