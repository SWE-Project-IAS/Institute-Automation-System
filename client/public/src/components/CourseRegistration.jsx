import { useState } from "react";

const CourseRegistration = () => {
    const coreCourses = ["Data Structures", "Operating Systems", "Computer Networks"];
    const electiveCourses = ["AI", "Cyber Security", "Cloud Computing", "Blockchain", "Data Science"];
    const auditCourses = ["Ethics in AI", "Financial Management", "Psychology", "Machine Learning", "Leadership", "Philosophy", "Environmental Science", "Digital Marketing", "Robotics", "Astronomy"];

    const [selectedElectives, setSelectedElectives] = useState(["", ""]);
    const [selectedAudits, setSelectedAudits] = useState(["", "", ""]);

    const handleElectiveChange = (index, course) => {
        let updatedElectives = [...selectedElectives];
        updatedElectives[index] = course;
        setSelectedElectives(updatedElectives);
    };

    const handleAuditChange = (index, course) => {
        let updatedAudits = [...selectedAudits];
        updatedAudits[index] = course;
        setSelectedAudits(updatedAudits);
    };

    return (
        <div className="p-5">
            <h2 className="text-xl font-bold mb-4">Course Registration</h2>

            {/* Core Courses Section */}
            <h3 className="text-lg font-semibold mb-2">Core Courses</h3>
            <ul className="mb-4">
                {coreCourses.map((course) => (
                    <li key={course} className="flex justify-between p-2 border-b">
                        {course}
                        <button className="bg-blue-500 text-white px-3 py-1 rounded">Register</button>
                    </li>
                ))}
            </ul>

            {/* Elective Courses Section */}
            <h3 className="text-lg font-semibold mb-2">Elective Courses</h3>
            {selectedElectives.map((selected, index) => (
                <div key={index} className="flex justify-between p-2 border-b">
                    <select
                        className="border p-2 w-1/4"
                        onChange={(e) => handleElectiveChange(index, e.target.value)}
                        value={selected}
                    >
                        <option value="">Select Elective Course</option>
                        {electiveCourses.map((course) => (
                            <option key={course} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                    <button
                        className={`px-3 py-1 rounded ${
                            selected ? "bg-blue-500 text-white" : "bg-gray-300"
                        }`}
                        disabled={!selected}
                    >
                        Register
                    </button>
                </div>
            ))}

            {/* Audit Courses Section */}
            <h3 className="text-lg font-semibold mt-4 mb-2">Audit Courses</h3>
            {selectedAudits.map((selected, index) => (
                <div key={index} className="flex justify-between p-2 border-b">
                    <select
                        className="border p-2 w-1/4"
                        onChange={(e) => handleAuditChange(index, e.target.value)}
                        value={selected}
                    >
                        <option value="">Select Audit Course</option>
                        {auditCourses.map((course) => (
                            <option key={course} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                    <button
                        className={`px-3 py-1 rounded ${
                            selected ? "bg-blue-500 text-white" : "bg-gray-300"
                        }`}
                        disabled={!selected}
                    >
                        Register
                    </button>
                </div>
            ))}
        </div>
    );
};

export default CourseRegistration;
