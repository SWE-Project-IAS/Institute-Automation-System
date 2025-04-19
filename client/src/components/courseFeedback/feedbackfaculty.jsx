import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import newRequest from '../../utils/newRequest';
import { 
  FaArrowLeft,
  FaChartBar,
  FaCommentDots,
  FaStar
} from "react-icons/fa";

const FeedbackFaculty = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: userData } = JSON.parse(localStorage.getItem("currentUser"));
  const { userId: facultyId } = userData.user;

  // Get course info from navigation state
  const { courseCode, courseName, department } = location.state || {};

  // Store in state for use throughout the component
  const [selectedCourseCode] = useState(courseCode);
  const [selectedCourseName] = useState(courseName);
  const [selectedDepartment] = useState(department);

  const [feedbackStats, setFeedbackStats] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Feedback questions mapping for better display
  const feedbackQuestions = {
    course_content: 'Relevance of course content to your program',
    course_materials: 'Quality and accessibility of course materials',
    course_organization: 'Organization and structure of the course',
    teaching_quality: 'Clarity of instruction and explanations',
    faculty_knowledge: "Faculty's knowledge of the subject matter",
    faculty_availability: "Faculty's availability and responsiveness",
    assessment_fairness: 'Fairness of assessments and grading',
    feedback_quality: 'Quality and timeliness of feedback on assignments'
  };

  useEffect(() => {
    if (!selectedCourseCode) {
      setError('No course code provided.');
      setLoading(false);
      return;
    }
    const fetchFeedbackData = async () => {
      try {
        const res = await newRequest.get(`/feedback/faculty/${facultyId}/${selectedCourseCode}`);
        const { statistics, feedback } = res.data;
        setFeedbackStats(statistics);
        setFeedbacks(feedback);
        setLoading(false);

      } catch (err) {   
        setError('Failed to load feedback data');
        setLoading(false);
      }
    };
    if(selectedCourseCode) fetchFeedbackData();
  }, [selectedCourseCode]);

  if (loading) return (
    <div className="p-6 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading feedback report...</p>
    </div>
  );
  if (error) return (
    <div className="p-6 text-center text-red-600">
      {error}
      <button 
        onClick={() => navigate(-1)}
        className="block mt-4 text-pink-600 hover:text-pink-700"
      >
        <FaArrowLeft className="inline mr-2" /> Back to courses
      </button>
    </div>
  );
  if (!courseCode) return (
    <div className="p-6 text-center text-red-600">
      Invalid course information
      <button 
        onClick={() => navigate(-1)}
        className="block mt-4 text-blue-600 hover:text-blue-700"
      >
        <FaArrowLeft className="inline mr-2" /> Back to courses
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-700"
      >
        <FaArrowLeft className="mr-2" /> Back to Courses
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {selectedCourseName || 'Course Feedback Report'}
            </h1>
            <p className="text-gray-600">
              {selectedCourseCode} | {selectedDepartment || 'Department'}
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
            Total Responses: {feedbackStats?.totalFeedbacks || 0}
          </div>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            className={`pb-2 px-4 ${
              activeTab === 'summary' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('summary')}
          >
            <FaChartBar className="inline mr-2" /> Summary
          </button>
          <button
            className={`pb-2 px-4 ${
              activeTab === 'comments' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('comments')}
          >
            <FaCommentDots className="inline mr-2" /> Comments
          </button>
        </div>

        {activeTab === 'summary' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedbackStats?.sections?.map((section) => (
              <div key={section.id} className="col-span-2">
                <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">{section.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(section.questions).map(([questionId, question]) => (
                    <div key={questionId} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        {feedbackQuestions[questionId] || question.text}
                      </h3>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-500 text-white px-4 py-2 rounded-full font-medium">
                          Avg. {question.average.toFixed(1)}/5
                        </div>
                        <div className="text-gray-600">
                          {question.totalResponses} responses
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-4">
                            <div className="w-8 text-gray-600 flex items-center">
                              {rating}<FaStar className="inline ml-1 text-yellow-400" size={12} />
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-4">
                              <div 
                                className="bg-blue-500 h-4 rounded-full" 
                                style={{ 
                                  width: `${(question.distribution[rating] / question.totalResponses) * 100}%`,
                                  opacity: question.totalResponses > 0 ? 1 : 0
                                }}
                              ></div>
                            </div>
                            <div className="w-12 text-right text-gray-600">
                              {question.distribution[rating] || 0}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {feedbacks.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No comments available
              </div>
            ) : (
              feedbacks.map((feedback, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-gray-600 text-sm">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </div>
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      Student: {feedback.student || 'Anonymous'}
                    </div>
                  </div>
                  {feedback.comments && (
                    <p className="text-gray-800">
                      "{feedback.comments}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackFaculty;