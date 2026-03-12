// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Login from "../components/login";
// import Signup from "../components/Signup";
// import { UserNavbar } from "../components/user/UserNavbar";
// import { AdminSidebar } from "../components/admin/AdminSidebar";
// import { CarList } from "../components/user/CarList";
// import { CarDetail } from "../components/user/CarDetail";
// import { AllUserList } from "../components/admin/AllUserList";

// const router = createBrowserRouter([
//     {path:"/",element:<Login/>},
//     {path:"/signup",element:<Signup/>},

//     {path:"/user",element:<UserNavbar/>,
//         children:[
//             {path:"carlist",element:<CarList/>},
//             {path:"cardetail",element:<CarDetail/>}
//         ]
//     },
//     {
//         path:"/admin",element:<AdminSidebar/>,
//         children:[
//             {path:"allusers",element:<AllUserList/>}
//         ]
//     }
// ])

// const AppRouter = ()=>{
//     return <RouterProvider router={router}></RouterProvider>
// }
// export default AppRouter

// import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import Login from "../components/Login";
// import Signup from "../components/Signup";
// import AdminDashboard from "../components/admin/AdminDashboard";
// import TesterDashboard from "../components/tester/TesterDashboard";
// import ManagerDashboard from "../components/projectManager/ManagerDashboard";
// import DeveloperDashboard from "../components/developer/DeveloperDashboard";
// import { GetApiDemo } from "../components/tester/GetApiDemo";
// import { UseEffectDemo } from "../components/tester/UseEffectDemo";
// import { UserNavbar } from "../components/UserNavbar";
// import AdminSidebar from "../components/admin/AdminSidebar";
// import AdminHeader from "../components/admin/AdminHeader";
// import StatCard from "../components/admin/StateCard";
// import RecentUsers from "../components/admin/RecentUsers";
// import QuickActions from "../components/admin/QuickActions";

// import PageNotFound from '../components/PageNotFound'


// const router = createBrowserRouter([
//   { path: "/", element: <Login /> },
//   { path: "/signup", element: <Signup /> },

//   { path: "/admindashboard", element: <AdminDashboard /> },
//   { path: "/developerdashboard", element: <DeveloperDashboard /> },
//   { path: "/managerdashboard", element: <ManagerDashboard /> },
//   { path: "/testerdashboard", element: <TesterDashboard /> },
//   { path: "/usernavbar", element: <UserNavbar /> },
//   { path: "/getapidemo1", element: <GetApiDemo /> },
//   { path: "/useeffectdemo", element: <UseEffectDemo /> },

//   { path: "/adminheader", element: <AdminHeader /> },
//   { path: "/quickactions", element: <QuickActions /> },
//   { path: "/recentusers", element: <RecentUsers /> },
//   { path: "/statecard", element: <StatCard /> },
  

//   { path: '*', element: <PageNotFound /> }

// ]);

// const AppRouter = () => {
//   return <RouterProvider router={router} />;
// };

// export default AppRouter;



import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Login from "../components/Login";
import Signup from "../components/Signup";
import AdminDashboard from "../components/admin/AdminDashboard";
import TesterDashboard from "../components/tester/TesterDashboard";
import ManagerDashboard from "../components/projectManager/ManagerDashboard";
import DeveloperDashboard from "../components/developer/DeveloperDashboard";
import { GetApiDemo } from "../components/tester/GetApiDemo";
import { UseEffectDemo } from "../components/tester/UseEffectDemo";
import { UserNavbar } from "../components/UserNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import StatCard from "../components/admin/StateCard";
import RecentUsers from "../components/admin/RecentUsers";
import QuickActions from "../components/admin/QuickActions";
import PageNotFound from "../components/PageNotFound";

// ✅ ProtectedRoute — checks if user is logged in
// If not logged in → redirect to login page
// If logged in → show the page
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  // ✅ Public routes — anyone can access
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> },

  // ✅ Protected routes — only accessible after login
  {
    path: "/admindashboard",
    element: (<ProtectedRoute><AdminDashboard /></ProtectedRoute>),
  },
  {
    path: "/developerdashboard",
    element: (<ProtectedRoute><DeveloperDashboard /></ProtectedRoute>
    ),
  },
  {
    path: "/managerdashboard",
    element: (<ProtectedRoute><ManagerDashboard /></ProtectedRoute>),
  },
  {
    path: "/testerdashboard",
    element: (<ProtectedRoute><TesterDashboard /></ProtectedRoute>),
  },

  // ⚠️ These are dev/test routes — remove before final submission
  { path: "/usernavbar", element: <UserNavbar /> },
  { path: "/getapidemo1", element: <GetApiDemo /> },
  { path: "/useeffectdemo", element: <UseEffectDemo /> },
  { path: "/adminheader", element: <AdminHeader /> },
  { path: "/quickactions", element: <QuickActions /> },
  { path: "/recentusers", element: <RecentUsers /> },
  { path: "/statecard", element: <StatCard /> },

  // ✅ 404 page
  { path: "*", element: <PageNotFound /> },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
