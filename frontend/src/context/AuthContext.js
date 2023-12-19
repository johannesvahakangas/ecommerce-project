import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (token) => {
    // Save the token to localStorage
    localStorage.setItem("token", token);
    //fetch the user profile
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/user-profile/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      const userData = response.data;
      setUser(userData); // Update state
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const logout = () => {
    setUser(null); // Reset
    localStorage.removeItem("token"); // Clear token
    localStorage.removeItem("user"); // Clear user details
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
