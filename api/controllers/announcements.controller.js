import { Course} from '../models/course.model.js';
import { Faculty } from '../models/faculty.model.js';
import { Student } from '../models/student.model.js';
import { StudentCourse } from '../models/course.model.js';
import { User } from '../models/user.model.js';
import {AcadAdminAnnouncement} from '../models/acadAdminAnnouncements.model.js';

export const getCourseAnnouncements = async (req, res) => {
    try {
        const { courseId } = req.params;
        console.log("Fetching announcements for course ID:", courseId);
      // Find course with announcements
      const course = await Course.findOne({ courseCode: courseId });
      
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      
      // If no announcements or empty array, return course with empty announcements
      if (!course.announcements || course.announcements.length === 0) {
        return res.status(200).json(course);
      }
      
      // Get all faculty IDs from announcements
      const facultyIds = [...new Set(course.announcements.map(announcement => announcement.postedBy))];
      console.log("Faculty IDs found:", facultyIds);
      // Find all faculty members who posted announcements
      const facultyMembers = await Faculty.find({ userId: { $in: facultyIds } });
      const facultyUsers = await User.find({
        _id: { $in: facultyMembers.map((faculty) => faculty.userId) },
      });
      // console.log("Faculty members found:", facultyMembers);
      // console.log("Faculty users found:", facultyUsers);
      // Create a lookup object for faculty
      const facultyLookup = {};
      facultyUsers.forEach((faculty) => {
        facultyLookup[faculty._id] = {
          name: faculty.name,
          email: faculty.email,
          // department: faculty.department,
          // designation: faculty.designation,
        };
      });
      // console.log("Faculty lookup object:", facultyLookup);
      // Add faculty details to each announcement
      const announcementsWithFaculty = course.announcements.map(announcement => {
        const faculty = facultyLookup[announcement.postedBy] || null;
        
        return {
          ...announcement.toObject(),
          faculty: faculty
        };
      });
      
      // Sort announcements by date (most recent first)
      announcementsWithFaculty.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Return course with enhanced announcements
      const result = {
        ...course.toObject(),
        announcements: announcementsWithFaculty
      };
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching course announcements:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch course announcements',
        error: error.message 
      });
    }
  };

  // Add a new announcement to a course (for faculty use)
  export const addCourseAnnouncement = async (req, res) => {
      try {
        const { courseId } = req.params;
        const { title, content, importance, postedBy } = req.body;
        console.log("Adding announcement to course ID:", postedBy);
        console.log("Adding announcement to course ID:", courseId);
        // Validate request
        if (!title || !content || !postedBy) {
          return res.status(400).json({ 
            success: false, 
            message: 'Title, content, and faculty ID are required' 
          });
        }
        
        // Find course
        const course = await Course.findOne({ courseCode: courseId });
        if (!course) {
          return res.status(404).json({ success: false, message: 'Course not found' });
        }
        
        const faculty = await Faculty.findOne({ userId: postedBy });
        console.log("Faculty:", faculty);
        if(!faculty) {
          return res.status(404).json({ success: false, message: 'Faculty not found' });
        } 
        const facultyUser = await User.findOne({ _id: postedBy });
        console.log("Faculty User ID:", postedBy);
        console.log("Faculty User:", facultyUser);
        if(!facultyUser) {
          return res.status(404).json({ success: false, message: 'Faculty user not found' });
        }

        console.log("Faculty User:", facultyUser);
        // Create new announcement
        const newAnnouncement = {
          title,
          content,
          importance: importance || 'Medium',
          date: new Date(),
          postedBy
        };
        console.log("New Announcement:", newAnnouncement);
        // Add announcement to course
        course.announcements.push(newAnnouncement);
        await course.save();
        
        return res.status(201).json({ 
          success: true, 
          message: 'Announcement added successfully',
          announcement: newAnnouncement 
        });
      } catch (error) {
        console.error('Error adding course announcement:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to add announcement',
          error: error.message 
        });
      }
  };
    
  // Update an existing course announcement (for faculty use)
  export const updateCourseAnnouncement = async (req, res) => {
    try {
      const { courseId, announcementId } = req.params;
      const { title, content, importance, attachments } = req.body;
      
      // Validate request
      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'Title and content are required'
        });
      }
      
      // Find course
      const course = await Course.findOne({ courseCode: courseId });
      
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      
      // Find announcement index
      const announcementIndex = course.announcements.findIndex(
        ann => ann.id.toString() === announcementId
      );
      
      if (announcementIndex === -1) {
        return res.status(404).json({ success: false, message: 'Announcement not found' });
      }
      
      // Update announcement
      course.announcements[announcementIndex].title = title;
      course.announcements[announcementIndex].content = content;
      course.announcements[announcementIndex].importance = importance || 'Medium';
      
      // Update attachments if provided
      if (attachments) {
        course.announcements[announcementIndex].attachments = attachments;
      }
      
      await course.save();
      
      return res.status(200).json({
        success: true,
        message: 'Announcement updated successfully',
        announcement: course.announcements[announcementIndex]
      });
    } catch (error) {
      console.error('Error updating course announcement:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update announcement',
        error: error.message
      });
    }
  };
  
  // Delete a course announcement (for faculty use)
  export const deleteCourseAnnouncement = async (req, res) => {
    try {
  
      const { courseId, announcementId } = req.params;
      console.log("Deleting announcement from course ID:", courseId);
      // Find course
      const course = await Course.findOne({ courseCode: courseId });
      
      
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
  
      // Find announcement index
      const announcementIndex = course.announcements.findIndex(
        ann => ann.id.toString() === announcementId
      );
  
      
      if (announcementIndex === -1) {
        return res.status(404).json({ success: false, message: 'Announcement not found' });
      }
      
      // Remove announcement
      course.announcements.splice(announcementIndex, 1);
      await course.save();
      
      return res.status(200).json({
        success: true,
        message: 'Announcement deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting course announcement:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete announcement',
        error: error.message
      });
    }
  };
  
export const getAllAnnouncements = async (req, res) => {
  try {
    console.log("Fetching all announcements for user ID:", req.params);
    const userId = req.params.id;
    // const userId = "67fb82e1fd693835a24dd230";
    console.log("Fetching all announcements for user ID:", userId);
    // Find student to get enrolled courses
    const student = await Student.findOne({ userId });
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student profile not found' 
      });
    }
    // console.log("Student:", student);
    // Get all enrolled course IDs
    // Find all enrolled courses with their announcements
    const studentCourses = await StudentCourse.find({ 
      rollNo: student.rollNo
    });
    // console.log("Courses:", studentCourses); 

    const courses = await Course.find({
      courseCode: { $in: studentCourses.map(course => course.courseId) }
    });
    // console.log("Courses:", courses);
    // .populate('announcements.postedBy', 'name email department designation');
    // Collect and process all course announcements
    let allAnnouncements = [];
    
    courses.forEach(course => {
      if (course.announcements && course.announcements.length > 0) {
        const courseAnnouncements = course.announcements.map(announcement => {
          return {
            ...announcement.toObject(),
            courseName: course.courseName,
            courseId: course.courseCode,
            type: 'course'
          };
        });
        allAnnouncements = [...allAnnouncements, ...courseAnnouncements];
      }
    });

    const facultyIds = [
      ...new Set(
        allAnnouncements.map((announcement) => announcement.postedBy)
      ),
    ];
    console.log("Faculty IDs found:", facultyIds);

    // Find all faculty members who posted announcements
    const facultyMembers = await Faculty.find({
      userId: { $in: facultyIds },
    });

    console.log("Faculty members found1:", facultyMembers);
    
    const facultyUsers = await User.find({
      _id: { $in: facultyMembers.map((faculty) => faculty.userId) },
    });

    allAnnouncements.forEach((announcement) => {
      const faculty = facultyUsers.find(
        (faculty) => faculty._id.toString() === announcement.postedBy.toString()
      );
      if (faculty) {
        announcement.postedBy = faculty.name;
      }
    }
  );
  
    console.log("All Course Announcements:", allAnnouncements);
    // console.log("All Announcements:", allAnnouncements);
    // Get academic admin announcements
    const acadAdminAnnouncements = await AcadAdminAnnouncement.find({
      // filter it by
      // either my email is in the targetEmails array or allUniversity of targetGroups is true
      $or: [
        {targetEmails: {$in: [student.email]}},
        {'targetGroups.allUniversity': true},
        {
          'targetGroups.students': true,
          $and: [
            {
              $or: [
                { 'targetGroups.departments': { $in: ['all'] } },
                { 'targetGroups.departments': { $in: [student.department] } }
              ]
            },
            {
              $or: [
                { 'targetGroups.programs': { $in: ['all'] } },
                { 'targetGroups.programs': { $in: [student.program] } }
              ]
            },
            {
              $or: [
                { 'targetGroups.semester': { $in: ['all'] } },
                { 'targetGroups.semester': { $in: [student.semester] } },
              ]
            }
          ]
        }
      ]
    });
    console.log("sdfs ", String(student.semester));
    console.log("Academic Admin Announcements:", acadAdminAnnouncements);
    const p = acadAdminAnnouncements.map(announcement => ({
        pp: announcement.targetGroups.semester })
    );
    console.log("Academic Admin Announcements:", p);
    // // Process academic admin announcements
    const processedAdminAnnouncements = acadAdminAnnouncements.map(announcement => ({
      ...announcement.toObject(),
      type: 'admin'
    }));
    
    // Combine all announcements
    const combinedAnnouncements = [
      ...allAnnouncements,
      ...processedAdminAnnouncements
    ];
    
    // Sort all announcements by date (most recent first)
    combinedAnnouncements.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return res.status(200).json({
      success: true,
      count: combinedAnnouncements.length,
      announcements: combinedAnnouncements
    });
    
  } catch (error) {
    console.error('Error fetching all announcements:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
      error: error.message
    });
  }
};

export const getAdminAnnouncements = async (req, res) => {
  try {
    console.log("Fetching admin announcements for user ID:", req.params);
    // const userId = req.user.userId;
    // console.log("Fetching admin announcements for user ID:", userId);
    // // Verify the user is an admin
    // const user = await User.findById(userId);
    // if (!user || user.role !== 'acadAdmin') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Access denied. Only academic administrators can access this resource'
    //   });
    // }
    console.log("ehheere");
    // Get all announcements sorted by date (most recent first)
    const announcements = await AcadAdminAnnouncement.find({})
      .sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      count: announcements.length,
      announcements
    });
    
  } catch (error) {
    console.error('Error fetching admin announcements:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
      error: error.message
    });
  }
};

// Add new announcement
export const addAnnouncement = async (req, res) => {
  try {
    console.log("Adding new announcement", req.body);
    const { title, content, importance, targetGroups,targetEmails } = req.body;
    console.log("Adding new announcement", title, content, importance, targetGroups, targetEmails);
    // const userId = req.user.userId;
    
    // Verify the user is an admin
    // const user = await User.findById(userId);
    // if (!user || user.role !== 'acadAdmin') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Access denied. Only academic administrators can create announcements'
    //   });
    // }
    
    // Create new announcement
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

    console.log("New Announcement:", newAnnouncement);
    
    await newAnnouncement.save();
    
    return res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      announcement: newAnnouncement
    });
    
  } catch (error) {
    console.error('Error adding announcement:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create announcement',
      error: error.message
    });
  }
};

// Update announcement
export const updateAnnouncement = async (req, res) => {
  try {
    console.log("Updating announcement", req.body);
    const { announcementId } = req.params;
    // const { title, content, importance, targetAudience } = req.body;
    const { title, content, importance, targetGroups,targetEmails } = req.body;

    // Find the announcement
    const announcement = await AcadAdminAnnouncement.findById(announcementId);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    // Update the announcement
    announcement.title = title;
    announcement.content = content;
    announcement.importance = importance;
    announcement.targetGroups = targetGroups;
    announcement.targetEmails = targetEmails;
    // Don't update the date or postedBy fields
    
    await announcement.save();
    
    return res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      announcement
    });
    
  } catch (error) {
    console.error('Error updating announcement:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update announcement',
      error: error.message
    });
  }
};

// Delete announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;
    
    // Find and delete the announcement
    const announcement = await AcadAdminAnnouncement.findByIdAndDelete(announcementId);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete announcement',
      error: error.message
    });
  }
};

export const getFacultyAnnouncements = async (req, res) => {
  try {
    console.log("Fetching all announcements for user ID:", req);
    const userId = req.params.id;
    // const userId = "67fb82e1fd693835a24dd230";
    console.log("Fetching all announcements for user ID:", userId);
    // Find student to get enrolled courses
    const faculty = await Faculty.findOne({ userId });
    
    if (!faculty) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student profile not found' 
      });
    }
    let allAnnouncements = [];

    const acadAdminAnnouncements = await AcadAdminAnnouncement.find({
      $or: [
        {targetEmails: {$in: [faculty.email]}},
        {'targetGroups.allUniversity': true},
        {
          'targetGroups.faculty': true,
          $and: [
            {
              $or: [
                { 'targetGroups.departments': { $in: ['all'] } },
                { 'targetGroups.departments': { $in: [faculty.department] } }
              ]
            },
          ]
        }
      ]
    });
    console.log("Academic Admin Announcements:", acadAdminAnnouncements);
    // // Process academic admin announcements
    const processedAdminAnnouncements = acadAdminAnnouncements.map(announcement => ({
      ...announcement.toObject(),
      type: 'admin'
    }));
    
    // Combine all announcements
    const combinedAnnouncements = [
      ...processedAdminAnnouncements
    ];
    
    // Sort all announcements by date (most recent first)
    combinedAnnouncements.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return res.status(200).json({
      success: true,
      count: combinedAnnouncements.length,
      announcements: combinedAnnouncements
    });
    
  } catch (error) {
    console.error('Error fetching all announcements:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
      error: error.message
    });
  }
};