import React, { useState, useEffect, useRef } from 'react';

const SearchableStudentDropdown = ({ setShowStats }) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const dropdownRef = useRef(null);
  
  // Example student list - replace with your actual data source
  const studentList = [
    { rollNumber: '001', name: 'Alice Johnson' },
    { rollNumber: '002', name: 'Bob Smith' },
    { rollNumber: '003', name: 'Carol Williams' },
    { rollNumber: '004', name: 'David Brown' },
    { rollNumber: '005', name: 'Emma Davis' },
    // Add more students as needed
  ];
  
  // Filter students based on search term
  useEffect(() => {
    const filtered = studentList.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.rollNumber.includes(searchTerm)
    );
    setFilteredStudents(filtered);
  }, [searchTerm]);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleStudentSelect = (rollNumber, name) => {
    setSelectedStudent(rollNumber);
    setIsOpen(false);
    
    // Set showStats to true when a student is selected
    if (setShowStats) {
      setShowStats(true);
    }
    
    // You can add additional logic here as needed
  };
  
  const displayValue = selectedStudent 
    ? `${studentList.find(s => s.rollNumber === selectedStudent)?.rollNumber} - ${studentList.find(s => s.rollNumber === selectedStudent)?.name}`
    : '';
  
  return (
    <div className="relative w-auto mr-3 ml-3 mt-3 mb-3 p-4 bg-gray-100 rounded-lg" ref={dropdownRef}>
      <div className="flex flex-row items-center space-x-4">
        <label htmlFor="student-search" className="font-medium text-gray-700 whitespace-nowrap">
          Select Student:
        </label>
        <div className="relative flex-grow">
          <input
            type="text"
            id="student-search"
            placeholder="Search by name or roll number"
            value={isOpen ? searchTerm : displayValue}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {isOpen && (
            <div className="absolute top-full left-0 w-full mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div
                    key={student.rollNumber}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleStudentSelect(student.rollNumber, student.name)}
                  >
                    {student.rollNumber} - {student.name}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500 italic">
                  No matching students found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden select element for form submission if needed */}
      <select 
        id="student-select" 
        value={selectedStudent}
        onChange={(e) => {
          setSelectedStudent(e.target.value);
          if (e.target.value && setShowStats) {
            setShowStats(true);
          }
        }}
        className="hidden"
      >
        <option value="">-- Select Student --</option>
        {studentList.map((student) => (
          <option key={student.rollNumber} value={student.rollNumber}>
            {student.rollNumber} - {student.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchableStudentDropdown;