import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
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
  FaInfoCircle,
  FaExclamationCircle // Added for placeholder
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest"; // Assuming you have a utility for API requests

const IDCardPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  // Get user data first
  const userData = JSON.parse(localStorage.getItem("currentUser"))?.data;
  const userIdFromData = userData?.user?.userId;

  // Use query hook before any conditionals
  const { isLoading: isQueryLoading, error, data: studentData } = useQuery({
    queryKey: [`idcard-${userIdFromData}`],
    queryFn: () => userIdFromData ? newRequest.get(`/student/${userIdFromData}`).then((res) => res.data) : null,
    enabled: !!userIdFromData
  });

  useEffect(() => {
    try {
      if (userData?.user?.userId) {
        setUserId(userData.user.userId);
        // Fetch student details to check document access
        const fetchAccess = async () => {
          try {
            const response = await newRequest.get(`/student/${userData.user.userId}`);
            setHasAccess(response.data.documentAccess?.idCard ?? false);
          } catch (error) {
            console.error("Error fetching document access:", error);
            toast.error("Error checking document access");
          }
        };
        fetchAccess();
      }
    } catch (error) {
      console.error("Error getting user data:", error);
      toast.error("Please log in again");
    }
  }, [userData]);

  // Show loading state while checking access
  if (isQueryLoading) {
    return (
      <DocumentLayout title="ID Card">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading student information...</p>
          </div>
        </div>
      </DocumentLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DocumentLayout title="ID Card">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading student information. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </DocumentLayout>
    );
  }

  // Show access restricted message
  if (!hasAccess) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Access Restricted</h2>
        <p className="text-gray-700">
          You do not currently have access to view or download your ID Card. 
          Please contact the academic administration office for assistance.
        </p>
      </div>
    );
  }

  const fullStudent = {
    photo: studentData?.userId?.profilePicture || "https://via.placeholder.com/80",
    name: studentData?.userId?.name || "N/A",
    rollNo: studentData?.rollNo || "N/A",
    programme: studentData?.program || "N/A",
    branch: studentData?.department || "N/A",
    validUntil: "2024-05-31", // optionally fetch this if it's dynamic
    bloodGroup: studentData?.userId?.bloodGroup || "N/A",
    contact: studentData?.userId?.contactNo || "N/A"
  };

  const studentInfo = [
    { label: "Name", value: fullStudent.name, icon: <FaUser /> },
    { label: "Roll No", value: fullStudent.rollNo, icon: <FaIdCard /> },
    { label: "Programme", value: fullStudent.programme, icon: <FaGraduationCap /> },
    { label: "Department", value: fullStudent.branch, icon: <FaUniversity /> },
    { label: "Valid Until", value: fullStudent.validUntil, icon: <FaCalendarAlt /> },
    { label: "Blood Group", value: fullStudent.bloodGroup, icon: <FaTint /> },
    { label: "Emergency Contact", value: fullStudent.contact, icon: <FaPhone /> }
  ];

  // Handle PDF generation
  const handleGenerate = async () => {
    setIsGenerating(true);
    setPdfUrl(null); // Clear previous PDF
    setPdfBlob(null);
    try {
      const blob = await pdf(<IDCardPDF student={fullStudent} />).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isQueryLoading) return <div>Loading student data...</div>;
  if (error) return <div>Error fetching student data.</div>;

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