import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import DocumentLayout from "../../components/documentSection/DocumentLayout";
import PDFPreview from "../../components/documentSection/PDFPreview";
import FeeReceiptPDF from "../../components/documentSection/FeeReceiptPDF";
import { pdf } from "@react-pdf/renderer";
import { FaExclamationCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useSearchParams } from 'react-router-dom';

const FeeReceiptPage = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFeeDataLoading, setIsFeeDataLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [userId, setUserId] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [preparedFeeData, setPreparedFeeData] = useState(null);

  // Get user data first
  const userData = JSON.parse(localStorage.getItem("currentUser"))?.data;
  const userIdFromData = userData?.user?.userId;

  // Use query hook before any conditionals
  const { data: feeData, isLoading: isQueryLoading, error } = useQuery({
    queryKey: [`feereceipt-${userIdFromData}`],
    queryFn: () => userIdFromData ? newRequest.get(`/student/${userIdFromData}/fees/history`).then((res) => res.data) : null,
    enabled: !!userIdFromData
  });

  // Initial access check effect
  useEffect(() => {
    try {
      if (userData?.user?.userId) {
        setUserId(userData.user.userId);
        // Fetch student details to check document access
        const fetchAccess = async () => {
          try {
            const response = await newRequest.get(`/student/${userData.user.userId}`);
            setHasAccess(response.data.documentAccess?.feeReceipt ?? false);
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

  // Check for empty fee data
  useEffect(() => {
    if (feeData && (!feeData.payments || feeData.payments.length === 0)) {
      toast("You don't have any fee payment records yet.", {
        icon: "ℹ️",
        style: {
          backgroundColor: "#EFF6FF",
          border: "1px solid #BFDBFE",
          color: "#1E40AF",
        },
      });
    }
  }, [feeData]);

  // Prepare fee data when semester changes
  useEffect(() => {
    if (!selectedSemester || !feeData) return;

    try {
      // Find fee payment details for selected semester
      const semesterPayment = feeData.payments.find(
        (p) => p.semester === parseInt(selectedSemester)
      );

      if (!semesterPayment) {
        setPreparedFeeData(null);
        return;
      }

      // Directly use feeBreakdownData from the stored payment
      const feeBreakdown = semesterPayment.feeBreakdown;
      if (!feeBreakdown) {
        console.error(
          "Fee breakdown data missing for semester:",
          selectedSemester
        );
        setPreparedFeeData(null);
        return;
      }

      console.log("Using fee breakdown data:", feeBreakdown);

      // Format fee particulars data - ensure all values are numbers
      const feeParticulars = [
        {
          particular: "Tuition Fees",
          amount: Number(feeBreakdown.tuitionFees) || 0,
        },
        {
          particular: "Examination Fee",
          amount: Number(feeBreakdown.examinationFees) || 0,
        },
        {
          particular: "Registration/Enrollment Fee",
          amount: Number(feeBreakdown.registrationFee) || 0,
        },
        {
          particular: "Gymkhana Fee",
          amount: Number(feeBreakdown.gymkhanaFee) || 0,
        },
        {
          particular: "Medical Fee",
          amount: Number(feeBreakdown.medicalFee) || 0,
        },
        {
          particular: "Hostel Fund",
          amount: Number(feeBreakdown.hostelFund) || 0,
        },
        {
          particular: "Hostel Rent",
          amount: Number(feeBreakdown.hostelRent) || 0,
        },
        {
          particular: "Electricity and Water Charges",
          amount: Number(feeBreakdown.elecAndWater) || 0,
        },
        {
          particular: "Adjustable Mess Advance",
          amount: Number(feeBreakdown.messAdvance) || 0,
        },
        {
          particular: "Students Brotherhood Fund",
          amount: Number(feeBreakdown.studentsBrotherhoodFund) || 0,
        },
        {
          particular: "Academic Facilities Fee",
          amount: Number(feeBreakdown.acadFacilitiesFee) || 0,
        },
        {
          particular: "Hostel Maintenance Charge",
          amount: Number(feeBreakdown.hostelMaintenance) || 0,
        },
        {
          particular: "Students Travel Assistance Fund",
          amount: Number(feeBreakdown.studentsTravelAssistance) || 0,
        },
      ];

      // Calculate total amount or use pre-calculated total if available
      const totalAmount =
        Number(feeBreakdown.totalAmount) ||
        feeParticulars.reduce((sum, item) => sum + (item.amount || 0), 0);

      // Add totals to fee particulars
      const completeParticulars = [
        ...feeParticulars,
        { particular: "Total Amount", amount: totalAmount },
        { particular: "Adjustment Amount", amount: 0 },
        { particular: "Payable Amount", amount: totalAmount },
      ];

      // Log the prepared data for debugging
      console.log("Prepared fee particulars:", completeParticulars);

      setPreparedFeeData({
        student: feeData.student,
        feeParticulars: completeParticulars,
        transactionDetails: {
          slNo: 1,
          feeType: "Semester Registration Fee",
          feeAmount: totalAmount,
          transactionId: semesterPayment.transactionId || "N/A",
          dateTime: new Date(semesterPayment.paidAt).toLocaleString("sv-SE"),
          status: "Success",
          viewableDocumentId: semesterPayment.viewableDocumentId,
        },
      });
    } catch (error) {
      console.error(
        "Error preparing fee data:",
        error,
        "for semester:",
        selectedSemester
      );
      console.error(
        "Fee payment data:",
        feeData?.payments?.find(
          (p) => p.semester === parseInt(selectedSemester)
        )
      );
      toast.error("Error preparing fee data");
      setPreparedFeeData(null);
    }
  }, [selectedSemester, feeData]);

  // Update useEffect to set semester from URL param when component mounts
  useEffect(() => {
    const semesterFromUrl = searchParams.get('semester');
    if (semesterFromUrl) {
      setSelectedSemester(semesterFromUrl);
    }
  }, [searchParams]);

  // Show loading state while checking access
  if (isQueryLoading) {
    return (
      <DocumentLayout title="Fee Receipt">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading fee information...</p>
          </div>
        </div>
      </DocumentLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DocumentLayout title="Fee Receipt">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading fee information. Please try again later.
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
          You do not currently have access to view or download fee receipts. 
          Please contact the academic administration office for assistance.
        </p>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!selectedSemester || !preparedFeeData) {
      toast.error("Please select a semester with valid payment data");
      return;
    }

    setIsLoading(true);
    try {
      // Verify all data exists and is properly formatted before generating PDF
      if (!preparedFeeData.student || !preparedFeeData.feeParticulars) {
        throw new Error("Missing required data for PDF generation");
      }

      // Deep check all required props to ensure nothing is null/undefined
      const requiredProps = {
        student: preparedFeeData.student,
        semester: `Semester ${selectedSemester}`,
        feeData: preparedFeeData.feeParticulars,
        transactionDetails: preparedFeeData.transactionDetails,
      };

      // Log data for debugging
      console.log(
        "PDF generation data:",
        JSON.stringify(requiredProps, null, 2)
      );

      // Check for any null/undefined values in nested properties
      const studentKeys = ["name", "rollNo", "program", "department"];
      const missingStudentProps = studentKeys.filter(
        (key) => !requiredProps.student[key]
      );

      if (missingStudentProps.length > 0) {
        console.warn(
          `Missing student properties: ${missingStudentProps.join(", ")}`
        );
        // Add fallbacks for missing properties
        missingStudentProps.forEach((prop) => {
          requiredProps.student[prop] = prop === "name" ? "Student" : "N/A";
        });
      }

      // Create a safer transaction details object with fallbacks
      const safeTransactionDetails = {
        slNo: 1,
        feeType: "Semester Registration Fee",
        feeAmount: requiredProps.feeData.reduce((sum, item) => {
          return (
            sum +
            (typeof item.amount === "number"
              ? item.amount
              : parseFloat(item.amount) || 0)
          );
        }, 0),
        transactionId: requiredProps.transactionDetails?.transactionId || "N/A",
        dateTime:
          requiredProps.transactionDetails?.dateTime ||
          new Date().toLocaleString("sv-SE"),
        status: "Success",
      };

      // Try rendering the PDF with safe props
      let pdfBlob;
      try {
        // Create PDF document with fallback values for any missing properties
        const pdfDocument = (
          <FeeReceiptPDF
            student={requiredProps.student}
            semester={requiredProps.semester}
            feeData={requiredProps.feeData}
            isPaid={true}
            transactionDetails={safeTransactionDetails}
          />
        );

        // Log before attempting to generate PDF
        console.log("Attempting to generate PDF with component:", pdfDocument);

        pdfBlob = await pdf(pdfDocument).toBlob();
      } catch (pdfError) {
        console.error("PDF generation error details:", pdfError);
        throw new Error(`PDF generation failed: ${pdfError.message}`);
      }

      // Only proceed if PDF blob was created successfully
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setPdfBlob(pdfBlob);
      toast.success("Receipt generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate receipt: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) {
      toast.error("Please generate the receipt first");
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfBlob);
      const timestamp = new Date().toISOString().split("T")[0];
      link.download = `Fee_Receipt_${feeData.student.rollNo}_Sem${selectedSemester}_${timestamp}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Receipt downloaded successfully");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download receipt: " + error.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get available semesters with payments
  const paidSemesters = feeData?.payments
    ? [...new Set(feeData.payments.map((p) => p.semester))]
    : [];

  return (
    <DocumentLayout title="Fee Receipt">
      <div className="max-w-3xl mx-auto space-y-6 p-6 bg-gradient-to-b from-blue-50 to-gray-100 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
          Fee Receipt
        </h1>

        {/* Semester Selection */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Semester
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Semester</option>
            {paidSemesters.length > 0 ? (
              paidSemesters.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))
            ) : (
              <option disabled>No paid semesters found</option>
            )}
          </select>
        </div>

        {/* Display Student Info */}
        {feeData && (
          <div className="bg-white p-4 rounded-lg shadow-inner mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Student Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{feeData.student.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Roll Number</p>
                <p className="font-medium">{feeData.student.rollNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Programme</p>
                <p className="font-medium">{feeData.student.program}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">{feeData.student.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{feeData.student.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact</p>
                <p className="font-medium">
                  {feeData.student.contact || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Fee Details for Selected Semester */}
        {selectedSemester && preparedFeeData && (
          <div className="bg-white p-4 rounded-lg shadow-inner mt-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Fee Details - Semester {selectedSemester}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Particular
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preparedFeeData.feeParticulars.map((item, index) => (
                    <tr
                      key={index}
                      className={
                        index >= preparedFeeData.feeParticulars.length - 3
                          ? "bg-blue-50 font-semibold"
                          : ""
                      }
                    >
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {item.particular}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-md">
              <p className="flex justify-between text-sm">
                <span className="font-medium">Transaction ID:</span>
                <span>{preparedFeeData.transactionDetails.transactionId}</span>
              </p>
              <p className="flex justify-between text-sm">
                <span className="font-medium">Payment Date:</span>
                <span>{preparedFeeData.transactionDetails.dateTime}</span>
              </p>
              <p className="flex justify-between text-sm">
                <span className="font-medium">Status:</span>
                <span className="text-green-600 font-semibold">Paid</span>
              </p>
            </div>
          </div>
        )}

        {/* Payment Status */}
        {selectedSemester && feeData && (
          <div
            className={`p-3 text-center rounded-lg text-lg font-semibold ${
              paidSemesters.includes(parseInt(selectedSemester))
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {paidSemesters.includes(parseInt(selectedSemester))
              ? "Payment Successful"
              : "No Payment Record Found"}
          </div>
        )}

        {/* PDF Preview */}
        <PDFPreview pdfUrl={pdfUrl} isLoading={isLoading || isFeeDataLoading} />

        {/* Generate & Download Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={handleGenerate}
            disabled={
              isLoading ||
              !selectedSemester ||
              !preparedFeeData ||
              isFeeDataLoading
            }
            className={`relative flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg transform hover:scale-105 ${
              isLoading ||
              !selectedSemester ||
              !preparedFeeData ||
              isFeeDataLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-600"
            }`}
          >
            {isLoading ? "Generating..." : "Generate Receipt"}
          </button>
          {pdfUrl && (
            <button
              onClick={handleDownload}
              className="relative flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-green-600 to-teal-700 hover:from-teal-500 hover:to-green-600 shadow-lg transform hover:scale-105"
            >
              Download PDF
            </button>
          )}
        </div>
      </div>
    </DocumentLayout>
  );
};

export default FeeReceiptPage;
