import React, { useState } from 'react';
import DocumentLayout from '../../components/documentSection/DocumentLayout';
import PDFPreview from '../../components/documentSection/PDFPreview';

const TranscriptPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);

    // Hardcoded student data (will come from backend)
    const studentInfo = {
        name: "JOHN SMITH DOE",
        rollNo: "220103045",
        programme: "BTech",
        department: "Computer Science and Engineering",
        dateOfAdmission: "2022-07-28",
        currentSemester: "4th",
        cgpa: "8.75"
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            // API call will go here
            // For now, simulating delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            setPdfUrl('/sample-transcript.pdf'); // This will be replaced with actual PDF URL
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DocumentLayout title="Transcript">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Student Info Card */}
                <div className="card bg-base-100 shadow-lg border-2 border-base-200">
                    <div className="card-body">
                        <h3 className="card-title text-lg">Student Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InfoField label="Name" value={studentInfo.name} />
                            <InfoField label="Roll Number" value={studentInfo.rollNo} />
                            <InfoField label="Programme" value={studentInfo.programme} />
                            <InfoField label="Department" value={studentInfo.department} />
                            <InfoField label="Date of Admission" value={studentInfo.dateOfAdmission} />
                            <InfoField label="Current CGPA" value={studentInfo.cgpa} />
                        </div>
                    </div>
                </div>

                <PDFPreview pdfUrl={pdfUrl} isLoading={isLoading} />
                
                <div className="flex justify-center gap-4 pt-4">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="btn btn-primary min-w-[200px]"
                    >
                        {isLoading ? 'Generating...' : 'Generate Transcript'}
                    </button>
                    {pdfUrl && (
                        <a 
                            href={pdfUrl} 
                            download 
                            className="btn btn-accent min-w-[200px]"
                        >
                            Download PDF
                        </a>
                    )}
                </div>
            </div>
        </DocumentLayout>
    );
};

const InfoField = ({ label, value }) => (
    <div>
        <label className="text-xs text-base-content/60">{label}</label>
        <p className="font-medium">{value}</p>
    </div>
);

export default TranscriptPage;
