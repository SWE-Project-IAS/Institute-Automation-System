import MyCalendar from "./Calendar";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const dummyCourses = [
  {
    id: "1",
    courseId: "CS101",
    courseName: "Introduction to Computer Science",
    semester: 1,
    attendanceAll: [],
    stats: { classesMissed: 2, classesAttended: 18, reqClasses: 20, percentage: 90 },
  },
  {
    id: "2",
    courseId: "MATH201",
    courseName: "Calculus II",
    semester: 2,
    attendanceAll: [],
    stats: { classesMissed: 5, classesAttended: 15, reqClasses: 20, percentage: 75 },
  },
  {
    id: "3",
    courseId: "PHY301",
    courseName: "Physics III",
    semester: 3,
    attendanceAll: [],
    stats: { classesMissed: 3, classesAttended: 17, reqClasses: 20, percentage: 85 },
  },
  {
    id: "4",
    courseId: "CHEM101",
    courseName: "Basic Chemistry",
    semester: 1,
    attendanceAll: [],
    stats: { classesMissed: 4, classesAttended: 16, reqClasses: 20, percentage: 80 },
  },
  {
    id: "5",
    courseId: "ENG202",
    courseName: "English Literature",
    semester: 2,
    attendanceAll: [],
    stats: { classesMissed: 1, classesAttended: 19, reqClasses: 20, percentage: 95 },
  },
  {
    id: "6",
    courseId: "HIST101",
    courseName: "World History",
    semester: 1,
    attendanceAll: [],
    stats: { classesMissed: 6, classesAttended: 14, reqClasses: 20, percentage: 70 },
  },
];

export const CourseStats = () => {
  const navigateTo = useNavigate();
  const { id } = useParams();
  const course = dummyCourses.find((c) => c.id === id) || dummyCourses[0];

  const [courseName, setCourseName] = useState(course.courseName);
  const [courseId, setCourseId] = useState(course.courseId);
  const [semester, setSemester] = useState(course.semester);
  const [attendanceAll, setAttendanceAll] = useState(course.attendanceAll);
  const [classesMissed, setClassesMissed] = useState(course.stats.classesMissed);
  const [classesAttended, setClassesAttended] = useState(course.stats.classesAttended);
  const [classesRequired, setClassesRequired] = useState(course.stats.reqClasses);
  const [percentage, setPercentage] = useState(course.stats.percentage);

  const deleteCourse = () => {
    alert("Course deleted successfully!");
    navigateTo("/");
  };

  return (
    <div className="course-stats">
      <div className="frame">
        <div className="overlap-group">
          <div className="text-wrapper">{courseId}</div>
          <div className="div">{courseName}</div>
        </div>
        <div className="text-wrapper-2">{semester} Semester</div>
      </div>
      <div className="calendar">
        <MyCalendar />
      </div>
      <div className="stats">
        <div className="frame-2">
          <div className="overlap">
            <div className="text-wrapper-3">Your Attendance</div>
            <div className="pie-chart">
              <div className="overlap-group-2">
                <div className="ellipse" />
                <div className="text-wrapper-4-attendance">{percentage}%</div>
              </div>
            </div>
          </div>
        </div>
        <div className="frame-2">
          <div className="overlap">
            <div className="text-wrapper-3">Classes Missed</div>
            <div className="pie-chart">
              <div className="overlap-group-2">
                <div className="ellipse" />
                <div className="text-wrapper-4">{classesMissed}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="frame-2">
          <div className="overlap">
            <div className="text-wrapper-3">Classes Attended</div>
            <div className="pie-chart">
              <div className="overlap-group-2">
                <div className="ellipse" />
                <div className="text-wrapper-4">{classesAttended}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="frame-2">
          <div className="overlap">
            <div className="text-wrapper-3">Required Classes</div>
            <div className="pie-chart">
              <div className="overlap-group-2">
                <div className="ellipse" />
                <div className="text-wrapper-4">{classesRequired}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
