// // import { Navigate, Outlet } from "react-router-dom"

// // const ProtectedRoutes = ({ userRoles }) => {
// //   const token = localStorage.getItem("token")
// //   const role  = localStorage.getItem("role")

// //   if (!token)                    return <Navigate to="/" />
// //   if (!userRoles.includes(role)) return <Navigate to="/" />

// //   return <Outlet />
// // }

// // export default ProtectedRoutes


// import { Navigate, Outlet, useLocation } from "react-router-dom";

// const ProtectedRoutes = ({ userRoles }) => {
//   const location = useLocation();

//   const token = localStorage.getItem("token");
//   const role  = localStorage.getItem("role");

//   // ❌ Not logged in
//   if (!token) {
//     return <Navigate to="/" replace state={{ from: location }} />;
//   }

//   // ❌ Role not allowed
//   if (!userRoles.includes(role)) {
//     return <Navigate to="/" replace state={{ from: location }} />;
//   }

//   // ✅ Allowed
//   return <Outlet />;
// };

// export default ProtectedRoutes;

import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoutes = ({ userRoles }) => {
  const token = localStorage.getItem("token")
  const role  = localStorage.getItem("role")

  if (!token)                    return <Navigate to="/" />
  if (!userRoles.includes(role)) return <Navigate to="/" />

  return <Outlet />
}

export default ProtectedRoutes