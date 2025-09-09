// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // NEW

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("access_token");
    const storedRefresh = localStorage.getItem("refresh_token");

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
      setRefresh(storedRefresh);
    }

    setLoadingUser(false); // ✅ done loading
  }, []);

  const login = (refreshToken, userData, authToken) => {
    setRefresh(refreshToken);
    setUser(userData);
    setToken(authToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access_token", authToken);
    localStorage.setItem("refresh_token", refreshToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefresh(null);

    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, setUser, loadingUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
