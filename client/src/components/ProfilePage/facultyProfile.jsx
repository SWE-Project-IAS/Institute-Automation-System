import React from "react";
import styles from "./ProfilePage.module.css"; // Reuse the same CSS
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const FacultyProfile = () => {

  const {data:userData} = JSON.parse(localStorage.getItem("currentUser"));
  const {userId} = userData.user;

  const { isLoading, error, data } = useQuery({
      queryKey: [`${userId}`],
      queryFn: () =>
          newRequest.get(`/faculty/${userId}`).then((res) => {
              return res.data;
          }),
  });

  const { isLoadingCourses, errorCourses, data: facultyCourses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () =>
        newRequest.get(`/faculty/${userId}/courses`).then((res) => {
            return res.data.courses;
        }),
});

  const faculty = {
    name: data?.userId?.name,
    photo: data?.userId?.profilePhoto || "/student.jpg", // Place a placeholder student image in public/ folder
    designation: data?.designation,
    email: data?.email,
    department: data?.department,
    yearOfJoining: data?.yearOfJoining,
    fieldsOfInterests: data?.specialization,
    education: data?.qualifications,
    courses: facultyCourses,
    experience: data?.experience || [],
    publications: data?.publications || [],
    researchStudents: data?.researchStudents || [],
    achievements: data?.achievements || [],
    conferences: data?.conferences || [],
  };

  // Inline CSS for an extra emphasis section header
  const inlineHeaderStyle = {
    color: "#007bff",
    marginBottom: "8px",
    fontSize: "18px",
    fontWeight: "600",
  };

return (
    <>
    {isLoading? <p>Loading...</p> : error ? <p>Error: {error.message}</p> : 
    <>
    <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
            <img
                src={faculty.photo}
                alt="Faculty"
                className={styles.profilePhoto}
            />
            <div className={styles.profileInfo}>
                <h1>{faculty.name}</h1>
                <p>
                    <strong>Designation:</strong> <span>{faculty.designation}</span>
                </p>
                <p>
                    <strong>Department:</strong> <span>{faculty.department}</span>
                </p>
                <p>
                    <strong>Year of Joining:</strong>{" "}
                    <span>{faculty.yearOfJoining}</span>
                </p>
                <p>
                    <strong>Email:</strong> <span>{faculty.email}</span>
                </p>
            </div>
        </div>

        {faculty.fieldsOfInterests && faculty.fieldsOfInterests.trim() !== "" && (
            <div className={styles.facultySection}>
                <h2>Fields of Interest</h2>
                <p>{faculty.fieldsOfInterests}</p>
            </div>
        )}

        {faculty.experience?.length > 0 && faculty.experience.some(exp => exp && exp.trim() !== "") && (
            <div className={styles.facultySection}>
                <h2>Experience</h2>
                <ul>
                    {faculty.experience.filter(exp => exp && exp.trim() !== "").map((exp, idx) => (
                        <li key={idx}>{exp}</li>
                    ))}
                </ul>
            </div>
        )}

        {faculty.courses?.length > 0 && faculty.courses.some(course => course && Object.keys(course).length > 0) && (
            <div className={styles.courseSection}>
                <h2>Courses Taught</h2>
                {isLoadingCourses ? (
                    <p>Loading...</p>
                ) : errorCourses ? (
                    <p>Error: {error.message}</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Department</th>
                                <th>Credits</th>
                                <th>Year</th>
                                <th>Session</th>
                                <th>Students enrolled</th>
                                <th>Average attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faculty.courses.filter(course => course && Object.keys(course).length > 0).map((course, index) => (
                                <tr key={index}>
                                    <td>{course.id}</td>
                                    <td>{course.name}</td>
                                    <td>{course.department}</td>
                                    <td>{course.credits}</td>
                                    <td>{course.year}</td>
                                    <td>{course.session}</td>
                                    <td>{course.students}</td>
                                    <td>{course.avgAttendance}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        )}

        {faculty.publications?.length > 0 && faculty.publications.some(pub => pub && pub.trim() !== "") && (
            <div className={styles.facultySection}>
                <h2>Publications</h2>
                <ul>
                    {faculty.publications.filter(pub => pub && pub.trim() !== "").map((pub, idx) => (
                        <li key={idx}>{pub}</li>
                    ))}
                </ul>
            </div>
        )}

        {faculty.researchStudents?.length > 0 && faculty.researchStudents.some(student => student && student.trim() !== "") && (
            <div className={styles.facultySection}>
                <h2>Research Students</h2>
                <ul>
                    {faculty.researchStudents.filter(student => student && student.trim() !== "").map((rs, idx) => (
                        <li key={idx}>{rs}</li>
                    ))}
                </ul>
            </div>
        )}

        {faculty.achievements?.length > 0 && faculty.achievements.some(achievement => achievement && achievement.trim() !== "") && (
            <div className={styles.facultySection}>
                <h2>Achievements</h2>
                <ul>
                    {faculty.achievements.filter(achievement => achievement && achievement.trim() !== "").map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                    ))}
                </ul>
            </div>
        )}

        {faculty.conferences?.length > 0 && faculty.conferences.some(conf => conf && Object.keys(conf).length > 0) && (
            <div className={styles.facultySection}>
                <h2>Conferences</h2>
                <ul>
                    {faculty.conferences.filter(conf => conf && Object.keys(conf).length > 0).map((conf, idx) => (
                        <li key={idx}>
                            {conf.name} ({conf.year}) - {conf.role}
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
    </>
    }
    </>
);
};

export default FacultyProfile;