import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function FacultyAssignmentSubmissions() {
  const { courseId, assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(
          `https://ias-server-cpoh.onrender.com/api/assignment/${courseId}/${assignmentId}`
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
                      <td className="p-3 border border-gray-300 whitespace-pre-line text-gray-700 space-y-1">
                        {fileUrl && (
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
                        )}
                        {!submission.content && !fileUrl && (
                          <span className="text-gray-400 italic">No answer provided</span>
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
