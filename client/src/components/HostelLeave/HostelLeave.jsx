import React, { useContext, useState } from 'react';
import { RoleContext } from '../../context/Rolecontext';
import HostelLeaveStudent from './HostelLeaveStudent';
import HostelLeaveAdmin from './HostelLeaveAdmin';

function HostelLeave() {
    const { role } = useContext(RoleContext);


    if (role === "student") {
        return (
            <>
                <h1 className="text-4xl font-extrabold text-center text-blue-900 my-6">
                    Hostel Leave
                    <div className="w-16 h-1 bg-indigo-500 mx-auto mt-2 rounded-full"></div>
                </h1>
                <HostelLeaveStudent />;
            </>
        )
    }
    if (role === "nonAcadAdmin") {
        return (
            <>
                <h1 className="text-4xl font-extrabold text-center text-blue-900 my-6">
                    Hostel Leave
                    <div className="w-16 h-1 bg-indigo-500 mx-auto mt-2 rounded-full"></div>
                </h1>
                <HostelLeaveAdmin />;
            </>
        )
    }
}

export default HostelLeave;
