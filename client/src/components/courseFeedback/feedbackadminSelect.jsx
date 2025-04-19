import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './feedback.css';

const FeedbackAdminSelect = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAvailableCourses();
  }, []);

  const fetchAvailableCourses = async () => {
    try {
      const response = await fetch('/acadAdmin/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data.courses || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load available courses');
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleCourseSelect = (course) => {
    navigate('/acadAdmin/feedback/view', {
      state: {
        courseName: course.title,
        courseCode: course.courseCode,
        facultyId: course.facultyId,
        semester: course.semester,
        department: course.department,
      }
    });
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading available courses...</div>;

  return (
    <div className="course-selection-container">
      <h2>Select a Course to View Feedback</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search courses by name or code..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      {filteredCourses.length === 0 ? (
        <div className="no-courses">
          {searchTerm ? 'No courses match your search criteria.' : 'No courses available.'}
        </div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="course-card"
              onClick={() => handleCourseSelect(course)}
            >
              <h3>{course.title}</h3>
              <p className="course-code">{course.code}</p>
              <p className="course-instructor">Instructor: {course.instructor}</p>
              <div className="course-stats">
                <span>{course.enrolledStudents} students</span>
                <span>{course.feedbackCount || 0} feedback submissions</span>
              </div>
              <button className="view-feedback-btn">View Feedback</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackAdminSelect;
