import { Feedback , GlobalFeedbackConfig } from '../models/feedback.model.js';
import { Course, FacultyCourse } from '../models/course.model.js';
import { Faculty } from '../models/faculty.model.js';
import { Student } from '../models/student.model.js';
import { User } from '../models/user.model.js';
import { AcadAdminAnnouncement } from '../models/acadAdminAnnouncements.model.js';

// Feedback section structure (corrected typo)
const feedback_section = [
    {
        id: 'course_content_section',
        questions: ['course_content', 'course_materials', 'course_organization']
    },
    {
        id: 'faculty_evaluation_section',
        questions: ['teaching_quality', 'faculty_knowledge', 'faculty_availability']
    },
    {
        id: 'assessment_section',
        questions: ['assessment_fairness', 'feedback_quality']
    }
];

const initializeStatistics = () => ({
    totalFeedbacks: 0,
    sections: feedback_section.map(section => ({
        id: section.id,
        questions: section.questions.reduce((acc, questionId) => ({
            ...acc,
            [questionId]: {
                average: 0,
                distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                totalResponses: 0
            }
        }), {})
    }))
});

export const getFeedback = async (req, res) => {
    try {
        const { facultyId,courseCode } = req.params;
        console.log("facultyId", facultyId);
        console.log("courseCode", courseCode);
        // Validate course using correct field name
        const course = await Course.findOne({ courseCode });
        if (!course) return res.status(404).json({ error: 'Course not found' });

        // Validate faculty using user reference
        const faculty = await Faculty.findOne({ userId: facultyId });
        if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
        
        console.log("faculty", faculty);
        console.log("course", course);
        // Fetch feedback with proper population
        const feedbacks = await Feedback.find({
            faculty: faculty,
            course: course,
            isActive: true
        });
        console.log("feedbacks", feedbacks);
        // Calculate statistics
        const statistics = initializeStatistics();
        statistics.totalFeedbacks = feedbacks.length;

        feedbacks.forEach(feedback => {
            feedback.ratings.forEach(({ questionId, rating }) => {
                feedback_section.forEach(section => {
                    if (section.questions.includes(questionId)) {
                        const sectionStats = statistics.sections.find(s => s.id === section.id);
                        const questionStats = sectionStats.questions[questionId];
                        
                        questionStats.average += rating;
                        questionStats.distribution[rating]++;
                        questionStats.totalResponses++;
                    }
                });
            });
        });

        // Finalize averages
        statistics.sections.forEach(section => {
            Object.values(section.questions).forEach(question => {
                if (question.totalResponses > 0) {
                    question.average = parseFloat((question.average / question.totalResponses).toFixed(2));
                }
            });
        });

        // Format response
        const response = {
            feedback: feedbacks.map(f => ({
                student: f.student?.rollNo || 'Anonymous',
                ratings: f.ratings,
                comments: f.comments,
                createdAt: f.createdAt
            })),
            statistics: {
                ...statistics,
                course: course.courseName,
                faculty: faculty.facultyId,
                courseCode: course.courseCode,
                department: course.department
            }
        };

        res.json(response);

    } catch (err) {
        res.status(500).json({ 
            error: 'Failed to fetch feedback data',
            details: err.message 
        });
    }
};

export const checkFeedbackStatus = async (req, res) => {
    try {
        const { userId, courseCode, facultyId } = req.params;

        const course = await Course.findOne({ courseCode });
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const faculty = await Faculty.findOne({ userId: facultyId });
        if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

        const existingFeedback = await Feedback.findOne({
            student: userId,
            course: course.id,
            faculty: faculty.id
        });

        res.json({ 
            feedbackSubmitted: !!existingFeedback,
            lastSubmitted: existingFeedback?.updatedAt 
        });

    } catch (err) {
        res.status(500).json({ 
            error: 'Failed to check feedback status',
            details: err.message 
        });
    }
};

// export const submitFeedback = async (req, res) => {
//     console.log("submitFeedback", req.body);
//     try {
//         const { student, faculty, course, ratings, comments } = req.body;
//         console.log(req.body);
//         // Validate course
//         const courseDoc = await Course.findOne({ courseCode: course });
//         // if (!courseDoc) return res.status(400).json({ error: 'Invalid course code' });

//         console.log("courseDoc", courseDoc);
//         // Validate faculty
//         const facultyDoc = await Faculty.findOne({ userId: faculty });
//         // if (!facultyDoc) return res.status(400).json({ error: 'Invalid faculty' });
//         // console.log("facultyDoc", facultyDoc);
//         console.log("facultyDoc", facultyDoc);
//         // Validate student
//         const studentDoc = await Student.findOne({ userId: student });
//         // if (!studentDoc) return res.status(400).json({ error: 'Invalid student' });

//         console.log("studentDoc", studentDoc);
//         // Create/update feedback
//         // const feedback = await Feedback.create(
//         //     { 
//         //         student: studentDoc._id,
//         //         faculty: facultyDoc._id,  
//         //         course: courseDoc._id 
//         //     },
//         //     {
//         //         ratings: ratings.map(r => ({
//         //             questionId: r.questionId,
//         //             rating: Math.min(Math.max(Number(r.rating), 1), 5)
//         //         })),
//         //         comments: comments?.trim(),
//         //         isActive: true,
//         //         updatedAt: new Date()
//         //     },
//         //     { 
//         //         upsert: true,
//         //         new: true,
//         //         runValidators: true 
//         //     }
//         // );

//         // console.log("feedback", feedback);

//         // Insert into the feedback table
//         const feedbackEntry = new Feedback({
//             student: studentDoc._id,
//             faculty: facultyDoc._id,
//             course: courseDoc._id,
//             ratings: ratings.map(r => ({
//                 questionId: r.questionId,
//                 rating: Math.min(Math.max(Number(r.rating), 1), 5)
//             })),
//             comments: comments?.trim(),
//             isActive: true
//         });
//         console.log("feedbackEntry", feedbackEntry);
//         await feedbackEntry.save();
//         res.status(201).json({
//             message: 'Feedback submitted successfully',
//             feedback: {
//                 id: feedbackEntry._id,
//                 updatedAt: feedbackEntry.updatedAt
//             }
//         });

//     } catch (err) {
//         if (err.name === 'ValidationError') {
//             return res.status(400).json({
//                 error: 'Invalid feedback data',
//                 details: Object.values(err.errors).map(e => e.message)
//             });
//         }
//         if (err.code === 11000) {
//             return res.status(409).json({ 
//                 error: 'Feedback already exists for this course and faculty' 
//             });
//         }
//         res.status(500).json({ 
//             error: 'Failed to submit feedback',
//             details: err.message 
//         });
//     }
// };
export const submitFeedback = async (req, res) => {
    console.log("submitFeedback", req.body);
    try {
      // Add this temporary code to check all indexes
      const indexes = await Feedback.collection.indexes();
      console.log("All indexes:", indexes);
      const { student, faculty, course, ratings, comments } = req.body;
      
      // Validate course
      const courseDoc = await Course.findOne({ courseCode: course });
      if (!courseDoc) return res.status(400).json({ error: 'Invalid course code' });
      
      // Validate faculty
      const facultyDoc = await Faculty.findOne({ userId: faculty });
      if (!facultyDoc) return res.status(400).json({ error: 'Invalid faculty' });
      
      // Validate student
      const studentDoc = await Student.findOne({ userId: student });
      if (!studentDoc) return res.status(400).json({ error: 'Invalid student' });
      
      // Validate ratings
      if (!Array.isArray(ratings) || ratings.length === 0) {
        return res.status(400).json({ error: 'Ratings are required' });
      }
      
      // console.log("studentDoc._id:", studentDoc._id);
      // console.log("facultyDoc._id:", facultyDoc._id);
      // console.log("courseDoc._id:", courseDoc._id);
      
      // Then check if there's existing data
      const exists = await Feedback.exists({
        student: studentDoc._id.toString(),
        faculty: facultyDoc._id.toString(),
        course: courseDoc._id.toString()
      });
      
      if(exists) {
        return res.status(409).json({ error: 'Feedback already exists for this course and faculty' });
      }
      // Insert into the feedback table
      // const feedbackEntry = new Feedback({
      //   student: studentDoc._id.toString(),
      //   faculty: facultyDoc._id.toString(),
      //   course: courseDoc._id.toString(),
      //   ratings: ratings.map(r => ({
      //     questionId: r.questionId,
      //     rating: Math.min(Math.max(Number(r.rating), 1), 5)
      //   })),
      //   comments: comments ? comments.trim() : '',
      //   isActive: true
      // });
      const result = await Feedback.updateOne(
        {
          student: studentDoc._id,
          faculty: facultyDoc._id,
          course: courseDoc._id
        },
        {
          $set: {
            ratings: ratings.map(r => ({
              questionId: r.questionId,
              rating: Math.min(Math.max(Number(r.rating), 1), 5)
            })),
            comments: comments ? comments.trim() : '',
            isActive: true,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );

      console.log("feedbackEntry", result);
      // await result.save();
      
      res.status(201).json({
        message: 'Feedback submitted successfully',
        feedback: {
          id: result._id,
          updatedAt: result.updatedAt
        }
      });
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          error: 'Invalid feedback data',
          details: Object.values(err.errors).map(e => e.message)
        });
      }
      if (err.code === 11000) {
        console.log('Duplicate feedback error:', err);
        return res.status(409).json({
          error: 'Feedback already exists for this course and faculty'
        });
      }
      console.error('Feedback submission error:', err);
      res.status(500).json({
        error: 'Failed to submit feedback',
        details: err.message
      });
    }
  };
export const getCourseFacultyDetails = async (req, res) => {
    try {
        const { courseCode } = req.params;

        const facultyCourse = await FacultyCourse.findOne({ courseCode })

        if (!facultyCourse) {
            return res.status(404).json({ error: 'No faculty assigned to this course' });
        }

        const course = await Course.findOne({ courseCode });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json({
            facultyId: facultyCourse.facultyId,
            session: facultyCourse.session,
            year: facultyCourse.year,
            department: course.department
        });

    } catch (err) {
        res.status(500).json({ 
            error: 'Failed to fetch faculty details',
            details: err.message 
        });
    }
};

export const getCourseDetails = async (req, res) => {
    try {
        const { courseCode } = req.params;
        
        const course = await Course.findOne({ courseCode });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        const facultyCourse = await FacultyCourse.findOne({courseCode: courseCode});
        if(!facultyCourse) {
            return res.status(404).json({ error: 'Faculty not found' });
        }
        const faculty = await Faculty.findOne({ userId: facultyCourse.facultyId });
        const user = await User.findOne({ _id: faculty.userId });

        // console.log("user", user);
        // console.log("course", course);
        // console.log("faculty", faculty);
        // console.log("facultyCourse", facultyCourse);

        res.json({
            courseCode: course.courseCode,
            courseName: course.courseName,
            department: course.department,
            credits: course.credits,
            facultyName: user.name,
            session: facultyCourse.session,
            year: facultyCourse.year,  
            facultyId: facultyCourse.facultyId, 
        });

    } catch (err) {
        res.status(500).json({ 
            error: 'Failed to fetch course details',
            details: err.message 
        });
    }
};


// export const getGlobalstatus = async (req, res) => {
//     // console.log("qwertyu");
//     try {
//       // console.log("yaha ");  
//       const config = await GlobalFeedbackConfig.getConfig();
//       res.status(200).json({ isActive: config.isActive });
//     } catch (error) {
//       res.status(500).json({ 
//         message: 'Failed to fetch feedback status',
//         error: error.message 
//       });
//     }
//   };
  
//   export const setGlobalstatus = async (req, res) => {
//     try {
//       const { active } = req.body;
//       const config = await GlobalFeedbackConfig.getConfig();
      
//       if (typeof active !== 'boolean') {
//         return res.status(400).json({ 
//           message: 'Invalid request: active must be a boolean' 
//         });
//       }

//       const currentDate = new Date();
//       const currentYear = currentDate.getFullYear();
//       const currentMonth = currentDate.getMonth();
    
//       // // Determine current session based on month
//       let currentSession;
//       if (currentMonth >= 0 && currentMonth <= 4) {
//           currentSession = 'Winter Semester';
//       } else if (currentMonth >= 5 && currentMonth <= 7) {
//           currentSession = 'Summer Course';
//       } else {
//           currentSession = 'Spring Semester';
//       }
//       const title = "Feedback "+ (active ? "Open" : "Closed") + " for all courses";
//       // const content = "Feedback is now " + (active ? "open" : "closed") + " for all courses.";
//       const content = "This is to inform you that the online course feedback module for your feedback of registered courses of " + currentSession + " is activated. It will be active only till " + endDate + " end. Please provide your feedback for the courses you have registered for. Your feedback is valuable to us and will help us improve the quality of education and services provided by the university. Thank you for your cooperation.";
//       const importance = "High";
//       const targetEmails = []; // Add logic to fetch emails if needed
//       const targetGroups = {
//         allUniversity: true,
//         students: true,
//         faculty: true,
//         departments: [],
//         programs: [],
//         semester: "",
//         specificEmails: ""
//       };
      
//       const newAnnouncement = new AcadAdminAnnouncement({
//         title,
//         content,
//         importance,
//         targetEmails,
//         date: new Date(),
//         postedBy: "Admin",
//         targetGroups,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       });

//       console.log("Announcement created:", newAnnouncement);
//       await newAnnouncement.save();
  
//       config.isActive = active;
//       await config.save();
      
//       res.status(200).json({ 
//         message: 'Feedback status updated',
//         isActive: config.isActive 
//       });
//     } catch (error) {
//       res.status(500).json({ 
//         message: 'Failed to update feedback status',
//         error: error.message 
//       });
//     }
//   };
  
export const setGlobalstatus = async (req, res) => {
  try {
    const { active, endDate } = req.body;
    const config = await GlobalFeedbackConfig.getConfig();
    
    if (typeof active !== 'boolean') {
      return res.status(400).json({ 
        message: 'Invalid request: active must be a boolean' 
      });
    }

    // Validate end date when activating feedback
    if (active) {
      if (!endDate) {
        return res.status(400).json({ 
          message: 'End date is required to activate feedback' 
        });
      }

      const selectedEndDate = new Date(endDate);
      const currentDate = new Date();
      
      if (isNaN(selectedEndDate.getTime())) {
        return res.status(400).json({ 
          message: 'Invalid end date format' 
        });
      }

      if (selectedEndDate <= currentDate) {
        return res.status(400).json({ 
          message: 'End date must be in the future' 
        });
      }

      config.endDate = selectedEndDate;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
  
    // Determine current session based on month
    let currentSession;
    if (currentMonth >= 0 && currentMonth <= 4) {
      currentSession = 'Winter Semester';
    } else if (currentMonth >= 5 && currentMonth <= 7) {
      currentSession = 'Summer Course';
    } else {
      currentSession = 'Spring Semester';
    }

    const title = "Feedback " + (active ? "Open" : "Closed") + " for all courses";
    
    // Format the end date for the announcement
    const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const content = active 
      ? `This is to inform you that the online course feedback module for your feedback of registered courses of ${currentSession} is activated. It will be active only till ${formattedEndDate}. Please provide your feedback for the courses you have registered for. Your feedback is valuable to us and will help us improve the quality of education and services provided by the university. Thank you for your cooperation.`
      : "Feedback collection is now closed for all courses. Thank you for your participation.";
    
    const importance = "High";
    const targetEmails = []; // Add logic to fetch emails if needed
    const targetGroups = {
      allUniversity: true,
      students: true,
      faculty: true,
      departments: [],
      programs: [],
      semester: "",
      specificEmails: ""
    };
    
    const newAnnouncement = new AcadAdminAnnouncement({
      title,
      content,
      importance,
      targetEmails,
      date: new Date(),
      postedBy: "Admin",
      targetGroups,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log("Announcement created:", newAnnouncement);
    await newAnnouncement.save();

    config.isActive = active;
    await config.save();
    
    res.status(200).json({ 
      message: 'Feedback status updated',
      isActive: config.isActive,
      endDate: config.endDate
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update feedback status',
      error: error.message 
    });
  }
};

// Also add the updated status endpoint to return the endDate

export const getGlobalstatus = async (req, res) => {
  try {
    const config = await GlobalFeedbackConfig.getConfig();
    
    res.status(200).json({ 
      isActive: config.isActive,
      endDate: config.endDate
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to get feedback status',
      error: error.message 
    });
  }
};