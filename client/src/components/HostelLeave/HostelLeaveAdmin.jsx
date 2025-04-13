import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import newRequest from "../../utils/newRequest";

const HostelLeaveAdmin = () => {
const [requests, setRequests] = useState([]);

const { isLoading, error, data } = useQuery({
    queryKey: ["leaves"],
    queryFn: () =>
        newRequest.get(`/hostel/leaves`).then((res) => {
            return res.data;
        }),
});

useEffect(() => {
    if (!isLoading && !error && data) {
        setRequests(data.map(item => ({
            id: item._id,
            // name: item.name,
            studentId: item.rollNo,
            startDate: item.startDate,
            endDate: item.endDate,
            reason: item.reason,
            status: item.status
        })));
    }
}, [data, isLoading, error]);

  const handleAction = (id, newStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
    newRequest.put(`/hostel/leaves/${id}`, { status: newStatus })
        .then(response => {
            console.log('Status updated successfully');
        })
        .catch(error => {
            console.error('Error updating status:', error);
            // Revert the local state change if the API call fails
            setRequests(requests.map(req => req.id === id ? { ...req, status: req.status } : req));
        });
  };

const [selectedReason, setSelectedReason] = useState(null);

return (
    <div className="p-6 bg-gray-100 min-h-screen m-2">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hostel Leave Requests</h2>
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
            <table className="min-w-full border border-gray-200">
                <thead>
                    <tr className="bg-gray-200">
                        {/* <th className="py-2 px-4 border">Student Name</th> */}
                        <th className="py-2 px-4 border">Student ID</th>
                        <th className="py-2 px-4 border">Start Date</th>
                        <th className="py-2 px-4 border">End Date</th>
                        <th className="py-2 px-4 border">Reason</th>
                        <th className="py-2 px-4 border">Status</th>
                        <th className="py-2 px-4 border">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request.id} className="text-center border-b">
                            {/* <td className="py-2 px-4 border">{request.name}</td> */}
                            <td className="py-2 px-4 border">{request.studentId}</td>
                            <td className="py-2 px-4 border">{request.startDate}</td>
                            <td className="py-2 px-4 border">{request.endDate}</td>
                            <td 
                                className="py-2 px-4 border cursor-pointer hover:bg-gray-100"
                                onClick={() => setSelectedReason(request.reason)}
                            >
                                {request.reason.split(' ').slice(0, 2).join(' ')}...
                            </td>
                            <td className={`py-2 px-4 border font-semibold ${request.status === 'Approved' ? 'text-green-600' : request.status === 'Rejected' ? 'text-red-600' : 'text-gray-600'}`}>{request.status}</td>
                            <td className="py-2 px-4 border">
                                {request.status === "Pending" && (
                                    <div className="flex gap-2 justify-center">
                                        <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" onClick={() => handleAction(request.id, "Approved")}>
                                            Approve
                                        </button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleAction(request.id, "Rejected")}>
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {selectedReason && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
                    <h3 className="text-lg font-semibold mb-2">Reason</h3>
                    <p className="mb-4">{selectedReason}</p>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => setSelectedReason(null)}
                    >
                        Close
                    </button>
                </div>
            </div>
        )}
    </div>
);
};

export default HostelLeaveAdmin;