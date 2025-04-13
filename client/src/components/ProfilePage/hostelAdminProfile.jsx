import React from "react";

export default function HostelAdminProfile() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-green-700">
          Hostel Admin Profile
        </h1>
        <p className="text-gray-700 text-center">
          Welcome, Hostel Admin! You can manage hostel allocations, maintenance
          requests, and more from this dashboard.
        </p>
      </div>
    </div>
  );
}
