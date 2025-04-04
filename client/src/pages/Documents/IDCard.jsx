import React, { useState } from "react";
import DocumentLayout from "../../components/documentSection/DocumentLayout";
import PDFPreview from "../../components/documentSection/PDFPreview";
import IDCardPDF from "../../components/documentSection/IDCardPDF";
import { pdf } from "@react-pdf/renderer";
import { 
  FaUser, 
  FaIdBadge, 
  FaGraduationCap, 
  FaCalendarAlt, 
  FaUniversity,
  FaTint,
  FaIdCard, 
  FaPhone,
  FaFilePdf, // Added for Generate button
  FaDownload, // Added for Download button
  FaInfoCircle // Added for placeholder
} from "react-icons/fa";

const IDCardPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);

  const studentData = {
    photo: "https://via.placeholder.com/80", // Replace with actual student photo URL
    name: "JOHN SMITH DOE",
    rollNo: "220103045",
    programme: "BTech",
    branch: "Computer Science and Engineering",
    validUntil: "2024-05-31",
    bloodGroup: "B+",
    contact: "+91 9876543210"
  };

  // Enhanced studentInfo structure for better styling potential if needed
  const studentInfo = [
    { label: "Name", value: studentData.name, icon: <FaUser /> },
    { label: "Roll No", value: studentData.rollNo, icon: <FaIdCard /> },
    { label: "Programme", value: studentData.programme, icon: <FaGraduationCap /> },
    { label: "Department", value: studentData.branch, icon: <FaUniversity /> },
    { label: "Valid Until", value: studentData.validUntil, icon: <FaCalendarAlt /> },
    { label: "Blood Group", value: studentData.bloodGroup, icon: <FaTint /> },
    { label: "Emergency Contact", value: studentData.contact, icon: <FaPhone /> }
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setPdfUrl(null); // Clear previous preview while generating
    setPdfBlob(null);
    try {
        // Simulate generation time (optional)
        // await new Promise(resolve => setTimeout(resolve, 1500)); 
        const blob = await pdf(<IDCardPDF student={studentData} />).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setPdfBlob(blob);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Add user feedback for error state if desired
    } finally {
      setIsLoading(false);
    }
  };

  // handleDownload can be simplified using the anchor tag directly
  // const handleDownload = () => { ... } // Not strictly needed if using <a> tag below

  return (
    // Use DocumentLayout if it provides necessary page structure/nav etc.
    // Added some padding directly to the DocumentLayout container if possible,
    // otherwise wrap the content below in another div with padding.
    <DocumentLayout title="Student ID Card"> 
      {/* Main content container with enhanced styling */}
      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8  rounded-2xl shadow-xl border border-gray-200">
        
        {/* Header Section */}
        {/* <div className="text-center pb-4 border-b-2 border-indigo-200">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-700 mb-2">
            Student Identity Card
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            View your details and generate your official ID Card PDF.
          </p>
        </div> */}

        {/* Student Information Section */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <FaInfoCircle className="text-indigo-500" />
            Your Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {studentInfo.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-3 border-b border-gray-200 md:border-none md:p-0 transition-colors duration-200 hover:bg-indigo-50 rounded-md md:hover:bg-transparent" // Subtle hover on mobile/small screens
              >
                <span className="text-indigo-600 text-xl bg-indigo-100 p-2 rounded-full"> 
                  {item.icon}
                </span>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{item.label}</p>
                  <p className="text-gray-900 font-semibold text-base">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PDF Preview Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200 min-h-[200px] flex items-center justify-center">
            <PDFPreview pdfUrl={pdfUrl} isLoading={isLoading} />
        </div>


        {/* Action Buttons Section */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`
              relative flex items-center justify-center gap-2 px-8 py-3 
              rounded-full font-semibold text-white transition-all duration-300 ease-in-out 
              shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              ${isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-indigo-600 hover:to-blue-800"
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <FaFilePdf />
                Generate ID Card
              </>
            )}
          </button>

          {pdfUrl && !isLoading && (
            <a
              href={pdfUrl}
              download="Student_ID_Card.pdf" // Use the download attribute directly
              className="
                relative flex items-center justify-center gap-2 px-8 py-3 
                rounded-full font-semibold text-white transition-all duration-300 ease-in-out 
                shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto
                bg-gradient-to-r from-green-500 to-teal-600 hover:from-teal-500 hover:to-green-600
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FaDownload />
              Download PDF
            </a>
          )}
        </div>
      </div>
    </DocumentLayout>
  );
};

export default IDCardPage;