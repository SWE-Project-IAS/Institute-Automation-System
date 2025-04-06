import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import iitglogo from '../../assets/iitglogo.jpg';

// Define styles
const styles = StyleSheet.create({
    page: { padding: 20, fontSize: 12, backgroundColor: "#ffffff" },
    headerContainer: { textAlign: "center", marginBottom: 15 },
    headerText: { fontSize: 16, fontWeight: "bold", color: "#1a237e" },
    subHeader: { fontSize: 12, fontWeight: "bold", marginBottom: 10, color: "#333" },
    contentContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
    logo: { width: 60, height: 60, marginBottom: 5, alignSelf: "center" },
    studentInfoContainer: { flex: 2, marginRight: 10, border: "1 solid #333", borderRadius: 5, padding: 8 },
    row: { flexDirection: "row", borderBottom: "1 solid #ccc", padding: 4 },
    cellLabel: { flex: 1, fontWeight: "bold", color: "#1a237e" },
    cellValue: { flex: 2, color: "#333" },
    studentImageContainer: { flexDirection: "column", alignItems: "center" },
    studentImage: { width: 100, height: 120, border: "1 solid #333", borderRadius: 5, marginBottom: 5 },
    qrCode: { width: 60, height: 60, border: "1 solid #333" },
    tableContainer: { marginTop: 10, border: "1 solid #333", borderRadius: 5, overflow: "hidden" },
    tableHeader: { flexDirection: "row", backgroundColor: "#1a237e", color: "#fff", padding: 6 },
    tableRow: { flexDirection: "row", borderBottom: "1 solid #ccc", padding: 6 },
    tableCell: { flex: 1, textAlign: "center" }
});

// Student Transcript PDF Component
const TranscriptPDF = ({ student }) => {
    if (!student) {
        return (
            <Document>
                <Page style={styles.page}>
                    <Text style={{ textAlign: "center", color: "red", fontSize: 16 }}>
                        Error: No student data available.
                    </Text>
                </Page>
            </Document>
        );
    }

    return (
        <Document>
            <Page style={styles.page}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <Image src={iitglogo} style={styles.logo} />
                    <Text style={styles.headerText}>Indian Institute of Technology Guwahati</Text>
                    <Text style={styles.subHeader}>OFFICIAL TRANSCRIPT</Text>
                </View>

                {/* Student Information and Photo */}
                <View style={styles.contentContainer}>
                    <View style={styles.studentInfoContainer}>
                        {[
                            { label: "NAME", value: student.name || "N/A" },
                            { label: "ROLL NO", value: student.rollNo || "N/A" },
                            { label: "BRANCH", value: student.branch || "N/A" },
                            { label: "PROGRAMME", value: student.programme || "N/A" },
                        ].map((item, index) => (
                            <View key={index} style={styles.row}>
                                <Text style={styles.cellLabel}>{item.label}</Text>
                                <Text style={styles.cellValue}>{item.value}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.studentImageContainer}>
                        {student.photo ? (
                            <Image src={student.photo} style={styles.studentImage} />
                        ) : (
                            <Text>No Photo</Text>
                        )}
                        {student.rollNo ? (
                            <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${student.rollNo}`} style={styles.qrCode} />
                        ) : (
                            <Text>No QR Code</Text>
                        )}
                    </View>
                </View>

                {/* Course List Table */}
                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        {['Course Code', 'Course Name', 'Credit/Audit', 'Year', 'Session', 'Grade'].map((header, index) => (
                            <Text key={index} style={styles.tableCell}>{header}</Text>
                        ))}
                    </View>
                    {student.courses && student.courses.length > 0 ? (
                        student.courses.map((course, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{course.code || "N/A"}</Text>
                                <Text style={styles.tableCell}>{course.name || "N/A"}</Text>
                                <Text style={styles.tableCell}>{course.credit || "N/A"}</Text>
                                <Text style={styles.tableCell}>{course.year || "N/A"}</Text>
                                <Text style={styles.tableCell}>{course.session || "N/A"}</Text>
                                <Text style={styles.tableCell}>{course.grade || "N/A"}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={{ textAlign: "center", padding: 10 }}>No Courses Available</Text>
                    )}
                </View>

                {/* SPI & CPI Table */}
                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        {['Semester', 'SPI', 'CPI'].map((header, index) => (
                            <Text key={index} style={styles.tableCell}>{header}</Text>
                        ))}
                    </View>
                    {student.spiCpi && student.spiCpi.length > 0 ? (
                        student.spiCpi.map((entry, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{entry.semester || "N/A"}</Text>
                                <Text style={styles.tableCell}>{entry.spi || "N/A"}</Text>
                                <Text style={styles.tableCell}>{entry.cpi || "N/A"}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={{ textAlign: "center", padding: 10 }}>No SPI/CPI Data Available</Text>
                    )}
                </View>
            </Page>
        </Document>
    );
};

export default TranscriptPDF;
