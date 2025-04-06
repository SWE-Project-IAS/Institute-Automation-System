import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import IDCardPDF from "../../components/documentSection/IDCardPDF";
import TranscriptPDF from "../../components/documentSection/TranscriptPDF";
import FeeReceiptPDF from "../../components/documentSection/FeeReceiptPDF";

const PDFGenerator = ({ setPdfUrl, type, semester, isPaid = true }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePDF = async () => {
    setIsLoading(true);

    let documentComponent;
    let fileName;

    if (type === "idCard") {
      const studentData = {
        photo: "https://via.placeholder.com/80",
        name: "John Doe",
        rollNo: "220103045",
        branch: "CSE",
        programme: "BTech",
        dob: "15-Aug-2003",
        bloodGroup: "B+",
        contact: "+91 9876543210",
      };
      documentComponent = <IDCardPDF student={studentData} />;
      fileName = "Student_ID_Card.pdf";
    } else if (type === "transcript") {
      const studentData = {
        name: "John Doe",
        rollNo: "220103045",
        programme: "BTech",
        department: "Computer Science and Engineering",
        dateOfAdmission: "2022-07-28",
        currentSemester: "4th",
        cgpa: "8.75",
      };
      documentComponent = <TranscriptPDF student={studentData} />;
      fileName = "Student_Transcript.pdf";
    } else if (type === "feeReceipt") {
      const studentData = {
        name: "John Doe",
        rollNo: "220103045",
        programme: "BTech",
        department: "Computer Science and Engineering",
      };
      const feeData = [
        { particular: "Tuition Fees", amount: "100000.00" },
        { particular: "Examination Fee", amount: "500.00" },
        { particular: "Registration/Enrollment Fee", amount: "1000.00" },
        { particular: "Gymkhana Fee", amount: "1000.00" },
        { particular: "Medical Fee", amount: "1900.00" },
        { particular: "Hostel Fund", amount: "600.00" },
        { particular: "Hostel Rent", amount: "1000.00" },
        { particular: "Electricity and Water Charges", amount: "2500.00" },
        { particular: "Mess Advance", amount: "20000.00" },
        { particular: "Students Brotherhood Fund", amount: "50.00" },
        { particular: "Academic Facilities Fee", amount: "2500.00" },
        { particular: "Hostel Maintenance Charge", amount: "3000.00" },
        { particular: "Students Travel Assistance Fund", amount: "50.00" },
        { particular: "Total Amount", amount: "134100.00" },
        { particular: "Adjustment Amount", amount: "0.00" },
        { particular: "Payable Amount", amount: "134100.00" },
        { particular: "Remarks", amount: "null" },
      ];
      documentComponent = (
        <FeeReceiptPDF
          student={studentData}
          semester={semester}
          feeData={feeData}
          isPaid={isPaid}
        />
      );
      fileName = `Fee_Receipt_Sem_${semester}.pdf`;
    }

    const blob = await pdf(documentComponent).toBlob();
    const url = URL.createObjectURL(blob);

    setPdfUrl(url);
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleGeneratePDF}
      disabled={isLoading}
      className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg transform hover:scale-105 ${
        isLoading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-600"
      }`}
    >
      {isLoading
        ? `Generating ${
            type === "idCard"
              ? "ID Card"
              : type === "transcript"
              ? "Transcript"
              : "Fee Receipt"
          }...`
        : `Generate ${
            type === "idCard"
              ? "ID Card"
              : type === "transcript"
              ? "Transcript"
              : "Fee Receipt"
          }`}
    </button>
  );
};

export default PDFGenerator;
