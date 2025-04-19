import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '../../context/Rolecontext';
import DropCourse from './drop';
import AdminDropRequests from './dropCourseAdmin';
import Unauthorized from './unauth';

const DropCourseWrapper = () => {
  const { role } = useContext(RoleContext);
  const navigate = useNavigate();

  switch (role) {
    case 'student':
      return <DropCourse />;
    case 'acadAdmin':
      return <AdminDropRequests />;
    default:
      return <Unauthorized role={role} />;
  }
};

export default DropCourseWrapper;