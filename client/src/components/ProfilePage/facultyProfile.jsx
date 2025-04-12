// import React from "react";
// import styles from "./ProfilePage.module.css"; // Reuse the same CSS

// const FacultyProfile = () => {
//   const faculty = {
//     id_no: "F12345",
//     name: "Dr. Priyanshu Pratyay",
//     photo: "/student.jpg", // Reuse the same photo for now
//     designation: "Assistant Professor",
//     branch: "Computer Science & Engineering",
//     yearOfJoining: 2018,
//     fieldsOfInterests: ["Formal Verification", "ML for EDA"],
//     education: ["Ph.D. - IIT Bombay", "M.Tech - NIT Trichy"],
//     experience: ["Assistant Prof at IITG", "R&D Engineer at Intel"],
//     courses: [
//       { code: "CS101", name: "Data Structures", creditAudit: "Credit", year: 2023, session: "Autumn", status: "Approved" },
//       { code: "CS202", name: "Operating Systems", creditAudit: "Credit", year: 2024, session: "Spring", status: "Pending" },
//     ],
//   };

//   return (
//     <div className={styles.profileContainer}>
//       <div className={styles.profileHeader}>
//         <img src={faculty.photo} alt="Faculty" className={styles.profilePhoto} />
//         <div className={styles.profileInfo}>
//           <h1>{faculty.name}</h1>
//           <p><strong>ID No:</strong> <span>{faculty.id_no}</span></p>
//           <p><strong>Designation:</strong> <span>{faculty.designation}</span></p>
//           <p><strong>Branch:</strong> <span>{faculty.branch}</span></p>
//           <p><strong>Year of Joining:</strong> <span>{faculty.yearOfJoining}</span></p>
//         </div>
//       </div>

//       <div className={styles.facultySection}>
//         <h2>Fields of Interest</h2>
//         <ul>{faculty.fieldsOfInterests.map((field, idx) => <li key={idx}>{field}</li>)}</ul>
//       </div>

//       <div className={styles.facultySection}>
//         <h2>Education</h2>
//         <ul>{faculty.education.map((edu, idx) => <li key={idx}>{edu}</li>)}</ul>
//       </div>

//       <div className={styles.facultySection}>
//         <h2>Experience</h2>
//         <ul>{faculty.experience.map((exp, idx) => <li key={idx}>{exp}</li>)}</ul>
//       </div>

//       <div className={styles.courseSection}>
//         <h2>Courses Taught</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Course Code</th>
//               <th>Course Name</th>
//               <th>Credit/Audit</th>
//               <th>Year</th>
//               <th>Session</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {faculty.courses.map((course, index) => (
//               <tr key={index}>
//                 <td>{course.code}</td>
//                 <td>{course.name}</td>
//                 <td>{course.creditAudit}</td>
//                 <td>{course.year}</td>
//                 <td>{course.session}</td>
//                 <td>{course.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default FacultyProfile;


import React from "react";
import styles from "./ProfilePage.module.css"; // Reuse the same CSS

const FacultyProfile = () => {
  const faculty = {
    id_no: "F12345",
    name: "Dr. Priyanshu Pratyay",
    photo: "/student.jpg", // Reuse the same photo for now
    designation: "Assistant Professor",
    department: "Computer Science & Engineering",
    yearOfJoining: 2018,
    fieldsOfInterests: ["Formal Verification", "ML for EDA"],
    education: ["Ph.D. - IIT Bombay", "M.Tech - NIT Trichy"],
    experience: ["Assistant Prof at IITG", "R&D Engineer at Intel"],
    courses: [
      {
        code: "CS101",
        name: "Data Structures",
        department: "CS",
        creditAudit: "Credit",
        year: 2023,
        session: "Autumn",
        status: "Ongoing",
      },
      {
        code: "CS202",
        name: "Operating Systems",
        department: "CS",
        creditAudit: "Credit",
        year: 2024,
        session: "Spring",
        status: "Completed",
      },
    ],
    publications: [
      {
        title: "A Study on Formal Verification",
        journal: "IEEE Transactions on Software Engineering",
        year: 2020,
      },
      { title: "ML Techniques in EDA", journal: "ACM Journal", year: 2021 },
    ],
    researchStudents: {
      btp: [
        {
          name: "Student A",
          title: "Optimizing Verification Processes",
          year: 2022,
        },
        { name: "Student B", title: "Formal Methods in Practice", year: 2023 },
      ],
      mtp: [
        { name: "Student C", title: "Machine Learning in EDA", year: 2021 },
      ],
    },
    projects: [
      {
        name: "Project Alpha",
        description: "Developed a tool for formal verification",
        year: 2022,
      },
      {
        name: "Project Beta",
        description: "ML-based optimization for chip design",
        year: 2023,
      },
    ],
    achievements: [
      "Innovative Teaching Award 2022",
      "Best Researcher Award 2021",
    ],
    awards: ["Excellence in Research Award 2020", "Young Scientist Award 2019"],
    conferences: [
      {
        name: "International Conference on Software Engineering",
        year: 2021,
        role: "Keynote Speaker",
      },
      { name: "ACM SIGSOFT Symposium", year: 2022, role: "Panelist" },
    ],
    workshops: [
      { name: "Advanced EDA Techniques", year: 2023 },
      { name: "Formal Methods Bootcamp", year: 2022 },
    ],
    grants: [
      {
        title: "NSF Grant for Formal Verification",
        amount: "$250K",
        year: 2021,
      },
      {
        title: "Industry-Academia Collaboration Grant",
        amount: "$150K",
        year: 2023,
      },
    ],
    memberships: ["IEEE Member", "ACM Member", "AAAS Fellow"],
    serviceRoles: [
      { role: "Department Coordinator", duration: "2019-2021" },
      { role: "Curriculum Developer", duration: "2020-Present" },
    ],
  };

  // Inline CSS for an extra emphasis section header
  const inlineHeaderStyle = {
    color: "#007bff",
    marginBottom: "8px",
    fontSize: "18px",
    fontWeight: "600",
  };

  return (
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
            <strong>ID No:</strong> <span>{faculty.id_no}</span>
          </p>
          <p>
            <strong>Designation:</strong> <span>{faculty.designation}</span>
          </p>
          <p>
            <strong>Branch:</strong> <span>{faculty.branch}</span>
          </p>
          <p>
            <strong>Year of Joining:</strong>{" "}
            <span>{faculty.yearOfJoining}</span>
          </p>
        </div>
      </div>

      <div className={styles.facultySection}>
        <h2>Fields of Interest</h2>
        <ul>
          {faculty.fieldsOfInterests.map((field, idx) => (
            <li key={idx}>{field}</li>
          ))}
        </ul>
      </div>

      <div className={styles.facultySection}>
        <h2>Education</h2>
        <ul>
          {faculty.education.map((edu, idx) => (
            <li key={idx}>{edu}</li>
          ))}
        </ul>
      </div>

      <div className={styles.facultySection}>
        <h2>Experience</h2>
        <ul>
          {faculty.experience.map((exp, idx) => (
            <li key={idx}>{exp}</li>
          ))}
        </ul>
      </div>

      <div className={styles.courseSection}>
        <h2>Courses Taught</h2>
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Department</th>
              <th>Credit/Audit</th>
              <th>Year</th>
              <th>Session</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {faculty.courses.map((course, index) => (
              <tr key={index}>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>{course.department}</td>
                <td>{course.creditAudit}</td>
                <td>{course.year}</td>
                <td>{course.session}</td>
                <td>{course.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.facultySection}>
        <h2>Publications</h2>
        <ul>
          {faculty.publications.map((pub, idx) => (
            <li key={idx}>
              {pub.title} - {pub.journal} ({pub.year})
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.facultySection}>
        <h2>Research Students</h2>
        <h3 style={inlineHeaderStyle}>BTP Students</h3>
        <ul>
          {faculty.researchStudents.btp.map((student, idx) => (
            <li key={idx}>
              {student.name} - {student.title} ({student.year})
            </li>
          ))}
        </ul>
        <h3 style={inlineHeaderStyle}>MTP Students</h3>
        <ul>
          {faculty.researchStudents.mtp.map((student, idx) => (
            <li key={idx}>
              {student.name} - {student.title} ({student.year})
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.facultySection}>
        <h2>Projects</h2>
        <ul>
          {faculty.projects.map((project, idx) => (
            <li key={idx}>
              <strong>{project.name}</strong> ({project.year}):{" "}
              {project.description}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.facultySection}>
        <h2>Achievements & Awards</h2>
        <h3 style={inlineHeaderStyle}>Achievements</h3>
        <ul>
          {faculty.achievements.map((achievement, idx) => (
            <li key={idx}>{achievement}</li>
          ))}
        </ul>
        <h3 style={inlineHeaderStyle}>Awards</h3>
        <ul>
          {faculty.awards.map((award, idx) => (
            <li key={idx}>{award}</li>
          ))}
        </ul>
      </div>

      <div className={styles.facultySection}>
        <h2>Conferences & Workshops</h2>
        <h3 style={inlineHeaderStyle}>Conferences</h3>
        <ul>
          {faculty.conferences.map((conf, idx) => (
            <li key={idx}>
              {conf.name} ({conf.year}) - {conf.role}
            </li>
          ))}
        </ul>
        <h3 style={inlineHeaderStyle}>Workshops</h3>
        <ul>
          {faculty.workshops.map((ws, idx) => (
            <li key={idx}>
              {ws.name} ({ws.year})
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.facultySection}>
        <h2>Grants</h2>
        <ul>
          {faculty.grants.map((grant, idx) => (
            <li key={idx}>
              {grant.title} - {grant.amount} ({grant.year})
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.facultySection}>
        <h2>Professional Memberships</h2>
        <ul>
          {faculty.memberships.map((membership, idx) => (
            <li key={idx}>{membership}</li>
          ))}
        </ul>
      </div>

      <div className={styles.facultySection}>
        <h2>Service Roles</h2>
        <ul>
          {faculty.serviceRoles.map((role, idx) => (
            <li key={idx}>
              {role.role} {role.duration && `(${role.duration})`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FacultyProfile;
