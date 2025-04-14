import { Student } from '../models/student.model.js';
import { Course, StudentCourse, FacultyCourse } from '../models/course.model.js';
import { ApplicationDocument, Bonafide, Passport } from '../models/documents.models.js';


// Get basic student info
export const getStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        console.log(studentId);

        const user = await Student.findOne({ userId: studentId })
            .populate('userId');

        if (!user) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(user);
        console.log("Student details fetched successfully", user);
    } catch (error) {
        console.error("Error in getStudent:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add this new function for student courses
export const getStudentCourses = async (req, res) => {
    try {
        const studentId = req.params.id;
        console.log("Fetching courses for student ID:", studentId);
        
        // First get the student record to get the roll number
        const student = await Student.findOne({ userId: studentId });

        if (!student) {
            console.log("Student not found for ID:", studentId);
            return res.status(404).json({ message: "Student not found" });
        }
        
        console.log("Found student with roll number:", student.rollNo);

        // Get current academic session
        const now = new Date();
        const year = now.getFullYear();
        let session;
        
        if (now.getMonth() >= 0 && now.getMonth() <= 4) {
            session = 'Spring Semester';
        } else if (now.getMonth() >= 5 && now.getMonth() <= 7) {
            session = 'Summer Course';
        } else {
            session = 'Winter Semester';
        }
        
        const semester = `${session} ${year}`;
        console.log("Current academic session:", semester);
        console.log(student.rollNo);
        
        // Find approved courses for this student
        const studentCourses = await Course.find({});
        
        console.log(`Found ${studentCourses.length} enrolled courses for student`);
        
        if (!studentCourses || studentCourses.length === 0) {
            return res.status(200).json({ 
                courses: [],
                feedbackOpen: false
            });
        }
        
        // Get course details and faculty information
        const courses = await Promise.all(
            studentCourses.map(async (sc) => {
                const course = await Course.findOne({ courseCode: sc.courseId });
                
                if (!course) {
                    console.log(`Course not found for ID: ${sc.courseId}`);
                    return null;
                }
                
                const facultyCourse = await FacultyCourse.findOne({
                    courseCode: sc.courseId
                }).populate('facultyId', 'name');
                
                // Use placeholder values for some fields
                return {
                    id: course.courseCode,
                    name: course.courseName,
                    instructor: facultyCourse?.facultyId?.name || 'TBA',
                    credits: course.credits,
                    assignments: 8, // Placeholder
                    announcements: 3, // Placeholder
                    attendance: 85 // Placeholder
                };
            })
        );
        
        // Filter out null values (courses that weren't found)
        const validCourses = courses.filter(course => course !== null);
        console.log(`Returning ${validCourses.length} valid courses`);
        
        // Determine if feedback is available (implement your logic)
        const isFeedbackAvailable = false; // Placeholder
        
        res.status(200).json({
            courses: validCourses,
            feedbackOpen: isFeedbackAvailable
        });
        
    } catch (error) {
        console.error("Error fetching student courses:", error);
        res.status(500).json({ message: "Failed to fetch courses" });
    }
};

// Drop a course for a student
export const dropCourse = async (req, res, next) => {
    try {
      const { studentId, courseId } = req.params;
      
      // Find the student
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      // Check if the student is enrolled in the course
      const courseIndex = student.courses.findIndex(course => course.toString() === courseId);
      if (courseIndex === -1) {
        return res.status(404).json({ message: "Course not found in student's enrolled courses" });
      }
      
      // Remove the course from the student's courses array
      student.courses.splice(courseIndex, 1);
      await student.save();
      
      // Find the course and update its enrolled students
      const course = await Course.findById(courseId);
      if (course) {
        const studentIndex = course.enrolledStudents.findIndex(id => id.toString() === studentId);
        if (studentIndex !== -1) {
          course.enrolledStudents.splice(studentIndex, 1);
          await course.save();
        }
      }
      
      res.status(200).json({ message: "Course dropped successfully" });
    } catch (error) {
      next(error);
    }
  };

// Get student details for bonafide
export const getStudentBonafideDetails = async (req, res) => {
    try {
        const studentId = req.params.id;

        const student = await Student.findOne({ userId: studentId })
            .populate('userId', 'name dateOfBirth');

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const studentDetails = {
            name: student.userId.name,
            rollNo: student.rollNo,
            fatherName: student.fatherName,
            dateOfBirth: student.userId.dateOfBirth,
            program: student.program,
            department: student.department,
            hostel: student.hostel,
            roomNo: student.roomNo,
            semester: student.semester,
            batch: student.batch,
            enrolledYear: student.batch
        };

        res.status(200).json(studentDetails);
    } catch (error) {
        console.error('Error fetching student bonafide details:', error);
        res.status(500).json({ message: 'Error fetching student details' });
    }
};

// Create new bonafide application
export const createBonafideApplication = async (req, res) => {
    try {
        const studentId = req.params.id;
        const { currentSemester, certificateFor, otherReason } = req.body;

        // Find student
        const student = await Student.findOne({ userId: studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Create application document
        const applicationDoc = new ApplicationDocument({
            studentId: student._id,
            documentType: 'Bonafide',
            status: 'Pending' // This matches the enum in ApplicationDocument model
        });
        await applicationDoc.save();

        console.log('created application request', applicationDoc)

        // Create bonafide document
        const bonafide = new Bonafide({
            applicationId: applicationDoc._id,
            currentSemester,
            purpose: certificateFor,
            otherReason: certificateFor === 'Other' ? otherReason : undefined
        });
        await bonafide.save();
        console.log('created bonafide doc', bonafide)

        res.status(201).json({
            message: 'Bonafide application submitted successfully',
            applicationId: applicationDoc._id
        });
    } catch (error) {
        console.error('Error creating bonafide application:', error);
        res.status(500).json({ message: error.message || 'Error submitting bonafide application' });
    }
};

// Get student's bonafide applications
export const getBonafideApplications = async (req, res) => {
    try {
        const studentId = req.params.id;
        // Find student
        const student = await Student.findOne({ userId: studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

 
        const applications = await ApplicationDocument.find({ 
            studentId: student._id,
            documentType: 'Bonafide'
        }).sort({ createdAt: -1 });

        const applicationDetails = await Promise.all(applications.map(async (app) => {
            const bonafide = await Bonafide.findOne({ applicationId: app._id });
            if (!bonafide) return null;

            return {
                applicationDate: app.createdAt,
                certificateFor: bonafide.purpose === 'Other' ? bonafide.otherReason : bonafide.purpose,
                currentSemester: bonafide.currentSemester,
                remarks: app.approvalDetails?.remarks || '',
                documentStatus: app.status === 'Pending' ? 'Documents Under Review' : 'Documents Verified',
                currentStatus: app.status // Status is already in proper case from model
            };
        }));

        // Filter out any null values from failed lookups
        console.log('here are all apllications', applicationDetails)

        const validApplications = applicationDetails.filter(app => app !== null);
        res.status(200).json(validApplications);
    } catch (error) {
        console.error('Error fetching bonafide applications:', error);
        res.status(500).json({ message: 'Error fetching applications' });
    }
};


// Get student details for passport
export const getStudentPassportDetails = async (req, res) => {
    try {
        const studentId = req.params.id;
        
        const student = await Student.findOne({ userId: studentId })
            .populate('userId', 'name dateOfBirth email'); 
            
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const studentDetails = {
            name: student.userId.name,
            rollNo: student.rollNo,
            department: student.department,
            programme: student.program,
            dateOfBirth: student.userId.dateOfBirth,
            email: student.userId.email,
            contactNumber: student.userId.contactNo || '',
            hostelName: student.hostel,
            roomNo: student.roomNo,
            fathersName: student.fatherName,
            mothersName: student.motherName
        };
        console.log('fetched student info for passport',studentDetails)
        res.status(200).json(studentDetails);
    } catch (error) {
        console.error('Error fetching student passport details:', error);
        res.status(500).json({ message: error.message });
    }
};

// Submit passport application
export const submitPassportApplication = async (req, res) => {
    try {
        const studentId = req.params.id;
        const { 
            applicationType, 
            placeOfBirth, 
            semester, 
            mode, 
            tatkalReason, 
            travelPlans,
            travelDetails,
            fromDate,
            toDate
        } = req.body;

        const student = await Student.findOne({ userId: studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Create application document with proper status case
        const applicationDoc = new ApplicationDocument({
            studentId: student._id,
            documentType: 'Passport',
            status: 'Pending' // This matches the enum in ApplicationDocument model
        });
        await applicationDoc.save();

        // Create passport document
        const passport = new Passport({
            applicationId: applicationDoc._id,
            applicationType,
            placeOfBirth,
            semester,
            mode,
            tatkalReason,
            travelPlans,
            travelDetails,
            fromDate: travelPlans === 'yes' ? fromDate : undefined,
            toDate: travelPlans === 'yes' ? toDate : undefined
        });
        await passport.save();

        res.status(201).json({ 
            message: 'Passport application submitted successfully',
            applicationId: applicationDoc._id 
        });
    } catch (error) {
        console.error('Error creating passport application:', error);
        res.status(500).json({ message: error.message || 'Error submitting passport application' });
    }
};

// Get passport applications history
export const getPassportApplications = async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await Student.findOne({ userId: studentId });
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const applications = await ApplicationDocument.find({
            studentId: student._id,
            documentType: 'Passport'
        })
        .sort({ createdAt: -1 })
        .lean();

        const passportApplications = await Promise.all(
            applications.map(async (app) => {
                const passportDoc = await Passport.findOne({ applicationId: app._id });
                return {
                    applicationDate: new Date(app.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    applicationType: passportDoc.applicationType,
                    mode: passportDoc.mode,
                    remarks: app.approvalDetails?.remarks || '',
                    otherDetails: passportDoc.mode === 'tatkal' ? `Tatkal Application - ${passportDoc.tatkalReason}` : 'Regular Application',
                    documentStatus: app.status === 'Pending' ? 'Documents Under Review' : 'Documents Verified',
                    currentStatus: app.status // Status is already in proper case from model
                };
            })
        );

        const validApplications = passportApplications.filter(app => app !== null);
        res.status(200).json(validApplications);
    } catch (error) {
        console.error('Error fetching passport applications:', error);
        res.status(500).json({ message: error.message });
    }
};
