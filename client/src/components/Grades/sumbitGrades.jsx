import React, { useState, useEffect,useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoleContext } from "../../context/Rolecontext.jsx";
import * as XLSX from 'xlsx';

const SubmitGrades = () => {
  const { role } = useContext(RoleContext);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.data?.user?.userId; // Assuming the user object in localStorage contains userId


  const { courseID } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();
  // Inside useEffect add a check for empty data
    useEffect(() => {
      if (!userId) {
        alert("Please log in first.");
        navigate("/login");
        return;
      }
        const fetchStudents = async () => { 
            try {
            setLoading(true);
            const response = await fetch(`https://ias-server-cpoh.onrender.com/api/grades/${courseID}/getStudents`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('API response is not JSON format');
            }
            
            const data2 = await response.json();
            const data = data2.students;
            console.log('Fetched students:', data);
            
            // Check if data is empty or not an array
            if (!data || data.length === 0) {
                // Handle empty data case
                setStudents([]);
                setError("No students are enrolled in this course.");
            } else {
                // Initialize students with empty grades
                const studentsWithEmptyGrades = data.map(student => ({
                ...student,
                grade: ''
                }));
                
                setStudents(studentsWithEmptyGrades);
            }
            } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
            } finally {
            setLoading(false);
            }
        };
    
        fetchStudents();
  }, [courseID,userId]);

  const handleGradeChange = (rollNumber, newGrade) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.rollNumber === rollNumber ? { ...student, grade: newGrade } : student
      )
    );
  };

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validExtensions = ['csv', 'xls', 'xlsx'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
        alert(`Invalid file format. Please upload a file with one of the following extensions: ${validExtensions.join(', ')}`);
        return;
    }

    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
        let content = e.target.result;
        let rows;

        if (fileExtension === 'csv') {
            rows = content.split('\n');
        } else {
            try {
                const workbook = XLSX.read(content, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                rows = XLSX.utils.sheet_to_csv(sheet).split('\n');
            } catch (error) {
                alert('Error reading Excel file. Please ensure the file is valid.');
                return;
            }
        }

        const startIndex = rows[0].toLowerCase().includes('roll') ? 1 : 0;

        const gradesFromFile = {};
        const rollNumbersInFile = new Set();

        for (let i = startIndex; i < rows.length; i++) {
            const row = rows[i].trim();
            if (!row) continue;

            const columns = row.split(',');
            if (columns.length !== 2) {
                alert(`Invalid format in row ${i + 1}. Each row must have exactly 2 columns: Roll Number and Grade.`);
                return;
            }

            const rollNumber = columns[0].trim();
            const grade = columns[1].trim();

            if (!rollNumber || !grade) {
                alert(`Invalid data in row ${i + 1}. Roll Number and Grade cannot be empty.`);
                return;
            }

            if (!students.some(student => student.rollNumber === rollNumber)) {
                alert(`Roll Number ${rollNumber} in row ${i + 1} does not exist in the student list.`);
                return;
            }

            if (rollNumbersInFile.has(rollNumber)) {
                alert(`Duplicate Roll Number ${rollNumber} found in the file.`);
                return;
            }

            rollNumbersInFile.add(rollNumber);
            gradesFromFile[rollNumber] = grade;
        }

        // Override students with grades from the file
        setStudents(prevStudents =>
            prevStudents.map(student => ({
                ...student,
                grade: gradesFromFile[student.rollNumber] || ''
            }))
        );
    };

    if (fileExtension === 'csv') {
        reader.readAsText(file);
    } else {
        reader.readAsBinaryString(file);
    }
};

  const areAllGradesFilled = () => {
    return students.every(student => student.grade.trim() !== '');
  };

  const handleSubmit = async () => {
    if (!areAllGradesFilled()) {
      setSubmitError('All students must have grades assigned before submission');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Replace with your actual API endpoint
      const response = await fetch(`https://ias-server-cpoh.onrender.com/api/grades/${courseID}/submitGrades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          students, 
          faculty: userId 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit grades');
      }
      
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
      
      setTimeout(() => {
        navigate('/gradeLanding');
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <h2 className="text-lg font-medium text-red-800">Error</h2>
        <p className="mt-1 text-red-700">{error}</p>
      </div>
    );
  }

    return (
    <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Submit Grades for Course {courseID}</h1>
        
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-lg font-medium">Grade Submission</h2>
            
            {students.length > 0 && (
            <div className="relative">
                <input
                type="file"
                accept=".csv, .xlsx, .xls"
                id="csv-upload"
                onInput={(event) => {
                    setCsvFile(null);
                    handleFileUpload(event);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <label 
                htmlFor="file-upload" 
                className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded cursor-pointer transition-colors"
                >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>{csvFile ? csvFile.name : 'Import File'}</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Format: Roll Number, Grade</p>
            </div>
            )}
        </div>
        
        {students.length === 0 ? (
            <div className="py-8 text-center">
            <p className="text-gray-500 text-lg">No students are enrolled in this course.</p>
            </div>
        ) : (
            <>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left border">Roll Number</th>
                    <th className="px-4 py-2 text-left border">Name</th>
                    <th className="px-4 py-2 text-left border">Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                    <tr key={student.rollNumber} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{student.rollNumber}</td>
                        <td className="px-4 py-2 border">{student.name}</td>
                        <td className="px-4 py-2 border">
                        <input
                            type="text"
                            value={student.grade}
                            onChange={(e) => handleGradeChange(student.rollNumber, e.target.value)}
                            className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter grade"
                        />
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            
            {!areAllGradesFilled() && (
                <p className="text-amber-600 mt-4">
                * All students must have grades assigned before submission
                </p>
            )}
            
            {submitError && (
                <div className="bg-red-50 p-3 rounded mt-4">
                <p className="text-red-700">{submitError}</p>
                </div>
            )}
            
            {submitSuccess && (
                <div className="bg-green-50 p-3 rounded mt-4">
                <p className="text-green-700">Grades successfully submitted!</p>
                </div>
            )}
            
            <div className="mt-6 flex justify-end">
                <button
                onClick={handleSubmit}
                disabled={isSubmitting || !areAllGradesFilled()}
                className={`px-4 py-2 rounded font-medium ${
                    areAllGradesFilled() 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } transition-colors`}
                >
                {isSubmitting ? 'Submitting...' : 'Submit Grades'}
                </button>
            </div>
            </>
        )}
        </div>
    </div>
    );
};

export default SubmitGrades;