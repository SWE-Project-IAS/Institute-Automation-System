import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './courseFeedback.css';

const mockCourses = [
  { 
    id: 'CS101', 
    name: 'Introduction to Computer Science', 
    code: 'CS 101',
    semester: 'Autumn 2024'
  }
];

const mockInstructors = [
  { 
    id: 'INST001', 
    name: 'ABCD', 
    department: 'Computer Science' 
  }
];

const CourseFeedbackFormPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [feedback, setFeedback] = useState({});
  const [validationError, setValidationError] = useState(null);

  // Grouped feedback questions
  const feedbackSections = [
    {
      title: 'About Course',
      questions: [
        { id: 'course_content', text: 'Course Content and Relevance' },
        { id: 'course_materials', text: 'Quality of Course Materials' }
      ]
    },
    {
      title: 'About Instructor',
      questions: [
        { id: 'teaching_quality', text: 'Quality of Teaching' },
        { id: 'instructor_interaction', text: 'Instructor Interaction and Accessibility' }
      ]
    },
    {
      title: 'About TA',
      questions: [
        { id: 'about_ta', text: 'Effectiveness of Teaching Assistant (TA)' }
      ]
    }
  ];

  // Verify course and instructor selection
  useEffect(() => {
    const { courseId, instructorId } = location.state || {};
    if (!courseId || !instructorId) {
      navigate('/courseFeedback');
    }
  }, [location, navigate]);

  const handleRatingChange = (questionId, rating) => {
    setFeedback(prev => ({
      ...prev,
      [questionId]: rating
    }));
  };

  const handleAdditionalCommentsChange = (comments) => {
    setFeedback(prev => ({
      ...prev,
      additional_comments: comments
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all questions have a rating
    const missingRatings = feedbackSections.some(section =>
      section.questions.some(q => !feedback[q.id])
    );

    if (missingRatings) {
      setValidationError('Please rate all aspects of the course');
      return;
    }

    setValidationError(null);

    console.log('Feedback Submitted:', feedback);
    alert('Feedback Submitted Successfully!');
    navigate('/courseFeedback');
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Course Feedback</h1>
      
      {/* Course and Instructor Details */}
      <div className="feedback-header">
        <div className="course-details">
          <h2>{mockCourses[0].name}</h2>
          <p>Course Code: {mockCourses[0].code}</p>
          <p>Semester: {mockCourses[0].semester}</p>
        </div>
        <div className="instructor-details">
          <h2>{mockInstructors[0].name}</h2>
          <p>Department: {mockInstructors[0].department}</p>
        </div>
      </div>

      {validationError && <div className="validation-error">{validationError}</div>}

      <form onSubmit={handleSubmit} className="feedback-form">
        {feedbackSections.map((section) => (
          <div key={section.title} className="feedback-section">
            <h2 className="section-title">{section.title}</h2>
            {section.questions.map((question) => (
              <div key={question.id} className="feedback-question">
                <label>{question.text}</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <label key={rating} className="rating-option">
                      <input
                        type="radio"
                        name={`rating-${question.id}`}
                        value={rating}
                        checked={feedback[question.id] === rating}
                        onChange={() => handleRatingChange(question.id, rating)}
                      />
                      <span className="circular-rating">{rating}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="feedback-question additional-comments">
          <label>Additional Comments</label>
          <textarea
            rows={4}
            placeholder="Share your detailed feedback here..."
            value={feedback.additional_comments || ''}
            onChange={(e) => handleAdditionalCommentsChange(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-feedback-btn">
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default CourseFeedbackFormPage;
