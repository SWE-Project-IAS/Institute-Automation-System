import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './courseFeedback.css';

const FeedbackReports = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  
  useEffect(() => {
    // Authentication check
    const userToken = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');
    
    // if (!userToken || userRole !== 'instructor') {
    //   navigate('/login', { state: { message: 'Please login as an instructor to access this page' } });
    //   return;
    // }
    
    // Fetch instructor's courses
    const fetchCourses = async () => {
      try {
        // In a real implementation, this would be an API call
        // Mock data for demonstration
        const mockCourses = [
          { id: 'CS101', name: 'Introduction to Computer Science', code: 'CS101', semester: 'Spring 2025' },
          { id: 'CS102', name: 'Data Structures', code: 'CS102', semester: 'Spring 2025' }
        ];
        
        setCourses(mockCourses);
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [navigate]);

  const handleCourseSelect = async (courseId) => {
    setSelectedCourse(courseId);
    setLoading(true);
    
    try {
      // In a real implementation, this would be an API call
      // Mock data for demonstration
      const mockFeedbackData = {
        courseInfo: courses.find(c => c.id === courseId),
        summary: {
          responseCount: 25,
          averageRating: 4.2,
          completionRate: '78%'
        },
        categories: [
          {
            name: 'Course Content',
            averageRating: 4.3,
            questions: [
              { id: 'course_content', text: 'Relevance of course content', average: 4.5 },
              { id: 'course_materials', text: 'Quality of materials', average: 4.1 }
            ]
          },
          {
            name: 'Instructor Evaluation',
            averageRating: 4.4,
            questions: [
              { id: 'teaching_quality', text: 'Clarity of instruction', average: 4.6 },
              { id: 'instructor_knowledge', text: 'Knowledge of subject', average: 4.8 },
              { id: 'instructor_availability', text: 'Availability', average: 3.9 }
            ]
          }
        ],
        comments: [
          "The course was well-structured and engaging.",
          "Would appreciate more practical examples.",
          "Excellent explanations of complex topics."
        ]
      };
      
      setFeedbackData(mockFeedbackData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load feedback data. Please try again later.');
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    if (!selectedCourse) return;
    
    setExportLoading(true);
    
    try {
      // In a real implementation, this would trigger a download
      // Simulating export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Report exported successfully!');
      setExportLoading(false);
    } catch (err) {
      alert('Failed to export report. Please try again.');
      setExportLoading(false);
    }
  };

  if (loading && !feedbackData) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="feedback-container">
      <h1 className="page-title">Feedback Reports</h1>
      
      <div className="courses-selection">
        <h2>Your Courses</h2>
        <div className="course-buttons">
          {courses.map(course => (
            <button
              key={course.id}
              className={`course-btn ${selectedCourse === course.id ? 'selected' : ''}`}
              onClick={() => handleCourseSelect(course.id)}
            >
              {course.code} - {course.name}
            </button>
          ))}
        </div>
      </div>
      
      {loading && selectedCourse && <div className="loading">Loading feedback data...</div>}
      
      {feedbackData && (
        <div className="feedback-report">
          <div className="report-header">
            <div>
              <h2>{feedbackData.courseInfo.name} ({feedbackData.courseInfo.code})</h2>
              <p>Semester: {feedbackData.courseInfo.semester}</p>
            </div>
            <button 
              className="export-btn"
              onClick={handleExportReport}
              disabled={exportLoading}
            >
              {exportLoading ? 'Exporting...' : 'Export Report'}
            </button>
          </div>
          
          <div className="report-summary">
            <h3>Summary</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-value">{feedbackData.summary.responseCount}</span>
                <span className="stat-label">Responses</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{feedbackData.summary.averageRating}</span>
                <span className="stat-label">Average Rating</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{feedbackData.summary.completionRate}</span>
                <span className="stat-label">Completion Rate</span>
              </div>
            </div>
          </div>
          
          <div className="report-categories">
            {feedbackData.categories.map(category => (
              <div key={category.name} className="category-section">
                <h3>{category.name} <span className="category-avg">({category.averageRating}/5)</span></h3>
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Average Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.questions.map(question => (
                      <tr key={question.id}>
                        <td>{question.text}</td>
                        <td className="rating-cell">
                          <div className="rating-display">
                            <div 
                              className="rating-bar" 
                              style={{width: `${(question.average/5)*100}%`}}
                            ></div>
                            <span className="rating-value">{question.average}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          
          <div className="report-comments">
            <h3>Student Comments</h3>
            {feedbackData.comments.length > 0 ? (
              <ul className="comments-list">
                {feedbackData.comments.map((comment, index) => (
                  <li key={index} className="comment-item">{comment}</li>
                ))}
              </ul>
            ) : (
              <p className="no-comments">No comments provided by students.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackReports;