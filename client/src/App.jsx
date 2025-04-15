
import './App.css';
import ComplaintSection from './components/complaintSection';
import HostelLeave from './components/HostelLeave/HostelLeave';
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
import { Navigate } from "react-router-dom";
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
import OthersForm from "./pages/Documents/OthersForm.jsx";
import AssignmentLanding from "./components/Assignment/AssignmentLanding.jsx";
import AssignmentList from "./components/Assignment/AssignmentList.jsx";
import AssignmentDetail from "./components/Assignment/AssignmentDetails.jsx";
import CreateAssignment from "./components/Assignment/CreateAssignment.jsx";
import EditAssignment from "./components/Assignment/EditAssignment.jsx";
import FacultyAssignmentSubmissions from "./components/Assignment/FacultyAssignmentSubmissions.jsx";
import LoginPage from "./components/LoginPage/Login.jsx";
import DropCourse from "./components/dropCourse/drop.jsx";
import CourseAnnouncements from "./components/Announcements/CourseAnnouncements.jsx";
import MyCourses from "./components/mycourses/myCourse.jsx";
import DocumentManager from "./pages/Documents/admin/DocumentManager.jsx";
import DocumentAccessControl from "./pages/Documents/admin/DocumentAccessControl.jsx";
import FeePayment from "./pages/FeePayment.jsx";
import AdminFeeControl from "./pages/Documents/admin/AdminFeeControl.jsx";
import { RoleProvider } from './context/Rolecontext.jsx';
import StudentProfile from './pages/ProfilePage.jsx';
import TimeTable from './components/TimeTable/timetable.jsx';
import FacultyDashboard from "./components/registration/faculty_registration_page.jsx";  // New Course Selection Page
import HostelTransfer from './components/HostelTransfer/HostelTransfer.jsx';
//import CourseRegistration from "./pages/CourseRegistration";  // New Registration Page
import { Toaster } from 'react-hot-toast';

import AdminRegistration from './components/registration/admin_reg.jsx';
import AdminDropCourseApproval from './components/dropCourse/dropCourseAdmin.jsx';

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
                    path:'facultyregistration/:id',
                    element:<CourseRegistrationFaculty/>
                },
                {
                    path: '/adminregistration',
                    element:<AdminRegistration/>
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
                    path:"/attendancelanding",
                    element: <AttendanceLandingPage/>
                },
                {
                    path:"/dropcourse",
                    element: <DropCourse/>
                },
                {
                    path:"/dropcourseApprovals",
                    element: <AdminDropCourseApproval/>
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
                        },
                        {
                            path: "othersform",
                            element: <OthersForm />,
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
                {
                    path:"/acadAdmin/feeManagement",
                    element : <AdminFeeControl/>,
                }
            ],
        },
    ]);
    return (
        <RoleProvider>
          <RouterProvider router={router} />
        </RoleProvider>
    );
}

export default App;
