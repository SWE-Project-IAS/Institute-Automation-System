import React, { useState, useEffect, useContext } from 'react';
import { RoleContext } from "../../../context/Rolecontext";

function SearchableStudentDropdown({ courseId, onStudentSelect }) {
    const { role } = useContext(RoleContext);  
    const [selectedStudent, setSelectedStudent] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                if (role === "faculty") {
                    const response = await fetch(`https://ias-server-cpoh.onrender.com/api/attendancelanding/faculty/${courseId}`);
                    const data = await response.json();
                    
                    if (data?.rollNumbers) {
                        const students = data.rollNumbers.map(rollNo => ({
                            rollNumber: rollNo,
                            name: rollNo // Using rollNo as name placeholder
                        }));
                        setStudents(students);
                    }
                } else if (role === 'acadAdmin') {
                    const response = await fetch('https://ias-server-cpoh.onrender.com/api/attendancelanding/admin/student');
                    const data = await response.json();
                    
                    if (data?.data) {
                        const students = data.data.map(rollNo => ({
                            rollNumber: rollNo,
                            name: rollNo // Using rollNo as name placeholder
                        }));
                        setStudents(students);
                    }
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchStudents();
    }, [role, courseId]);

    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setIsDropdownOpen(true);
    };

    const handleStudentSelect = (rollNo) => {
        setSelectedStudent(rollNo);
        setSearchTerm(rollNo);
        setIsDropdownOpen(false);
        
        if (onStudentSelect) {
            onStudentSelect(rollNo);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setIsDropdownOpen(false);
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Stop propagation on dropdown click to prevent it from closing
    const handleDropdownClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="mx-5 my-4">
            <div className="relative" onClick={handleDropdownClick}>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search student by name or roll number..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onClick={() => setIsDropdownOpen(true)}
                />
                
                {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {loading ? (
                            <div className="p-2 text-gray-500">Loading students...</div>
                        ) : error ? (
                            <div className="p-2 text-red-500">Error loading students</div>
                        ) : filteredStudents.length > 0 ? (
                            filteredStudents.map(student => (
                                <div
                                    key={student.rollNumber}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleStudentSelect(student.rollNumber)}
                                >
                                    {student.rollNumber}
                                </div>
                            ))
                        ) : (
                            <div className="p-2 text-gray-500">No students found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchableStudentDropdown;