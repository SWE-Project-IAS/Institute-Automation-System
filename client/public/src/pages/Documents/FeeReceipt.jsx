import React, { useState } from 'react';
import DocumentLayout from '../../components/documentSection/DocumentLayout';
import PDFPreview from '../../components/documentSection/PDFPreview';

const FeeReceiptPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState('');

    const handleGenerate = async () => {
        if (!selectedSemester) return;
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setPdfUrl('/sample-receipt.pdf');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DocumentLayout title="Fee Receipt">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="w-full max-w-xs mx-auto mb-8">
                    <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select Semester</option>
                        {[1,2,3,4,5,6,7,8].map(num => (
                            <option key={num} value={num}>Semester {num}</option>
                        ))}
                    </select>
                </div>

                <PDFPreview pdfUrl={pdfUrl} isLoading={isLoading} />
                
                <div className="flex justify-center gap-4 pt-4">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !selectedSemester}
                        className="btn btn-primary min-w-[200px]"
                    >
                        {isLoading ? 'Generating...' : 'Generate Receipt'}
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

export default FeeReceiptPage;
