import { Navigate } from "react-router-dom";

function PrivateUserRoute({ children }) {
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateUserRoute;
