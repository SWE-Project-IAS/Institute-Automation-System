import React, { useState } from "react";
import DocumentLayout from "../../components/documentSection/DocumentLayout";
import PDFPreview from "../../components/documentSection/PDFPreview";
import FeeReceiptPDF from "../../components/documentSection/FeeReceiptPDF";
import { pdf } from "@react-pdf/renderer";

const FeeReceiptPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [pdfBlob, setPdfBlob] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState("");

    // Student Data including semester-wise fee payment status
    const studentData = {
        name: "JOHN SMITH DOE",
        rollNo: "220103045",
        programme: "BTech",
        branch: "Computer Science and Engineering",
        department: "Computer Science and Engineering",
        feesPaid: {
            1: true,
            2: true,
            3: false,
            4: true,
            5: false,
            6: true,
            7: true,
            8: false,
        }, // Example status, update as needed
    };

    // Dynamically set isPaid based on selectedSemester
    const isPaid = selectedSemester ? studentData.feesPaid[selectedSemester] : false;

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
    
    const handleGenerate = async () => {
        if (!selectedSemester) return;
        setIsLoading(true);
        try {
            const blob = await pdf(
                <FeeReceiptPDF 
                    student={studentData} 
                    semester={selectedSemester} 
                    feeData={feeData}
                    isPaid={isPaid} 
                />
            ).toBlob();
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
            link.download = `Fee_Receipt_Sem_${selectedSemester}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <DocumentLayout title="Fee Receipt">
            <div className="max-w-3xl mx-auto space-y-6 p-6 bg-gradient-to-b from-blue-50 to-gray-100 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Fee Receipt</h1>
                
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Semester</label>
                    <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Semester</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num}>Semester {num}</option>
                        ))}
                    </select>
                </div>

                {/* Display Student Info */}
                <div className="bg-white p-4 rounded-lg shadow-inner mt-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Student Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-medium">{studentData.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Roll Number</p>
                            <p className="font-medium">{studentData.rollNo}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Programme</p>
                            <p className="font-medium">{studentData.programme}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Branch</p>
                            <p className="font-medium">{studentData.branch}</p>
                        </div>
                    </div>
                </div>

                {/* Display Fee Payment Status */}
                {selectedSemester && (
                    <div className={`p-3 text-center rounded-lg text-lg font-semibold ${
                        isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                        {isPaid ? "Fees Paid" : "Fees Not Paid"}
                    </div>
                )}

                {/* PDF Preview */}
                <PDFPreview pdfUrl={pdfUrl} isLoading={isLoading} />
                
                {/* Generate & Download Buttons */}
                <div className="flex justify-center gap-4 pt-4">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !selectedSemester}
                        className={`relative flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg transform hover:scale-105 ${
                            isLoading || !selectedSemester
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
