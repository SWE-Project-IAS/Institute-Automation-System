import React, { useState } from 'react';
import './HostelLeave.css';

function HostelLeave() {
    const [requests, setRequests] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        studentId: '',
        startDate: '',
        endDate: '',
        reason: '',
        hostelName: '',
    });

    const handleOpenForm = () => {
        setShowForm(true);
    };

    const handleDiscard = () => {
        setShowForm(false);
        setFormData({
            name: '',
            studentId: '',
            startDate: '',
            endDate: '',
            reason: '',
            hostelName: '',
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newRequest = {
            id: Date.now(),
            status: 'Pending',
        };
        setRequests([...requests, newRequest]);
        handleDiscard();
    };

    return (
        <div className="page-wrapper">

            <div className="main-container">
                <h2 className="heading">Requests</h2>
                <hr className="horizontal-line" />

                {requests.length === 0 ? (
                    <p className="no-requests">No pending requests</p>
                ) : (
                    <div className="requests-list">
                        {requests.map((req) => (
                            <div key={req.id} className="request-card">
                                <p><strong>ID:</strong> {req.id}</p>
                                <p><strong>Status:</strong> {req.status}</p>
                            </div>
                        ))}
                    </div>
                )}

                {!showForm && (
                    <button className="apply-button" onClick={handleOpenForm}>
                        Apply for Leave
                    </button>
                )}

                {showForm && (
                    <div className="form-container">
                        <h3 className="form-heading">Leave Application</h3>
                        <form onSubmit={handleSubmit} className="form">
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label>Student ID</label>
                                <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label>Start Date</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label>End Date</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label>Reason for Leave</label>
                                <textarea name="reason" value={formData.reason} onChange={handleChange} rows="3" required />
                            </div>

                            <div className="button-row">
                                <button type="button" className="discard-button" onClick={handleDiscard}>Discard</button>
                                <button type="submit" className="submit-button">Submit</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HostelLeave;
