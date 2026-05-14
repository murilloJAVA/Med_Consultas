import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Consultas from "./pages/Consultas";
import Lembretes from "./pages/Lembretes";

function RotaProtegida({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
      <Route path="/consultas" element={<RotaProtegida><Consultas /></RotaProtegida>} />
      <Route path="/lembretes" element={<RotaProtegida><Lembretes /></RotaProtegida>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
