import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './feedback.css';
import newRequest from '../../utils/newRequest';

const FeedbackFacultySelect = () => {
  const navigate = useNavigate();
  const [facultyId, setfacultyId] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get facultyId from localStorage on mount
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("currentUser"));
      // Adjust the path below based on your storage structure
      const { user } = userData.data;
      setfacultyId(user.userId); // or user._id
    } catch (err) {
      setError("Could not retrieve instructor information");
      setLoading(false);
    }
  }, []);

  // Fetch courses for this instructor
  useEffect(() => {
    if (!facultyId) return;
    const fetchCourses = async () => {
      try {
        const response = await newRequest.get(`/faculty/${facultyId}/courses`);
        setCourses(response.data.courses || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses');
        setLoading(false);
      }
    };
    fetchCourses();
  }, [facultyId]);

  // Handle navigation to feedback view
  const handleCourseSelection = (course, instructor) => {
    navigate('/faculty/feedback/view', {
      state: {
        facultyId: facultyId,
        courseCode: course.courseCode,
        courseName: course.name,
        instructor: instructor.name,
        semester: course.semester,
        department: instructor.department,
      }
    });
  };

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="feedback-select-container">
      <h2>Select a course to view feedback:</h2>
      {courses.length === 0 ? (
        <div className="no-courses">No courses available with feedback at this time.</div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) =>
            (course.instructors || []).map((instructor) => (
              <div
                key={`${course.id}-${instructor.id}`}
                className="course-card"
              >
                <h3>{course.name}</h3>
                <p>Course Code: {course.code}</p>
                <p>Semester: {course.semester}</p>
                <p>Instructor: {instructor.name}</p>
                <p>Department: {instructor.department}</p>
                <p>Responses: {course.responseCount || 0}</p>
                <button
                  className="provide-feedback-btn"
                  onClick={() => handleCourseSelection(course, instructor)}
                >
                  View Feedback
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackFacultySelect;
