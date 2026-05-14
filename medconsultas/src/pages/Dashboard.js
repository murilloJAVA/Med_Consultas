import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { listarConsultas } from "../api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function gerarCalendario(consultas) {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = agora.getMonth();
  const hoje = agora.getDate();
  const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();

  const diasComConsulta = new Set(
    consultas.filter(c => {
      const d = new Date(c.data + "T00:00:00");
      return d.getFullYear() === ano && d.getMonth() === mes;
    }).map(c => new Date(c.data + "T00:00:00").getDate())
  );

  return { ano, mes, hoje, primeiroDia, totalDias, meses, diasComConsulta };
}

export default function Dashboard() {
  const { usuario } = useAuth();
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarConsultas(usuario.email)
      .then(setConsultas)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [usuario.email]);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const futuras = consultas
    .filter(c => new Date(c.data + "T00:00:00") >= hoje)
    .sort((a, b) => new Date(a.data) - new Date(b.data));

  const proxima = futuras[0];
  const cal = gerarCalendario(consultas);

  function fmtData(d) {
    return new Date(d + "T00:00:00").toLocaleDateString("pt-BR");
  }

  return (
    <div className="page">
      <Header />
      <main className="main">
        <section className="page-hero">
          <h2>Gerenciamento de Consultas</h2>
          <p className="subtitle">Organize e acompanhe suas consultas médicas</p>
        </section>

        <section className="cards-row" aria-label="Resumo">
          <article className="card-stat">
            <span className="card-label">Consultas Agendadas</span>
            <h3 className="card-value">{loading ? "—" : futuras.length}</h3>
          </article>
          <article className="card-stat">
            <span className="card-label">Próxima Consulta</span>
            <h3 className="card-value card-value--next">
              {loading ? "—" : proxima
                ? `${proxima.nome} — ${fmtData(proxima.data)}`
                : "Nenhuma agendada"}
            </h3>
          </article>
        </section>

        <section className="grid-dash">
          {/* Calendário */}
          <article className="calendar-card">
            <h3>{cal.meses[cal.mes]} de {cal.ano}</h3>
            <div className="cal-grid">
              {["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(d =>
                <span key={d} className="cal-header">{d}</span>
              )}
              {Array.from({ length: cal.primeiroDia }, (_, i) =>
                <span key={`v${i}`} />
              )}
              {Array.from({ length: cal.totalDias }, (_, i) => {
                const d = i + 1;
                return (
                  <span
                    key={d}
                    className={`cal-day${d === cal.hoje ? " cal-today" : ""}${cal.diasComConsulta.has(d) ? " cal-has-consulta" : ""}`}
                    title={cal.diasComConsulta.has(d) ? "Consulta agendada" : undefined}
                  >
                    {d}
                  </span>
                );
              })}
            </div>
          </article>

          {/* Próximas consultas */}
          <article className="proximas-card">
            <h3>Próximas consultas</h3>
            {loading ? (
              <p className="texto-vazio">Carregando...</p>
            ) : futuras.length === 0 ? (
              <p className="texto-vazio">
                Nenhuma consulta agendada. <Link to="/consultas">Agende agora →</Link>
              </p>
            ) : (
              <div className="lista-resumo">
                {futuras.slice(0, 4).map(c => (
                  <div key={c.id} className="item-consulta">
                    <div className="item-icone">📅</div>
                    <div>
                      <strong>{c.nome}</strong>
                      <p>{fmtData(c.data)}{c.hora ? ` às ${c.hora}` : ""}</p>
                      {c.local && <p className="item-local">📍 {c.local}</p>}
                    </div>
                  </div>
                ))}
                {futuras.length > 4 && (
                  <Link to="/consultas" className="ver-mais">Ver todas ({futuras.length}) →</Link>
                )}
              </div>
            )}
          </article>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 MedConsultas — Gestão de Saúde</p>
      </footer>
    </div>
  );
}
