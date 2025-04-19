import React, { useState } from "react";
import NewComplaintForm from "../newComplaintForm";

/**
 * NewComplaintSelection component for selecting a category and subcategory before creating a new complaint
 * @param {Object} props Component props
 * @param {function} props.refetch - Function to refetch complaints data after creation
 * @returns {JSX.Element} The rendered component
 */
const NewComplaintSelection = ({ refetch }) => {
  const [category, setCategory] = useState("Computer & Comm. Centre");
  const [subCategory, setSubCategory] = useState("");
  const [showNewComplaintForm, setShowNewComplaintForm] = useState(false);

  // Categories and subcategories
  const categories = {
    "Computer & Comm. Centre": ["Automation", "Email Services", "HPC Support", "Network", "PC & Peripherals", "Telephone", "Turnitin", "Web Services", "Other"],
    "Hostel/Resident Complaints": ["Plumbing", "Room Servicing", "Electricity Issues", "Furniture Repair", "Cleaning Services", "Other"],
    "Infrastructure Complaints": ["Gym", "Badminton Hall", "Table Tennis Court", "Ground", "Swimming Pool", "Food Court", "Other"],
  };

  /**
   * Handles the continue button click to show the complaint form
   */
  const handleGoClick = () => {
    setShowNewComplaintForm(true);
  };

  /**
   * Handles the back action from the complaint form
   * @param {boolean} wasNewAdded - Whether a new complaint was added
   */
  const handleBackClick = (wasNewAdded) => {
    setShowNewComplaintForm(false);
    if (wasNewAdded) {
      refetch();
    }
  };

  if (showNewComplaintForm) {
    return (
      <div className="relative">
        <button
          className="absolute top-4 left-4 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center transition-colors duration-200 border border-gray-300 shadow-sm"
          onClick={() => handleBackClick(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <NewComplaintForm
          subCategory={subCategory}
          category={category}
          onBack={() => handleBackClick(true)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register New Complaint</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block font-medium text-gray-700 mb-2">Department</label>
          <div className="relative">
            <select
              className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubCategory("");
              }}
            >
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block font-medium text-gray-700 mb-2">Issue Category</label>
          <div className="relative">
            <select
              className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option value="">--Select Category--</option>
              {categories[category]?.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <button
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 ${
              !subCategory 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
            }`}
            onClick={handleGoClick}
            disabled={!subCategory}
          >
            <span className="mr-2">Continue</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewComplaintSelection;