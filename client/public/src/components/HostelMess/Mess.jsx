import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import StudentSubscriptionForm from './StudentSubscriptionForm';
import AdminSubscriptionRequests from './AdminSubscriptionRequests';
import './styles/Mess.css';

function Mess() {
  return (
    <div className="app-container">
      <nav className="main-nav">
        <div className="nav-content">
          <h1>Mess Subscription System</h1>
          <div className="nav-links">
            <Link to="/hostel/mess/student" className="nav-link">Student Request</Link>
            <Link to="/hostel/mess/admin" className="nav-link">Admin Requests</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="student" element={<StudentSubscriptionForm />} />
        <Route path="admin" element={<AdminSubscriptionRequests />} />
        <Route path="" element={<div className="home-page">Select a Role</div>} />
      </Routes>
    </div>
  );
}

export default Mess;