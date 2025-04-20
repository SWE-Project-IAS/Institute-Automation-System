import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { useMutation } from "@tanstack/react-query";
import newRequest from '../../utils/newRequest';

const AddStudents = () => {
  const [students, setStudents] = useState([]);
  const [fileName, setFileName] = useState('');
  const [fileChosen, setFileChosen] = useState(false);
  const fileInputRef = useRef(null);

  const useAddStudents = () => {
    return useMutation({
      mutationFn: (students) =>
        newRequest
          .post("/acadadmin/students/add-students", students)
          .then((res) => {
            console.log("Students added successfully:", res.data);
            return res.data;
          }),
    });
  };

  const { mutate: addStudents, isPending, error, data } = useAddStudents();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setFileChosen(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const validData = results.data.filter((row) =>
          Object.values(row).every((value) => value.trim() !== '')
        );
        setStudents(validData);
      },
    });
  };

  const handleRemoveFile = () => {
    setStudents([]);
    setFileName('');
    setFileChosen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (students.length === 0) {
      alert("No valid students to submit.");
      return;
    }
  
    addStudents(students, {
      onSuccess: (data) => {
        alert(`${data.message}`);
        setStudents([]);
        setFileName('');
        setFileChosen(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      onError: (err) => {
        alert("Failed to add students.");
        console.error(err);
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Students via CSV</h2>

      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">Upload CSV File</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          ref={fileInputRef}
          disabled={fileChosen}
          className={`block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
            fileChosen
              ? 'file:bg-gray-300 file:text-gray-500 cursor-not-allowed'
              : 'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
          }`}
        />
        {fileName && (
          <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
            <span>Uploaded: {fileName}</span>
            <button
              onClick={handleRemoveFile}
              className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Remove File
            </button>
          </div>
        )}
      </div>

      {students.length > 0 && (
        <div className="overflow-x-auto border rounded-lg mb-6">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                {Object.keys(students[0]).map((key) => (
                  <th key={key} className="px-4 py-2 font-semibold text-gray-600">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {Object.values(student).map((value, idx) => (
                    <td key={idx} className="px-4 py-2 text-gray-700">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={students.length === 0}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        Submit Students
      </button>
    </div>
  );
};

export default AddStudents;
