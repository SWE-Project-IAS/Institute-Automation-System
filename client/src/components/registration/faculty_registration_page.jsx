import React from "react";
import { Link } from "react-router-dom";

const courses = [
    { id: 1, name: "Data Structures", code: "CS201" },
    { id: 2, name: "Machine Learning", code: "CS305" },
    { id: 3, name: "Computer Networks", code: "CS310" }
];

const FacultyDashboard = () => {
    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {courses.map((course) => (
                    <Link
                        key={course.id}
                        to={`/facultyregistration/${course.id}`}
                        className="block p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition"
                    >
                        <h3 className="text-lg font-semibold">{course.name}</h3>
                        <p className="text-sm text-gray-600">{course.code}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FacultyDashboard;
