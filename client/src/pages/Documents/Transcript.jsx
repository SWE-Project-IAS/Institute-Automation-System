import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DocumentLayout from "../../components/documentSection/DocumentLayout";
import PDFPreview from "../../components/documentSection/PDFPreview";
import TranscriptPDF from "../../components/documentSection/TranscriptPDF";
import { pdf } from "@react-pdf/renderer";
import {
  FaUser,
  FaIdBadge,
  FaGraduationCap,
  FaUniversity,
  FaExclamationCircle,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const TranscriptPage = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    try {
      const { data } = JSON.parse(localStorage.getItem("currentUser"));
      const userId = data.user.userId;
      setUserId(userId);

      // Fetch student details to check document access
      const fetchAccess = async () => {
        try {
          const response = await newRequest.get(`/student/${userId}`);
          setHasAccess(response.data.documentAccess?.transcript ?? false);
        } catch (error) {
          console.error('Error fetching document access:', error);
          toast.error('Error checking document access');
        }
      };
      fetchAccess();
    } catch (error) {
      console.error('Error getting user data:', error);
      toast.error('Please log in again');
    }
  }, []);

  const { isLoading: isStudentLoading, error: studentError, data: studentData } = useQuery({
    queryKey: [`idcard-${userId}`],
    queryFn: () => newRequest.get(`/student/${userId}`).then((res) => res.data),
  });

  const { isLoading: isGradesLoading, error: gradesError, data: studentGradesData } = useQuery({
    queryKey: ["completedCourses"],
    queryFn: () =>
      newRequest.get(`/student/${userId}/completed-courses`).then((res) => res.data.courses || []),
  });

  // Fix for the spiCpi query
  const { 
    isLoading: isPerformanceLoading, 
    error: performanceError, 
    data: performanceData 
  } = useQuery({
    queryKey: [`performance-${userId}`],
    queryFn: () =>
      newRequest.get(`/student/${userId}/performance`).then((res) => res.data.performance),
  });

  // Check all loading states
  if (isStudentLoading || isGradesLoading || isPerformanceLoading) {
    return (
      <DocumentLayout title="Transcript">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading student information...</p>
          </div>
        </div>
      </DocumentLayout>
    );
  }

  // Check for any errors
  if (studentError || gradesError || performanceError) {
    return (
      <DocumentLayout title="Transcript">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {studentError ? "Error loading student info" : 
                 gradesError ? "Error loading grades" : 
                 "Error loading performance data"}. Please try again later.
              </p>
              {/* Add debug info for development */}
              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-red-500">
                  {(studentError || gradesError || performanceError)?.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </DocumentLayout>
    );
  }

  const fullStudent = {
    photo: studentData.userId?.profilePicture || "https://via.placeholder.com/80",
    name: studentData.userId?.name || "N/A",
    rollNo: studentData.rollNo || "N/A",
    programme: studentData.program || "N/A",
    branch: studentData.department || "N/A",
  };

  const studentDataWithGrades = {
    ...fullStudent,
    grades: studentGradesData,
  };
  const spiCpi={
    ...performanceData
  };

  const studentInfo = [
    { label: "Name", value: fullStudent.name, icon: <FaUser /> },
    { label: "Roll No", value: fullStudent.rollNo, icon: <FaIdBadge /> },
    { label: "Programme", value: fullStudent.programme, icon: <FaGraduationCap /> },
    { label: "Department", value: fullStudent.branch, icon: <FaUniversity /> },
  ];

  const handleGenerate = async () => {
    if (!studentDataWithGrades || !Array.isArray(studentGradesData)) {
      console.error("Missing student data or grades.");
      return;
    }
  
    setIsLoading(true);
    try {
      // Add debug logs to check what data is passed
      console.log("Student data:", studentDataWithGrades);
      console.log("Performance data:", performanceData);
  
      // Generate PDF with the performance data
      const blob = await pdf(
        <TranscriptPDF student={studentDataWithGrades} spiCpi={Array.isArray(performanceData) ? performanceData : [performanceData]} />
      ).toBlob();
  
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfBlob(blob);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // If no access, show message
  if (!hasAccess) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Access Restricted</h2>
        <p className="text-gray-700">
          You do not currently have access to view or download your transcript. 
          Please contact the academic administration office for assistance.
        </p>
      </div>
    );
  }
  
  return (
    <DocumentLayout title="Transcript">
      <div className="max-w-3xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Student Information</h1>

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
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-600"
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