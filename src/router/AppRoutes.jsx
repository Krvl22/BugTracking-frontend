// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import DashboardLayout from "../components/layout/DashboardLayout";

// import Login from "../components/Login";
// import Signup from "../components/Signup";
// import ForgotPassword from "../components/ForgotPassword";
// import ResetPassword from "../components/ResetPassword";

// import AdminDashboard from "../components/admin/AdminDashboard";

// import AdminUsers from "../pages/admin/AdminUsers";
// import AdminProjects from "../pages/admin/AdminProjects";

// import BugList from "../pages/bugs/BugList";
// import CreateBug from "../pages/bugs/CreateBug";
// import BugDetail from "../pages/bugs/BugDetail";
// import EditBug from "../pages/bugs/EditBug";

// import Profile from "../components/admin/Profile";
// import ActivityLog from "../components/admin/ActivityLog";

// import PageNotFound from "../components/PageNotFound";

// const AppRoutes = () => {
//   return (
//     <BrowserRouter>

//       <Routes>

//         {/* Authentication */}

//         <Route path="/" element={<Login />} />

//         <Route path="/signup" element={<Signup />} />

//         <Route path="/forgot-password" element={<ForgotPassword />} />

//         <Route path="/reset-password" element={<ResetPassword />} />


//         {/* Dashboard Layout */}

//         <Route
//   path="/dashboard"
//   element={
//     <DashboardLayout>
//       <AdminDashboard />
//     </DashboardLayout>
//   }
// />


//         {/* Users */}

//         <Route
//           path="/users"
//           element={
//             <DashboardLayout>
//               <AdminUsers />
//             </DashboardLayout>
//           }
//         />


//         {/* Projects */}

//         <Route
//           path="/projects"
//           element={
//             <DashboardLayout>
//               <AdminProjects />
//             </DashboardLayout>
//           }
//         />


//         {/* Bugs */}

//         <Route
//           path="/bugs"
//           element={
//             <DashboardLayout>
//               <BugList />
//             </DashboardLayout>
//           }
//         />

//         <Route
//           path="/bugs/create"
//           element={
//             <DashboardLayout>
//               <CreateBug />
//             </DashboardLayout>
//           }
//         />

//         <Route
//           path="/bugs/:id"
//           element={
//             <DashboardLayout>
//               <BugDetail />
//             </DashboardLayout>
//           }
//         />

//         <Route
//           path="/bugs/edit/:id"
//           element={
//             <DashboardLayout>
//               <EditBug />
//             </DashboardLayout>
//           }
//         />


//         {/* Profile */}

//         <Route
//           path="/profile"
//           element={
//             <DashboardLayout>
//               <Profile />
//             </DashboardLayout>
//           }
//         />


//         {/* Activity Log */}

//         <Route
//           path="/activity"
//           element={
//             <DashboardLayout>
//               <ActivityLog />
//             </DashboardLayout>
//           }
//         />


//         {/* 404 */}

//         <Route path="*" element={<PageNotFound />} />

//       </Routes>

//     </BrowserRouter>
//   );
// };

// export default AppRoutes;


import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";

import Login from "../components/Login";
import Signup from "../components/Signup";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";

import AdminDashboard from "../components/admin/AdminDashboard";
import TesterDashboard from "../components/tester/TesterDashboard";
import ManagerDashboard from "../components/projectManager/ManagerDashboard";
import DeveloperDashboard from "../components/developer/DeveloperDashboard";

import PageNotFound from "../components/PageNotFound";

// ✅ Protected Route
const ProtectedRoute = () => {
  const user = localStorage.getItem("user");
  return user ? <Outlet /> : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
  // 🌐 PUBLIC ROUTES
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },

  // 🔐 PROTECTED ROUTES
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admindashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/managerdashboard",
        element: <ManagerDashboard />,
      },
      {
        path: "/developerdashboard",
        element: <DeveloperDashboard />,
      },
      {
        path: "/testerdashboard",
        element: <TesterDashboard />,
      },
    ],
  },

  // ❌ 404
  { path: "*", element: <PageNotFound /> },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;