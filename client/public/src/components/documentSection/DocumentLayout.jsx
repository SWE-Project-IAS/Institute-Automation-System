import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DocumentLayout = ({ children, title }) => {
    const location = useLocation();
    
    return (
        <div className="container mx-auto p-6">
            {/* Breadcrumb */}
            <div className="flex items-center mb-6 text-sm">
                <Link to="/documents" className="text-blue-600 hover:text-blue-800">
                    Documents
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-600">{title}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-6">
                {title}
                <div className="w-16 h-1 bg-indigo-500 mx-auto mt-2 rounded-full"></div>
            </h1>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
                {children}
            </div>
        </div>
    );
};

export default DocumentLayout;
