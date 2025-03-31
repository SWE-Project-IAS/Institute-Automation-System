import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import iitglogo from '../../assets/iitglogo.jpg';

// Define styles
const styles = StyleSheet.create({
    page: { padding: 20, fontSize: 12, backgroundColor: "#ffffff", borderRadius: 10, border: "1 solid #333" },
    headerContainer: { textAlign: "center", marginBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "center" },
    headerText: { fontSize: 14, fontWeight: "bold", color: "#1a237e", marginLeft: 10 },
    subHeader: { fontSize: 10, fontWeight: "bold", marginBottom: 8, color: "#333", textAlign: "center" },
    topSection: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    logo: { width: 70, height: 70 },
    tableContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
    table: { flex: 1, border: "2 solid #333", borderRadius: 5, overflow: "hidden", marginLeft: 10 },
    row: { flexDirection: "row", borderBottom: "2 solid #333", backgroundColor: "#f8f9fa", padding: 5 },
    cell: { flex: 1, padding: 6, fontSize: 11, borderRight: "2 solid #333" },
    label: { fontWeight: "bold", color: "#1a237e" },
    value: { textAlign: "right", color: "#333" },
    studentImage: { width: 100, height: 120, border: "2 solid #333", borderRadius: 5 },
    qrCode: { width: 60, height: 60, alignSelf: "center", marginTop: 10, border: "2 solid #333" }
});

// Student ID PDF Component
const IDCardPDF = ({ student }) => (
    <Document>
        <Page style={styles.page}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <Image src={iitglogo} style={styles.logo} />
                <Text style={styles.headerText}>Indian Institute of Technology Guwahati{"\n"}Guwahati - 781039</Text>
            </View>
            <Text style={styles.subHeader}>PROVISIONAL IDENTITY CARD</Text>

            {/* Image and Table Container */}
            <View style={styles.tableContainer}>
                <Image src={student.photo} style={styles.studentImage} />
                <View style={styles.table}>
                    {[   { label: "NAME", value: student.name },
                        { label: "ROLL NO", value: student.rollNo },
                        { label: "BRANCH", value: student.branch },
                        { label: "PROGRAMME", value: student.programme },
                        { label: "DATE OF BIRTH", value: student.dob },
                        { label: "BLOOD GROUP", value: student.bloodGroup },
                        { label: "EMERGENCY CONTACT NO", value: student.contact }
                    ].map((item, index) => (
                        <View key={index} style={styles.row}>
                            <Text style={[styles.cell, styles.label]}>{item.label}</Text>
                            <Text style={[styles.cell, styles.value]}>{item.value}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* QR Code for Verification */}
            <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${student.rollNo}`} style={styles.qrCode} />
        </Page>
    </Document>
);

export default IDCardPDF;