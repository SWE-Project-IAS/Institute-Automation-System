import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#1e40af",
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: 80,
    height: 80,
  },
  headerText: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  instituteName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 5,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 5,
    textAlign: "center",
  },
  receiptNumber: {
    fontSize: 10,
    color: "#4b5563",
    marginTop: 5,
  },
  studentInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 5,
  },
  studentInfoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  studentInfoLabel: {
    width: "30%",
    fontWeight: "bold",
    fontSize: 10,
    color: "#4b5563",
  },
  studentInfoValue: {
    width: "70%",
    fontSize: 10,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderBottomColor: "#1e40af",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    backgroundColor: "#dbeafe",
    padding: 5,
  },
  tableCol: {
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  tableCell: {
    fontSize: 9,
    color: "#374151",
  },
  totalRow: {
    backgroundColor: "#eff6ff",
  },
  payableRow: {
    backgroundColor: "#dbeafe",
  },
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
    fontSize: 8,
    color: "#6b7280",
    textAlign: "center",
  },
  paymentDetails: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0fdf4",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#dcfce7",
  },
  paymentDetailsTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 5,
  },
  paymentInfoRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  watermark: {
    position: "absolute",
    top: "30%",
    left: "20%",
    color: "#f3f4f6",
    opacity: 0.1,
    transform: "rotate(-45deg)",
    fontSize: 80,
  },
  paidStamp: {
    position: "absolute",
    top: "60%",
    right: "10%",
    color: "#15803d",
    opacity: 0.15,
    transform: "rotate(-30deg)",
    fontSize: 80,
    fontWeight: "bold",
    border: "7px solid #15803d",
    padding: 10,
    borderRadius: 10,
  },
  signature: {
    marginTop: 60,
    paddingRight: 40,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  signatureText: {
    fontSize: 10,
    fontWeight: "bold",
  },
});

const FeeReceiptPDF = ({
  student,
  semester,
  feeData,
  isPaid,
  transactionDetails,
}) => {
  // Add default values for props to prevent null errors
  const safeStudent = student || {
    name: "Student",
    rollNo: "N/A",
    program: "N/A",
    department: "N/A",
    email: "N/A",
    contact: "N/A",
  };

  const safeSemester = semester || "Current Semester";
  const safeFeeData = feeData || [];
  const safeTransactionDetails = transactionDetails || {
    slNo: 1,
    feeType: "Fee Payment",
    feeAmount: 0,
    transactionId: "N/A",
    dateTime: new Date().toLocaleString(),
    status: "N/A",
  };

  // Format currency
  const formatCurrency = (amount) => {
    // Ensure amount is a number and handle invalid/NaN values
    const numAmount =
      typeof amount === "number" ? amount : parseFloat(amount || 0);
    return `₹ ${isNaN(numAmount) ? "0.00" : numAmount.toFixed(2)}`;
  };

  // Generate a unique receipt number
  const receiptNo = `${safeStudent.rollNo || "STUDENT"}-${
    safeSemester?.replace(/\D/g, "") || "SEM"
  }-${
    safeTransactionDetails.transactionId?.slice(-6) ||
    Date.now().toString().slice(-6)
  }`;

  // Get current date for receipt date
  const receiptDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark and paid stamp */}
        <Text style={styles.watermark}>IIT GUWAHATI</Text>
        {isPaid && <Text style={styles.paidStamp}>PAID</Text>}

        {/* Header */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            src="/iitg_logo.png"
            fallback={
              <View style={styles.logo}>
                <Text>IITG</Text>
              </View>
            }
          />
          <View style={styles.headerText}>
            <Text style={styles.instituteName}>
              INDIAN INSTITUTE OF TECHNOLOGY GUWAHATI
            </Text>
            <Text style={styles.title}>FEE RECEIPT</Text>
            <Text style={styles.receiptNumber}>Receipt No: {receiptNo}</Text>
          </View>
        </View>

        {/* Student Information */}
        <View style={styles.studentInfo}>
          <View style={styles.studentInfoRow}>
            <Text style={styles.studentInfoLabel}>Student Name:</Text>
            <Text style={styles.studentInfoValue}>{safeStudent.name}</Text>
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.studentInfoLabel}>Roll Number:</Text>
            <Text style={styles.studentInfoValue}>{safeStudent.rollNo}</Text>
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.studentInfoLabel}>Programme:</Text>
            <Text style={styles.studentInfoValue}>{safeStudent.program}</Text>
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.studentInfoLabel}>Department:</Text>
            <Text style={styles.studentInfoValue}>
              {safeStudent.department}
            </Text>
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.studentInfoLabel}>Semester:</Text>
            <Text style={styles.studentInfoValue}>{safeSemester}</Text>
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.studentInfoLabel}>Receipt Date:</Text>
            <Text style={styles.studentInfoValue}>{receiptDate}</Text>
          </View>
        </View>

        {/* Fee Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "70%" }]}>
              <Text style={styles.tableCellHeader}>Particulars</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "30%" }]}>
              <Text style={styles.tableCellHeader}>Amount (INR)</Text>
            </View>
          </View>

          {/* Table Body */}
          {safeFeeData.map((item, index) => {
            const isLastThree = index >= safeFeeData.length - 3;
            const isPayableRow = index === safeFeeData.length - 1;

            return (
              <View
                key={`fee-${index}`}
                style={[
                  styles.tableRow,
                  isPayableRow
                    ? styles.payableRow
                    : isLastThree
                    ? styles.totalRow
                    : {},
                ]}
              >
                <View style={[styles.tableCol, { width: "70%" }]}>
                  <Text
                    style={[
                      styles.tableCell,
                      isLastThree ? { fontWeight: "bold" } : {},
                    ]}
                  >
                    {item.particular}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: "30%" }]}>
                  <Text
                    style={[
                      styles.tableCell,
                      { textAlign: "right" },
                      isLastThree ? { fontWeight: "bold" } : {},
                    ]}
                  >
                    {formatCurrency(item.amount)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Payment Details */}
        {isPaid && (
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentDetailsTitle}>Payment Details</Text>
            <View style={styles.paymentInfoRow}>
              <Text style={styles.studentInfoLabel}>Transaction ID:</Text>
              <Text style={styles.studentInfoValue}>
                {safeTransactionDetails.transactionId}
              </Text>
            </View>
            <View style={styles.paymentInfoRow}>
              <Text style={styles.studentInfoLabel}>Payment Date:</Text>
              <Text style={styles.studentInfoValue}>
                {safeTransactionDetails.dateTime}
              </Text>
            </View>
            <View style={styles.paymentInfoRow}>
              <Text style={styles.studentInfoLabel}>Status:</Text>
              <Text
                style={[
                  styles.studentInfoValue,
                  { color: "#15803d", fontWeight: "bold" },
                ]}
              >
                {safeTransactionDetails.status}
              </Text>
            </View>
          </View>
        )}

        {/* Signature */}
        <View style={styles.signature}>
          <Text style={styles.signatureText}>Authorized Signatory</Text>
        </View>
      </Page>
    </Document>
  );
};

export default FeeReceiptPDF;
