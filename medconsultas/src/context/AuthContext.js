import React, { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("mc_usuario")) || null;
    } catch {
      return null;
    }
  });

  const login = useCallback((dados) => {
    setUsuario(dados);
    sessionStorage.setItem("mc_usuario", JSON.stringify(dados));
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
    sessionStorage.removeItem("mc_usuario");
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
