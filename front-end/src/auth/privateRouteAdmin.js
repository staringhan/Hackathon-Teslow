import { Navigate } from "react-router-dom";

function PrivateAdminRoute({ children }) {
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // Si pas connecté ou pas admin → redirection
  if (!currentUser || !currentUser.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Sinon on affiche la page protégée
  return children;
}

export default PrivateAdminRoute;
