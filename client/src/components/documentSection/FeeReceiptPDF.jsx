import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import iitglogo from '../../assets/iitglogo.jpg';

// Define styles
const styles = StyleSheet.create({
  page: { 
    padding: 20, 
    fontSize: 12, 
    backgroundColor: "#ffffff"
  },
  headerContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center",
    marginBottom: 15
  },
  headerText: { 
    fontSize: 14, 
    fontWeight: "bold", 
    color: "#1a237e", 
    marginLeft: 10,
    textAlign: "center"
  },
  subHeader: { 
    fontSize: 14, 
    fontWeight: "bold", 
    marginBottom: 10, 
    color: "#333", 
    textAlign: "center" 
  },
  logo: { 
    width: 70, 
    height: 70 
  },
  studentInfoContainer: { 
    marginBottom: 15, 
    borderBottom: "1px solid #333", 
    paddingBottom: 10 
  },
  statusContainer: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
    color: "white"
  },
  paidStatus: {
    backgroundColor: "#4caf50",
  },
  unpaidStatus: {
    backgroundColor: "#f44336",
  },
  feesTable: {
    marginTop: 10,
    borderTop: "1px solid #333"
  },
  feesTableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #333"
  },
  particularCell: {
    width: "70%",
    padding: 6,
    fontSize: 11,
    borderRight: "1px solid #333"
  },
  amountCell: {
    width: "30%",
    padding: 6,
    fontSize: 11,
    textAlign: "right"
  },
  totalRow: {
    flexDirection: "row",
    backgroundColor: "#e3f2fd",
    borderBottom: "1px solid #333"
  }
});

// Fee Receipt PDF Component
const FeeReceiptPDF = ({ student, semester, feeData, isPaid = true }) => {
  const currentDate = new Date().toLocaleDateString('en-GB');
  const receiptNumber = `IITG/FEE/${student?.rollNo || ""}/${semester || ""}/${new Date().getFullYear()}`;
  let payableAmount = parseFloat(feeData?.find(item => item.particular === "Payable Amount")?.amount || "0.00");
  
  // Update payable amount based on payment status
  if (isPaid) {
    payableAmount = 0.00;
  }
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.statusContainer, isPaid ? styles.paidStatus : styles.unpaidStatus]}>
          <Text>{isPaid ? "Paid - No Due" : `Unpaid - Due Amount: ₹ ${payableAmount.toFixed(2)}`}</Text>
        </View>
        <View style={styles.headerContainer}>
          <Image src={iitglogo} style={styles.logo} />
          <Text style={styles.headerText}>Indian Institute of Technology Guwahati{"\n"}Guwahati - 781039</Text>
        </View>
        <Text style={styles.subHeader}>FEE RECEIPT</Text>
        <View style={styles.studentInfoContainer}>
          <Text>Student Name: {student?.name || ""}</Text>
          <Text>Roll No: {student?.rollNo || ""}</Text>
          <Text>Semester: {semester}</Text>
          <Text>Academic Year: {new Date().getFullYear()}</Text>
          <Text>Receipt No: {receiptNumber}</Text>
        </View>
        <View style={styles.feesTable}>
          {feeData.map((item, index) => (
            <View key={index} style={styles.feesTableRow}>
              <Text style={styles.particularCell}>{item.particular}</Text>
              <Text style={styles.amountCell}>{`₹ ${parseFloat(item.amount.replace(/[^\d.]/g, '')).toFixed(2)}`}</Text>
            </View>
          ))}
          <View style={styles.feesTableRow}>
            <Text style={styles.particularCell}>Payable Amount</Text>
            <Text style={styles.amountCell}>{`₹ ${payableAmount.toFixed(2)}`}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default FeeReceiptPDF;