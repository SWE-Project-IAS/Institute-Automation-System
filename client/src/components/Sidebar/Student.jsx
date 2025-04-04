import React, { useState } from 'react';
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link } from 'react-router-dom';

const Student = () => {
    const [expandedSections, setExpandedSections] = useState({
        course: false,
        activeCourses: false,
        feepayment: false,
        document: false,
        hostel: false,
        complaint: false,
        profile: false
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <>
            <ul className="list-none pl-5 mt-5">
                <li>
                    <span className="font-bold text-gray-800 cursor-pointer flex items-center" onClick={() => toggleSection('course')}>
                        {expandedSections.course ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} Course
                    </span>
                    {expandedSections.course && (
                        <ul className="pl-5">
                            <li>
                                <Link to="/registration" className="text-gray-700 hover:text-gray-900">
                                    Registration
                                </Link>
                            </li>
                            <li>
                                <span className="font-bold text-gray-800 cursor-pointer flex items-center" onClick={() => toggleSection('activeCourses')}>
                                    {expandedSections.activeCourses ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} Active Courses
                                </span>
                                {expandedSections.activeCourses && (
                                <ul className="pl-5">
                                    <li>
                                    <Link to="/assigngmentlanding" className="text-gray-700 hover:text-gray-900">
                                        Assignment
                                    </Link>
                                    </li>
                                    <li>
                                    <Link to="/attendancelanding" className="text-gray-700 hover:text-gray-900">
                                        Attendance
                                    </Link>
                                    </li>
                                    <li>
                                    <Link to="/timetable" className="text-gray-700 hover:text-gray-900">
                                        Time Table
                                    </Link>
                                    </li>
                                    <li>
                                        <Link to="/dropcourse" className="text-gray-700 hover:text-gray-900">
                                            Drop Course
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/course/:courseId/announcements" className="text-gray-700 hover:text-gray-900">
                                            Announcements
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/courseFeedback" className="text-gray-700 hover:text-gray-900">Feedback</Link>
                                    </li>
                                </ul>
                                )}
                            </li>
                        </ul>
                    )}
                </li>
                
                <li className="mt-2">
                <span className="font-bold text-gray-800 cursor-pointer flex items-center" onClick={() => toggleSection('feepayment')}>
                    {expandedSections.feepayment ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} Fee Payment
                </span>
                {expandedSections.feepayment && (
                    <ul className="pl-5">
                        <li><Link to="/feepayment" className="text-gray-700 hover:text-gray-900">
                                Pay Fee
                            </Link>
                        </li>
                    </ul>
                )}
                </li>

                <li className="mt-2">
                <span className="font-bold text-gray-800 cursor-pointer flex items-center" onClick={() => toggleSection('document')}>
                    {expandedSections.document ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} Document
                </span>
                {expandedSections.document && (
                    <ul className="pl-5">
                        <li>
                            <Link to="/documents" className="text-gray-700 hover:text-gray-900">
                                All Documents
                            </Link>
                        </li>
                        <li>
                            <Link to="/documents/transcript" className="text-gray-700 hover:text-gray-900">
                                Transcript
                            </Link>
                        </li>
                        <li>
                            <Link to="/documents/idcard" className="text-gray-700 hover:text-gray-900">
                                ID Card
                            </Link>
                        </li>
                        <li>
                            <Link to="/documents/passport" className="text-gray-700 hover:text-gray-900">
                                Passport
                            </Link>
                        </li>
                        <li>
                            <Link to="/documents/bonafide" className="text-gray-700 hover:text-gray-900">
                                Bonafide
                            </Link>
                        </li>
                        <li>
                            <Link to="/documents/feereceipt" className="text-gray-700 hover:text-gray-900">
                                Fee Receipt
                            </Link>
                        </li>
                    </ul>
                )}
                </li>
                <li className="mt-2">
                <span className="font-bold text-gray-800 cursor-pointer flex items-center" onClick={() => toggleSection('hostel')}>
                    {expandedSections.hostel ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} Hostel
                </span>
                {expandedSections.hostel && (
                    <ul className="pl-5">
                        <li>
                            <Link to="/hostel/leave" className="text-gray-700 hover:text-gray-900">
                                Leave
                            </Link>
                        </li>
                        <li>
                            <Link to="/hostel/mess" className="text-gray-700 hover:text-gray-900">
                            Mess
                            </Link>
                        </li>
                        <li>
                            <Link to="/hostel/transfer" className="text-gray-700 hover:text-gray-900">
                                Transfer
                            </Link>
                        </li>
                    </ul>
                )}
                </li>
                <li className="mt-2">
                <span className="font-bold text-gray-800 cursor-pointer flex items-center" onClick={() => toggleSection('complaint')}>
                    {expandedSections.complaint ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} Complaint
                </span>
                {expandedSections.complaint && (
                    <ul className="pl-5">
                        <li>
                            <Link to="/complaint" className="text-gray-700 hover:text-gray-900">
                                Complaint Form
                            </Link>
                        </li>
                    </ul>
                )}
                </li>
                <li className="mt-2">
                <span className="font-bold text-gray-800 cursor-pointer flex items-center" onClick={() => toggleSection('profile')}>
                    {expandedSections.profile ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} Profile
                </span>
                {expandedSections.profile && (
                    <ul className="pl-5">
                        <li><Link to="/profile" className="text-gray-700 hover:text-gray-900">
                                View Profile
                            </Link>
                        </li>
                    </ul>
                )}
                </li>
            </ul>
        </>
    );
};

export default Student;