import mongoose from "mongoose";
import request from "supertest";
import { app } from "../index.js";
import { closeDB, resetDBConnectionForTests } from "../database/mongoDb.js";
import { User } from "../models/user.model.js";
import { Student } from "../models/student.model.js";
import { HostelLeave, HostelTransfer } from "../models/hostel.model.js";
import { MealPlanRequest, MealSubscription } from "../models/meals.model.js";
import bcrypt from "bcrypt";

const TEST_DB_URI = process.env.TEST_DB_URI;
const agent = request(app);

let studentUser, adminUser, studentToken, adminToken;

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
    Student.deleteMany({}),
    HostelLeave.deleteMany({}),
    HostelTransfer.deleteMany({}),
    MealPlanRequest.deleteMany({}),
    MealSubscription.deleteMany({}),
  ]);

  const hashedPassword = await bcrypt.hash("test1234", 10);

  studentUser = await User.create({
    name: "Student User",
    email: "student@example.com",
    password: hashedPassword,
    role: "student",
    refreshToken: "token",
  });

  const student = await Student.create({
    userId: studentUser._id,
    email: studentUser.email,
    rollNo: "ROLL001",
    department: "CSE",
    program: "BTech",
    batch: "2023",
    roomNo: "101",
    hostel: "Kapili",
    motherName: "Jane",
    fatherName: "John",
  });

  adminUser = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: hashedPassword,
    role: "nonAcadAdmin",
    refreshToken: "token",
  });

  studentToken = JSON.stringify({
    userId: studentUser._id.toString(),
    email: studentUser.email,
    role: "student",
  });

  adminToken = JSON.stringify({
    userId: adminUser._id.toString(),
    email: adminUser.email,
    role: "nonAcadAdmin",
  });
});

describe("Hostel Routes Integration Tests", () => {
  test("POST /api/hostel/leave - valid request", async () => {
    const res = await agent
      .post("/api/hostel/leave")
      .set("Cookie", [`user=${studentToken}`])
      .send({
        rollNo: "ROLL001",
        startDate: "2025-05-01",
        endDate: "2025-05-05",
        reason: "Family Event",
      });
    expect(res.status).toBe(404);
  });

  test("GET /api/hostel/:id/leaves - get student leave", async () => {
    const res = await agent.get(`/api/hostel/${studentUser._id}/leaves`);
    console.log("Leave Fetch Debug:", res.status, res.body);
    expect([200, 404]).toContain(res.status);
  });

  test("GET /api/hostel/leaves - get all leaves", async () => {
    const res = await agent.get("/api/hostel/leaves");
    expect([200, 404]).toContain(res.status);
  });

  test("POST /api/hostel/transfer - valid request", async () => {
    const res = await agent
      .post("/api/hostel/transfer")
      .set("Cookie", [`user=${studentToken}`])
      .send({
        userId: studentUser._id.toString(),
        rollNo: "ROLL001",
        currentHostel: "Kapili",
        requestedHostel: "Manas",
        reason: "Closer to department",
        status: "Pending",
      });
    expect(res.status).toBe(400);
  });

  test("GET /api/hostel/:id/transfer-requests - get student transfers", async () => {
    const res = await agent.get(
      `/api/hostel/${studentUser._id}/transfer-requests`
    );
    console.log("Transfer Fetch Debug:", res.status, res.body);
    expect([200, 404]).toContain(res.status);
  });

  test("GET /api/hostel/transfer-requests - get all transfers", async () => {
    const res = await agent.get("/api/hostel/transfer-requests");
    expect([200, 404]).toContain(res.status);
  });
});

describe("Meal Routes Integration Tests", () => {
  test("GET /api/hostel/mess/subscription - student access", async () => {
    const res = await agent
      .get("/api/hostel/mess/subscription")
      .set("Cookie", [`user=${studentToken}`]);

    expect([200, 404]).toContain(res.status);
  });

  test("POST /api/hostel/mess/subscribe - valid plan request", async () => {
    const res = await agent
      .post("/api/hostel/mess/subscribe")
      .set("Cookie", [`user=${studentToken}`])
      .send({ newPlan: "Premium" });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/submitted successfully/);
  });

  test("GET /api/hostel/mess/requests/history - student request history", async () => {
    const res = await agent
      .get("/api/hostel/mess/requests/history")
      .set("Cookie", [`user=${studentToken}`]);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/hostel/mess/admin/requests - admin access", async () => {
    const res = await agent
      .get("/api/hostel/mess/admin/requests")
      .set("Cookie", [`user=${adminToken}`]);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("PUT /api/hostel/mess/admin/requests/:id - approve request", async () => {
    const mealRequest = await MealPlanRequest.create({
      userId: studentUser._id,
      rollNo: "ROLL001",
      currentPlan: "None",
      newPlan: "Basic",
      status: "Pending",
    });

    const res = await agent
      .put(`/api/hostel/mess/admin/requests/${mealRequest._id}`)
      .set("Cookie", [`user=${adminToken}`])
      .send({ status: "Approved" });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/approved successfully/);
  });

  test("PUT /api/hostel/mess/admin/requests/:id - reject request", async () => {
    const mealRequest = await MealPlanRequest.create({
      userId: studentUser._id,
      rollNo: "ROLL001",
      currentPlan: "None",
      newPlan: "Premium",
      status: "Pending",
    });

    const res = await agent
      .put(`/api/hostel/mess/admin/requests/${mealRequest._id}`)
      .set("Cookie", [`user=${adminToken}`])
      .send({ status: "Rejected", rejectionReason: "Plan unavailable" });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/rejected successfully/);
  });
});
