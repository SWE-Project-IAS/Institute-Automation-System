import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../index.js";
import { User } from "../models/user.model.js";
import { Complaint, SupportStaff } from "../models/complaint.model.js";
import { HostelAdmin as Admin } from "../models/hostelAdmin.model.js";
import { resetDBConnectionForTests, closeDB } from "../database/mongoDb.js";
import bcrypt from "bcrypt";

process.env.ACCESS_TOKEN_SECRET = "test_secret_key"; // Use the same secret as in your middleware

const TEST_DB_URI = process.env.TEST_DB_URI;
const agent = request(app);

let studentUser, adminUser;
let studentToken, adminToken;
let accessTokenStudent, accessTokenAdmin;

beforeAll(async () => {
  await resetDBConnectionForTests(TEST_DB_URI);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await closeDB();
});

beforeEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Complaint.deleteMany({}),
    SupportStaff.deleteMany({}),
    Admin.deleteMany({}),
  ]);

  const hashedPassword = await bcrypt.hash("test1234", 10);

  studentUser = await User.create({
    name: "Student User",
    email: "student@example.com",
    password: hashedPassword,
    role: "student",
    refreshToken: "token",
  });

  adminUser = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: hashedPassword,
    role: "nonAcadAdmin",
    refreshToken: "token",
  });

  await Admin.create({
    userId: adminUser._id,
    email: adminUser.email,
    name: adminUser.name,
  });

  const studentPayload = {
    userId: studentUser._id.toString(),
    email: studentUser.email,
    role: "student",
  };

  const adminPayload = {
    userId: adminUser._id.toString(),
    email: adminUser.email,
    role: "nonAcadAdmin",
  };

  accessTokenStudent = jwt.sign(
    studentPayload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
  accessTokenAdmin = jwt.sign(adminPayload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  studentToken = JSON.stringify(studentPayload);
  adminToken = JSON.stringify(adminPayload);
});

describe("Complaints Routes Integration Tests", () => {
  test("POST /api/complaints/create - student creates complaint", async () => {
    const res = await agent
      .post("/api/complaints/create")
      .set("Cookie", [
        `user=${studentToken}`,
        `accessToken=${accessTokenStudent}`,
      ])
      .send({
        title: "Fan Issue",
        date: new Date(),
        phoneNumber: "9999999999",
        description: "Fan not working in my room",
        address: "Room 101",
        locality: "Block A",
        category: "Electrical",
        subCategory: "Fan",
        timeAvailability: "9am-12pm",
        images: [],
      });

    expect(res.status).toBe(201);
    expect(res.body.complaint).toHaveProperty("title", "Fan Issue");
  });

  test("POST /api/complaints - student views own complaints", async () => {
    await Complaint.create({
      userId: studentUser._id,
      title: "Light Issue",
      date: new Date(),
      phoneNumber: "8888888888",
      description: "Light flickering",
      address: "Room 102",
      locality: "Block B",
      category: "Electrical",
      subCategory: "Light",
      imageUrls: [],
    });

    const res = await agent
      .post("/api/complaints")
      .set("Cookie", [
        `user=${studentToken}`,
        `accessToken=${accessTokenStudent}`,
      ])
      .send({});

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("POST /api/complaints/admin - admin views all complaints", async () => {
    const res = await agent
      .post("/api/complaints/admin")
      .set("Cookie", [`user=${adminToken}`, `accessToken=${accessTokenAdmin}`])
      .send({});
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("PATCH /api/complaints/admin/updateStatus - admin updates status", async () => {
    const complaint = await Complaint.create({
      userId: studentUser._id,
      title: "Broken Table",
      date: new Date(),
      phoneNumber: "7777777777",
      description: "The table in the study room is broken",
      category: "Furniture",
      subCategory: "Table",
      imageUrls: [],
    });

    const res = await agent
      .patch("/api/complaints/admin/updateStatus")
      .set("Cookie", [`user=${adminToken}`, `accessToken=${accessTokenAdmin}`])
      .send({ complaintId: complaint._id, updatedStatus: "In Progress" });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/updated successfully/i);
  });

  test("DELETE /api/complaints/delete - student deletes own complaint", async () => {
    const complaint = await Complaint.create({
      userId: studentUser._id,
      title: "AC Issue",
      date: new Date(),
      phoneNumber: "6666666666",
      description: "AC not cooling",
      category: "Electrical",
      subCategory: "AC",
      imageUrls: [],
    });

    const res = await agent
      .delete("/api/complaints/delete")
      .set("Cookie", [
        `user=${studentToken}`,
        `accessToken=${accessTokenStudent}`,
      ])
      .send({ _id: complaint._id });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  test("POST /api/complaints/admin/status - admin filters by status", async () => {
    await Complaint.create({
      userId: studentUser._id,
      title: "Fan noise",
      date: new Date(),
      phoneNumber: "5555555555",
      description: "Noisy fan",
      category: "Electrical",
      subCategory: "Fan",
      status: "In Progress",
      imageUrls: [],
    });

    const res = await agent
      .post("/api/complaints/admin/status")
      .set("Cookie", [`user=${adminToken}`, `accessToken=${accessTokenAdmin}`])
      .send({ status: "In Progress" });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty("status", "In Progress");
  });
});
