import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  const login = (token) => {
    const decoded = jwtDecode(token);
    const user = {
      token,
      username: decoded.unique_name,
      isAdmin: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Admin",
    };
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return { currentUser, login, logout };
}
