import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import IDCardPDF from "./IDCardPDF";

const PDFGenerator = ({ setPdfUrl }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePDF = async () => {
    setIsLoading(true);

    // Mock student data (can be replaced with backend data)
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

    const blob = await pdf(<IDCardPDF student={studentData} />).toBlob();
    const url = URL.createObjectURL(blob);

    setPdfUrl(url);
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleGeneratePDF}
      disabled={isLoading}
      className={`px-6 py-3 rounded-lg font-semibold text-white ${
        isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-800"
      }`}
    >
      {isLoading ? "Generating..." : "Generate ID Card"}
    </button>
  );
};

export default PDFGenerator;
