import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../api";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [hints, setHints] = useState({});
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  function setHint(campo, msg) {
    setHints((h) => ({ ...h, [campo]: msg }));
  }

  function validar() {
    const novosHints = {};
    let valido = true;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email) { novosHints.email = "O e-mail é obrigatório."; valido = false; }
    else if (!emailRe.test(form.email)) { novosHints.email = "Digite um e-mail válido."; valido = false; }
    if (!form.senha) { novosHints.senha = "A senha é obrigatória."; valido = false; }

    setHints(novosHints);
    return valido;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    if (!validar()) return;

    setLoading(true);
    try {
      const res = await loginApi({ email: form.email, senha: form.senha });
      login({ email: res.email, id: res.id });
      navigate("/dashboard");
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="logo">
          <div className="logo-icon">+</div>
          <div>
            <span className="logo-nome">MedConsultas</span>
            <span className="logo-sub">Gestão de Saúde</span>
          </div>
        </div>
      </header>

      <main className="auth-main">
        <section className="auth-card">
          <h1>Entrar na conta</h1>
          <p className="auth-sub">Acesse o painel de gerenciamento de consultas</p>

          {erro && <div className="alerta alerta-erro" role="alert">{erro}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="campo">
              <label htmlFor="email">E-mail <span className="obrig">*</span></label>
              <input
                id="email" type="email" autoComplete="email"
                placeholder="seuemail@exemplo.com"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setHint("email", ""); }}
              />
              {hints.email && <span className="hint">{hints.email}</span>}
            </div>

            <div className="campo">
              <label htmlFor="senha">Senha <span className="obrig">*</span></label>
              <div className="input-wrapper">
                <input
                  id="senha" type={senhaVisivel ? "text" : "password"} autoComplete="current-password"
                  placeholder="Sua senha"
                  value={form.senha}
                  onChange={(e) => { setForm({ ...form, senha: e.target.value }); setHint("senha", ""); }}
                />
                <button type="button" className="toggle-senha" onClick={() => setSenhaVisivel((v) => !v)}
                  aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}>
                  {senhaVisivel ? "🙈" : "👁"}
                </button>
              </div>
              {hints.senha && <span className="hint">{hints.senha}</span>}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </section>

        <p className="auth-link">Não tem conta? <Link to="/">Cadastre-se</Link></p>
      </main>
    </div>
  );
}
