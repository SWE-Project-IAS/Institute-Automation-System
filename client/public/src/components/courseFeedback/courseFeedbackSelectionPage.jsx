import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './courseFeedback.css';

const mockCourses = [
  { 
    id: 'CS101', 
    name: 'PQRT',
    code: 'CS101',
    instructors: [
      { id: 'INST001', name: 'ABCD', department: 'Computer Science' }
    ]
  },
  { 
    id: 'CS102', 
    name: 'CDEF',
    code: 'CS102',
    instructors: [
      { id: 'INST002', name: 'GHIJ', department: 'Computer Science' }
    ]
  },
  { 
    id: 'CS103', 
    name: 'DHST',
    code: 'CS103',
    instructors: [
      { id: 'INST003', name: 'ABYD', department: 'Computer Science' }
    ]
  }
];

const CourseFeedbackSelectionPage = () => {
  const navigate = useNavigate();

  const handleProceed = (courseId, instructorId) => {
    navigate('/courseFeedback/selectedCourse', { 
      state: { courseId, instructorId } 
    });
  };

  return (
    <div className="p-5">
        <h2 className="text-xl font-bold mb-4">Course Feedback</h2>
        <div className="course-list">
          {mockCourses.map((course) => (
            course.instructors.map((instructor) => (
              <div key={`${course.id}-${instructor.id}`} className="course-row">
                <span className="course-code">{course.code}</span>
                <span className="instructor-name">{instructor.name}</span>
                <button 
                  className="proceed-btn" 
                  onClick={() => handleProceed(course.id, instructor.id)}
                >
                  Proceed
                </button>
              </div>
            ))
          ))}
        </div>
    </div>
  );
};

export default CourseFeedbackSelectionPage;
