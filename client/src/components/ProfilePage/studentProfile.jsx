import React from "react";
import styles from "./ProfilePage.module.css";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
const StudentProfile = () =>{

    const {data:userData} = JSON.parse(localStorage.getItem("currentUser"));
    const {email, userId} = userData.user;
    console.log(email);
    console.log(userData);
    const { isLoading, error, data } = useQuery({
        queryKey: [`${userId}`],
        queryFn: () =>
            newRequest.get(`/student/${userId}`).then((res) => {
                return res.data;
            }),
    });
    console.log(data)
    const student = {
        rollNumber: data?.rollNo || "220101125",
        name: data?.userId?.name || "Priyanshu Pratyay",
        photo: "/student.jpg", // Place a student image in `public/` folder
        signphoto: "/sign.jpg",
        hostel: "Brahmaputra Hostel",
        email: data?.email || "tanush@iitg.ac.in",
        Bloodgr: "B+",
        contactno: "9032145678",
        dob: "06.04.2004",
        roomNo: "C-302",
        semester: 6,
        branch: "Computer Science & Engineering",
        yearOfJoining: 2021,
        programme: "B.Tech",
        facultyAdvisors: ["Dr. Aryabartta Sahu", "Prof. XYZ"],
        courses: [
          { code: "CS101", name: "Data Structures", department: "CS", creditAudit: "Credit", year: 2023, session: "Autumn", status: "Approved", grade: "A" },
          { code: "CS202", name: "Operating Systems", department: "CS", creditAudit: "Credit", year: 2024, session: "Spring", status: "Pending", grade: "NA" },
           { code: "CS202", name: "Operating Systems", department: "CS", creditAudit: "Credit", year: 2024, session: "Spring", status: "Pending", grade: "NA" }
        ],
      };
    return (
        <>
          {isLoading? <p>Loading...</p> : error ? <p>Error: {error.message}</p> : 
            <div className={styles.profileContainer}>
                <img src={student.photo} alt="Student" className={styles.profilePhoto} />
                <img src={student.signphoto} alt="Student" className={styles.signPhoto} />
            <div className={styles.profileHeader}>
            <div/>
                <div className={styles.profileInfo}>
                    <h1>{student.name}</h1>
                    <p><strong>Roll No:</strong> <span>{student.rollNumber}</span></p>
                    <p><strong>Hostel:</strong> <span>{student.hostel}</span></p>
                    <p><strong>Semester:</strong> <span>{student.semester}</span></p>
                    <p><strong>Room Number:</strong> <span>{student.roomNo}</span></p>
                    <p><strong>Email:</strong> <span>{student.email}</span></p>
                    <p><strong>Blood Group:</strong> <span>{student.Bloodgr}</span></p>
                    <p><strong>Contact Number:</strong> <span>{student.contactno}</span></p>
                    <p><strong>DOB:</strong> <span>{student.dob}</span></p>
                    <p><strong>Branch:</strong> <span>{student.branch}</span></p>
                    <p><strong>Year of Joining:</strong> <span>{student.yearOfJoining}</span></p>
                    <p><strong>Programme:</strong> <span>{student.programme}</span></p>
                </div>
            </div>

            {/* Faculty Advisors */}
            <div className={styles.facultySection}>
                <h2>Faculty Advisor(s)</h2>
                <ul>
                {student.facultyAdvisors.map((advisor, index) => (
                    <li key={index}>{advisor}</li>
                ))}
                </ul>
            </div>

            {/* Courses Table */}
            <div className={styles.courseSection}>
                <h2>Enrolled Courses</h2>
                <table>
                <thead>
                    <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Department</th>
                    <th>Credit/Audit</th>
                    <th>Year</th>
                    <th>Session</th>
                    <th>Approval Status</th>
                    <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {student.courses.map((course, index) => (
                    <tr key={index}>
                        <td>{course.code}</td>
                        <td>{course.name}</td>
                        <td>{course.department}</td>
                        <td>{course.creditAudit}</td>
                        <td>{course.year}</td>
                        <td>{course.session}</td>
                        <td>{course.status}</td>
                        <td>{course.grade}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        }
        </>
    );
}

export default StudentProfile;
