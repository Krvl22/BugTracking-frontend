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
import ManagerBugDetails     from "../pages/manager/ManagerBugDetails"
import ManagerTaskDetails    from "../pages/manager/ManagerTaskDetails"

import DeveloperDashboard      from "../components/developer/DeveloperDashboard"
import DeveloperProjects       from "../pages/developer/DeveloperProjects"
import DeveloperBugs           from "../pages/developer/DeveloperBugs"
import DeveloperTasks          from "../pages/developer/DeveloperTasks"
import DeveloperProjectDetails from "../pages/developer/DeveloperProjectDetails"
import DeveloperSettings       from "../pages/developer/DeveloperSettings"
import DeveloperBugDetails     from "../pages/developer/DeveloperBugDetails"
import DeveloperTaskDetails    from "../pages/developer/DeveloperTaskDetails"

import TesterDashboard  from "../components/tester/TesterDashboard"
import TesterBugs       from "../pages/tester/TesterBugs"
import TesterReports    from "../pages/tester/TesterReports"
import TesterTasks      from "../pages/tester/TesterTasks"
import TesterSettings   from "../pages/tester/TesterSettings"
import TesterBugDetails from "../pages/tester/TesterBugDetails"  // NEW
import TesterTaskDetails from "../pages/tester/TesterTaskdetails"

const router = createBrowserRouter([

  // Public
  { path: "/",                element: <Login /> },
  { path: "/signup",          element: <Signup /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token",  element: <ResetPassword /> },

  // Admin
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

  // Project Manager
  {
    element: <ProtectedRoutes userRoles={["project_manager"]} />,
    children: [
      { path: "/managerdashboard",     element: <ManagerDashboard /> },
      { path: "/manager/projects",     element: <ManagerProjects /> },
      { path: "/manager/projects/:id", element: <ManagerProjectDetails /> },
      { path: "/manager/bugs",         element: <ManagerBugs /> },
      { path: "/manager/bugs/:id",     element: <ManagerBugDetails /> },
      { path: "/manager/reports",      element: <ManagerReports /> },
      { path: "/manager/tasks",        element: <ManagerTasks /> },
     { path: "/manager/tasks/:id",    element: <ManagerTaskDetails /> },
      { path: "/manager/team",         element: <ManagerTeam /> },
      { path: "/manager/settings",     element: <ManagerSettings /> },
    ]
  },

  // Developer
  {
    element: <ProtectedRoutes userRoles={["developer"]} />,
    children: [
      { path: "/developerdashboard",     element: <DeveloperDashboard /> },
      { path: "/developer/projects",     element: <DeveloperProjects /> },
      { path: "/developer/projects/:id", element: <DeveloperProjectDetails /> },
      { path: "/developer/tasks",        element: <DeveloperTasks /> },
      { path: "/developer/tasks/:id",    element: <DeveloperTaskDetails /> },
      { path: "/developer/bugs",         element: <DeveloperBugs /> },
      { path: "/developer/bugs/:id",     element: <DeveloperBugDetails /> },
      { path: "/developer/settings",     element: <DeveloperSettings /> },
    ]
  },

  // Tester
  {
    element: <ProtectedRoutes userRoles={["tester"]} />,
    children: [
      { path: "/testerdashboard",  element: <TesterDashboard /> },
      { path: "/tester/tasks",     element: <TesterTasks /> },
      { path: "/tester/tasks/:id",   element: <TesterTaskDetails /> },
      { path: "/tester/bugs",      element: <TesterBugs /> },
      { path: "/tester/bugs/:id",  element: <TesterBugDetails /> },   // NEW
      { path: "/tester/reports",   element: <TesterReports /> },
      { path: "/tester/settings",  element: <TesterSettings /> },
    ]
  },

  // 404
  { path: "*", element: <PageNotFound /> },
])

const AppRouter = () => <RouterProvider router={router} />

export default AppRouter





