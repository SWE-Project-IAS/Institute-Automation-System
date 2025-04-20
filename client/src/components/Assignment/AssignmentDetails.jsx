  import { useParams } from "react-router-dom";
  import { useState, useEffect } from "react";
  import { FaCheckCircle, FaUndo, FaFileUpload } from "react-icons/fa";

  export default function AssignmentDetail() {
    const { courseId, assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [submissionText, setSubmissionText] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submissionTime, setSubmissionTime] = useState(null);
    const [file, setFile] = useState(null);
    const [student, setStudent] = useState(null);
    const [isBeforeDeadline, setIsBeforeDeadline] = useState(true);
    const [user, setUser] = useState(null);
    const [submittedFileName, setSubmittedFileName] = useState('');
    const [marks, setMarks] = useState(null);


    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userId = currentUser?.data?.user?.userId;

    useEffect(() => {
      const fetchStudent = async () => {
        const res = await fetch(`process.env.REACT_APP_API_URL/assignment/student/${userId}`);
        const data = await res.json();
        if (res.ok) setStudent(data.student);
      };

      fetchStudent();
    }, [userId]);

    useEffect(() => {
      const fetchUser = async () => {
        const res = await fetch(`process.env.REACT_APP_API_URL/assignment/${userId}`);
        const data = await res.json();
        if (res.ok) setUser(data.user);
      };

      fetchUser();
    }, [userId]);

    useEffect(() => {
      const fetchAssignment = async () => {
        const res = await fetch(`process.env.REACT_APP_API_URL/assignment/${courseId}/${assignmentId}`);
        const data = await res.json();
        if (res.ok) {
          const dueDate = new Date(data.assignment.dueDate);
          setIsBeforeDeadline(new Date() <= dueDate);
          const sub = data.assignment.submissions?.find(
            (s) => s.studentRollNo === student?.rollNo
          );
          if (sub) {
            setSubmitted(true);
            setSubmissionTime(sub.submittedAt);
            setSubmissionText(sub.content);
            setSubmittedFileName(sub.fileName);
            setMarks(sub.marks);
          }
          setAssignment(data.assignment);
        }
      };

      if (courseId && assignmentId && student) {
        fetchAssignment();
      }
    }, [courseId, assignmentId, student,marks]);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleSubmit = async () => {
      if (!submissionText && !file) return alert("Please provide text or file.");

      const formData = new FormData();
      formData.append("studentRollNo", student.rollNo);
      formData.append("studentName", user.name);
      formData.append("content", submissionText);
      if (file) formData.append("file", file);
      formData.append("fileName", file?.name || '');

      try {
        const res = await fetch(
          `process.env.REACT_APP_API_URL/assignment/${courseId}/${assignmentId}/submit`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (res.ok) {
          setSubmitted(true);
          setSubmissionTime(new Date().toLocaleString());
          alert("Submitted!");
        } else {
          alert("Failed to submit.");
        }
      } catch (err) {
        console.error(err);
        alert("Submission error.");
      }
    };

    const handleUndo = async () => {
      const res = await fetch(
        `process.env.REACT_APP_API_URL/assignment/${courseId}/${assignmentId}/undo/${student.rollNo}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setSubmitted(false);
        setSubmissionText('');
        setSubmissionTime(null);
        setSubmittedFileName('');
      }
    };

    if (!assignment) return <p>Loading...</p>;

    return (
      <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md border border-gray-300">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h2>
        <p className="text-gray-600 text-sm mb-4"><strong>Course:</strong> {assignment.courseCode}</p>
        <p className="text-gray-700 mb-4">{assignment.description}</p>
        <p className="text-gray-600 text-sm mb-6"><strong>Due:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>

        {submitted && (
          <div className="p-4 mb-4 bg-green-100 border rounded-md">
            <p className="text-green-700 font-semibold">✅ Submitted!</p>
            <p className="text-gray-600 text-sm">📌 {submissionTime}</p>
            <p className="text-gray-600 text-sm">Text: {submissionText}</p>
          </div>
        )}

        {isBeforeDeadline ? (
          <div className="space-y-4">
            <label className="block">
              <FaFileUpload className="inline-block mr-2" /> Submission Text:
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                className="block w-full mt-2 border rounded-md p-2"
                disabled={submitted}
              />
            </label>

            <label className="block">
              Upload File:
              <input
                type="file"
                onChange={handleFileChange}
                disabled={submitted}
                className="mt-2"
              />


              {/* Show the name of the submitted file if it's already submitted */}
              {submitted && submittedFileName && !file && (
                <p className="mt-1 text-sm text-gray-600">
                  📎 Submitted file: <span className="font-medium">{submittedFileName}</span>
                </p>
                
              )}
              {/* If no file is chosen, show "No file chosen" or the submitted file's name */}
            </label>

            <div className="flex gap-4">
              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  <FaCheckCircle className="mr-2" /> Submit
                </button>
              ) : (
                <button
                  onClick={handleUndo}
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  <FaUndo className="mr-2" /> Undo
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
    <p className="text-red-500 font-medium">⏳ Deadline has passed.</p>
    {submitted && (
      <p className="text-gray-600 text-sm">
        Marks: {marks !== null && marks !== undefined ? `${marks}/100` : 'Not graded yet'}
      </p>
    )}
  </>
          
        )}
      </div>
    );
  }
