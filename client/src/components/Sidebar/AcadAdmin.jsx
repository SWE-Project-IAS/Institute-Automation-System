import React, { useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link } from "react-router-dom";

const AcadAdmin = () => {
  const [expandedSections, setExpandedSections] = useState({
    course: false,
    documents: false,
    complaint: false,
    profile: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
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
                            <li>Registration</li>
                            <li>Create course</li>
                            <Link to="/attendancelanding" className="text-gray-700 hover:text-gray-900">
                                Attendance
                                </Link>
                            <li>
                                <Link to="/feedbackConfiguration" className="text-gray-700 hover:text-gray-900">Feedback</Link>
                            </li>
                            <li>Announcements</li>
                        </ul>
                    )}
                </li>
                <li className="mt-2">
                <span className="font-bold text-gray-800 cursor-pointer flex items-center" onClick={() => toggleSection('documents')}>
                    {expandedSections.documents ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} Documents
                </span>
                {expandedSections.documents && (
            <ul className="pl-5">
              <li >
                <Link
                  to="/admin/documents"
                  className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
                >
                  Manage Applications
                </Link>
              </li>
              <li >
                <Link
                  to="/admin/documents/access"
                  className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
                >
                  Access Control
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
                        <li>View Complaints</li>
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

export default AcadAdmin;
