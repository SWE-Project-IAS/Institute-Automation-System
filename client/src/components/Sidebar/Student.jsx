import React, { useState } from 'react';
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link } from 'react-router-dom';

const Student = () => {
    const [expandedSections, setExpandedSections] = useState({
        course: false,
        activeCourses: false,
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
                                <Link to="/registration" className="text-blue-500 hover:underline">
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
                                    <Link to="/assigngmentlanding" className="text-blue-500 hover:underline">
                                        Assignment
                                    </Link>
                                    </li>
                                    <li>
                                    <Link to="/attendancelanding" className="text-blue-500 hover:underline">
                                        Attendance
                                    </Link>
                                    </li>
                                    <li>Drop Course</li>
                                    <li>Announcements</li>
                                    <li>
                                        <Link to="/courseFeedback" className="text-blue-500 hover:underline">Feedback</Link>
                                    </li>
                                </ul>
                                )}
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
                            <Link to="/hostel/leave" className="text-blue-500 hover:underline">
                                Leave
                            </Link>
                        </li>
                        <li>
                            <Link to="/hostel/mess" className="text-blue-500 hover:underline">
                            Mess
                            </Link>
                        </li>
                        <li>
                            <Link to="/hostel/transfer" className="text-blue-500 hover:underline">
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
                            <Link to="/complaint" className="text-blue-500 hover:underline">
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
                        <li>View Profile</li>
                    </ul>
                )}
                </li>
            </ul>
        </>
    );
};

export default Student;