import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import newRequest from '../../utils/newRequest';
import { FaArrowLeft, FaStar, FaRegStar, FaBook, FaChalkboardTeacher, FaCalendarAlt } from 'react-icons/fa';
import './feedback.css';

const FeedbackStudent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get studentId from localStorage
  const { data: userData } = JSON.parse(localStorage.getItem("currentUser"));
  const { userId: studentId } = userData.user;

  // Get course info from navigation state
  const { courseId, courseName, credits } = location.state || {};

  // State for fetched course/faculty/session info
  const [courseDetails, setCourseDetails] = useState(null);
  const [facultyName, setFacultyName] = useState('');
  const [session, setSession] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [facId, setFacId] = useState('');
  // Feedback form state
  const [feedbackData, setFeedbackData] = useState({
    ratings: {},
    comments: ''
  });
  const [validationError, setValidationError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch course, faculty, and session info on mount
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // 1. Get course details
        const courseRes = await newRequest.get(`feedback/course/${courseId}/details`);
        const course = courseRes.data;
        setCourseDetails(course);
        // 2. Get faculty assignment (FacultyCourse) for this course
        // const facultyCourseRes = await newRequest.get(`/feedback/course/${courseId}/faculty`);
        // const facultyCourse = facultyCourseRes.data;

        // console.log(facultyCourse);
        // console.log(courseDetails);
        
        setSession(course.session);
        setYear(course.year);
        setFacultyName(course.facultyName);
        setFacId(course.facultyId);
        console.log(course);

        setLoading(false);
      } catch (err) {
        setFetchError('Failed to fetch course or faculty information.');
        setLoading(false);
      }
    };

    if (courseId) fetchDetails();
    else setLoading(false);
  }, [courseId]);

  // Feedback questions
  const feedbackSections = [
    {
      id: 'course_content_section',
      title: 'Course Content',
      questions: [
        { id: 'course_content', text: 'Relevance of course content to your program' },
        { id: 'course_materials', text: 'Quality and accessibility of course materials' },
        { id: 'course_organization', text: 'Organization and structure of the course' }
      ]
    },
    {
      id: 'faculty_evaluation_section',
      title: 'Faculty Evaluation',
      questions: [
        { id: 'teaching_quality', text: 'Clarity of instruction and explanations' },
        { id: 'faculty_knowledge', text: "Faculty's knowledge of the subject matter" },
        { id: 'faculty_availability', text: "Faculty's availability and responsiveness" }
      ]
    },
    {
      id: 'assessment_section',
      title: 'Assessment',
      questions: [
        { id: 'assessment_fairness', text: 'Fairness of assessments and grading' },
        { id: 'feedback_quality', text: 'Quality and timeliness of feedback on assignments' }
      ]
    }
  ];

  const handleRatingChange = (questionId, value) => {
    setFeedbackData(prev => ({
      ...prev,
      ratings: { ...prev.ratings, [questionId]: value }
    }));
  };

  const handleCommentsChange = (e) => {
    setFeedbackData(prev => ({
      ...prev,
      comments: e.target.value
    }));
  };

  const validateForm = () => {
    const allQuestions = feedbackSections.flatMap(section => section.questions.map(q => q.id));
    const unanswered = allQuestions.filter(id => !feedbackData.ratings[id]);
    if (unanswered.length > 0) {
      setValidationError('Please answer all questions before submitting.');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);

    // Format ratings for schema
    const formattedRatings = Object.entries(feedbackData.ratings).map(([questionId, rating]) => ({
      questionId,
      rating
    }));
    console.log("hehe ", courseDetails.facultyId);
    try {
      await newRequest.post('/feedback/submit', {
        student: studentId,
        faculty: courseDetails.facultyId,
        course: courseId,
        isActive: true,
        ratings: formattedRatings,
        comments: feedbackData.comments || ''
      });
      navigate('/courses');
    } catch (err) {
      setError('Failed to submit feedback. Please try again later.');
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/courses');
  };

  // Rating display component
  const RatingOption = ({ rating, isSelected, onClick }) => {
    const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    
    return (
      <label 
        className={`flex flex-col items-center cursor-pointer transition-all px-3 py-2 rounded-lg ${isSelected ? 'bg-pink-100 ring-2 ring-pink-400' : 'hover:bg-gray-50'}`}
        onClick={onClick}
      >
        <div className="flex items-center justify-center w-8 h-8 mb-1 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 text-white font-bold">
          {rating}
        </div>
        <input
          type="radio"
          className="hidden"
          checked={isSelected}
          onChange={() => {}}
        />
        <span className={`text-xs font-medium ${isSelected ? 'text-pink-700' : 'text-gray-500'}`}>
          {labels[rating-1]}
        </span>
      </label>
    );
  };

  // UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        <span className="ml-4 text-gray-600 text-lg">Loading course information...</span>
      </div>
    );
  }

  if (fetchError || !courseDetails) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 mb-8">
        <Link to="/courses" className="inline-flex items-center text-pink-600 hover:text-pink-800 mb-6 font-medium">
          <FaArrowLeft className="mr-2" />
          Back to Courses
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-3">Error</h3>
          <p>{fetchError || "Missing required information to submit feedback."}</p>
          <button 
            className="mt-4 bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            onClick={handleCancel}
          >
            Back to Feedback List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 mb-8">
      <Link to="/courses" className="inline-flex items-center text-pink-600 hover:text-pink-800 mb-6 font-medium">
        <FaArrowLeft className="mr-2" />
        Back to Courses
      </Link>
      
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Course Feedback</h1>
      <p className="text-gray-500 mb-6">Your feedback helps us improve our academic programs</p>
      
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-start">
              <FaBook className="text-pink-500 mt-1 mr-3 text-xl" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{courseDetails.courseName}</h2>
                <p className="text-gray-600 font-medium">{courseDetails.courseCode}</p>
              </div>
            </div>
            <div className="mt-3 text-gray-600 ml-8">
              <p>Department: <span className="font-medium">{courseDetails.department}</span></p>
              <p>Credits: <span className="font-medium">{credits}</span></p>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start">
              <FaChalkboardTeacher className="text-pink-500 mt-1 mr-3 text-xl" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Faculty</h3>
                <p className="text-gray-700 font-medium">{facultyName}</p>
              </div>
            </div>
            
            <div className="flex items-start mt-3">
              <FaCalendarAlt className="text-pink-500 mt-1 mr-3 text-xl" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Session</h3>
                <p className="text-gray-700">{session} {year}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {validationError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-red-700">{validationError}</p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {feedbackSections.map((section, sectionIndex) => (
          <div key={section.id} className={`p-6 rounded-lg border ${sectionIndex % 2 === 0 ? 'border-pink-200 bg-pink-50' : 'border-purple-200 bg-purple-50'}`}>
            <h3 className={`text-xl font-bold mb-4 ${sectionIndex % 2 === 0 ? 'text-pink-700' : 'text-purple-700'}`}>{section.title}</h3>
            
            {section.questions.map((question, qIndex) => (
              <div key={question.id} className={`mb-6 ${qIndex !== section.questions.length - 1 ? 'pb-6 border-b border-gray-200' : ''}`}>
                <p className="font-medium text-gray-800 mb-3">{question.text}</p>
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <RatingOption 
                      key={rating}
                      rating={rating}
                      isSelected={feedbackData.ratings[question.id] === rating}
                      onClick={() => handleRatingChange(question.id, rating)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
        
        <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Additional Comments</h3>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
            rows={5}
            placeholder="Please provide any additional feedback or suggestions for improvement..."
            value={feedbackData.comments}
            onChange={handleCommentsChange}
          />
        </div>
        
        <div className="flex justify-between items-center pt-4">
          <Link to="/courses" className="inline-flex items-center text-gray-600 hover:text-gray-800">
            <FaArrowLeft className="mr-2" />
            Back to Courses
          </Link>
          
          <div className="flex gap-4">
            <button 
              type="button" 
              className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-colors shadow-md disabled:opacity-70"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FeedbackStudent;