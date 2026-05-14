import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

export default function Header() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon" aria-hidden="true">+</div>
        <div>
          <span className="logo-nome">MedConsultas</span>
          <span className="logo-sub">Gestão de Saúde</span>
        </div>
      </div>

      <button
        className="menu-toggle"
        aria-label="Abrir menu de navegação"
        aria-expanded={menuAberto}
        onClick={() => setMenuAberto((v) => !v)}
      >
        {menuAberto ? "✕" : "☰"}
      </button>

      <nav className={`nav ${menuAberto ? "nav-aberto" : ""}`} aria-label="Menu principal">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          onClick={() => setMenuAberto(false)}>Dashboard</NavLink>
        <NavLink to="/consultas" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          onClick={() => setMenuAberto(false)}>Consultas</NavLink>
        <NavLink to="/lembretes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          onClick={() => setMenuAberto(false)}>Lembretes</NavLink>

        {usuario && (
          <div className="usuario-info">
            <span className="usuario-email" title={usuario.email}>
              {usuario.email.split("@")[0]}
            </span>
            <button className="btn-logout" onClick={handleLogout}>Sair</button>
          </div>
        )}
      </nav>
    </header>
  );
}
