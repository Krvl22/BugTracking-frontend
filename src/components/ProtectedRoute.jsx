import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/" replace />;  // redirect to login
  }

  return children;  // show the page
};

export default ProtectedRoute;