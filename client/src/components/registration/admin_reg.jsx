import React, { useState } from 'react';

const programs = ['B.Tech', 'M.Tech'];
const departments = ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT'];
const semestersByProgram = {
    'B.Tech': ['1', '2', '3', '4', '5', '6', '7', '8'],
    'M.Tech': ['1', '2', '3', '4']
};

const AdminRegistration = () => {
    const [courseInfo, setCourseInfo] = useState({
        courseCode: '',
        courseName: '',
        maxIntake: '',
        faculty: ''
    });

    const [config, setConfig] = useState({
        program: '',
        department: '',
        semesters: []
    });

    const [mappings, setMappings] = useState([]);

    const handleCourseChange = (e) => {
        const { name, value } = e.target;
        setCourseInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: value,
            semesters: name === 'program' ? [] : prev.semesters // reset semesters on program change
        }));
    };

    const handleSemesterSelect = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setConfig(prev => ({ ...prev, semesters: selected }));
    };

    const addMapping = () => {
        if (!config.program || !config.department || config.semesters.length === 0) {
            alert("Please select program, department, and at least one semester.");
            return;
        }
        setMappings(prev => [...prev, config]);
        setConfig({ program: '', department: '', semesters: [] });
    };

    const removeMapping = (index) => {
        const updated = [...mappings];
        updated.splice(index, 1);
        setMappings(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mappings.length === 0) {
            alert("Please add at least one program-department-semester mapping.");
            return;
        }
        const payload = {
            ...courseInfo,
            configurations: mappings
        };
        console.log("Submitted:", payload);
        alert("Course registration saved!");

        // Reset
        setCourseInfo({
            courseCode: '',
            courseName: '',
            maxIntake: '',
            faculty: ''
        });
        setMappings([]);
        setConfig({ program: '', department: '', semesters: [] });
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Course Registration</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Course Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold">Course Code</label>
                        <input
                            type="text"
                            name="courseCode"
                            value={courseInfo.courseCode}
                            onChange={handleCourseChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Course Name</label>
                        <input
                            type="text"
                            name="courseName"
                            value={courseInfo.courseName}
                            onChange={handleCourseChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Max Intake</label>
                        <input
                            type="number"
                            name="maxIntake"
                            value={courseInfo.maxIntake}
                            onChange={handleCourseChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Faculty</label>
                        <input
                            type="text"
                            name="faculty"
                            value={courseInfo.faculty}
                            onChange={handleCourseChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                </div>

                <hr className="my-4" />

                {/* Configuration */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Add Program-Department-Semester Mapping</h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block font-medium">Program</label>
                            <select
                                name="program"
                                value={config.program}
                                onChange={handleConfigChange}
                                className="w-full border rounded p-2"
                            >
                                <option value="">Select</option>
                                {programs.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium">Department</label>
                            <select
                                name="department"
                                value={config.department}
                                onChange={handleConfigChange}
                                className="w-full border rounded p-2"
                                disabled={!config.program}
                            >
                                <option value="">Select</option>
                                {departments.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium">Semesters</label>
                            <select
                                multiple
                                value={config.semesters}
                                onChange={handleSemesterSelect}
                                className="w-full border rounded p-2 h-28"
                                disabled={!config.program}
                            >
                                {config.program && semestersByProgram[config.program].map(s => (
                                    <option key={s} value={s}>Semester {s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={addMapping}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        + Add Configuration
                    </button>
                </div>

                {/* Added Mappings */}
                {mappings.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-bold mb-2">Configured Mappings:</h4>
                        <ul className="space-y-2">
                            {mappings.map((map, idx) => (
                                <li key={idx} className="flex justify-between items-center border p-2 rounded">
                                    <span>
                                        {map.program} - {map.department} - Semesters: {map.semesters.join(', ')}
                                    </span>
                                    <button
                                        onClick={() => removeMapping(idx)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <hr className="my-4" />

                <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                    Submit Course
                </button>
            </form>
        </div>
    );
};

export default AdminRegistration;
