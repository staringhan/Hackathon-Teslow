import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // named export

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  /**
   * @param {string} token - JWT token string from the API
   */
  const login = (token) => {
    if (typeof token !== "string") {
      throw new Error("Invalid token: must be a string");
    }

    const decoded = jwtDecode(token); // decode JWT string
    const user = {
      token,
      username: decoded.unique_name || "", // fallback if missing
      isAdmin:
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] === "Admin",
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
