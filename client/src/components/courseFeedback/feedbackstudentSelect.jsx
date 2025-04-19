import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import { 
  FaBookOpen, 
  FaClipboardList, 
  FaBullhorn, 
  FaCalendarAlt,
  FaComments
} from "react-icons/fa";

function FeedbackStudentSelect() {
  // Get userId from localStorage (same as MyCourses)
  const {data:userData} = JSON.parse(localStorage.getItem("currentUser"));
  const {userId} = userData.user;
  const navigate = useNavigate();

  // Fetch courses using useQuery, just like MyCourses
  const { isLoading, error, data: studentCourses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: () =>
      newRequest.get(`/student/${userId}/courses`).then((res) => {
        return res.data.courses || [];
      }),
  });

  // Handle navigation to feedback form
  const handleFeedback = (course) => {
    navigate('/student/feedback/submit', {
      state: {
        courseId: course.id,
        courseName: course.name,
        credits: course.credits,
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Course Feedback</h1>
      <p className="text-gray-600 mb-6">Select a course to provide feedback.</p>
      
      {isLoading ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your courses...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-8 rounded-lg text-center">
          <p className="text-red-700 text-lg mb-4">{error.message || "Failed to fetch courses"}</p>
        </div>
      ) : studentCourses.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-700 text-lg mb-4">You are not enrolled in any courses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {studentCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 overflow-hidden"
            >
              {/* Course Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-3 rounded-full">
                      <FaBookOpen className="text-pink-500 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{course.name}</h2>
                    </div>
                  </div>
                  <span className="bg-gray-100 text-gray-700 text-sm py-1 px-3 rounded-full font-medium">
                    {course.id}
                  </span>
                </div>
              </div>
              
              {/* Course Stats */}
              <div className="grid grid-cols-3 border-b border-gray-200">
                <div className="p-4 text-center border-r border-gray-200">
                  <p className="text-2xl font-semibold text-pink-500">{course.credits}</p>
                  <p className="text-xs text-gray-600 font-medium uppercase">Credits</p>
                </div>
                <div className="p-4 text-center border-r border-gray-200">
                  <p className="text-2xl font-semibold text-pink-500">{course.assignments}</p>
                  <p className="text-xs text-gray-600 font-medium uppercase">Assignments</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-2xl font-semibold text-pink-500">{course.attendance}%</p>
                  <p className="text-xs text-gray-600 font-medium uppercase">Attendance</p>
                </div>
              </div>
              
              {/* Feedback Action */}
              <div className="p-6 flex justify-center">
                <button
                  className="flex items-center gap-2 bg-pink-500 text-white py-2 px-6 rounded-md font-medium hover:bg-pink-600 transition duration-300"
                  onClick={() => handleFeedback(course)}
                >
                  <FaComments className="text-white" />
                  Provide Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedbackStudentSelect;
