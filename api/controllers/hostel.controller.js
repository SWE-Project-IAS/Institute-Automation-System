export const studentLeave = async (req, res) => {
  try {
    const { studentId, leaveStartDate, leaveEndDate } = req.body;

    // Validate input
    if (!studentId || !leaveStartDate || !leaveEndDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    const startDate = new Date(leaveStartDate);
    const endDate = new Date(leaveEndDate);

    // Validate dates
    if (startDate >= endDate) {
        return res.status(400).json({ message: "End date must be after start date" });
    }

    if (startDate < new Date()) {
        return res.status(400).json({ message: "Start date cannot be in the past" });
    }

    // Create leave request object
    const leaveRequest = {
        studentId,
        leaveStartDate: startDate,
        leaveEndDate: endDate,
        status: 'pending',
        createdAt: new Date()
    };

    // Save to database (assuming you have a LeaveRequest model)
    await LeaveRequest.create(leaveRequest);
    // For example, save the leave request to the database

    res.status(200).json({ message: "Leave request submitted successfully" });
  } catch (error) {
    console.error("Error in studentLeave:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}