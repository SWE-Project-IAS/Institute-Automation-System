import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";

export default function FacultyAssignmentSubmissions() {
  const navigate = useNavigate();
  const { courseId, assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [grades, setGrades] = useState({});
  const [submitting, setSubmitting] = useState({});

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/assignment/${courseId}/${assignmentId}`
        );

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const rawText = await response.text();
          console.error("Raw response text:", rawText);
          throw new Error("Invalid JSON response");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch assignment");
        }

        setAssignment(data.assignment);
      } catch (err) {
        console.error("Error fetching assignment:", err);
        setError("Could not load assignment.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [courseId, assignmentId]);

  const handleGradeChange = (submissionId, value) => {
    // console.log("Grade changed:", submissionId, value,courseId);
    setGrades((prev) => ({ ...prev, [submissionId]: value }));
  };

  const submitGrade = async (submissionId) => {
    console.log(submissionId);
    const marks = grades[submissionId];
    if (marks === undefined || marks === "" || isNaN(marks)) {
      alert("Please enter valid marks before submitting.");
      return;
    }

    setSubmitting((prev) => ({ ...prev, [submissionId]: true }));
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/assignment/${courseId}/${assignmentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          assignmentId,
          submissionId,
          marks: Number(marks),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit marks");
      }

      alert("Marks submitted successfully!");
      window.location.href=`/course/${courseId}/assignment/${assignmentId}/submissions`;
    } catch (error) {
      console.error("Error submitting marks:", error);
      alert("Failed to submit marks.");
    } finally {
      setSubmitting((prev) => ({ ...prev, [submissionId]: false }));
    }
  };
  const downloadFile = async (url, rollNo, originalFileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
  
      let extension = "";
      if (originalFileName) {
        const dotIndex = originalFileName.lastIndexOf(".");
        if (dotIndex !== -1) {
          extension = originalFileName.substring(dotIndex); // e.g., .zip
        }
      }
  
      const finalFileName = `${rollNo}${extension || ''}`;
  
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = finalFileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download file", err);
      alert("Could not download file.");
    }
  };
  
  
  
  if (loading) return <p className="text-center py-6">Loading assignment...</p>;
  if (error) return <p className="text-red-500 text-center py-6">❌ {error}</p>;
  if (!assignment) return <p className="text-red-500 text-center py-6">❌ Assignment not found.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
          Submissions for: {assignment.title}
        </h2>
        <p className="text-gray-600 text-sm mb-2">
          <strong>📅 Due Date:</strong>{" "}
          {new Date(assignment.dueDate).toLocaleDateString()}
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded p-4 text-gray-800 whitespace-pre-line text-sm leading-relaxed">
          {assignment.description}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">📥 Student Submissions</h3>
        {assignment.submissions.length === 0 ? (
          <p className="text-gray-500">No submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-md">
              <thead>
                <tr className="bg-gray-100 text-sm text-gray-700">
                  <th className="p-3 border border-gray-300 text-left">Student Name</th>
                  <th className="p-3 border border-gray-300 text-left">Roll No</th>
                  <th className="p-3 border border-gray-300 text-left">Submitted At</th>
                  <th className="p-3 border border-gray-300 text-left">Answer</th>
                  <th className="p-3 border border-gray-300 text-left">Marks (out of 100)</th>
                  <th className="p-3 border border-gray-300 text-left">Action</th>
                  <th className="p-3 border border-gray-300 text-left">File</th>
                </tr>
              </thead>
              <tbody>
                {assignment.submissions.map((submission, idx) => {
                  const fileUrl = submission.fileUrl;
                  const fileName = fileUrl ? fileUrl.split("/").pop() : null;

                  return (
                    <tr key={idx} className="hover:bg-gray-50 text-sm">
                      <td className="p-3 border border-gray-300">{submission.studentName}</td>
                      <td className="p-3 border border-gray-300">{submission.studentRollNo}</td>
                      <td className="p-3 border border-gray-300">
                        {submission.submittedAt
                          ? new Date(submission.submittedAt).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "N/A"}
                      </td>
                      <td className="p-3 border border-gray-300 whitespace-pre-line text-gray-700 space-y-1">
                        {submission.content && (
                          <div className="mb-1">{submission.content}</div>
                        )}
                        {!submission.content && !fileUrl && (
                          <span className="text-gray-400 italic">No answer provided</span>
                        )}
                      </td>
                      <td className="p-3 border border-gray-300">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={grades[submission.studentRollNo] || ""}
                        onChange={(e) => handleGradeChange(submission.studentRollNo, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
                      />
                      {submission.marks !== undefined && submission.marks !== null && (
                      <p className="text-gray-600 text-xs">Given marks: {submission.marks}/100</p>
                      )}      
                    </td>
                    <td className="p-3 border border-gray-300">
                      <button
                        onClick={() => submitGrade(submission.studentRollNo)}
                        disabled={submitting[submission.studentRollNo]}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                      >
                        {submitting[submission.studentRollNo] ? "Submitting..." : "Submit Marks"}
                      </button>
                    </td>
                      <td className="p-3 border border-gray-300">
                        {fileUrl ? (
                          <a
                            href={fileUrl}
                            onClick={(e) => {
                              e.preventDefault();
                              downloadFile(fileUrl, submission.studentRollNo, submission.fileName);
                            }}
                            className="text-blue-600 underline"
                          >
                            📎 submission_file
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">No file</span>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
