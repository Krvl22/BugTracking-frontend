import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoutes from "../hooks/ProtectedRoutes"

import Login          from "../components/Login";
import Signup         from "../components/Signup";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword  from "../components/ResetPassword";
import PageNotFound   from "../components/PageNotFound";

import AdminDashboard      from "../components/admin/AdminDashboard";
import AdminUsers          from "../pages/admin/AdminUsers";
import AdminProjects       from "../pages/admin/AdminProjects";
import AdminAnalytics      from "../pages/admin/Adminanalytics";
import AdminSettings       from "../pages/admin/AdminSettings";
import AdminUserDetails    from "../pages/admin/AdminUserDetails";
import AdminProjectDetails from "../pages/admin/AdminProjectDetails";

import ManagerDashboard   from "../components/projectManager/ManagerDashboard";
import ManagerProject from "../pages/manager/ManagerProjects";
import ManagerProjects from "../pages/manager/ManagerProjects";
import ManagerBugs from "../pages/manager/ManagerBugs";
import ManagerReports from "../pages/manager/ManagerReports";
import ManagerTasks from "../pages/manager/ManagerTasks";
import ManagerTeam from "../pages/manager/ManagerTeams";

import DeveloperDashboard from "../components/developer/DeveloperDashboard";

import TesterDashboard    from "../components/tester/TesterDashboard";

const router = createBrowserRouter([

  // ── Public Routes ──────────────────────────────────────────
  { path: "/",                element: <Login /> },
  { path: "/signup",          element: <Signup /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password",  element: <ResetPassword /> },

  // ── Admin Only ─────────────────────────────────────────────
  {
    element: <ProtectedRoutes userRoles={["admin"]} />,
    children: [
      { path: "/admindashboard",     element: <AdminDashboard /> },
      { path: "/admin/users",        element: <AdminUsers /> },
      { path: "/admin/users/:id",    element: <AdminUserDetails /> },
      { path: "/admin/projects",     element: <AdminProjects /> },
      { path: "/admin/projects/:id", element: <AdminProjectDetails /> },
      { path: "/admin/analytics",    element: <AdminAnalytics /> },
      { path: "/admin/settings",     element: <AdminSettings /> },
    ]
  },

  // ── Project Manager Only ───────────────────────────────────

  {
  element: <ProtectedRoutes userRoles={["project_manager"]} />,
  children: [
    { path: "/managerdashboard", element: <ManagerDashboard /> },
    { path: "/manager/projects", element: <ManagerProjects /> },
    { path: "/manager/bugs", element: <ManagerBugs /> },
    { path: "/manager/reports", element: <ManagerReports /> },
    { path: "/manager/tasks", element: <ManagerTasks /> },
    { path: "/manager/team", element: <ManagerTeam /> },

  ]
},

// TEMPORARY - outside protection
{ path: "/manager/projects", element: <ManagerProject /> },

  // ── Developer Only ─────────────────────────────────────────
  {
    element: <ProtectedRoutes userRoles={["developer"]} />,
    children: [
      { path: "/developerdashboard", element: <DeveloperDashboard /> },
    ]
  },

  // ── Tester Only ────────────────────────────────────────────
  {
    element: <ProtectedRoutes userRoles={["tester"]} />,
    children: [
      { path: "/testerdashboard", element: <TesterDashboard /> },
    ]
  },

  // ── 404 ────────────────────────────────────────────────────
  { path: "*", element: <PageNotFound /> },

]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;

