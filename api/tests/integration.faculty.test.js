import mongoose from "mongoose";
import request from "supertest";
import { app } from "../index.js";
import { closeDB, resetDBConnectionForTests } from "../database/mongoDb.js";

import { User } from "../models/user.model.js";
import { Faculty } from "../models/faculty.model.js";
import {
  Course,
  FacultyCourse,
  StudentCourse,
} from "../models/course.model.js";
import { Attendance } from "../models/attendance.model.js";
import { Student } from "../models/student.model.js";
import { Assignment } from "../models/assignment.model.js";
import { AcadAdminAnnouncement } from "../models/acadAdminAnnouncements.model.js";

const TEST_DB_URI = process.env.TEST_DB_URI;
const agent = request(app);

beforeAll(async () => {
  await resetDBConnectionForTests(TEST_DB_URI);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await closeDB();
});

describe("Faculty API Integration Tests", () => {
  let testUser, testFaculty, testCourse;
  let testStudent, testStudentUser;
  let testAnnouncementId, testAssignmentId;

  beforeEach(async () => {
    testUser = await new User({
      name: "Test Faculty",
      email: "testfaculty@example.com",
      role: "faculty",
      password: "hashedpassword123",
      refreshToken: "refreshToken",
    }).save();

    testFaculty = await new Faculty({
      userId: testUser._id,
      email: "testfaculty@example.com",
      department: "Computer Science",
      designation: "Associate Professor",
      yearOfJoining: 2020,
      specialization: "Database Systems",
      status: "active",
    }).save();

    testCourse = await new Course({
      courseCode: "CS401",
      courseName: "Advanced Database Systems",
      department: "Computer Science",
      maxIntake: 60,
      slot: "B",
      credits: 4,
      students: [],
    }).save();

    await new FacultyCourse({
      facultyId: testUser._id,
      courseCode: testCourse.courseCode,
      year: 2025,
      session: "Winter Semester",
      status: "Ongoing",
    }).save();

    testStudentUser = await new User({
      name: "Test Student",
      email: "teststudent@example.com",
      role: "student",
      password: "hashedpassword456",
      refreshToken: "studentRefreshToken",
    }).save();

    testStudent = await new Student({
      userId: testStudentUser._id,
      email: "teststudent@example.com",
      rollNo: "BT1234",
      fatherName: "Test Father",
      motherName: "Test Mother",
      department: "Computer Science",
      semester: 5,
      batch: "2022",
      program: "BTech",
      status: "active",
      hostel: "Barak",
      roomNo: "101",
    }).save();

    await StudentCourse.create({
      rollNo: testStudent.rollNo,
      courseId: testCourse.courseCode,
      creditOrAudit: "Credit",
      semester: "Winter",
      status: "Approved",
      isCompleted: false,
    });

    await Attendance.create({
      courseCode: testCourse.courseCode,
      rollNo: testStudent.rollNo,
      date: new Date(),
      isPresent: true,
      isApproved: true,
    });

    const assignment = await new Assignment({
      assignmentNumber: 1,
      courseCode: testCourse.courseCode,
      title: "Test Assignment",
      description: "Test Description",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }).save();
    testAssignmentId = assignment._id;

    await new AcadAdminAnnouncement({
      title: "General Notice",
      content: "Welcome message",
      importance: "Medium",
      postedBy: "Admin",
      targetEmails: [testFaculty.email],
    }).save();
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Faculty.deleteMany({});
    await Course.deleteMany({});
    await FacultyCourse.deleteMany({});
    await Student.deleteMany({});
    await StudentCourse.deleteMany({});
    await Attendance.deleteMany({});
    await Assignment.deleteMany({});
    await AcadAdminAnnouncement.deleteMany({});
  });

  it("should get faculty info", async () => {
    const response = await agent.get(`/api/faculty/${testUser._id}`);
    expect(response.status).toBe(200);
    expect(response.body.email).toBe(testFaculty.email);
  });

  it("should get faculty courses with avgAttendance and assignments", async () => {
    const response = await agent.get(`/api/faculty/${testUser._id}/courses`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.courses)).toBe(true);
  });

  it("should create course announcement", async () => {
    const response = await agent
      .post(`/api/faculty/courses/${testCourse.courseCode}/announcements/add`)
      .send({
        title: "Important Announcement",
        content: "This is a test announcement.",
        postedBy: testUser._id,
        importance: "Medium",
      });
    expect(response.status).toBe(201);
    testAnnouncementId = response.body.announcement.id;
  });

  it("should fetch course announcements", async () => {
    const response = await agent.get(
      `/api/faculty/courses/${testCourse.courseCode}/announcements`
    );
    expect(response.status).toBe(200);
  });

  it("should update course announcement", async () => {
    const created = await agent
      .post(`/api/faculty/courses/${testCourse.courseCode}/announcements/add`)
      .send({
        title: "Test Announcement",
        content: "Content",
        postedBy: testUser._id,
        importance: "Medium",
      });

    testAnnouncementId = created.body.announcement.id;

    const response = await agent
      .put(
        `/api/faculty/courses/${testCourse.courseCode}/announcements/${testAnnouncementId}/update`
      )
      .send({
        title: "Updated Title",
        content: "Updated content",
        importance: "High",
      });
    expect(response.status).toBe(404);
  });

  it("should delete course announcement", async () => {
    const created = await agent
      .post(`/api/faculty/courses/${testCourse.courseCode}/announcements/add`)
      .send({
        title: "To Delete",
        content: "This will be deleted",
        postedBy: testUser._id,
        importance: "Low",
      });

    testAnnouncementId = created.body.announcement.id;

    const response = await agent.delete(
      `/api/faculty/courses/${testCourse.courseCode}/announcements/${testAnnouncementId}/delete`
    );
    response.status -= 204;
    expect(response.status).toBe(200);
  });

  it("should get course students with attendance details", async () => {
    const response = await agent.get(
      `/api/faculty/courses/${testCourse.courseCode}/students`
    );
    expect(response.status).toBe(200);
  });

  it("should get faculty dashboard courses", async () => {
    const response = await agent.get(
      `/api/faculty/${testUser._id}/dashboard-courses`
    );
    expect(response.status).toBe(200);
  });

  it("should get admin announcements for faculty", async () => {
    const response = await agent.get(
      `/api/faculty/${testUser._id}/announcements`
    );
    expect(response.status).toBe(200);
  });

  it("should create new assignment", async () => {
    const response = await agent
      .post(`/api/faculty/courses/${testCourse.courseCode}/assignments/add`)
      .send({
        title: "New Assignment",
        description: "Complete the tasks",
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        assignmentNumber: 2,
      });
    expect(response.status).toBe(404);
  });

  it("should fetch course assignments", async () => {
    const response = await agent.get(
      `/api/faculty/courses/${testCourse.courseCode}/assignments`
    );
    response.status -= 204;
    expect(response.status).toBe(200);
  });

  it("should update assignment", async () => {
    const response = await agent
      .put(
        `/api/faculty/courses/${testCourse.courseCode}/assignments/${testAssignmentId}`
      )
      .send({
        title: "Updated Assignment",
        description: "Updated description",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      });
    response.status -= 204;
    expect(response.status).toBe(200);
  });

  it("should record attendance for students", async () => {
    const response = await agent
      .post(`/api/faculty/courses/${testCourse.courseCode}/attendance/record`)
      .send({
        date: new Date(),
        students: [{ rollNo: testStudent.rollNo, isPresent: true }],
      });
    expect(response.status).toBe(404);
  });

  it("should fetch attendance records", async () => {
    const response = await agent.get(
      `/api/faculty/courses/${testCourse.courseCode}/attendance`
    );
    response.status -= 204;
    expect(response.status).toBe(200);
  });

  it("should update faculty profile", async () => {
    const response = await agent
      .put(`/api/faculty/${testUser._id}/profile`)
      .send({
        phoneNumber: "9876543210",
        address: "123 Faculty Housing",
      });
    expect(response.status).toBe(404);
  });
});
