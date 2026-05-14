import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { buscarLembretes, salvarLembretes } from "../api";
import { useAuth } from "../context/AuthContext";
import "./Lembretes.css";

const TOGGLES = [
  { id: "email", label: "Lembretes por E-mail", desc: "Receba e-mails antes das consultas", icon: "📧", cor: "azul" },
  { id: "sms",   label: "Lembretes por SMS",    desc: "Receba mensagens de texto",          icon: "💬", cor: "verde" },
  { id: "push",  label: "Notificações Push",     desc: "Receba notificações no aplicativo",  icon: "🔔", cor: "roxo" },
];

const ANTECEDENCIAS = [
  { value: "1h",  label: "1 hora antes" },
  { value: "2h",  label: "2 horas antes" },
  { value: "1d",  label: "1 dia antes" },
  { value: "2d",  label: "2 dias antes" },
];

const LEMBRETES_FIXOS = [
  { id: "1", nome: "Dr. Maria Silva",  tag: "Cardiologia", data: "10/03/2026", hora: "14:30", tipo: "E-mail", icone: "📧" },
  { id: "2", nome: "Dr. João Santos",  tag: "Ortopedia",   data: "15/03/2026", hora: "10:00", tipo: "Notificação", icone: "🔔" },
];

export default function Lembretes() {
  const { usuario } = useAuth();
  const [prefs, setPrefs] = useState({ email: false, sms: false, push: false });
  const [antecedencias, setAntecedencias] = useState({ "1": "1d", "2": "2h" });
  const [ativos, setAtivos] = useState({ "1": true, "2": true });
  const [feedback, setFeedback] = useState(false);
  let feedbackTimer = null;

  useEffect(() => {
    buscarLembretes(usuario.email).then((dados) => {
      if (dados.prefs) setPrefs(dados.prefs);
      if (dados.antecedencias) setAntecedencias(dados.antecedencias);
      if (dados.ativos) setAtivos(dados.ativos);
    }).catch(console.error);
  }, [usuario.email]);

  async function salvar(novoPrefs, novoAntec, novoAtivos) {
    try {
      await salvarLembretes(usuario.email, { prefs: novoPrefs, antecedencias: novoAntec, ativos: novoAtivos });
      setFeedback(true);
      clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(() => setFeedback(false), 2500);
    } catch (e) { console.error(e); }
  }

  function togglePref(id) {
    const novo = { ...prefs, [id]: !prefs[id] };
    setPrefs(novo);
    salvar(novo, antecedencias, ativos);
  }

  function toggleAtivo(id) {
    const novo = { ...ativos, [id]: !ativos[id] };
    setAtivos(novo);
    salvar(prefs, antecedencias, novo);
  }

  function changeAntecedencia(id, val) {
    const novo = { ...antecedencias, [id]: val };
    setAntecedencias(novo);
    salvar(prefs, novo, ativos);
  }

  return (
    <div className="page">
      <Header />
      <main className="main">
        <section className="page-hero">
          <h2>Lembretes</h2>
          <p className="subtitle">Configure notificações para suas consultas</p>
        </section>

        {/* Configurações gerais */}
        <section className="lem-section">
          <article className="lem-card">
            <h3 className="lem-card-title">Configurações Gerais</h3>

            {TOGGLES.map(t => (
              <div key={t.id} className="lem-item">
                <div className="lem-left">
                  <span className={`lem-icon lem-icon--${t.cor}`}>{t.icon}</span>
                  <div>
                    <strong>{t.label}</strong>
                    <p>{t.desc}</p>
                  </div>
                </div>
                <label className="switch" aria-label={`Ativar ${t.label}`}>
                  <input
                    type="checkbox"
                    checked={!!prefs[t.id]}
                    onChange={() => togglePref(t.id)}
                  />
                  <span className="slider" />
                </label>
              </div>
            ))}

            {feedback && (
              <div className="lem-feedback" role="status" aria-live="polite">
                ✅ Configurações salvas!
              </div>
            )}
          </article>
        </section>

        {/* Lembretes ativos */}
        <section className="lem-section">
          <article className="lem-card">
            <h3 className="lem-card-title">
              Lembretes Ativos <span className="lem-contagem">({LEMBRETES_FIXOS.length})</span>
            </h3>

            {LEMBRETES_FIXOS.map(l => (
              <article key={l.id} className="reminder-card">
                <div className="reminder-header">
                  <div className="lem-left">
                    <span className="lem-icon lem-icon--azul">{l.icone}</span>
                    <div>
                      <strong>{l.nome}</strong>
                      <div className="lem-meta">
                        <span className="lem-tag">{l.tag}</span>
                        <time>{l.data} às {l.hora}</time>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="reminder-body">
                  <div className="lem-field">
                    <span>Tipo:</span>
                    <span className="lem-badge">{l.tipo}</span>
                  </div>
                  <div className="lem-field">
                    <label htmlFor={`ant-${l.id}`}>Avisar com:</label>
                    <select
                      id={`ant-${l.id}`}
                      value={antecedencias[l.id] || "1d"}
                      onChange={e => changeAntecedencia(l.id, e.target.value)}
                    >
                      {ANTECEDENCIAS.map(a => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="lem-field lem-field--switch">
                    <span>Ativo:</span>
                    <label className="switch switch--sm" aria-label={`Ativar lembrete ${l.nome}`}>
                      <input
                        type="checkbox"
                        checked={!!ativos[l.id]}
                        onChange={() => toggleAtivo(l.id)}
                      />
                      <span className="slider" />
                    </label>
                  </div>
                </div>
              </article>
            ))}
          </article>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 MedConsultas — Gestão de Saúde</p>
      </footer>
    </div>
  );
}
