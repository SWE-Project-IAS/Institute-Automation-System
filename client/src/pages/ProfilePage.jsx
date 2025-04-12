import React, { useContext } from "react";
import StudentProfile from "../components/ProfilePage/studentProfile.jsx";
import FacultyProfile from "../components/ProfilePage/facultyProfile.jsx";
import AcademicAdminProfile from "../components/ProfilePage/academicAdminProfile.jsx";
import HostelAdminProfile from "../components/ProfilePage/hostelAdminProfile.jsx";
import { RoleContext } from "../context/Rolecontext.jsx";

const ProfilePage = () => {
    
    const { role } = useContext(RoleContext);
  switch (role) {
    case "student":
      return <StudentProfile />;
    case "faculty":
      return <FacultyProfile />;
    case "acadAdmin":
      return <AcademicAdminProfile />;
    case "nonAcadAdmin":
      return <HostelAdminProfile />;
    default:
      return <div>Error: Unknown role</div>;
  }
};

export default ProfilePage;


