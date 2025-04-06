import React from 'react';
import { Link } from 'react-router-dom';

const AdminLayout = ({ children, title }) => {
    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm">
                    <Link to="/admin/documents" className="text-primary hover:text-primary-focus">
                        Admin
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600">{title}</span>
                </div>
            </div>
            <div className="bg-base-100 rounded-xl shadow-lg border border-base-300">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
