import React, { useState } from "react";

const studentsData = [
    { id: 1, name: "John Doe", rollNo: "21CSB001", program: "B.Tech CSE", semester: "4" },
    { id: 2, name: "Jane Smith", rollNo: "21CSB002", program: "B.Tech CSE", semester: "4" },
    { id: 3, name: "Alex Brown", rollNo: "21CSB103", program: "B.Tech IT", semester: "4" },
    { id: 4, name: "Alex Smith", rollNo: "20CSB101", program: "B.Tech IT", semester: "6" },
    { id: 5, name: "James Brown", rollNo: "20CSB105", program: "B.Tech IT", semester: "6" },
    { id: 6, name: "Jon Dow", rollNo: "21CSM103", program: "M.Tech IT", semester: "4" },
    { id: 7, name: "Jack Dow", rollNo: "21CSM105", program: "M.Tech IT", semester: "4" },
    { id: 8, name: "Edward Kenway", rollNo: "21CSM003", program: "M.Tech CSE", semester: "4" },
];

const CourseRegistrationFaculty = () => {
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [filters, setFilters] = useState({ rollNo: "", name: "", program: "", semester: "" });

    const handleSelectStudent = (id) => {
        setSelectedStudents((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    const filteredStudents = studentsData.filter((student) =>
        Object.entries(filters).every(([key, value]) => student[key].toLowerCase().includes(value.toLowerCase()))
    );

    const handleApprove = () => {
        alert(`Approved ${selectedStudents.length} students!`);
        setSelectedStudents([]);
    };

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">Student Registration Requests</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {["rollNo", "name", "program", "semester"].map((key) => (
                    <input
                        key={key}
                        type="text"
                        placeholder={`Filter by ${key}`}
                        className="border p-2 rounded-md"
                        value={filters[key]}
                        onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                    />
                ))}
            </div>

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">
                            <input
                                type="checkbox"
                                onChange={(e) => setSelectedStudents(e.target.checked ? studentsData.map((s) => s.id) : [])}
                                checked={selectedStudents.length === studentsData.length}
                            />
                        </th>
                        <th className="border p-2">Roll No</th>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Program</th>
                        <th className="border p-2">Semester</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-100">
                            <td className="border p-2 text-center">
                                <input
                                    type="checkbox"
                                    checked={selectedStudents.includes(student.id)}
                                    onChange={() => handleSelectStudent(student.id)}
                                />
                            </td>
                            <td className="border p-2">{student.rollNo}</td>
                            <td className="border p-2">{student.name}</td>
                            <td className="border p-2">{student.program}</td>
                            <td className="border p-2">{student.semester}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                onClick={handleApprove}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={selectedStudents.length === 0}
            >
                Approve Selected
            </button>
        </div>
    );
};

export default CourseRegistrationFaculty;
