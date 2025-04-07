import React, { useState } from "react";

const NewComplaintForm = ({ category, subCategory }) => {
    const [title, setTitle] = useState("");
    const [complaint, setComplaint] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [timeAvailability, setTimeAvailability] = useState("");
    const [locality, setLocality] = useState("");
    const [detailedAddress, setDetailedAddress] = useState("");
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
    //     // Handle form submission logic here
    //     console.log("Form submitted:",{ title, complaint, phoneNumber, locality, detailedAddress, file, category, subCategory });
    //     if (!title || !complaint || !phoneNumber || !locality || !detailedAddress) {
    //         alert("All fields are required!");
    //         return;
    //     }
    //     try {
    //         const response = await fetch("http://localhost:8000/api/complaints/create", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ title, date: new Date(), description: complaint, phoneNumber, address: detailedAddress, locality, category, subCategory }),
    //         });

    //         const data = await response.json();

    //         if (response.status === 201) {
    //             console.log("Complaint submitted successfully:", data);

    //         } else {
    //             alert(`Submission failed: ${data.message || "Unknown error"}`);
    //         }
    //     } catch (error) {
    //         console.error("Error Submitting Error :", error);
    //         alert("Failed to connect to the server.");
    //     }
    };

    const handleClear = () => {
        setComplaint("");
        setPhoneNumber("");
        setTimeAvailability("");
        setLocality("");
        setDetailedAddress("");
        setFile(null);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Register a new Complaint:</h2>

            <form onSubmit={handleSubmit}>
                <label className="block font-semibold mb-2">Title</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded-md mb-4"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label className="block font-semibold mb-2">Complaint (Within 400 Characters ONLY)</label>
                <textarea
                    className="w-full p-2 border rounded-md mb-4"
                    rows="4"
                    maxLength={400}
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                />

                <label className="block font-semibold mb-2">Phone Number</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded-md mb-4"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />

                <label className="block font-semibold mb-2">Time of availability:</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded-md mb-4"
                    value={timeAvailability}
                    onChange={(e) => setTimeAvailability(e.target.value)}
                />

                <label className="block font-semibold mb-2">Locality:</label>
                <select
                    className="w-full p-2 border rounded-md mb-4"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                >
                    <option value="">Please Select</option>
                    <option value="Locality1">Locality1</option>
                    <option value="Locality2">Locality2</option>
                </select>

                <label className="block font-semibold mb-2">Detail Address:</label>
                <textarea
                    className="w-full p-2 border rounded-md mb-4"
                    rows="2"
                    value={detailedAddress}
                    onChange={(e) => setDetailedAddress(e.target.value)}
                />

                <label className="block font-semibold mb-2">Upload Image: only .jpg, .jpeg, .JPG format, size2MB </label>
                <input
                    type="file"
                    className="w-full p-2 border rounded-md mb-4"
                    accept=".jpg,.jpeg,.JPG"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button
                    type="button"
                    className="text-blue-500 mb-4"
                >
                    Add More Files
                </button>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="bg-orange-500 text-white px-4 py-2 rounded-md"
                    >
                        Clear
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewComplaintForm;
