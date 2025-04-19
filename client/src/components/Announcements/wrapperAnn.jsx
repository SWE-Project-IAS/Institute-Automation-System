import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Unauthorized from './unauth';
import { RoleContext } from '../../context/Rolecontext';
import AllAnnouncements from './AllAnnouncements';
import AdminAnnouncements from './acadAdminAnn';
import FacultyAnnouncements from './AllFacAnn';
const SideAnnouncementWrapper = () => {
  const { role } = useContext(RoleContext);
  const navigate = useNavigate();

  switch (role) {
    case 'student':
      return < AllAnnouncements />;
    case 'faculty':
      return < FacultyAnnouncements />;
    case 'acadAdmin':
      return <AdminAnnouncements />; 
    default:
        return <Unauthorized role={role} />;
      // return < AllAnnouncements />;
      // return <AdminAnnouncements />; 
  }
};

export default SideAnnouncementWrapper;