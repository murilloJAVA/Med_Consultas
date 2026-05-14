import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cadastrar } from "../api";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Cadastro() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", telefone: "", senha: "", confirma: "" });
  const [hints, setHints] = useState({});
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmaVisivel, setConfirmaVisivel] = useState(false);

  function setHint(campo, msg) {
    setHints((h) => ({ ...h, [campo]: msg }));
  }

  function validar() {
    const novosHints = {};
    let valido = true;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telRe = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;

    if (!form.email) { novosHints.email = "O e-mail é obrigatório."; valido = false; }
    else if (!emailRe.test(form.email)) { novosHints.email = "Digite um e-mail válido."; valido = false; }

    if (form.telefone && !telRe.test(form.telefone)) {
      novosHints.telefone = "Formato esperado: (11) 99999-9999."; valido = false;
    }
    if (!form.senha) { novosHints.senha = "A senha é obrigatória."; valido = false; }
    else if (form.senha.length < 6) { novosHints.senha = "Mínimo 6 caracteres."; valido = false; }

    if (!form.confirma) { novosHints.confirma = "Confirme sua senha."; valido = false; }
    else if (form.senha !== form.confirma) { novosHints.confirma = "As senhas não coincidem."; valido = false; }

    setHints(novosHints);
    return valido;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    if (!validar()) return;

    setLoading(true);
    try {
      const res = await cadastrar({ email: form.email, telefone: form.telefone, senha: form.senha });
      login({ email: res.email });
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
          <h1>Criar conta</h1>
          <p className="auth-sub">Preencha os dados abaixo para se cadastrar</p>

          {erro && <div className="alerta alerta-erro" role="alert">{erro}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="campo">
              <label htmlFor="email">E-mail <span className="obrig">*</span></label>
              <input
                id="email" type="email" autoComplete="email"
                placeholder="seuemail@exemplo.com"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setHint("email", ""); }}
                aria-describedby="email-hint"
              />
              {hints.email && <span id="email-hint" className="hint">{hints.email}</span>}
            </div>

            <div className="campo">
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone" type="tel" autoComplete="tel"
                placeholder="(11) 99999-9999"
                value={form.telefone}
                onChange={(e) => { setForm({ ...form, telefone: e.target.value }); setHint("telefone", ""); }}
                aria-describedby="tel-hint"
              />
              {hints.telefone && <span id="tel-hint" className="hint">{hints.telefone}</span>}
            </div>

            <div className="campo">
              <label htmlFor="senha">Senha <span className="obrig">*</span></label>
              <div className="input-wrapper">
                <input
                  id="senha" type={senhaVisivel ? "text" : "password"} autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
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

            <div className="campo">
              <label htmlFor="confirma">Confirmar senha <span className="obrig">*</span></label>
              <div className="input-wrapper">
                <input
                  id="confirma" type={confirmaVisivel ? "text" : "password"} autoComplete="new-password"
                  placeholder="Repita a senha"
                  value={form.confirma}
                  onChange={(e) => { setForm({ ...form, confirma: e.target.value }); setHint("confirma", ""); }}
                />
                <button type="button" className="toggle-senha" onClick={() => setConfirmaVisivel((v) => !v)}
                  aria-label={confirmaVisivel ? "Ocultar confirmação" : "Mostrar confirmação"}>
                  {confirmaVisivel ? "🙈" : "👁"}
                </button>
              </div>
              {hints.confirma && <span className="hint">{hints.confirma}</span>}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
        </section>

        <p className="auth-link">Já tem conta? <Link to="/login">Entrar</Link></p>
      </main>
    </div>
  );
}
