// src/services/authService.js
export async function loginApi(username, password) {
  const response = await fetch("https://localhost:7218/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName: username,
      password: password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Invalid credentials");
  }

  return await response.json(); 
}
