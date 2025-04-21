import React, { useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link } from "react-router-dom";

const HostelAdmin = () => {
    const [expandedSections, setExpandedSections] = useState({
        hostel: false,
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
                <li className="mt-2">
                <span className="font-bold text-gray-800 cursor-pointer flex items-center" onClick={() => toggleSection('hostel')}>
                    {expandedSections.hostel ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} Hostel
                </span>
                {expandedSections.hostel && (
                    <ul className="pl-5">
                        <Link to="/hostel/leave" className='text-gray-700 hover:text-gray-900'>
                            <li>Leave</li>
                        </Link>
                        <Link to="/hostel/mess" className='text-gray-700 hover:text-gray-900'>
                            <li>Mess</li>
                        </Link>
                        <Link to="/hostel/transfer" className='text-gray-700 hover:text-gray-900'>
                            <li>Transfer</li>
                        </Link>
                    </ul>
                )}
                </li>
                <li className="mt-2">
                    <span
                        className="font-bold text-gray-800 cursor-pointer flex items-center"
                        onClick={() => toggleSection("complaint")}
                    >
                        {expandedSections.complaint ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} Complaint
                    </span>
                    {expandedSections.complaint && (
                        <ul className="pl-5">
                            <li>
                                <Link
                                    to="/complaint"
                                    className="text-gray-700 hover:text-gray-900"
                                >
                                    View Complaints
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>
                <li className="mt-2">
                    <span
                        className="font-bold text-gray-800 cursor-pointer flex items-center"
                        onClick={() => toggleSection("profile")}
                    >
                        {expandedSections.profile ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} Profile
                    </span>
                    {expandedSections.profile && (
                        <ul className="pl-5">
                            <li>
                                <Link
                                    to="/profile"
                                    className="text-gray-700 hover:text-gray-900"
                                >
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

export default HostelAdmin;
