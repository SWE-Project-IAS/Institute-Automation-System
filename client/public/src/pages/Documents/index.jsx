import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const Documents = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // If we're at exactly /documents, show the grid
    if (location.pathname === '/documents') {
        const documents = [
            { 
                title: "Transcript", 
                path: "/documents/transcript",
                description: "Grade Card for all semesters - instant download"
            },
            { 
                title: "ID Card", 
                path: "/documents/idcard",
                description: "Generate your provisional ID card"
            },
            { 
                title: "Passport", 
                path: "/documents/passport",
                description: "Passport application and verification"
            },
            { 
                title: "Bonafide", 
                path: "/documents/bonafide",
                description: "Request bonafide certificate"
            },
            { 
                title: "Fee Receipt", 
                path: "/documents/feereceipt",
                description: "Download your fee receipts"
            }
        ];

        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Documents</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc) => (
                        <div 
                            key={doc.path}
                            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => navigate(doc.path)}
                        >
                            <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
                            <p className="text-gray-600">{doc.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Otherwise, render the child route
    return <Outlet />;
};

export default Documents;
