import { SupportStaff } from '../models/complaint.model.js';

/**
 * Seed the support staff collection with data for each category and subcategory
 * If support staff already exist, they will be deleted and recreated to ensure proper schema
 */
export const seedSupportStaff = async () => {
  try {
    // Delete existing support staff to ensure clean schema
    await SupportStaff.deleteMany({});
    //console.log('Cleared existing support staff data.');

    // Support staff data for Computer & Comm. Centre
    const computerStaff = [
      // Automation
      {
        name: "Rajiv Mehta",
        phone: "+91 9876543210",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["Automation"],
        assignedComplaints: []
      },
      {
        name: "Priya Sharma",
        phone: "+91 8765432109",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["Automation"],
        assignedComplaints: []
      },
      // Email Services
      {
        name: "Vivek Mishra",
        phone: "+91 7654321098",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["Email Services"],
        assignedComplaints: []
      },
      {
        name: "Meena Gupta",
        phone: "+91 6543210987",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["Email Services"],
        assignedComplaints: []
      },
      // HPC Support
      {
        name: "Ajay Patel",
        phone: "+91 5432109876",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["HPC Support"],
        assignedComplaints: []
      },
      {
        name: "Neha Joshi",
        phone: "+91 4321098765",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["HPC Support"],
        assignedComplaints: []
      },
      // Network
      {
        name: "Sanjay Kumar",
        phone: "+91 3210987654",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["Network"],
        assignedComplaints: []
      },
      {
        name: "Aarti Singh",
        phone: "+91 2109876543",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["Network"],
        assignedComplaints: []
      },
      // PC & Peripherals
      {
        name: "Rahul Verma",
        phone: "+91 1098765432",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["PC & Peripherals"],
        assignedComplaints: []
      },
      {
        name: "Sunita Rao",
        phone: "+91 9087654321",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["PC & Peripherals"],
        assignedComplaints: []
      },
      // Telephone
      {
        name: "Mohan Lal",
        phone: "+91 8907654321",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["Telephone"],
        assignedComplaints: []
      },
      {
        name: "Geeta Reddy",
        phone: "+91 7890654321",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["Telephone"],
        assignedComplaints: []
      },
      // Turnitin
      {
        name: "Ramesh Iyer",
        phone: "+91 6789054321",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["Turnitin"],
        assignedComplaints: []
      },
      {
        name: "Anjali Nair",
        phone: "+91 5678904321",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["Turnitin"],
        assignedComplaints: []
      },
      // Web Services
      {
        name: "Vikram Desai",
        phone: "+91 4567890321",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["Web Services"],
        assignedComplaints: []
      },
      {
        name: "Kavita Menon",
        phone: "+91 3456789021",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["Web Services"],
        assignedComplaints: []
      },
      // Other (Computer & Comm. Centre)
      {
        name: "Prakash Jha",
        phone: "+91 2345678901",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["Other"],
        assignedComplaints: []
      },
      {
        name: "Lakshmi Pillai",
        phone: "+91 1234567890",
        categories: ["Computer & Comm. Centre"],
        subCategories: ["Other"],
        assignedComplaints: []
      },
    ];

    // Support staff data for Hostel/Resident Complaints
    const hostelStaff = [
      // Plumbing
      {
        name: "Ashok Yadav",
        phone: "+91 9876512340",
        categories: ["Hostel/Resident Complaints"],
        subCategories: ["Plumbing"],
        assignedComplaints: []
      },
      {
        name: "Raju Sharma",
        phone: "+91 8765123490",
        categories: ["Hostel/Resident Complaints"],
        subCategories: ["Plumbing"],
        assignedComplaints: []
      },
      // Room Servicing
      {
        name: "Dinesh Kumar",
        phone: "+91 7651234980",
        categories: ["Hostel/Resident Complaints"],
        subCategories: ["Room Servicing"],
        assignedComplaints: []
      },
      {
        name: "Maya Devi",
        phone: "+91 6512349870",
        categories: ["Hostel/Resident Complaints"],
        subCategories: ["Room Servicing"],
        assignedComplaints: []
      },
      // Electricity Issues
      {
        name: "Suresh Electrician",
        phone: "+91 5123498760",
        categories: ["Hostel/Resident Complaints"],
        subCategories: ["Electricity Issues"],
        assignedComplaints: []
      },
      {
        name: "Manoj Electrician",
        phone: "+91 4123987650",
        categories: ["Hostel/Resident Complaints"],
        subCategories: ["Electricity Issues"],
        assignedComplaints: []
      },
      // Furniture Repair
      {
        name: "Govind Carpenter",
        phone: "+91 3129876540",
        categories: ["Hostel/Resident Complaints"],
        subCategories: ["Furniture Repair"],
        assignedComplaints: []
      },
      {
        name: "Kamal Woodworker",
        phone: "+91 2198765430",
        categories: ["Hostel/Resident Complaints"],
        subCategories: ["Furniture Repair"],
        assignedComplaints: []
      },
      // Cleaning Services
      {
        name: "Santosh Cleaner",
        phone: "+91 1987654320",
        categories: ["Hostel/Resident Complaints"],
        subCategories: ["Cleaning Services"],
        assignedComplaints: []
      },
      {
        name: "Reena Cleaning Staff",
        phone: "+91 9876543210",
        categories: ["Hostel/Resident Complaints"],
        subCategories: ["Cleaning Services"],
        assignedComplaints: []
      },
      // Other (Hostel/Resident)
      {
        name: "Vijay General Support",
        phone: "+91 8765432190",
        categories: ["Hostel/Resident Complaints"],
        subCategories: ["Other"],
        assignedComplaints: []
      },
      {
        name: "Anita Support Staff",
        phone: "+91 7654321980",
        categories: ["Hostel/Resident Complaints"],
        subCategories: ["Other"],
        assignedComplaints: []
      },
    ];

    // Support staff data for Infrastructure Complaints
    const infrastructureStaff = [
      // Gym
      {
        name: "Rohit Fitness",
        phone: "+91 6543219870",
        categories: ["Infrastructure Complaints"],
        subCategories: ["Gym"],
        assignedComplaints: []
      },
      {
        name: "Deepak Gym Manager",
        phone: "+91 5432198760",
        categories: ["Infrastructure Complaints"],
        subCategories: ["Gym"],
        assignedComplaints: []
      },
      // Badminton Hall
      {
        name: "Amit Sports Staff",
        phone: "+91 4321987650",
        categories: ["Infrastructure Complaints"],
        subCategories: ["Badminton Hall"],
        assignedComplaints: []
      },
      {
        name: "Komal Sports Manager",
        phone: "+91 3219876540",
        categories: ["Infrastructure Complaints"],
        subCategories: ["Badminton Hall"],
        assignedComplaints: []
      },
      // Table Tennis Court
      {
        name: "Rakesh Sports Staff",
        phone: "+91 2198765430",
        categories: ["Infrastructure Complaints"],
        subCategories: ["Table Tennis Court"],
        assignedComplaints: []
      },
      {
        name: "Sheela TT Coordinator",
        phone: "+91 1987654320",
        categories: ["Infrastructure Complaints"],
        subCategories: ["Table Tennis Court"],
        assignedComplaints: []
      },
      // Ground
      {
        name: "Mahesh Ground Keeper",
        phone: "+91 9876543210",
        categories: ["Infrastructure Complaints"],
        subCategories: ["Ground"],
        assignedComplaints: []
      },
      {
        name: "Vinod Ground Staff",
        phone: "+91 8765432109",
        categories: ["Infrastructure Complaints"],
        subCategories: ["Ground"],
        assignedComplaints: []
      },
      // Swimming Pool
      {
        name: "Ramesh Pool Manager",
        phone: "+91 7654321098",
        categories: ["Infrastructure Complaints"],
        subCategories: ["Swimming Pool"],
        assignedComplaints: []
      },
      {
        name: "Sneha Pool Maintenance",
        phone: "+91 6543210987",
        categories: ["Infrastructure Complaints"],
        subCategories: ["Swimming Pool"],
        assignedComplaints: []
      },
      // Food Court
      {
        name: "Rajiv Food Services",
        phone: "+91 5432109876",
        categories: ["Infrastructure Complaints"],
        subCategories: ["Food Court"],
        assignedComplaints: []
      },
      {
        name: "Meera Cafeteria Manager",
        phone: "+91 4321098765",
        categories: ["Infrastructure Complaints"],
        subCategories: ["Food Court"],
        assignedComplaints: []
      },
      // Other (Infrastructure)
      {
        name: "Kishore General Support",
        phone: "+91 3210987654",
        categories: ["Infrastructure Complaints"],
        subCategories: ["Other"],
        assignedComplaints: []
      },
      {
        name: "Pooja Infrastructure Staff",
        phone: "+91 2109876543",
        categories: ["Infrastructure Complaints"],
        subCategories: ["Other"],
        assignedComplaints: []
      },
    ];

    // Combine all staff data
    const allStaffData = [...computerStaff, ...hostelStaff, ...infrastructureStaff];

    // Insert all staff data into the database
    await SupportStaff.insertMany(allStaffData);

    //console.log(`Successfully seeded ${allStaffData.length} support staff records with updated schema`);
  } catch (error) {
    console.error('Error seeding support staff data:', error);
  }
};

// Export the function for use in index.js
export default seedSupportStaff;