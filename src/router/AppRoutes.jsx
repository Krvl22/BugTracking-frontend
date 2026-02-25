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

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "../components/Login";
import Signup from "../components/Signup";
import AdminDashboard from "../components/admin/AdminDashboard";
import TesterDashboard from "../components/tester/TesterDashboard";
import ManagerDashboard from "../components/projectManager/ManagerDashboard";
import DeveloperDashboard from "../components/developer/DeveloperDashboard";
import { GetApiDemo } from "../components/tester/GetApiDemo";
import { UseEffectDemo } from "../components/tester/UseEffectDemo";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> },

  { path: "/admindashboard", element: <AdminDashboard /> },
  { path: "/developerdashboard", element: <DeveloperDashboard /> },
  { path: "/managerdashboard", element: <ManagerDashboard /> },
  { path: "/testerdashboard", element: <TesterDashboard /> },
  { path: "/getapidemo1", element: <GetApiDemo /> },
  { path: "/useeffectdemo", element: <UseEffectDemo /> },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;