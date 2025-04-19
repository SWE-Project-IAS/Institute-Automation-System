// import { mongoose } from "../database/mongoDb.js";
import { HostelAdmin as Admin } from "../models/hostelAdmin.model.js";
import { Complaint, SupportStaff } from "../models/complaint.model.js";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.COMPLAINTS_SUPABASE_URL;
const supabaseKey = process.env.COMPLAINTS_SUPABASE_KEY;
const supabaseBucket = process.env.COMPLAINTS_SUPABASE_BUCKET || 'complaints';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

const ComplaintsController = {
  /**
   * Create a new complaint.
   * 
   * Input:
   * - Body: { title, date, description, imageUrl (optional), category, subCategory }
   * - User: { userId } (from `req.user`)
   * 
   * Output:
   * - Success: { message: "Successfully created the complaint", complaint }
   * - Error: { message: "Something went wrong!" }
   */
  createComplaint: async (req, res) => {
    const { title, date, description, phoneNumber, timeAvailability, address, locality, category, subCategory, images } = req.body;
    const imageUrls = [];

    try {
      // Upload images to Supabase if any are provided
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];

          // Ensure the image is a valid Base64 string
          if (typeof image !== 'string') {
            continue; // Skip invalid entries
          }

          // Remove data:image/jpeg;base64, prefix if present
          const base64Data = image.includes('base64,')
            ? image.split('base64,')[1]
            : image;

          // Convert base64 to buffer
          const buffer = Buffer.from(base64Data, 'base64');

          // Generate a unique file name
          const fileName = `${req.user.userId}_${Date.now()}_${i}.jpg`;

          // Upload to Supabase Storage
          const { data, error } = await supabase
            .storage
            .from(supabaseBucket)
            .upload(`complaints/${fileName}`, buffer, {
              contentType: 'image/jpeg',
              upsert: false
            });

          if (error) {
            console.error(`Failed to upload image ${i}:`, error);
            continue;
          }

          // Get public URL
          const { data: urlData } = supabase
            .storage
            .from(supabaseBucket)
            .getPublicUrl(`complaints/${fileName}`);

          imageUrls.push(urlData.publicUrl);
          console.log(`Uploaded image ${i} to Supabase: ${fileName}`);
        }
      }

      // Create and save the new complaint
      const complaint = new Complaint({
        title,
        date,
        description,
        phoneNumber,
        timeAvailability,
        address,
        locality,
        category,
        subCategory,
        userId: req.user.userId,
        imageUrls: imageUrls
      });

      await complaint.save();
      console.log(`Complaint created successfully: ${complaint._id}`);
      res.status(201).json({
        message: "Successfully created the complaint",
        complaint: complaint,
      });
    } catch (e) {
      console.log(`ERROR: Creating the complaint`);
      console.log(e);
      res.status(500).json({
        message: "Something went wrong!",
      });
    }
  },

  /**
   * Get complaints of the logged-in user.
   * 
   * Input:
   * - Body: { page (optional), limit (optional) }
   * - User: { userId } (from `req.user`)
   * 
   * Output:
   * - Success: { data: complaints, pagination: { currentPage, totalPages, pageSize, totalItems } }
   * - Error: { message: "Something went wrong!" }
   */
  getUserComplaints: async (req, res) => {
    const userId = req.user.userId;
    try {
      const page = parseInt(req.body.page) || 1;
      const limit = parseInt(req.body.limit) || 10;
      const skip = (page - 1) * limit;

      const totalComplaints = await Complaint.countDocuments({ userId });
      const totalPages = Math.ceil(totalComplaints / limit);
      const complaints = await Complaint.find({ userId }).skip(skip).limit(limit).sort({ createdAt: -1 });

      res.send({
        data: complaints,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          pageSize: limit,
          totalItems: totalComplaints,
        },
      });
    } catch (e) {
      console.log(`ERROR: Fetching user complaints : ${userId}`);
      console.log(e);
      res.status(500).json({
        message: "Something went wrong!",
      });
    }
  },

  /**
   * Get all complaints (Admin only).
   * 
   * Input:
   * - Body: { page (optional), limit (optional) }
   * - User: { email } (from `req.user`)
   * 
   * Output:
   * - Success: { data: complaints, pagination: { currentPage, totalPages, pageSize, totalItems } }
   * - Error: { message: "Something went wrong while fetching complaints." }
   */
  getAllComplaints: async (req, res) => {
    try {
      const admin = await Admin.findOne({ email: req.user.email });
      if (!admin) {
        console.log(`ERROR: Unauthorized access to fetch all complaints by user with email: ${req.user.email}`);
        return res.status(403).json({
          error: "User is not authorized for this action",
          message: "You are not authorized to view all complaints",
        });
      }

      const page = parseInt(req.body.page) || 1;
      const limit = parseInt(req.body.limit) || 10;
      const skip = (page - 1) * limit;

      const totalComplaints = await Complaint.countDocuments();
      const totalPages = Math.ceil(totalComplaints / limit);

      const complaints = await Complaint.find().skip(skip).limit(limit).sort({ createdAt: -1 });
      return res.send({
        data: complaints,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          pageSize: limit,
          totalItems: totalComplaints,
        },
      });
    } catch (error) {
      console.error("ERROR: Fetching all complaints:", error);
      return res.status(500).json({ message: "Something went wrong while fetching complaints." });
    }
  },

  /**
   * Delete a complaint.
   * 
   * Input:
   * - Body: { _id (complaintId) }
   * - User: { userId } (from `req.user`)
   * 
   * Output:
   * - Success: { message: "Complaint deleted successfully!" }
   * - Error: { message: "Complaint not found!" } or { message: "Something went wrong!" }
   */
  deleteComplaint: async (req, res) => {
    const complaintId = req.body._id;
    const userId = req.user.userId;

    if (!complaintId) {
      res.status(400).json({
        message: "Missing required attribute 'complaintId'",
      });
      return;
    }
    try {
      const complaint = await Complaint.findById(complaintId);
      if (!complaint) {
        return res.status(404).json({
          message: `Complaint not found : ${complaintId}`,
        });
      }
      if (complaint.userId.toString() !== userId) {
        console.log(`ERROR : User don't have access to this complaint`);
        console.log(`UserId : ${userId}, ComplaintID: ${complaintId}`);
        return res.status(403).json({
          message: "User don't have access to this complaint",
        });
      }

      // Check if complaint is resolved, and if so, prevent deletion
      if (complaint.status === 'Resolved') {
        return res.status(403).json({
          message: "Resolved complaints cannot be deleted",
          error: "Resolved complaints are permanently stored in the system"
        });
      }

      // Delete associated images from Supabase
      if (complaint.imageUrls && complaint.imageUrls.length > 0) {
        for (const imageUrl of complaint.imageUrls) {
          const fileName = imageUrl.split('/').pop();
          const { error } = await supabase
            .storage
            .from(supabaseBucket)
            .remove([`complaints/${fileName}`]);
          if (error) {
            console.error(`Failed to delete image '${fileName}' from Supabase:`, error.message);
          } else {
            console.log(`Deleted image from Supabase: ${fileName}`);
          }
        }
      }
      const deletedComplaint = await Complaint.findByIdAndDelete(complaintId);
      if (deletedComplaint) {
        console.log(`ERROR: Deleting complaint '${complaintId}'`);
        return res.send({
          message: "Complaint deleted successfully!",
        });
      }
      console.log(`ERROR: Deleting complaint : '${complaintId}'`);
      return res.status(404).json({
        error: `No matching complaint with id : ${complaintId}`,
        message: "Complaint not found!",
      });
    } catch (e) {
      console.log(`ERROR: Deleting complaint : '${complaintId}'`);
      console.log(e);
      return res.status(500).json({
        message: "Something went wrong!",
      });
    }
  },

  /**
   * Update the status of a complaint (Admin only).
   * 
   * Input:
   * - Body: { complaintId, updatedStatus }
   * - User: { email } (from `req.user`)
   * 
   * Output:
   * - Success: { message: "Complaint updated successfully!", complaint }
   * - Error: { message: "Complaint not found!" } or { message: "Something went wrong!" }
   */
  updateStatus: async (req, res) => {
    const complaintId = req.body.complaintId;
    const updatedStatus = req.body.updatedStatus;
    if (!complaintId || !updatedStatus) {
      return res.status(400).json({
        error: "Missing attributes",
        message: "Required attributes: `complaintId` and `updatedStatus`",
      });
    }
    try {
      const admin = await Admin.findOne({ email: req.user.email });
      if (!admin) {
        console.log(`ERROR: Unauthorised access to update complaint status`);
        return res.status(403).json({
          error: "User is not authorised for this action",
          message: "You are not authorised to update status",
        });
      }

      // Get the complaint to check if it has an assigned staff member
      const complaint = await Complaint.findById(complaintId);
      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found!",
        });
      }

      // Update the complaint status
      const patch = {
        status: updatedStatus,
        updatedAt: Date.now(),
      };

      const updatedComplaint = await Complaint.findByIdAndUpdate(complaintId, patch, { new: true });

      // If the status is changed to "Resolved" and the complaint has an assigned staff member
      if (updatedStatus === 'Resolved' && complaint.assignedStaffId) {
        // Add to resolved complaints and remove from assigned complaints
        await SupportStaff.findByIdAndUpdate(
          complaint.assignedStaffId,
          {
            $pull: { assignedComplaints: complaintId },
            $addToSet: { resolvedComplaints: complaintId }
          }
        );
      }

      return res.send({
        message: "Complaint updated successfully!",
        complaint: updatedComplaint,
      });
    } catch (e) {
      console.log(`ERROR: Updating status`);
      console.log(e);
      return res.status(500).json({
        message: "Something went wrong!",
      });
    }
  },

  /**
   * Assign a complaint to a support staff (Admin only).
   * 
   * Input:
   * - Body: { complaintId, supportStaffId }
   * - User: { email } (from `req.user`)
   * 
   * Output:
   * - Success: { message: "Complaint assigned successfully!", complaint }
   * - Error: { message: "Complaint not found!" } or { message: "Something went wrong!" }
   */
  assignComplaint: async (req, res) => {
    try {
      const admin = await Admin.findOne({ email: req.user.email });
      if (!admin) {
        console.log(`ERROR: Unauthorised access to assign complaint`);
        return res.status(403).json({
          error: "User is not authorised for this action",
          message: "You are not authorised to assign complaints",
        });
      }

      const { complaintId, supportStaffId } = req.body;
      if (!complaintId || !supportStaffId) {
        return res.status(400).json({
          error: "Missing attributes",
          message: "Required attributes: `complaintId` and `supportStaffId`",
        });
      }

      // Find the support staff
      const supportStaff = await SupportStaff.findById(supportStaffId);
      if (!supportStaff) {
        return res.status(404).json({
          message: "Support staff not found!",
        });
      }

      // Check if the staff is already handling too many complaints
      if (supportStaff.assignedComplaints && supportStaff.assignedComplaints.length >= 5) {
        return res.status(400).json({
          message: "Support staff is busy with 5 or more complaints already!",
        });
      }

      // Find the complaint
      const complaint = await Complaint.findById(complaintId);
      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found!",
        });
      }

      // If complaint is already assigned to someone else, remove it from their list
      if (complaint.assignedStaffId) {
        await SupportStaff.findByIdAndUpdate(
          complaint.assignedStaffId,
          { $pull: { assignedComplaints: complaintId } }
        );
      }

      // Update complaint with staff info
      const updatedComplaint = await Complaint.findByIdAndUpdate(
        complaintId,
        {
          assignedName: supportStaff.name,
          assignedContact: supportStaff.phone,
          assignedStaffId: supportStaffId,
          status: "In Progress",
          updatedAt: Date.now(),
        },
        { new: true }
      );

      // Add complaint to staff's assigned complaints list
      await SupportStaff.findByIdAndUpdate(
        supportStaffId,
        { $addToSet: { assignedComplaints: complaintId } }
      );

      return res.status(200).json({
        message: "Complaint assigned successfully!",
        complaint: updatedComplaint,
      });
    } catch (e) {
      console.log(`ERROR: Assigning complaint : ${e}`);
      return res.status(500).json({
        message: "Something went wrong!",
        error: e,
      });
    }
  },

  /**
   * Create a new support staff (Admin only).
   * 
   * Input:
   * - Body: { name, phone }
   * - User: { email } (from `req.user`)
   * 
   * Output:
   * - Success: { message: "Successfully created the support staff", supportStaff }
   * - Error: { message: "Something went wrong!" }
   */
  createSupportStaff: async (req, res) => {
    try {
      const admin = await Admin.findOne({ email: req.user.email });
      if (!admin) {
        console.log(`ERROR: Unauthorised access to update complaint status`);
        return res.status(403).json({
          error: "User is not authorised for this action",
          message: "You are not authorised to update status",
        });
      }
      const supportStaff = new SupportStaff(req.body);
      await supportStaff.save();
      return res.status(201).json({
        message: "Successfully created the support staff",
        supportStaff: supportStaff,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Something went wrong!",
        error: e,
      });
    }
  },

  /**
   * Delete a support staff (Admin only).
   * 
   * Input:
   * - Body: { supportStaffId }
   * - User: { email } (from `req.user`)
   * 
   * Output:
   * - Success: { message: "Support staff deleted successfully!" }
   * - Error: { message: "Support staff not found!" } or { message: "Something went wrong!" }
   */
  deleteSupportStaff: async (req, res) => {
    try {
      const admin = await Admin.findOne({ email: req.user.email });
      if (!admin) {
        console.log(`ERROR: Unauthorised access to update complaint status`);
        return res.status(403).json({
          error: "User is not authorised for this action",
          message: "You are not authorised to update status",
        });
      }
      const response = await SupportStaff.findByIdAndDelete(req.body.supportStaffId);
      if (response) {
        console.log(`Support staff deleted successfully!: ${req.body.supportStaffId}`);
        return res.status(200).json({
          message: "Support staff deleted successfully!",
        });
      }
      console.log(`Error: No support staff found with ID ${req.body.supportStaffId}`);
      return res.status(404).json({
        message: "Support staff not found!",
        error: `No support staff found with ID ${req.body.supportStaffId}`,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Something went wrong!",
        error: e,
      });
    }
  },

  /**
   * Get all support staff (Admin only).
   * 
   * Input:
   * - User: { email } (from `req.user`)
   * 
   * Output:
   * - Success: { message: "Support staff fetched successfully!", supportStaff }
   * - Error: { message: "Something went wrong!" }
   */
  getAllSupportStaff: async (req, res) => {
    try {
      const admin = await Admin.findOne({ email: req.user.email });
      if (!admin) {
        console.log(`ERROR: Unauthorised access to update complaint status`);
        return res.status(403).json({
          error: "User is not authorised for this action",
          message: "You are not authorised to update status",
        });
      }
      const supportStaff = await SupportStaff.find();
      return res.status(200).json({
        message: "Support staff fetched successfully!",
        supportStaff: supportStaff,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Something went wrong!",
        error: e,
      });
    }
  },

  /**
   * Get filtered support staff based on category and subcategory (Admin only).
   * 
   * Input:
   * - Query: { category, subCategory }
   * - User: { email } (from `req.user`)
   * 
   * Output:
   * - Success: { message: "Support staff fetched successfully!", supportStaff }
   * - Error: { message: "Something went wrong!" }
   */
  getFilteredSupportStaff: async (req, res) => {
    try {
      const admin = await Admin.findOne({ email: req.user.email });
      if (!admin) {
        console.log(`ERROR: Unauthorised access to fetch support staff`);
        return res.status(403).json({
          error: "User is not authorised for this action",
          message: "You are not authorised to fetch support staff",
        });
      }
      console.log(`BODY: ${req.body}`);
      const { category, subCategory } = req.body;

      if (!category || !subCategory) {
        return res.status(400).json({
          error: "Missing query parameters",
          message: "Required query parameters: 'category' and 'subCategory'",
        });
      }

      console.log(`Searching for staff with category: "${category}" and subCategory: "${subCategory}"`);

      // Find staff who:
      // 1. Match the specified category and subcategory
      // 2. Have fewer than 5 assigned complaints
      const supportStaff = await SupportStaff.find({
        categories: { $in: [category] },
        subCategories: { $in: [subCategory] },
      });

      console.log(`Found ${supportStaff.length} matching staff members`);

      // Sort the results in memory by number of assigned complaints (ascending)
      const sortedStaff = supportStaff.sort((a, b) => {
        const aCount = a.assignedComplaints ? a.assignedComplaints.length : 0;
        const bCount = b.assignedComplaints ? b.assignedComplaints.length : 0;
        return aCount - bCount; // Sort by number of complaints (ascending)
      });

      return res.status(200).json({
        message: "Support staff fetched successfully!",
        supportStaff: sortedStaff,
      });
    } catch (e) {
      console.log(`ERROR: Fetching filtered support staff: ${e}`);
      return res.status(500).json({
        message: "Something went wrong!",
        error: e,
      });
    }
  },

  /**
   * Get complaints filtered by status with pagination (Admin only).
   * 
   * Input:
   * - Body: { status, page (optional), limit (optional) }
   * - User: { email } (from `req.user`)
   * 
   * Output:
   * - Success: { data: complaints, pagination: { currentPage, totalPages, pageSize, totalItems } }
   * - Error: { message: "Something went wrong while fetching complaints." }
   */
  getComplaintsByStatus: async (req, res) => {
    try {
      const admin = await Admin.findOne({ email: req.user.email });
      if (!admin) {
        console.log(`ERROR: Unauthorized access to fetch complaints by status by user with email: ${req.user.email}`);
        return res.status(403).json({
          error: "User is not authorized for this action",
          message: "You are not authorized to view these complaints",
        });
      }

      const status = req.body.status;
      if (!status) {
        return res.status(400).json({
          error: "Missing required attribute",
          message: "Status is required to filter complaints",
        });
      }

      const page = parseInt(req.body.page) || 1;
      const limit = parseInt(req.body.limit) || 10;
      const skip = (page - 1) * limit;

      // Find complaints with the specified status
      const query = { status };
      const totalComplaints = await Complaint.countDocuments(query);
      const totalPages = Math.ceil(totalComplaints / limit);

      const complaints = await Complaint.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return res.send({
        data: complaints,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          pageSize: limit,
          totalItems: totalComplaints,
        },
      });
    } catch (error) {
      console.error("ERROR: Fetching complaints by status:", error);
      return res.status(500).json({ message: "Something went wrong while fetching complaints." });
    }
  },

  /**
   * Get complaint details by ID.
   * 
   * Input:
   * - Params: { id }
   * - User: { email } (from `req.user`)
   * 
   * Output:
   * - Success: { message: "Complaint details fetched successfully!", complaint }
   * - Error: { message: "Complaint not found!" } or { message: "Something went wrong!" }
   */
  getComplaintById: async (req, res) => {
    try {
      const complaintId = req.params.id;

      if (!complaintId) {
        return res.status(400).json({
          error: "Missing complaint ID",
          message: "Complaint ID is required"
        });
      }

      const complaint = await Complaint.findById(complaintId);

      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found!"
        });
      }

      return res.status(200).json({
        message: "Complaint details fetched successfully!",
        complaint: complaint
      });
    } catch (e) {
      console.error(`ERROR: Fetching complaint details by ID: ${e}`);
      return res.status(500).json({
        message: "Something went wrong while fetching complaint details."
      });
    }
  },

  /**
   * Get multiple complaints by their IDs (Admin only).
   * 
   * Input:
   * - Body: { complaintIds: [String] }
   * - User: { email } (from `req.user`)
   * 
   * Output:
   * - Success: { complaints: [Complaint] }
   * - Error: { message: "Something went wrong while fetching complaints." }
   */
  getComplaintsByIds: async (req, res) => {
    try {
      const admin = await Admin.findOne({ email: req.user.email });
      if (!admin) {
        console.log(`ERROR: Unauthorized access to fetch complaints by IDs by user with email: ${req.user.email}`);
        return res.status(403).json({
          error: "User is not authorized for this action",
          message: "You are not authorized to view these complaints",
        });
      }

      const { complaintIds } = req.body;

      if (!complaintIds || !Array.isArray(complaintIds) || complaintIds.length === 0) {
        return res.status(400).json({
          error: "Invalid request",
          message: "A non-empty array of complaintIds is required",
        });
      }

      const complaints = await Complaint.find({ _id: { $in: complaintIds } });

      return res.status(200).json({
        complaints: complaints,
      });
    } catch (error) {
      console.error("ERROR: Fetching complaints by IDs:", error);
      return res.status(500).json({
        message: "Something went wrong while fetching complaints."
      });
    }
  },

};

export default ComplaintsController;