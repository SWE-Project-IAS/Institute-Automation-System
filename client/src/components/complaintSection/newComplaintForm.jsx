import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import convertImageToBase64 from "../../utils/convertImageToBase64";

const NewComplaintForm = ({ category, subCategory, onBack }) => {
    const [title, setTitle] = useState("");
    const [complaint, setComplaint] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [timeAvailability, setTimeAvailability] = useState("");
    const [locality, setLocality] = useState("");
    const [detailedAddress, setDetailedAddress] = useState("");
    const [files, setFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const dropZoneRef = useRef(null);
    const dragCounter = useRef(0);

    const queryClient = useQueryClient();

    const submitComplaint = async (formData) => {
        const accessToken = localStorage.getItem("accessToken");

        const res = await fetch("https://ias-server-cpoh.onrender.com/api/complaints/create", {

            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `${accessToken}`,
            },
            body: JSON.stringify(formData),
            credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data?.message || "Failed to submit complaint");
        }
        onBack(); // Call the onBack function to navigate back to the previous page
        return data;
    };

    const mutation = useMutation({
        mutationFn: submitComplaint,
        onSuccess: () => {
            toast.success("Complaint submitted successfully!");
            handleClear();
            // Invalidate all complaints queries to refetch with updated pagination
            queryClient.invalidateQueries(["complaints"]);
        },
        onError: (err) => {
            toast.error(`Error: ${err.message}`);
        },
        onSettled: () => {
            setIsSubmitting(false);
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic validation for required fields
        if (!title || !complaint || !phoneNumber || !timeAvailability || !locality || !detailedAddress) {
            toast.error("All fields are required!");
            setIsSubmitting(false);
            return;
        }

        // Phone number validation
        const phoneRegex = /^\+?\d{1,4}[\s-]?\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            toast.error("Please enter a valid phone number (e.g., +91 9876543210)");
            setIsSubmitting(false);
            return;
        }

        // Since timeAvailability is now a dropdown, simple non-empty check is enough
        if (!timeAvailability) {
            toast.error("Please select a time slot for availability.");
            setIsSubmitting(false);
            return;
        }

        try {
            const base64Images = await Promise.all(files.map((file) => convertImageToBase64(file)));
            const formData = {
                title: title,
                date: new Date(),
                description: complaint,
                phoneNumber: phoneNumber,
                timeAvailability: timeAvailability,
                address: detailedAddress,
                locality: locality,
                category: category,
                subCategory: subCategory,
                status: "Pending",
                images: base64Images,
            };

            mutation.mutate(formData);
        } catch (error) {
            toast.error("Error processing images. Please try again.");
            setIsSubmitting(false);
        }
    };

    const handleClear = () => {
        setTitle("");
        setComplaint("");
        setPhoneNumber("");
        setTimeAvailability("");
        setLocality("");
        setDetailedAddress("");
        setFiles([]);
        setCharacterCount(0);
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        processFiles(newFiles);
    };

    // Process and validate files from drag-drop or file input
    const processFiles = (newFiles) => {
        // Filter valid formats and size (<200kB)
        const validFiles = newFiles.filter((file) => /\.(jpe?g)$/i.test(file.name) && file.size <= 2 * 1024 * 100);
        const invalidFiles = newFiles.filter((file) => !(/\.(jpe?g)$/i.test(file.name) && file.size <= 2 * 1024 * 100));

        if (invalidFiles.length > 0) {
            toast.error("Some files were rejected. Make sure they are JPG format and under 200KB.");
        }

        if (files.length + validFiles.length > 5) {
            toast.error("You can only upload a maximum of 5 files.");
            return;
        }

        setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    };

    // Drag event handlers
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) {
            setIsDragging(true);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounter.current = 0;

        // Get the dropped files
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            processFiles(droppedFiles);
            e.dataTransfer.clearData();
        }
    };

    // Reset drag counter when unmounting
    useEffect(() => {
        return () => {
            dragCounter.current = 0;
        };
    }, []);

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleDescriptionChange = (e) => {
        const text = e.target.value;
        setCharacterCount(text.length);
        setComplaint(text);
    };

    // Array of locality options specific to the campus
    const localityOptions = ["Academic Complex", "Administration Building", "Faculty Quarters", "Hostel Area - Men's", "Hostel Area - Women's", "Library Complex", "Market Complex", "Sports Complex", "Student Activity Center"];

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-12 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register a New Complaint</h2>
            <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                    <span className="font-semibold">Category:</span> {category} → {subCategory}
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Title</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief title describing your issue"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Complaint Description
                        <span className={`ml-2 text-xs font-normal ${characterCount > 350 ? "text-red-500" : "text-gray-500"}`}>({characterCount}/400 characters)</span>
                    </label>
                    <textarea
                        className={`w-full p-3 border ${characterCount > 350 ? "border-orange-300" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        rows="4"
                        maxLength={400}
                        placeholder="Describe your issue in detail..."
                        value={complaint}
                        onChange={handleDescriptionChange}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+91 9876543210"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500">Format: Country code followed by 10-digit number</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time for Visit</label>
                        <div className="relative">
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                value={timeAvailability}
                                onChange={(e) => setTimeAvailability(e.target.value)}
                                required
                            >
                                <option value="">Select Time Slot</option>
                                <option value="08:00 - 10:00 AM">08:00 - 10:00 AM</option>
                                <option value="10:00 - 12:00 PM">10:00 - 12:00 PM</option>
                                <option value="12:00 - 02:00 PM">12:00 - 02:00 PM</option>
                                <option value="02:00 - 04:00 PM">02:00 - 04:00 PM</option>
                                <option value="04:00 - 06:00 PM">04:00 - 06:00 PM</option>
                                <option value="06:00 - 08:00 PM">06:00 - 08:00 PM</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Locality</label>
                        <div className="relative">
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                value={locality}
                                onChange={(e) => setLocality(e.target.value)}
                                required
                            >
                                <option value="">Select Location</option>
                                {localityOptions.map((option) => (
                                    <option
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Address</label>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="2"
                            placeholder="Room number, building name, etc."
                            value={detailedAddress}
                            onChange={(e) => setDetailedAddress(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Images
                        <span className="text-xs font-normal text-gray-500 ml-1">(Optional, max 5 files)</span>
                    </label>
                    <div
                        ref={dropZoneRef}
                        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 border-dashed"} rounded-lg transition-all duration-200`}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="space-y-1 text-center pointer-events-none">
                            <svg
                                className={`mx-auto h-12 w-12 ${isDragging ? "text-blue-500" : "text-gray-400"}`}
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none pointer-events-auto"
                                >
                                    <span>Upload images</span>
                                    <input
                                        ref={fileInputRef}
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        accept=".jpg,.jpeg,.JPG"
                                        multiple
                                        onChange={handleFileChange}
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">JPG format only, max 200KB each</p>
                            {isDragging && <p className="text-sm text-blue-600 animate-pulse font-medium">Drop files here...</p>}
                        </div>
                    </div>
                </div>

                {/* File List with Preview */}
                {files.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({files.length}/5):</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="relative group"
                                >
                                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 shadow-sm">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index + 1}`}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 focus:outline-none"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                    <p className="mt-1 text-xs text-gray-500 truncate">
                                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                                Submit Complaint
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        disabled={isSubmitting}
                        className={`flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg transition-colors duration-300 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        Clear Form
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewComplaintForm;
