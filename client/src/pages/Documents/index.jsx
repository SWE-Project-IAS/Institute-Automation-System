import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
// Import icons
import {
    FaFileAlt,
    FaIdCard,
    FaPassport,
    FaCertificate,
    FaReceipt,
    FaArrowRight
} from 'react-icons/fa';

const Documents = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // If we're at exactly /documents, show the grid
    if (location.pathname === '/documents') {
        const documents = [
             {
                title: "Transcript",
                path: "/documents/transcript",
                description: "Grade Card for all semesters - instant download",
                icon: <FaFileAlt className="text-blue-500 text-4xl mb-4" />
            },
            {
                title: "ID Card",
                path: "/documents/idcard",
                description: "Generate your provisional ID card",
                icon: <FaIdCard className="text-green-500 text-4xl mb-4" />
            },
            {
                title: "Passport",
                path: "/documents/passport",
                description: "Passport application and verification",
                icon: <FaPassport className="text-red-500 text-4xl mb-4" />
            },
            {
                title: "Bonafide",
                path: "/documents/bonafide",
                description: "Request bonafide certificate",
                icon: <FaCertificate className="text-purple-500 text-4xl mb-4" />
            },
            {
                title: "Fee Receipt",
                path: "/documents/feereceipt",
                description: "Download your fee receipts",
                icon: <FaReceipt className="text-yellow-500 text-4xl mb-4" />
            }
            // Add other documents here
        ];

        return (
            <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
                        Documents
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {documents.map((doc) => (
                            <div
                                key={doc.path}
                                className="bg-white p-6 rounded-xl shadow-lg cursor-pointer
                                           hover:shadow-2xl hover:scale-105 /* Increased scale effect */
                                           transform transition-all duration-300 ease-in-out /* Ensures smooth transition */
                                           flex flex-col items-center text-center group"
                                onClick={() => navigate(doc.path)}
                            >
                                {/* Document Type Icon */}
                                {doc.icon}

                                <h2 className="text-xl font-semibold text-gray-900 mb-2">{doc.title}</h2>
                                <p className="text-gray-600 text-sm mb-4">{doc.description}</p>

                                {/* Container for "View" text and arrow */}
                                <div
                                    className="mt-auto flex items-center gap-2 text-blue-600
                                               transition-transform duration-300 ease-in-out
                                               group-hover:translate-x-1" // Arrow/text still moves on group hover
                                >
                                    <span className="text-sm font-medium">View</span>
                                    <FaArrowRight className="text-lg" /> {/* Arrow icon */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Otherwise, render the child route
    return (
        <div className="p-6">
            <Outlet />
        </div>
    );
};

export default Documents;