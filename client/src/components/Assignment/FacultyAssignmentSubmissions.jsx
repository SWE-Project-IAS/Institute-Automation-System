import { useParams } from "react-router-dom";
import { assignments } from "./data";

export default function FacultyAssignmentSubmissions() {
  const { assignmentId } = useParams();

  // Find assignment
  const assignment = assignments.find((a) => a.id === assignmentId);

  if (!assignment) {
    return <p className="text-red-500 text-center p-6">Assignment not found.</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Submissions for {assignment.title}
      </h2>

      <p className="text-gray-600 text-sm mb-2">
        <strong>Due Date:</strong> {assignment.due_date}
      </p>

      <p className="text-gray-800 text-base mb-6 whitespace-pre-line">
        {assignment.description}
      </p>

      {assignment.submissions.length === 0 ? (
        <p className="text-gray-500 text-center">No submissions yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Student Name</th>
              <th className="border border-gray-300 p-2">Submitted At</th>
              <th className="border border-gray-300 p-2">Download</th>
            </tr>
          </thead>
          <tbody>
            {assignment.submissions.map((submission) => (
              <tr key={submission.student_id} className="text-center">
                <td className="border border-gray-300 p-2">{submission.student_name}</td>
                <td className="border border-gray-300 p-2">{submission.submitted_at}</td>
                <td className="border border-gray-300 p-2">
                  <a href={`/${submission.file_name}`} download className="text-blue-500 underline">
                    {submission.file_name}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
