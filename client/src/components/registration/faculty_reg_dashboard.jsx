import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import newRequest from "../../utils/newRequest";

function FacultyDashboard(){
    const {data:userData} = JSON.parse(localStorage.getItem("currentUser"));
    const {userId} = userData.user;

    const { isLoading, error, data: courses } = useQuery({
    queryKey: ["facultyCourses", userId],
    queryFn: () => newRequest.get(`/faculty/${userId}/dashboard-courses`)
  });

  if (isLoading) return <div className="p-5">Loading courses...</div>;
  if (error) return <div className="p-5">Error loading courses</div>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses?.data.map((course) => (
          <Link
            key={course.id}
            to={`/facultyregistration/${course.code}`}
            state={{ courseName: course.code }}
            className="block p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">{course.code}</h3>
            <p className="text-sm text-gray-600">{course.code}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FacultyDashboard;




