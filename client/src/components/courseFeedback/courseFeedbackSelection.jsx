// CourseFeedbackSelection.jsx - For students to select courses for feedback
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './courseFeedback.css';

const CourseFeedbackSelection = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Authentication check
    const userToken = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');
    
    // if (!userToken || userRole !== 'student') {
    //   navigate('/login', { state: { message: 'Please login as a student to access this page' } });
    //   return;
    // }
    
    // Fetch available courses
    const fetchCourses = async () => {
      try {
        // In a real implementation, this would be an API call
        // Mock data for demonstration
        const mockCourses = [
          { 
            id: 'CS101', 
            name: 'Introduction to Computer Science',
            code: 'CS101',
            instructors: [
              { id: 'INST001', name: 'ABCD', department: 'Computer Science' }
            ]
          },
          { 
            id: 'CS102', 
            name: 'Data Structures',
            code: 'CS102',
            instructors: [
              { id: 'INST002', name: 'ABCD', department: 'Computer Science' }
            ]
          },
          { 
            id: 'MATH101', 
            name: 'Calculus I',
            code: 'MATH101',
            instructors: [
              { id: 'INST003', name: 'ABCD', department: 'Mathematics' }
            ]
          }
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

  const handleCourseSelection = (courseId, instructorId) => {
    navigate('/courseFeedback/selectedCourse', { 
      state: { courseId, instructorId } 
    });
  };

  if (loading) return <div className="loading">Loading available courses...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="feedback-container">
      <h1 className="page-title">Course Feedback Selection</h1>
      <p className="page-description">Select a course to provide feedback:</p>
      
      <div className="course-list">
        {courses.length === 0 ? (
          <p className="no-courses">No courses available for feedback at this time.</p>
        ) : (
          courses.map((course) => (
            course.instructors.map((instructor) => (
              <div key={`${course.id}-${instructor.id}`} className="course-card">
                <div className="course-info">
                  <h3>{course.name} ({course.code})</h3>
                  <p>Instructor: {instructor.name}</p>
                  <p>Department: {instructor.department}</p>
                </div>
                <button 
                  className="select-course-btn"
                  onClick={() => handleCourseSelection(course.id, instructor.id)}
                >
                  Provide Feedback
                </button>
              </div>
            ))
          ))
        )}
      </div>
    </div>
  );
};

export default CourseFeedbackSelection;