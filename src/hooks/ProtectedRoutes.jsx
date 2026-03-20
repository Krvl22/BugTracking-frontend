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


import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ userRoles, children }) => {
  const token = localStorage.getItem("token");
  let role = localStorage.getItem("role");

  role = role?.trim().toLowerCase();

  if (!token) return <Navigate to="/" replace />;

  if (!userRoles.map(r => r.toLowerCase()).includes(role)) {
    return <Navigate to="/" replace />;
  }
  console.log("TOKEN:", token);
console.log("ROLE:", role);
console.log("ALLOWED:", userRoles);
  return children;
};

export default ProtectedRoutes;