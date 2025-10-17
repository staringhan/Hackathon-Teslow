import { Navigate } from "react-router-dom";

function PrivateAdminRoute({ children }) {
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  if (!currentUser || !currentUser.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateAdminRoute;
