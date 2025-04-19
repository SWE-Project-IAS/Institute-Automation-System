import React, { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import FeeReceiptPDF from "../components/documentSection/FeeReceiptPDF";
import axios from "axios";
import newRequest from "../utils/newRequest";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

// Helper function to load Razorpay script
const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

// Helper function to get current academic year
const getCurrentAcademicYear = () => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  return month < 6 ? `${year - 1}-${year}` : `${year}-${year + 1}`;
};

const FeePayment = () => {
  const navigate = useNavigate();
  // --- Get current user from localStorage ---
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    try {
      const { data: userData } = JSON.parse(
        localStorage.getItem("currentUser")
      );
      const { userId } = userData.user;
      setUserId(userId);
      console.log("User ID set:", userId); // Debug log
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }, []);

  // --- State ---
  const [isDownloading, setIsDownloading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Fetch fee data for the student
  const {
    data: feeData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["studentFeeData", userId],
    queryFn: async () => {
      const response = await newRequest.get(`/student/${userId}/fees`);
      return response.data;
    },
    enabled: !!userId,
    retry: 1,
    onError: (error) => {
      console.error("Failed to fetch fee data:", error);
      // Don't toast error if it's a 404 (fee structure not available)
      if (error.response?.status !== 404) {
        toast.error("Failed to load fee details");
      }
    },
  });

  // Process payment success
  const recordPayment = useMutation({
    mutationFn: (paymentData) => {
      console.log("Sending payment data to backend:", paymentData);
      return newRequest.post(`/student/${userId}/fees/payment`, paymentData);
    },
    onSuccess: (response, paymentData) => {
      console.log("Payment record success response:", response.data);
      toast.success("Payment recorded successfully");
      
      // Navigate to fee receipt page with the semester
      navigate(`/documents/feereceipt?semester=${feeData.student.nextSemester}`);
    },
    onError: (error) => {
      console.error("Error recording payment:", error);
      toast.error(error.response?.data?.message || "Failed to record payment");
    },
  });

  // Prepare fee particulars data for rendering
  const getFeeParticularsData = () => {
    if (!feeData?.feeBreakdown) return [];

    return [
      { particular: "Tuition Fees", amount: feeData.feeBreakdown.tuitionFees },
      {
        particular: "Examination Fee",
        amount: feeData.feeBreakdown.examinationFees,
      },
      {
        particular: "Registration/Enrollment Fee",
        amount: feeData.feeBreakdown.registrationFee,
      },
      { particular: "Gymkhana Fee", amount: feeData.feeBreakdown.gymkhanaFee },
      { particular: "Medical Fee", amount: feeData.feeBreakdown.medicalFee },
      { particular: "Hostel Fund", amount: feeData.feeBreakdown.hostelFund },
      { particular: "Hostel Rent", amount: feeData.feeBreakdown.hostelRent },
      {
        particular: "Electricity and Water Charges",
        amount: feeData.feeBreakdown.elecAndWater,
      },
      {
        particular: "Adjustable Mess Advance",
        amount: feeData.feeBreakdown.messAdvance,
      },
      {
        particular: "Students Brotherhood Fund",
        amount: feeData.feeBreakdown.studentsBrotherhoodFund,
      },
      {
        particular: "Academic Facilities Fee",
        amount: feeData.feeBreakdown.acadFacilitiesFee,
      },
      {
        particular: "Hostel Maintenance Charge",
        amount: feeData.feeBreakdown.hostelMaintenance,
      },
      {
        particular: "Students Travel Assistance Fund",
        amount: feeData.feeBreakdown.studentsTravelAssistance,
      },
    ];
  };

  const feeParticularsData = getFeeParticularsData();

  // Calculate totals
  const calculatedTotal = feeParticularsData.reduce(
    (sum, item) => sum + parseFloat(item.amount || 0),
    0
  );
  const adjustmentAmount = 0.0;
  // For production, use calculatedTotal - adjustmentAmount
  // For development, use a small amount for testing
  // For development/testing, force the payable amount to 2 INR:
  const payableAmount = calculatedTotal - adjustmentAmount; // 2 INR for testing

  const feeSummary = feeData
    ? {
        semester: `Semester ${feeData.student?.nextSemester || ""}`,
        feeType: "Registration Fee",
        totalFee: calculatedTotal,
        feePaid: feeData.feeStatus?.isPaid ? payableAmount : 0.0,
        feeToBePaid: feeData.feeStatus?.isPaid ? 0.0 : payableAmount,
        remarks: feeData.feeStatus?.isPaid ? "Paid" : "Due",
        payableAmount: payableAmount,
        detailedRemarks: feeData.feeStatus?.isPaid ? "Payment Received" : null,
      }
    : {};

  // Prepare data for PDF receipt
  const feeDataForPDF = [
    ...feeParticularsData,
    { particular: "Total Amount", amount: calculatedTotal.toFixed(2) },
    { particular: "Adjustment Amount", amount: adjustmentAmount.toFixed(2) },
    { particular: "Payable Amount", amount: payableAmount.toFixed(2) },
  ];

  // --- Handlers ---
  const handlePayFee = async () => {
    if (!feeData || feeData.feeStatus?.isPaid) {
      toast.error("Payment already completed or invalid fee data");
      return;
    }

    console.log("Attempting to pay fee...");
    toast.loading("Initializing payment...", { id: "payment-init" });

    try {
      // Verify payment status again before proceeding
      const currentFeeStatus = await newRequest.get(`/student/${userId}/fees`);
      if (currentFeeStatus.data.feeStatus?.isPaid) {
        toast.error("Fee is already paid for this semester");
        refetch();
        return;
      }

      const scriptLoaded = await loadRazorpayScript(RAZORPAY_SCRIPT_URL);
      if (!scriptLoaded) {
        toast.error(
          "Failed to load payment gateway. Please check your connection and try again."
        );
        return;
      }

      const backendUrl = "https://ias-server-cpoh.onrender.com/api/payment/create-order";
      const orderPayload = { amount: payableAmount, currency: "INR" };

      console.log("Sending to backend:", orderPayload);
      const { data } = await axios.post(backendUrl, orderPayload);
      console.log("Received order data from backend:", data);
      toast.dismiss("payment-init");

      const { orderId, currency, amount: amountInPaise } = data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency: currency,
        name: "IIT Guwahati",
        description: `Fee Payment - ${feeSummary.semester}`,
        image: "/iitg_logo_blue.png",
        order_id: orderId,
        handler: function (response) {
          console.log("Razorpay Success Response:", response);

          // Prepare payment data with all required fields
          const paymentData = {
            semester: Number(feeData.student.nextSemester),
            feeBreakdownId: feeData.feeBreakdown._id, // Keep this to retrieve fee breakdown data on server
            transactionId: response.razorpay_payment_id,
            academicYear: getCurrentAcademicYear(),
            paymentDetails: {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              amount: payableAmount,
              currency: currency,
            },
            isPaid: true,
            paidAt: new Date().toISOString(),
          };

          console.log("Sending payment data to backend:", paymentData);
          recordPayment.mutate(paymentData);
        },
        prefill: {
          name: feeData?.student?.name || "",
          email: feeData?.student?.email || "",
          contact: feeData?.student?.contact || "",
        },
        notes: {
          address: "IIT Guwahati, Assam, India",
          roll_number: feeData?.student?.rollNo || "",
          semester: feeSummary.semester,
        },
        theme: {
          color: "#007bff",
        },
        modal: {
          ondismiss: function () {
            console.log("Razorpay checkout modal dismissed.");
            toast.dismiss("payment-init");
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          console.error("Razorpay Payment Failed Event:", response.error);
          toast.error(
            `Payment Failed: ${
              response.error.description ||
              response.error.reason ||
              "Unknown error"
            }`
          );
        });
        rzp.open();
      } else {
        toast.error("Payment gateway failed to initialize.");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      let errorMessage = "Payment failed. Please try again.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = `Payment failed: ${error.response.data.error}`;
      } else if (error.message) {
        errorMessage = `Payment failed: ${error.message}`;
      }
      toast.error(errorMessage, { id: "payment-init" });
    }
  };

  const handleDownloadReceipt = async () => {
    if (!feeData?.feeStatus?.isPaid || isDownloading) return;
    setIsDownloading(true);
    toast.loading("Generating receipt...");

    try {
      const transactionDetails = paymentDetails || {
        slNo: 1,
        feeType: feeSummary.feeType,
        feeAmount: payableAmount,
        transactionId:
          "FEE" + feeData.feeStatus?.feeDetailsId?.substring(0, 10),
        dateTime: new Date().toLocaleString("sv-SE"),
        status: "Success",
      };

      const blob = await pdf(
        <FeeReceiptPDF
          student={feeData.student}
          semester={feeSummary.semester}
          feeData={feeDataForPDF}
          isPaid={true}
          transactionDetails={transactionDetails}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Fee_Receipt_${feeData.student.rollNo}_${feeSummary.semester}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success("Receipt downloaded successfully");
    } catch (error) {
      console.error("Error generating or downloading PDF receipt:", error);
      toast.error("Failed to generate PDF receipt");
    } finally {
      setIsDownloading(false);
    }
  };

  // Add a useEffect to monitor feeData changes
  useEffect(() => {
    if (feeData?.feeStatus?.isPaid) {
      // Update UI elements that show payment status
      setPaymentDetails((prev) => ({
        ...prev,
        status: "Success",
        feeAmount: payableAmount,
        dateTime: new Date().toLocaleString("sv-SE"),
      }));
    }
  }, [feeData?.feeStatus?.isPaid]);

  // --- Helper Function ---
  const formatCurrency = (amount) => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      return "₹ --.--";
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  };

  // --- Render Logic ---
  // If user data not loaded
  if (!userId) {
    return (
      <div className="max-w-[1000px] mx-auto my-10 px-10 py-[35px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] text-gray-800 text-center p-12">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900">
          Fee Payment
        </h1>
        <div className="p-8 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-lg text-yellow-800">
            Unable to load user information. Please log in again.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-[1000px] mx-auto my-10 px-10 py-[35px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] text-gray-800 text-center p-12 text-lg text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Loading Fee Details...</p>
      </div>
    );
  }

  // No fee structure available or max semester reached
  if (
    (error && error.response?.status === 404) ||
    feeData?.isMaxSemesterReached
  ) {
    return (
      <div className="max-w-[1000px] mx-auto my-10 px-10 py-[35px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] text-gray-800 text-center p-12">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900">
          Fee Payment
        </h1>
        <div className="p-8 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-lg text-yellow-800">
            {feeData?.isMaxSemesterReached
              ? feeData.message ||
                "You have completed the maximum number of semesters for your program."
              : "Fee payment is not yet available for the next semester. Please check back later."}
          </p>
        </div>
      </div>
    );
  }

  // Other errors
  if (error) {
    return (
      <div className="max-w-[1000px] mx-auto my-10 px-10 py-[35px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] text-gray-800 text-center p-12">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900">
          Fee Payment
        </h1>
        <div className="p-8 bg-red-50 rounded-lg border border-red-200">
          <p className="text-lg text-red-800">
            An error occurred while loading fee details. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Base classes for table cells (td/th)
  const cellBaseClasses =
    "px-[18px] py-[14px] text-left border-b border-gray-100 text-sm align-middle";
  // Base classes for table header cells (th)
  const thBaseClasses = `${cellBaseClasses} font-semibold uppercase tracking-wider`;
  // Base classes for action buttons
  const buttonBaseClasses =
    "px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-250 ease text-center shadow-md tracking-tight hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";

  // Main content
  return (
    <div className="max-w-[1000px] mx-auto my-10 px-10 py-[35px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] text-gray-800 transition-all duration-300 ease-out">
      {/* Page Title */}
      <h1 className="text-center text-gray-900 mb-[35px] text-3xl font-semibold pb-4 border-b-2 border-blue-500 tracking-wide">
        Academic Fee Payment
      </h1>

      {/* Student Identification Section */}
      <section className="flex items-center bg-gray-50 px-[25px] py-5 rounded-xl mb-[35px] border border-gray-200 shadow-md">
        <img
          src="/dummy_user.png"
          alt={`${feeData.student.name}'s profile`}
          className="w-[75px] h-[75px] rounded-full object-cover mr-6 border-[3px] border-white shadow-lg"
        />
        {/* Student Details Div */}
        <div>
          <h2 className="mb-2.5 text-xl text-gray-900 font-semibold">
            {feeData.student.name}
          </h2>
          <p className="my-1 text-base text-gray-700">
            <strong className="text-gray-800 mr-2.5 min-w-[100px] inline-block font-medium">
              Roll No:
            </strong>
            <span>{feeData.student.rollNo}</span>
          </p>
          <p className="my-1 text-base text-gray-700">
            <strong className="text-gray-800 mr-2.5 min-w-[100px] inline-block font-medium">
              Programme:
            </strong>
            <span>
              {feeData.student.program} - {feeData.student.department}
            </span>
          </p>
          <p className="my-1 text-base text-gray-700">
            <strong className="text-gray-800 mr-2.5 min-w-[100px] inline-block font-medium">
              Current Semester:
            </strong>
            <span>{feeData.student.semester}</span>
          </p>
        </div>
      </section>

      {/* Fee Overview Section */}
      <section className="mb-[35px] border border-gray-300 rounded-xl overflow-hidden bg-white shadow-lg transition-shadow duration-300 ease hover:shadow-xl">
        <div className="overflow-x-auto p-1">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={`${thBaseClasses} bg-blue-100 text-blue-800`}>
                  Semester
                </th>
                <th className={`${thBaseClasses} bg-blue-100 text-blue-800`}>
                  Fee Type
                </th>
                <th
                  className={`${thBaseClasses} bg-blue-100 text-blue-800 text-right`}
                >
                  Total Fee
                </th>
                <th
                  className={`${thBaseClasses} bg-blue-100 text-blue-800 text-right`}
                >
                  Fee Paid
                </th>
                <th
                  className={`${thBaseClasses} bg-blue-100 text-blue-800 text-right`}
                >
                  Amount Due
                </th>
                <th className={`${thBaseClasses} bg-blue-100 text-blue-800`}>
                  Status
                </th>
                <th className={`${thBaseClasses} bg-blue-100 text-blue-800`}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="transition-colors duration-250 ease even:bg-gray-50 hover:bg-blue-50">
                <td className={cellBaseClasses}>{feeSummary.semester}</td>
                <td className={cellBaseClasses}>{feeSummary.feeType}</td>
                <td
                  className={`${cellBaseClasses} text-right font-medium tracking-tight`}
                >
                  {formatCurrency(feeSummary.totalFee)}
                </td>
                <td
                  className={`${cellBaseClasses} text-right font-medium tracking-tight`}
                >
                  {formatCurrency(feeSummary.feePaid)}
                </td>
                <td
                  className={`${cellBaseClasses} text-right font-medium tracking-tight ${
                    !feeData.feeStatus?.isPaid ? "text-red-700 font-bold" : ""
                  }`}
                >
                  {formatCurrency(feeSummary.feeToBePaid)}
                </td>
                <td className={`${cellBaseClasses} text-center`}>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                      feeData.feeStatus?.isPaid
                        ? "text-green-800 bg-green-100 border-green-200"
                        : "text-red-800 bg-red-100 border-red-200 font-bold"
                    }`}
                  >
                    {feeSummary.remarks}
                  </span>
                </td>
                <td className={`${cellBaseClasses} text-center`}>
                  {!feeData.feeStatus?.isPaid ? (
                    <button
                      onClick={handlePayFee}
                      className={`${buttonBaseClasses} bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800`}
                      disabled={recordPayment.isLoading}
                    >
                      {recordPayment.isLoading
                        ? "Processing..."
                        : "Proceed to Pay"}
                    </button>
                  ) : (
                    <span className="text-green-700 font-bold">
                      ✓ Payment Complete
                    </span>
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
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={`${thBaseClasses} bg-gray-50 text-gray-700`}>
                  Particulars
                </th>
                <th
                  className={`${thBaseClasses} bg-gray-50 text-gray-700 text-right`}
                >
                  Amount (INR)
                </th>
              </tr>
            </thead>
            <tbody>
              {feeParticularsData.map((item, index) => (
                <tr
                  key={`particular-${index}`}
                  className="transition-colors duration-250 ease even:bg-gray-50 hover:bg-blue-50"
                >
                  <td className={cellBaseClasses}>{item.particular}</td>
                  <td
                    className={`${cellBaseClasses} text-right font-medium tracking-tight`}
                  >
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
              <tr className="transition-colors duration-250 ease even:bg-gray-50 hover:bg-blue-50 font-semibold bg-gray-100 text-gray-900">
                <td className={cellBaseClasses}>
                  <strong>Total Amount</strong>
                </td>
                <td
                  className={`${cellBaseClasses} text-right font-medium tracking-tight text-red-600 text-base`}
                >
                  <strong>{formatCurrency(feeSummary.totalFee)}</strong>
                </td>
              </tr>
              <tr className="transition-colors duration-250 ease even:bg-gray-50 hover:bg-blue-50">
                <td className={cellBaseClasses}>Adjustment Amount</td>
                <td
                  className={`${cellBaseClasses} text-right font-medium tracking-tight`}
                >
                  {formatCurrency(adjustmentAmount)}
                </td>
              </tr>
              <tr className="transition-colors duration-250 ease even:bg-gray-50 hover:bg-blue-50 font-semibold bg-gray-100 text-gray-900">
                <td className={cellBaseClasses}>
                  <strong>Net Payable Amount</strong>
                </td>
                <td
                  className={`${cellBaseClasses} text-right font-medium tracking-tight text-red-600 text-base`}
                >
                  <strong>{formatCurrency(feeSummary.payableAmount)}</strong>
                </td>
              </tr>
              <tr className="transition-colors duration-250 ease even:bg-gray-50 hover:bg-blue-50 italic text-gray-600 bg-gray-50">
                <td className={cellBaseClasses}>Remarks</td>
                <td className={`${cellBaseClasses} text-right`}>
                  {feeSummary.detailedRemarks || "--"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Payment History/Confirmation Section */}
      {feeData.feeStatus?.isPaid && (
        <section className="mb-[35px] border border-gray-300 rounded-xl overflow-hidden bg-white shadow-lg transition-shadow duration-300 ease hover:shadow-xl">
          <div className="p-6 text-center">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your payment has been processed successfully.</p>
            <button
              onClick={() => navigate(`/documents/feereceipt?semester=${feeData.student.nextSemester}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Receipt
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default FeePayment;
