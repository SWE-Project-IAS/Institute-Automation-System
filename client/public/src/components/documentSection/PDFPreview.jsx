import React from 'react';

const PDFPreview = ({ pdfUrl, isLoading }) => {
    if (isLoading) {
        return (
            <div className="min-h-[800px] w-full rounded-xl border-2 border-base-300 flex items-center justify-center bg-base-200/50">
                <div className="flex flex-col items-center gap-4">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="text-base-content/60 text-sm">Generating document...</p>
                </div>
            </div>
        );
    }

    if (!pdfUrl) {
        return (
            <div className="min-h-[800px] w-full rounded-xl border-2 border-dashed border-base-300 flex items-center justify-center bg-base-200/50">
                <p className="text-base-content/60">Click generate to preview the document</p>
            </div>
        );
    }

    return (
        <iframe
            src={pdfUrl}
            className="w-full min-h-[800px] rounded-xl border-2 border-base-300 shadow-lg"
            title="PDF Preview"
        />
    );
};

export default PDFPreview;
