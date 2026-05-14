import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { listarConsultas, criarConsulta, excluirConsulta } from "../api";
import { useAuth } from "../context/AuthContext";
import "./Consultas.css";

export default function Consultas() {
  const { usuario } = useAuth();
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formAberto, setFormAberto] = useState(false);
  const [form, setForm] = useState({ nome: "", data: "", hora: "", local: "" });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    try {
      const data = await listarConsultas(usuario.email);
      setConsultas(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  function validar() {
    if (!form.nome.trim()) { setErro("Por favor, informe a especialidade médica."); return false; }
    if (!form.data) { setErro("Por favor, informe a data da consulta."); return false; }
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    if (new Date(form.data + "T00:00:00") < hoje) { setErro("A data não pode ser no passado."); return false; }
    if (!form.hora) { setErro("Por favor, informe o horário."); return false; }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(""); setSucesso("");
    if (!validar()) return;

    setSalvando(true);
    try {
      await criarConsulta({ email: usuario.email, ...form });
      setSucesso("Consulta salva com sucesso!");
      setForm({ nome: "", data: "", hora: "", local: "" });
      await carregar();
      setTimeout(() => { setSucesso(""); setFormAberto(false); }, 2000);
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(id, nome) {
    if (!window.confirm(`Deseja excluir a consulta de ${nome}?\nEsta ação não pode ser desfeita.`)) return;
    try {
      await excluirConsulta(id);
      await carregar();
    } catch (err) {
      alert(err.message);
    }
  }

  function fmtData(d) {
    return new Date(d + "T00:00:00").toLocaleDateString("pt-BR");
  }

  return (
    <div className="page">
      <Header />
      <main className="main">
        <section className="page-top">
          <div>
            <h2>Consultas</h2>
            <p className="subtitle">Gerencie seus agendamentos médicos</p>
          </div>
          <button
            className="btn-novo"
            onClick={() => { setFormAberto((v) => !v); setErro(""); setSucesso(""); }}
            aria-expanded={formAberto}
          >
            {formAberto ? "✕ Fechar" : "+ Nova consulta"}
          </button>
        </section>

        {/* Formulário */}
        {formAberto && (
          <section className="form-section">
            <article className="form-card">
              <h3>Nova Consulta</h3>

              {erro && <div className="alerta alerta-erro">{erro}</div>}
              {sucesso && <div className="alerta alerta-sucesso">{sucesso}</div>}

              <form onSubmit={handleSubmit} noValidate>
                <div className="campo">
                  <label htmlFor="nome">Especialidade <span className="obrig">*</span></label>
                  <input id="nome" type="text" placeholder="Ex: Cardiologista, Ortopedista..."
                    value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
                </div>

                <div className="form-row">
                  <div className="campo">
                    <label htmlFor="data">Data <span className="obrig">*</span></label>
                    <input id="data" type="date"
                      value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} />
                  </div>
                  <div className="campo">
                    <label htmlFor="hora">Horário <span className="obrig">*</span></label>
                    <input id="hora" type="time"
                      value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} />
                  </div>
                </div>

                <div className="campo">
                  <label htmlFor="local">Local</label>
                  <input id="local" type="text" placeholder="Ex: Hospital São Lucas, Clínica Vida..."
                    value={form.local} onChange={e => setForm({ ...form, local: e.target.value })} />
                </div>

                <div className="form-acoes">
                  <button type="button" className="btn-cancelar"
                    onClick={() => { setFormAberto(false); setErro(""); setSucesso(""); }}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-salvar" disabled={salvando}>
                    {salvando ? "Salvando..." : "Salvar consulta"}
                  </button>
                </div>
              </form>
            </article>
          </section>
        )}

        {/* Lista */}
        <section className="lista-section">
          <h3>📅 Consultas Agendadas</h3>

          {loading ? (
            <p className="texto-vazio">Carregando...</p>
          ) : consultas.length === 0 ? (
            <p className="texto-vazio">
              Nenhuma consulta agendada. Clique em "+ Nova consulta" para começar.
            </p>
          ) : (
            <div className="lista-grid">
              {consultas.map(c => (
                <article key={c.id} className="consulta-card">
                  <div className="consulta-info">
                    <h4>{c.nome}</h4>
                    <p>📅 <time dateTime={c.data}>{fmtData(c.data)}</time></p>
                    <p>⏰ {c.hora || "Horário não informado"}</p>
                    {c.local && <p>📍 {c.local}</p>}
                  </div>
                  <button
                    className="btn-excluir"
                    onClick={() => handleExcluir(c.id, c.nome)}
                    aria-label={`Excluir consulta: ${c.nome}`}
                    title="Excluir consulta"
                  >
                    🗑️
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 MedConsultas — Gestão de Saúde</p>
      </footer>
    </div>
  );
}
