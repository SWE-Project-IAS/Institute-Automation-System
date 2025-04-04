
import './App.css';
import ComplaintSection from './components/complaintSection';
import HostelLeave from './components/HostelLeave/HostelLeave';
import HostelTransfer from './components/HostelTransfer/HostelTransfer.jsx';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import CourseRegistration from './components/CourseRegistration';
import AttendanceLandingPage from './components/Attendance/AttendanceLandingPage';
import AttendanceCoursePage from './components/Attendance/AttendanceCoursePage';
import CourseFeedbackSelection from './components/courseFeedback/courseFeedbackSelection.jsx';
import CourseFeedbackForm from './components/courseFeedback/courseFeedbackForm.jsx';
import FeedbackConfiguration from './components/courseFeedback/feedbackConfiguration.jsx';
import FeedbackReports from './components/courseFeedback/feedbackReports.jsx';
import Mess from './components/HostelMess/Mess.jsx';
import StudentSubscriptionForm from './components/HostelMess/StudentSubscriptionForm.jsx';
import AdminSubscriptionRequests from './components/HostelMess/AdminSubscriptionRequests.jsx';
import { Navigate, useLocation } from "react-router-dom";
import { useContext } from 'react';
import CourseRegistrationFaculty from './components/registration/faculty_reg_dashboard.jsx';

import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import pages
import Documents from "./pages/Documents/index.jsx";
import TranscriptPage from "./pages/Documents/Transcript.jsx";
import IDCardPage from "./pages/Documents/IDCard.jsx";
import PassportPage from "./pages/Documents/Passport.jsx";
import BonafidePage from "./pages/Documents/Bonafide.jsx";
import FeeReceiptPage from "./pages/Documents/FeeReceipt.jsx";
import AssignmentLanding from "./components/Assignment/AssignmentLanding.jsx";
import AssignmentList from "./components/Assignment/AssignmentList.jsx";
import AssignmentDetail from "./components/Assignment/AssignmentDetails.jsx";
import LoginPage from "./components/LoginPage/Login.jsx";
import DropCourse from "./components/dropCourse/drop.jsx";
import CourseAnnouncements from "./components/Announcements/CourseAnnouncements.jsx";
import MyCourses from "./components/mycourses/myCourse.jsx";
import DocumentManager from "./pages/Documents/admin/DocumentManager.jsx";
import DocumentAccessControl from "./pages/Documents/admin/DocumentAccessControl.jsx";

import { RoleProvider } from './context/Rolecontext.jsx';
import StudentProfile from './pages/ProfilePage.jsx';
import TimeTable from './components/TimeTable/timetable.jsx';
import { RoleContext } from './context/Rolecontext.jsx';
import FacultyDashboard from "./components/registration/faculty_registration_page.jsx";  // New Course Selection Page
//import CourseRegistration from "./pages/CourseRegistration";  // New Registration Page

const queryClient = new QueryClient()
function App() {
    //const {role}=useContext(RoleContext)
    const Layout = () => {
        // const location = useLocation();
        // const role = location.state?.role;
        return (
            <>
            <div className="app">
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
                    element: <HostelTransfer />,
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
                    path:'facultyregistration/:id',
                    element:<CourseRegistrationFaculty/>
                },
                
                {
                    path:"/assigngmentlanding",
                    element: <AssignmentLanding/>
                },
                {
                    path:"/course/:courseId/assignment/",
                    element: <AssignmentList/>
                },
                {
                    path:"/course/:courseId/assignment/:assignmentId",
                    element: <AssignmentDetail/>
                },
                {
                    path:"/attendancelanding",
                    element: <AttendanceLandingPage/>
                },
                {
                    path:"/dropcourse",
                    element: <DropCourse/>
                },
                {
                    path:"/course/:courseId/announcements",
                    element: <CourseAnnouncements/>
                },
                {
                    path:"/my-courses",
                    element: <MyCourses/>
                },
                {
                    path:"/attendance/:id",
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
                        }
                    ]
                },
                {
                    path: "/courseFeedback",
                    element: <CourseFeedbackSelection/>
                },
                {
                    path: "/courseFeedback/selectedCourse",
                    element: <CourseFeedbackForm/>
                },
                {
                    path: "/feedbackConfiguration",
                    element: <FeedbackConfiguration/>
                },
                {
                    path: "/feedbackReports",
                    element: <FeedbackReports/>
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
            ],
        },
    ]);

