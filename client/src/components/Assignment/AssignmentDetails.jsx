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
  const[student, setStudent] = useState(null); // State to store student data
  const [isBeforeDeadline, setIsBeforeDeadline] = useState(true); // State to track if the deadline has passed
  const[user, setUser] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.data?.user?.userId;
  // console.log("User ID:", userId);
  // console.log("currentUser:", currentUser);
  // const studentRollNo = currentUser?.data?.user?.rollNo; // Assuming the user object in localStorage contains rollNo
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`https://ias-server-cpoh.onrender.com/api/assignment/student/${userId}`);
        const data = await response.json();
        // console.log("Response from student data API:", data);
        // console.log("Student data:", data);
        if (response.ok && data.student) {
          // Update local state with the latest user data if needed
          setStudent(data.student); // Assuming the API returns the roll number
          // console.log("Fetched student roll number:", data.student.rollNo);
          // console.log("Fetched student data:", data.student);
        } else {
          console.error("Failed to fetch student data");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, [userId]);
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      try {
        console.log(userId)
        const response = await fetch(`https://ias-server-cpoh.onrender.com/api/assignment/${userId}`);
        const data = await response.json();
        
        if (response.ok && data.user) {
          setUser(data.user);
          // console.log("Fetched user data:", data.user);
          // If we need student data as well
          if (data.user.role === 'student') {
            const studentResponse = await fetch(`https://ias-server-cpoh.onrender.com/api/assignment/student/${userId}`);
            const studentData = await studentResponse.json();
            // console.log("Fetched student data:", student);
            // console.log("Fetched user data:", user);
            
            if (studentResponse.ok && studentData.student) {
              setStudent(studentData.student);
            } else {
              console.error("Failed to fetch student data");
            }
          }
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, student]); // Add student to dependencies if needed
  
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(`https://ias-server-cpoh.onrender.com/api/assignment/${courseId}/${assignmentId}`);
        const data = await response.json();
        
        if (response.ok && data.assignment) {
          console.log("Assignment data:", data.assignment);
          
          // Check due date using data directly, not state
          const dueDate = new Date(data.assignment.dueDate);
          const today = new Date();
          setIsBeforeDeadline(today <= dueDate);
          
          // Check if already submitted
          console.log("Assignment submissions:", data.assignment.submissions);
          // console.log("Student roll number:", student);
          const submittedAssignment = data.assignment.submissions?.find(sub => sub.studentRollNo === student?.rollNo);
          if (submittedAssignment) {
            setSubmitted(true);
            setSubmissionTime(submittedAssignment.submittedAt);
            setSubmissionText(submittedAssignment.content);
          }
          
          // Set assignment state last
          setAssignment(data.assignment);
        } else {
          console.error("Failed to fetch assignment:", data.message || "Unknown error");
          alert("Assignment not found.");
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
        alert("Failed to load assignment.");
      }
    };

    if (courseId && assignmentId) {
      fetchAssignment();
    }
  }, [courseId, assignmentId, userId, student]); // Remove assignment from dependencies

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!submissionText && !file) {
      alert("Please provide a submission (text or file).");
      return;
    }

    const submissionData = {
      studentRollNo: student.rollNo,
      studentName: user.name,
      content: submissionText,
    };
    console.log(submissionData);

    try {
      const response = await fetch(`https://ias-server-cpoh.onrender.com/api/assignment/${courseId}/${assignmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setSubmitted(true);
        setSubmissionTime(new Date().toLocaleString());
        alert("Assignment submitted successfully!");
      } else {
        alert("Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Error submitting assignment.");
    }
  };

  const handleUndo = async () => {
    try {
      const response = await fetch(`https://ias-server-cpoh.onrender.com/api/assignment/${courseId}/${assignmentId}/undo/${student.rollNo}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSubmitted(false);
        setSubmissionText('');
        setSubmissionTime(null);
        alert("Submission undone.");
      } else {
        alert("Failed to undo submission.");
      }
    } catch (error) {
      console.error("Error undoing submission:", error);
      alert("Error undoing submission.");
    }
  };

  if (!assignment) return <p>Loading...</p>;



  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md border border-gray-300">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h2>
      <p className="text-gray-600 text-sm mb-4">
        <strong>Course:</strong> {assignment.courseCode}
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">{assignment.description}</p>
      <p className="text-gray-600 text-sm mb-6">
        <strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })} (End of Day)
      </p>

      {submitted && (
        <div className="p-4 mb-4 bg-green-100 border border-green-300 rounded-md">
          <p className="text-green-700 font-semibold">✅ Assignment Submitted Successfully!</p>
          <p className="text-gray-600 text-sm">📌 Submitted on: {submissionTime}</p>
          <p className="text-gray-600 text-sm">Content: {submissionText}</p>
        </div>
      )}

      {isBeforeDeadline ? (
        <div className="space-y-4">
          <label className="block text-gray-700 font-medium">
            <FaFileUpload className="inline-block mr-2" />
            Submission Text:
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              className="block w-full mt-2 border border-gray-300 rounded-md p-2"
              disabled={submitted}
            />
          </label>

          <div className="flex gap-4">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
              >
                <FaCheckCircle className="mr-2" /> Submit Assignment
              </button>
            ) : (
              <button
                onClick={handleUndo}
                className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
              >
                <FaUndo className="mr-2" /> Undo Submission
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-red-500 font-medium">⏳ Submission deadline has passed.</p>
      )}
    </div>
  );
}
