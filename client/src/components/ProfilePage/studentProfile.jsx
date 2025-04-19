import React from "react";
import styles from "./ProfilePage.module.css";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
const StudentProfile = () => {

    const { data: userData } = JSON.parse(localStorage.getItem("currentUser"));
    const { email, userId } = userData.user;
    console.log(email);
    console.log(userData);
    const { isLoading, error, data } = useQuery({
        queryKey: [`${userId}`],
        queryFn: () =>
            newRequest.get(`/student/${userId}`).then((res) => {
                return res.data;
            }),
    });

    const { isLoadingCourses, errorCourses, data: studentCourses = [] } = useQuery({
        queryKey: ["completed-courses"],
        queryFn: () =>
            newRequest.get(`/student/${userId}/completed-courses`).then((res) => {
                console.log("Course data received:", res.data);
                return res.data.courses || [];
            }),
    });

    console.log(data)
    console.log("courses: ", studentCourses)
    const student = {
        rollNumber: data?.rollNo,
        name: data?.userId?.name,
        photo: data?.userId?.profilePicture || "/dummy_user.png", // Place a placeholder student image in `public/` folder
        signphoto: data?.userId?.signature || "/sign.jpg",
        hostel: data?.hostel,
        email: data?.email,
        Bloodgr: data?.userId?.bloodGroup,
        contactno: data?.userId?.contactNo,
        dob: data?.userId?.dateOfBirth,
        roomNo: data?.roomNo,
        semester: data?.semester,
        fatherName: data?.fatherName,
        motherName: data?.motherName,
        branch: data?.department,
        yearOfJoining: data?.batch.substr(0, 4),
        programme: data?.program,
        // facultyAdvisors: ["Dr. Aryabartta Sahu", "Prof. XYZ"],
        courses: studentCourses,
    };
    return (
        <>
            {isLoading ? <p>Loading...</p> : error ? <p>Error: {error.message}</p> :
                <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden mt-10 p-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

                        {/* Profile and Signature Photos */}
                        <div className="flex flex-col items-center gap-4">
                            <img
                                src={student.photo}
                                alt="Student"
                                className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                            />
                            <img
                                src={student.signphoto}
                                alt="Signature"
                                className="w-40 h-16 object-contain border-t border-gray-200"
                            />
                        </div>

                        {/* Profile Info */}
                        <div className="w-full">
                            <h1 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                                {student.name || 'N/A'}
                            </h1>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                                <p><span className="font-bold">Roll No:</span> {student.rollNumber || 'N/A'}</p>
                                <p><span className="font-bold">Hostel:</span> {student.hostel || 'N/A'}</p>
                                <p><span className="font-bold">Semester:</span> {student.semester || 'N/A'}</p>
                                <p><span className="font-bold">Room Number:</span> {student.roomNo || 'N/A'}</p>
                                <p><span className="font-bold">Email:</span> {student.email || 'N/A'}</p>
                                <p><span className="font-bold">Blood Group:</span> {student.Bloodgr || 'N/A'}</p>
                                <p><span className="font-bold">Contact Number:</span> {student.contactno || 'N/A'}</p>
                                <p><span className="font-bold">DOB:</span> {student.dob || 'N/A'}</p>
                                <p><span className="font-bold">Father's Name:</span> {student.fatherName || 'N/A'}</p>
                                <p><span className="font-bold">Mother's Name:</span> {student.motherName || 'N/A'}</p>
                                <p><span className="font-bold">Branch:</span> {student.branch || 'N/A'}</p>
                                <p><span className="font-bold">Year of Joining:</span> {student.yearOfJoining || 'N/A'}</p>
                                <p><span className="font-bold">Programme:</span> {student.programme || 'N/A'}</p>
                            </div>
                        </div>
                    </div>


                    {/* Faculty Advisors */}
                    {/* <div className={styles.facultySection}>
                <h2>Faculty Advisor(s)</h2>
                <ul>
                {student.facultyAdvisors.map((advisor, index) => (
                    <li key={index}>{advisor}</li>
                ))}
                </ul>
            </div> */}

                    {/* Courses Table */}
                    {isLoadingCourses ? <p>Loading...</p> : errorCourses ? <p>Error: {error.message}</p> :
                        <div className={styles.courseSection}>
                            <h2>Completed Courses</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Course Code</th>
                                        <th>Course Name</th>
                                        <th>Department</th>
                                        <th>Credit/Audit</th>
                                        <th>Semester</th>
                                        <th>Credits</th>
                                        <th>Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {student.courses.map((course, index) => (
                                        <tr key={index}>
                                            <td>{course.courseCode}</td>
                                            <td>{course.courseName}</td>
                                            <td>{course.department}</td>
                                            <td>{course.creditOrAudit}</td>
                                            <td>{course.semester}</td>
                                            <td>{course.credits}</td>
                                            <td>{course.grade}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>}
                </div>
            }
        </>
    );
}

export default StudentProfile;
