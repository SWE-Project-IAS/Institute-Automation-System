
import './App.css';
import ComplaintSection from './components/complaintSection';
import HostelLeave from './components/HostelLeave/HostelLeave';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import CourseRegistration from './components/registration/courseRegistration';
import AttendanceLandingPage from './components/Attendance/AttendanceLandingPage';
import AttendanceCoursePage from './components/Attendance/AttendanceCoursePage';
import FeedbackAdmin from './components/courseFeedback/feedbackadmin.jsx';
import FeedbackFaculty from './components/courseFeedback/feedbackfaculty.jsx';
import FeedbackStudent from './components/courseFeedback/feedbackstudent.jsx';
import FeedbackAdminSelect from './components/courseFeedback/feedbackadminSelect.jsx';
import FeedbackFacultySelect from './components/courseFeedback/feedbackfacultySelect.jsx';
import FeedbackStudentSelect from './components/courseFeedback/feedbackstudentSelect.jsx';
import Mess from './components/HostelMess/Mess.jsx';
import StudentSubscriptionForm from './components/HostelMess/StudentSubscriptionForm.jsx';
import AdminSubscriptionRequests from './components/HostelMess/AdminSubscriptionRequests.jsx';
import { Navigate } from "react-router-dom";
import FacultyDashboard from './components/registration/faculty_reg_dashboard.jsx';
import CourseRegistrationFaculty from './components/registration/faculty_registration_page.jsx';
import FacultyGradeLanding from './components/Grades/facultyGradeLanding.jsx';
import SubmitGrades from './components/Grades/sumbitGrades.jsx';


import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import pages
import Documents from "./pages/Documents/index.jsx";
import TranscriptPage from "./pages/Documents/Transcript.jsx";
import IDCardPage from "./pages/Documents/IDCard.jsx";
import PassportPage from "./pages/Documents/Passport.jsx";
import BonafidePage from "./pages/Documents/Bonafide.jsx";
import FeeReceiptPage from "./pages/Documents/FeeReceipt.jsx";
import OthersForm from "./pages/Documents/OthersForm.jsx";
import AssignmentLanding from "./components/Assignment/AssignmentLanding.jsx";
import AssignmentList from "./components/Assignment/AssignmentList.jsx";
import AssignmentDetail from "./components/Assignment/AssignmentDetails.jsx";
import CreateAssignment from "./components/Assignment/CreateAssignment.jsx";
import EditAssignment from "./components/Assignment/EditAssignment.jsx";
import FacultyAssignmentSubmissions from "./components/Assignment/FacultyAssignmentSubmissions.jsx";
import LoginPage from "./components/LoginPage/Login.jsx";
import ResetPasswordPage from './components/LoginPage/ResetPasswordPage.jsx';
import DropCourse from "./components/dropCourse/drop.jsx";
import CourseAnnouncements from "./components/Announcements/studentAnnouncements.jsx";
import MyCourses from "./components/mycourses/myCourse.jsx";
import DocumentManager from "./pages/Documents/admin/DocumentManager.jsx";
import DocumentAccessControl from "./pages/Documents/admin/DocumentAccessControl.jsx";
import FeePayment from "./pages/FeePayment.jsx";
import AdminFeeControl from "./pages/Documents/admin/AdminFeeControl.jsx";
import { RoleProvider } from './context/Rolecontext.jsx';
import StudentProfile from './pages/ProfilePage.jsx';
import TimeTable from './components/TimeTable/timetable.jsx';
import HostelTransfer from './components/HostelTransfer/HostelTransfer.jsx';
//import CourseRegistration from "./pages/CourseRegistration";  // New Registration Page
import { Toaster } from 'react-hot-toast';

import AdminRegistration from './components/registration/admin_reg.jsx';
import AdminDropRequests from './components/dropCourse/dropCourseAdmin.jsx';
import CourseWrapper from './components/mycourses/courseWrapper.jsx';
import FacultyCourseAnnouncements from './components/Announcements/facultyAnnouncements.jsx';
import AnnouncementWrapper from './components/Announcements/announcementWrapper.jsx';
import FacultyCourseStudents from './components/courseStudents/courseStudent.jsx';
// import CourseStudents from './components/courseStudents/courseStudent.jsx';
import CompletedCourses from './components/mycourses/CompletedCourses.jsx';
import DropCourseWrapper from './components/dropCourse/dropCourseWrapper.jsx';
import NotFound from './pages/Notfound.jsx';

import AddStudents from './components/AddStudents/addStudents.jsx';
import AddFaculty from './components/AddFaculty/addFaculty.jsx';

import AllAnnouncements from './components/Announcements/AllAnnouncements.jsx';
import SideAnnouncementWrapper from './components/Announcements/wrapperAnn.jsx';


const queryClient = new QueryClient()
function App() {
    const Layout = () => {
        return (
            <>
            <div className="app">
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            theme: {
                                primary: '#4aed88',
                            },
                        },
                    }}
                />
            <QueryClientProvider client={queryClient}>
                <Navbar />
                <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flexGrow: 1 }}>
                    <Outlet />
                </div>
                </div>
            </QueryClientProvider>
            </div>
            </>
        );
    };

    const router = createBrowserRouter([
        {
            path: "/login",
            element: <LoginPage/>,
        },
        {
            path: "/reset-password/:token",
            element: <ResetPasswordPage/>,
        },
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <Navigate to="/login" replace />,
                  },
                {
                    path: "/complaint",
                    element: <ComplaintSection />,
                },
                {
                    path: "/hostel/leave",
                    element: <HostelLeave />,
                },
                {
                    path: "/hostel/transfer",
                    element: <HostelTransfer />
                },
                {
                    path: "/hostel/mess",
                    element: <Mess />,
                    children: [
                        {
                            path: "student",
                            element: <StudentSubscriptionForm />,
                        },
                        {
                            path: "admin",
                            element: <AdminSubscriptionRequests />,
                        }
                    ]
                },
                { 
                    path: "/registration", 
                    element: <CourseRegistration /> 
                },
                {
                  path:'/facultyregistration',
                  element:<FacultyDashboard/>  
                },
                {
                    path:'facultyregistration/:courseCode',
                    element:<CourseRegistrationFaculty/>
                },
                {
                    path: '/adminregistration',
                    element:<AdminRegistration/>
                },
                {
                    path:"/assignmentlanding",
                    element: <AssignmentLanding/>
                },
                {
                    path:"/gradeLanding",
                    element: <FacultyGradeLanding/>
                },
                {
                    path: "/course/:courseID/submitGrades",
                    element: <SubmitGrades/>
                },
                {
                    path:"/course/:courseId/assignments/",
                    element: <AssignmentList/>
                },
                {
                    path:"/course/:courseId/assignment/:assignmentId",
                    element: <AssignmentDetail/>
                },
                {
                    path:"/course/:courseId/create-assignment",
                    element: <CreateAssignment/>
                },
                {
                    path:"/course/:courseId/assignment/:assignmentId/edit",
                    element: <EditAssignment/>
                },
                {
                    path:"/course/:courseId/assignment/:assignmentId/submissions",
                    element: <FacultyAssignmentSubmissions/>
                },
                {   
                    path:"/completed-courses",
                    element: <CompletedCourses/>
                },

                {
                    path:"/attendancelanding",
                    element: <AttendanceLandingPage/>
                },
                {
                    path:"/dropcourse",
                    element: <DropCourseWrapper/>
                },
                {
                    path:"/dropcourseApprovals",
                    element: <AdminDropRequests/>
                },
                {
                    path:"/course/:courseId/announcements",
                    element: <AnnouncementWrapper/>
                },
                {
                    path:"/announcements",
                    element: <SideAnnouncementWrapper/>
                },
                {
                    path:"/courses",
                    element: <CourseWrapper/>
                },
                {
                    path: "/course/:courseId/students",
                    element: <FacultyCourseStudents />
                },
                {
                    path:"/attendancelanding/:id",
                    element: <AttendanceCoursePage/>
                },
                  {
                    path: "/documents",
                    element: <Documents />,
                    children: [
                        {
                            path: "",
                            element: <Documents />,
                        },
                        {
                            path: "transcript",
                            element: <TranscriptPage />,
                        },
                        {
                            path: "idcard",
                            element: <IDCardPage />,
                        },
                        {
                            path: "passport",
                            element: <PassportPage />,
                        },
                        {
                            path: "bonafide",
                            element: <BonafidePage />,
                        },
                        {
                            path: "feereceipt",
                            element: <FeeReceiptPage />,
                        },
                        {
                            path: "othersform",
                            element: <OthersForm />,
                        }
                    ]
                },
                {
                    path: "/student/feedback",
                    element: <FeedbackStudentSelect/>
                },
                {
                    path: "/student/feedback/submit",
                    element: <FeedbackStudent/>
                },
                {
                    path: "/acadAdmin/feedback",
                    element: <FeedbackAdminSelect/>
                },
                {
                    path: "/acadAdmin/feedback/view",
                    element: <FeedbackAdmin/>
                },
                {
                    path: "/faculty/feedback",
                    element: <FeedbackFacultySelect/>
                },
                {
                    path: "/faculty/feedback/view",
                    element: <FeedbackFaculty/>
                },
                {
                    path: "/profile",
                    element: <StudentProfile/>
                },
                {
                    path: "/timetable",
                    element: <TimeTable/>
                },
                 {
                  path: "/feepayment",
                  element: <FeePayment />,
                },
                {
                  path: "/admin/documents",
                  element: <DocumentManager />,
                },
                {
                  path: "/admin/documents/access",
                  element: <DocumentAccessControl />,
                },
                {
                    path:"/acadAdmin/feeManagement",
                    element : <AdminFeeControl/>,
                },
                {
                    path:"/acadAdmin/add-students",
                    element : <AddStudents/>,
                },
                {
                    path:"/acadAdmin/facultyManagement",
                    element : <AddFaculty/>,
                }
            ],
        },
        {
            path: "*",
            element: <NotFound/>
        }
    ]);
    return (
        <RoleProvider>
          <RouterProvider router={router} />
        </RoleProvider>
    );
}

export default App;
