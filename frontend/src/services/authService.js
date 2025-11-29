// Point to LIVE Render backend
const API_BASE = "https://foine-backend.onrender.com";

export const authService = {
  register: async (email, password) => {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userEmail", data.email);
    }
    return data;
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userEmail", data.email);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
  },

  getUser: () => {
    return {
      userId: localStorage.getItem("userId"),
      email: localStorage.getItem("userEmail"),
    };
  },

  isLoggedIn: () => {
    return localStorage.getItem("userId") !== null;
  },
};