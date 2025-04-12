import { HostelLeave } from "../models/hostel.model.js";
import { Student } from '../models/student.model.js';

export const studentLeave = async (req, res) => {
  try {
    const { studentId, startDate, endDate, applicationId, email, reason } = req.body;
    console.log(req.body);
    // Validate input
    if (!studentId || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    // const startDate = new Date(leaveStartDate);
    // const endDate = new Date(leaveEndDate);

    // Validate dates
    if (startDate >= endDate) {
        return res.status(400).json({ message: "End date must be after start date" });
    }
    if (startDate < new Date()) {
        return res.status(400).json({ message: "Start date cannot be in the past" });
    }


    const student = await Student.findOne({ email });
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    if (student.rollNo !== studentId) {
        return res.status(400).json({ message: "Student ID does not match email" });
    }
    // Create leave request object
    const leaveRequest = {
        rollNo: student.rollNo,
        // applicationId,
        startDate,
        endDate,
        reason,
        status: 'Pending',
    };

    // Save to database (assuming you have a LeaveRequest model)
    await HostelLeave.create(leaveRequest);
    console.log(leaveRequest);
    // For example, save the leave request to the database

    res.status(200).json({ message: "Leave request submitted successfully" });
  } catch (error) {
    console.error("Error in studentLeave:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getStudentLeave = async (req, res) => {
    try {
      const student = await Student.findOne({userId: req.params.id});
  
      if (!student) {
        console.error("Student not found:", id);
        return res.status(404).json({ message: "Student not found" });
      }
  
      const leaves = await HostelLeave.find({ rollNo: student.rollNo });
  
      if (!leaves || leaves.length === 0) {
        return res.status(404).json({ message: "No leaves found for this student" });
      }
  
      res.status(200).json(leaves);
    } catch (error) {
      console.error("Error in getStudentLeave:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

export const getAllLeaves = async (req, res) => {
    try {
        const leaves = await HostelLeave.find({});

        if (!leaves || leaves.length === 0) {
            return res.status(404).json({ message: "No leaves found" });
        }
        res.status(200).json(leaves);
    } catch (error) {
        console.error("Error in getAllLeaves:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
  