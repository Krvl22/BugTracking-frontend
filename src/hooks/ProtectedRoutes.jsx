
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoutes = ({ userRoles }) => {
  const token = localStorage.getItem("token")
  const role  = localStorage.getItem("role")

  if (!token)                    return <Navigate to="/" />
  if (!userRoles.includes(role)) return <Navigate to="/" />

  return <Outlet />
}

export default ProtectedRoutes