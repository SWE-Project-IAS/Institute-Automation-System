// import { mongoose } from "../database/mongoDb.js";
import { User, Complaint, Admin } from "../models/user.model.js";
import { validateAccessToken } from "../middleware/auth.middleware.js";


export const createComplaint = [
    validateAccessToken,
    async (req, res) => {
        const complaint = new Complaint(req.body);
        try {
            await complaint.save();
            res.status(201).json({
                message : "Successfully created the complaint",
                complaint : complaint
            });
        } catch (e) {
            console.log(`ERROR: Creating the complaint`);
            console.log(e);
            res.status(500).json({
                message : "Something went wrong!"
            });
        }
    }
];

export const getUserComplaints = [
    validateAccessToken,
    async (req, res) => {
        const userId = req.user._id;
        try {
            const complaints = await Complaint.find();
            res.send({
                data : complaints
            });
        } catch (e) {
            console.log(`ERROR: Fetching user complaints : ${userId}`);
            console.log(e);
            res.status(500).json({
                message : "Something went wrong!"
            });
        }
    }
];

export const getAllComplaints = [
    validateAccessToken,
    async (req, res) => {
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
  
        const complaints = await Complaint.find()
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
        console.error("ERROR: Fetching all complaints:", error);
        return res.status(500).json({ message: "Something went wrong while fetching complaints." });
      }
    },
  ];

// complaintId
export const deleteComplaint = 
    async (req, res) => {
        const complaintId = req.body.complaintId;
        // const userId = req.user._id;
        // clg(`UserId : ${userId}`);
        console.log(req.body);
        if(!complaintId){
            res.status(400).json({
                message : "Missing required attribute 'complaintId'"
            });
            return;
        }
        try {
            const complaint = await Complaint.findById(complaintId);
            if (!complaint) {
                return res.status(404).json({ message: `Complaint not found : ${complaintId}` });
            }
            if(complaint.userId !== userId){
                console.log(`ERROR : User don't have access to this complaint`);
                console.log(`UserId : ${userId}, ComplaintID: ${complaintId}`);
                return res.status(403).json({
                    message : "User don't have access this complaints"
                });
            }
            const deletedComplaint = await Complaint.findByIdAndDelete(complaintId);
            if(deleteComplaint){
                console.log(`ERROR: Deleting complaint '${complaintId}'`);
                return res.send({
                    message : "Complaint deleted successfully!"
                });
            }
            console.log(`ERROR: Deleting complaint : '${complaintId}'`);
            return res.status(404).json({
                error : `No matching complaint with id : ${complaintId}`,
                message : "Complaint not found!"
            });
        } catch (e) {
            console.log(`ERROR: Deleting complaint : '${complaintId}'`);
            console.log(e);
            return res.status(500).json({
                message : "Something went wrong!"
            });
        }
    }

// complaintId
// updatedStatus
export const updateStatus = [
    validateAccessToken,
    async (req, res) => {
        const complaintId = req.body.complaintId;
        const updatedStatus = req.body.updatedStatus;
        if(!complaintId || !updatedStatus){
            return res.status(400).json({
                error : "Missing attributes",
                message : "Required attributes: `complaintId` and `udpatedStatus`"
            });
        }
        try {
            const admin = await Admin.findOne({ email : req.user.email});
            if(!admin){
                console.log(`ERROR: Unauthorised access to update complaint status`);
                return res.status(403).json({
                    error : "User is not authorised for this action",
                    message : "You are not authorised to update status"
                });
            }
            const patch = {
                status : updatedStatus,
                updatedAt : Date.now
            }
            const complaint = await Complaint.findByIdAndUpdate({_id : complaintId}, patch, {new : true});
            if(complaint){
                return res.send({
                    message : 'Complaint updated successfully!',
                    complaint : complaint
                });
            }
            return res.status(404).json({
                message : "Complaint not found!"
            });
        } catch (e) {
            console.log(`ERROR: Updating status`);
            console.log(e);
            return res.status(500).json({
                message : "Something went wrong!"
            });
        }
    }
];
