// import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";

// import Login from "../components/Login";
// import Signup from "../components/Signup";
// import ForgotPassword from "../components/ForgotPassword";
// import ResetPassword from "../components/ResetPassword";

// import AdminDashboard from "../components/admin/AdminDashboard";
// import TesterDashboard from "../components/tester/TesterDashboard";
// import ManagerDashboard from "../components/projectManager/ManagerDashboard";
// import DeveloperDashboard from "../components/developer/DeveloperDashboard";

// import AdminUsers    from "../pages/admin/AdminUsers";
// import AdminProjects from "../pages/admin/AdminProjects";

// import PageNotFound from "../components/PageNotFound";

// // ✅ Protected Route
// const ProtectedRoute = () => {
//   const user = localStorage.getItem("user");
//   return user ? <Outlet /> : <Navigate to="/" replace />;
// };

// const router = createBrowserRouter([
//   // 🌐 PUBLIC ROUTES
//   { path: "/", element: <Login /> },
//   { path: "/signup", element: <Signup /> },
//   { path: "/forgot-password", element: <ForgotPassword /> },
//   { path: "/reset-password", element: <ResetPassword /> },

//   // 🔐 PROTECTED ROUTES
//   {
//     element: <ProtectedRoute />,
//     children: [
//       {
//         path: "/admindashboard",
//         element: <AdminDashboard />,
//       },
//       { path: "/admin/users",    element: <AdminUsers /> },    
//       { path: "/admin/projects", element: <AdminProjects /> }, 
      
//       {
//         path: "/managerdashboard",
//         element: <ManagerDashboard />,
//       },
      
//       {
//         path: "/developerdashboard",
//         element: <DeveloperDashboard />,
//       },
      
//       {
//         path: "/testerdashboard",
//         element: <TesterDashboard />,
//       },
//     ],
//   },

//   // ❌ 404
//   { path: "*", element: <PageNotFound /> },
// ]);

// const AppRouter = () => {
//   return <RouterProvider router={router} />;
// };

// export default AppRouter;


import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";

import Login from "../components/Login";
import Signup from "../components/Signup";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";

import AdminDashboard from "../components/admin/AdminDashboard";
import TesterDashboard from "../components/tester/TesterDashboard";
import ManagerDashboard from "../components/projectManager/ManagerDashboard";
import DeveloperDashboard from "../components/developer/DeveloperDashboard";

import AdminUsers     from "../pages/admin/AdminUsers";
import AdminProjects  from "../pages/admin/AdminProjects";
import AdminAnalytics from "../pages/admin/Adminanalytics"; // ← NEW
import AdminSettings  from "../pages/admin/AdminSettings";  // ← NEW
import AdminUserDetails from "../pages/admin/AdminUserDetails";
import AdminProjectDetails from "../pages/admin/AdminProjectDetails";

import PageNotFound from "../components/PageNotFound";

// ✅ Protected Route
const ProtectedRoute = () => {
  const user = localStorage.getItem("user");
  return user ? <Outlet /> : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
  // 🌐 PUBLIC ROUTES
  { path: "/",                element: <Login /> },
  { path: "/signup",          element: <Signup /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password",  element: <ResetPassword /> },

  // 🔐 PROTECTED ROUTES
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/admindashboard",  element: <AdminDashboard /> },
      { path: "/admin/users",     element: <AdminUsers /> },
      { path: "/admin/projects",  element: <AdminProjects /> },
      { path: "/admin/analytics", element: <AdminAnalytics /> }, // ← NEW
      { path: "/admin/settings",  element: <AdminSettings /> },  // ← NEW
      { path: "/admin/users/:id", element: <AdminUserDetails /> },
      { path: "/admin/projects/:id", element: <AdminProjectDetails / >},
      { path: "/managerdashboard",   element: <ManagerDashboard /> },
      { path: "/developerdashboard", element: <DeveloperDashboard /> },
      { path: "/testerdashboard",    element: <TesterDashboard /> },
    ],
  },

  // ❌ 404
  { path: "*", element: <PageNotFound /> },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;