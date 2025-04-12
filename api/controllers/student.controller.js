import { Student } from '../models/student.model.js';
export const getStudent = async (req, res) => {
    const studentId = req.params.id;
    console.log(studentId)
    const user = await Student.findOne({ userId: studentId })
        .populate('userId') // populate the userId field and get the name field
    if (!user) {
        return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(200).json(user);
    console.log("Student details fetched successfully", user);
};