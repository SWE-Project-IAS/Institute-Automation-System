import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './courseFeedback.css';

const CourseFeedbackForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [courseDetails, setCourseDetails] = useState(null);
  const [instructorDetails, setInstructorDetails] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [validationError, setValidationError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Feedback structure with sections and questions
  const feedbackSections = [
    {
      title: 'Course Content',
      questions: [
        { id: 'course_content', text: 'Relevance of course content to your program' },
        { id: 'course_materials', text: 'Quality and accessibility of course materials' },
        { id: 'course_organization', text: 'Organization and structure of the course' }
      ]
    },
    {
      title: 'Instructor Evaluation',
      questions: [
        { id: 'teaching_quality', text: 'Clarity of instruction and explanations' },
        { id: 'instructor_knowledge', text: 'Instructor\'s knowledge of the subject matter' },
        { id: 'instructor_availability', text: 'Instructor\'s availability and responsiveness' }
      ]
    },
    {
      title: 'Assessment',
      questions: [
        { id: 'assessment_fairness', text: 'Fairness of assessments and grading' },
        { id: 'feedback_quality', text: 'Quality and timeliness of feedback on assignments' }
      ]
    }
  ];

  useEffect(() => {
    // Authentication check
    const userToken = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');
    
    // if (!userToken || userRole !== 'student') {
    //   navigate('/login', { state: { message: 'Please login as a student to access this page' } });
    //   return;
    // }
    
    // Check if course and instructor were selected
    const { courseId, instructorId } = location.state || {};
    if (!courseId || !instructorId) {
      navigate('/courseFeedback', { state: { message: 'Please select a course first' } });
      return;
    }
    
    // Fetch course and instructor details
    const fetchDetails = async () => {
      try {
        // In a real implementation, this would be API calls
        // Mock data for demonstration
        const mockCourse = {
          id: 'CS101',
          name: 'Introduction to Computer Science',
          code: 'CS101',
          semester: 'Spring 2025'
        };
        
        const mockInstructor = {
          id: 'INST001',
          name: 'ABCD',
          department: 'Computer Science'
        };
        
        setCourseDetails(mockCourse);
        setInstructorDetails(mockInstructor);
        setLoading(false);
      } catch (err) {
        setValidationError('Failed to load course details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [location.state, navigate]);

  const handleRatingChange = (questionId, rating) => {
    setFeedback(prev => ({
      ...prev,
      [questionId]: rating
    }));
  };

  const handleCommentsChange = (e) => {
    setFeedback(prev => ({
      ...prev,
      additional_comments: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all ratings are provided
    const allQuestions = feedbackSections.flatMap(section => 
      section.questions.map(q => q.id)
    );
    
    const missingRatings = allQuestions.filter(qId => !feedback[qId]);
    
    if (missingRatings.length > 0) {
      setValidationError('Please provide ratings for all questions before submitting');
      return;
    }
    
    setValidationError(null);
    setSubmitting(true);
    
    try {
      // In a real implementation, this would be an API call
      // Simulating API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Feedback submitted:', {
        courseId: location.state.courseId,
        instructorId: location.state.instructorId,
        ratings: feedback
      });
      
      // Navigate back to course selection with success message
      navigate('/courseFeedback', { 
        state: { 
          success: true, 
          message: 'Your feedback has been submitted successfully!' 
        } 
      });
    } catch (err) {
      setValidationError('Failed to submit feedback. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading form...</div>;

  return (
    <div className="feedback-container">
      <h1 className="page-title">Course Feedback Form</h1>
      
      {courseDetails && instructorDetails && (
        <div className="course-header">
          <div className="course-details">
            <h2>{courseDetails.name}</h2>
            <p>Course Code: {courseDetails.code}</p>
            <p>Semester: {courseDetails.semester}</p>
          </div>
          <div className="instructor-details">
            <h2>Instructor: {instructorDetails.name}</h2>
            <p>Department: {instructorDetails.department}</p>
          </div>
        </div>
      )}
      
      {validationError && (
        <div className="error-message">{validationError}</div>
      )}
      
      <form onSubmit={handleSubmit} className="feedback-form">
        {feedbackSections.map((section) => (
          <div key={section.title} className="feedback-section">
            <h3 className="section-title">{section.title}</h3>
            
            {section.questions.map((question) => (
              <div key={question.id} className="question-item">
                <p className="question-text">{question.text}</p>
                <div className="rating-options">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <label key={rating} className="rating-label">
                      <input
                        type="radio"
                        name={question.id}
                        value={rating}
                        checked={feedback[question.id] === rating}
                        onChange={() => handleRatingChange(question.id, rating)}
                      />
                      <span className="rating-circle">{rating}</span>
                      <span className="rating-text">
                        {rating === 1 ? 'Poor' : 
                         rating === 2 ? 'Fair' : 
                         rating === 3 ? 'Good' : 
                         rating === 4 ? 'Very Good' : 'Excellent'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
        
        <div className="comments-section">
          <h3 className="section-title">Additional Comments</h3>
          <textarea
            className="comments-input"
            rows={5}
            placeholder="Please provide any additional feedback or suggestions for improvement..."
            value={feedback.additional_comments || ''}
            onChange={handleCommentsChange}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/courseFeedback')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseFeedbackForm;