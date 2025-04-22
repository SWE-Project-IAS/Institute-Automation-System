import React, { useState } from 'react';
import { FaBook, FaSave } from 'react-icons/fa';
import newRequest from '../../utils/newRequest';

const CourseForm = () => {
  const [form, setForm] = useState({
    courseCode: '',
    courseName: '',
    courseDepartment: '',
    maxIntake: '',
    faculty: '',
    slot: '',
    credits: '',
    year: '',
    session: '',
    program: '',
    mappingDepartment: '',
    semester: '', // Changed from semesters array to single semester
    type: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle all input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset the form after submission
  const resetForm = () => {
    setForm({
      courseCode: '',
      courseName: '',
      courseDepartment: '',
      maxIntake: '',
      faculty: '',
      slot: '',
      credits: '',
      year: '',
      session: '',
      program: '',
      mappingDepartment: '',
      semester: '', // Changed from semesters array to single semester
      type: ''
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (
      !form.courseCode ||
      !form.courseName ||
      !form.courseDepartment ||
      !form.program ||
      !form.mappingDepartment ||
      !form.semester || // Check for single semester instead of array length
      !form.type
    ) {
      alert('Please fill all required fields.');
      setIsSubmitting(false);
      return;
    }

    // Prepare payload as expected by backend
    const payload = {
      courseCode: form.courseCode,
      courseName: form.courseName,
      courseDepartment: form.courseDepartment,
      maxIntake: form.maxIntake,
      faculty: form.faculty,
      slot: form.slot,
      credits: form.credits,
      year: form.year,
      session: form.session,
      configurations: [
        {
          program: form.program,
          department: form.mappingDepartment,
          semesters: [form.semester], // Convert single semester to array for API compatibility
          type: form.type
        }
      ]
    };

    try {
      const response = await newRequest.post('/course/create-course', payload);
      if (response.status === 200) {
        alert(response.data.message || 'Course registered successfully!');
        resetForm();
      } else {
        alert('Unexpected response from the server.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert(err.response?.data?.message || 'Failed to register course. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <FaBook className="inline mr-2" />
        Course Registration
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'courseCode', label: 'Course Code', required: true },
            { name: 'courseName', label: 'Course Name', required: true },
            { name: 'courseDepartment', label: 'Department', required: true },
            { name: 'maxIntake', label: 'Max Intake', type: 'number' },
            { name: 'faculty', label: 'Faculty ID' },
            { name: 'slot', label: 'Time Slot' },
            { name: 'credits', label: 'Credits', type: 'number' },
            { name: 'year', label: 'Academic Year' },
            { name: 'session', label: 'Session' }
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type || 'text'}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required={field.required}
              />
            </div>
          ))}
        </div>

        {/* Mapping Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Program Mapping</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Program<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="program"
                value={form.program}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="mappingDepartment"
                value={form.mappingDepartment}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Semester<span className="text-red-500">*</span></label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <label key={sem} className="flex items-center">
                  <input
                    type="radio"
                    name="semester"
                    value={String(sem)}
                    checked={form.semester === String(sem)}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded-full border-gray-300"
                    required
                  />
                  <span className="ml-2 text-sm">Semester {sem}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Course Type<span className="text-red-500">*</span></label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select Type</option>
              <option value="Core">Core</option>
              <option value="Elective">Elective</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:bg-gray-400 flex justify-center items-center"
        >
          <FaSave className="mr-2" />
          {isSubmitting ? 'Submitting...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
};

export default CourseForm;