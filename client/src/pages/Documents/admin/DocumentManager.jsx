import React, { useState, useContext } from 'react';
import { RoleContext } from '../../../context/Rolecontext';
import AdminLayout from '../../../components/documentSection/admin/AdminLayout';
import ApplicationsList from '../../../components/documentSection/admin/ApplicationsList';
import ApplicationDetails from '../../../components/documentSection/admin/ApplicationDetails';
import ViewApplication from '../../../components/documentSection/admin/ViewApplication';

const DocumentManager = () => {
    const { role , setRole} = useContext(RoleContext);
    const [selectedApp, setSelectedApp] = useState(null);
    const [viewingApp, setViewingApp] = useState(null);
    setRole("acadAdmin")

    // Check if user has admin access
    if (!['acadAdmin'].includes(role)) {
        return <div>Access Denied</div>;
    }

    return (
        <AdminLayout title="Document Applications Manager">
            {selectedApp ? (
                <ApplicationDetails 
                    application={selectedApp}
                    onClose={() => setSelectedApp(null)}
                    onViewFull={() => {
                        setViewingApp(selectedApp);
                        setSelectedApp(null);
                    }}
                />
            ) : viewingApp ? (
                <ViewApplication
                    application={viewingApp}
                    onClose={() => setViewingApp(null)}
                    onManage={() => {
                        setSelectedApp(viewingApp);
                        setViewingApp(null);
                    }}
                />
            ) : (
                <ApplicationsList 
                    onSelect={setSelectedApp}
                    onView={setViewingApp}
                />
            )}
        </AdminLayout>
    );
};

export default DocumentManager;
