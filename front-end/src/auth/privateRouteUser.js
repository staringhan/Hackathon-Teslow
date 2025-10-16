import { Navigate } from "react-router-dom";

function PrivateUserRoute({ element }) {
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return element
}

export default PrivateUserRoute;
