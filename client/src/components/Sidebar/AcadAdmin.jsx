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
    feecontrol: false,
    studentManagement: false,
    facultycontrol: false
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
                            {/* <li>Registration</li> */}
                            <li>
                                <Link to="/adminregistration" className="text-gray-700 hover:text-gray-900">
                                  Create course
                                </Link>
                            </li>
                            <Link to="/attendancelanding" className="text-gray-700 hover:text-gray-900">
                                Attendance
                                </Link>
                            <li>
                                <Link to="/dropcourseApprovals" className="text-gray-700 hover:text-gray-900">Drop Course</Link>
                            </li>
                            <li>
                                <Link to="/acadAdmin/feedback/view" className="text-gray-700 hover:text-gray-900">Controls</Link>
                            </li>
                            <li>
                                <Link to="/announcements" className="text-gray-700 hover:text-gray-900">Announcements</Link>
                            </li>
                        </ul>
                    )}
                </li>
                <li className="mt-2">
                <span className="font-bold text-gray-800 cursor-pointer flex items-center" onClick={() => toggleSection('documents')}>
                    {expandedSections.documents ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} Documents
                </span>
                {expandedSections.documents && (
            <ul className="pl-5">
              <li>
                <Link to="/admin/documents" className="text-gray-700 hover:text-gray-900 flex items-center gap-2">
                  Manage Applications
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li className="mt-2">
          <span className="font-bold text-gray-800 cursor-pointer flex items-center" onClick={() => toggleSection('studentManagement')}>
            {expandedSections.studentManagement ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} Student Management
          </span>
          {expandedSections.studentManagement && (
            <ul className="pl-5">
              <li>
                <Link to="/acadAdmin/add-students" className="text-gray-700 hover:text-gray-900 flex items-center gap-2">
                  Add Students
                </Link>
              </li>
              <li>
                <Link to="/admin/documents/access" className="text-gray-700 hover:text-gray-900 flex items-center gap-2">
                  Update Student 
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li className="mt-2">
          <span className="font-bold text-gray-800 cursor-pointer flex items-center" onClick={() => toggleSection('feecontrol')}>
            {expandedSections.feecontrol ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} Fees Management
          </span>
          {expandedSections.feecontrol && (
            <ul className="pl-5">
              <li>
                <Link to="/acadAdmin/feeManagement" className="text-gray-700 hover:text-gray-900">
                  Fee Control
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li className="mt-2">
          <span className="font-bold text-gray-800 cursor-pointer flex items-center" onClick={() => toggleSection('facultycontrol')}>
            {expandedSections.facultycontrol ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} Faculty Management
          </span>
          {expandedSections.facultycontrol && (
            <ul className="pl-5">
              <li>
                <Link to="/acadAdmin/facultyManagement" className="text-gray-700 hover:text-gray-900">
                  Add Faculty
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* <li className="mt-2">
          <span className="font-bold text-gray-800 cursor-pointer flex items-center" onClick={() => toggleSection('complaint')}>
            {expandedSections.complaint ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} Complaint
          </span>
          {expandedSections.complaint && (
            <ul className="pl-5">
              <li>View Complaints</li>
            </ul>
          )}
        </li> */}

        <li className="mt-2">
          <span className="font-bold text-gray-800 cursor-pointer flex items-center" onClick={() => toggleSection('profile')}>
            {expandedSections.profile ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} Profile
          </span>
          {expandedSections.profile && (
            <ul className="pl-5">
              <li>
                <Link to="/profile" className="text-gray-700 hover:text-gray-900">
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

export default AcadAdmin;
