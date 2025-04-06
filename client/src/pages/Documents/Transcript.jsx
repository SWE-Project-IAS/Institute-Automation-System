import React, { useState } from "react";
import DocumentLayout from "../../components/documentSection/DocumentLayout";
import PDFPreview from "../../components/documentSection/PDFPreview";
import TranscriptPDF from "../../components/documentSection/TranscriptPDF";
import { pdf } from "@react-pdf/renderer";
import { FaUser, FaIdBadge, FaGraduationCap, FaBook, FaChartLine } from "react-icons/fa";

const TranscriptPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);

  const studentData = {
    name: "JOHN SMITH DOE",
    rollNo: "220103045",
    programme: "BTech",
    department: "Computer Science and Engineering",
    dateOfAdmission: "2022-07-28",
    currentSemester: "4th",
    cgpa: "8.75",
    contact: "+91 9876543210",
    photo: "https://example.com/student-photo.jpg",
    courses: [
      { code: "CS101", name: "Data Structures", credit: "4", year: "2022", session: "Spring", grade: "A" },
      { code: "CS102", name: "Algorithms", credit: "4", year: "2022", session: "Fall", grade: "A-" },
      { code: "CS103", name: "Operating Systems", credit: "4", year: "2023", session: "Spring", grade: "B+" },
      { code: "CS104", name: "Computer Networks", credit: "3", year: "2023", session: "Fall", grade: "B" },
      { code: "CS105", name: "Database Systems", credit: "3", year: "2023", session: "Fall", grade: "A" },
    ],
    spiCpi: [
      { semester: "1", spi: "8.5", cpi: "8.5" },
      { semester: "2", spi: "8.7", cpi: "8.6" },
      { semester: "3", spi: "8.9", cpi: "8.7" },
      { semester: "4", spi: "9.1", cpi: "8.8" },
    ],
  };

  const studentInfo = [
    { label: "Name", value: studentData.name, icon: <FaUser /> },
    { label: "Roll No", value: studentData.rollNo, icon: <FaIdBadge /> },
    { label: "Programme", value: studentData.programme, icon: <FaGraduationCap /> },
    { label: "Department", value: studentData.department, icon: <FaBook /> },
    { label: "Current Semester", value: studentData.currentSemester, icon: <FaChartLine /> },
    { label: "CGPA", value: studentData.cgpa, icon: <FaChartLine /> },
  ];

  const handleGenerate = async () => {
    if (!studentData) {
      console.error("Error: Missing student data");
      return;
    }
    setIsLoading(true);
    try {
      const blob = await pdf(<TranscriptPDF student={studentData} />).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfBlob(blob);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (pdfBlob) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfBlob);
      link.download = "Student_Transcript.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DocumentLayout title="Transcript">
      <div className="max-w-3xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Student Information</h1>

        {/* Student Information Section */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {studentInfo.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 border-b border-gray-200 md:border-none md:p-0 transition-colors duration-200 hover:bg-gray-50 rounded-md md:hover:bg-transparent"
              >
                <span className="text-blue-700 text-xl bg-blue-100 p-2 rounded-full">
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

        <PDFPreview pdfUrl={pdfUrl} isLoading={isLoading} />

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`relative flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-md transform hover:scale-105 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-600"
            }`}
          >
            {isLoading ? "Generating..." : "Generate Transcript"}
          </button>

          {pdfUrl && (
            <a
              href={pdfUrl}
              download
              className="relative flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 bg-blue-700 hover:bg-blue-600 shadow-md transform hover:scale-105"
            >
              Download PDF
            </a>
          )}
        </div>
      </div>
    </DocumentLayout>
  );
};

export default TranscriptPage;