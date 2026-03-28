// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import ProtectedRoutes from "../hooks/ProtectedRoutes"

// import Login          from "../components/Login";
// import Signup         from "../components/Signup";
// import ForgotPassword from "../components/ForgotPassword";
// import ResetPassword  from "../components/ResetPassword";
// import PageNotFound   from "../components/PageNotFound";

// import AdminDashboard      from "../components/admin/AdminDashboard";
// import AdminUsers          from "../pages/admin/AdminUsers";
// import AdminProjects       from "../pages/admin/AdminProjects";
// import AdminAnalytics      from "../pages/admin/AdminAnalytics";
// import AdminSettings       from "../pages/admin/AdminSettings";
// import AdminUserDetails    from "../pages/admin/AdminUserDetails";
// import AdminProjectDetails from "../pages/admin/AdminProjectDetails";

// import ManagerDashboard   from "../components/projectManager/ManagerDashboard";
// import ManagerProjects from "../pages/manager/ManagerProjects";
// import ManagerBugs from "../pages/manager/ManagerBugs";
// import ManagerReports from "../pages/manager/ManagerReports";
// import ManagerTasks from "../pages/manager/ManagerTasks";
// import ManagerTeam from "../pages/manager/ManagerTeams";
// import ManagerProjectDetails from "../pages/manager/ManagerProjectDetails";
// import ManagerSettings from "../pages/manager/ManagerSettings";

// import DeveloperDashboard from "../components/developer/DeveloperDashboard";
// import DeveloperProjects from "../pages/developer/DeveloperProjects";
// import DeveloperBugs from "../pages/developer/DeveloperBugs";
// import DeveloperTasks from "../pages/developer/DeveloperTasks";

// import TesterDashboard    from "../components/tester/TesterDashboard";
// import TesterBugs from "../pages/tester/TesterBugs";
// import TesterReports from "../pages/tester/TesterReports";
// import TesterTasks from "../pages/tester/TesterTasks";

// const router = createBrowserRouter([

//   // ── Public Routes ──────────────────────────────────────────
//   { path: "/",                element: <Login /> },
//   { path: "/signup",          element: <Signup /> },
//   { path: "/forgot-password", element: <ForgotPassword /> },
//   { path: "/reset-password",  element: <ResetPassword /> },

//   // ── Admin Only ─────────────────────────────────────────────
//   {
//     element: <ProtectedRoutes userRoles={["admin"]} />,
//     children: [
//       { path: "/admindashboard",     element: <AdminDashboard /> },
//       { path: "/admin/users",        element: <AdminUsers /> },
//       { path: "/admin/users/:id",    element: <AdminUserDetails /> },
//       { path: "/admin/projects",     element: <AdminProjects /> },
//       { path: "/admin/projects/:id", element: <AdminProjectDetails /> },
//       { path: "/admin/analytics",    element: <AdminAnalytics /> },
//       { path: "/admin/settings",     element: <AdminSettings /> },
//     ]
//   },

//   // ── Project Manager Only ───────────────────────────────────

//   {
//   element: <ProtectedRoutes userRoles={["project_manager"]} />,
//   children: [
//     { path: "/managerdashboard", element: <ManagerDashboard /> },
//     { path: "/manager/projects", element: <ManagerProjects /> },
//     { path: "/manager/bugs", element: <ManagerBugs /> },
//     { path: "/manager/reports", element: <ManagerReports /> },
//     { path: "/manager/tasks", element: <ManagerTasks /> },
//     { path: "/manager/team", element: <ManagerTeam /> },
//     { path: "/manager/projects/:id", element:<ManagerProjectDetails /> },
//     {path: "/manager/settings",  element:<ManagerSettings /> }

//   ]
// },

//   // ── Developer Only ─────────────────────────────────────────
//   {
//     element: <ProtectedRoutes userRoles={["developer"]} />,
//     children: [
//       { path: "/developerdashboard", element: <DeveloperDashboard /> },
//       { path: "/developer/projects", element: <DeveloperProjects /> },
//       { path: "/developer/tasks", element: <DeveloperTasks /> },
//       { path: "/developer/bugs", element: <DeveloperBugs /> },
//     ]
//   },

//   // ── Tester Only ────────────────────────────────────────────
//   {
//     element: <ProtectedRoutes userRoles={["tester"]} />,
//     children: [
//       { path: "/testerdashboard", element: <TesterDashboard /> },
//       { path: "/tester/bugs", element: <TesterBugs /> },
//       { path: "/tester/tasks", element: <TesterTasks /> },
//       { path: "/tester/reports", element: <TesterReports /> },
//     ]
//   },

//   // ── 404 ────────────────────────────────────────────────────
//   { path: "*", element: <PageNotFound /> },

// ]);

// const AppRouter = () => <RouterProvider router={router} />;

// export default AppRouter;





import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ProtectedRoutes from "../hooks/ProtectedRoutes"

import Login          from "../components/Login"
import Signup         from "../components/Signup"
import ForgotPassword from "../components/ForgotPassword"
import ResetPassword  from "../components/ResetPassword"
import PageNotFound   from "../components/PageNotFound"

import AdminDashboard      from "../components/admin/AdminDashboard"
import AdminUsers          from "../pages/admin/AdminUsers"
import AdminProjects       from "../pages/admin/AdminProjects"
import AdminAnalytics      from "../pages/admin/AdminAnalytics"
import AdminSettings       from "../pages/admin/AdminSettings"
import AdminUserDetails    from "../pages/admin/AdminUserDetails"
import AdminProjectDetails from "../pages/admin/AdminProjectDetails"

import ManagerDashboard      from "../components/projectManager/ManagerDashboard"
import ManagerProjects       from "../pages/manager/ManagerProjects"
import ManagerBugs           from "../pages/manager/ManagerBugs"
import ManagerReports        from "../pages/manager/ManagerReports"
import ManagerTasks          from "../pages/manager/ManagerTasks"
import ManagerTeam           from "../pages/manager/ManagerTeams"
import ManagerProjectDetails from "../pages/manager/ManagerProjectDetails"
import ManagerSettings       from "../pages/manager/ManagerSettings"

import DeveloperDashboard      from "../components/developer/DeveloperDashboard"
import DeveloperProjects       from "../pages/developer/DeveloperProjects"
import DeveloperBugs           from "../pages/developer/DeveloperBugs"
import DeveloperTasks          from "../pages/developer/DeveloperTasks"
import DeveloperProjectDetails from "../pages/developer/DeveloperProjectDetails"  // NEW
import  DeveloperSettings    from "../pages/developer/DeveloperSettings"        // NEW

import TesterDashboard  from "../components/tester/TesterDashboard"
import TesterBugs       from "../pages/tester/TesterBugs"
import TesterReports    from "../pages/tester/TesterReports"
import TesterTasks      from "../pages/tester/TesterTasks"
import  TesterSettings  from "../pages/tester/TesterSettings"                   // NEW

const router = createBrowserRouter([

  // ── Public ─────────────────────────────────────────────────
  { path: "/",                element: <Login /> },
  { path: "/signup",          element: <Signup /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password",  element: <ResetPassword /> },

  // ── Admin ───────────────────────────────────────────────────
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

  // ── Project Manager ─────────────────────────────────────────
  {
    element: <ProtectedRoutes userRoles={["project_manager"]} />,
    children: [
      { path: "/managerdashboard",      element: <ManagerDashboard /> },
      { path: "/manager/projects",      element: <ManagerProjects /> },
      { path: "/manager/projects/:id",  element: <ManagerProjectDetails /> },
      { path: "/manager/bugs",          element: <ManagerBugs /> },
      { path: "/manager/reports",       element: <ManagerReports /> },
      { path: "/manager/tasks",         element: <ManagerTasks /> },
      { path: "/manager/team",          element: <ManagerTeam /> },
      { path: "/manager/settings",      element: <ManagerSettings /> },
    ]
  },

  // ── Developer ───────────────────────────────────────────────
  {
    element: <ProtectedRoutes userRoles={["developer"]} />,
    children: [
      { path: "/developerdashboard",       element: <DeveloperDashboard /> },
      { path: "/developer/projects",       element: <DeveloperProjects /> },
      { path: "/developer/projects/:id",   element: <DeveloperProjectDetails /> },  // NEW
      { path: "/developer/tasks",          element: <DeveloperTasks /> },
      { path: "/developer/bugs",           element: <DeveloperBugs /> },
      { path: "/developer/settings",       element: <DeveloperSettings /> },         // NEW
    ]
  },

  // ── Tester ──────────────────────────────────────────────────
  {
    element: <ProtectedRoutes userRoles={["tester"]} />,
    children: [
      { path: "/testerdashboard",    element: <TesterDashboard /> },
      { path: "/tester/tasks",       element: <TesterTasks /> },
      { path: "/tester/bugs",        element: <TesterBugs /> },
      { path: "/tester/reports",     element: <TesterReports /> },
      { path: "/tester/settings",    element: <TesterSettings /> },   // NEW
    ]
  },

  // ── 404 ────────────────────────────────────────────────────
  { path: "*", element: <PageNotFound /> },
])

const AppRouter = () => <RouterProvider router={router} />

export default AppRouter