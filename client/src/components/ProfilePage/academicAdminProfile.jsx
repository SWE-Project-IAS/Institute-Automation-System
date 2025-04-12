import React from "react";

export default function AcademicAdminProfile() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-purple-700">
          Academic Admin Profile
        </h1>
        <p className="text-gray-700 text-center">
          Welcome, Academic Admin! Here you can manage course schedules, student
          records, and academic-related tasks.
        </p>
      </div>
    </div>
  );
}