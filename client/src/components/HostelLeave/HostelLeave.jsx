import React, { useContext, useState } from 'react';
import { RoleContext } from '../../context/Rolecontext';
import HostelLeaveStudent from './HostelLeaveStudent';
import HostelLeaveAdmin from './HostelLeaveAdmin';

function HostelLeave() {
    const {role}=useContext(RoleContext);

    if (role === "student") {
        return <HostelLeaveStudent />;
    }
    if (role === "nonAcadAdmin") {
        return <HostelLeaveAdmin />;
    }
}

export default HostelLeave;
