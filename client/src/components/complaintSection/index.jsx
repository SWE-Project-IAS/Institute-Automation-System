import React, { useContext, useEffect, useState } from "react";
import NewComplaintForm from "./newComplaintForm.jsx";
import ComplaintDetails from "./ComplaintDetails";
import complaintHistory from "./complaintHistory.json";
import { RoleContext } from "../../context/Rolecontext.jsx";

const ComplaintSection = () => {
  const { role } = useContext(RoleContext);
  const [department, setDepartment] = useState("Computer & Comm. Centre");
  const [category, setCategory] = useState("");
  const [showNewComplaintForm, setShowNewComplaintForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Determine if the user is a student or faculty (similar UI)
  const isStudentOrFaculty = role === "student" || role === "faculty";
  
  // Default active page based on role
  const defaultActivePage = isStudentOrFaculty ? "My Complaints" : "Pending";
  const [activePage, setActivePage] = useState(defaultActivePage);

  // Categories for complaints
  const categories = {
    "Computer & Comm. Centre": [
      "Automation",
      "Email Services",
      "HPC Support",
      "Network",
      "PC & Peripherals",
      "Telephone",
      "Turnitin",
      "Web Services",
      "Other"
    ],
    "Hostel/Resident Complaints": [
      "Plumbing",
      "Room Servicing",
      "Electricity Issues",
      "Furniture Repair",
      "Cleaning Services",
      "Other"
    ],
    "Infrastructure Complaints": [
      "Gym",
      "Badminton Hall",
      "Table Tennis Court",
      "Ground",
      "Swimming Pool",
      "Food Court",
      "Other"
    ],
  };

  // Filter complaints based on search query and active page
  const filteredComplaints = complaintHistory.filter((complaint) =>
    complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (isStudentOrFaculty && activePage === "My Complaints" || complaint.status === activePage)
  );

  // Handle GO button click to show the NewComplaintForm
  const handleGoClick = () => {
    setShowNewComplaintForm(true);
  };

  // Handle Back button to hide the NewComplaintForm
  const handleBackClick = () => {
    setShowNewComplaintForm(false);
  };

  // Handle View Details button click to show complaint details
  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
  };

  // Handle Back button from ComplaintDetails to return to the list
  const handleBackFromDetails = () => {
    setSelectedComplaint(null);
  };

  useEffect(() => {
    // Reset the selected complaint when the active page changes
    setSelectedComplaint(null);
  }, [activePage]);

  // If the role is Academic Admin, don't show the complaint section
  if (role === "acadAdmin") {
    return null;
  }

  return (
    <div className="flex flex-col h-[100%] border-1 w-[98%] m-2">
      {/* Permanent Navbar */}
      <div className="bg-gray-50 p-2 rounded-lg drop-shadow-md w-[98%] h-auto mb-4 m-auto">
        <nav className="w-full text-white p-4 h-auto">
          <ul className="flex justify-start space-x-8">
            <li
              className={`text-white px-4 py-2 rounded-md p-2 cursor-pointer ${
                activePage === (isStudentOrFaculty ? "My Complaints" : "Pending") ? "bg-gray-800" : "bg-gray-600"
              }`}
              onClick={() => setActivePage(isStudentOrFaculty ? "My Complaints" : "Pending")}
            >
              {isStudentOrFaculty ? "My Complaints" : "Pending"}
            </li>
            <li
              className={`text-white px-4 py-2 rounded-md p-2 cursor-pointer ${
                activePage === (isStudentOrFaculty ? "New Complaint" : "In Progress") ? "bg-gray-800" : "bg-gray-600"
              }`}
              onClick={() => setActivePage(isStudentOrFaculty ? "New Complaint" : "In Progress")}
            >
              {isStudentOrFaculty ? "New Complaint" : "In Progress"}
            </li>
            <li
              className={`text-white px-4 py-2 rounded-md p-2 cursor-pointer ${
                activePage === (isStudentOrFaculty ? "Delete Complaint" : "Resolved") ? "bg-gray-800" : "bg-gray-600"
              }`}
              onClick={() => setActivePage(isStudentOrFaculty ? "Delete Complaint" : "Resolved")}
            >
              {isStudentOrFaculty ? "Delete Complaint" : "Resolved"}
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 p-6 rounded-lg drop-shadow-md w-[98%] min-h-full mb-4 m-auto">
        {/* New Complaint Form Selection (only for students/faculty) */}
        {isStudentOrFaculty && activePage === "New Complaint" && !showNewComplaintForm && (
          <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            <label className="block font-semibold mb-2">Register to:</label>
            <select
              className="w-full p-2 border rounded-md"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setCategory("");
              }}
            >
              <option>Computer & Comm. Centre</option>
              <option>Hostel/Resident Complaints</option>
              <option>Infrastructure Complaints</option>
            </select>

            <label className="block font-semibold mt-4 mb-2">Select Category</label>
            <select
              className="w-full p-2 border rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">--Select Category--</option>
              {categories[department]?.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              className="bg-[#28a745] text-white px-4 py-2 rounded-md mt-3"
              onClick={handleGoClick}
            >
              GO
            </button>
          </div>
        )}

        {/* New Complaint Form (only for students/faculty) */}
        {isStudentOrFaculty && activePage === "New Complaint" && showNewComplaintForm && (
          <div className="relative">
            {/* Back Button */}
            <button
              className="absolute top-4 left-4 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              onClick={handleBackClick}
            >
              Back
            </button>
            {/* Render the NewComplaintForm */}
            <NewComplaintForm />
          </div>
        )}

        {/* Complaint List View */}
        {((isStudentOrFaculty && activePage === "My Complaints") ||
          (!isStudentOrFaculty && (activePage === "Pending" || activePage === "In Progress" || activePage === "Resolved")) ||
          (isStudentOrFaculty && activePage === "Delete Complaint")) && 
          !selectedComplaint && (
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Search complaints..."
                className="w-full p-2 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Complaint List */}
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 mb-2 border rounded-md"
                >
                  <div>
                    <h3 className="font-semibold">{complaint.title}</h3>
                    <p className="text-sm text-gray-600">Date: {complaint.date}</p>
                    <p className="text-sm text-gray-600">Status: {complaint.status}</p>
                  </div>
                  <button
                    className="bg-[#5969ff] text-white px-4 py-2 rounded-md"
                    onClick={() => handleViewDetails(complaint)}
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No complaints found.</p>
            )}
          </div>
        )}

        {/* Show Complaint Details if a complaint is selected */}
        {((isStudentOrFaculty && (activePage === "My Complaints" || activePage === "Delete Complaint")) ||
          (!isStudentOrFaculty && (activePage === "Pending" || activePage === "In Progress" || activePage === "Resolved"))) && 
          selectedComplaint && (
          <ComplaintDetails
            complaint={selectedComplaint}
            onBack={handleBackFromDetails}
            role={role}
          />
        )}
      </div>
    </div>
  );
};

export default ComplaintSection;