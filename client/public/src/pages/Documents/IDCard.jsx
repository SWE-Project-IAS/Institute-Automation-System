import React, { useState } from "react";
import DocumentLayout from "../../components/documentSection/DocumentLayout";
import PDFPreview from "../../components/documentSection/PDFPreview";
import IDCardPDF from "../../components/documentSection/IDCardPDF";
import {pdf} from "@react-pdf/renderer";
import { FaUser, FaIdBadge, FaGraduationCap, FaBook, FaCalendarAlt, FaTint, FaPhone } from "react-icons/fa";

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

  const studentInfo = [
    { label: "Name", value: studentData.name, icon: <FaUser /> },
    { label: "Roll No", value: studentData.rollNo, icon: <FaIdBadge /> },
    { label: "Programme", value: studentData.programme, icon: <FaGraduationCap /> },
    { label: "Department", value: studentData.branch, icon: <FaBook /> },
    { label: "Valid Until", value: studentData.validUntil, icon: <FaCalendarAlt /> },
    { label: "Blood Group", value: studentData.bloodGroup, icon: <FaTint /> },
    { label: "Emergency Contact", value: studentData.contact, icon: <FaPhone /> }
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
        const blob = await pdf(<IDCardPDF student={studentData} />).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setPdfBlob(blob);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DocumentLayout title="ID Card" style={{ display: 'none' }}>
      <div className="max-w-3xl mx-auto space-y-6 p-6 bg-gradient-to-b from-blue-50 to-gray-100 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-900 decoration-indigo-500 mb-6">Student Information</h1>

        <div className="bg-white shadow-md rounded-lg border border-gray-300 p-6">
          <div className="divide-y divide-gray-300">
            {studentInfo.map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-3 px-4 py-3 ${index % 2 === 0 ? "bg-blue-100" : "bg-white"} rounded-md transition-transform transform hover:scale-[1.02] duration-300`}
              >
                <span className="text-indigo-700 text-lg">{item.icon}</span>
                <p className="text-gray-800 font-medium">{item.label}:</p>
                <p className="text-gray-900 font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <PDFPreview pdfUrl={pdfUrl} isLoading={isLoading} />

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`relative flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg transform hover:scale-105 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-600"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate ID Card"
            )}
          </button>

          {pdfUrl && (
            <a
              href={pdfUrl}
              download
              className="relative flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-green-600 to-teal-700 hover:from-teal-500 hover:to-green-600 shadow-lg transform hover:scale-105"
            >
              Download PDF
            </a>
          )}
        </div>
      </div>
    </DocumentLayout>
  );
};

export default IDCardPage;