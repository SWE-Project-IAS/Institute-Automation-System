import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './courseFeedback.css';

const FeedbackConfiguration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formConfig, setFormConfig] = useState({
    sections: [],
    isActive: false,
    deadlineDate: '',
    notifyInstructors: false,
    notifyStudents: false
  });
  
  // For adding new sections and questions
  const [newSection, setNewSection] = useState({ title: '', questions: [] });
  const [newQuestion, setNewQuestion] = useState('');
  
  useEffect(() => {
    // Authentication check
    const userToken = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');
    
    // if (!userToken || userRole !== 'admin') {
    //   navigate('/login', { state: { message: 'Please login as an admin to access this page' } });
    //   return;
    // }
    
    // Fetch current feedback configuration
    const fetchConfig = async () => {
      try {
        // In a real implementation, this would be an API call
        // Mock data for demonstration
        const mockConfig = {
          sections: [
            {
              id: 's1',
              title: 'Course Content',
              questions: [
                { id: 'q1', text: 'Relevance of course content to your program' },
                { id: 'q2', text: 'Quality and accessibility of course materials' }
              ]
            },
            {
              id: 's2',
              title: 'Instructor Evaluation',
              questions: [
                { id: 'q3', text: 'Clarity of instruction and explanations' },
                { id: 'q4', text: 'Instructor\'s availability and responsiveness' }
              ]
            }
          ],
          isActive: true,
          deadlineDate: '2025-05-15',
          notifyInstructors: true,
          notifyStudents: true
        };
        
        setFormConfig(mockConfig);
        setLoading(false);
      } catch (err) {
        setError('Failed to load configuration. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchConfig();
  }, [navigate]);

  const handleSectionTitleChange = (e) => {
    setNewSection({ ...newSection, title: e.target.value });
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() === '') return;
    
    setNewSection({
      ...newSection,
      questions: [
        ...newSection.questions,
        { id: `new-q-${Date.now()}`, text: newQuestion }
      ]
    });
    
    setNewQuestion('');
  };

  const handleAddSection = () => {
    if (newSection.title.trim() === '' || newSection.questions.length === 0) {
      setError('Section title and at least one question are required');
      return;
    }
    
    setFormConfig({
      ...formConfig,
      sections: [
        ...formConfig.sections,
        {
          id: `new-s-${Date.now()}`,
          title: newSection.title,
          questions: newSection.questions
        }
      ]
    });
    
    setNewSection({ title: '', questions: [] });
    setError(null);
  };

  const handleRemoveQuestion = (sectionId, questionId) => {
    setFormConfig({
      ...formConfig,
      sections: formConfig.sections.map(section => 
        section.id === sectionId
          ? { 
              ...section, 
              questions: section.questions.filter(q => q.id !== questionId) 
            }
          : section
      ).filter(section => section.questions.length > 0)
    });
  };

  const handleToggleActive = () => {
    setFormConfig({
      ...formConfig,
      isActive: !formConfig.isActive
    });
  };

  const handleDeadlineChange = (e) => {
    setFormConfig({
      ...formConfig,
      deadlineDate: e.target.value
    });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setFormConfig({
      ...formConfig,
      [name]: checked
    });
  };

  const handleSaveConfiguration = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // In a real implementation, this would be an API call
      // Simulating API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Updated configuration:', formConfig);
      
      setSuccess('Feedback configuration saved successfully!');
      setSaving(false);
    } catch (err) {
      setError('Failed to save configuration. Please try again.');
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading configuration...</div>;

  return (
    <div className="feedback-container">
      <h1 className="page-title">Feedback System Configuration</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="config-section">
        <h2>Feedback Cycle Settings</h2>
        <div className="config-form">
          <div className="form-row">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={formConfig.isActive}
                onChange={handleToggleActive}
              />
              <span className="toggle-slider">
                <span className="toggle-label">
                  {formConfig.isActive ? 'Active' : 'Inactive'}
                </span>
              </span>
            </label>
          </div>
          
          <div className="form-row">
            <label>Submission Deadline:</label>
            <input 
              type="date" 
              className="date-input"
              value={formConfig.deadlineDate}
              onChange={handleDeadlineChange}
            />
          </div>
          
          <div className="form-row">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                name="notifyInstructors"
                checked={formConfig.notifyInstructors}
                onChange={handleNotificationChange}
              />
              Notify instructors when feedback cycle starts
            </label>
          </div>
          
          <div className="form-row">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                name="notifyStudents"
                checked={formConfig.notifyStudents}
                onChange={handleNotificationChange}
              />
              Notify students when feedback cycle starts
            </label>
          </div>
        </div>
      </div>
      
      <div className="config-section">
        <h2>Form Structure</h2>
        
        <div className="current-sections">
          <h3>Current Sections</h3>
          {formConfig.sections.length === 0 ? (
            <p className="no-sections">No sections configured yet.</p>
          ) : (
            formConfig.sections.map(section => (
              <div key={section.id} className="form-section-display">
                <h4>{section.title}</h4>
                <ul className="questions-list">
                  {section.questions.map(question => (
                    <li key={question.id} className="question-item-config">
                      <span>{question.text}</span>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveQuestion(section.id, question.id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
        
        <div className="add-section">
          <h3>Add New Section</h3>
          <div className="form-row">
            <label>Section Title:</label>
            <input 
              type="text"
              className="text-input"
              placeholder="e.g., Course Content"
              value={newSection.title}
              onChange={handleSectionTitleChange}
            />
          </div>
          
          <div className="add-questions">
            <h4>Questions</h4>
            <div className="form-row">
              <input 
                type="text"
                className="text-input"
                placeholder="e.g., Rate the quality of course materials"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
              <button 
                className="add-btn"
                onClick={handleAddQuestion}
              >
                Add Question
              </button>
            </div>
            
            <ul className="new-questions-list">
              {newSection.questions.map((q, index) => (
                <li key={index}>{q.text}</li>
              ))}
            </ul>
          </div>
          
          <button 
            className="add-section-btn"
            onClick={handleAddSection}
            disabled={newSection.title === '' || newSection.questions.length === 0}
          >
            Add Section to Form
          </button>
        </div>
      </div>
      
      <div className="config-actions">
        <button 
          className="save-config-btn"
          onClick={handleSaveConfiguration}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
};

export default FeedbackConfiguration;