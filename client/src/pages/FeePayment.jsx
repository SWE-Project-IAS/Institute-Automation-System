import React, { useState, useEffect } from "react";
// Remove CSS Module import: import styles from "./FeePayment.module.css";
import { pdf } from "@react-pdf/renderer";
import FeeReceiptPDF from "../components/documentSection/FeeReceiptPDF";
import axios from 'axios';

// Helper function to load Razorpay script (remains the same)
const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};
const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

const FeePayment = () => {
    // --- State (remains the same) ---
    const [isPaid, setIsPaid] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    // --- Static Data (remains the same) ---
    const student = {
        rollNumber: "220101125",
        name: "Priyanshu Pratyay",
        photo: "/tnmy.png",
        branch: "Computer Science & Engineering",
        programme: "B.Tech",
        currentSemester: "July-Nov 2024",
        department: "Computer Science & Engineering",
        email: "p.pratyay@iitg.ac.in", // Added for prefill example
        contact: "9876543210",       // Added for prefill example
    };

    const feeParticularsData = [
        { particular: "Tuition Fees", amount: "100000.00" },
        { particular: "Examination Fee", amount: "500.00" },
        { particular: "Registration/Enrollment Fee", amount: "1000.00" },
        { particular: "Gymkhana Fee", amount: "1000.00" },
        { particular: "Medical Fee", amount: "1900.00" },
        { particular: "Hostel Fund", amount: "600.00" },
        { particular: "Hostel Rent", amount: "1000.00" },
        { particular: "Electricity and Water Charges", amount: "2500.00" },
        { particular: "Adjustable Mess Advance", amount: "20000.00" },
        { particular: "Students Brotherhood Fund", amount: "50.00" },
        { particular: "Academic Facilities Fee", amount: "2500.00" },
        { particular: "Hostel Maintenance Charge", amount: "3000.00" },
        { particular: "Students Travel Assistance Fund", amount: "50.00" },
    ];

    const calculatedTotal = feeParticularsData.reduce(
        (sum, item) => sum + parseFloat(item.amount || 0),
        0
    );
    const adjustmentAmount = 0.00;
    // DEV ONLY: Set payable amount to 2 INR for easy testing
    const payableAmount = (calculatedTotal - adjustmentAmount) * 0 + 2;

    const feeDataForPDF = [
        ...feeParticularsData,
        { particular: "Total Amount", amount: calculatedTotal.toFixed(2) },
        { particular: "Adjustment Amount", amount: adjustmentAmount.toFixed(2) },
        { particular: "Payable Amount", amount: payableAmount.toFixed(2) },
    ];

    const feeSummary = {
        semester: student.currentSemester,
        feeType: "Registration/Enrollment Fee",
        totalFee: calculatedTotal,
        feePaid: isPaid ? payableAmount : 0.00,
        feeToBePaid: isPaid ? 0.00 : payableAmount,
        remarks: isPaid ? "Paid" : "Due",
        payableAmount: payableAmount,
        detailedRemarks: isPaid ? "Payment Received" : null,
    };

    // --- useEffect (remains the same logic) ---
    useEffect(() => {
        const fetchFeeStatus = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            const alreadyPaid = false; // Simulate initial state
            setIsPaid(alreadyPaid);
            if (alreadyPaid) {
                setPaymentDetails({
                    slNo: 1,
                    feeType: feeSummary.feeType,
                    feeAmount: feeSummary.payableAmount,
                    transactionId: "PAID_PREVIOUSLY_123",
                    dateTime: "2024-07-15 11:30:00",
                    status: "Success",
                });
            } else {
                setPaymentDetails(null);
            }
            setIsLoading(false);
        };
        fetchFeeStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Handlers (remain the same logic) ---

    // --- UPDATED handlePayFee Function (logic same, check env variables) ---
    const handlePayFee = async () => {
        console.log("Attempting to pay fee...");
        setIsLoading(true);

        const scriptLoaded = await loadRazorpayScript(RAZORPAY_SCRIPT_URL);
        if (!scriptLoaded) {
            alert('Failed to load payment gateway. Please check your connection and try again.');
            setIsLoading(false);
            return;
        }

        try {
            const backendUrl = 'http://localhost:8000/api/payment/create-order';
            const orderPayload = { amount: payableAmount, currency: 'INR' };

            console.log("Sending to backend:", orderPayload);
            const { data } = await axios.post(backendUrl, orderPayload);
            console.log("Received order data from backend:", data);

            const { orderId, currency, amount: amountInPaise } = data;

            // Check if the key is loaded correctly (keep this debug line)
            console.log("Using Razorpay Key ID for Frontend:", process.env.REACT_APP_RAZORPAY_KEY_ID);

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Ensure this is set in your .env
                amount: amountInPaise,
                currency: currency,
                name: "IIT Guwahati",
                description: `Fee Payment - Sem ${student.currentSemester}`,
                image: "/iitg_logo_blue.png", // Update with your actual logo URL if available
                order_id: orderId,
                handler: function (response) {
                    console.log("Razorpay Success Response:", response);
                    alert("Payment Successful!");
                    setIsPaid(true);
                    setPaymentDetails({
                        slNo: paymentDetails?.slNo ? paymentDetails.slNo + 1 : 1,
                        feeType: feeSummary.feeType,
                        feeAmount: payableAmount,
                        transactionId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature,
                        dateTime: new Date().toLocaleString("sv-SE"),
                        status: "Success",
                    });
                    setIsLoading(false);
                    // TODO: Call backend verification endpoint here in production
                },
                prefill: {
                    name: student.name,
                    email: student.email || "", // Use email from student data
                    contact: student.contact || "" // Use contact from student data
                },
                notes: {
                    address: "IIT Guwahati, Assam, India", // Example address
                    roll_number: student.rollNumber,
                    semester: student.currentSemester,
                },
                theme: {
                    color: "#007bff" // Example theme color (similar to blue button)
                },
                modal: {
                    ondismiss: function () {
                        console.log('Razorpay checkout modal dismissed.');
                        if (!isPaid) {
                            setIsLoading(false);
                        }
                    }
                }
            };

            if (window.Razorpay) {
                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    console.error("Razorpay Payment Failed Event:", response.error);
                    alert(`Payment Failed: ${response.error.description || response.error.reason || 'Unknown error'}`);
                    setIsLoading(false);
                });
                rzp.open();
            } else {
                alert('Payment gateway failed to initialize.');
                setIsLoading(false);
            }

        } catch (error) {
            console.error("Payment failed:", error);
            let errorMessage = "Payment failed. Please try again.";
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = `Payment failed: ${error.response.data.error}`;
            } else if (error.message) {
                errorMessage = `Payment failed: ${error.message}`;
            }
            alert(errorMessage);
            setIsLoading(false);
        }
    };

    // --- handleDownloadReceipt (logic same) ---
    const handleDownloadReceipt = async () => {
        if (!isPaid || !paymentDetails || isDownloading) return;
        setIsDownloading(true);
        console.log("Generating PDF receipt...");
        try {
            const blob = await pdf(
                <FeeReceiptPDF
                    student={student}
                    semester={student.currentSemester}
                    feeData={feeDataForPDF}
                    isPaid={isPaid}
                    transactionDetails={paymentDetails}
                />
            ).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Fee_Receipt_${student.rollNumber}_Sem${student.currentSemester}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log("Receipt download initiated.");
        } catch (error) {
            console.error("Error generating or downloading PDF receipt:", error);
            alert("Failed to generate PDF receipt. An error occurred.");
        } finally {
            setIsDownloading(false);
        }
    };

    // --- Helper Function (remains the same) ---
    const formatCurrency = (amount) => {
        const numericAmount = Number(amount);
        if (isNaN(numericAmount)) {
            return '₹ --.--';
        }
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numericAmount);
    };

    // --- Render Logic ---
    if (isLoading && !paymentDetails && !isPaid) {
        return (
            // Apply container styles directly + loading specific styles
            <div className="max-w-[1000px] mx-auto my-10 px-10 py-[35px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] text-gray-800 text-center p-12 text-lg text-gray-600">
                <p>Loading Fee Details...</p>
                {/* You can add a Tailwind spinner here if needed */}
                {/* e.g., <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mt-4"></div> */}
            </div>
        );
    }

    // Base classes for table cells (td/th)
    const cellBaseClasses = "px-[18px] py-[14px] text-left border-b border-gray-100 text-sm align-middle";
    // Base classes for table header cells (th)
    const thBaseClasses = `${cellBaseClasses} font-semibold uppercase tracking-wider`;
    // Base classes for action buttons
    const buttonBaseClasses = "px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-250 ease text-center shadow-md tracking-tight hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";


    return (
        // Container
        <div className="max-w-[1000px] mx-auto my-10 px-10 py-[35px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] text-gray-800 transition-all duration-300 ease-out">
            {/* Page Title */}
            <h1 className="text-center text-gray-900 mb-[35px] text-3xl font-semibold pb-4 border-b-2 border-blue-500 tracking-wide">
                Academic Fee Payment
            </h1>

            {/* Student Identification Section */}
            <section className="flex items-center bg-gray-50 px-[25px] py-5 rounded-xl mb-[35px] border border-gray-200 shadow-md">
                <img
                    src={student.photo}
                    alt={`${student.name}'s profile`}
                    // Use arbitrary width/height and specific border
                    className="w-[75px] h-[75px] rounded-full object-cover mr-6 border-[3px] border-white shadow-lg"
                    onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.png"; }}
                />
                {/* Student Details Div */}
                <div>
                    <h2 className="mb-2.5 text-xl text-gray-900 font-semibold">{student.name}</h2>
                    <p className="my-1 text-base text-gray-700">
                        <strong className="text-gray-800 mr-2.5 min-w-[100px] inline-block font-medium">Roll No:</strong>
                        <span>{student.rollNumber}</span>
                    </p>
                    <p className="my-1 text-base text-gray-700">
                        <strong className="text-gray-800 mr-2.5 min-w-[100px] inline-block font-medium">Programme:</strong>
                        <span>{student.programme} - {student.branch}</span>
                    </p>
                    <p className="my-1 text-base text-gray-700">
                        <strong className="text-gray-800 mr-2.5 min-w-[100px] inline-block font-medium">Semester:</strong>
                        <span>{student.currentSemester}</span>
                    </p>
                </div>
            </section>

            {/* Fee Overview Section */}
            <section className="mb-[35px] border border-gray-300 rounded-xl overflow-hidden bg-white shadow-lg transition-shadow duration-300 ease hover:shadow-xl">
                {/* No separate Section Title for overview */}
                <div className="overflow-x-auto p-1">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                {/* Apply specific header bg/text color */}
                                <th className={`${thBaseClasses} bg-blue-100 text-blue-800`}>Semester</th>
                                <th className={`${thBaseClasses} bg-blue-100 text-blue-800`}>Fee Type</th>
                                <th className={`${thBaseClasses} bg-blue-100 text-blue-800 text-right font-medium tracking-tight`}>Total Fee</th>
                                <th className={`${thBaseClasses} bg-blue-100 text-blue-800 text-right font-medium tracking-tight`}>Fee Paid</th>
                                <th className={`${thBaseClasses} bg-blue-100 text-blue-800 text-right font-medium tracking-tight`}>Amount Due</th>
                                <th className={`${thBaseClasses} bg-blue-100 text-blue-800`}>Status</th>
                                <th className={`${thBaseClasses} bg-blue-100 text-blue-800`}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Add hover and even row background styles to TR */}
                            <tr className="transition-colors duration-250 ease even:bg-gray-50 hover:bg-blue-50">
                                <td className={cellBaseClasses}>{feeSummary.semester}</td>
                                <td className={cellBaseClasses}>{feeSummary.feeType}</td>
                                <td className={`${cellBaseClasses} text-right font-medium tracking-tight`}>{formatCurrency(feeSummary.totalFee)}</td>
                                <td className={`${cellBaseClasses} text-right font-medium tracking-tight`}>{formatCurrency(feeSummary.feePaid)}</td>
                                {/* Conditional styling for Amount Due */}
                                <td className={`${cellBaseClasses} text-right font-medium tracking-tight ${!isPaid ? 'text-red-700 font-bold' : ''}`}>
                                    {formatCurrency(feeSummary.feeToBePaid)}
                                </td>
                                <td className={`${cellBaseClasses} text-center`}>
                                    {/* Conditional Status Badge */}
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                                        isPaid
                                            ? 'text-green-800 bg-green-100 border-green-200' // Paid styles
                                            : 'text-red-800 bg-red-100 border-red-200 font-bold' // Due styles
                                    }`}>
                                        {feeSummary.remarks}
                                    </span>
                                </td>
                                <td className={`${cellBaseClasses} text-center`}>
                                    {/* Conditional Action: Button or Text */}
                                    {!isPaid ? (
                                        <button
                                            onClick={handlePayFee}
                                            // Combine base button styles with specific colors
                                            className={`${buttonBaseClasses} bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800`}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Processing...' : 'Proceed to Pay'}
                                        </button>
                                    ) : (
                                        // Paid confirmation text
                                        <span className="text-green-700 font-bold">✓ Payment Complete</span>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>


            {/* Detailed Fee Breakdown Section */}
            <section className="mb-[35px] border border-gray-300 rounded-xl overflow-hidden bg-white shadow-lg transition-shadow duration-300 ease hover:shadow-xl">
                <h2 className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-[15px] text-lg font-semibold text-gray-800 border-b border-gray-300">
                    Fee Breakdown
                </h2>
                <div className="overflow-x-auto p-1">
                    {/* Use default header bg/text color */}
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className={`${thBaseClasses} bg-gray-50 text-gray-700`}>Particulars</th>
                                <th className={`${thBaseClasses} bg-gray-50 text-gray-700 text-right`}>Amount (INR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feeParticularsData.map((item, index) => (
                                <tr key={`particular-${index}`} className="transition-colors duration-250 ease even:bg-gray-50 hover:bg-blue-50">
                                    <td className={cellBaseClasses}>{item.particular}</td>
                                    {/* Amount cell */}
                                    <td className={`${cellBaseClasses} text-right font-medium tracking-tight`}>{formatCurrency(item.amount)}</td>
                                </tr>
                            ))}
                            {/* Summary Rows with specific styles */}
                            <tr className="transition-colors duration-250 ease even:bg-gray-50 hover:bg-blue-50 font-semibold bg-gray-100 text-gray-900">
                                <td className={cellBaseClasses}><strong>Total Amount</strong></td>
                                <td className={`${cellBaseClasses} text-right font-medium tracking-tight text-red-600 text-base`}><strong>{formatCurrency(feeSummary.totalFee)}</strong></td>
                            </tr>
                            <tr className="transition-colors duration-250 ease even:bg-gray-50 hover:bg-blue-50">
                                <td className={cellBaseClasses}>Adjustment Amount</td>
                                <td className={`${cellBaseClasses} text-right font-medium tracking-tight`}>{formatCurrency(adjustmentAmount)}</td>
                            </tr>
                            <tr className="transition-colors duration-250 ease even:bg-gray-50 hover:bg-blue-50 font-semibold bg-gray-100 text-gray-900">
                                <td className={cellBaseClasses}><strong>Net Payable Amount</strong></td>
                                <td className={`${cellBaseClasses} text-right font-medium tracking-tight text-red-600 text-base`}><strong>{formatCurrency(feeSummary.payableAmount)}</strong></td>
                            </tr>
                            <tr className="transition-colors duration-250 ease even:bg-gray-50 hover:bg-blue-50 italic text-gray-600 bg-gray-50">
                                <td className={cellBaseClasses}>Remarks</td>
                                <td className={`${cellBaseClasses} text-right`}>{feeSummary.detailedRemarks || '--'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Payment History/Confirmation Section */}
            {isPaid && paymentDetails && (
                <section className="mb-[35px] border border-gray-300 rounded-xl overflow-hidden bg-white shadow-lg transition-shadow duration-300 ease hover:shadow-xl">
                    <h2 className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-[15px] text-lg font-semibold text-gray-800 border-b border-gray-300">
                        Payment Confirmation
                    </h2>
                    <div className="overflow-x-auto p-1">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    {/* Specific header colors for history */}
                                    <th className={`${thBaseClasses} bg-green-100 text-green-800`}>Sl. No.</th>
                                    <th className={`${thBaseClasses} bg-green-100 text-green-800`}>Fee Type</th>
                                    <th className={`${thBaseClasses} bg-green-100 text-green-800 text-right font-medium tracking-tight`}>Amount Paid</th>
                                    <th className={`${thBaseClasses} bg-green-100 text-green-800`}>Transaction ID</th>
                                    <th className={`${thBaseClasses} bg-green-100 text-green-800`}>Date & Time</th>
                                    <th className={`${thBaseClasses} bg-green-100 text-green-800`}>Status</th>
                                    <th className={`${thBaseClasses} bg-green-100 text-green-800`}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="transition-colors duration-250 ease even:bg-gray-50 hover:bg-blue-50">
                                    <td className={cellBaseClasses}>{paymentDetails.slNo}</td>
                                    <td className={cellBaseClasses}>{paymentDetails.feeType}</td>
                                    <td className={`${cellBaseClasses} text-right font-medium tracking-tight`}>{formatCurrency(paymentDetails.feeAmount)}</td>
                                    <td className={cellBaseClasses}>{paymentDetails.transactionId}</td>
                                    <td className={cellBaseClasses}>{paymentDetails.dateTime}</td>
                                    <td className={`${cellBaseClasses} text-center`}>
                                        {/* Success Status Badge */}
                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border text-green-800 bg-green-100 border-green-200">
                                            {paymentDetails.status}
                                        </span>
                                    </td>
                                    <td className={`${cellBaseClasses} text-center`}>
                                        <button
                                            onClick={handleDownloadReceipt}
                                            // Base button styles + specific colors
                                            className={`${buttonBaseClasses} bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800`}
                                            disabled={isDownloading}
                                        >
                                            {isDownloading ? 'Generating...' : 'Download Receipt'}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
};

export default FeePayment;